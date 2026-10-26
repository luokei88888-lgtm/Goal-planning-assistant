/** 中国省→市→区县本地坐标（天气选城用）。坐标为公开常用值，精度约 0.01°。 */
export type ChinaDistrict = { name: string; latitude: number; longitude: number };
export type ChinaCity = { name: string; districts: ChinaDistrict[] };
export type ChinaProvince = { name: string; cities: ChinaCity[] };
export type CityLike = { name: string; admin: string; country: string; latitude: number; longitude: number };
export type CascadeSelection = { province: string; city: string; district: string };

export const CHINA_REGIONS: ChinaProvince[] = [
  {
    "name": "北京市",
    "cities": [
      {
        "name": "北京市",
        "districts": [
          {
            "name": "东城区",
            "latitude": 39.9289,
            "longitude": 116.4164
          },
          {
            "name": "西城区",
            "latitude": 39.9126,
            "longitude": 116.3659
          },
          {
            "name": "朝阳区",
            "latitude": 39.9215,
            "longitude": 116.4436
          },
          {
            "name": "丰台区",
            "latitude": 39.8585,
            "longitude": 116.287
          },
          {
            "name": "石景山区",
            "latitude": 39.9063,
            "longitude": 116.223
          },
          {
            "name": "海淀区",
            "latitude": 39.9599,
            "longitude": 116.2981
          },
          {
            "name": "门头沟区",
            "latitude": 39.9406,
            "longitude": 116.1016
          },
          {
            "name": "房山区",
            "latitude": 39.7355,
            "longitude": 116.1433
          },
          {
            "name": "通州区",
            "latitude": 39.9099,
            "longitude": 116.6564
          },
          {
            "name": "顺义区",
            "latitude": 40.1289,
            "longitude": 116.6548
          },
          {
            "name": "昌平区",
            "latitude": 40.2208,
            "longitude": 116.2312
          },
          {
            "name": "大兴区",
            "latitude": 39.7268,
            "longitude": 116.3414
          },
          {
            "name": "怀柔区",
            "latitude": 40.3169,
            "longitude": 116.6319
          },
          {
            "name": "平谷区",
            "latitude": 40.1406,
            "longitude": 117.1214
          },
          {
            "name": "密云区",
            "latitude": 40.3769,
            "longitude": 116.8432
          },
          {
            "name": "延庆区",
            "latitude": 40.4569,
            "longitude": 115.9749
          },
          {
            "name": "市区",
            "latitude": 39.9042,
            "longitude": 116.4074
          }
        ]
      }
    ]
  },
  {
    "name": "天津市",
    "cities": [
      {
        "name": "天津市",
        "districts": [
          {
            "name": "和平区",
            "latitude": 39.1171,
            "longitude": 117.2147
          },
          {
            "name": "河东区",
            "latitude": 39.1283,
            "longitude": 117.2516
          },
          {
            "name": "河西区",
            "latitude": 39.1096,
            "longitude": 117.2234
          },
          {
            "name": "南开区",
            "latitude": 39.1382,
            "longitude": 117.1507
          },
          {
            "name": "河北区",
            "latitude": 39.1478,
            "longitude": 117.1967
          },
          {
            "name": "红桥区",
            "latitude": 39.1673,
            "longitude": 117.1515
          },
          {
            "name": "东丽区",
            "latitude": 39.0865,
            "longitude": 117.3144
          },
          {
            "name": "西青区",
            "latitude": 39.1412,
            "longitude": 117.0093
          },
          {
            "name": "津南区",
            "latitude": 38.9375,
            "longitude": 117.3571
          },
          {
            "name": "北辰区",
            "latitude": 39.2249,
            "longitude": 117.1356
          },
          {
            "name": "武清区",
            "latitude": 39.3841,
            "longitude": 117.0444
          },
          {
            "name": "宝坻区",
            "latitude": 39.7174,
            "longitude": 117.3098
          },
          {
            "name": "滨海新区",
            "latitude": 39.0033,
            "longitude": 117.7105
          },
          {
            "name": "宁河区",
            "latitude": 39.3305,
            "longitude": 117.8267
          },
          {
            "name": "静海区",
            "latitude": 38.9475,
            "longitude": 116.9744
          },
          {
            "name": "蓟州区",
            "latitude": 40.0458,
            "longitude": 117.4081
          },
          {
            "name": "市区",
            "latitude": 39.0842,
            "longitude": 117.201
          }
        ]
      }
    ]
  },
  {
    "name": "河北省",
    "cities": [
      {
        "name": "石家庄市",
        "districts": [
          {
            "name": "长安区",
            "latitude": 38.0366,
            "longitude": 114.5395
          },
          {
            "name": "桥西区",
            "latitude": 38.0037,
            "longitude": 114.4612
          },
          {
            "name": "新华区",
            "latitude": 38.0509,
            "longitude": 114.4639
          },
          {
            "name": "裕华区",
            "latitude": 38.0064,
            "longitude": 114.5313
          },
          {
            "name": "藁城区",
            "latitude": 38.0217,
            "longitude": 114.8471
          },
          {
            "name": "鹿泉区",
            "latitude": 38.0859,
            "longitude": 114.3136
          },
          {
            "name": "栾城区",
            "latitude": 37.9001,
            "longitude": 114.6483
          },
          {
            "name": "正定县",
            "latitude": 38.1462,
            "longitude": 114.5708
          },
          {
            "name": "市区",
            "latitude": 38.0428,
            "longitude": 114.5149
          }
        ]
      },
      {
        "name": "唐山市",
        "districts": [
          {
            "name": "路南区",
            "latitude": 39.6251,
            "longitude": 118.1543
          },
          {
            "name": "路北区",
            "latitude": 39.6244,
            "longitude": 118.2007
          },
          {
            "name": "古冶区",
            "latitude": 39.7338,
            "longitude": 118.4477
          },
          {
            "name": "开平区",
            "latitude": 39.6712,
            "longitude": 118.2618
          },
          {
            "name": "丰南区",
            "latitude": 39.575,
            "longitude": 118.0851
          },
          {
            "name": "丰润区",
            "latitude": 39.8325,
            "longitude": 118.1622
          },
          {
            "name": "曹妃甸区",
            "latitude": 39.2734,
            "longitude": 118.4604
          },
          {
            "name": "市区",
            "latitude": 39.6309,
            "longitude": 118.1802
          }
        ]
      },
      {
        "name": "秦皇岛市",
        "districts": [
          {
            "name": "海港区",
            "latitude": 39.9347,
            "longitude": 119.6106
          },
          {
            "name": "山海关区",
            "latitude": 39.9786,
            "longitude": 119.7758
          },
          {
            "name": "北戴河区",
            "latitude": 39.8351,
            "longitude": 119.4845
          },
          {
            "name": "抚宁区",
            "latitude": 39.876,
            "longitude": 119.2448
          },
          {
            "name": "市区",
            "latitude": 39.8882,
            "longitude": 119.5202
          }
        ]
      },
      {
        "name": "邯郸市",
        "districts": [
          {
            "name": "邯山区",
            "latitude": 36.5944,
            "longitude": 114.531
          },
          {
            "name": "丛台区",
            "latitude": 36.6361,
            "longitude": 114.4929
          },
          {
            "name": "复兴区",
            "latitude": 36.6389,
            "longitude": 114.4622
          },
          {
            "name": "峰峰矿区",
            "latitude": 36.4197,
            "longitude": 114.2128
          },
          {
            "name": "市区",
            "latitude": 36.6256,
            "longitude": 114.5391
          }
        ]
      },
      {
        "name": "保定市",
        "districts": [
          {
            "name": "竞秀区",
            "latitude": 38.8775,
            "longitude": 115.4587
          },
          {
            "name": "莲池区",
            "latitude": 38.8836,
            "longitude": 115.4971
          },
          {
            "name": "满城区",
            "latitude": 38.949,
            "longitude": 115.3223
          },
          {
            "name": "清苑区",
            "latitude": 38.7651,
            "longitude": 115.4899
          },
          {
            "name": "徐水区",
            "latitude": 39.0187,
            "longitude": 115.6559
          },
          {
            "name": "市区",
            "latitude": 38.8738,
            "longitude": 115.4646
          }
        ]
      },
      {
        "name": "张家口市",
        "districts": [
          {
            "name": "桥东区",
            "latitude": 40.7885,
            "longitude": 114.8943
          },
          {
            "name": "桥西区",
            "latitude": 40.8195,
            "longitude": 114.8697
          },
          {
            "name": "宣化区",
            "latitude": 40.6095,
            "longitude": 115.0994
          },
          {
            "name": "下花园区",
            "latitude": 40.5025,
            "longitude": 115.2874
          },
          {
            "name": "市区",
            "latitude": 40.8244,
            "longitude": 114.8844
          }
        ]
      },
      {
        "name": "承德市",
        "districts": [
          {
            "name": "双桥区",
            "latitude": 40.9747,
            "longitude": 117.9435
          },
          {
            "name": "双滦区",
            "latitude": 40.9593,
            "longitude": 117.7989
          },
          {
            "name": "市区",
            "latitude": 40.9519,
            "longitude": 117.9634
          }
        ]
      },
      {
        "name": "沧州市",
        "districts": [
          {
            "name": "新华区",
            "latitude": 38.3143,
            "longitude": 116.8663
          },
          {
            "name": "运河区",
            "latitude": 38.3104,
            "longitude": 116.8576
          },
          {
            "name": "市区",
            "latitude": 38.3044,
            "longitude": 116.8388
          }
        ]
      },
      {
        "name": "廊坊市",
        "districts": [
          {
            "name": "安次区",
            "latitude": 39.5215,
            "longitude": 116.6945
          },
          {
            "name": "广阳区",
            "latitude": 39.5228,
            "longitude": 116.7106
          },
          {
            "name": "三河市",
            "latitude": 39.9827,
            "longitude": 117.0783
          },
          {
            "name": "霸州市",
            "latitude": 39.1258,
            "longitude": 116.3915
          },
          {
            "name": "固安县",
            "latitude": 39.4382,
            "longitude": 116.2987
          },
          {
            "name": "市区",
            "latitude": 39.538,
            "longitude": 116.6836
          }
        ]
      },
      {
        "name": "衡水市",
        "districts": [
          {
            "name": "桃城区",
            "latitude": 37.7347,
            "longitude": 115.6753
          },
          {
            "name": "市区",
            "latitude": 37.7389,
            "longitude": 115.6702
          }
        ]
      },
      {
        "name": "邢台市",
        "districts": [
          {
            "name": "市区",
            "latitude": 37.0706,
            "longitude": 114.5045
          }
        ]
      }
    ]
  },
  {
    "name": "山西省",
    "cities": [
      {
        "name": "太原市",
        "districts": [
          {
            "name": "小店区",
            "latitude": 37.7365,
            "longitude": 112.5657
          },
          {
            "name": "迎泽区",
            "latitude": 37.8634,
            "longitude": 112.5634
          },
          {
            "name": "杏花岭区",
            "latitude": 37.8942,
            "longitude": 112.5706
          },
          {
            "name": "尖草坪区",
            "latitude": 37.94,
            "longitude": 112.4871
          },
          {
            "name": "万柏林区",
            "latitude": 37.8595,
            "longitude": 112.5155
          },
          {
            "name": "晋源区",
            "latitude": 37.7154,
            "longitude": 112.4778
          },
          {
            "name": "市区",
            "latitude": 37.8706,
            "longitude": 112.5489
          }
        ]
      },
      {
        "name": "大同市",
        "districts": [
          {
            "name": "市区",
            "latitude": 40.0768,
            "longitude": 113.3001
          }
        ]
      },
      {
        "name": "阳泉市",
        "districts": [
          {
            "name": "市区",
            "latitude": 37.8569,
            "longitude": 113.5802
          }
        ]
      },
      {
        "name": "长治市",
        "districts": [
          {
            "name": "市区",
            "latitude": 36.1954,
            "longitude": 113.1163
          }
        ]
      },
      {
        "name": "晋城市",
        "districts": [
          {
            "name": "市区",
            "latitude": 35.4914,
            "longitude": 112.8513
          }
        ]
      },
      {
        "name": "朔州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 39.3313,
            "longitude": 112.4329
          }
        ]
      },
      {
        "name": "晋中市",
        "districts": [
          {
            "name": "市区",
            "latitude": 37.687,
            "longitude": 112.7527
          }
        ]
      },
      {
        "name": "运城市",
        "districts": [
          {
            "name": "市区",
            "latitude": 35.0264,
            "longitude": 111.007
          }
        ]
      },
      {
        "name": "忻州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 38.4167,
            "longitude": 112.7341
          }
        ]
      },
      {
        "name": "临汾市",
        "districts": [
          {
            "name": "市区",
            "latitude": 36.0882,
            "longitude": 111.519
          }
        ]
      },
      {
        "name": "吕梁市",
        "districts": [
          {
            "name": "市区",
            "latitude": 37.5183,
            "longitude": 111.1443
          }
        ]
      }
    ]
  },
  {
    "name": "内蒙古自治区",
    "cities": [
      {
        "name": "呼和浩特市",
        "districts": [
          {
            "name": "新城区",
            "latitude": 40.8583,
            "longitude": 111.6655
          },
          {
            "name": "回民区",
            "latitude": 40.8088,
            "longitude": 111.6622
          },
          {
            "name": "玉泉区",
            "latitude": 40.7536,
            "longitude": 111.674
          },
          {
            "name": "赛罕区",
            "latitude": 40.792,
            "longitude": 111.7012
          },
          {
            "name": "市区",
            "latitude": 40.8424,
            "longitude": 111.749
          }
        ]
      },
      {
        "name": "包头市",
        "districts": [
          {
            "name": "市区",
            "latitude": 40.6574,
            "longitude": 109.8403
          }
        ]
      },
      {
        "name": "乌海市",
        "districts": [
          {
            "name": "市区",
            "latitude": 39.6739,
            "longitude": 106.8256
          }
        ]
      },
      {
        "name": "赤峰市",
        "districts": [
          {
            "name": "市区",
            "latitude": 42.2578,
            "longitude": 118.8879
          }
        ]
      },
      {
        "name": "通辽市",
        "districts": [
          {
            "name": "市区",
            "latitude": 43.654,
            "longitude": 122.2434
          }
        ]
      },
      {
        "name": "鄂尔多斯市",
        "districts": [
          {
            "name": "市区",
            "latitude": 39.6086,
            "longitude": 109.7813
          }
        ]
      },
      {
        "name": "呼伦贝尔市",
        "districts": [
          {
            "name": "市区",
            "latitude": 49.2116,
            "longitude": 119.7651
          }
        ]
      },
      {
        "name": "巴彦淖尔市",
        "districts": [
          {
            "name": "市区",
            "latitude": 40.7574,
            "longitude": 107.3877
          }
        ]
      },
      {
        "name": "乌兰察布市",
        "districts": [
          {
            "name": "市区",
            "latitude": 41.0341,
            "longitude": 113.1145
          }
        ]
      },
      {
        "name": "兴安盟",
        "districts": [
          {
            "name": "市区",
            "latitude": 46.0763,
            "longitude": 122.0372
          }
        ]
      },
      {
        "name": "锡林郭勒盟",
        "districts": [
          {
            "name": "市区",
            "latitude": 43.9335,
            "longitude": 116.0473
          }
        ]
      },
      {
        "name": "阿拉善盟",
        "districts": [
          {
            "name": "市区",
            "latitude": 38.8519,
            "longitude": 105.7289
          }
        ]
      }
    ]
  },
  {
    "name": "辽宁省",
    "cities": [
      {
        "name": "沈阳市",
        "districts": [
          {
            "name": "和平区",
            "latitude": 41.7898,
            "longitude": 123.4204
          },
          {
            "name": "沈河区",
            "latitude": 41.7956,
            "longitude": 123.4587
          },
          {
            "name": "大东区",
            "latitude": 41.8051,
            "longitude": 123.4699
          },
          {
            "name": "皇姑区",
            "latitude": 41.8224,
            "longitude": 123.4415
          },
          {
            "name": "铁西区",
            "latitude": 41.8035,
            "longitude": 123.3762
          },
          {
            "name": "苏家屯区",
            "latitude": 41.6641,
            "longitude": 123.3441
          },
          {
            "name": "浑南区",
            "latitude": 41.7419,
            "longitude": 123.4496
          },
          {
            "name": "沈北新区",
            "latitude": 42.0529,
            "longitude": 123.5215
          },
          {
            "name": "于洪区",
            "latitude": 41.794,
            "longitude": 123.3081
          },
          {
            "name": "市区",
            "latitude": 41.8057,
            "longitude": 123.4315
          }
        ]
      },
      {
        "name": "大连市",
        "districts": [
          {
            "name": "中山区",
            "latitude": 38.9186,
            "longitude": 121.645
          },
          {
            "name": "西岗区",
            "latitude": 38.9147,
            "longitude": 121.6124
          },
          {
            "name": "沙河口区",
            "latitude": 38.9128,
            "longitude": 121.5761
          },
          {
            "name": "甘井子区",
            "latitude": 38.9747,
            "longitude": 121.5254
          },
          {
            "name": "旅顺口区",
            "latitude": 38.8515,
            "longitude": 121.2619
          },
          {
            "name": "金州区",
            "latitude": 39.1,
            "longitude": 121.7829
          },
          {
            "name": "市区",
            "latitude": 38.914,
            "longitude": 121.6147
          }
        ]
      },
      {
        "name": "鞍山市",
        "districts": [
          {
            "name": "市区",
            "latitude": 41.1086,
            "longitude": 122.9946
          }
        ]
      },
      {
        "name": "抚顺市",
        "districts": [
          {
            "name": "市区",
            "latitude": 41.8809,
            "longitude": 123.9572
          }
        ]
      },
      {
        "name": "本溪市",
        "districts": [
          {
            "name": "市区",
            "latitude": 41.2941,
            "longitude": 123.7665
          }
        ]
      },
      {
        "name": "丹东市",
        "districts": [
          {
            "name": "市区",
            "latitude": 40.0005,
            "longitude": 124.3544
          }
        ]
      },
      {
        "name": "锦州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 41.0951,
            "longitude": 121.127
          }
        ]
      },
      {
        "name": "营口市",
        "districts": [
          {
            "name": "市区",
            "latitude": 40.6673,
            "longitude": 122.2352
          }
        ]
      },
      {
        "name": "阜新市",
        "districts": [
          {
            "name": "市区",
            "latitude": 42.0216,
            "longitude": 121.6703
          }
        ]
      },
      {
        "name": "辽阳市",
        "districts": [
          {
            "name": "市区",
            "latitude": 41.2672,
            "longitude": 123.1725
          }
        ]
      },
      {
        "name": "盘锦市",
        "districts": [
          {
            "name": "市区",
            "latitude": 41.1199,
            "longitude": 122.0707
          }
        ]
      },
      {
        "name": "铁岭市",
        "districts": [
          {
            "name": "市区",
            "latitude": 42.2237,
            "longitude": 123.726
          }
        ]
      },
      {
        "name": "朝阳市",
        "districts": [
          {
            "name": "市区",
            "latitude": 41.5737,
            "longitude": 120.4504
          }
        ]
      },
      {
        "name": "葫芦岛市",
        "districts": [
          {
            "name": "市区",
            "latitude": 40.711,
            "longitude": 120.8369
          }
        ]
      }
    ]
  },
  {
    "name": "吉林省",
    "cities": [
      {
        "name": "长春市",
        "districts": [
          {
            "name": "南关区",
            "latitude": 43.864,
            "longitude": 125.3503
          },
          {
            "name": "宽城区",
            "latitude": 43.9436,
            "longitude": 125.3265
          },
          {
            "name": "朝阳区",
            "latitude": 43.8337,
            "longitude": 125.2883
          },
          {
            "name": "二道区",
            "latitude": 43.8659,
            "longitude": 125.3744
          },
          {
            "name": "绿园区",
            "latitude": 43.8805,
            "longitude": 125.2561
          },
          {
            "name": "市区",
            "latitude": 43.8171,
            "longitude": 125.3235
          }
        ]
      },
      {
        "name": "吉林市",
        "districts": [
          {
            "name": "市区",
            "latitude": 43.8378,
            "longitude": 126.5494
          }
        ]
      },
      {
        "name": "四平市",
        "districts": [
          {
            "name": "市区",
            "latitude": 43.1664,
            "longitude": 124.3504
          }
        ]
      },
      {
        "name": "辽源市",
        "districts": [
          {
            "name": "市区",
            "latitude": 42.8879,
            "longitude": 125.1437
          }
        ]
      },
      {
        "name": "通化市",
        "districts": [
          {
            "name": "市区",
            "latitude": 41.7284,
            "longitude": 125.9397
          }
        ]
      },
      {
        "name": "白山市",
        "districts": [
          {
            "name": "市区",
            "latitude": 41.9396,
            "longitude": 126.4278
          }
        ]
      },
      {
        "name": "松原市",
        "districts": [
          {
            "name": "市区",
            "latitude": 45.1418,
            "longitude": 124.8251
          }
        ]
      },
      {
        "name": "白城市",
        "districts": [
          {
            "name": "市区",
            "latitude": 45.6196,
            "longitude": 122.839
          }
        ]
      },
      {
        "name": "延边朝鲜族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 42.9091,
            "longitude": 129.4705
          }
        ]
      }
    ]
  },
  {
    "name": "黑龙江省",
    "cities": [
      {
        "name": "哈尔滨市",
        "districts": [
          {
            "name": "道里区",
            "latitude": 45.7558,
            "longitude": 126.6169
          },
          {
            "name": "南岗区",
            "latitude": 45.759,
            "longitude": 126.6688
          },
          {
            "name": "道外区",
            "latitude": 45.792,
            "longitude": 126.6494
          },
          {
            "name": "平房区",
            "latitude": 45.5978,
            "longitude": 126.637
          },
          {
            "name": "松北区",
            "latitude": 45.8085,
            "longitude": 126.563
          },
          {
            "name": "香坊区",
            "latitude": 45.7077,
            "longitude": 126.6626
          },
          {
            "name": "呼兰区",
            "latitude": 45.8896,
            "longitude": 126.5878
          },
          {
            "name": "阿城区",
            "latitude": 45.5369,
            "longitude": 126.9572
          },
          {
            "name": "市区",
            "latitude": 45.8038,
            "longitude": 126.5349
          }
        ]
      },
      {
        "name": "齐齐哈尔市",
        "districts": [
          {
            "name": "市区",
            "latitude": 47.3543,
            "longitude": 123.9182
          }
        ]
      },
      {
        "name": "鸡西市",
        "districts": [
          {
            "name": "市区",
            "latitude": 45.2952,
            "longitude": 130.9693
          }
        ]
      },
      {
        "name": "鹤岗市",
        "districts": [
          {
            "name": "市区",
            "latitude": 47.3321,
            "longitude": 130.2979
          }
        ]
      },
      {
        "name": "双鸭山市",
        "districts": [
          {
            "name": "市区",
            "latitude": 46.6434,
            "longitude": 131.1591
          }
        ]
      },
      {
        "name": "大庆市",
        "districts": [
          {
            "name": "市区",
            "latitude": 46.5893,
            "longitude": 125.1031
          }
        ]
      },
      {
        "name": "伊春市",
        "districts": [
          {
            "name": "市区",
            "latitude": 47.7275,
            "longitude": 128.8411
          }
        ]
      },
      {
        "name": "佳木斯市",
        "districts": [
          {
            "name": "市区",
            "latitude": 46.7999,
            "longitude": 130.3188
          }
        ]
      },
      {
        "name": "七台河市",
        "districts": [
          {
            "name": "市区",
            "latitude": 45.7712,
            "longitude": 131.0031
          }
        ]
      },
      {
        "name": "牡丹江市",
        "districts": [
          {
            "name": "市区",
            "latitude": 44.5515,
            "longitude": 129.6332
          }
        ]
      },
      {
        "name": "黑河市",
        "districts": [
          {
            "name": "市区",
            "latitude": 50.2453,
            "longitude": 127.5285
          }
        ]
      },
      {
        "name": "绥化市",
        "districts": [
          {
            "name": "市区",
            "latitude": 46.6374,
            "longitude": 126.9891
          }
        ]
      },
      {
        "name": "大兴安岭地区",
        "districts": [
          {
            "name": "市区",
            "latitude": 52.3353,
            "longitude": 124.7115
          }
        ]
      }
    ]
  },
  {
    "name": "上海市",
    "cities": [
      {
        "name": "上海市",
        "districts": [
          {
            "name": "黄浦区",
            "latitude": 31.2316,
            "longitude": 121.4846
          },
          {
            "name": "徐汇区",
            "latitude": 31.1885,
            "longitude": 121.4365
          },
          {
            "name": "长宁区",
            "latitude": 31.2204,
            "longitude": 121.4246
          },
          {
            "name": "静安区",
            "latitude": 31.2231,
            "longitude": 121.4478
          },
          {
            "name": "普陀区",
            "latitude": 31.2495,
            "longitude": 121.3955
          },
          {
            "name": "虹口区",
            "latitude": 31.2646,
            "longitude": 121.5051
          },
          {
            "name": "杨浦区",
            "latitude": 31.2595,
            "longitude": 121.526
          },
          {
            "name": "闵行区",
            "latitude": 31.1128,
            "longitude": 121.3817
          },
          {
            "name": "宝山区",
            "latitude": 31.4055,
            "longitude": 121.4896
          },
          {
            "name": "嘉定区",
            "latitude": 31.3756,
            "longitude": 121.2653
          },
          {
            "name": "浦东新区",
            "latitude": 31.2215,
            "longitude": 121.5444
          },
          {
            "name": "金山区",
            "latitude": 30.7247,
            "longitude": 121.3424
          },
          {
            "name": "松江区",
            "latitude": 31.0322,
            "longitude": 121.2277
          },
          {
            "name": "青浦区",
            "latitude": 31.1497,
            "longitude": 121.1243
          },
          {
            "name": "奉贤区",
            "latitude": 30.9179,
            "longitude": 121.474
          },
          {
            "name": "崇明区",
            "latitude": 31.6229,
            "longitude": 121.3974
          },
          {
            "name": "市区",
            "latitude": 31.2304,
            "longitude": 121.4737
          }
        ]
      }
    ]
  },
  {
    "name": "江苏省",
    "cities": [
      {
        "name": "南京市",
        "districts": [
          {
            "name": "玄武区",
            "latitude": 32.0485,
            "longitude": 118.7977
          },
          {
            "name": "秦淮区",
            "latitude": 32.0391,
            "longitude": 118.7947
          },
          {
            "name": "建邺区",
            "latitude": 32.0309,
            "longitude": 118.7317
          },
          {
            "name": "鼓楼区",
            "latitude": 32.0668,
            "longitude": 118.7701
          },
          {
            "name": "浦口区",
            "latitude": 32.059,
            "longitude": 118.6274
          },
          {
            "name": "栖霞区",
            "latitude": 32.1021,
            "longitude": 118.909
          },
          {
            "name": "雨花台区",
            "latitude": 31.9918,
            "longitude": 118.7791
          },
          {
            "name": "江宁区",
            "latitude": 31.9531,
            "longitude": 118.8399
          },
          {
            "name": "六合区",
            "latitude": 32.3422,
            "longitude": 118.8418
          },
          {
            "name": "溧水区",
            "latitude": 31.6532,
            "longitude": 119.0283
          },
          {
            "name": "高淳区",
            "latitude": 31.3272,
            "longitude": 118.8759
          },
          {
            "name": "市区",
            "latitude": 32.0603,
            "longitude": 118.7969
          }
        ]
      },
      {
        "name": "苏州市",
        "districts": [
          {
            "name": "姑苏区",
            "latitude": 31.3104,
            "longitude": 120.6228
          },
          {
            "name": "虎丘区",
            "latitude": 31.2953,
            "longitude": 120.5669
          },
          {
            "name": "吴中区",
            "latitude": 31.2637,
            "longitude": 120.6322
          },
          {
            "name": "相城区",
            "latitude": 31.3689,
            "longitude": 120.6429
          },
          {
            "name": "吴江区",
            "latitude": 31.1386,
            "longitude": 120.6451
          },
          {
            "name": "昆山市",
            "latitude": 31.3855,
            "longitude": 120.9807
          },
          {
            "name": "常熟市",
            "latitude": 31.6544,
            "longitude": 120.7525
          },
          {
            "name": "张家港市",
            "latitude": 31.8755,
            "longitude": 120.5555
          },
          {
            "name": "太仓市",
            "latitude": 31.4584,
            "longitude": 121.1298
          },
          {
            "name": "市区",
            "latitude": 31.2989,
            "longitude": 120.5853
          }
        ]
      },
      {
        "name": "无锡市",
        "districts": [
          {
            "name": "锡山区",
            "latitude": 31.5895,
            "longitude": 120.3573
          },
          {
            "name": "惠山区",
            "latitude": 31.6809,
            "longitude": 120.2985
          },
          {
            "name": "滨湖区",
            "latitude": 31.5284,
            "longitude": 120.2663
          },
          {
            "name": "梁溪区",
            "latitude": 31.5755,
            "longitude": 120.3031
          },
          {
            "name": "新吴区",
            "latitude": 31.4911,
            "longitude": 120.3631
          },
          {
            "name": "江阴市",
            "latitude": 31.9207,
            "longitude": 120.2849
          },
          {
            "name": "宜兴市",
            "latitude": 31.3406,
            "longitude": 119.8233
          },
          {
            "name": "市区",
            "latitude": 31.4912,
            "longitude": 120.3119
          }
        ]
      },
      {
        "name": "徐州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 34.2058,
            "longitude": 117.2841
          }
        ]
      },
      {
        "name": "常州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 31.8107,
            "longitude": 119.9741
          }
        ]
      },
      {
        "name": "南通市",
        "districts": [
          {
            "name": "市区",
            "latitude": 32.0162,
            "longitude": 120.8943
          }
        ]
      },
      {
        "name": "连云港市",
        "districts": [
          {
            "name": "市区",
            "latitude": 34.5969,
            "longitude": 119.2216
          }
        ]
      },
      {
        "name": "淮安市",
        "districts": [
          {
            "name": "市区",
            "latitude": 33.6101,
            "longitude": 119.0153
          }
        ]
      },
      {
        "name": "盐城市",
        "districts": [
          {
            "name": "市区",
            "latitude": 33.3496,
            "longitude": 120.1636
          }
        ]
      },
      {
        "name": "扬州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 32.3932,
            "longitude": 119.4129
          }
        ]
      },
      {
        "name": "镇江市",
        "districts": [
          {
            "name": "市区",
            "latitude": 32.1881,
            "longitude": 119.4244
          }
        ]
      },
      {
        "name": "泰州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 32.4849,
            "longitude": 119.9152
          }
        ]
      },
      {
        "name": "宿迁市",
        "districts": [
          {
            "name": "市区",
            "latitude": 33.963,
            "longitude": 118.2755
          }
        ]
      }
    ]
  },
  {
    "name": "浙江省",
    "cities": [
      {
        "name": "杭州市",
        "districts": [
          {
            "name": "上城区",
            "latitude": 30.2426,
            "longitude": 120.1693
          },
          {
            "name": "拱墅区",
            "latitude": 30.3191,
            "longitude": 120.1415
          },
          {
            "name": "西湖区",
            "latitude": 30.2595,
            "longitude": 120.1303
          },
          {
            "name": "滨江区",
            "latitude": 30.2085,
            "longitude": 120.2119
          },
          {
            "name": "萧山区",
            "latitude": 30.1848,
            "longitude": 120.2645
          },
          {
            "name": "余杭区",
            "latitude": 30.4211,
            "longitude": 120.2994
          },
          {
            "name": "临平区",
            "latitude": 30.4194,
            "longitude": 120.2999
          },
          {
            "name": "钱塘区",
            "latitude": 30.3229,
            "longitude": 120.493
          },
          {
            "name": "富阳区",
            "latitude": 30.0487,
            "longitude": 119.9604
          },
          {
            "name": "临安区",
            "latitude": 30.2338,
            "longitude": 119.7245
          },
          {
            "name": "桐庐县",
            "latitude": 29.7935,
            "longitude": 119.6915
          },
          {
            "name": "淳安县",
            "latitude": 29.609,
            "longitude": 119.042
          },
          {
            "name": "建德市",
            "latitude": 29.4749,
            "longitude": 119.2812
          },
          {
            "name": "市区",
            "latitude": 30.2741,
            "longitude": 120.1551
          }
        ]
      },
      {
        "name": "宁波市",
        "districts": [
          {
            "name": "海曙区",
            "latitude": 29.8745,
            "longitude": 121.5504
          },
          {
            "name": "江北区",
            "latitude": 29.8868,
            "longitude": 121.555
          },
          {
            "name": "北仑区",
            "latitude": 29.8998,
            "longitude": 121.8446
          },
          {
            "name": "镇海区",
            "latitude": 29.949,
            "longitude": 121.7166
          },
          {
            "name": "鄞州区",
            "latitude": 29.8173,
            "longitude": 121.5466
          },
          {
            "name": "奉化区",
            "latitude": 29.6551,
            "longitude": 121.4069
          },
          {
            "name": "市区",
            "latitude": 29.8683,
            "longitude": 121.544
          }
        ]
      },
      {
        "name": "温州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 27.9943,
            "longitude": 120.6994
          }
        ]
      },
      {
        "name": "嘉兴市",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.7461,
            "longitude": 120.7555
          }
        ]
      },
      {
        "name": "湖州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.8943,
            "longitude": 120.0868
          }
        ]
      },
      {
        "name": "绍兴市",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.0515,
            "longitude": 120.5802
          }
        ]
      },
      {
        "name": "金华市",
        "districts": [
          {
            "name": "市区",
            "latitude": 29.0791,
            "longitude": 119.6474
          }
        ]
      },
      {
        "name": "衢州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 28.9701,
            "longitude": 118.8742
          }
        ]
      },
      {
        "name": "舟山市",
        "districts": [
          {
            "name": "市区",
            "latitude": 29.9853,
            "longitude": 122.2072
          }
        ]
      },
      {
        "name": "台州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 28.6561,
            "longitude": 121.4208
          }
        ]
      },
      {
        "name": "丽水市",
        "districts": [
          {
            "name": "市区",
            "latitude": 28.4676,
            "longitude": 119.9229
          }
        ]
      }
    ]
  },
  {
    "name": "安徽省",
    "cities": [
      {
        "name": "合肥市",
        "districts": [
          {
            "name": "瑶海区",
            "latitude": 31.8581,
            "longitude": 117.3095
          },
          {
            "name": "庐阳区",
            "latitude": 31.8786,
            "longitude": 117.2646
          },
          {
            "name": "蜀山区",
            "latitude": 31.8512,
            "longitude": 117.2606
          },
          {
            "name": "包河区",
            "latitude": 31.7939,
            "longitude": 117.3098
          },
          {
            "name": "市区",
            "latitude": 31.8206,
            "longitude": 117.2272
          }
        ]
      },
      {
        "name": "芜湖市",
        "districts": [
          {
            "name": "市区",
            "latitude": 31.3529,
            "longitude": 118.3763
          }
        ]
      },
      {
        "name": "蚌埠市",
        "districts": [
          {
            "name": "市区",
            "latitude": 32.9163,
            "longitude": 117.3889
          }
        ]
      },
      {
        "name": "淮南市",
        "districts": [
          {
            "name": "市区",
            "latitude": 32.6255,
            "longitude": 117.0186
          }
        ]
      },
      {
        "name": "马鞍山市",
        "districts": [
          {
            "name": "市区",
            "latitude": 31.6707,
            "longitude": 118.506
          }
        ]
      },
      {
        "name": "淮北市",
        "districts": [
          {
            "name": "市区",
            "latitude": 33.9717,
            "longitude": 116.7947
          }
        ]
      },
      {
        "name": "铜陵市",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.9454,
            "longitude": 117.8114
          }
        ]
      },
      {
        "name": "安庆市",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.5319,
            "longitude": 117.1151
          }
        ]
      },
      {
        "name": "黄山市",
        "districts": [
          {
            "name": "市区",
            "latitude": 29.7147,
            "longitude": 118.3375
          }
        ]
      },
      {
        "name": "滁州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 32.3173,
            "longitude": 118.3163
          }
        ]
      },
      {
        "name": "阜阳市",
        "districts": [
          {
            "name": "市区",
            "latitude": 32.8901,
            "longitude": 115.8142
          }
        ]
      },
      {
        "name": "宿州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 33.6464,
            "longitude": 116.9641
          }
        ]
      },
      {
        "name": "六安市",
        "districts": [
          {
            "name": "市区",
            "latitude": 31.7356,
            "longitude": 116.5078
          }
        ]
      },
      {
        "name": "亳州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 33.8693,
            "longitude": 115.7787
          }
        ]
      },
      {
        "name": "池州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.6648,
            "longitude": 117.4916
          }
        ]
      },
      {
        "name": "宣城市",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.9402,
            "longitude": 118.7588
          }
        ]
      }
    ]
  },
  {
    "name": "福建省",
    "cities": [
      {
        "name": "福州市",
        "districts": [
          {
            "name": "鼓楼区",
            "latitude": 26.0823,
            "longitude": 119.3039
          },
          {
            "name": "台江区",
            "latitude": 26.0527,
            "longitude": 119.3141
          },
          {
            "name": "仓山区",
            "latitude": 26.0388,
            "longitude": 119.3155
          },
          {
            "name": "马尾区",
            "latitude": 25.9895,
            "longitude": 119.4555
          },
          {
            "name": "晋安区",
            "latitude": 26.082,
            "longitude": 119.3283
          },
          {
            "name": "长乐区",
            "latitude": 25.9629,
            "longitude": 119.5233
          },
          {
            "name": "市区",
            "latitude": 26.0745,
            "longitude": 119.2965
          }
        ]
      },
      {
        "name": "厦门市",
        "districts": [
          {
            "name": "思明区",
            "latitude": 24.4455,
            "longitude": 118.0827
          },
          {
            "name": "海沧区",
            "latitude": 24.4847,
            "longitude": 118.0328
          },
          {
            "name": "湖里区",
            "latitude": 24.5126,
            "longitude": 118.1464
          },
          {
            "name": "集美区",
            "latitude": 24.5759,
            "longitude": 118.0974
          },
          {
            "name": "同安区",
            "latitude": 24.7233,
            "longitude": 118.1519
          },
          {
            "name": "翔安区",
            "latitude": 24.6186,
            "longitude": 118.2483
          },
          {
            "name": "市区",
            "latitude": 24.4798,
            "longitude": 118.0894
          }
        ]
      },
      {
        "name": "莆田市",
        "districts": [
          {
            "name": "市区",
            "latitude": 25.4541,
            "longitude": 119.0078
          }
        ]
      },
      {
        "name": "三明市",
        "districts": [
          {
            "name": "市区",
            "latitude": 26.2654,
            "longitude": 117.6387
          }
        ]
      },
      {
        "name": "泉州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 24.8741,
            "longitude": 118.6757
          }
        ]
      },
      {
        "name": "漳州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 24.5109,
            "longitude": 117.6471
          }
        ]
      },
      {
        "name": "南平市",
        "districts": [
          {
            "name": "市区",
            "latitude": 26.6418,
            "longitude": 118.1778
          }
        ]
      },
      {
        "name": "龙岩市",
        "districts": [
          {
            "name": "市区",
            "latitude": 25.0916,
            "longitude": 117.0173
          }
        ]
      },
      {
        "name": "宁德市",
        "districts": [
          {
            "name": "市区",
            "latitude": 26.6657,
            "longitude": 119.5479
          }
        ]
      }
    ]
  },
  {
    "name": "江西省",
    "cities": [
      {
        "name": "南昌市",
        "districts": [
          {
            "name": "东湖区",
            "latitude": 28.699,
            "longitude": 115.8988
          },
          {
            "name": "西湖区",
            "latitude": 28.6569,
            "longitude": 115.8772
          },
          {
            "name": "青云谱区",
            "latitude": 28.6217,
            "longitude": 115.9255
          },
          {
            "name": "青山湖区",
            "latitude": 28.6829,
            "longitude": 115.9615
          },
          {
            "name": "新建区",
            "latitude": 28.6925,
            "longitude": 115.8153
          },
          {
            "name": "红谷滩区",
            "latitude": 28.6981,
            "longitude": 115.8581
          },
          {
            "name": "市区",
            "latitude": 28.682,
            "longitude": 115.8579
          }
        ]
      },
      {
        "name": "景德镇市",
        "districts": [
          {
            "name": "市区",
            "latitude": 29.2687,
            "longitude": 117.1784
          }
        ]
      },
      {
        "name": "萍乡市",
        "districts": [
          {
            "name": "市区",
            "latitude": 27.6228,
            "longitude": 113.8546
          }
        ]
      },
      {
        "name": "九江市",
        "districts": [
          {
            "name": "市区",
            "latitude": 29.7051,
            "longitude": 116.0015
          }
        ]
      },
      {
        "name": "新余市",
        "districts": [
          {
            "name": "市区",
            "latitude": 27.8178,
            "longitude": 114.9173
          }
        ]
      },
      {
        "name": "鹰潭市",
        "districts": [
          {
            "name": "市区",
            "latitude": 28.2602,
            "longitude": 117.0692
          }
        ]
      },
      {
        "name": "赣州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 25.831,
            "longitude": 114.9335
          }
        ]
      },
      {
        "name": "吉安市",
        "districts": [
          {
            "name": "市区",
            "latitude": 27.1138,
            "longitude": 114.9927
          }
        ]
      },
      {
        "name": "宜春市",
        "districts": [
          {
            "name": "市区",
            "latitude": 27.8156,
            "longitude": 114.3916
          }
        ]
      },
      {
        "name": "抚州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 27.9492,
            "longitude": 116.3584
          }
        ]
      },
      {
        "name": "上饶市",
        "districts": [
          {
            "name": "市区",
            "latitude": 28.4549,
            "longitude": 117.9434
          }
        ]
      }
    ]
  },
  {
    "name": "山东省",
    "cities": [
      {
        "name": "济南市",
        "districts": [
          {
            "name": "历下区",
            "latitude": 36.6664,
            "longitude": 117.0765
          },
          {
            "name": "市中区",
            "latitude": 36.6515,
            "longitude": 116.9972
          },
          {
            "name": "槐荫区",
            "latitude": 36.6515,
            "longitude": 116.9012
          },
          {
            "name": "天桥区",
            "latitude": 36.678,
            "longitude": 116.9872
          },
          {
            "name": "历城区",
            "latitude": 36.6803,
            "longitude": 117.0652
          },
          {
            "name": "长清区",
            "latitude": 36.5537,
            "longitude": 116.7519
          },
          {
            "name": "章丘区",
            "latitude": 36.7123,
            "longitude": 117.5262
          },
          {
            "name": "市区",
            "latitude": 36.6512,
            "longitude": 117.1201
          }
        ]
      },
      {
        "name": "青岛市",
        "districts": [
          {
            "name": "市南区",
            "latitude": 36.0669,
            "longitude": 120.4124
          },
          {
            "name": "市北区",
            "latitude": 36.0876,
            "longitude": 120.3749
          },
          {
            "name": "黄岛区",
            "latitude": 35.9609,
            "longitude": 120.1981
          },
          {
            "name": "崂山区",
            "latitude": 36.1076,
            "longitude": 120.4689
          },
          {
            "name": "李沧区",
            "latitude": 36.1455,
            "longitude": 120.4329
          },
          {
            "name": "城阳区",
            "latitude": 36.3074,
            "longitude": 120.3963
          },
          {
            "name": "即墨区",
            "latitude": 36.3894,
            "longitude": 120.4472
          },
          {
            "name": "市区",
            "latitude": 36.0671,
            "longitude": 120.3826
          }
        ]
      },
      {
        "name": "淄博市",
        "districts": [
          {
            "name": "市区",
            "latitude": 36.8135,
            "longitude": 118.0549
          }
        ]
      },
      {
        "name": "枣庄市",
        "districts": [
          {
            "name": "市区",
            "latitude": 34.8105,
            "longitude": 117.3238
          }
        ]
      },
      {
        "name": "东营市",
        "districts": [
          {
            "name": "市区",
            "latitude": 37.4337,
            "longitude": 118.6747
          }
        ]
      },
      {
        "name": "烟台市",
        "districts": [
          {
            "name": "市区",
            "latitude": 37.4638,
            "longitude": 121.4479
          }
        ]
      },
      {
        "name": "潍坊市",
        "districts": [
          {
            "name": "市区",
            "latitude": 36.707,
            "longitude": 119.1619
          }
        ]
      },
      {
        "name": "济宁市",
        "districts": [
          {
            "name": "市区",
            "latitude": 35.4154,
            "longitude": 116.5873
          }
        ]
      },
      {
        "name": "泰安市",
        "districts": [
          {
            "name": "市区",
            "latitude": 36.2003,
            "longitude": 117.0876
          }
        ]
      },
      {
        "name": "威海市",
        "districts": [
          {
            "name": "市区",
            "latitude": 37.5135,
            "longitude": 122.1216
          }
        ]
      },
      {
        "name": "日照市",
        "districts": [
          {
            "name": "市区",
            "latitude": 35.4164,
            "longitude": 119.5269
          }
        ]
      },
      {
        "name": "临沂市",
        "districts": [
          {
            "name": "市区",
            "latitude": 35.1041,
            "longitude": 118.3564
          }
        ]
      },
      {
        "name": "德州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 37.4341,
            "longitude": 116.3594
          }
        ]
      },
      {
        "name": "聊城市",
        "districts": [
          {
            "name": "市区",
            "latitude": 36.456,
            "longitude": 115.9854
          }
        ]
      },
      {
        "name": "滨州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 37.3835,
            "longitude": 117.9707
          }
        ]
      },
      {
        "name": "菏泽市",
        "districts": [
          {
            "name": "市区",
            "latitude": 35.2337,
            "longitude": 115.4807
          }
        ]
      }
    ]
  },
  {
    "name": "河南省",
    "cities": [
      {
        "name": "郑州市",
        "districts": [
          {
            "name": "中原区",
            "latitude": 34.7483,
            "longitude": 113.6133
          },
          {
            "name": "二七区",
            "latitude": 34.7235,
            "longitude": 113.6401
          },
          {
            "name": "管城回族区",
            "latitude": 34.7544,
            "longitude": 113.6775
          },
          {
            "name": "金水区",
            "latitude": 34.8,
            "longitude": 113.6861
          },
          {
            "name": "上街区",
            "latitude": 34.8027,
            "longitude": 113.3091
          },
          {
            "name": "惠济区",
            "latitude": 34.8675,
            "longitude": 113.6169
          },
          {
            "name": "中牟县",
            "latitude": 34.719,
            "longitude": 113.9762
          },
          {
            "name": "巩义市",
            "latitude": 34.748,
            "longitude": 113.022
          },
          {
            "name": "市区",
            "latitude": 34.7466,
            "longitude": 113.6254
          }
        ]
      },
      {
        "name": "开封市",
        "districts": [
          {
            "name": "市区",
            "latitude": 34.7971,
            "longitude": 114.3074
          }
        ]
      },
      {
        "name": "洛阳市",
        "districts": [
          {
            "name": "市区",
            "latitude": 34.6197,
            "longitude": 112.454
          }
        ]
      },
      {
        "name": "平顶山市",
        "districts": [
          {
            "name": "市区",
            "latitude": 33.7662,
            "longitude": 113.1926
          }
        ]
      },
      {
        "name": "安阳市",
        "districts": [
          {
            "name": "市区",
            "latitude": 36.0976,
            "longitude": 114.3924
          }
        ]
      },
      {
        "name": "鹤壁市",
        "districts": [
          {
            "name": "市区",
            "latitude": 35.7472,
            "longitude": 114.2973
          }
        ]
      },
      {
        "name": "新乡市",
        "districts": [
          {
            "name": "市区",
            "latitude": 35.303,
            "longitude": 113.9268
          }
        ]
      },
      {
        "name": "焦作市",
        "districts": [
          {
            "name": "市区",
            "latitude": 35.2154,
            "longitude": 113.2418
          }
        ]
      },
      {
        "name": "濮阳市",
        "districts": [
          {
            "name": "市区",
            "latitude": 35.7619,
            "longitude": 115.0292
          }
        ]
      },
      {
        "name": "许昌市",
        "districts": [
          {
            "name": "市区",
            "latitude": 34.0357,
            "longitude": 113.8526
          }
        ]
      },
      {
        "name": "漯河市",
        "districts": [
          {
            "name": "市区",
            "latitude": 33.5814,
            "longitude": 114.0166
          }
        ]
      },
      {
        "name": "三门峡市",
        "districts": [
          {
            "name": "市区",
            "latitude": 34.7725,
            "longitude": 111.2001
          }
        ]
      },
      {
        "name": "南阳市",
        "districts": [
          {
            "name": "市区",
            "latitude": 32.9908,
            "longitude": 112.5283
          }
        ]
      },
      {
        "name": "商丘市",
        "districts": [
          {
            "name": "市区",
            "latitude": 34.4142,
            "longitude": 115.6564
          }
        ]
      },
      {
        "name": "信阳市",
        "districts": [
          {
            "name": "市区",
            "latitude": 32.147,
            "longitude": 114.0928
          }
        ]
      },
      {
        "name": "周口市",
        "districts": [
          {
            "name": "市区",
            "latitude": 33.6257,
            "longitude": 114.6969
          }
        ]
      },
      {
        "name": "驻马店市",
        "districts": [
          {
            "name": "市区",
            "latitude": 33.0115,
            "longitude": 114.0223
          }
        ]
      },
      {
        "name": "济源市",
        "districts": [
          {
            "name": "市区",
            "latitude": 35.0671,
            "longitude": 112.6023
          }
        ]
      }
    ]
  },
  {
    "name": "湖北省",
    "cities": [
      {
        "name": "武汉市",
        "districts": [
          {
            "name": "江岸区",
            "latitude": 30.5998,
            "longitude": 114.3094
          },
          {
            "name": "江汉区",
            "latitude": 30.6015,
            "longitude": 114.2709
          },
          {
            "name": "硚口区",
            "latitude": 30.5822,
            "longitude": 114.2149
          },
          {
            "name": "汉阳区",
            "latitude": 30.554,
            "longitude": 114.2186
          },
          {
            "name": "武昌区",
            "latitude": 30.554,
            "longitude": 114.3162
          },
          {
            "name": "青山区",
            "latitude": 30.6399,
            "longitude": 114.3912
          },
          {
            "name": "洪山区",
            "latitude": 30.5009,
            "longitude": 114.3438
          },
          {
            "name": "东西湖区",
            "latitude": 30.6199,
            "longitude": 114.1371
          },
          {
            "name": "汉南区",
            "latitude": 30.3088,
            "longitude": 114.0846
          },
          {
            "name": "蔡甸区",
            "latitude": 30.5822,
            "longitude": 114.0293
          },
          {
            "name": "江夏区",
            "latitude": 30.3762,
            "longitude": 114.3208
          },
          {
            "name": "黄陂区",
            "latitude": 30.8823,
            "longitude": 114.3755
          },
          {
            "name": "新洲区",
            "latitude": 30.8415,
            "longitude": 114.8011
          },
          {
            "name": "市区",
            "latitude": 30.5928,
            "longitude": 114.3055
          }
        ]
      },
      {
        "name": "黄石市",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.1995,
            "longitude": 115.0385
          }
        ]
      },
      {
        "name": "十堰市",
        "districts": [
          {
            "name": "市区",
            "latitude": 32.629,
            "longitude": 110.798
          }
        ]
      },
      {
        "name": "宜昌市",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.6919,
            "longitude": 111.2865
          }
        ]
      },
      {
        "name": "襄阳市",
        "districts": [
          {
            "name": "市区",
            "latitude": 32.009,
            "longitude": 112.1224
          }
        ]
      },
      {
        "name": "鄂州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.3919,
            "longitude": 114.8948
          }
        ]
      },
      {
        "name": "荆门市",
        "districts": [
          {
            "name": "市区",
            "latitude": 31.0354,
            "longitude": 112.1993
          }
        ]
      },
      {
        "name": "孝感市",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.9246,
            "longitude": 113.9169
          }
        ]
      },
      {
        "name": "荆州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.3352,
            "longitude": 112.241
          }
        ]
      },
      {
        "name": "黄冈市",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.4539,
            "longitude": 114.8724
          }
        ]
      },
      {
        "name": "咸宁市",
        "districts": [
          {
            "name": "市区",
            "latitude": 29.8413,
            "longitude": 114.3225
          }
        ]
      },
      {
        "name": "随州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 31.6902,
            "longitude": 113.3825
          }
        ]
      },
      {
        "name": "恩施土家族苗族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.2722,
            "longitude": 109.4882
          }
        ]
      },
      {
        "name": "仙桃市",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.3619,
            "longitude": 113.4429
          }
        ]
      },
      {
        "name": "潜江市",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.4021,
            "longitude": 112.9001
          }
        ]
      },
      {
        "name": "天门市",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.6631,
            "longitude": 113.1661
          }
        ]
      },
      {
        "name": "神农架林区",
        "districts": [
          {
            "name": "市区",
            "latitude": 31.7449,
            "longitude": 110.6719
          }
        ]
      }
    ]
  },
  {
    "name": "湖南省",
    "cities": [
      {
        "name": "长沙市",
        "districts": [
          {
            "name": "芙蓉区",
            "latitude": 28.1853,
            "longitude": 113.0325
          },
          {
            "name": "天心区",
            "latitude": 28.1145,
            "longitude": 112.9899
          },
          {
            "name": "岳麓区",
            "latitude": 28.2346,
            "longitude": 112.9313
          },
          {
            "name": "开福区",
            "latitude": 28.2563,
            "longitude": 112.9858
          },
          {
            "name": "雨花区",
            "latitude": 28.1358,
            "longitude": 113.0385
          },
          {
            "name": "望城区",
            "latitude": 28.3612,
            "longitude": 112.8195
          },
          {
            "name": "长沙县",
            "latitude": 28.2467,
            "longitude": 113.0808
          },
          {
            "name": "市区",
            "latitude": 28.2282,
            "longitude": 112.9388
          }
        ]
      },
      {
        "name": "株洲市",
        "districts": [
          {
            "name": "市区",
            "latitude": 27.8274,
            "longitude": 113.1339
          }
        ]
      },
      {
        "name": "湘潭市",
        "districts": [
          {
            "name": "市区",
            "latitude": 27.8297,
            "longitude": 112.944
          }
        ]
      },
      {
        "name": "衡阳市",
        "districts": [
          {
            "name": "市区",
            "latitude": 26.8932,
            "longitude": 112.5719
          }
        ]
      },
      {
        "name": "邵阳市",
        "districts": [
          {
            "name": "市区",
            "latitude": 27.2389,
            "longitude": 111.4677
          }
        ]
      },
      {
        "name": "岳阳市",
        "districts": [
          {
            "name": "市区",
            "latitude": 29.3571,
            "longitude": 113.1289
          }
        ]
      },
      {
        "name": "常德市",
        "districts": [
          {
            "name": "市区",
            "latitude": 29.0317,
            "longitude": 111.6985
          }
        ]
      },
      {
        "name": "张家界市",
        "districts": [
          {
            "name": "市区",
            "latitude": 29.117,
            "longitude": 110.4792
          }
        ]
      },
      {
        "name": "益阳市",
        "districts": [
          {
            "name": "市区",
            "latitude": 28.5539,
            "longitude": 112.3552
          }
        ]
      },
      {
        "name": "郴州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 25.7705,
            "longitude": 113.0146
          }
        ]
      },
      {
        "name": "永州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 26.4203,
            "longitude": 111.6134
          }
        ]
      },
      {
        "name": "怀化市",
        "districts": [
          {
            "name": "市区",
            "latitude": 27.5697,
            "longitude": 109.9782
          }
        ]
      },
      {
        "name": "娄底市",
        "districts": [
          {
            "name": "市区",
            "latitude": 27.7001,
            "longitude": 111.9935
          }
        ]
      },
      {
        "name": "湘西土家族苗族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 28.3119,
            "longitude": 109.7392
          }
        ]
      }
    ]
  },
  {
    "name": "广东省",
    "cities": [
      {
        "name": "广州市",
        "districts": [
          {
            "name": "荔湾区",
            "latitude": 23.1259,
            "longitude": 113.243
          },
          {
            "name": "越秀区",
            "latitude": 23.129,
            "longitude": 113.2668
          },
          {
            "name": "海珠区",
            "latitude": 23.0838,
            "longitude": 113.3172
          },
          {
            "name": "天河区",
            "latitude": 23.1248,
            "longitude": 113.3612
          },
          {
            "name": "白云区",
            "latitude": 23.1579,
            "longitude": 113.2732
          },
          {
            "name": "黄埔区",
            "latitude": 23.1064,
            "longitude": 113.4589
          },
          {
            "name": "番禺区",
            "latitude": 22.9376,
            "longitude": 113.3841
          },
          {
            "name": "花都区",
            "latitude": 23.404,
            "longitude": 113.2203
          },
          {
            "name": "南沙区",
            "latitude": 22.8016,
            "longitude": 113.5252
          },
          {
            "name": "从化区",
            "latitude": 23.5485,
            "longitude": 113.5865
          },
          {
            "name": "增城区",
            "latitude": 23.2615,
            "longitude": 113.8295
          },
          {
            "name": "市区",
            "latitude": 23.1291,
            "longitude": 113.2644
          }
        ]
      },
      {
        "name": "深圳市",
        "districts": [
          {
            "name": "罗湖区",
            "latitude": 22.5484,
            "longitude": 114.1315
          },
          {
            "name": "福田区",
            "latitude": 22.5229,
            "longitude": 114.055
          },
          {
            "name": "南山区",
            "latitude": 22.5312,
            "longitude": 113.9304
          },
          {
            "name": "宝安区",
            "latitude": 22.5553,
            "longitude": 113.883
          },
          {
            "name": "龙岗区",
            "latitude": 22.7207,
            "longitude": 114.2478
          },
          {
            "name": "盐田区",
            "latitude": 22.557,
            "longitude": 114.2369
          },
          {
            "name": "龙华区",
            "latitude": 22.6969,
            "longitude": 114.0449
          },
          {
            "name": "坪山区",
            "latitude": 22.6905,
            "longitude": 114.3463
          },
          {
            "name": "光明区",
            "latitude": 22.749,
            "longitude": 113.9359
          },
          {
            "name": "市区",
            "latitude": 22.5431,
            "longitude": 114.0579
          }
        ]
      },
      {
        "name": "东莞市",
        "districts": [
          {
            "name": "市区",
            "latitude": 23.0207,
            "longitude": 113.7518
          }
        ]
      },
      {
        "name": "佛山市",
        "districts": [
          {
            "name": "禅城区",
            "latitude": 23.0095,
            "longitude": 113.1225
          },
          {
            "name": "南海区",
            "latitude": 23.0288,
            "longitude": 113.1429
          },
          {
            "name": "顺德区",
            "latitude": 22.8053,
            "longitude": 113.2932
          },
          {
            "name": "三水区",
            "latitude": 23.1559,
            "longitude": 112.8966
          },
          {
            "name": "高明区",
            "latitude": 22.9001,
            "longitude": 112.8925
          },
          {
            "name": "市区",
            "latitude": 23.0215,
            "longitude": 113.1216
          }
        ]
      },
      {
        "name": "韶关市",
        "districts": [
          {
            "name": "市区",
            "latitude": 24.8104,
            "longitude": 113.5972
          }
        ]
      },
      {
        "name": "珠海市",
        "districts": [
          {
            "name": "市区",
            "latitude": 22.2707,
            "longitude": 113.5767
          }
        ]
      },
      {
        "name": "汕头市",
        "districts": [
          {
            "name": "市区",
            "latitude": 23.3541,
            "longitude": 116.682
          }
        ]
      },
      {
        "name": "湛江市",
        "districts": [
          {
            "name": "市区",
            "latitude": 21.2713,
            "longitude": 110.3594
          }
        ]
      },
      {
        "name": "肇庆市",
        "districts": [
          {
            "name": "市区",
            "latitude": 23.0472,
            "longitude": 112.4651
          }
        ]
      },
      {
        "name": "江门市",
        "districts": [
          {
            "name": "市区",
            "latitude": 22.5787,
            "longitude": 113.0815
          }
        ]
      },
      {
        "name": "茂名市",
        "districts": [
          {
            "name": "市区",
            "latitude": 21.6629,
            "longitude": 110.9254
          }
        ]
      },
      {
        "name": "惠州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 23.1115,
            "longitude": 114.4152
          }
        ]
      },
      {
        "name": "梅州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 24.2888,
            "longitude": 116.1222
          }
        ]
      },
      {
        "name": "汕尾市",
        "districts": [
          {
            "name": "市区",
            "latitude": 22.7862,
            "longitude": 115.3751
          }
        ]
      },
      {
        "name": "河源市",
        "districts": [
          {
            "name": "市区",
            "latitude": 23.7435,
            "longitude": 114.6978
          }
        ]
      },
      {
        "name": "阳江市",
        "districts": [
          {
            "name": "市区",
            "latitude": 21.8579,
            "longitude": 111.9822
          }
        ]
      },
      {
        "name": "清远市",
        "districts": [
          {
            "name": "市区",
            "latitude": 23.6818,
            "longitude": 113.056
          }
        ]
      },
      {
        "name": "中山市",
        "districts": [
          {
            "name": "市区",
            "latitude": 22.517,
            "longitude": 113.3926
          }
        ]
      },
      {
        "name": "潮州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 23.6569,
            "longitude": 116.6226
          }
        ]
      },
      {
        "name": "揭阳市",
        "districts": [
          {
            "name": "市区",
            "latitude": 23.5497,
            "longitude": 116.3727
          }
        ]
      },
      {
        "name": "云浮市",
        "districts": [
          {
            "name": "市区",
            "latitude": 22.9151,
            "longitude": 112.0445
          }
        ]
      }
    ]
  },
  {
    "name": "广西壮族自治区",
    "cities": [
      {
        "name": "南宁市",
        "districts": [
          {
            "name": "兴宁区",
            "latitude": 22.8195,
            "longitude": 108.3689
          },
          {
            "name": "青秀区",
            "latitude": 22.7853,
            "longitude": 108.494
          },
          {
            "name": "江南区",
            "latitude": 22.7814,
            "longitude": 108.2732
          },
          {
            "name": "西乡塘区",
            "latitude": 22.8339,
            "longitude": 108.3135
          },
          {
            "name": "良庆区",
            "latitude": 22.7544,
            "longitude": 108.3223
          },
          {
            "name": "邕宁区",
            "latitude": 22.7581,
            "longitude": 108.4874
          },
          {
            "name": "市区",
            "latitude": 22.817,
            "longitude": 108.3665
          }
        ]
      },
      {
        "name": "柳州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 24.3146,
            "longitude": 109.4281
          }
        ]
      },
      {
        "name": "桂林市",
        "districts": [
          {
            "name": "市区",
            "latitude": 25.2736,
            "longitude": 110.29
          }
        ]
      },
      {
        "name": "梧州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 23.4769,
            "longitude": 111.2791
          }
        ]
      },
      {
        "name": "北海市",
        "districts": [
          {
            "name": "市区",
            "latitude": 21.4733,
            "longitude": 109.1201
          }
        ]
      },
      {
        "name": "防城港市",
        "districts": [
          {
            "name": "市区",
            "latitude": 21.6867,
            "longitude": 108.3539
          }
        ]
      },
      {
        "name": "钦州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 21.9799,
            "longitude": 108.6541
          }
        ]
      },
      {
        "name": "贵港市",
        "districts": [
          {
            "name": "市区",
            "latitude": 23.1115,
            "longitude": 109.5989
          }
        ]
      },
      {
        "name": "玉林市",
        "districts": [
          {
            "name": "市区",
            "latitude": 22.6364,
            "longitude": 110.181
          }
        ]
      },
      {
        "name": "百色市",
        "districts": [
          {
            "name": "市区",
            "latitude": 23.9022,
            "longitude": 106.6182
          }
        ]
      },
      {
        "name": "贺州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 24.4141,
            "longitude": 111.5666
          }
        ]
      },
      {
        "name": "河池市",
        "districts": [
          {
            "name": "市区",
            "latitude": 24.6929,
            "longitude": 108.0853
          }
        ]
      },
      {
        "name": "来宾市",
        "districts": [
          {
            "name": "市区",
            "latitude": 23.7503,
            "longitude": 109.2212
          }
        ]
      },
      {
        "name": "崇左市",
        "districts": [
          {
            "name": "市区",
            "latitude": 22.3771,
            "longitude": 107.3647
          }
        ]
      }
    ]
  },
  {
    "name": "海南省",
    "cities": [
      {
        "name": "海口市",
        "districts": [
          {
            "name": "秀英区",
            "latitude": 20.0075,
            "longitude": 110.2936
          },
          {
            "name": "龙华区",
            "latitude": 20.031,
            "longitude": 110.3019
          },
          {
            "name": "琼山区",
            "latitude": 20.0038,
            "longitude": 110.3547
          },
          {
            "name": "美兰区",
            "latitude": 20.0287,
            "longitude": 110.3665
          },
          {
            "name": "市区",
            "latitude": 20.0444,
            "longitude": 110.1999
          }
        ]
      },
      {
        "name": "三亚市",
        "districts": [
          {
            "name": "海棠区",
            "latitude": 18.4001,
            "longitude": 109.7525
          },
          {
            "name": "吉阳区",
            "latitude": 18.2473,
            "longitude": 109.5783
          },
          {
            "name": "天涯区",
            "latitude": 18.2473,
            "longitude": 109.4526
          },
          {
            "name": "崖州区",
            "latitude": 18.3573,
            "longitude": 109.1718
          },
          {
            "name": "市区",
            "latitude": 18.2528,
            "longitude": 109.5119
          }
        ]
      },
      {
        "name": "三沙市",
        "districts": [
          {
            "name": "市区",
            "latitude": 16.831,
            "longitude": 112.3386
          }
        ]
      },
      {
        "name": "儋州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 19.5211,
            "longitude": 109.5807
          }
        ]
      },
      {
        "name": "五指山市",
        "districts": [
          {
            "name": "市区",
            "latitude": 18.7751,
            "longitude": 109.5169
          }
        ]
      },
      {
        "name": "琼海市",
        "districts": [
          {
            "name": "市区",
            "latitude": 19.2584,
            "longitude": 110.4746
          }
        ]
      },
      {
        "name": "文昌市",
        "districts": [
          {
            "name": "市区",
            "latitude": 19.5432,
            "longitude": 110.7978
          }
        ]
      },
      {
        "name": "万宁市",
        "districts": [
          {
            "name": "市区",
            "latitude": 18.7952,
            "longitude": 110.3926
          }
        ]
      },
      {
        "name": "东方市",
        "districts": [
          {
            "name": "市区",
            "latitude": 19.0952,
            "longitude": 108.6538
          }
        ]
      },
      {
        "name": "定安县",
        "districts": [
          {
            "name": "市区",
            "latitude": 19.6815,
            "longitude": 110.3594
          }
        ]
      },
      {
        "name": "屯昌县",
        "districts": [
          {
            "name": "市区",
            "latitude": 19.3517,
            "longitude": 110.1035
          }
        ]
      },
      {
        "name": "澄迈县",
        "districts": [
          {
            "name": "市区",
            "latitude": 19.7385,
            "longitude": 110.0068
          }
        ]
      },
      {
        "name": "临高县",
        "districts": [
          {
            "name": "市区",
            "latitude": 19.912,
            "longitude": 109.6905
          }
        ]
      },
      {
        "name": "白沙黎族自治县",
        "districts": [
          {
            "name": "市区",
            "latitude": 19.2248,
            "longitude": 109.4515
          }
        ]
      },
      {
        "name": "昌江黎族自治县",
        "districts": [
          {
            "name": "市区",
            "latitude": 19.298,
            "longitude": 109.0557
          }
        ]
      },
      {
        "name": "乐东黎族自治县",
        "districts": [
          {
            "name": "市区",
            "latitude": 18.75,
            "longitude": 109.173
          }
        ]
      },
      {
        "name": "陵水黎族自治县",
        "districts": [
          {
            "name": "市区",
            "latitude": 18.506,
            "longitude": 110.0375
          }
        ]
      },
      {
        "name": "保亭黎族苗族自治县",
        "districts": [
          {
            "name": "市区",
            "latitude": 18.639,
            "longitude": 109.7025
          }
        ]
      },
      {
        "name": "琼中黎族苗族自治县",
        "districts": [
          {
            "name": "市区",
            "latitude": 19.0334,
            "longitude": 109.8384
          }
        ]
      }
    ]
  },
  {
    "name": "重庆市",
    "cities": [
      {
        "name": "重庆市",
        "districts": [
          {
            "name": "万州区",
            "latitude": 30.8078,
            "longitude": 108.4087
          },
          {
            "name": "涪陵区",
            "latitude": 29.703,
            "longitude": 107.3893
          },
          {
            "name": "渝中区",
            "latitude": 29.5567,
            "longitude": 106.569
          },
          {
            "name": "大渡口区",
            "latitude": 29.4845,
            "longitude": 106.4823
          },
          {
            "name": "江北区",
            "latitude": 29.6067,
            "longitude": 106.5743
          },
          {
            "name": "沙坪坝区",
            "latitude": 29.5411,
            "longitude": 106.4569
          },
          {
            "name": "九龙坡区",
            "latitude": 29.5023,
            "longitude": 106.5114
          },
          {
            "name": "南岸区",
            "latitude": 29.5231,
            "longitude": 106.6444
          },
          {
            "name": "北碚区",
            "latitude": 29.805,
            "longitude": 106.4379
          },
          {
            "name": "綦江区",
            "latitude": 29.0281,
            "longitude": 106.6514
          },
          {
            "name": "大足区",
            "latitude": 29.707,
            "longitude": 105.7217
          },
          {
            "name": "渝北区",
            "latitude": 29.7181,
            "longitude": 106.6312
          },
          {
            "name": "巴南区",
            "latitude": 29.4024,
            "longitude": 106.5407
          },
          {
            "name": "黔江区",
            "latitude": 29.5335,
            "longitude": 108.7707
          },
          {
            "name": "长寿区",
            "latitude": 29.8579,
            "longitude": 107.081
          },
          {
            "name": "江津区",
            "latitude": 29.2901,
            "longitude": 106.2593
          },
          {
            "name": "合川区",
            "latitude": 29.9723,
            "longitude": 106.2761
          },
          {
            "name": "永川区",
            "latitude": 29.356,
            "longitude": 105.927
          },
          {
            "name": "南川区",
            "latitude": 29.1579,
            "longitude": 107.0993
          },
          {
            "name": "璧山区",
            "latitude": 29.592,
            "longitude": 106.2273
          },
          {
            "name": "铜梁区",
            "latitude": 29.8448,
            "longitude": 106.0564
          },
          {
            "name": "潼南区",
            "latitude": 30.1905,
            "longitude": 105.8401
          },
          {
            "name": "荣昌区",
            "latitude": 29.4049,
            "longitude": 105.5946
          },
          {
            "name": "开州区",
            "latitude": 31.1609,
            "longitude": 108.3933
          },
          {
            "name": "梁平区",
            "latitude": 30.6737,
            "longitude": 107.8024
          },
          {
            "name": "武隆区",
            "latitude": 29.3254,
            "longitude": 107.76
          },
          {
            "name": "市区",
            "latitude": 29.563,
            "longitude": 106.5516
          }
        ]
      }
    ]
  },
  {
    "name": "四川省",
    "cities": [
      {
        "name": "成都市",
        "districts": [
          {
            "name": "锦江区",
            "latitude": 30.6574,
            "longitude": 104.0806
          },
          {
            "name": "青羊区",
            "latitude": 30.6739,
            "longitude": 104.0614
          },
          {
            "name": "金牛区",
            "latitude": 30.6914,
            "longitude": 104.0522
          },
          {
            "name": "武侯区",
            "latitude": 30.6416,
            "longitude": 104.043
          },
          {
            "name": "成华区",
            "latitude": 30.66,
            "longitude": 104.1015
          },
          {
            "name": "龙泉驿区",
            "latitude": 30.5567,
            "longitude": 104.2746
          },
          {
            "name": "青白江区",
            "latitude": 30.8784,
            "longitude": 104.2513
          },
          {
            "name": "新都区",
            "latitude": 30.8231,
            "longitude": 104.1587
          },
          {
            "name": "温江区",
            "latitude": 30.6822,
            "longitude": 103.8484
          },
          {
            "name": "双流区",
            "latitude": 30.5745,
            "longitude": 103.9236
          },
          {
            "name": "郫都区",
            "latitude": 30.7955,
            "longitude": 103.9011
          },
          {
            "name": "新津区",
            "latitude": 30.4159,
            "longitude": 103.8114
          },
          {
            "name": "都江堰市",
            "latitude": 30.9888,
            "longitude": 103.6473
          },
          {
            "name": "彭州市",
            "latitude": 30.9902,
            "longitude": 103.958
          },
          {
            "name": "邛崃市",
            "latitude": 30.4103,
            "longitude": 103.4644
          },
          {
            "name": "崇州市",
            "latitude": 30.6301,
            "longitude": 103.6728
          },
          {
            "name": "简阳市",
            "latitude": 30.4113,
            "longitude": 104.5473
          },
          {
            "name": "市区",
            "latitude": 30.5728,
            "longitude": 104.0665
          }
        ]
      },
      {
        "name": "自贡市",
        "districts": [
          {
            "name": "市区",
            "latitude": 29.3392,
            "longitude": 104.7784
          }
        ]
      },
      {
        "name": "攀枝花市",
        "districts": [
          {
            "name": "市区",
            "latitude": 26.5823,
            "longitude": 101.7186
          }
        ]
      },
      {
        "name": "泸州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 28.8718,
            "longitude": 105.4423
          }
        ]
      },
      {
        "name": "德阳市",
        "districts": [
          {
            "name": "市区",
            "latitude": 31.127,
            "longitude": 104.3979
          }
        ]
      },
      {
        "name": "绵阳市",
        "districts": [
          {
            "name": "市区",
            "latitude": 31.4675,
            "longitude": 104.6791
          }
        ]
      },
      {
        "name": "广元市",
        "districts": [
          {
            "name": "市区",
            "latitude": 32.4355,
            "longitude": 105.8434
          }
        ]
      },
      {
        "name": "遂宁市",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.5329,
            "longitude": 105.5929
          }
        ]
      },
      {
        "name": "内江市",
        "districts": [
          {
            "name": "市区",
            "latitude": 29.5802,
            "longitude": 105.0584
          }
        ]
      },
      {
        "name": "乐山市",
        "districts": [
          {
            "name": "市区",
            "latitude": 29.5521,
            "longitude": 103.7657
          }
        ]
      },
      {
        "name": "南充市",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.8373,
            "longitude": 106.1107
          }
        ]
      },
      {
        "name": "眉山市",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.0754,
            "longitude": 103.8485
          }
        ]
      },
      {
        "name": "宜宾市",
        "districts": [
          {
            "name": "市区",
            "latitude": 28.7518,
            "longitude": 104.6432
          }
        ]
      },
      {
        "name": "广安市",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.4564,
            "longitude": 106.6333
          }
        ]
      },
      {
        "name": "达州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 31.2096,
            "longitude": 107.468
          }
        ]
      },
      {
        "name": "雅安市",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.0104,
            "longitude": 103.0424
          }
        ]
      },
      {
        "name": "巴中市",
        "districts": [
          {
            "name": "市区",
            "latitude": 31.8679,
            "longitude": 106.7475
          }
        ]
      },
      {
        "name": "资阳市",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.1286,
            "longitude": 104.6276
          }
        ]
      },
      {
        "name": "阿坝藏族羌族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 31.8994,
            "longitude": 102.2214
          }
        ]
      },
      {
        "name": "甘孜藏族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 30.0495,
            "longitude": 101.9623
          }
        ]
      },
      {
        "name": "凉山彝族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 27.8816,
            "longitude": 102.2673
          }
        ]
      }
    ]
  },
  {
    "name": "贵州省",
    "cities": [
      {
        "name": "贵阳市",
        "districts": [
          {
            "name": "南明区",
            "latitude": 26.5682,
            "longitude": 106.7145
          },
          {
            "name": "云岩区",
            "latitude": 26.6046,
            "longitude": 106.7244
          },
          {
            "name": "花溪区",
            "latitude": 26.4105,
            "longitude": 106.6703
          },
          {
            "name": "乌当区",
            "latitude": 26.6309,
            "longitude": 106.7506
          },
          {
            "name": "白云区",
            "latitude": 26.6786,
            "longitude": 106.623
          },
          {
            "name": "观山湖区",
            "latitude": 26.6009,
            "longitude": 106.6229
          },
          {
            "name": "市区",
            "latitude": 26.647,
            "longitude": 106.6302
          }
        ]
      },
      {
        "name": "六盘水市",
        "districts": [
          {
            "name": "市区",
            "latitude": 26.5927,
            "longitude": 104.8302
          }
        ]
      },
      {
        "name": "遵义市",
        "districts": [
          {
            "name": "市区",
            "latitude": 27.7257,
            "longitude": 106.9272
          }
        ]
      },
      {
        "name": "安顺市",
        "districts": [
          {
            "name": "市区",
            "latitude": 26.2455,
            "longitude": 105.9476
          }
        ]
      },
      {
        "name": "毕节市",
        "districts": [
          {
            "name": "市区",
            "latitude": 27.3017,
            "longitude": 105.285
          }
        ]
      },
      {
        "name": "铜仁市",
        "districts": [
          {
            "name": "市区",
            "latitude": 27.7315,
            "longitude": 109.1895
          }
        ]
      },
      {
        "name": "黔西南布依族苗族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 25.088,
            "longitude": 104.906
          }
        ]
      },
      {
        "name": "黔东南苗族侗族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 26.5835,
            "longitude": 107.9828
          }
        ]
      },
      {
        "name": "黔南布依族苗族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 26.2541,
            "longitude": 107.5221
          }
        ]
      }
    ]
  },
  {
    "name": "云南省",
    "cities": [
      {
        "name": "昆明市",
        "districts": [
          {
            "name": "五华区",
            "latitude": 25.0424,
            "longitude": 102.7072
          },
          {
            "name": "盘龙区",
            "latitude": 25.1165,
            "longitude": 102.7519
          },
          {
            "name": "官渡区",
            "latitude": 25.0151,
            "longitude": 102.7544
          },
          {
            "name": "西山区",
            "latitude": 25.0385,
            "longitude": 102.6644
          },
          {
            "name": "东川区",
            "latitude": 26.0829,
            "longitude": 103.1879
          },
          {
            "name": "呈贡区",
            "latitude": 24.8893,
            "longitude": 102.8014
          },
          {
            "name": "市区",
            "latitude": 25.0389,
            "longitude": 102.7183
          }
        ]
      },
      {
        "name": "曲靖市",
        "districts": [
          {
            "name": "市区",
            "latitude": 25.49,
            "longitude": 103.7962
          }
        ]
      },
      {
        "name": "玉溪市",
        "districts": [
          {
            "name": "市区",
            "latitude": 24.3473,
            "longitude": 102.5465
          }
        ]
      },
      {
        "name": "保山市",
        "districts": [
          {
            "name": "市区",
            "latitude": 25.112,
            "longitude": 99.1618
          }
        ]
      },
      {
        "name": "昭通市",
        "districts": [
          {
            "name": "市区",
            "latitude": 27.3382,
            "longitude": 103.7173
          }
        ]
      },
      {
        "name": "丽江市",
        "districts": [
          {
            "name": "市区",
            "latitude": 26.855,
            "longitude": 100.227
          }
        ]
      },
      {
        "name": "普洱市",
        "districts": [
          {
            "name": "市区",
            "latitude": 22.8252,
            "longitude": 100.966
          }
        ]
      },
      {
        "name": "临沧市",
        "districts": [
          {
            "name": "市区",
            "latitude": 23.8776,
            "longitude": 100.0888
          }
        ]
      },
      {
        "name": "楚雄彝族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 25.0457,
            "longitude": 101.528
          }
        ]
      },
      {
        "name": "红河哈尼族彝族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 23.3641,
            "longitude": 103.3755
          }
        ]
      },
      {
        "name": "文山壮族苗族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 23.4007,
            "longitude": 104.2162
          }
        ]
      },
      {
        "name": "西双版纳傣族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 22.0074,
            "longitude": 100.7971
          }
        ]
      },
      {
        "name": "大理白族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 25.6065,
            "longitude": 100.2676
          }
        ]
      },
      {
        "name": "德宏傣族景颇族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 24.4332,
            "longitude": 98.5849
          }
        ]
      },
      {
        "name": "怒江傈僳族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 25.8174,
            "longitude": 98.8566
          }
        ]
      },
      {
        "name": "迪庆藏族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 27.8191,
            "longitude": 99.7032
          }
        ]
      }
    ]
  },
  {
    "name": "西藏自治区",
    "cities": [
      {
        "name": "拉萨市",
        "districts": [
          {
            "name": "城关区",
            "latitude": 29.6572,
            "longitude": 91.1404
          },
          {
            "name": "堆龙德庆区",
            "latitude": 29.6474,
            "longitude": 90.9965
          },
          {
            "name": "达孜区",
            "latitude": 29.67,
            "longitude": 91.3501
          },
          {
            "name": "市区",
            "latitude": 29.6525,
            "longitude": 91.1721
          }
        ]
      },
      {
        "name": "日喀则市",
        "districts": [
          {
            "name": "市区",
            "latitude": 29.2673,
            "longitude": 88.8806
          }
        ]
      },
      {
        "name": "昌都市",
        "districts": [
          {
            "name": "市区",
            "latitude": 31.1406,
            "longitude": 97.172
          }
        ]
      },
      {
        "name": "林芝市",
        "districts": [
          {
            "name": "市区",
            "latitude": 29.6491,
            "longitude": 94.3614
          }
        ]
      },
      {
        "name": "山南市",
        "districts": [
          {
            "name": "市区",
            "latitude": 29.2371,
            "longitude": 91.7731
          }
        ]
      },
      {
        "name": "那曲市",
        "districts": [
          {
            "name": "市区",
            "latitude": 31.4762,
            "longitude": 92.0512
          }
        ]
      },
      {
        "name": "阿里地区",
        "districts": [
          {
            "name": "市区",
            "latitude": 32.5011,
            "longitude": 80.1055
          }
        ]
      }
    ]
  },
  {
    "name": "陕西省",
    "cities": [
      {
        "name": "西安市",
        "districts": [
          {
            "name": "新城区",
            "latitude": 34.2664,
            "longitude": 108.9607
          },
          {
            "name": "碑林区",
            "latitude": 34.2304,
            "longitude": 108.9343
          },
          {
            "name": "莲湖区",
            "latitude": 34.2656,
            "longitude": 108.9402
          },
          {
            "name": "灞桥区",
            "latitude": 34.2727,
            "longitude": 109.0645
          },
          {
            "name": "未央区",
            "latitude": 34.2929,
            "longitude": 108.9468
          },
          {
            "name": "雁塔区",
            "latitude": 34.2147,
            "longitude": 108.9487
          },
          {
            "name": "阎良区",
            "latitude": 34.6622,
            "longitude": 109.2261
          },
          {
            "name": "临潼区",
            "latitude": 34.3669,
            "longitude": 109.2142
          },
          {
            "name": "长安区",
            "latitude": 34.1588,
            "longitude": 108.9415
          },
          {
            "name": "高陵区",
            "latitude": 34.535,
            "longitude": 109.0882
          },
          {
            "name": "鄠邑区",
            "latitude": 34.1086,
            "longitude": 108.6051
          },
          {
            "name": "市区",
            "latitude": 34.3416,
            "longitude": 108.9398
          }
        ]
      },
      {
        "name": "铜川市",
        "districts": [
          {
            "name": "市区",
            "latitude": 34.8966,
            "longitude": 108.9452
          }
        ]
      },
      {
        "name": "宝鸡市",
        "districts": [
          {
            "name": "市区",
            "latitude": 34.3619,
            "longitude": 107.2372
          }
        ]
      },
      {
        "name": "咸阳市",
        "districts": [
          {
            "name": "市区",
            "latitude": 34.3293,
            "longitude": 108.709
          }
        ]
      },
      {
        "name": "渭南市",
        "districts": [
          {
            "name": "市区",
            "latitude": 34.4994,
            "longitude": 109.5098
          }
        ]
      },
      {
        "name": "延安市",
        "districts": [
          {
            "name": "市区",
            "latitude": 36.5855,
            "longitude": 109.4897
          }
        ]
      },
      {
        "name": "汉中市",
        "districts": [
          {
            "name": "市区",
            "latitude": 33.0675,
            "longitude": 107.0232
          }
        ]
      },
      {
        "name": "榆林市",
        "districts": [
          {
            "name": "市区",
            "latitude": 38.2854,
            "longitude": 109.7346
          }
        ]
      },
      {
        "name": "安康市",
        "districts": [
          {
            "name": "市区",
            "latitude": 32.6849,
            "longitude": 109.0293
          }
        ]
      },
      {
        "name": "商洛市",
        "districts": [
          {
            "name": "市区",
            "latitude": 33.8704,
            "longitude": 109.9403
          }
        ]
      }
    ]
  },
  {
    "name": "甘肃省",
    "cities": [
      {
        "name": "兰州市",
        "districts": [
          {
            "name": "城关区",
            "latitude": 36.0574,
            "longitude": 103.8253
          },
          {
            "name": "七里河区",
            "latitude": 36.0667,
            "longitude": 103.7856
          },
          {
            "name": "西固区",
            "latitude": 36.0885,
            "longitude": 103.6282
          },
          {
            "name": "安宁区",
            "latitude": 36.1045,
            "longitude": 103.7191
          },
          {
            "name": "红古区",
            "latitude": 36.3456,
            "longitude": 102.8597
          },
          {
            "name": "市区",
            "latitude": 36.0611,
            "longitude": 103.8343
          }
        ]
      },
      {
        "name": "嘉峪关市",
        "districts": [
          {
            "name": "市区",
            "latitude": 39.7732,
            "longitude": 98.2882
          }
        ]
      },
      {
        "name": "金昌市",
        "districts": [
          {
            "name": "市区",
            "latitude": 38.5201,
            "longitude": 102.1879
          }
        ]
      },
      {
        "name": "白银市",
        "districts": [
          {
            "name": "市区",
            "latitude": 36.5447,
            "longitude": 104.1376
          }
        ]
      },
      {
        "name": "天水市",
        "districts": [
          {
            "name": "市区",
            "latitude": 34.5809,
            "longitude": 105.7249
          }
        ]
      },
      {
        "name": "武威市",
        "districts": [
          {
            "name": "市区",
            "latitude": 37.9283,
            "longitude": 102.6382
          }
        ]
      },
      {
        "name": "张掖市",
        "districts": [
          {
            "name": "市区",
            "latitude": 38.9259,
            "longitude": 100.4498
          }
        ]
      },
      {
        "name": "平凉市",
        "districts": [
          {
            "name": "市区",
            "latitude": 35.543,
            "longitude": 106.665
          }
        ]
      },
      {
        "name": "酒泉市",
        "districts": [
          {
            "name": "市区",
            "latitude": 39.7324,
            "longitude": 98.494
          }
        ]
      },
      {
        "name": "庆阳市",
        "districts": [
          {
            "name": "市区",
            "latitude": 35.709,
            "longitude": 107.6436
          }
        ]
      },
      {
        "name": "定西市",
        "districts": [
          {
            "name": "市区",
            "latitude": 35.5806,
            "longitude": 104.6263
          }
        ]
      },
      {
        "name": "陇南市",
        "districts": [
          {
            "name": "市区",
            "latitude": 33.4007,
            "longitude": 104.9218
          }
        ]
      },
      {
        "name": "临夏回族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 35.6012,
            "longitude": 103.2105
          }
        ]
      },
      {
        "name": "甘南藏族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 34.9833,
            "longitude": 102.911
          }
        ]
      }
    ]
  },
  {
    "name": "青海省",
    "cities": [
      {
        "name": "西宁市",
        "districts": [
          {
            "name": "城东区",
            "latitude": 36.6001,
            "longitude": 101.8037
          },
          {
            "name": "城中区",
            "latitude": 36.6212,
            "longitude": 101.7849
          },
          {
            "name": "城西区",
            "latitude": 36.6283,
            "longitude": 101.7659
          },
          {
            "name": "城北区",
            "latitude": 36.6485,
            "longitude": 101.7662
          },
          {
            "name": "市区",
            "latitude": 36.6171,
            "longitude": 101.7782
          }
        ]
      },
      {
        "name": "海东市",
        "districts": [
          {
            "name": "市区",
            "latitude": 36.5021,
            "longitude": 102.1043
          }
        ]
      },
      {
        "name": "海北藏族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 36.9544,
            "longitude": 100.901
          }
        ]
      },
      {
        "name": "黄南藏族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 35.5195,
            "longitude": 102.0152
          }
        ]
      },
      {
        "name": "海南藏族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 36.2864,
            "longitude": 100.6204
          }
        ]
      },
      {
        "name": "果洛藏族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 34.4714,
            "longitude": 100.2448
          }
        ]
      },
      {
        "name": "玉树藏族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 33.0042,
            "longitude": 97.0085
          }
        ]
      },
      {
        "name": "海西蒙古族藏族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 37.3771,
            "longitude": 97.3698
          }
        ]
      }
    ]
  },
  {
    "name": "宁夏回族自治区",
    "cities": [
      {
        "name": "银川市",
        "districts": [
          {
            "name": "兴庆区",
            "latitude": 38.4736,
            "longitude": 106.2886
          },
          {
            "name": "西夏区",
            "latitude": 38.4924,
            "longitude": 106.155
          },
          {
            "name": "金凤区",
            "latitude": 38.4733,
            "longitude": 106.2426
          },
          {
            "name": "市区",
            "latitude": 38.4872,
            "longitude": 106.2309
          }
        ]
      },
      {
        "name": "石嘴山市",
        "districts": [
          {
            "name": "市区",
            "latitude": 39.0193,
            "longitude": 106.3762
          }
        ]
      },
      {
        "name": "吴忠市",
        "districts": [
          {
            "name": "市区",
            "latitude": 37.9977,
            "longitude": 106.1986
          }
        ]
      },
      {
        "name": "固原市",
        "districts": [
          {
            "name": "市区",
            "latitude": 36.0159,
            "longitude": 106.2426
          }
        ]
      },
      {
        "name": "中卫市",
        "districts": [
          {
            "name": "市区",
            "latitude": 37.5002,
            "longitude": 105.1968
          }
        ]
      }
    ]
  },
  {
    "name": "新疆维吾尔自治区",
    "cities": [
      {
        "name": "乌鲁木齐市",
        "districts": [
          {
            "name": "天山区",
            "latitude": 43.7944,
            "longitude": 87.6317
          },
          {
            "name": "沙依巴克区",
            "latitude": 43.8012,
            "longitude": 87.5981
          },
          {
            "name": "新市区",
            "latitude": 43.8554,
            "longitude": 87.5745
          },
          {
            "name": "水磨沟区",
            "latitude": 43.8325,
            "longitude": 87.6421
          },
          {
            "name": "头屯河区",
            "latitude": 43.8762,
            "longitude": 87.4258
          },
          {
            "name": "达坂城区",
            "latitude": 43.3629,
            "longitude": 88.311
          },
          {
            "name": "米东区",
            "latitude": 43.9756,
            "longitude": 87.6552
          },
          {
            "name": "市区",
            "latitude": 43.8256,
            "longitude": 87.6168
          }
        ]
      },
      {
        "name": "克拉玛依市",
        "districts": [
          {
            "name": "市区",
            "latitude": 45.5798,
            "longitude": 84.8892
          }
        ]
      },
      {
        "name": "吐鲁番市",
        "districts": [
          {
            "name": "市区",
            "latitude": 42.9513,
            "longitude": 89.1895
          }
        ]
      },
      {
        "name": "哈密市",
        "districts": [
          {
            "name": "市区",
            "latitude": 42.8193,
            "longitude": 93.515
          }
        ]
      },
      {
        "name": "昌吉回族自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 44.0112,
            "longitude": 87.3082
          }
        ]
      },
      {
        "name": "博尔塔拉蒙古自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 44.906,
            "longitude": 82.0664
          }
        ]
      },
      {
        "name": "巴音郭楞蒙古自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 41.7641,
            "longitude": 86.1452
          }
        ]
      },
      {
        "name": "阿克苏地区",
        "districts": [
          {
            "name": "市区",
            "latitude": 41.1688,
            "longitude": 80.2606
          }
        ]
      },
      {
        "name": "克孜勒苏柯尔克孜自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 39.7145,
            "longitude": 76.1728
          }
        ]
      },
      {
        "name": "喀什地区",
        "districts": [
          {
            "name": "市区",
            "latitude": 39.4681,
            "longitude": 75.9938
          }
        ]
      },
      {
        "name": "和田地区",
        "districts": [
          {
            "name": "市区",
            "latitude": 37.1142,
            "longitude": 79.9222
          }
        ]
      },
      {
        "name": "伊犁哈萨克自治州",
        "districts": [
          {
            "name": "市区",
            "latitude": 43.9169,
            "longitude": 81.3241
          }
        ]
      },
      {
        "name": "塔城地区",
        "districts": [
          {
            "name": "市区",
            "latitude": 46.7454,
            "longitude": 82.9803
          }
        ]
      },
      {
        "name": "阿勒泰地区",
        "districts": [
          {
            "name": "市区",
            "latitude": 47.8484,
            "longitude": 88.1396
          }
        ]
      },
      {
        "name": "石河子市",
        "districts": [
          {
            "name": "市区",
            "latitude": 44.3061,
            "longitude": 86.0804
          }
        ]
      },
      {
        "name": "阿拉尔市",
        "districts": [
          {
            "name": "市区",
            "latitude": 40.5472,
            "longitude": 81.2807
          }
        ]
      },
      {
        "name": "图木舒克市",
        "districts": [
          {
            "name": "市区",
            "latitude": 39.8649,
            "longitude": 79.074
          }
        ]
      },
      {
        "name": "五家渠市",
        "districts": [
          {
            "name": "市区",
            "latitude": 44.167,
            "longitude": 87.5429
          }
        ]
      },
      {
        "name": "北屯市",
        "districts": [
          {
            "name": "市区",
            "latitude": 47.3532,
            "longitude": 87.8089
          }
        ]
      },
      {
        "name": "铁门关市",
        "districts": [
          {
            "name": "市区",
            "latitude": 41.8273,
            "longitude": 85.6695
          }
        ]
      },
      {
        "name": "双河市",
        "districts": [
          {
            "name": "市区",
            "latitude": 44.8403,
            "longitude": 82.3537
          }
        ]
      },
      {
        "name": "可克达拉市",
        "districts": [
          {
            "name": "市区",
            "latitude": 43.9448,
            "longitude": 80.9942
          }
        ]
      },
      {
        "name": "昆玉市",
        "districts": [
          {
            "name": "市区",
            "latitude": 37.215,
            "longitude": 79.2871
          }
        ]
      },
      {
        "name": "胡杨河市",
        "districts": [
          {
            "name": "市区",
            "latitude": 44.6928,
            "longitude": 84.8276
          }
        ]
      }
    ]
  },
  {
    "name": "香港特别行政区",
    "cities": [
      {
        "name": "香港",
        "districts": [
          {
            "name": "中西区",
            "latitude": 22.2828,
            "longitude": 114.1558
          },
          {
            "name": "湾仔区",
            "latitude": 22.2764,
            "longitude": 114.1826
          },
          {
            "name": "东区",
            "latitude": 22.284,
            "longitude": 114.2241
          },
          {
            "name": "南区",
            "latitude": 22.2478,
            "longitude": 114.1588
          },
          {
            "name": "油尖旺区",
            "latitude": 22.3119,
            "longitude": 114.1709
          },
          {
            "name": "深水埗区",
            "latitude": 22.3307,
            "longitude": 114.1622
          },
          {
            "name": "九龙城区",
            "latitude": 22.3125,
            "longitude": 114.1915
          },
          {
            "name": "黄大仙区",
            "latitude": 22.343,
            "longitude": 114.2039
          },
          {
            "name": "观塘区",
            "latitude": 22.3133,
            "longitude": 114.2257
          },
          {
            "name": "荃湾区",
            "latitude": 22.3714,
            "longitude": 114.1146
          },
          {
            "name": "屯门区",
            "latitude": 22.3913,
            "longitude": 113.977
          },
          {
            "name": "元朗区",
            "latitude": 22.4456,
            "longitude": 114.0222
          },
          {
            "name": "北区",
            "latitude": 22.4947,
            "longitude": 114.1381
          },
          {
            "name": "大埔区",
            "latitude": 22.4509,
            "longitude": 114.1643
          },
          {
            "name": "西贡区",
            "latitude": 22.382,
            "longitude": 114.2733
          },
          {
            "name": "沙田区",
            "latitude": 22.3872,
            "longitude": 114.1917
          },
          {
            "name": "葵青区",
            "latitude": 22.3638,
            "longitude": 114.1311
          },
          {
            "name": "离岛区",
            "latitude": 22.2864,
            "longitude": 113.9451
          },
          {
            "name": "市区",
            "latitude": 22.3193,
            "longitude": 114.1694
          }
        ]
      }
    ]
  },
  {
    "name": "澳门特别行政区",
    "cities": [
      {
        "name": "澳门",
        "districts": [
          {
            "name": "花地玛堂区",
            "latitude": 22.207,
            "longitude": 113.5519
          },
          {
            "name": "圣安多尼堂区",
            "latitude": 22.197,
            "longitude": 113.54
          },
          {
            "name": "大堂区",
            "latitude": 22.1899,
            "longitude": 113.5439
          },
          {
            "name": "望德堂区",
            "latitude": 22.1942,
            "longitude": 113.5501
          },
          {
            "name": "风顺堂区",
            "latitude": 22.1875,
            "longitude": 113.5411
          },
          {
            "name": "嘉模堂区",
            "latitude": 22.1548,
            "longitude": 113.559
          },
          {
            "name": "圣方济各堂区",
            "latitude": 22.1256,
            "longitude": 113.56
          },
          {
            "name": "市区",
            "latitude": 22.1987,
            "longitude": 113.5439
          }
        ]
      }
    ]
  },
  {
    "name": "台湾省",
    "cities": [
      {
        "name": "台北市",
        "districts": [
          {
            "name": "市区",
            "latitude": 25.0375,
            "longitude": 121.5637
          }
        ]
      },
      {
        "name": "新北市",
        "districts": [
          {
            "name": "市区",
            "latitude": 25.0169,
            "longitude": 121.4628
          }
        ]
      },
      {
        "name": "桃园市",
        "districts": [
          {
            "name": "市区",
            "latitude": 24.9936,
            "longitude": 121.301
          }
        ]
      },
      {
        "name": "台中市",
        "districts": [
          {
            "name": "市区",
            "latitude": 24.1477,
            "longitude": 120.6736
          }
        ]
      },
      {
        "name": "台南市",
        "districts": [
          {
            "name": "市区",
            "latitude": 22.9997,
            "longitude": 120.227
          }
        ]
      },
      {
        "name": "高雄市",
        "districts": [
          {
            "name": "市区",
            "latitude": 22.6273,
            "longitude": 120.3014
          }
        ]
      },
      {
        "name": "基隆市",
        "districts": [
          {
            "name": "市区",
            "latitude": 25.1276,
            "longitude": 121.7392
          }
        ]
      },
      {
        "name": "新竹市",
        "districts": [
          {
            "name": "市区",
            "latitude": 24.8066,
            "longitude": 120.9686
          }
        ]
      },
      {
        "name": "嘉义市",
        "districts": [
          {
            "name": "市区",
            "latitude": 23.4801,
            "longitude": 120.4491
          }
        ]
      },
      {
        "name": "宜兰县",
        "districts": [
          {
            "name": "市区",
            "latitude": 24.75,
            "longitude": 121.75
          }
        ]
      },
      {
        "name": "新竹县",
        "districts": [
          {
            "name": "市区",
            "latitude": 24.8387,
            "longitude": 121.0177
          }
        ]
      },
      {
        "name": "苗栗县",
        "districts": [
          {
            "name": "市区",
            "latitude": 24.5602,
            "longitude": 120.8214
          }
        ]
      },
      {
        "name": "彰化县",
        "districts": [
          {
            "name": "市区",
            "latitude": 24.0518,
            "longitude": 120.5161
          }
        ]
      },
      {
        "name": "南投县",
        "districts": [
          {
            "name": "市区",
            "latitude": 23.9609,
            "longitude": 120.9719
          }
        ]
      },
      {
        "name": "云林县",
        "districts": [
          {
            "name": "市区",
            "latitude": 23.7092,
            "longitude": 120.4313
          }
        ]
      },
      {
        "name": "嘉义县",
        "districts": [
          {
            "name": "市区",
            "latitude": 23.4518,
            "longitude": 120.2555
          }
        ]
      },
      {
        "name": "屏东县",
        "districts": [
          {
            "name": "市区",
            "latitude": 22.683,
            "longitude": 120.4879
          }
        ]
      },
      {
        "name": "台东县",
        "districts": [
          {
            "name": "市区",
            "latitude": 22.7972,
            "longitude": 121.0714
          }
        ]
      },
      {
        "name": "花莲县",
        "districts": [
          {
            "name": "市区",
            "latitude": 23.9911,
            "longitude": 121.6112
          }
        ]
      },
      {
        "name": "澎湖县",
        "districts": [
          {
            "name": "市区",
            "latitude": 23.5712,
            "longitude": 119.5793
          }
        ]
      },
      {
        "name": "金门县",
        "districts": [
          {
            "name": "市区",
            "latitude": 24.4368,
            "longitude": 118.3186
          }
        ]
      },
      {
        "name": "连江县",
        "districts": [
          {
            "name": "市区",
            "latitude": 26.1605,
            "longitude": 119.9499
          }
        ]
      }
    ]
  }
];

