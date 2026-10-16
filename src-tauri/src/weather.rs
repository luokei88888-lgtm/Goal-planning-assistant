//! 天气：Open-Meteo（免 Key）。forecast + air-quality + geocoding；30 分钟缓存，离线回退缓存。

use std::time::Duration;

use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::chat::{get_setting, set_setting};
use crate::service::e;

type R<T> = Result<T, String>;

pub const CACHE_SECS: i64 = 30 * 60;
const FORECAST: &str = "https://api.open-meteo.com/v1/forecast";
const AIR: &str = "https://air-quality-api.open-meteo.com/v1/air-quality";
const GEO: &str = "https://geocoding-api.open-meteo.com/v1/search";

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct City {
    pub name: String,
    #[serde(default)]
    pub admin: String,
    #[serde(default)]
    pub country: String,
    pub latitude: f64,
    pub longitude: f64,
}

impl City {
    pub fn beijing() -> City {
        City { name: "北京".into(), admin: "北京市".into(), country: "中国".into(), latitude: 39.9042, longitude: 116.4074 }
    }
    fn key(&self) -> String {
        format!("{:.3},{:.3}", self.latitude, self.longitude)
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WeatherSettings {
    pub enabled: bool,
    pub city: City,
}

pub fn get_settings(conn: &Connection) -> R<WeatherSettings> {
    let enabled = get_setting(conn, "weather_enabled")?.map(|v| v != "0").unwrap_or(true);
    let city = get_setting(conn, "weather_city")?.and_then(|s| serde_json::from_str(&s).ok()).unwrap_or_else(City::beijing);
    Ok(WeatherSettings { enabled, city })
}

pub fn save_settings(conn: &Connection, s: &WeatherSettings) -> R<WeatherSettings> {
    if !(-90.0..=90.0).contains(&s.city.latitude) || !(-180.0..=180.0).contains(&s.city.longitude) || s.city.name.trim().is_empty() {
        return Err("城市信息不正确".into());
    }
    set_setting(conn, "weather_enabled", if s.enabled { "1" } else { "0" })?;
    set_setting(conn, "weather_city", &serde_json::to_string(&s.city).map_err(|x| x.to_string())?)?;
    get_settings(conn)
}

/// WMO 天气代码 → (中文, Lucide 图标名)
pub fn wmo(code: i64, is_day: bool) -> (&'static str, &'static str) {
    match code {
        0 => ("晴", if is_day { "Sun" } else { "Moon" }),
        1 => ("晴间少云", if is_day { "Sun" } else { "Moon" }),
        2 => ("多云", if is_day { "CloudSun" } else { "CloudMoon" }),
        3 => ("阴", "Cloud"),
        45 | 48 => ("雾", "CloudFog"),
        51 => ("小毛毛雨", "CloudDrizzle"),
        53 => ("毛毛雨", "CloudDrizzle"),
        55 => ("大毛毛雨", "CloudDrizzle"),
        56 | 57 => ("冻毛毛雨", "CloudDrizzle"),
        61 => ("小雨", "CloudRain"),
        63 => ("中雨", "CloudRain"),
        65 => ("大雨", "CloudRain"),
        66 | 67 => ("冻雨", "CloudHail"),
        71 => ("小雪", "CloudSnow"),
        73 => ("中雪", "CloudSnow"),
        75 => ("大雪", "Snowflake"),
        77 => ("米雪", "Snowflake"),
        80 => ("小阵雨", "CloudRainWind"),
        81 => ("阵雨", "CloudRainWind"),
        82 => ("强阵雨", "CloudRainWind"),
        85 => ("小阵雪", "CloudSnow"),
        86 => ("大阵雪", "CloudSnow"),
        95 => ("雷阵雨", "CloudLightning"),
        96 | 99 => ("雷阵雨伴冰雹", "CloudLightning"),
        _ => ("未知", "Cloud"),
    }
}

fn is_rain(c: i64) -> bool {
    matches!(c, 51..=67 | 80..=82 | 95..=99)
}
fn is_snow(c: i64) -> bool {
    matches!(c, 71..=77 | 85 | 86)
}

/// 国标 HJ 633-2012 六级：返回（等级，色阶 1～6）
pub fn aqi_level(aqi: i64) -> (&'static str, u8) {
    match aqi {
        i64::MIN..=50 => ("优", 1),
        51..=100 => ("良", 2),
        101..=150 => ("轻度污染", 3),
        151..=200 => ("中度污染", 4),
        201..=300 => ("重度污染", 5),
        _ => ("严重污染", 6),
    }
}

/// IAQI 分段：0 50 100 150 200 300 400 500
const IAQI: [f64; 8] = [0.0, 50.0, 100.0, 150.0, 200.0, 300.0, 400.0, 500.0];
// HJ 633-2012 表 1 浓度限值（μg/m³，CO 为 mg/m³）
const SO2_1H: [f64; 5] = [0.0, 150.0, 500.0, 650.0, 800.0];
const SO2_24H: [f64; 8] = [0.0, 50.0, 150.0, 475.0, 800.0, 1600.0, 2100.0, 2620.0];
const NO2_1H: [f64; 8] = [0.0, 100.0, 200.0, 700.0, 1200.0, 2340.0, 3090.0, 3840.0];
const CO_1H: [f64; 8] = [0.0, 5.0, 10.0, 35.0, 60.0, 90.0, 120.0, 150.0];
const O3_1H: [f64; 8] = [0.0, 160.0, 200.0, 300.0, 400.0, 800.0, 1000.0, 1200.0];
// 实时发布惯例：PM 用小时浓度套 24 小时限值
const PM10_24H: [f64; 8] = [0.0, 50.0, 150.0, 250.0, 350.0, 420.0, 500.0, 600.0];
const PM25_24H: [f64; 8] = [0.0, 35.0, 75.0, 115.0, 150.0, 250.0, 350.0, 500.0];

/// 分段线性插值，结果向上取整；超过最高限值按 500
fn iaqi_with(bp: &[f64], c: f64) -> i64 {
    if !c.is_finite() || c <= 0.0 {
        return 0;
    }
    for i in 1..bp.len() {
        if c <= bp[i] {
            let v = (IAQI[i] - IAQI[i - 1]) / (bp[i] - bp[i - 1]) * (c - bp[i - 1]) + IAQI[i - 1];
            return (v - 1e-9).ceil() as i64;
        }
    }
    500
}

/// 各污染物小时浓度（μg/m³；co 也是 μg/m³，内部换算 mg/m³）
#[derive(Debug, Default, Clone, Copy)]
pub struct Conc {
    pub pm2_5: Option<f64>,
    pub pm10: Option<f64>,
    pub no2: Option<f64>,
    pub o3: Option<f64>,
    pub so2: Option<f64>,
    pub co: Option<f64>,
}

/// 返回（AQI，首要污染物列表）；一项浓度都没有时 None
pub fn cn_aqi(c: &Conc) -> Option<(i64, Vec<&'static str>)> {
    let so2 = c.so2.map(|v| if v > 800.0 { iaqi_with(&SO2_24H, v) } else { iaqi_with(&SO2_1H, v) });
    let items = [
        ("PM2.5", c.pm2_5.map(|v| iaqi_with(&PM25_24H, v))),
        ("PM10", c.pm10.map(|v| iaqi_with(&PM10_24H, v))),
        ("O₃", c.o3.map(|v| iaqi_with(&O3_1H, v))),
        ("NO₂", c.no2.map(|v| iaqi_with(&NO2_1H, v))),
        ("SO₂", so2),
        ("CO", c.co.map(|v| iaqi_with(&CO_1H, v / 1000.0))),
    ];
    let max = items.iter().filter_map(|(_, v)| *v).max()?;
    let primary = if max > 50 { items.iter().filter(|(_, v)| *v == Some(max)).map(|(n, _)| *n).collect() } else { Vec::new() };
    Some((max, primary))
}

pub const AIR_VARS: &str = "pm2_5,pm10,nitrogen_dioxide,ozone,sulphur_dioxide,carbon_monoxide";

fn conc_from(get: impl Fn(&str) -> Option<f64>) -> Conc {
    Conc { pm2_5: get("pm2_5"), pm10: get("pm10"), no2: get("nitrogen_dioxide"), o3: get("ozone"), so2: get("sulphur_dioxide"), co: get("carbon_monoxide") }
}

fn wind_dir(deg: f64) -> &'static str {
    const D: [&str; 8] = ["北风", "东北风", "东风", "东南风", "南风", "西南风", "西风", "西北风"];
    D[(((deg % 360.0) + 22.5) / 45.0) as usize % 8]
}

/// 蒲福风级（km/h）
fn wind_level(kmh: f64) -> i64 {
    const T: [f64; 12] = [1.0, 6.0, 12.0, 20.0, 29.0, 39.0, 50.0, 62.0, 75.0, 89.0, 103.0, 118.0];
    T.iter().position(|t| kmh < *t).unwrap_or(12) as i64
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Current {
    pub time: String,
    pub temp: f64,
    pub feels: f64,
    pub code: i64,
    pub text: String,
    pub icon: String,
    pub humidity: f64,
    pub wind_kmh: f64,
    pub wind_level: i64,
    pub wind_dir: String,
    pub is_day: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Today {
    pub max: f64,
    pub min: f64,
    pub precip_max: i64,
    pub code: i64,
    pub text: String,
    pub sunrise: String,
    pub sunset: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Hour {
    pub time: String,
    pub temp: f64,
    pub code: i64,
    pub text: String,
    pub icon: String,
    pub precip: i64,
    /// 该小时的国标 AQI（有空气质量数据时）
    #[serde(default)]
    pub aqi: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Aqi {
    /// 国标 HJ 633-2012 实时 AQI（按小时浓度计算）
    pub aqi: i64,
    pub level: String,
    /// 色阶 1～6（优～严重污染）
    pub tone: u8,
    /// 首要污染物，AQI>50 时才有
    pub primary: Vec<String>,
    pub pm2_5: Option<f64>,
}

impl Aqi {
    pub fn from_conc(c: &Conc) -> Option<Aqi> {
        let (v, p) = cn_aqi(c)?;
        let (level, tone) = aqi_level(v);
        Some(Aqi { aqi: v, level: level.into(), tone, primary: p.into_iter().map(String::from).collect(), pm2_5: c.pm2_5 })
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Weather {
    pub city: City,
    pub fetched_at: i64,
    pub current: Current,
    pub today: Today,
    pub hourly: Vec<Hour>,
    pub aqi: Option<Aqi>,
    pub tip: String,
    /// 用的是过期缓存（离线/请求失败）
    #[serde(default)]
    pub stale: bool,
    #[serde(default)]
    pub error: Option<String>,
}

fn f(v: &Value, k: &str) -> R<f64> {
    v.get(k).and_then(Value::as_f64).ok_or_else(|| format!("天气数据缺少 {k}"))
}
fn hm(t: &str) -> String {
    t.get(11..16).unwrap_or(t).to_string()
}

/// 逐小时空气质量：按时间（YYYY-MM-DDTHH:00）对齐，用同一套国标算法
fn hour_aqi(air: Option<&Value>, time: &str) -> Option<i64> {
    let h = air?.get("hourly")?;
    let idx = h.get("time")?.as_array()?.iter().position(|t| t.as_str() == Some(time))?;
    let c = conc_from(|k| h.get(k)?.as_array()?.get(idx)?.as_f64());
    cn_aqi(&c).map(|(v, _)| v)
}

/// 解析 forecast（+可选 air-quality）JSON
pub fn parse(fc: &Value, air: Option<&Value>, city: &City, now: i64) -> R<Weather> {
    let c = fc.get("current").ok_or("天气数据缺少 current")?;
    let is_day = c.get("is_day").and_then(Value::as_i64).unwrap_or(1) == 1;
    let code = f(c, "weather_code")? as i64;
    let (text, icon) = wmo(code, is_day);
    let wind = f(c, "wind_speed_10m").unwrap_or(0.0);
    let time = c.get("time").and_then(Value::as_str).unwrap_or("").to_string();
    let current = Current {
        temp: f(c, "temperature_2m")?,
        feels: f(c, "apparent_temperature").unwrap_or(f(c, "temperature_2m")?),
        code,
        text: text.into(),
        icon: icon.into(),
        humidity: f(c, "relative_humidity_2m").unwrap_or(0.0),
        wind_kmh: wind,
        wind_level: wind_level(wind),
        wind_dir: wind_dir(f(c, "wind_direction_10m").unwrap_or(0.0)).into(),
        is_day,
        time: time.clone(),
    };
    let d = fc.get("daily").ok_or("天气数据缺少 daily")?;
    let at0 = |k: &str| d.get(k).and_then(|a| a.get(0)).cloned().unwrap_or(Value::Null);
    let dcode = at0("weather_code").as_i64().unwrap_or(code);
    let today = Today {
        max: at0("temperature_2m_max").as_f64().ok_or("天气数据缺少最高温")?,
        min: at0("temperature_2m_min").as_f64().ok_or("天气数据缺少最低温")?,
        precip_max: at0("precipitation_probability_max").as_i64().unwrap_or(0),
        code: dcode,
        text: wmo(dcode, true).0.into(),
        sunrise: hm(at0("sunrise").as_str().unwrap_or("")),
        sunset: hm(at0("sunset").as_str().unwrap_or("")),
    };
    let h = fc.get("hourly").ok_or("天气数据缺少 hourly")?;
    let arr = |k: &str| h.get(k).and_then(Value::as_array).cloned().unwrap_or_default();
    let (times, temps, codes, pp) = (arr("time"), arr("temperature_2m"), arr("weather_code"), arr("precipitation_probability"));
    let cur_hour = format!("{}:00", time.get(..13).unwrap_or(""));
    let start = times.iter().position(|t| t.as_str().is_some_and(|t| t >= cur_hour.as_str())).unwrap_or(0);
    let sr = today.sunrise.clone();
    let ss = today.sunset.clone();
    let hourly = (start..times.len().min(start + 12))
        .map(|i| {
            let t = hm(times[i].as_str().unwrap_or(""));
            let code = codes.get(i).and_then(Value::as_i64).unwrap_or(0);
            let day = sr.is_empty() || (t >= sr && t < ss);
            let (text, icon) = wmo(code, day);
            let full = times[i].as_str().unwrap_or("");
            Hour { time: t, temp: temps.get(i).and_then(Value::as_f64).unwrap_or(0.0), code, text: text.into(), icon: icon.into(), precip: pp.get(i).and_then(Value::as_i64).unwrap_or(0), aqi: hour_aqi(air, full) }
        })
        .collect::<Vec<_>>();
    let aqi = air.and_then(|a| a.get("current")).and_then(|c| Aqi::from_conc(&conc_from(|k| c.get(k).and_then(Value::as_f64))));
    let mut w = Weather { city: city.clone(), fetched_at: now, current, today, hourly, aqi, tip: String::new(), stale: false, error: None };
    w.tip = tip(&w);
    Ok(w)
}

/// 规则生成的贴心提示（最多两句）
pub fn tip(w: &Weather) -> String {
    let mut t: Vec<String> = Vec::new();
    let c = &w.current;
    let next_rain = w.hourly.iter().take(6).filter(|h| is_rain(h.code) || h.precip >= 60).map(|h| h.precip).max();
    if matches!(c.code, 95..=99) || w.hourly.iter().take(6).any(|h| matches!(h.code, 95..=99)) {
        t.push("有雷阵雨，尽量减少户外活动，出门带伞".into());
    } else if is_rain(c.code) {
        t.push("正在下雨，出门记得带伞，通勤路上注意路滑".into());
    } else if let Some(p) = next_rain {
        t.push(format!("未来几小时可能下雨（{p}%），出门带把伞"));
    } else if w.today.precip_max >= 50 {
        t.push(format!("今天降水概率 {}%，出门记得带伞", w.today.precip_max));
    } else if w.today.precip_max >= 30 {
        t.push(format!("今天有 {}% 的概率下雨，包里备把伞", w.today.precip_max));
    }
    if is_snow(c.code) || is_snow(w.today.code) {
        t.push("有雪，路面湿滑，通勤预留时间".into());
    }
    if let Some(a) = &w.aqi {
        if a.aqi > 150 {
            t.push(format!("空气{}（AQI {}），减少户外运动，出门戴口罩", a.level, a.aqi));
        } else if a.aqi > 100 {
            t.push(format!("空气{}（AQI {}），敏感人群减少户外运动", a.level, a.aqi));
        }
    }
    if c.wind_level >= 6 {
        t.push(format!("{}{}级，注意防风，远离广告牌", c.wind_dir, c.wind_level));
    }
    if w.today.max >= 33.0 {
        t.push(format!("最高 {:.0}°，注意防暑多喝水", w.today.max));
    } else if c.feels <= 0.0 {
        t.push(format!("体感 {:.0}°，注意保暖", c.feels));
    } else if w.today.max - w.today.min >= 10.0 {
        t.push(format!("早晚温差 {:.0}°，注意加减衣物", w.today.max - w.today.min));
    }
    t.truncate(2);
    if t.is_empty() {
        let good = w.aqi.as_ref().is_none_or(|a| a.aqi <= 100);
        return if good { "天气不错，适合按计划完成今天的目标".into() } else { "天气平稳，按计划进行就好".into() };
    }
    t.join("；")
}

/// 缓存是否可直接用：同一城市、30 分钟内
pub fn is_fresh(fetched_at: i64, cache_city: &str, city: &City, now: i64) -> bool {
    cache_city == city.key() && now >= fetched_at && now - fetched_at < CACHE_SECS
}

fn load_cache(conn: &Connection) -> R<Option<(String, Weather)>> {
    let r: Option<(String, String)> = conn
        .query_row("SELECT city_key, data FROM weather_cache WHERE id=1", [], |r| Ok((r.get(0)?, r.get(1)?)))
        .optional()
        .map_err(e)?;
    Ok(r.and_then(|(k, d)| serde_json::from_str(&d).ok().map(|w| (k, w))))
}

fn store_cache(conn: &Connection, w: &Weather) -> R<()> {
    conn.execute(
        "INSERT INTO weather_cache (id, city_key, fetched_at, data) VALUES (1, ?1, ?2, ?3)
         ON CONFLICT(id) DO UPDATE SET city_key=excluded.city_key, fetched_at=excluded.fetched_at, data=excluded.data",
        params![w.city.key(), w.fetched_at, serde_json::to_string(w).map_err(|x| x.to_string())?],
    )
    .map_err(e)?;
    Ok(())
}

/// 先看缓存：返回 Ok(Some) 表示可以直接用
pub fn cached(conn: &Connection, city: &City, now: i64, force: bool) -> R<Option<Weather>> {
    if force {
        return Ok(None);
    }
    Ok(load_cache(conn)?.filter(|(k, w)| is_fresh(w.fetched_at, k, city, now)).map(|(_, w)| w))
}

/// 请求失败时的回退：同城市旧缓存（标记 stale）
pub fn fallback(conn: &Connection, city: &City, err: String) -> R<Weather> {
    match load_cache(conn)? {
        Some((k, mut w)) if k == city.key() => {
            w.stale = true;
            w.error = Some(err);
            Ok(w)
        }
        _ => Err(err),
    }
}

pub fn save(conn: &Connection, w: &Weather) -> R<()> {
    store_cache(conn, w)
}

fn client() -> R<reqwest::Client> {
    reqwest::Client::builder()
        .timeout(Duration::from_secs(12))
        .connect_timeout(Duration::from_secs(6))
        .build()
        .map_err(|x| x.to_string())
}

async fn get_json(c: &reqwest::Client, url: &str, q: &[(&str, String)]) -> R<Value> {
    let r = c.get(url).query(q).send().await.map_err(|x| if x.is_timeout() { "天气服务响应超时".to_string() } else { "网络不可用，无法获取天气".to_string() })?;
    if !r.status().is_success() {
        return Err(format!("天气服务返回错误（HTTP {}）", r.status().as_u16()));
    }
    r.json::<Value>().await.map_err(|_| "天气数据格式不对".to_string())
}

pub async fn fetch(city: &City, now: i64) -> R<Weather> {
    let c = client()?;
    let ll = vec![("latitude", format!("{:.4}", city.latitude)), ("longitude", format!("{:.4}", city.longitude)), ("timezone", "Asia/Shanghai".to_string())];
    let mut fq = ll.clone();
    fq.extend([
        ("current", "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day".to_string()),
        ("hourly", "temperature_2m,weather_code,precipitation_probability".to_string()),
        ("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset".to_string()),
        ("forecast_days", "2".to_string()),
        ("wind_speed_unit", "kmh".to_string()),
    ]);
    let mut aq = ll;
    aq.extend([("current", AIR_VARS.to_string()), ("hourly", AIR_VARS.to_string()), ("forecast_days", "2".to_string())]);
    let (fc, air) = tokio::join!(get_json(&c, FORECAST, &fq), get_json(&c, AIR, &aq));
    let fc = fc?;
    parse(&fc, air.ok().as_ref(), city, now)
}

pub async fn search_city(name: &str) -> R<Vec<City>> {
    let name = name.trim();
    if name.is_empty() {
        return Ok(vec![]);
    }
    let v = get_json(&client()?, GEO, &[("name", name.to_string()), ("count", "10".into()), ("language", "zh".into()), ("format", "json".into())])
        .await
        .map_err(|m| m.replace("天气", "城市搜索"))?;
    Ok(parse_cities(&v))
}

pub fn parse_cities(v: &Value) -> Vec<City> {
    v.get("results")
        .and_then(Value::as_array)
        .map(|a| {
            a.iter()
                .filter_map(|r| {
                    let admin = [r.get("admin1"), r.get("admin2")]
                        .iter()
                        .filter_map(|x| x.and_then(Value::as_str))
                        .collect::<Vec<_>>()
                        .join(" · ");
                    Some(City {
                        name: r.get("name")?.as_str()?.to_string(),
                        admin,
                        country: r.get("country").and_then(Value::as_str).unwrap_or("").to_string(),
                        latitude: r.get("latitude")?.as_f64()?,
                        longitude: r.get("longitude")?.as_f64()?,
                    })
                })
                .collect()
        })
        .unwrap_or_default()
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    fn sample() -> Value {
        json!({
            "timezone": "Asia/Shanghai",
            "current": {"time": "2026-10-15T10:00", "temperature_2m": 18.9, "apparent_temperature": 17.3, "relative_humidity_2m": 36,
                        "weather_code": 0, "wind_speed_10m": 0.3, "wind_direction_10m": 225, "is_day": 1},
            "hourly": {"time": ["2026-10-15T08:00", "2026-10-15T09:00", "2026-10-15T10:00", "2026-10-15T11:00", "2026-10-15T19:00"],
                       "temperature_2m": [12.0, 15.0, 18.9, 20.1, 14.0], "weather_code": [1, 1, 0, 2, 3], "precipitation_probability": [0, 0, 0, 10, 20]},
            "daily": {"time": ["2026-10-15"], "weather_code": [2], "temperature_2m_max": [22.4], "temperature_2m_min": [9.1],
                      "precipitation_probability_max": [20], "sunrise": ["2026-10-15T06:22"], "sunset": ["2026-10-15T17:39"]}
        })
    }

    #[test]
    fn wmo_mapping() {
        assert_eq!(wmo(0, true), ("晴", "Sun"));
        assert_eq!(wmo(0, false).1, "Moon");
        assert_eq!(wmo(3, true).0, "阴");
        assert_eq!(wmo(63, true), ("中雨", "CloudRain"));
        assert_eq!(wmo(95, true).1, "CloudLightning");
        assert_eq!(wmo(75, true).0, "大雪");
        assert_eq!(wmo(1234, true).0, "未知");
        assert_eq!((aqi_level(42).0, aqi_level(120).0, aqi_level(190).0, aqi_level(400).0), ("优", "轻度污染", "中度污染", "严重污染"));
        assert_eq!((aqi_level(50), aqi_level(51), aqi_level(300), aqi_level(301)), (("优", 1), ("良", 2), ("重度污染", 5), ("严重污染", 6)));
        assert_eq!((wind_dir(225.0), wind_dir(350.0), wind_level(0.3), wind_level(40.0)), ("西南风", "北风", 0, 6));
    }

    #[test]
    fn parse_sample() {
        // PM2.5 140 → IAQI 186（中度污染）
        let air = json!({"current": {"time": "2026-10-15T10:00", "pm2_5": 140.0, "pm10": 150.0, "nitrogen_dioxide": 40.0, "ozone": 30.0, "sulphur_dioxide": 5.0, "carbon_monoxide": 800.0},
                         "hourly": {"time": ["2026-10-15T10:00", "2026-10-15T11:00"], "pm2_5": [140.0, 20.7], "pm10": [150.0, 22.5], "nitrogen_dioxide": [40.0, 43.0],
                                    "ozone": [30.0, 23.0], "sulphur_dioxide": [5.0, 8.6], "carbon_monoxide": [800.0, 702.0]}});
        let w = parse(&sample(), Some(&air), &City::beijing(), 1000).unwrap();
        assert_eq!((w.current.temp, w.current.text.as_str(), w.current.humidity), (18.9, "晴", 36.0));
        assert_eq!((w.today.max, w.today.min, w.today.precip_max), (22.4, 9.1, 20));
        assert_eq!((w.today.sunrise.as_str(), w.today.sunset.as_str()), ("06:22", "17:39"));
        assert_eq!(w.hourly.len(), 3, "从当前小时开始");
        assert_eq!(w.hourly[0].time, "10:00");
        assert_eq!((w.hourly[1].icon.as_str(), w.hourly[2].icon.as_str()), ("CloudSun", "Cloud"));
        let a = w.aqi.as_ref().unwrap();
        assert_eq!((a.aqi, a.level.as_str(), a.tone), (186, "中度污染", 4));
        assert_eq!(a.primary, ["PM2.5"]);
        assert!(w.tip.contains("AQI 186") && w.tip.contains("温差"), "{}", w.tip);
        assert_eq!((w.hourly[0].aqi, w.hourly[1].aqi, w.hourly[2].aqi), (Some(186), Some(30), None));
        // 没有空气质量也能用
        let w = parse(&sample(), None, &City::beijing(), 1000).unwrap();
        assert!(w.aqi.is_none());
        assert!(parse(&json!({"current": {}}), None, &City::beijing(), 0).is_err());
        let cities = parse_cities(&json!({"results": [{"name": "北京", "latitude": 39.9, "longitude": 116.4, "country": "中国", "admin1": "北京市"}, {"name": "坏"}]}));
        assert_eq!((cities.len(), cities[0].admin.as_str()), (1, "北京市"));
        assert!(parse_cities(&json!({})).is_empty());
    }

    #[test]
    fn tip_rules() {
        let base = parse(&sample(), None, &City::beijing(), 0).unwrap();
        let mut w = base.clone();
        w.today.min = 15.0;
        assert_eq!(tip(&w), "天气不错，适合按计划完成今天的目标");
        w.today.precip_max = 70;
        assert!(tip(&w).contains("带伞"));
        let mut w = base.clone();
        w.current.code = 63;
        assert!(tip(&w).starts_with("正在下雨"));
        w.current.code = 95;
        assert!(tip(&w).contains("雷阵雨"));
        let mut w = base.clone();
        w.today.min = 15.0;
        w.aqi = Some(Aqi { aqi: 120, pm2_5: None, level: "轻度污染".into(), tone: 3, primary: vec!["PM2.5".into()] });
        assert!(tip(&w).contains("敏感人群"));
        w.current.feels = -3.0;
        w.today.max = 2.0;
        w.today.min = -5.0;
        assert!(tip(&w).contains("保暖"));
        w.today.max = 35.0;
        assert!(tip(&w).contains("防暑"));
        let mut w = base;
        w.current.wind_level = 7;
        w.current.wind_dir = "北风".into();
        assert!(tip(&w).contains("北风7级"));
    }

    #[test]
    fn cache_logic() {
        let bj = City::beijing();
        let k = bj.key();
        assert!(is_fresh(1000, &k, &bj, 1000 + CACHE_SECS - 1));
        assert!(!is_fresh(1000, &k, &bj, 1000 + CACHE_SECS));
        assert!(!is_fresh(1000, "0.000,0.000", &bj, 1001), "换城市要重新请求");
        assert!(!is_fresh(1000, &k, &bj, 999), "时钟回拨不算新鲜");

        let c = Connection::open_in_memory().unwrap();
        crate::db::migrate(&c).unwrap();
        assert!(cached(&c, &bj, 0, false).unwrap().is_none());
        assert!(fallback(&c, &bj, "网络不可用".into()).is_err());
        let w = parse(&sample(), None, &bj, 5000).unwrap();
        save(&c, &w).unwrap();
        assert!(cached(&c, &bj, 5000 + 60, false).unwrap().is_some());
        assert!(cached(&c, &bj, 5000 + 60, true).unwrap().is_none(), "手动刷新跳过缓存");
        assert!(cached(&c, &bj, 5000 + CACHE_SECS + 1, false).unwrap().is_none());
        let s = fallback(&c, &bj, "网络不可用".into()).unwrap();
        assert!(s.stale && s.error.is_some() && s.current.temp == 18.9);
        let sh = City { name: "上海".into(), admin: String::new(), country: String::new(), latitude: 31.23, longitude: 121.47 };
        assert!(fallback(&c, &sh, "x".into()).is_err(), "别的城市的缓存不能冒用");

        // 设置：默认北京开启；存取；恢复出厂清掉缓存和设置
        let st = get_settings(&c).unwrap();
        assert!(st.enabled && st.city.name == "北京");
        save_settings(&c, &WeatherSettings { enabled: false, city: sh.clone() }).unwrap();
        let st = get_settings(&c).unwrap();
        assert!(!st.enabled && st.city == sh);
        assert!(save_settings(&c, &WeatherSettings { enabled: true, city: City { latitude: 200.0, ..sh } }).is_err());
        let mut c = c;
        crate::service::factory_reset(&mut c).unwrap();
        assert!(get_settings(&c).unwrap().enabled);
        assert!(fallback(&c, &bj, "x".into()).is_err());
    }

    #[test]
    fn cn_aqi_breakpoints() {
        // 分段边界正好落在 IAQI 节点
        assert_eq!((iaqi_with(&PM25_24H, 35.0), iaqi_with(&PM25_24H, 75.0), iaqi_with(&PM25_24H, 115.0), iaqi_with(&PM25_24H, 150.0)), (50, 100, 150, 200));
        assert_eq!((iaqi_with(&PM25_24H, 250.0), iaqi_with(&PM25_24H, 500.0), iaqi_with(&PM25_24H, 900.0)), (300, 500, 500));
        assert_eq!((iaqi_with(&PM25_24H, 0.0), iaqi_with(&PM25_24H, 35.1)), (0, 51));
        assert_eq!((iaqi_with(&PM10_24H, 50.0), iaqi_with(&PM10_24H, 150.0), iaqi_with(&PM10_24H, 420.0)), (50, 100, 300));
        assert_eq!((iaqi_with(&O3_1H, 160.0), iaqi_with(&O3_1H, 200.0), iaqi_with(&O3_1H, 800.0)), (50, 100, 300));
        assert_eq!((iaqi_with(&NO2_1H, 100.0), iaqi_with(&NO2_1H, 200.0), iaqi_with(&NO2_1H, 700.0)), (50, 100, 150));
        assert_eq!((iaqi_with(&CO_1H, 5.0), iaqi_with(&CO_1H, 10.0), iaqi_with(&CO_1H, 35.0)), (50, 100, 150));
        assert_eq!((iaqi_with(&SO2_1H, 150.0), iaqi_with(&SO2_1H, 500.0), iaqi_with(&SO2_1H, 800.0)), (50, 100, 200));
        // SO2 超过 800 改用 24 小时限值
        assert_eq!(cn_aqi(&Conc { so2: Some(1600.0), ..Default::default() }).unwrap().0, 300);
        // CO 按 mg/m³：5000 μg/m³ = 5 mg/m³ → 50
        assert_eq!(cn_aqi(&Conc { co: Some(5000.0), ..Default::default() }).unwrap().0, 50);
        // 首要污染物：AQI>50 才给，并列都列出
        assert!(cn_aqi(&Conc { pm2_5: Some(30.0), ..Default::default() }).unwrap().1.is_empty());
        let (v, p) = cn_aqi(&Conc { pm2_5: Some(75.0), pm10: Some(150.0), ..Default::default() }).unwrap();
        assert_eq!((v, p), (100, vec!["PM2.5", "PM10"]));
        assert!(cn_aqi(&Conc::default()).is_none());
    }

    #[test]
    fn cn_aqi_real_beijing_sample() {
        // Open-Meteo us_aqi=189，但小时浓度很低；国标实时应为 30 优
        let c = Conc { pm2_5: Some(20.7), pm10: Some(22.5), no2: Some(43.0), o3: Some(23.0), so2: Some(8.6), co: Some(702.0) };
        let a = Aqi::from_conc(&c).unwrap();
        assert_eq!((a.aqi, a.level.as_str(), a.tone), (30, "优", 1));
        assert!(a.primary.is_empty());
    }

    #[test]
    fn old_cache_with_us_aqi_is_invalidated() {
        let c = Connection::open_in_memory().unwrap();
        crate::db::migrate(&c).unwrap();
        let mut w = parse(&sample(), None, &City::beijing(), 5000).unwrap();
        w.aqi = Some(Aqi { aqi: 30, pm2_5: None, level: "优".into(), tone: 1, primary: vec![] });
        let mut v = serde_json::to_value(&w).unwrap();
        v["aqi"] = json!({"us_aqi": 189, "pm2_5": 20.7, "level": "中度污染"});
        c.execute("INSERT INTO weather_cache (id, city_key, fetched_at, data) VALUES (1, ?1, 5000, ?2)", params![City::beijing().key(), v.to_string()]).unwrap();
        assert!(cached(&c, &City::beijing(), 5060, false).unwrap().is_none(), "旧结构缓存直接失效");
        assert!(fallback(&c, &City::beijing(), "x".into()).is_err());
    }

    /// 联网实测：cargo test live_beijing -- --ignored --nocapture
    #[test]
    #[ignore]
    fn live_beijing() {
        let w = tauri::async_runtime::block_on(fetch(&City::beijing(), 0)).unwrap();
        println!("LIVE 北京 {} 当前 {}° 体感 {}° {} 最高{}/最低{} 降水{}% AQI {:?} 日出{} 日落{} 逐时{}条 提示：{}",
            w.current.time, w.current.temp, w.current.feels, w.current.text, w.today.max, w.today.min, w.today.precip_max,
            w.aqi.as_ref().map(|a| (a.aqi, a.level.clone(), a.primary.clone())), w.today.sunrise, w.today.sunset, w.hourly.len(), w.tip);
        let c = tauri::async_runtime::block_on(search_city("丰台")).unwrap();
        println!("LIVE 搜索 丰台：{:?}", c.iter().take(3).map(|c| format!("{} {}", c.name, c.admin)).collect::<Vec<_>>());
    }
}
