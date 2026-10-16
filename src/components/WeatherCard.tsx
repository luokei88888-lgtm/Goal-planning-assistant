import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudHail, CloudSnow, Snowflake, CloudRainWind, CloudLightning,
  RefreshCw, X, Droplets, Wind, Sunrise, Sunset, Umbrella, Leaf, Lightbulb, MapPin, WifiOff, Thermometer, type LucideIcon } from "lucide-react";
import { weatherGet, type Weather } from "../lib/tauri";

const ICONS: Record<string, LucideIcon> = { Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudHail, CloudSnow, Snowflake, CloudRainWind, CloudLightning };
export const WeatherIcon = ({ name, size = 20 }: { name: string; size?: number }) => {
  const I = ICONS[name] ?? Cloud;
  return <I size={size} strokeWidth={1.7} />;
};
const cityFull = (w: Weather) => [w.city.name, w.city.admin !== w.city.name ? w.city.admin : "", w.city.country].filter(Boolean).join(" · ");
const hm = (s: number) => { const d = new Date(s * 1000); return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };
const t0 = (n: number) => `${Math.round(n)}°`;
/** 国标六级色阶（与后端 aqi_level 相同区间） */
const aqiTone = (a: number) => (a <= 50 ? 1 : a <= 100 ? 2 : a <= 150 ? 3 : a <= 200 ? 4 : a <= 300 ? 5 : 6);

function Detail({ w, busy, onRefresh, onClose }: { w: Weather; busy: boolean; onRefresh: () => void; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  const c = w.current;
  const hours = useRef<HTMLDivElement>(null);
  // 鼠标纵向滚轮 → 横向滚动
  useEffect(() => {
    const el = hours.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX) || el.scrollWidth <= el.clientWidth) return;
      e.preventDefault();
      el.scrollBy({ left: e.deltaY, behavior: "smooth" });
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, []);
  return createPortal(
    <div className="modal-mask" onClick={onClose}>
      <div className="weather-modal glass neon-cyan" onClick={(e) => e.stopPropagation()}>
        <header className="plan-head">
          <div>
            <div className="plan-kicker"><MapPin size={15} />{w.city.name}{w.city.admin && w.city.admin !== w.city.name ? ` · ${w.city.admin}` : ""}</div>
            <h2 className="wm-now"><span className="wm-icon"><WeatherIcon name={c.icon} size={44} /></span>{t0(c.temp)}<small>{c.text}</small></h2>
          </div>
          <button type="button" className="icon-btn" title="关闭" onClick={onClose}><X size={20} /></button>
        </header>
        <div className="wm-body">
          <div className={`wm-tip ${w.stale ? "stale" : ""}`}><Lightbulb size={16} />{w.tip}</div>
          <div className="wm-grid">
            <div><Thermometer size={16} />体感<b>{t0(c.feels)}</b></div>
            <div><Thermometer size={16} />最高 / 最低<b>{t0(w.today.max)} / {t0(w.today.min)}</b></div>
            <div><Umbrella size={16} />降水概率<b>{w.today.precip_max}%</b></div>
            <div><Droplets size={16} />湿度<b>{Math.round(c.humidity)}%</b></div>
            <div><Wind size={16} />风<b>{c.wind_dir} {c.wind_level} 级</b><em>{c.wind_kmh.toFixed(1)} km/h</em></div>
            {w.aqi && <div><Leaf size={16} />空气质量<b className={`aqi-l${w.aqi.tone}`}>AQI {w.aqi.aqi} {w.aqi.level}</b>{w.aqi.primary.length > 0 ? <em>首要污染物 {w.aqi.primary.join("、")}</em> : w.aqi.pm2_5 !== null && <em>PM2.5 {Math.round(w.aqi.pm2_5)} μg/m³</em>}</div>}
            <div><Sunrise size={16} />日出<b>{w.today.sunrise}</b></div>
            <div><Sunset size={16} />日落<b>{w.today.sunset}</b></div>
          </div>
          <div className="wm-sub">未来 12 小时</div>
          <div className="wm-hours" ref={hours}>
            {w.hourly.map((h, i) => (
              <div key={h.time + i} className="wm-hour">
                <span>{i === 0 ? "现在" : h.time}</span>
                <WeatherIcon name={h.icon} size={22} />
                <b>{t0(h.temp)}</b>
                <em className={h.precip >= 50 ? "wet" : ""}>{h.precip}%</em>
                {h.aqi != null && <i className={`wm-aqi aqi-l${aqiTone(h.aqi)}`} title={`AQI ${h.aqi}`}>AQI {h.aqi}</i>}
              </div>
            ))}
          </div>
        </div>
        <footer className="plan-foot wm-foot">
          <span className="muted">{w.stale ? <><WifiOff size={14} /> 离线 · </> : null}更新于 {hm(w.fetched_at)} · 数据来自 Open-Meteo 模型估算，AQI 按国标计算，与监测站可能有差异</span>
          <button type="button" className="ghost-btn neon-cyan sm" disabled={busy} onClick={onRefresh}><RefreshCw size={15} className={busy ? "spin" : ""} />刷新</button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

export function WeatherCard() {
  const [w, setW] = useState<Weather | null | undefined>(undefined);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const load = async (force = false) => {
    setBusy(true);
    try { setW(await weatherGet(force)); setErr(""); } catch (e) { setErr(String(e)); } finally { setBusy(false); }
  };
  useEffect(() => {
    load();
    const t = window.setInterval(() => load(), 10 * 60 * 1000);
    return () => window.clearInterval(t);
  }, []);
  if (w === null) return null; // 设置里关闭了
  if (!w) {
    return err ? (
      <button type="button" className="weather-chip glass off nowrap" title={err} onClick={() => load(true)}><WifiOff size={16} />天气暂不可用 · 点此重试</button>
    ) : <div className="weather-chip glass off nowrap"><RefreshCw size={14} className="spin" />天气加载中…</div>;
  }
  const c = w.current;
  return (
    <>
      <button type="button" className={`weather-chip glass nowrap ${w.stale ? "stale" : ""}`} title={w.tip} onClick={() => setOpen(true)}>
        <span className="wc-icon"><WeatherIcon name={c.icon} size={30} /></span>
        <span className="wc-temp">{t0(c.temp)}</span>
        <span className="wc-col">
          <span className="wc-city" title={cityFull(w)}><MapPin size={11} /><em>{w.city.name}</em></span>
          <span className="wc-line"><b>{c.text}</b>{t0(w.today.max)}/{t0(w.today.min)}</span>
          <span className="wc-line sub"><Umbrella size={12} />{w.today.precip_max}%{w.aqi && <><Leaf size={12} /><i className={`aqi-l${w.aqi.tone}`}>AQI {w.aqi.aqi} {w.aqi.level}</i></>}</span>
        </span>
        {w.stale && <span className="wc-stale">更新于 {hm(w.fetched_at)}</span>}
      </button>
      {open && <Detail w={w} busy={busy} onRefresh={() => load(true)} onClose={() => setOpen(false)} />}
    </>
  );
}