function stripSuffix(s: string): string {
  return String(s || "")
    .replace(/(特别行政区|维吾尔自治区|壮族自治区|回族自治区|自治区|省|市|地区|盟)$/u, "")
    .replace(/(新区|自治县|区|县|旗)$/u, "");
}

function geoDist(aLat: number, aLon: number, bLat: number, bLon: number): number {
  return Math.hypot(aLat - bLat, aLon - bLon);
}

/** 根据已保存城市反查三级下拉；匹配不到返回 null。 */
export function matchCitySelection(city: CityLike | null | undefined): CascadeSelection | null {
  if (!city) return null;
  const adminParts = String(city.admin || "").split(/[·,，/\s]+/).map((x) => x.trim()).filter(Boolean);
  const nameN = stripSuffix(city.name);
  const adminJoined = adminParts.join(" ");

  let best: CascadeSelection | null = null;
  let bestScore = Infinity;

  for (const p of CHINA_REGIONS) {
    const pN = stripSuffix(p.name);
    const adminHit =
      adminParts.some((a) => stripSuffix(a) === pN || a.includes(p.name) || p.name.includes(a)) ||
      adminJoined.includes(pN) ||
      (!!nameN && (pN === nameN || city.name === p.name));

    for (const c of p.cities) {
      const cN = stripSuffix(c.name);
      const cityHit =
        adminParts.some((a) => stripSuffix(a) === cN || a === c.name) ||
        cN === nameN ||
        city.name === c.name ||
        (adminHit && (c.name === p.name || cN === pN));

      for (const d of c.districts) {
        const dN = stripSuffix(d.name);
        let score = geoDist(city.latitude, city.longitude, d.latitude, d.longitude);
        const nameHit =
          city.name === d.name ||
          nameN === dN ||
          (!!nameN && d.name.startsWith(nameN)) ||
          (!!dN && city.name.startsWith(dN));
        if (nameHit) score -= 10;
        if (cityHit || adminHit) score -= 2;
        if (
          d.name === "市区" &&
          (nameN === pN || nameN === cN || city.name === "北京" || city.name === "上海")
        ) {
          score -= 0.5;
        }
        if (score < bestScore) {
          bestScore = score;
          best = { province: p.name, city: c.name, district: d.name };
        }
      }
    }
  }

  if (!best) return null;
  const p = CHINA_REGIONS.find((x) => x.name === best!.province);
  const c = p?.cities.find((x) => x.name === best!.city);
  const d = c?.districts.find((x) => x.name === best!.district);
  if (!d) return null;
  const raw = geoDist(city.latitude, city.longitude, d.latitude, d.longitude);
  if (raw > 0.35 && bestScore > -5) return null;
  return best;
}

export function findDistrict(province: string, cityName: string, districtName: string): ChinaDistrict | null {
  const p = CHINA_REGIONS.find((x) => x.name === province);
  const c = p?.cities.find((x) => x.name === cityName);
  return c?.districts.find((x) => x.name === districtName) ?? null;
}

/** 末级选中后写成 Weather City。市区兜底时 name 用市简称。 */
export function toWeatherCity(province: string, cityName: string, districtName: string): CityLike | null {
  const dist = findDistrict(province, cityName, districtName);
  if (!dist) return null;
  const admin =
    province === cityName || cityName === "香港" || cityName === "澳门"
      ? province
      : `${cityName} · ${province}`;
  const shortCity = stripSuffix(cityName) || cityName;
  return {
    name: dist.name === "市区" ? (cityName === "香港" || cityName === "澳门" ? cityName : shortCity) : dist.name,
    admin,
    country: "中国",
    latitude: dist.latitude,
    longitude: dist.longitude,
  };
}

export function getCities(province: string): ChinaCity[] {
  return CHINA_REGIONS.find((x) => x.name === province)?.cities ?? [];
}

export function getDistricts(province: string, cityName: string): ChinaDistrict[] {
  return getCities(province).find((x) => x.name === cityName)?.districts ?? [];
}

export const PROVINCE_OPTIONS = CHINA_REGIONS.map((p) => ({ value: p.name, label: p.name }));
