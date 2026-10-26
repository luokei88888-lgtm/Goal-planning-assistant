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
            "latitude": 40.0632,
            "longitude": 116.4113
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
            "latitude": 39.2059,
            "longitude": 117.285
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
            "name": "井陉矿区",
            "latitude": 38.0646,
            "longitude": 114.0623
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
            "name": "井陉县",
            "latitude": 38.0322,
            "longitude": 114.1452
          },
          {
            "name": "正定县",
            "latitude": 38.1462,
            "longitude": 114.5708
          },
          {
            "name": "行唐县",
            "latitude": 38.4374,
            "longitude": 114.5527
          },
          {
            "name": "灵寿县",
            "latitude": 38.3063,
            "longitude": 114.3827
          },
          {
            "name": "高邑县",
            "latitude": 37.6151,
            "longitude": 114.6107
          },
          {
            "name": "深泽县",
            "latitude": 38.1841,
            "longitude": 115.2009
          },
          {
            "name": "赞皇县",
            "latitude": 37.6657,
            "longitude": 114.386
          },
          {
            "name": "无极县",
            "latitude": 38.1763,
            "longitude": 114.9754
          },
          {
            "name": "平山县",
            "latitude": 38.2471,
            "longitude": 114.1957
          },
          {
            "name": "元氏县",
            "latitude": 37.7665,
            "longitude": 114.5055
          },
          {
            "name": "赵县",
            "latitude": 37.7564,
            "longitude": 114.7763
          },
          {
            "name": "辛集市",
            "latitude": 37.9432,
            "longitude": 115.2176
          },
          {
            "name": "晋州市",
            "latitude": 38.0336,
            "longitude": 115.0442
          },
          {
            "name": "新乐市",
            "latitude": 38.3439,
            "longitude": 114.6838
          },
          {
            "name": "市区",
            "latitude": 38.0628,
            "longitude": 114.5682
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
            "name": "滦南县",
            "latitude": 39.5039,
            "longitude": 118.6837
          },
          {
            "name": "乐亭县",
            "latitude": 39.4256,
            "longitude": 118.9125
          },
          {
            "name": "迁西县",
            "latitude": 40.1415,
            "longitude": 118.3146
          },
          {
            "name": "玉田县",
            "latitude": 39.9005,
            "longitude": 117.7384
          },
          {
            "name": "遵化市",
            "latitude": 40.1891,
            "longitude": 117.9659
          },
          {
            "name": "迁安市",
            "latitude": 39.9984,
            "longitude": 118.7007
          },
          {
            "name": "滦州市",
            "latitude": 39.7406,
            "longitude": 118.7035
          },
          {
            "name": "市区",
            "latitude": 39.7061,
            "longitude": 118.3243
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
            "name": "青龙满族自治县",
            "latitude": 40.4075,
            "longitude": 118.9496
          },
          {
            "name": "昌黎县",
            "latitude": 39.7128,
            "longitude": 119.1626
          },
          {
            "name": "卢龙县",
            "latitude": 39.8916,
            "longitude": 118.8928
          },
          {
            "name": "市区",
            "latitude": 39.9699,
            "longitude": 119.3207
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
            "name": "肥乡区",
            "latitude": 36.5558,
            "longitude": 114.8
          },
          {
            "name": "永年区",
            "latitude": 36.7764,
            "longitude": 114.4892
          },
          {
            "name": "临漳县",
            "latitude": 36.3346,
            "longitude": 114.6195
          },
          {
            "name": "成安县",
            "latitude": 36.4441,
            "longitude": 114.67
          },
          {
            "name": "大名县",
            "latitude": 36.2855,
            "longitude": 115.1478
          },
          {
            "name": "涉县",
            "latitude": 36.5849,
            "longitude": 113.6915
          },
          {
            "name": "磁县",
            "latitude": 36.3747,
            "longitude": 114.3739
          },
          {
            "name": "邱县",
            "latitude": 36.8132,
            "longitude": 115.1686
          },
          {
            "name": "鸡泽县",
            "latitude": 36.9104,
            "longitude": 114.8894
          },
          {
            "name": "广平县",
            "latitude": 36.4836,
            "longitude": 114.9486
          },
          {
            "name": "馆陶县",
            "latitude": 36.7483,
            "longitude": 115.2823
          },
          {
            "name": "魏县",
            "latitude": 36.3599,
            "longitude": 114.9389
          },
          {
            "name": "曲周县",
            "latitude": 36.7663,
            "longitude": 114.9505
          },
          {
            "name": "武安市",
            "latitude": 36.6965,
            "longitude": 114.2035
          },
          {
            "name": "市区",
            "latitude": 36.5565,
            "longitude": 114.6713
          }
        ]
      },
      {
        "name": "邢台市",
        "districts": [
          {
            "name": "襄都区",
            "latitude": 37.068,
            "longitude": 114.504
          },
          {
            "name": "信都区",
            "latitude": 37.0577,
            "longitude": 114.4684
          },
          {
            "name": "任泽区",
            "latitude": 37.1209,
            "longitude": 114.6713
          },
          {
            "name": "南和区",
            "latitude": 37.005,
            "longitude": 114.6837
          },
          {
            "name": "临城县",
            "latitude": 37.4443,
            "longitude": 114.4989
          },
          {
            "name": "内丘县",
            "latitude": 37.2867,
            "longitude": 114.5122
          },
          {
            "name": "柏乡县",
            "latitude": 37.4824,
            "longitude": 114.6934
          },
          {
            "name": "隆尧县",
            "latitude": 37.3502,
            "longitude": 114.7704
          },
          {
            "name": "宁晋县",
            "latitude": 37.6198,
            "longitude": 114.9194
          },
          {
            "name": "巨鹿县",
            "latitude": 37.2209,
            "longitude": 115.038
          },
          {
            "name": "新河县",
            "latitude": 37.5203,
            "longitude": 115.2508
          },
          {
            "name": "广宗县",
            "latitude": 37.0751,
            "longitude": 115.1426
          },
          {
            "name": "平乡县",
            "latitude": 37.0632,
            "longitude": 115.03
          },
          {
            "name": "威县",
            "latitude": 36.9753,
            "longitude": 115.2667
          },
          {
            "name": "清河县",
            "latitude": 37.04,
            "longitude": 115.6672
          },
          {
            "name": "临西县",
            "latitude": 36.8708,
            "longitude": 115.5012
          },
          {
            "name": "南宫市",
            "latitude": 37.359,
            "longitude": 115.4087
          },
          {
            "name": "沙河市",
            "latitude": 36.8549,
            "longitude": 114.5033
          },
          {
            "name": "市区",
            "latitude": 37.2065,
            "longitude": 114.9046
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
            "name": "涞水县",
            "latitude": 39.3942,
            "longitude": 115.7139
          },
          {
            "name": "阜平县",
            "latitude": 38.8491,
            "longitude": 114.1951
          },
          {
            "name": "定兴县",
            "latitude": 39.2631,
            "longitude": 115.8081
          },
          {
            "name": "唐县",
            "latitude": 38.748,
            "longitude": 114.9829
          },
          {
            "name": "高阳县",
            "latitude": 38.7001,
            "longitude": 115.7789
          },
          {
            "name": "容城县",
            "latitude": 39.0428,
            "longitude": 115.8616
          },
          {
            "name": "涞源县",
            "latitude": 39.36,
            "longitude": 114.6943
          },
          {
            "name": "望都县",
            "latitude": 38.6957,
            "longitude": 115.1554
          },
          {
            "name": "安新县",
            "latitude": 38.9355,
            "longitude": 115.9356
          },
          {
            "name": "易县",
            "latitude": 39.3529,
            "longitude": 115.4975
          },
          {
            "name": "曲阳县",
            "latitude": 38.6221,
            "longitude": 114.745
          },
          {
            "name": "蠡县",
            "latitude": 38.488,
            "longitude": 115.5836
          },
          {
            "name": "顺平县",
            "latitude": 38.8375,
            "longitude": 115.135
          },
          {
            "name": "博野县",
            "latitude": 38.4575,
            "longitude": 115.4642
          },
          {
            "name": "雄县",
            "latitude": 38.9944,
            "longitude": 116.1088
          },
          {
            "name": "涿州市",
            "latitude": 39.4853,
            "longitude": 115.9744
          },
          {
            "name": "定州市",
            "latitude": 38.5162,
            "longitude": 114.9902
          },
          {
            "name": "安国市",
            "latitude": 38.4184,
            "longitude": 115.3266
          },
          {
            "name": "高碑店市",
            "latitude": 39.3265,
            "longitude": 115.8737
          },
          {
            "name": "市区",
            "latitude": 38.9269,
            "longitude": 115.3992
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
            "name": "万全区",
            "latitude": 40.7669,
            "longitude": 114.7405
          },
          {
            "name": "崇礼区",
            "latitude": 40.9747,
            "longitude": 115.2826
          },
          {
            "name": "张北县",
            "latitude": 41.1585,
            "longitude": 114.7201
          },
          {
            "name": "康保县",
            "latitude": 41.8504,
            "longitude": 114.6003
          },
          {
            "name": "沽源县",
            "latitude": 41.6696,
            "longitude": 115.6887
          },
          {
            "name": "尚义县",
            "latitude": 41.0762,
            "longitude": 113.9687
          },
          {
            "name": "蔚县",
            "latitude": 39.8407,
            "longitude": 114.549
          },
          {
            "name": "阳原县",
            "latitude": 40.1135,
            "longitude": 114.1703
          },
          {
            "name": "怀安县",
            "latitude": 40.6742,
            "longitude": 114.3857
          },
          {
            "name": "怀来县",
            "latitude": 40.4154,
            "longitude": 115.5178
          },
          {
            "name": "涿鹿县",
            "latitude": 40.3787,
            "longitude": 115.2194
          },
          {
            "name": "赤城县",
            "latitude": 40.9129,
            "longitude": 115.8325
          },
          {
            "name": "市区",
            "latitude": 40.7618,
            "longitude": 114.9724
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
            "name": "鹰手营子矿区",
            "latitude": 40.5464,
            "longitude": 117.6611
          },
          {
            "name": "承德县",
            "latitude": 40.7682,
            "longitude": 118.1738
          },
          {
            "name": "兴隆县",
            "latitude": 40.4173,
            "longitude": 117.5009
          },
          {
            "name": "滦平县",
            "latitude": 40.9415,
            "longitude": 117.3328
          },
          {
            "name": "隆化县",
            "latitude": 41.3138,
            "longitude": 117.7389
          },
          {
            "name": "丰宁满族自治县",
            "latitude": 41.2099,
            "longitude": 116.6512
          },
          {
            "name": "宽城满族自治县",
            "latitude": 40.6114,
            "longitude": 118.4853
          },
          {
            "name": "围场满族蒙古族自治县",
            "latitude": 41.9494,
            "longitude": 117.7601
          },
          {
            "name": "平泉市",
            "latitude": 41.0055,
            "longitude": 118.702
          },
          {
            "name": "市区",
            "latitude": 41.0372,
            "longitude": 117.7714
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
            "name": "沧县",
            "latitude": 38.3044,
            "longitude": 116.8785
          },
          {
            "name": "青县",
            "latitude": 38.5834,
            "longitude": 116.8033
          },
          {
            "name": "东光县",
            "latitude": 37.8881,
            "longitude": 116.5371
          },
          {
            "name": "海兴县",
            "latitude": 38.1415,
            "longitude": 117.4964
          },
          {
            "name": "盐山县",
            "latitude": 38.0581,
            "longitude": 117.2306
          },
          {
            "name": "肃宁县",
            "latitude": 38.4228,
            "longitude": 115.8297
          },
          {
            "name": "南皮县",
            "latitude": 38.0384,
            "longitude": 116.7084
          },
          {
            "name": "吴桥县",
            "latitude": 37.6277,
            "longitude": 116.3915
          },
          {
            "name": "献县",
            "latitude": 38.1897,
            "longitude": 116.1227
          },
          {
            "name": "孟村回族自治县",
            "latitude": 38.0534,
            "longitude": 117.1042
          },
          {
            "name": "泊头市",
            "latitude": 38.0835,
            "longitude": 116.5783
          },
          {
            "name": "任丘市",
            "latitude": 38.7114,
            "longitude": 116.1053
          },
          {
            "name": "黄骅市",
            "latitude": 38.3714,
            "longitude": 117.33
          },
          {
            "name": "河间市",
            "latitude": 38.4455,
            "longitude": 116.0994
          },
          {
            "name": "市区",
            "latitude": 38.2179,
            "longitude": 116.7423
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
            "name": "固安县",
            "latitude": 39.4382,
            "longitude": 116.2987
          },
          {
            "name": "永清县",
            "latitude": 39.3217,
            "longitude": 116.4981
          },
          {
            "name": "香河县",
            "latitude": 39.7614,
            "longitude": 117.0064
          },
          {
            "name": "大城县",
            "latitude": 38.7047,
            "longitude": 116.6536
          },
          {
            "name": "文安县",
            "latitude": 38.8733,
            "longitude": 116.4585
          },
          {
            "name": "大厂回族自治县",
            "latitude": 39.8865,
            "longitude": 116.9896
          },
          {
            "name": "霸州市",
            "latitude": 39.1258,
            "longitude": 116.3915
          },
          {
            "name": "三河市",
            "latitude": 39.9827,
            "longitude": 117.0783
          },
          {
            "name": "市区",
            "latitude": 39.379,
            "longitude": 116.6867
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
            "name": "冀州区",
            "latitude": 37.5508,
            "longitude": 115.5793
          },
          {
            "name": "枣强县",
            "latitude": 37.5133,
            "longitude": 115.7242
          },
          {
            "name": "武邑县",
            "latitude": 37.8018,
            "longitude": 115.8875
          },
          {
            "name": "武强县",
            "latitude": 38.0414,
            "longitude": 115.9702
          },
          {
            "name": "饶阳县",
            "latitude": 38.2352,
            "longitude": 115.7258
          },
          {
            "name": "安平县",
            "latitude": 38.2345,
            "longitude": 115.5192
          },
          {
            "name": "故城县",
            "latitude": 37.3509,
            "longitude": 115.9658
          },
          {
            "name": "景县",
            "latitude": 37.6923,
            "longitude": 116.2706
          },
          {
            "name": "阜城县",
            "latitude": 37.8699,
            "longitude": 116.1766
          },
          {
            "name": "深州市",
            "latitude": 38.0015,
            "longitude": 115.5596
          },
          {
            "name": "市区",
            "latitude": 37.8106,
            "longitude": 115.8206
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
            "name": "清徐县",
            "latitude": 37.5868,
            "longitude": 112.3797
          },
          {
            "name": "阳曲县",
            "latitude": 38.1521,
            "longitude": 112.6672
          },
          {
            "name": "娄烦县",
            "latitude": 38.0286,
            "longitude": 111.7913
          },
          {
            "name": "古交市",
            "latitude": 37.8994,
            "longitude": 112.1028
          },
          {
            "name": "市区",
            "latitude": 37.8745,
            "longitude": 112.4144
          }
        ]
      },
      {
        "name": "大同市",
        "districts": [
          {
            "name": "新荣区",
            "latitude": 40.2631,
            "longitude": 113.1827
          },
          {
            "name": "平城区",
            "latitude": 40.0859,
            "longitude": 113.3137
          },
          {
            "name": "云冈区",
            "latitude": 40.0214,
            "longitude": 113.1142
          },
          {
            "name": "云州区",
            "latitude": 39.9936,
            "longitude": 113.579
          },
          {
            "name": "阳高县",
            "latitude": 40.2221,
            "longitude": 113.8048
          },
          {
            "name": "天镇县",
            "latitude": 40.385,
            "longitude": 114.1562
          },
          {
            "name": "广灵县",
            "latitude": 39.7626,
            "longitude": 114.1516
          },
          {
            "name": "灵丘县",
            "latitude": 39.3724,
            "longitude": 114.2078
          },
          {
            "name": "浑源县",
            "latitude": 39.6283,
            "longitude": 113.7049
          },
          {
            "name": "左云县",
            "latitude": 39.9954,
            "longitude": 112.7722
          },
          {
            "name": "市区",
            "latitude": 39.973,
            "longitude": 113.5987
          }
        ]
      },
      {
        "name": "阳泉市",
        "districts": [
          {
            "name": "城区",
            "latitude": 37.8517,
            "longitude": 113.5976
          },
          {
            "name": "矿区",
            "latitude": 37.8701,
            "longitude": 113.5591
          },
          {
            "name": "郊区",
            "latitude": 37.961,
            "longitude": 113.5942
          },
          {
            "name": "平定县",
            "latitude": 37.8425,
            "longitude": 113.7637
          },
          {
            "name": "盂县",
            "latitude": 38.2234,
            "longitude": 113.3556
          },
          {
            "name": "市区",
            "latitude": 37.9497,
            "longitude": 113.574
          }
        ]
      },
      {
        "name": "长治市",
        "districts": [
          {
            "name": "潞州区",
            "latitude": 36.2576,
            "longitude": 113.0974
          },
          {
            "name": "上党区",
            "latitude": 36.0195,
            "longitude": 113.0793
          },
          {
            "name": "屯留区",
            "latitude": 36.3363,
            "longitude": 112.7449
          },
          {
            "name": "潞城区",
            "latitude": 36.3689,
            "longitude": 113.2464
          },
          {
            "name": "襄垣县",
            "latitude": 36.5728,
            "longitude": 112.9809
          },
          {
            "name": "平顺县",
            "latitude": 36.2148,
            "longitude": 113.5266
          },
          {
            "name": "黎城县",
            "latitude": 36.6138,
            "longitude": 113.3899
          },
          {
            "name": "壶关县",
            "latitude": 35.9862,
            "longitude": 113.3643
          },
          {
            "name": "长子县",
            "latitude": 36.1045,
            "longitude": 112.7959
          },
          {
            "name": "武乡县",
            "latitude": 36.8821,
            "longitude": 112.9619
          },
          {
            "name": "沁县",
            "latitude": 36.7013,
            "longitude": 112.6465
          },
          {
            "name": "沁源县",
            "latitude": 36.6968,
            "longitude": 112.2837
          },
          {
            "name": "市区",
            "latitude": 36.3962,
            "longitude": 113.0098
          }
        ]
      },
      {
        "name": "晋城市",
        "districts": [
          {
            "name": "城区",
            "latitude": 35.5161,
            "longitude": 112.848
          },
          {
            "name": "沁水县",
            "latitude": 35.7475,
            "longitude": 112.371
          },
          {
            "name": "阳城县",
            "latitude": 35.4223,
            "longitude": 112.353
          },
          {
            "name": "陵川县",
            "latitude": 35.6834,
            "longitude": 113.3376
          },
          {
            "name": "泽州县",
            "latitude": 35.4299,
            "longitude": 112.7642
          },
          {
            "name": "高平市",
            "latitude": 35.8042,
            "longitude": 112.9289
          },
          {
            "name": "市区",
            "latitude": 35.6006,
            "longitude": 112.7671
          }
        ]
      },
      {
        "name": "朔州市",
        "districts": [
          {
            "name": "朔城区",
            "latitude": 39.281,
            "longitude": 112.4498
          },
          {
            "name": "平鲁区",
            "latitude": 39.6129,
            "longitude": 112.223
          },
          {
            "name": "山阴县",
            "latitude": 39.5116,
            "longitude": 112.7802
          },
          {
            "name": "应县",
            "latitude": 39.5027,
            "longitude": 113.255
          },
          {
            "name": "右玉县",
            "latitude": 40.0015,
            "longitude": 112.4151
          },
          {
            "name": "怀仁市",
            "latitude": 39.7865,
            "longitude": 113.1036
          },
          {
            "name": "市区",
            "latitude": 39.616,
            "longitude": 112.7045
          }
        ]
      },
      {
        "name": "晋中市",
        "districts": [
          {
            "name": "榆次区",
            "latitude": 37.6428,
            "longitude": 112.837
          },
          {
            "name": "太谷区",
            "latitude": 37.4006,
            "longitude": 112.7298
          },
          {
            "name": "榆社县",
            "latitude": 37.1352,
            "longitude": 112.9478
          },
          {
            "name": "左权县",
            "latitude": 37.0251,
            "longitude": 113.4693
          },
          {
            "name": "和顺县",
            "latitude": 37.3409,
            "longitude": 113.4704
          },
          {
            "name": "昔阳县",
            "latitude": 37.5575,
            "longitude": 113.7454
          },
          {
            "name": "寿阳县",
            "latitude": 37.8218,
            "longitude": 113.1319
          },
          {
            "name": "祁县",
            "latitude": 37.2859,
            "longitude": 112.4638
          },
          {
            "name": "平遥县",
            "latitude": 37.1408,
            "longitude": 112.2622
          },
          {
            "name": "灵石县",
            "latitude": 36.8281,
            "longitude": 111.7305
          },
          {
            "name": "介休市",
            "latitude": 37.018,
            "longitude": 111.988
          },
          {
            "name": "市区",
            "latitude": 37.2906,
            "longitude": 112.7978
          }
        ]
      },
      {
        "name": "运城市",
        "districts": [
          {
            "name": "盐湖区",
            "latitude": 35.0567,
            "longitude": 110.9561
          },
          {
            "name": "临猗县",
            "latitude": 35.143,
            "longitude": 110.619
          },
          {
            "name": "万荣县",
            "latitude": 35.3816,
            "longitude": 110.7149
          },
          {
            "name": "闻喜县",
            "latitude": 35.3687,
            "longitude": 111.3122
          },
          {
            "name": "稷山县",
            "latitude": 35.5914,
            "longitude": 110.9578
          },
          {
            "name": "新绛县",
            "latitude": 35.6268,
            "longitude": 111.1653
          },
          {
            "name": "绛县",
            "latitude": 35.4953,
            "longitude": 111.6397
          },
          {
            "name": "垣曲县",
            "latitude": 35.2159,
            "longitude": 111.819
          },
          {
            "name": "夏县",
            "latitude": 35.1206,
            "longitude": 111.3531
          },
          {
            "name": "平陆县",
            "latitude": 34.882,
            "longitude": 111.2445
          },
          {
            "name": "芮城县",
            "latitude": 34.7045,
            "longitude": 110.6107
          },
          {
            "name": "永济市",
            "latitude": 34.8871,
            "longitude": 110.4803
          },
          {
            "name": "河津市",
            "latitude": 35.6246,
            "longitude": 110.7001
          },
          {
            "name": "市区",
            "latitude": 35.2383,
            "longitude": 111.0441
          }
        ]
      },
      {
        "name": "忻州市",
        "districts": [
          {
            "name": "忻府区",
            "latitude": 38.4318,
            "longitude": 112.5999
          },
          {
            "name": "定襄县",
            "latitude": 38.5101,
            "longitude": 113.03
          },
          {
            "name": "五台县",
            "latitude": 38.7709,
            "longitude": 113.437
          },
          {
            "name": "代县",
            "latitude": 39.0851,
            "longitude": 113.0447
          },
          {
            "name": "繁峙县",
            "latitude": 39.1993,
            "longitude": 113.5938
          },
          {
            "name": "宁武县",
            "latitude": 38.8152,
            "longitude": 112.1875
          },
          {
            "name": "静乐县",
            "latitude": 38.3945,
            "longitude": 112.0596
          },
          {
            "name": "神池县",
            "latitude": 39.167,
            "longitude": 112.0027
          },
          {
            "name": "五寨县",
            "latitude": 39.0016,
            "longitude": 111.7381
          },
          {
            "name": "岢岚县",
            "latitude": 38.7316,
            "longitude": 111.5355
          },
          {
            "name": "河曲县",
            "latitude": 39.2017,
            "longitude": 111.3529
          },
          {
            "name": "保德县",
            "latitude": 38.8816,
            "longitude": 111.1356
          },
          {
            "name": "偏关县",
            "latitude": 39.4583,
            "longitude": 111.6654
          },
          {
            "name": "原平市",
            "latitude": 38.8316,
            "longitude": 112.675
          },
          {
            "name": "市区",
            "latitude": 38.8915,
            "longitude": 112.2898
          }
        ]
      },
      {
        "name": "临汾市",
        "districts": [
          {
            "name": "尧都区",
            "latitude": 36.1197,
            "longitude": 111.4697
          },
          {
            "name": "曲沃县",
            "latitude": 35.7011,
            "longitude": 111.5199
          },
          {
            "name": "翼城县",
            "latitude": 35.689,
            "longitude": 111.8321
          },
          {
            "name": "襄汾县",
            "latitude": 35.8685,
            "longitude": 111.3772
          },
          {
            "name": "洪洞县",
            "latitude": 36.3209,
            "longitude": 111.6529
          },
          {
            "name": "古县",
            "latitude": 36.298,
            "longitude": 112.005
          },
          {
            "name": "安泽县",
            "latitude": 36.1579,
            "longitude": 112.3024
          },
          {
            "name": "浮山县",
            "latitude": 35.94,
            "longitude": 111.9216
          },
          {
            "name": "吉县",
            "latitude": 36.1532,
            "longitude": 110.7213
          },
          {
            "name": "乡宁县",
            "latitude": 35.9189,
            "longitude": 110.9371
          },
          {
            "name": "大宁县",
            "latitude": 36.4261,
            "longitude": 110.704
          },
          {
            "name": "隰县",
            "latitude": 36.7067,
            "longitude": 111.0027
          },
          {
            "name": "永和县",
            "latitude": 36.7315,
            "longitude": 110.6113
          },
          {
            "name": "蒲县",
            "latitude": 36.42,
            "longitude": 111.1561
          },
          {
            "name": "汾西县",
            "latitude": 36.6375,
            "longitude": 111.4771
          },
          {
            "name": "侯马市",
            "latitude": 35.6155,
            "longitude": 111.3637
          },
          {
            "name": "霍州市",
            "latitude": 36.593,
            "longitude": 111.824
          },
          {
            "name": "市区",
            "latitude": 36.194,
            "longitude": 111.4046
          }
        ]
      },
      {
        "name": "吕梁市",
        "districts": [
          {
            "name": "离石区",
            "latitude": 37.5436,
            "longitude": 111.308
          },
          {
            "name": "文水县",
            "latitude": 37.4504,
            "longitude": 111.9623
          },
          {
            "name": "交城县",
            "latitude": 37.6802,
            "longitude": 111.8122
          },
          {
            "name": "兴县",
            "latitude": 38.3856,
            "longitude": 111.0626
          },
          {
            "name": "临县",
            "latitude": 37.9554,
            "longitude": 110.8953
          },
          {
            "name": "柳林县",
            "latitude": 37.3988,
            "longitude": 110.8702
          },
          {
            "name": "石楼县",
            "latitude": 37.0295,
            "longitude": 110.7456
          },
          {
            "name": "岚县",
            "latitude": 38.3368,
            "longitude": 111.6012
          },
          {
            "name": "方山县",
            "latitude": 37.8779,
            "longitude": 111.3317
          },
          {
            "name": "中阳县",
            "latitude": 37.2585,
            "longitude": 111.1777
          },
          {
            "name": "交口县",
            "latitude": 36.9515,
            "longitude": 111.3092
          },
          {
            "name": "孝义市",
            "latitude": 37.1113,
            "longitude": 111.6305
          },
          {
            "name": "汾阳市",
            "latitude": 37.3086,
            "longitude": 111.7403
          },
          {
            "name": "市区",
            "latitude": 37.5606,
            "longitude": 111.3421
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
            "name": "土默特左旗",
            "latitude": 40.6842,
            "longitude": 111.2299
          },
          {
            "name": "托克托县",
            "latitude": 40.3556,
            "longitude": 111.311
          },
          {
            "name": "和林格尔县",
            "latitude": 40.3275,
            "longitude": 111.8951
          },
          {
            "name": "清水河县",
            "latitude": 39.883,
            "longitude": 111.7002
          },
          {
            "name": "武川县",
            "latitude": 41.1096,
            "longitude": 111.1741
          },
          {
            "name": "市区",
            "latitude": 40.6333,
            "longitude": 111.5892
          }
        ]
      },
      {
        "name": "包头市",
        "districts": [
          {
            "name": "东河区",
            "latitude": 40.576,
            "longitude": 110.2073
          },
          {
            "name": "昆都仑区",
            "latitude": 40.6864,
            "longitude": 109.7554
          },
          {
            "name": "青山区",
            "latitude": 40.69,
            "longitude": 109.9582
          },
          {
            "name": "石拐区",
            "latitude": 40.7473,
            "longitude": 110.2862
          },
          {
            "name": "白云鄂博矿区",
            "latitude": 41.7678,
            "longitude": 109.9386
          },
          {
            "name": "九原区",
            "latitude": 40.6042,
            "longitude": 109.6646
          },
          {
            "name": "土默特右旗",
            "latitude": 40.5186,
            "longitude": 110.6881
          },
          {
            "name": "固阳县",
            "latitude": 41.1137,
            "longitude": 110.1463
          },
          {
            "name": "达尔罕茂明安联合旗",
            "latitude": 41.955,
            "longitude": 110.4727
          },
          {
            "name": "市区",
            "latitude": 40.9621,
            "longitude": 110.1242
          }
        ]
      },
      {
        "name": "乌海市",
        "districts": [
          {
            "name": "海勃湾区",
            "latitude": 39.6837,
            "longitude": 106.8484
          },
          {
            "name": "海南区",
            "latitude": 39.2747,
            "longitude": 106.9227
          },
          {
            "name": "乌达区",
            "latitude": 39.5331,
            "longitude": 106.7046
          },
          {
            "name": "市区",
            "latitude": 39.4972,
            "longitude": 106.8252
          }
        ]
      },
      {
        "name": "赤峰市",
        "districts": [
          {
            "name": "红山区",
            "latitude": 42.1894,
            "longitude": 118.9841
          },
          {
            "name": "元宝山区",
            "latitude": 42.1817,
            "longitude": 119.2435
          },
          {
            "name": "松山区",
            "latitude": 42.4036,
            "longitude": 118.6148
          },
          {
            "name": "阿鲁科尔沁旗",
            "latitude": 44.2018,
            "longitude": 120.033
          },
          {
            "name": "巴林左旗",
            "latitude": 44.2013,
            "longitude": 119.2701
          },
          {
            "name": "巴林右旗",
            "latitude": 43.6855,
            "longitude": 118.9334
          },
          {
            "name": "林西县",
            "latitude": 43.7584,
            "longitude": 118.1062
          },
          {
            "name": "克什克腾旗",
            "latitude": 43.248,
            "longitude": 117.353
          },
          {
            "name": "翁牛特旗",
            "latitude": 42.9696,
            "longitude": 119.2484
          },
          {
            "name": "喀喇沁旗",
            "latitude": 41.8989,
            "longitude": 118.6437
          },
          {
            "name": "宁城县",
            "latitude": 41.5645,
            "longitude": 118.8964
          },
          {
            "name": "敖汉旗",
            "latitude": 42.4263,
            "longitude": 120.1507
          },
          {
            "name": "市区",
            "latitude": 42.8941,
            "longitude": 118.9564
          }
        ]
      },
      {
        "name": "通辽市",
        "districts": [
          {
            "name": "科尔沁区",
            "latitude": 43.6519,
            "longitude": 122.2806
          },
          {
            "name": "科尔沁左翼中旗",
            "latitude": 44.0496,
            "longitude": 122.4926
          },
          {
            "name": "科尔沁左翼后旗",
            "latitude": 43.1869,
            "longitude": 122.688
          },
          {
            "name": "开鲁县",
            "latitude": 43.7284,
            "longitude": 121.3176
          },
          {
            "name": "库伦旗",
            "latitude": 42.8014,
            "longitude": 121.5611
          },
          {
            "name": "奈曼旗",
            "latitude": 42.9669,
            "longitude": 120.9358
          },
          {
            "name": "扎鲁特旗",
            "latitude": 44.8074,
            "longitude": 120.5961
          },
          {
            "name": "霍林郭勒市",
            "latitude": 45.4966,
            "longitude": 119.5411
          },
          {
            "name": "市区",
            "latitude": 43.8361,
            "longitude": 121.4266
          }
        ]
      },
      {
        "name": "鄂尔多斯市",
        "districts": [
          {
            "name": "东胜区",
            "latitude": 39.8285,
            "longitude": 109.7502
          },
          {
            "name": "康巴什区",
            "latitude": 39.6435,
            "longitude": 109.8251
          },
          {
            "name": "达拉特旗",
            "latitude": 40.215,
            "longitude": 109.8565
          },
          {
            "name": "准格尔旗",
            "latitude": 39.7884,
            "longitude": 110.8796
          },
          {
            "name": "鄂托克前旗",
            "latitude": 38.2716,
            "longitude": 107.5807
          },
          {
            "name": "鄂托克旗",
            "latitude": 39.2782,
            "longitude": 107.7445
          },
          {
            "name": "杭锦旗",
            "latitude": 40.2051,
            "longitude": 108.2057
          },
          {
            "name": "乌审旗",
            "latitude": 38.6355,
            "longitude": 108.885
          },
          {
            "name": "伊金霍洛旗",
            "latitude": 39.4179,
            "longitude": 109.6995
          },
          {
            "name": "市区",
            "latitude": 39.476,
            "longitude": 109.1585
          }
        ]
      },
      {
        "name": "呼伦贝尔市",
        "districts": [
          {
            "name": "海拉尔区",
            "latitude": 49.2565,
            "longitude": 120.0124
          },
          {
            "name": "扎赉诺尔区",
            "latitude": 49.4323,
            "longitude": 117.6495
          },
          {
            "name": "阿荣旗",
            "latitude": 48.6331,
            "longitude": 123.1641
          },
          {
            "name": "莫力达瓦达斡尔族自治旗",
            "latitude": 49.105,
            "longitude": 124.4671
          },
          {
            "name": "鄂伦春自治旗",
            "latitude": 50.7302,
            "longitude": 125.0196
          },
          {
            "name": "鄂温克族自治旗",
            "latitude": 48.4923,
            "longitude": 120.0621
          },
          {
            "name": "陈巴尔虎旗",
            "latitude": 49.5811,
            "longitude": 119.5077
          },
          {
            "name": "新巴尔虎左旗",
            "latitude": 48.4326,
            "longitude": 118.5986
          },
          {
            "name": "新巴尔虎右旗",
            "latitude": 48.6359,
            "longitude": 116.7867
          },
          {
            "name": "满洲里市",
            "latitude": 49.5371,
            "longitude": 117.5571
          },
          {
            "name": "牙克石市",
            "latitude": 49.3245,
            "longitude": 121.5071
          },
          {
            "name": "扎兰屯市",
            "latitude": 47.737,
            "longitude": 121.9205
          },
          {
            "name": "额尔古纳市",
            "latitude": 51.6285,
            "longitude": 120.6253
          },
          {
            "name": "根河市",
            "latitude": 51.3878,
            "longitude": 121.7891
          },
          {
            "name": "市区",
            "latitude": 49.4224,
            "longitude": 120.6191
          }
        ]
      },
      {
        "name": "巴彦淖尔市",
        "districts": [
          {
            "name": "临河区",
            "latitude": 40.925,
            "longitude": 107.4343
          },
          {
            "name": "五原县",
            "latitude": 41.0382,
            "longitude": 108.0624
          },
          {
            "name": "磴口县",
            "latitude": 40.548,
            "longitude": 106.6677
          },
          {
            "name": "乌拉特前旗",
            "latitude": 40.8998,
            "longitude": 109.101
          },
          {
            "name": "乌拉特中旗",
            "latitude": 41.8276,
            "longitude": 108.4673
          },
          {
            "name": "乌拉特后旗",
            "latitude": 41.5278,
            "longitude": 106.4172
          },
          {
            "name": "杭锦后旗",
            "latitude": 40.8782,
            "longitude": 107.0306
          },
          {
            "name": "市区",
            "latitude": 41.0921,
            "longitude": 107.5972
          }
        ]
      },
      {
        "name": "乌兰察布市",
        "districts": [
          {
            "name": "集宁区",
            "latitude": 41.0693,
            "longitude": 113.1719
          },
          {
            "name": "卓资县",
            "latitude": 40.9518,
            "longitude": 112.4381
          },
          {
            "name": "化德县",
            "latitude": 41.9684,
            "longitude": 114.157
          },
          {
            "name": "商都县",
            "latitude": 41.7195,
            "longitude": 113.615
          },
          {
            "name": "兴和县",
            "latitude": 40.9448,
            "longitude": 113.7686
          },
          {
            "name": "凉城县",
            "latitude": 40.4973,
            "longitude": 112.5435
          },
          {
            "name": "察哈尔右翼前旗",
            "latitude": 40.7869,
            "longitude": 113.212
          },
          {
            "name": "察哈尔右翼中旗",
            "latitude": 41.4204,
            "longitude": 112.4639
          },
          {
            "name": "察哈尔右翼后旗",
            "latitude": 41.5214,
            "longitude": 113.0645
          },
          {
            "name": "四子王旗",
            "latitude": 42.2948,
            "longitude": 111.5807
          },
          {
            "name": "丰镇市",
            "latitude": 40.5517,
            "longitude": 113.3015
          },
          {
            "name": "市区",
            "latitude": 41.2478,
            "longitude": 113.0288
          }
        ]
      },
      {
        "name": "兴安盟",
        "districts": [
          {
            "name": "乌兰浩特市",
            "latitude": 46.0194,
            "longitude": 122.4179
          },
          {
            "name": "阿尔山市",
            "latitude": 47.1556,
            "longitude": 120.3496
          },
          {
            "name": "科尔沁右翼前旗",
            "latitude": 46.3677,
            "longitude": 121.0713
          },
          {
            "name": "科尔沁右翼中旗",
            "latitude": 45.2684,
            "longitude": 121.1046
          },
          {
            "name": "扎赉特旗",
            "latitude": 46.7877,
            "longitude": 122.373
          },
          {
            "name": "突泉县",
            "latitude": 45.6192,
            "longitude": 121.5183
          },
          {
            "name": "市区",
            "latitude": 46.203,
            "longitude": 121.4724
          }
        ]
      },
      {
        "name": "锡林郭勒盟",
        "districts": [
          {
            "name": "二连浩特市",
            "latitude": 43.4152,
            "longitude": 112.0353
          },
          {
            "name": "锡林浩特市",
            "latitude": 44.0791,
            "longitude": 116.1422
          },
          {
            "name": "阿巴嘎旗",
            "latitude": 44.268,
            "longitude": 114.8968
          },
          {
            "name": "苏尼特左旗",
            "latitude": 44.0318,
            "longitude": 113.1447
          },
          {
            "name": "苏尼特右旗",
            "latitude": 42.8834,
            "longitude": 112.9142
          },
          {
            "name": "东乌珠穆沁旗",
            "latitude": 45.8137,
            "longitude": 117.772
          },
          {
            "name": "西乌珠穆沁旗",
            "latitude": 44.723,
            "longitude": 117.8041
          },
          {
            "name": "太仆寺旗",
            "latitude": 41.8962,
            "longitude": 115.2928
          },
          {
            "name": "镶黄旗",
            "latitude": 42.3553,
            "longitude": 114.1132
          },
          {
            "name": "正镶白旗",
            "latitude": 42.5431,
            "longitude": 115.0203
          },
          {
            "name": "正蓝旗",
            "latitude": 42.6659,
            "longitude": 115.9366
          },
          {
            "name": "多伦县",
            "latitude": 42.1821,
            "longitude": 116.4851
          },
          {
            "name": "市区",
            "latitude": 43.4047,
            "longitude": 115.1298
          }
        ]
      },
      {
        "name": "阿拉善盟",
        "districts": [
          {
            "name": "阿拉善左旗",
            "latitude": 39.539,
            "longitude": 105.0306
          },
          {
            "name": "阿拉善右旗",
            "latitude": 40.1384,
            "longitude": 102.4538
          },
          {
            "name": "额济纳旗",
            "latitude": 41.6665,
            "longitude": 100.1868
          },
          {
            "name": "市区",
            "latitude": 40.448,
            "longitude": 102.5571
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
            "name": "辽中区",
            "latitude": 41.5532,
            "longitude": 122.7446
          },
          {
            "name": "康平县",
            "latitude": 42.759,
            "longitude": 123.2675
          },
          {
            "name": "法库县",
            "latitude": 42.4086,
            "longitude": 123.2393
          },
          {
            "name": "新民市",
            "latitude": 42.0096,
            "longitude": 122.858
          },
          {
            "name": "市区",
            "latitude": 41.9197,
            "longitude": 123.2922
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
            "name": "普兰店区",
            "latitude": 39.6058,
            "longitude": 122.2877
          },
          {
            "name": "长海县",
            "latitude": 39.28,
            "longitude": 122.589
          },
          {
            "name": "瓦房店市",
            "latitude": 39.7066,
            "longitude": 121.775
          },
          {
            "name": "庄河市",
            "latitude": 39.8433,
            "longitude": 122.9352
          },
          {
            "name": "市区",
            "latitude": 39.2244,
            "longitude": 121.9075
          }
        ]
      },
      {
        "name": "鞍山市",
        "districts": [
          {
            "name": "铁东区",
            "latitude": 41.0463,
            "longitude": 123.0813
          },
          {
            "name": "铁西区",
            "latitude": 41.1329,
            "longitude": 122.9284
          },
          {
            "name": "立山区",
            "latitude": 41.1216,
            "longitude": 123.1021
          },
          {
            "name": "千山区",
            "latitude": 40.9852,
            "longitude": 122.9467
          },
          {
            "name": "台安县",
            "latitude": 41.3413,
            "longitude": 122.4379
          },
          {
            "name": "岫岩满族自治县",
            "latitude": 40.3973,
            "longitude": 123.3396
          },
          {
            "name": "海城市",
            "latitude": 40.8247,
            "longitude": 122.7783
          },
          {
            "name": "市区",
            "latitude": 40.9785,
            "longitude": 122.9449
          }
        ]
      },
      {
        "name": "抚顺市",
        "districts": [
          {
            "name": "新抚区",
            "latitude": 41.8123,
            "longitude": 123.9367
          },
          {
            "name": "东洲区",
            "latitude": 41.9341,
            "longitude": 124.1478
          },
          {
            "name": "望花区",
            "latitude": 41.7878,
            "longitude": 123.7979
          },
          {
            "name": "顺城区",
            "latitude": 41.942,
            "longitude": 123.9079
          },
          {
            "name": "抚顺县",
            "latitude": 41.6763,
            "longitude": 124.1664
          },
          {
            "name": "新宾满族自治县",
            "latitude": 41.6257,
            "longitude": 124.835
          },
          {
            "name": "清原满族自治县",
            "latitude": 42.1133,
            "longitude": 124.9185
          },
          {
            "name": "市区",
            "latitude": 41.8416,
            "longitude": 124.2443
          }
        ]
      },
      {
        "name": "本溪市",
        "districts": [
          {
            "name": "平山区",
            "latitude": 41.2208,
            "longitude": 123.7014
          },
          {
            "name": "溪湖区",
            "latitude": 41.4239,
            "longitude": 123.7147
          },
          {
            "name": "明山区",
            "latitude": 41.3252,
            "longitude": 123.874
          },
          {
            "name": "南芬区",
            "latitude": 41.0969,
            "longitude": 123.823
          },
          {
            "name": "本溪满族自治县",
            "latitude": 41.2006,
            "longitude": 124.1714
          },
          {
            "name": "桓仁满族自治县",
            "latitude": 41.2562,
            "longitude": 125.282
          },
          {
            "name": "市区",
            "latitude": 41.2539,
            "longitude": 124.0944
          }
        ]
      },
      {
        "name": "丹东市",
        "districts": [
          {
            "name": "元宝区",
            "latitude": 40.1788,
            "longitude": 124.3236
          },
          {
            "name": "振兴区",
            "latitude": 40.0496,
            "longitude": 124.2927
          },
          {
            "name": "振安区",
            "latitude": 40.2419,
            "longitude": 124.2909
          },
          {
            "name": "宽甸满族自治县",
            "latitude": 40.7638,
            "longitude": 124.9253
          },
          {
            "name": "东港市",
            "latitude": 39.9626,
            "longitude": 123.8483
          },
          {
            "name": "凤城市",
            "latitude": 40.5837,
            "longitude": 124.0593
          },
          {
            "name": "市区",
            "latitude": 40.2967,
            "longitude": 124.29
          }
        ]
      },
      {
        "name": "锦州市",
        "districts": [
          {
            "name": "古塔区",
            "latitude": 41.1537,
            "longitude": 121.0786
          },
          {
            "name": "凌河区",
            "latitude": 41.1272,
            "longitude": 121.1805
          },
          {
            "name": "太和区",
            "latitude": 40.9804,
            "longitude": 121.1606
          },
          {
            "name": "黑山县",
            "latitude": 41.7923,
            "longitude": 122.2529
          },
          {
            "name": "义县",
            "latitude": 41.5308,
            "longitude": 121.297
          },
          {
            "name": "凌海市",
            "latitude": 41.17,
            "longitude": 121.3064
          },
          {
            "name": "北镇市",
            "latitude": 41.5404,
            "longitude": 121.8573
          },
          {
            "name": "市区",
            "latitude": 41.3278,
            "longitude": 121.4476
          }
        ]
      },
      {
        "name": "营口市",
        "districts": [
          {
            "name": "站前区",
            "latitude": 40.6699,
            "longitude": 122.2532
          },
          {
            "name": "西市区",
            "latitude": 40.5847,
            "longitude": 122.2483
          },
          {
            "name": "鲅鱼圈区",
            "latitude": 40.2667,
            "longitude": 122.1612
          },
          {
            "name": "老边区",
            "latitude": 40.6827,
            "longitude": 122.3826
          },
          {
            "name": "盖州市",
            "latitude": 40.229,
            "longitude": 122.462
          },
          {
            "name": "大石桥市",
            "latitude": 40.6411,
            "longitude": 122.5639
          },
          {
            "name": "市区",
            "latitude": 40.5123,
            "longitude": 122.3452
          }
        ]
      },
      {
        "name": "阜新市",
        "districts": [
          {
            "name": "海州区",
            "latitude": 41.9571,
            "longitude": 121.633
          },
          {
            "name": "新邱区",
            "latitude": 42.0575,
            "longitude": 121.8242
          },
          {
            "name": "太平区",
            "latitude": 41.9946,
            "longitude": 121.7333
          },
          {
            "name": "清河门区",
            "latitude": 41.7528,
            "longitude": 121.4358
          },
          {
            "name": "细河区",
            "latitude": 42.0363,
            "longitude": 121.62
          },
          {
            "name": "阜新蒙古族自治县",
            "latitude": 42.1181,
            "longitude": 121.4535
          },
          {
            "name": "彰武县",
            "latitude": 42.5189,
            "longitude": 122.4664
          },
          {
            "name": "市区",
            "latitude": 42.0622,
            "longitude": 121.738
          }
        ]
      },
      {
        "name": "辽阳市",
        "districts": [
          {
            "name": "白塔区",
            "latitude": 41.2615,
            "longitude": 123.1824
          },
          {
            "name": "文圣区",
            "latitude": 41.2821,
            "longitude": 123.3392
          },
          {
            "name": "宏伟区",
            "latitude": 41.1847,
            "longitude": 123.2256
          },
          {
            "name": "弓长岭区",
            "latitude": 41.1495,
            "longitude": 123.418
          },
          {
            "name": "太子河区",
            "latitude": 41.3208,
            "longitude": 123.0884
          },
          {
            "name": "辽阳县",
            "latitude": 40.9531,
            "longitude": 123.3743
          },
          {
            "name": "灯塔市",
            "latitude": 41.4216,
            "longitude": 123.3196
          },
          {
            "name": "市区",
            "latitude": 41.2248,
            "longitude": 123.2782
          }
        ]
      },
      {
        "name": "盘锦市",
        "districts": [
          {
            "name": "双台子区",
            "latitude": 41.1951,
            "longitude": 122.0139
          },
          {
            "name": "兴隆台区",
            "latitude": 41.1461,
            "longitude": 122.0225
          },
          {
            "name": "大洼区",
            "latitude": 40.9131,
            "longitude": 122.0524
          },
          {
            "name": "盘山县",
            "latitude": 41.2407,
            "longitude": 121.9853
          },
          {
            "name": "市区",
            "latitude": 41.1237,
            "longitude": 122.0185
          }
        ]
      },
      {
        "name": "铁岭市",
        "districts": [
          {
            "name": "银州区",
            "latitude": 42.2479,
            "longitude": 123.8515
          },
          {
            "name": "清河区",
            "latitude": 42.5204,
            "longitude": 124.2713
          },
          {
            "name": "铁岭县",
            "latitude": 42.2662,
            "longitude": 123.7035
          },
          {
            "name": "西丰县",
            "latitude": 42.7067,
            "longitude": 124.7321
          },
          {
            "name": "昌图县",
            "latitude": 42.9942,
            "longitude": 123.9393
          },
          {
            "name": "调兵山市",
            "latitude": 42.434,
            "longitude": 123.581
          },
          {
            "name": "开原市",
            "latitude": 42.5421,
            "longitude": 124.0456
          },
          {
            "name": "市区",
            "latitude": 42.5302,
            "longitude": 124.0178
          }
        ]
      },
      {
        "name": "朝阳市",
        "districts": [
          {
            "name": "双塔区",
            "latitude": 41.5802,
            "longitude": 120.538
          },
          {
            "name": "龙城区",
            "latitude": 41.5625,
            "longitude": 120.2877
          },
          {
            "name": "朝阳县",
            "latitude": 41.3522,
            "longitude": 120.2921
          },
          {
            "name": "建平县",
            "latitude": 41.838,
            "longitude": 119.6254
          },
          {
            "name": "喀喇沁左翼蒙古族自治县",
            "latitude": 41.138,
            "longitude": 119.7686
          },
          {
            "name": "北票市",
            "latitude": 41.8624,
            "longitude": 120.8076
          },
          {
            "name": "凌源市",
            "latitude": 40.9743,
            "longitude": 119.2641
          },
          {
            "name": "市区",
            "latitude": 41.4725,
            "longitude": 120.0834
          }
        ]
      },
      {
        "name": "葫芦岛市",
        "districts": [
          {
            "name": "连山区",
            "latitude": 40.8667,
            "longitude": 120.6084
          },
          {
            "name": "龙港区",
            "latitude": 40.7335,
            "longitude": 120.9058
          },
          {
            "name": "南票区",
            "latitude": 41.0336,
            "longitude": 120.7722
          },
          {
            "name": "绥中县",
            "latitude": 40.2896,
            "longitude": 120.0313
          },
          {
            "name": "建昌县",
            "latitude": 40.7106,
            "longitude": 119.8276
          },
          {
            "name": "兴城市",
            "latitude": 40.584,
            "longitude": 120.47
          },
          {
            "name": "市区",
            "latitude": 40.703,
            "longitude": 120.4359
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
            "name": "双阳区",
            "latitude": 43.5261,
            "longitude": 125.7062
          },
          {
            "name": "九台区",
            "latitude": 44.2043,
            "longitude": 125.9792
          },
          {
            "name": "农安县",
            "latitude": 44.4725,
            "longitude": 125.0851
          },
          {
            "name": "榆树市",
            "latitude": 44.8732,
            "longitude": 126.596
          },
          {
            "name": "德惠市",
            "latitude": 44.5544,
            "longitude": 125.8104
          },
          {
            "name": "公主岭市",
            "latitude": 43.7863,
            "longitude": 124.6741
          },
          {
            "name": "市区",
            "latitude": 44.0775,
            "longitude": 125.5172
          }
        ]
      },
      {
        "name": "吉林市",
        "districts": [
          {
            "name": "昌邑区",
            "latitude": 44.0368,
            "longitude": 126.2832
          },
          {
            "name": "龙潭区",
            "latitude": 44.0519,
            "longitude": 126.6513
          },
          {
            "name": "船营区",
            "latitude": 43.8566,
            "longitude": 126.2953
          },
          {
            "name": "丰满区",
            "latitude": 43.6584,
            "longitude": 126.6985
          },
          {
            "name": "永吉县",
            "latitude": 43.5957,
            "longitude": 126.2209
          },
          {
            "name": "蛟河市",
            "latitude": 43.7085,
            "longitude": 127.3318
          },
          {
            "name": "桦甸市",
            "latitude": 43.048,
            "longitude": 127.0406
          },
          {
            "name": "舒兰市",
            "latitude": 44.3294,
            "longitude": 127.1105
          },
          {
            "name": "磐石市",
            "latitude": 43.0513,
            "longitude": 126.1666
          },
          {
            "name": "市区",
            "latitude": 43.7041,
            "longitude": 126.6443
          }
        ]
      },
      {
        "name": "四平市",
        "districts": [
          {
            "name": "铁西区",
            "latitude": 43.2244,
            "longitude": 124.3637
          },
          {
            "name": "铁东区",
            "latitude": 43.0586,
            "longitude": 124.5562
          },
          {
            "name": "梨树县",
            "latitude": 43.4842,
            "longitude": 124.3147
          },
          {
            "name": "伊通满族自治县",
            "latitude": 43.3413,
            "longitude": 125.2643
          },
          {
            "name": "双辽市",
            "latitude": 43.7597,
            "longitude": 123.6987
          },
          {
            "name": "市区",
            "latitude": 43.3736,
            "longitude": 124.4395
          }
        ]
      },
      {
        "name": "辽源市",
        "districts": [
          {
            "name": "龙山区",
            "latitude": 42.9169,
            "longitude": 125.214
          },
          {
            "name": "西安区",
            "latitude": 42.9524,
            "longitude": 125.1258
          },
          {
            "name": "东丰县",
            "latitude": 42.6785,
            "longitude": 125.4485
          },
          {
            "name": "东辽县",
            "latitude": 42.9277,
            "longitude": 124.992
          },
          {
            "name": "市区",
            "latitude": 42.8689,
            "longitude": 125.1951
          }
        ]
      },
      {
        "name": "通化市",
        "districts": [
          {
            "name": "东昌区",
            "latitude": 41.6723,
            "longitude": 125.9727
          },
          {
            "name": "二道江区",
            "latitude": 41.7637,
            "longitude": 126.1571
          },
          {
            "name": "通化县",
            "latitude": 41.7762,
            "longitude": 125.7424
          },
          {
            "name": "辉南县",
            "latitude": 42.5517,
            "longitude": 126.3356
          },
          {
            "name": "柳河县",
            "latitude": 42.1791,
            "longitude": 125.9094
          },
          {
            "name": "梅河口市",
            "latitude": 42.5346,
            "longitude": 125.7152
          },
          {
            "name": "集安市",
            "latitude": 41.2463,
            "longitude": 125.9895
          },
          {
            "name": "市区",
            "latitude": 41.9606,
            "longitude": 125.9746
          }
        ]
      },
      {
        "name": "白山市",
        "districts": [
          {
            "name": "浑江区",
            "latitude": 41.812,
            "longitude": 126.4214
          },
          {
            "name": "江源区",
            "latitude": 42.0471,
            "longitude": 126.765
          },
          {
            "name": "抚松县",
            "latitude": 42.2719,
            "longitude": 127.6172
          },
          {
            "name": "靖宇县",
            "latitude": 42.4447,
            "longitude": 126.8966
          },
          {
            "name": "长白朝鲜族自治县",
            "latitude": 41.579,
            "longitude": 127.8578
          },
          {
            "name": "临江市",
            "latitude": 41.8115,
            "longitude": 127.1876
          },
          {
            "name": "市区",
            "latitude": 41.9944,
            "longitude": 127.1243
          }
        ]
      },
      {
        "name": "松原市",
        "districts": [
          {
            "name": "宁江区",
            "latitude": 45.286,
            "longitude": 124.8604
          },
          {
            "name": "前郭尔罗斯蒙古族自治县",
            "latitude": 44.8626,
            "longitude": 124.4689
          },
          {
            "name": "长岭县",
            "latitude": 44.2981,
            "longitude": 123.8591
          },
          {
            "name": "乾安县",
            "latitude": 44.9223,
            "longitude": 123.9526
          },
          {
            "name": "扶余市",
            "latitude": 45.1262,
            "longitude": 125.5579
          },
          {
            "name": "市区",
            "latitude": 44.899,
            "longitude": 124.5398
          }
        ]
      },
      {
        "name": "白城市",
        "districts": [
          {
            "name": "洮北区",
            "latitude": 45.641,
            "longitude": 122.842
          },
          {
            "name": "镇赉县",
            "latitude": 45.9812,
            "longitude": 123.4967
          },
          {
            "name": "通榆县",
            "latitude": 44.7805,
            "longitude": 122.7399
          },
          {
            "name": "洮南市",
            "latitude": 45.4707,
            "longitude": 122.448
          },
          {
            "name": "大安市",
            "latitude": 45.4285,
            "longitude": 123.7175
          },
          {
            "name": "市区",
            "latitude": 45.4604,
            "longitude": 123.0488
          }
        ]
      },
      {
        "name": "延边朝鲜族自治州",
        "districts": [
          {
            "name": "延吉市",
            "latitude": 43.1002,
            "longitude": 129.3323
          },
          {
            "name": "图们市",
            "latitude": 43.0269,
            "longitude": 129.8327
          },
          {
            "name": "敦化市",
            "latitude": 43.5601,
            "longitude": 128.2323
          },
          {
            "name": "珲春市",
            "latitude": 43.0742,
            "longitude": 130.6961
          },
          {
            "name": "龙井市",
            "latitude": 42.7009,
            "longitude": 129.4417
          },
          {
            "name": "和龙市",
            "latitude": 42.4602,
            "longitude": 128.9041
          },
          {
            "name": "汪清县",
            "latitude": 43.534,
            "longitude": 129.936
          },
          {
            "name": "安图县",
            "latitude": 42.693,
            "longitude": 128.4312
          },
          {
            "name": "市区",
            "latitude": 43.0187,
            "longitude": 129.3508
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
            "name": "双城区",
            "latitude": 45.4036,
            "longitude": 126.1826
          },
          {
            "name": "依兰县",
            "latitude": 46.2685,
            "longitude": 129.7151
          },
          {
            "name": "方正县",
            "latitude": 45.8142,
            "longitude": 128.9431
          },
          {
            "name": "宾县",
            "latitude": 45.7781,
            "longitude": 127.6541
          },
          {
            "name": "巴彦县",
            "latitude": 46.3351,
            "longitude": 127.3189
          },
          {
            "name": "木兰县",
            "latitude": 46.2401,
            "longitude": 127.9256
          },
          {
            "name": "通河县",
            "latitude": 46.2424,
            "longitude": 128.756
          },
          {
            "name": "延寿县",
            "latitude": 45.488,
            "longitude": 128.4572
          },
          {
            "name": "尚志市",
            "latitude": 45.078,
            "longitude": 128.3174
          },
          {
            "name": "五常市",
            "latitude": 44.7665,
            "longitude": 127.4848
          },
          {
            "name": "市区",
            "latitude": 45.744,
            "longitude": 127.4693
          }
        ]
      },
      {
        "name": "齐齐哈尔市",
        "districts": [
          {
            "name": "龙沙区",
            "latitude": 47.2691,
            "longitude": 123.922
          },
          {
            "name": "建华区",
            "latitude": 47.4013,
            "longitude": 124.0165
          },
          {
            "name": "铁锋区",
            "latitude": 47.2872,
            "longitude": 124.2408
          },
          {
            "name": "昂昂溪区",
            "latitude": 47.1364,
            "longitude": 123.9597
          },
          {
            "name": "富拉尔基区",
            "latitude": 47.2224,
            "longitude": 123.5902
          },
          {
            "name": "碾子山区",
            "latitude": 47.5784,
            "longitude": 122.9253
          },
          {
            "name": "梅里斯达斡尔族区",
            "latitude": 47.5638,
            "longitude": 123.8595
          },
          {
            "name": "龙江县",
            "latitude": 47.2464,
            "longitude": 123.081
          },
          {
            "name": "依安县",
            "latitude": 47.7006,
            "longitude": 125.288
          },
          {
            "name": "泰来县",
            "latitude": 46.5982,
            "longitude": 123.5511
          },
          {
            "name": "甘南县",
            "latitude": 48.0048,
            "longitude": 123.8365
          },
          {
            "name": "富裕县",
            "latitude": 47.6629,
            "longitude": 124.5662
          },
          {
            "name": "克山县",
            "latitude": 48.1618,
            "longitude": 125.6997
          },
          {
            "name": "克东县",
            "latitude": 48.0044,
            "longitude": 126.3441
          },
          {
            "name": "拜泉县",
            "latitude": 47.5859,
            "longitude": 126.0149
          },
          {
            "name": "讷河市",
            "latitude": 48.4759,
            "longitude": 125.0691
          },
          {
            "name": "市区",
            "latitude": 47.5562,
            "longitude": 124.3728
          }
        ]
      },
      {
        "name": "鸡西市",
        "districts": [
          {
            "name": "鸡冠区",
            "latitude": 45.2885,
            "longitude": 130.9502
          },
          {
            "name": "恒山区",
            "latitude": 45.1581,
            "longitude": 130.914
          },
          {
            "name": "滴道区",
            "latitude": 45.3644,
            "longitude": 130.7409
          },
          {
            "name": "梨树区",
            "latitude": 45.0841,
            "longitude": 130.739
          },
          {
            "name": "城子河区",
            "latitude": 45.3773,
            "longitude": 131.0196
          },
          {
            "name": "麻山区",
            "latitude": 45.2045,
            "longitude": 130.5412
          },
          {
            "name": "鸡东县",
            "latitude": 45.2659,
            "longitude": 131.2188
          },
          {
            "name": "虎林市",
            "latitude": 45.9913,
            "longitude": 133.1136
          },
          {
            "name": "密山市",
            "latitude": 45.4635,
            "longitude": 132.17
          },
          {
            "name": "市区",
            "latitude": 45.3553,
            "longitude": 131.2675
          }
        ]
      },
      {
        "name": "鹤岗市",
        "districts": [
          {
            "name": "向阳区",
            "latitude": 47.3394,
            "longitude": 130.2965
          },
          {
            "name": "工农区",
            "latitude": 47.318,
            "longitude": 130.2661
          },
          {
            "name": "南山区",
            "latitude": 47.2815,
            "longitude": 130.2873
          },
          {
            "name": "兴安区",
            "latitude": 47.2461,
            "longitude": 130.1504
          },
          {
            "name": "东山区",
            "latitude": 47.2518,
            "longitude": 130.4182
          },
          {
            "name": "兴山区",
            "latitude": 47.3872,
            "longitude": 130.3213
          },
          {
            "name": "萝北县",
            "latitude": 47.7849,
            "longitude": 130.5724
          },
          {
            "name": "绥滨县",
            "latitude": 47.4778,
            "longitude": 131.8487
          },
          {
            "name": "市区",
            "latitude": 47.3858,
            "longitude": 130.5201
          }
        ]
      },
      {
        "name": "双鸭山市",
        "districts": [
          {
            "name": "尖山区",
            "latitude": 46.6455,
            "longitude": 131.172
          },
          {
            "name": "岭东区",
            "latitude": 46.4876,
            "longitude": 131.1936
          },
          {
            "name": "四方台区",
            "latitude": 46.6736,
            "longitude": 131.2822
          },
          {
            "name": "宝山区",
            "latitude": 46.5258,
            "longitude": 131.5169
          },
          {
            "name": "集贤县",
            "latitude": 46.8156,
            "longitude": 131.1456
          },
          {
            "name": "友谊县",
            "latitude": 46.7834,
            "longitude": 131.8494
          },
          {
            "name": "宝清县",
            "latitude": 46.4041,
            "longitude": 132.3964
          },
          {
            "name": "饶河县",
            "latitude": 47.1309,
            "longitude": 133.7973
          },
          {
            "name": "市区",
            "latitude": 46.6833,
            "longitude": 131.7942
          }
        ]
      },
      {
        "name": "大庆市",
        "districts": [
          {
            "name": "萨尔图区",
            "latitude": 46.7078,
            "longitude": 125.0616
          },
          {
            "name": "龙凤区",
            "latitude": 46.5257,
            "longitude": 125.1267
          },
          {
            "name": "让胡路区",
            "latitude": 46.7023,
            "longitude": 124.7782
          },
          {
            "name": "红岗区",
            "latitude": 46.3508,
            "longitude": 124.883
          },
          {
            "name": "大同区",
            "latitude": 46.0785,
            "longitude": 124.6834
          },
          {
            "name": "肇州县",
            "latitude": 45.8353,
            "longitude": 125.3
          },
          {
            "name": "肇源县",
            "latitude": 45.6428,
            "longitude": 124.7616
          },
          {
            "name": "林甸县",
            "latitude": 47.153,
            "longitude": 124.8986
          },
          {
            "name": "杜尔伯特蒙古族自治县",
            "latitude": 46.5584,
            "longitude": 124.2377
          },
          {
            "name": "市区",
            "latitude": 46.395,
            "longitude": 124.859
          }
        ]
      },
      {
        "name": "伊春市",
        "districts": [
          {
            "name": "伊美区",
            "latitude": 47.7573,
            "longitude": 129.2712
          },
          {
            "name": "乌翠区",
            "latitude": 47.6327,
            "longitude": 128.5714
          },
          {
            "name": "友好区",
            "latitude": 48.0774,
            "longitude": 128.6689
          },
          {
            "name": "嘉荫县",
            "latitude": 48.7645,
            "longitude": 130.0019
          },
          {
            "name": "汤旺县",
            "latitude": 48.6053,
            "longitude": 129.4614
          },
          {
            "name": "丰林县",
            "latitude": 48.2374,
            "longitude": 129.3763
          },
          {
            "name": "大箐山县",
            "latitude": 46.8684,
            "longitude": 128.9251
          },
          {
            "name": "南岔县",
            "latitude": 47.0761,
            "longitude": 129.381
          },
          {
            "name": "金林区",
            "latitude": 47.4993,
            "longitude": 129.5436
          },
          {
            "name": "铁力市",
            "latitude": 46.9197,
            "longitude": 128.2896
          },
          {
            "name": "市区",
            "latitude": 47.7438,
            "longitude": 129.149
          }
        ]
      },
      {
        "name": "佳木斯市",
        "districts": [
          {
            "name": "向阳区",
            "latitude": 46.8183,
            "longitude": 130.3598
          },
          {
            "name": "前进区",
            "latitude": 46.776,
            "longitude": 130.4073
          },
          {
            "name": "东风区",
            "latitude": 46.7999,
            "longitude": 130.4469
          },
          {
            "name": "郊区",
            "latitude": 46.7722,
            "longitude": 130.2685
          },
          {
            "name": "桦南县",
            "latitude": 46.2835,
            "longitude": 130.7091
          },
          {
            "name": "桦川县",
            "latitude": 46.9816,
            "longitude": 130.9484
          },
          {
            "name": "汤原县",
            "latitude": 46.73,
            "longitude": 129.9045
          },
          {
            "name": "同江市",
            "latitude": 47.8287,
            "longitude": 133.2672
          },
          {
            "name": "富锦市",
            "latitude": 47.1648,
            "longitude": 132.5312
          },
          {
            "name": "抚远市",
            "latitude": 47.9669,
            "longitude": 134.2766
          },
          {
            "name": "市区",
            "latitude": 47.0122,
            "longitude": 131.3119
          }
        ]
      },
      {
        "name": "七台河市",
        "districts": [
          {
            "name": "新兴区",
            "latitude": 45.9583,
            "longitude": 131.1623
          },
          {
            "name": "桃山区",
            "latitude": 45.7587,
            "longitude": 130.9928
          },
          {
            "name": "茄子河区",
            "latitude": 45.888,
            "longitude": 131.4641
          },
          {
            "name": "勃利县",
            "latitude": 45.8299,
            "longitude": 130.4892
          },
          {
            "name": "市区",
            "latitude": 45.8587,
            "longitude": 131.0271
          }
        ]
      },
      {
        "name": "牡丹江市",
        "districts": [
          {
            "name": "东安区",
            "latitude": 44.3856,
            "longitude": 129.8349
          },
          {
            "name": "阳明区",
            "latitude": 44.6602,
            "longitude": 129.8747
          },
          {
            "name": "爱民区",
            "latitude": 44.7085,
            "longitude": 129.5142
          },
          {
            "name": "西安区",
            "latitude": 44.4904,
            "longitude": 129.534
          },
          {
            "name": "林口县",
            "latitude": 45.44,
            "longitude": 130.0323
          },
          {
            "name": "绥芬河市",
            "latitude": 44.402,
            "longitude": 131.0951
          },
          {
            "name": "海林市",
            "latitude": 44.9084,
            "longitude": 129.218
          },
          {
            "name": "宁安市",
            "latitude": 44.0538,
            "longitude": 129.2102
          },
          {
            "name": "穆棱市",
            "latitude": 44.5707,
            "longitude": 130.422
          },
          {
            "name": "东宁市",
            "latitude": 44.0214,
            "longitude": 130.8404
          },
          {
            "name": "市区",
            "latitude": 44.5641,
            "longitude": 129.9576
          }
        ]
      },
      {
        "name": "黑河市",
        "districts": [
          {
            "name": "爱辉区",
            "latitude": 50.2254,
            "longitude": 126.7333
          },
          {
            "name": "逊克县",
            "latitude": 49.0366,
            "longitude": 128.6121
          },
          {
            "name": "孙吴县",
            "latitude": 49.3976,
            "longitude": 127.3269
          },
          {
            "name": "北安市",
            "latitude": 48.1108,
            "longitude": 127.1065
          },
          {
            "name": "五大连池市",
            "latitude": 48.6858,
            "longitude": 127.1856
          },
          {
            "name": "嫩江市",
            "latitude": 49.6046,
            "longitude": 125.7661
          },
          {
            "name": "市区",
            "latitude": 49.1768,
            "longitude": 127.1217
          }
        ]
      },
      {
        "name": "绥化市",
        "districts": [
          {
            "name": "北林区",
            "latitude": 46.7417,
            "longitude": 126.9509
          },
          {
            "name": "望奎县",
            "latitude": 46.8634,
            "longitude": 126.5861
          },
          {
            "name": "兰西县",
            "latitude": 46.3524,
            "longitude": 126.2073
          },
          {
            "name": "青冈县",
            "latitude": 46.8409,
            "longitude": 125.9497
          },
          {
            "name": "庆安县",
            "latitude": 46.8792,
            "longitude": 127.51
          },
          {
            "name": "明水县",
            "latitude": 47.1951,
            "longitude": 125.8347
          },
          {
            "name": "绥棱县",
            "latitude": 47.5791,
            "longitude": 127.7167
          },
          {
            "name": "安达市",
            "latitude": 46.5298,
            "longitude": 125.3784
          },
          {
            "name": "肇东市",
            "latitude": 46.0043,
            "longitude": 125.843
          },
          {
            "name": "海伦市",
            "latitude": 47.4388,
            "longitude": 126.8852
          },
          {
            "name": "市区",
            "latitude": 46.8425,
            "longitude": 126.4862
          }
        ]
      },
      {
        "name": "大兴安岭地区",
        "districts": [
          {
            "name": "漠河市",
            "latitude": 52.94,
            "longitude": 122.7083
          },
          {
            "name": "呼玛县",
            "latitude": 51.8064,
            "longitude": 124.9055
          },
          {
            "name": "塔河县",
            "latitude": 52.7113,
            "longitude": 124.6341
          },
          {
            "name": "加格达奇区",
            "latitude": 50.3757,
            "longitude": 124.138
          },
          {
            "name": "松岭区",
            "latitude": 51.9583,
            "longitude": 124.0965
          },
          {
            "name": "新林区",
            "latitude": 51.9583,
            "longitude": 124.0965
          },
          {
            "name": "呼中区",
            "latitude": 51.9583,
            "longitude": 124.0965
          },
          {
            "name": "市区",
            "latitude": 51.9583,
            "longitude": 124.0965
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
            "latitude": 31.194,
            "longitude": 121.4165
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
            "latitude": 31.9536,
            "longitude": 118.8199
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
            "latitude": 31.5708,
            "longitude": 120.2444
          }
        ]
      },
      {
        "name": "徐州市",
        "districts": [
          {
            "name": "鼓楼区",
            "latitude": 34.3089,
            "longitude": 117.1409
          },
          {
            "name": "云龙区",
            "latitude": 34.212,
            "longitude": 117.2692
          },
          {
            "name": "贾汪区",
            "latitude": 34.3832,
            "longitude": 117.4665
          },
          {
            "name": "泉山区",
            "latitude": 34.2633,
            "longitude": 117.1434
          },
          {
            "name": "铜山区",
            "latitude": 34.1929,
            "longitude": 117.1839
          },
          {
            "name": "丰县",
            "latitude": 34.69,
            "longitude": 116.6091
          },
          {
            "name": "沛县",
            "latitude": 34.6952,
            "longitude": 116.8974
          },
          {
            "name": "睢宁县",
            "latitude": 33.9406,
            "longitude": 117.8839
          },
          {
            "name": "新沂市",
            "latitude": 34.2804,
            "longitude": 118.3401
          },
          {
            "name": "邳州市",
            "latitude": 34.3947,
            "longitude": 117.8946
          },
          {
            "name": "市区",
            "latitude": 34.3361,
            "longitude": 117.3829
          }
        ]
      },
      {
        "name": "常州市",
        "districts": [
          {
            "name": "天宁区",
            "latitude": 31.802,
            "longitude": 120.06
          },
          {
            "name": "钟楼区",
            "latitude": 31.7878,
            "longitude": 119.858
          },
          {
            "name": "新北区",
            "latitude": 31.9243,
            "longitude": 119.8863
          },
          {
            "name": "武进区",
            "latitude": 31.6387,
            "longitude": 119.9409
          },
          {
            "name": "金坛区",
            "latitude": 31.7172,
            "longitude": 119.509
          },
          {
            "name": "溧阳市",
            "latitude": 31.4198,
            "longitude": 119.3763
          },
          {
            "name": "市区",
            "latitude": 31.715,
            "longitude": 119.7717
          }
        ]
      },
      {
        "name": "苏州市",
        "districts": [
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
            "name": "姑苏区",
            "latitude": 31.3104,
            "longitude": 120.6228
          },
          {
            "name": "吴江区",
            "latitude": 31.1386,
            "longitude": 120.6451
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
            "name": "昆山市",
            "latitude": 31.3855,
            "longitude": 120.9807
          },
          {
            "name": "太仓市",
            "latitude": 31.4584,
            "longitude": 121.1298
          },
          {
            "name": "市区",
            "latitude": 31.4149,
            "longitude": 120.6897
          }
        ]
      },
      {
        "name": "南通市",
        "districts": [
          {
            "name": "通州区",
            "latitude": 32.1139,
            "longitude": 121.0516
          },
          {
            "name": "崇川区",
            "latitude": 31.952,
            "longitude": 120.9038
          },
          {
            "name": "海门区",
            "latitude": 31.9542,
            "longitude": 121.3101
          },
          {
            "name": "如东县",
            "latitude": 32.3874,
            "longitude": 121.0906
          },
          {
            "name": "启东市",
            "latitude": 31.855,
            "longitude": 121.7037
          },
          {
            "name": "如皋市",
            "latitude": 32.2684,
            "longitude": 120.5735
          },
          {
            "name": "海安市",
            "latitude": 32.55,
            "longitude": 120.4787
          },
          {
            "name": "市区",
            "latitude": 32.1544,
            "longitude": 121.016
          }
        ]
      },
      {
        "name": "连云港市",
        "districts": [
          {
            "name": "连云区",
            "latitude": 34.6211,
            "longitude": 119.4266
          },
          {
            "name": "海州区",
            "latitude": 34.5785,
            "longitude": 119.184
          },
          {
            "name": "赣榆区",
            "latitude": 34.8858,
            "longitude": 119.0416
          },
          {
            "name": "东海县",
            "latitude": 34.5437,
            "longitude": 118.756
          },
          {
            "name": "灌云县",
            "latitude": 34.3695,
            "longitude": 119.4001
          },
          {
            "name": "灌南县",
            "latitude": 34.1707,
            "longitude": 119.4417
          },
          {
            "name": "市区",
            "latitude": 34.5282,
            "longitude": 119.2083
          }
        ]
      },
      {
        "name": "淮安市",
        "districts": [
          {
            "name": "淮安区",
            "latitude": 33.4975,
            "longitude": 119.2966
          },
          {
            "name": "淮阴区",
            "latitude": 33.6586,
            "longitude": 118.9288
          },
          {
            "name": "清江浦区",
            "latitude": 33.52,
            "longitude": 119.0504
          },
          {
            "name": "洪泽区",
            "latitude": 33.229,
            "longitude": 118.8215
          },
          {
            "name": "涟水县",
            "latitude": 33.8781,
            "longitude": 119.3183
          },
          {
            "name": "盱眙县",
            "latitude": 32.9652,
            "longitude": 118.5295
          },
          {
            "name": "金湖县",
            "latitude": 33.0129,
            "longitude": 119.1432
          },
          {
            "name": "市区",
            "latitude": 33.3945,
            "longitude": 119.0126
          }
        ]
      },
      {
        "name": "盐城市",
        "districts": [
          {
            "name": "亭湖区",
            "latitude": 33.4211,
            "longitude": 120.2796
          },
          {
            "name": "盐都区",
            "latitude": 33.2634,
            "longitude": 119.9655
          },
          {
            "name": "大丰区",
            "latitude": 33.1978,
            "longitude": 120.5681
          },
          {
            "name": "响水县",
            "latitude": 34.2331,
            "longitude": 119.7962
          },
          {
            "name": "滨海县",
            "latitude": 34.0934,
            "longitude": 120.0309
          },
          {
            "name": "阜宁县",
            "latitude": 33.7061,
            "longitude": 119.6984
          },
          {
            "name": "射阳县",
            "latitude": 33.7716,
            "longitude": 120.2634
          },
          {
            "name": "建湖县",
            "latitude": 33.4828,
            "longitude": 119.8298
          },
          {
            "name": "东台市",
            "latitude": 32.7892,
            "longitude": 120.5971
          },
          {
            "name": "市区",
            "latitude": 33.5509,
            "longitude": 120.1143
          }
        ]
      },
      {
        "name": "扬州市",
        "districts": [
          {
            "name": "广陵区",
            "latitude": 32.3427,
            "longitude": 119.5555
          },
          {
            "name": "邗江区",
            "latitude": 32.4569,
            "longitude": 119.3959
          },
          {
            "name": "江都区",
            "latitude": 32.5342,
            "longitude": 119.6948
          },
          {
            "name": "宝应县",
            "latitude": 33.2187,
            "longitude": 119.4493
          },
          {
            "name": "仪征市",
            "latitude": 32.3863,
            "longitude": 119.1945
          },
          {
            "name": "高邮市",
            "latitude": 32.8288,
            "longitude": 119.5036
          },
          {
            "name": "市区",
            "latitude": 32.6279,
            "longitude": 119.4656
          }
        ]
      },
      {
        "name": "镇江市",
        "districts": [
          {
            "name": "京口区",
            "latitude": 32.1847,
            "longitude": 119.6363
          },
          {
            "name": "润州区",
            "latitude": 32.1884,
            "longitude": 119.421
          },
          {
            "name": "丹徒区",
            "latitude": 32.0746,
            "longitude": 119.4133
          },
          {
            "name": "丹阳市",
            "latitude": 31.9547,
            "longitude": 119.6377
          },
          {
            "name": "扬中市",
            "latitude": 32.184,
            "longitude": 119.8375
          },
          {
            "name": "句容市",
            "latitude": 31.9263,
            "longitude": 119.2007
          },
          {
            "name": "市区",
            "latitude": 32.0855,
            "longitude": 119.5244
          }
        ]
      },
      {
        "name": "泰州市",
        "districts": [
          {
            "name": "海陵区",
            "latitude": 32.5094,
            "longitude": 119.9164
          },
          {
            "name": "高港区",
            "latitude": 32.3207,
            "longitude": 119.9447
          },
          {
            "name": "姜堰区",
            "latitude": 32.5159,
            "longitude": 120.1158
          },
          {
            "name": "兴化市",
            "latitude": 32.9554,
            "longitude": 119.9896
          },
          {
            "name": "靖江市",
            "latitude": 32.034,
            "longitude": 120.2668
          },
          {
            "name": "泰兴市",
            "latitude": 32.1999,
            "longitude": 120.1342
          },
          {
            "name": "市区",
            "latitude": 32.4226,
            "longitude": 120.0612
          }
        ]
      },
      {
        "name": "宿迁市",
        "districts": [
          {
            "name": "宿城区",
            "latitude": 33.8037,
            "longitude": 118.3294
          },
          {
            "name": "宿豫区",
            "latitude": 34.0031,
            "longitude": 118.3589
          },
          {
            "name": "沭阳县",
            "latitude": 34.1485,
            "longitude": 118.8514
          },
          {
            "name": "泗阳县",
            "latitude": 33.7019,
            "longitude": 118.6918
          },
          {
            "name": "泗洪县",
            "latitude": 33.4103,
            "longitude": 118.3048
          },
          {
            "name": "市区",
            "latitude": 33.8135,
            "longitude": 118.5073
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
            "name": "下城区",
            "latitude": 30.1071,
            "longitude": 119.8927
          },
          {
            "name": "江干区",
            "latitude": 30.1071,
            "longitude": 119.8927
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
            "name": "市区",
            "latitude": 30.1071,
            "longitude": 119.8927
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
            "name": "象山县",
            "latitude": 29.3845,
            "longitude": 121.8445
          },
          {
            "name": "宁海县",
            "latitude": 29.3055,
            "longitude": 121.4753
          },
          {
            "name": "余姚市",
            "latitude": 30.0245,
            "longitude": 121.1257
          },
          {
            "name": "慈溪市",
            "latitude": 30.2301,
            "longitude": 121.3145
          },
          {
            "name": "市区",
            "latitude": 29.7941,
            "longitude": 121.5169
          }
        ]
      },
      {
        "name": "温州市",
        "districts": [
          {
            "name": "鹿城区",
            "latitude": 28.0625,
            "longitude": 120.5599
          },
          {
            "name": "龙湾区",
            "latitude": 27.8827,
            "longitude": 120.8193
          },
          {
            "name": "瓯海区",
            "latitude": 27.9666,
            "longitude": 120.5512
          },
          {
            "name": "洞头区",
            "latitude": 27.8926,
            "longitude": 121.0338
          },
          {
            "name": "永嘉县",
            "latitude": 28.3307,
            "longitude": 120.6622
          },
          {
            "name": "平阳县",
            "latitude": 27.6336,
            "longitude": 120.3811
          },
          {
            "name": "苍南县",
            "latitude": 27.3951,
            "longitude": 120.4475
          },
          {
            "name": "文成县",
            "latitude": 27.8076,
            "longitude": 120.0223
          },
          {
            "name": "泰顺县",
            "latitude": 27.5312,
            "longitude": 119.8778
          },
          {
            "name": "瑞安市",
            "latitude": 27.8221,
            "longitude": 120.465
          },
          {
            "name": "乐清市",
            "latitude": 28.2408,
            "longitude": 121.0187
          },
          {
            "name": "龙港市",
            "latitude": 27.5327,
            "longitude": 120.5781
          },
          {
            "name": "市区",
            "latitude": 27.8415,
            "longitude": 120.5347
          }
        ]
      },
      {
        "name": "嘉兴市",
        "districts": [
          {
            "name": "南湖区",
            "latitude": 30.7111,
            "longitude": 120.8422
          },
          {
            "name": "秀洲区",
            "latitude": 30.7689,
            "longitude": 120.6863
          },
          {
            "name": "嘉善县",
            "latitude": 30.8996,
            "longitude": 120.9023
          },
          {
            "name": "海盐县",
            "latitude": 30.4744,
            "longitude": 120.9295
          },
          {
            "name": "海宁市",
            "latitude": 30.4254,
            "longitude": 120.6232
          },
          {
            "name": "平湖市",
            "latitude": 30.7056,
            "longitude": 121.1031
          },
          {
            "name": "桐乡市",
            "latitude": 30.606,
            "longitude": 120.4838
          },
          {
            "name": "市区",
            "latitude": 30.6559,
            "longitude": 120.7958
          }
        ]
      },
      {
        "name": "湖州市",
        "districts": [
          {
            "name": "吴兴区",
            "latitude": 30.8033,
            "longitude": 120.0848
          },
          {
            "name": "南浔区",
            "latitude": 30.7579,
            "longitude": 120.3055
          },
          {
            "name": "德清县",
            "latitude": 30.5617,
            "longitude": 120.0438
          },
          {
            "name": "长兴县",
            "latitude": 30.9771,
            "longitude": 119.8132
          },
          {
            "name": "安吉县",
            "latitude": 30.6204,
            "longitude": 119.5771
          },
          {
            "name": "市区",
            "latitude": 30.7441,
            "longitude": 119.9649
          }
        ]
      },
      {
        "name": "绍兴市",
        "districts": [
          {
            "name": "越城区",
            "latitude": 30.0397,
            "longitude": 120.6677
          },
          {
            "name": "柯桥区",
            "latitude": 30.078,
            "longitude": 120.4761
          },
          {
            "name": "上虞区",
            "latitude": 29.9651,
            "longitude": 120.8995
          },
          {
            "name": "新昌县",
            "latitude": 29.4082,
            "longitude": 120.9693
          },
          {
            "name": "诸暨市",
            "latitude": 29.6938,
            "longitude": 120.275
          },
          {
            "name": "嵊州市",
            "latitude": 29.5854,
            "longitude": 120.7567
          },
          {
            "name": "市区",
            "latitude": 29.795,
            "longitude": 120.6741
          }
        ]
      },
      {
        "name": "金华市",
        "districts": [
          {
            "name": "婺城区",
            "latitude": 28.977,
            "longitude": 119.5097
          },
          {
            "name": "金东区",
            "latitude": 29.1494,
            "longitude": 119.7996
          },
          {
            "name": "武义县",
            "latitude": 28.7683,
            "longitude": 119.7145
          },
          {
            "name": "浦江县",
            "latitude": 29.5201,
            "longitude": 119.9039
          },
          {
            "name": "磐安县",
            "latitude": 29.0379,
            "longitude": 120.5597
          },
          {
            "name": "兰溪市",
            "latitude": 29.2782,
            "longitude": 119.5267
          },
          {
            "name": "义乌市",
            "latitude": 29.3006,
            "longitude": 120.061
          },
          {
            "name": "东阳市",
            "latitude": 29.2324,
            "longitude": 120.3757
          },
          {
            "name": "永康市",
            "latitude": 28.9343,
            "longitude": 120.1024
          },
          {
            "name": "市区",
            "latitude": 29.1331,
            "longitude": 119.9504
          }
        ]
      },
      {
        "name": "衢州市",
        "districts": [
          {
            "name": "柯城区",
            "latitude": 28.9953,
            "longitude": 118.8076
          },
          {
            "name": "衢江区",
            "latitude": 28.9346,
            "longitude": 118.932
          },
          {
            "name": "常山县",
            "latitude": 28.9678,
            "longitude": 118.5407
          },
          {
            "name": "开化县",
            "latitude": 29.1846,
            "longitude": 118.3255
          },
          {
            "name": "龙游县",
            "latitude": 28.991,
            "longitude": 119.1915
          },
          {
            "name": "江山市",
            "latitude": 28.5756,
            "longitude": 118.6003
          },
          {
            "name": "市区",
            "latitude": 28.9415,
            "longitude": 118.7329
          }
        ]
      },
      {
        "name": "舟山市",
        "districts": [
          {
            "name": "定海区",
            "latitude": 30.071,
            "longitude": 122.1091
          },
          {
            "name": "普陀区",
            "latitude": 29.6967,
            "longitude": 122.2372
          },
          {
            "name": "岱山县",
            "latitude": 30.1724,
            "longitude": 122.1721
          },
          {
            "name": "嵊泗县",
            "latitude": 30.8198,
            "longitude": 122.6263
          },
          {
            "name": "市区",
            "latitude": 30.19,
            "longitude": 122.2862
          }
        ]
      },
      {
        "name": "台州市",
        "districts": [
          {
            "name": "椒江区",
            "latitude": 28.6607,
            "longitude": 121.4521
          },
          {
            "name": "黄岩区",
            "latitude": 28.5989,
            "longitude": 121.0811
          },
          {
            "name": "路桥区",
            "latitude": 28.5404,
            "longitude": 121.4819
          },
          {
            "name": "三门县",
            "latitude": 29.0114,
            "longitude": 121.5109
          },
          {
            "name": "天台县",
            "latitude": 29.1453,
            "longitude": 120.9772
          },
          {
            "name": "仙居县",
            "latitude": 28.7333,
            "longitude": 120.6344
          },
          {
            "name": "温岭市",
            "latitude": 28.3885,
            "longitude": 121.4271
          },
          {
            "name": "临海市",
            "latitude": 28.8479,
            "longitude": 121.2288
          },
          {
            "name": "玉环市",
            "latitude": 28.1699,
            "longitude": 121.2572
          },
          {
            "name": "市区",
            "latitude": 28.6774,
            "longitude": 121.2279
          }
        ]
      },
      {
        "name": "丽水市",
        "districts": [
          {
            "name": "莲都区",
            "latitude": 28.4407,
            "longitude": 119.8428
          },
          {
            "name": "青田县",
            "latitude": 28.2032,
            "longitude": 120.1398
          },
          {
            "name": "缙云县",
            "latitude": 28.6592,
            "longitude": 120.185
          },
          {
            "name": "遂昌县",
            "latitude": 28.5191,
            "longitude": 119.083
          },
          {
            "name": "松阳县",
            "latitude": 28.4053,
            "longitude": 119.435
          },
          {
            "name": "云和县",
            "latitude": 28.1256,
            "longitude": 119.5361
          },
          {
            "name": "庆元县",
            "latitude": 27.6237,
            "longitude": 119.1504
          },
          {
            "name": "景宁畲族自治县",
            "latitude": 27.8911,
            "longitude": 119.6135
          },
          {
            "name": "龙泉市",
            "latitude": 28.0454,
            "longitude": 119.0756
          },
          {
            "name": "市区",
            "latitude": 28.2126,
            "longitude": 119.5624
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
            "name": "长丰县",
            "latitude": 32.2334,
            "longitude": 117.1972
          },
          {
            "name": "肥东县",
            "latitude": 32.0004,
            "longitude": 117.5741
          },
          {
            "name": "肥西县",
            "latitude": 31.686,
            "longitude": 117.0038
          },
          {
            "name": "庐江县",
            "latitude": 31.2677,
            "longitude": 117.3261
          },
          {
            "name": "巢湖市",
            "latitude": 31.6446,
            "longitude": 117.7231
          },
          {
            "name": "市区",
            "latitude": 31.8102,
            "longitude": 117.3072
          }
        ]
      },
      {
        "name": "芜湖市",
        "districts": [
          {
            "name": "镜湖区",
            "latitude": 31.2317,
            "longitude": 118.4589
          },
          {
            "name": "鸠江区",
            "latitude": 31.3724,
            "longitude": 118.2605
          },
          {
            "name": "弋江区",
            "latitude": 31.2144,
            "longitude": 118.2931
          },
          {
            "name": "湾沚区",
            "latitude": 31.1436,
            "longitude": 118.5729
          },
          {
            "name": "繁昌区",
            "latitude": 31.0791,
            "longitude": 118.1601
          },
          {
            "name": "南陵县",
            "latitude": 30.8913,
            "longitude": 118.2797
          },
          {
            "name": "无为市",
            "latitude": 31.2446,
            "longitude": 117.797
          },
          {
            "name": "市区",
            "latitude": 31.1682,
            "longitude": 118.2603
          }
        ]
      },
      {
        "name": "蚌埠市",
        "districts": [
          {
            "name": "龙子湖区",
            "latitude": 32.9156,
            "longitude": 117.4563
          },
          {
            "name": "蚌山区",
            "latitude": 32.8775,
            "longitude": 117.3643
          },
          {
            "name": "禹会区",
            "latitude": 32.8528,
            "longitude": 117.2249
          },
          {
            "name": "淮上区",
            "latitude": 33.0198,
            "longitude": 117.4334
          },
          {
            "name": "怀远县",
            "latitude": 33.0492,
            "longitude": 117.0154
          },
          {
            "name": "五河县",
            "latitude": 33.1476,
            "longitude": 117.7826
          },
          {
            "name": "固镇县",
            "latitude": 33.2823,
            "longitude": 117.3461
          },
          {
            "name": "市区",
            "latitude": 33.0207,
            "longitude": 117.3747
          }
        ]
      },
      {
        "name": "淮南市",
        "districts": [
          {
            "name": "大通区",
            "latitude": 32.6266,
            "longitude": 117.12
          },
          {
            "name": "田家庵区",
            "latitude": 32.5576,
            "longitude": 117.0005
          },
          {
            "name": "谢家集区",
            "latitude": 32.5162,
            "longitude": 116.9168
          },
          {
            "name": "八公山区",
            "latitude": 32.6523,
            "longitude": 116.8232
          },
          {
            "name": "潘集区",
            "latitude": 32.7802,
            "longitude": 116.8525
          },
          {
            "name": "凤台县",
            "latitude": 32.7849,
            "longitude": 116.5778
          },
          {
            "name": "寿县",
            "latitude": 32.2584,
            "longitude": 116.7591
          },
          {
            "name": "市区",
            "latitude": 32.5966,
            "longitude": 116.8643
          }
        ]
      },
      {
        "name": "马鞍山市",
        "districts": [
          {
            "name": "花山区",
            "latitude": 31.7174,
            "longitude": 118.5529
          },
          {
            "name": "雨山区",
            "latitude": 31.6404,
            "longitude": 118.5411
          },
          {
            "name": "博望区",
            "latitude": 31.5722,
            "longitude": 118.7569
          },
          {
            "name": "当涂县",
            "latitude": 31.4635,
            "longitude": 118.6014
          },
          {
            "name": "含山县",
            "latitude": 31.6572,
            "longitude": 118.0472
          },
          {
            "name": "和县",
            "latitude": 31.7557,
            "longitude": 118.2985
          },
          {
            "name": "市区",
            "latitude": 31.6344,
            "longitude": 118.4663
          }
        ]
      },
      {
        "name": "淮北市",
        "districts": [
          {
            "name": "杜集区",
            "latitude": 34.0191,
            "longitude": 116.8917
          },
          {
            "name": "相山区",
            "latitude": 33.9758,
            "longitude": 116.7445
          },
          {
            "name": "烈山区",
            "latitude": 33.834,
            "longitude": 116.8865
          },
          {
            "name": "濉溪县",
            "latitude": 33.6494,
            "longitude": 116.7018
          },
          {
            "name": "市区",
            "latitude": 33.8696,
            "longitude": 116.8061
          }
        ]
      },
      {
        "name": "铜陵市",
        "districts": [
          {
            "name": "铜官区",
            "latitude": 30.954,
            "longitude": 117.8429
          },
          {
            "name": "义安区",
            "latitude": 30.9566,
            "longitude": 117.925
          },
          {
            "name": "郊区",
            "latitude": 30.8772,
            "longitude": 117.6673
          },
          {
            "name": "枞阳县",
            "latitude": 30.8491,
            "longitude": 117.3139
          },
          {
            "name": "市区",
            "latitude": 30.9092,
            "longitude": 117.6873
          }
        ]
      },
      {
        "name": "安庆市",
        "districts": [
          {
            "name": "迎江区",
            "latitude": 30.5535,
            "longitude": 117.1769
          },
          {
            "name": "大观区",
            "latitude": 30.4854,
            "longitude": 116.9175
          },
          {
            "name": "宜秀区",
            "latitude": 30.6492,
            "longitude": 117.0713
          },
          {
            "name": "怀宁县",
            "latitude": 30.5855,
            "longitude": 116.7604
          },
          {
            "name": "太湖县",
            "latitude": 30.4929,
            "longitude": 116.178
          },
          {
            "name": "宿松县",
            "latitude": 30.102,
            "longitude": 116.2463
          },
          {
            "name": "望江县",
            "latitude": 30.2387,
            "longitude": 116.682
          },
          {
            "name": "岳西县",
            "latitude": 30.8963,
            "longitude": 116.2133
          },
          {
            "name": "桐城市",
            "latitude": 30.9824,
            "longitude": 116.9395
          },
          {
            "name": "潜山市",
            "latitude": 30.7528,
            "longitude": 116.5458
          },
          {
            "name": "市区",
            "latitude": 30.5739,
            "longitude": 116.6731
          }
        ]
      },
      {
        "name": "黄山市",
        "districts": [
          {
            "name": "屯溪区",
            "latitude": 29.7393,
            "longitude": 118.2961
          },
          {
            "name": "黄山区",
            "latitude": 30.2525,
            "longitude": 118.0959
          },
          {
            "name": "徽州区",
            "latitude": 29.9242,
            "longitude": 118.2599
          },
          {
            "name": "歙县",
            "latitude": 29.8654,
            "longitude": 118.5692
          },
          {
            "name": "休宁县",
            "latitude": 29.661,
            "longitude": 118.0835
          },
          {
            "name": "黟县",
            "latitude": 30.0076,
            "longitude": 117.9041
          },
          {
            "name": "祁门县",
            "latitude": 29.8673,
            "longitude": 117.5936
          },
          {
            "name": "市区",
            "latitude": 29.9025,
            "longitude": 118.1146
          }
        ]
      },
      {
        "name": "滁州市",
        "districts": [
          {
            "name": "琅琊区",
            "latitude": 32.3439,
            "longitude": 118.3077
          },
          {
            "name": "南谯区",
            "latitude": 32.313,
            "longitude": 118.1803
          },
          {
            "name": "来安县",
            "latitude": 32.4673,
            "longitude": 118.5282
          },
          {
            "name": "全椒县",
            "latitude": 32.0646,
            "longitude": 118.0973
          },
          {
            "name": "定远县",
            "latitude": 32.4681,
            "longitude": 117.6582
          },
          {
            "name": "凤阳县",
            "latitude": 32.7875,
            "longitude": 117.6044
          },
          {
            "name": "天长市",
            "latitude": 32.7145,
            "longitude": 118.9677
          },
          {
            "name": "明光市",
            "latitude": 32.8057,
            "longitude": 118.1334
          },
          {
            "name": "市区",
            "latitude": 32.4956,
            "longitude": 118.1847
          }
        ]
      },
      {
        "name": "阜阳市",
        "districts": [
          {
            "name": "颍州区",
            "latitude": 32.8621,
            "longitude": 115.7197
          },
          {
            "name": "颍东区",
            "latitude": 32.9218,
            "longitude": 116.0213
          },
          {
            "name": "颍泉区",
            "latitude": 33.0345,
            "longitude": 115.7307
          },
          {
            "name": "临泉县",
            "latitude": 32.9049,
            "longitude": 115.242
          },
          {
            "name": "太和县",
            "latitude": 33.3315,
            "longitude": 115.6414
          },
          {
            "name": "阜南县",
            "latitude": 32.6406,
            "longitude": 115.6377
          },
          {
            "name": "颍上县",
            "latitude": 32.6569,
            "longitude": 116.2581
          },
          {
            "name": "界首市",
            "latitude": 33.2233,
            "longitude": 115.3919
          },
          {
            "name": "市区",
            "latitude": 32.947,
            "longitude": 115.7053
          }
        ]
      },
      {
        "name": "宿州市",
        "districts": [
          {
            "name": "埇桥区",
            "latitude": 33.7199,
            "longitude": 117.1518
          },
          {
            "name": "砀山县",
            "latitude": 34.4487,
            "longitude": 116.413
          },
          {
            "name": "萧县",
            "latitude": 34.2056,
            "longitude": 116.8052
          },
          {
            "name": "灵璧县",
            "latitude": 33.6869,
            "longitude": 117.5363
          },
          {
            "name": "泗县",
            "latitude": 33.5392,
            "longitude": 117.8839
          },
          {
            "name": "市区",
            "latitude": 33.9201,
            "longitude": 117.158
          }
        ]
      },
      {
        "name": "六安市",
        "districts": [
          {
            "name": "金安区",
            "latitude": 31.6578,
            "longitude": 116.6211
          },
          {
            "name": "裕安区",
            "latitude": 31.7518,
            "longitude": 116.3251
          },
          {
            "name": "叶集区",
            "latitude": 31.8676,
            "longitude": 116.0517
          },
          {
            "name": "霍邱县",
            "latitude": 32.2516,
            "longitude": 116.1863
          },
          {
            "name": "舒城县",
            "latitude": 31.3043,
            "longitude": 116.8217
          },
          {
            "name": "金寨县",
            "latitude": 31.4734,
            "longitude": 115.7724
          },
          {
            "name": "霍山县",
            "latitude": 31.2815,
            "longitude": 116.2392
          },
          {
            "name": "市区",
            "latitude": 31.6554,
            "longitude": 116.2882
          }
        ]
      },
      {
        "name": "亳州市",
        "districts": [
          {
            "name": "谯城区",
            "latitude": 33.7771,
            "longitude": 115.8062
          },
          {
            "name": "涡阳县",
            "latitude": 33.5517,
            "longitude": 116.2166
          },
          {
            "name": "蒙城县",
            "latitude": 33.2183,
            "longitude": 116.5841
          },
          {
            "name": "利辛县",
            "latitude": 33.1512,
            "longitude": 116.1588
          },
          {
            "name": "市区",
            "latitude": 33.4246,
            "longitude": 116.1914
          }
        ]
      },
      {
        "name": "池州市",
        "districts": [
          {
            "name": "贵池区",
            "latitude": 30.5101,
            "longitude": 117.509
          },
          {
            "name": "东至县",
            "latitude": 30.0289,
            "longitude": 116.9998
          },
          {
            "name": "石台县",
            "latitude": 30.1917,
            "longitude": 117.5287
          },
          {
            "name": "青阳县",
            "latitude": 30.5958,
            "longitude": 117.9001
          },
          {
            "name": "市区",
            "latitude": 30.3316,
            "longitude": 117.4844
          }
        ]
      },
      {
        "name": "宣城市",
        "districts": [
          {
            "name": "宣州区",
            "latitude": 30.9396,
            "longitude": 118.7926
          },
          {
            "name": "郎溪县",
            "latitude": 31.0933,
            "longitude": 119.1642
          },
          {
            "name": "泾县",
            "latitude": 30.5928,
            "longitude": 118.3692
          },
          {
            "name": "绩溪县",
            "latitude": 30.1543,
            "longitude": 118.6568
          },
          {
            "name": "旌德县",
            "latitude": 30.3145,
            "longitude": 118.4761
          },
          {
            "name": "宁国市",
            "latitude": 30.4964,
            "longitude": 118.9911
          },
          {
            "name": "广德市",
            "latitude": 30.8865,
            "longitude": 119.3576
          },
          {
            "name": "市区",
            "latitude": 30.6396,
            "longitude": 118.8297
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
            "name": "闽侯县",
            "latitude": 26.1749,
            "longitude": 119.1163
          },
          {
            "name": "连江县",
            "latitude": 26.3077,
            "longitude": 119.5765
          },
          {
            "name": "罗源县",
            "latitude": 26.4949,
            "longitude": 119.4845
          },
          {
            "name": "闽清县",
            "latitude": 26.205,
            "longitude": 118.7691
          },
          {
            "name": "永泰县",
            "latitude": 25.8522,
            "longitude": 118.7895
          },
          {
            "name": "平潭县",
            "latitude": 25.5302,
            "longitude": 119.7662
          },
          {
            "name": "福清市",
            "latitude": 25.6164,
            "longitude": 119.3833
          },
          {
            "name": "市区",
            "latitude": 26.0421,
            "longitude": 119.3221
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
            "latitude": 24.59,
            "longitude": 118.1117
          }
        ]
      },
      {
        "name": "莆田市",
        "districts": [
          {
            "name": "城厢区",
            "latitude": 25.4127,
            "longitude": 118.9334
          },
          {
            "name": "涵江区",
            "latitude": 25.6005,
            "longitude": 119.0615
          },
          {
            "name": "荔城区",
            "latitude": 25.3999,
            "longitude": 119.0867
          },
          {
            "name": "秀屿区",
            "latitude": 25.2292,
            "longitude": 119.1606
          },
          {
            "name": "仙游县",
            "latitude": 25.4645,
            "longitude": 118.699
          },
          {
            "name": "市区",
            "latitude": 25.4214,
            "longitude": 118.9882
          }
        ]
      },
      {
        "name": "三明市",
        "districts": [
          {
            "name": "梅列区",
            "latitude": 26.3377,
            "longitude": 117.3492
          },
          {
            "name": "三元区",
            "latitude": 26.2196,
            "longitude": 117.5616
          },
          {
            "name": "明溪县",
            "latitude": 26.4135,
            "longitude": 117.2103
          },
          {
            "name": "清流县",
            "latitude": 26.0923,
            "longitude": 116.9154
          },
          {
            "name": "宁化县",
            "latitude": 26.3035,
            "longitude": 116.6716
          },
          {
            "name": "大田县",
            "latitude": 25.7873,
            "longitude": 117.8085
          },
          {
            "name": "尤溪县",
            "latitude": 26.144,
            "longitude": 118.2421
          },
          {
            "name": "沙县",
            "latitude": 26.3377,
            "longitude": 117.3492
          },
          {
            "name": "将乐县",
            "latitude": 26.7258,
            "longitude": 117.3943
          },
          {
            "name": "泰宁县",
            "latitude": 26.8582,
            "longitude": 117.1183
          },
          {
            "name": "建宁县",
            "latitude": 26.8158,
            "longitude": 116.7849
          },
          {
            "name": "永安市",
            "latitude": 25.914,
            "longitude": 117.3215
          },
          {
            "name": "沙县区",
            "latitude": 26.4409,
            "longitude": 117.8122
          },
          {
            "name": "市区",
            "latitude": 26.3377,
            "longitude": 117.3492
          }
        ]
      },
      {
        "name": "泉州市",
        "districts": [
          {
            "name": "鲤城区",
            "latitude": 24.9047,
            "longitude": 118.5487
          },
          {
            "name": "丰泽区",
            "latitude": 24.9173,
            "longitude": 118.6269
          },
          {
            "name": "洛江区",
            "latitude": 25.1381,
            "longitude": 118.6304
          },
          {
            "name": "泉港区",
            "latitude": 25.1621,
            "longitude": 118.8585
          },
          {
            "name": "惠安县",
            "latitude": 24.9843,
            "longitude": 118.8148
          },
          {
            "name": "安溪县",
            "latitude": 25.1207,
            "longitude": 117.9021
          },
          {
            "name": "永春县",
            "latitude": 25.3898,
            "longitude": 118.1398
          },
          {
            "name": "德化县",
            "latitude": 25.67,
            "longitude": 118.2501
          },
          {
            "name": "金门县",
            "latitude": 24.45,
            "longitude": 118.3856
          },
          {
            "name": "石狮市",
            "latitude": 24.7405,
            "longitude": 118.6914
          },
          {
            "name": "晋江市",
            "latitude": 24.7141,
            "longitude": 118.5535
          },
          {
            "name": "南安市",
            "latitude": 25.0108,
            "longitude": 118.3821
          },
          {
            "name": "市区",
            "latitude": 25.0169,
            "longitude": 118.482
          }
        ]
      },
      {
        "name": "漳州市",
        "districts": [
          {
            "name": "芗城区",
            "latitude": 24.5971,
            "longitude": 117.6156
          },
          {
            "name": "龙文区",
            "latitude": 24.5372,
            "longitude": 117.7374
          },
          {
            "name": "云霄县",
            "latitude": 23.9703,
            "longitude": 117.3412
          },
          {
            "name": "漳浦县",
            "latitude": 24.093,
            "longitude": 117.6909
          },
          {
            "name": "诏安县",
            "latitude": 23.8464,
            "longitude": 117.1385
          },
          {
            "name": "长泰县",
            "latitude": 24.3399,
            "longitude": 117.5066
          },
          {
            "name": "东山县",
            "latitude": 23.6728,
            "longitude": 117.4128
          },
          {
            "name": "南靖县",
            "latitude": 24.6626,
            "longitude": 117.2838
          },
          {
            "name": "平和县",
            "latitude": 24.3173,
            "longitude": 117.1936
          },
          {
            "name": "华安县",
            "latitude": 24.9137,
            "longitude": 117.5347
          },
          {
            "name": "龙海市",
            "latitude": 24.3399,
            "longitude": 117.5066
          },
          {
            "name": "龙海区",
            "latitude": 24.3903,
            "longitude": 117.82
          },
          {
            "name": "长泰区",
            "latitude": 24.7379,
            "longitude": 117.8038
          },
          {
            "name": "市区",
            "latitude": 24.3399,
            "longitude": 117.5066
          }
        ]
      },
      {
        "name": "南平市",
        "districts": [
          {
            "name": "延平区",
            "latitude": 26.5848,
            "longitude": 118.2472
          },
          {
            "name": "建阳区",
            "latitude": 27.4041,
            "longitude": 118.06
          },
          {
            "name": "顺昌县",
            "latitude": 26.9032,
            "longitude": 117.8672
          },
          {
            "name": "浦城县",
            "latitude": 27.9386,
            "longitude": 118.5178
          },
          {
            "name": "光泽县",
            "latitude": 27.6507,
            "longitude": 117.3482
          },
          {
            "name": "松溪县",
            "latitude": 27.6057,
            "longitude": 118.7571
          },
          {
            "name": "政和县",
            "latitude": 27.3186,
            "longitude": 118.9672
          },
          {
            "name": "邵武市",
            "latitude": 27.2305,
            "longitude": 117.4738
          },
          {
            "name": "武夷山市",
            "latitude": 27.742,
            "longitude": 118.0052
          },
          {
            "name": "建瓯市",
            "latitude": 27.041,
            "longitude": 118.4748
          },
          {
            "name": "市区",
            "latitude": 27.3419,
            "longitude": 118.1718
          }
        ]
      },
      {
        "name": "龙岩市",
        "districts": [
          {
            "name": "新罗区",
            "latitude": 25.2168,
            "longitude": 117.0797
          },
          {
            "name": "永定区",
            "latitude": 24.7561,
            "longitude": 116.8186
          },
          {
            "name": "长汀县",
            "latitude": 25.69,
            "longitude": 116.3645
          },
          {
            "name": "上杭县",
            "latitude": 25.1199,
            "longitude": 116.5628
          },
          {
            "name": "武平县",
            "latitude": 25.132,
            "longitude": 116.1312
          },
          {
            "name": "连城县",
            "latitude": 25.5979,
            "longitude": 116.8147
          },
          {
            "name": "漳平市",
            "latitude": 25.3757,
            "longitude": 117.4431
          },
          {
            "name": "市区",
            "latitude": 25.2698,
            "longitude": 116.7449
          }
        ]
      },
      {
        "name": "宁德市",
        "districts": [
          {
            "name": "蕉城区",
            "latitude": 26.7569,
            "longitude": 119.4493
          },
          {
            "name": "霞浦县",
            "latitude": 26.8564,
            "longitude": 119.9825
          },
          {
            "name": "古田县",
            "latitude": 26.6114,
            "longitude": 118.8723
          },
          {
            "name": "屏南县",
            "latitude": 26.9163,
            "longitude": 118.9824
          },
          {
            "name": "寿宁县",
            "latitude": 27.4211,
            "longitude": 119.4995
          },
          {
            "name": "周宁县",
            "latitude": 27.0896,
            "longitude": 119.3067
          },
          {
            "name": "柘荣县",
            "latitude": 27.1997,
            "longitude": 119.8792
          },
          {
            "name": "福安市",
            "latitude": 27.037,
            "longitude": 119.6539
          },
          {
            "name": "福鼎市",
            "latitude": 27.2214,
            "longitude": 120.1961
          },
          {
            "name": "市区",
            "latitude": 27.0122,
            "longitude": 119.5358
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
            "name": "南昌县",
            "latitude": 28.6154,
            "longitude": 116.0639
          },
          {
            "name": "安义县",
            "latitude": 28.8294,
            "longitude": 115.5885
          },
          {
            "name": "进贤县",
            "latitude": 28.4364,
            "longitude": 116.3093
          },
          {
            "name": "市区",
            "latitude": 28.6699,
            "longitude": 115.9131
          }
        ]
      },
      {
        "name": "景德镇市",
        "districts": [
          {
            "name": "昌江区",
            "latitude": 29.2221,
            "longitude": 117.1119
          },
          {
            "name": "珠山区",
            "latitude": 29.284,
            "longitude": 117.2345
          },
          {
            "name": "浮梁县",
            "latitude": 29.5516,
            "longitude": 117.3011
          },
          {
            "name": "乐平市",
            "latitude": 28.9649,
            "longitude": 117.2668
          },
          {
            "name": "市区",
            "latitude": 29.2557,
            "longitude": 117.2286
          }
        ]
      },
      {
        "name": "萍乡市",
        "districts": [
          {
            "name": "安源区",
            "latitude": 27.6312,
            "longitude": 113.8839
          },
          {
            "name": "湘东区",
            "latitude": 27.5109,
            "longitude": 113.723
          },
          {
            "name": "莲花县",
            "latitude": 27.2167,
            "longitude": 113.9541
          },
          {
            "name": "上栗县",
            "latitude": 27.8196,
            "longitude": 113.8619
          },
          {
            "name": "芦溪县",
            "latitude": 27.569,
            "longitude": 114.0632
          },
          {
            "name": "市区",
            "latitude": 27.5495,
            "longitude": 113.8972
          }
        ]
      },
      {
        "name": "九江市",
        "districts": [
          {
            "name": "濂溪区",
            "latitude": 29.665,
            "longitude": 116.0495
          },
          {
            "name": "浔阳区",
            "latitude": 29.7262,
            "longitude": 116.0142
          },
          {
            "name": "柴桑区",
            "latitude": 29.6099,
            "longitude": 115.7926
          },
          {
            "name": "武宁县",
            "latitude": 29.2578,
            "longitude": 115.016
          },
          {
            "name": "修水县",
            "latitude": 28.9945,
            "longitude": 114.4387
          },
          {
            "name": "永修县",
            "latitude": 29.1319,
            "longitude": 115.7369
          },
          {
            "name": "德安县",
            "latitude": 29.4062,
            "longitude": 115.6149
          },
          {
            "name": "都昌县",
            "latitude": 29.3258,
            "longitude": 116.3333
          },
          {
            "name": "湖口县",
            "latitude": 29.662,
            "longitude": 116.286
          },
          {
            "name": "彭泽县",
            "latitude": 29.8293,
            "longitude": 116.6223
          },
          {
            "name": "瑞昌市",
            "latitude": 29.6242,
            "longitude": 115.4536
          },
          {
            "name": "共青城市",
            "latitude": 29.2508,
            "longitude": 115.8274
          },
          {
            "name": "庐山市",
            "latitude": 29.4168,
            "longitude": 115.9863
          },
          {
            "name": "市区",
            "latitude": 29.4539,
            "longitude": 115.7824
          }
        ]
      },
      {
        "name": "新余市",
        "districts": [
          {
            "name": "渝水区",
            "latitude": 27.8448,
            "longitude": 115
          },
          {
            "name": "分宜县",
            "latitude": 27.8389,
            "longitude": 114.6709
          },
          {
            "name": "市区",
            "latitude": 27.8419,
            "longitude": 114.8355
          }
        ]
      },
      {
        "name": "鹰潭市",
        "districts": [
          {
            "name": "月湖区",
            "latitude": 28.2409,
            "longitude": 117.0504
          },
          {
            "name": "余江区",
            "latitude": 28.3146,
            "longitude": 116.9136
          },
          {
            "name": "贵溪市",
            "latitude": 28.186,
            "longitude": 117.1907
          },
          {
            "name": "市区",
            "latitude": 28.2472,
            "longitude": 117.0516
          }
        ]
      },
      {
        "name": "赣州市",
        "districts": [
          {
            "name": "章贡区",
            "latitude": 25.8147,
            "longitude": 114.9199
          },
          {
            "name": "南康区",
            "latitude": 25.8327,
            "longitude": 114.6963
          },
          {
            "name": "赣县区",
            "latitude": 25.8959,
            "longitude": 115.0661
          },
          {
            "name": "信丰县",
            "latitude": 25.2807,
            "longitude": 114.9755
          },
          {
            "name": "大余县",
            "latitude": 25.4434,
            "longitude": 114.3625
          },
          {
            "name": "上犹县",
            "latitude": 25.9334,
            "longitude": 114.3962
          },
          {
            "name": "崇义县",
            "latitude": 25.6727,
            "longitude": 114.1924
          },
          {
            "name": "安远县",
            "latitude": 25.2324,
            "longitude": 115.3896
          },
          {
            "name": "定南县",
            "latitude": 24.8197,
            "longitude": 115.0884
          },
          {
            "name": "全南县",
            "latitude": 24.8429,
            "longitude": 114.5116
          },
          {
            "name": "宁都县",
            "latitude": 26.5845,
            "longitude": 116.006
          },
          {
            "name": "于都县",
            "latitude": 25.9315,
            "longitude": 115.5027
          },
          {
            "name": "兴国县",
            "latitude": 26.4193,
            "longitude": 115.4395
          },
          {
            "name": "会昌县",
            "latitude": 25.5007,
            "longitude": 115.7583
          },
          {
            "name": "寻乌县",
            "latitude": 24.8992,
            "longitude": 115.66
          },
          {
            "name": "石城县",
            "latitude": 26.3006,
            "longitude": 116.3657
          },
          {
            "name": "瑞金市",
            "latitude": 25.9163,
            "longitude": 115.9793
          },
          {
            "name": "龙南市",
            "latitude": 24.7679,
            "longitude": 114.727
          },
          {
            "name": "市区",
            "latitude": 25.616,
            "longitude": 115.1687
          }
        ]
      },
      {
        "name": "吉安市",
        "districts": [
          {
            "name": "吉州区",
            "latitude": 27.1507,
            "longitude": 114.9406
          },
          {
            "name": "青原区",
            "latitude": 26.8949,
            "longitude": 115.224
          },
          {
            "name": "吉安县",
            "latitude": 27.1374,
            "longitude": 114.7438
          },
          {
            "name": "吉水县",
            "latitude": 27.1949,
            "longitude": 115.2467
          },
          {
            "name": "峡江县",
            "latitude": 27.5837,
            "longitude": 115.2081
          },
          {
            "name": "新干县",
            "latitude": 27.7327,
            "longitude": 115.5017
          },
          {
            "name": "永丰县",
            "latitude": 27.0917,
            "longitude": 115.5867
          },
          {
            "name": "泰和县",
            "latitude": 26.7375,
            "longitude": 114.9342
          },
          {
            "name": "遂川县",
            "latitude": 26.3382,
            "longitude": 114.3644
          },
          {
            "name": "万安县",
            "latitude": 26.4393,
            "longitude": 114.818
          },
          {
            "name": "安福县",
            "latitude": 27.3554,
            "longitude": 114.449
          },
          {
            "name": "永新县",
            "latitude": 26.9689,
            "longitude": 114.184
          },
          {
            "name": "井冈山市",
            "latitude": 26.6428,
            "longitude": 114.1475
          },
          {
            "name": "市区",
            "latitude": 27.0206,
            "longitude": 114.873
          }
        ]
      },
      {
        "name": "宜春市",
        "districts": [
          {
            "name": "袁州区",
            "latitude": 27.8339,
            "longitude": 114.2836
          },
          {
            "name": "奉新县",
            "latitude": 28.709,
            "longitude": 115.1725
          },
          {
            "name": "万载县",
            "latitude": 28.2036,
            "longitude": 114.3298
          },
          {
            "name": "上高县",
            "latitude": 28.193,
            "longitude": 114.8546
          },
          {
            "name": "宜丰县",
            "latitude": 28.4489,
            "longitude": 114.7679
          },
          {
            "name": "靖安县",
            "latitude": 28.9402,
            "longitude": 115.2311
          },
          {
            "name": "铜鼓县",
            "latitude": 28.6095,
            "longitude": 114.3637
          },
          {
            "name": "丰城市",
            "latitude": 28.1069,
            "longitude": 115.8172
          },
          {
            "name": "樟树市",
            "latitude": 27.9964,
            "longitude": 115.4163
          },
          {
            "name": "高安市",
            "latitude": 28.3592,
            "longitude": 115.298
          },
          {
            "name": "市区",
            "latitude": 28.3401,
            "longitude": 114.9535
          }
        ]
      },
      {
        "name": "抚州市",
        "districts": [
          {
            "name": "临川区",
            "latitude": 27.9183,
            "longitude": 116.354
          },
          {
            "name": "东乡区",
            "latitude": 28.2137,
            "longitude": 116.61
          },
          {
            "name": "南城县",
            "latitude": 27.5143,
            "longitude": 116.6746
          },
          {
            "name": "黎川县",
            "latitude": 27.2551,
            "longitude": 116.9251
          },
          {
            "name": "南丰县",
            "latitude": 27.1103,
            "longitude": 116.4932
          },
          {
            "name": "崇仁县",
            "latitude": 27.708,
            "longitude": 116.0592
          },
          {
            "name": "乐安县",
            "latitude": 27.367,
            "longitude": 115.8373
          },
          {
            "name": "宜黄县",
            "latitude": 27.3884,
            "longitude": 116.2446
          },
          {
            "name": "金溪县",
            "latitude": 27.9277,
            "longitude": 116.7512
          },
          {
            "name": "资溪县",
            "latitude": 27.7385,
            "longitude": 117.028
          },
          {
            "name": "广昌县",
            "latitude": 26.7561,
            "longitude": 116.3556
          },
          {
            "name": "市区",
            "latitude": 27.5361,
            "longitude": 116.4848
          }
        ]
      },
      {
        "name": "上饶市",
        "districts": [
          {
            "name": "信州区",
            "latitude": 28.4901,
            "longitude": 118.0523
          },
          {
            "name": "广丰区",
            "latitude": 28.3592,
            "longitude": 118.2713
          },
          {
            "name": "广信区",
            "latitude": 28.4539,
            "longitude": 117.9061
          },
          {
            "name": "玉山县",
            "latitude": 28.7539,
            "longitude": 118.1625
          },
          {
            "name": "铅山县",
            "latitude": 28.1044,
            "longitude": 117.7063
          },
          {
            "name": "横峰县",
            "latitude": 28.508,
            "longitude": 117.6371
          },
          {
            "name": "弋阳县",
            "latitude": 28.4465,
            "longitude": 117.4094
          },
          {
            "name": "余干县",
            "latitude": 28.677,
            "longitude": 116.6129
          },
          {
            "name": "鄱阳县",
            "latitude": 29.2389,
            "longitude": 116.7847
          },
          {
            "name": "万年县",
            "latitude": 28.6986,
            "longitude": 117.0076
          },
          {
            "name": "婺源县",
            "latitude": 29.3217,
            "longitude": 117.78
          },
          {
            "name": "德兴市",
            "latitude": 28.9345,
            "longitude": 117.747
          },
          {
            "name": "市区",
            "latitude": 28.6656,
            "longitude": 117.5898
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
            "name": "济阳区",
            "latitude": 37.0261,
            "longitude": 117.1455
          },
          {
            "name": "莱芜区",
            "latitude": 36.3143,
            "longitude": 117.6177
          },
          {
            "name": "钢城区",
            "latitude": 36.1309,
            "longitude": 117.8358
          },
          {
            "name": "平阴县",
            "latitude": 36.1957,
            "longitude": 116.4155
          },
          {
            "name": "商河县",
            "latitude": 37.3194,
            "longitude": 117.203
          },
          {
            "name": "市区",
            "latitude": 36.6197,
            "longitude": 117.1337
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
            "name": "胶州市",
            "latitude": 36.2404,
            "longitude": 119.9533
          },
          {
            "name": "平度市",
            "latitude": 36.7822,
            "longitude": 119.9445
          },
          {
            "name": "莱西市",
            "latitude": 36.8585,
            "longitude": 120.4358
          },
          {
            "name": "市区",
            "latitude": 36.305,
            "longitude": 120.2805
          }
        ]
      },
      {
        "name": "淄博市",
        "districts": [
          {
            "name": "淄川区",
            "latitude": 36.5761,
            "longitude": 118.0217
          },
          {
            "name": "张店区",
            "latitude": 36.8137,
            "longitude": 118.0691
          },
          {
            "name": "博山区",
            "latitude": 36.4198,
            "longitude": 117.9582
          },
          {
            "name": "临淄区",
            "latitude": 36.8475,
            "longitude": 118.292
          },
          {
            "name": "周村区",
            "latitude": 36.7513,
            "longitude": 117.8636
          },
          {
            "name": "桓台县",
            "latitude": 36.9925,
            "longitude": 118.0268
          },
          {
            "name": "高青县",
            "latitude": 37.165,
            "longitude": 117.8191
          },
          {
            "name": "沂源县",
            "latitude": 36.1293,
            "longitude": 118.1975
          },
          {
            "name": "市区",
            "latitude": 36.7119,
            "longitude": 118.031
          }
        ]
      },
      {
        "name": "枣庄市",
        "districts": [
          {
            "name": "市中区",
            "latitude": 34.8645,
            "longitude": 117.5991
          },
          {
            "name": "薛城区",
            "latitude": 34.7901,
            "longitude": 117.3527
          },
          {
            "name": "峄城区",
            "latitude": 34.7099,
            "longitude": 117.5973
          },
          {
            "name": "台儿庄区",
            "latitude": 34.5818,
            "longitude": 117.6329
          },
          {
            "name": "山亭区",
            "latitude": 35.0874,
            "longitude": 117.4782
          },
          {
            "name": "滕州市",
            "latitude": 35.0602,
            "longitude": 117.1412
          },
          {
            "name": "市区",
            "latitude": 34.849,
            "longitude": 117.4669
          }
        ]
      },
      {
        "name": "东营市",
        "districts": [
          {
            "name": "东营区",
            "latitude": 37.4023,
            "longitude": 118.6137
          },
          {
            "name": "河口区",
            "latitude": 37.886,
            "longitude": 118.5296
          },
          {
            "name": "垦利区",
            "latitude": 37.6771,
            "longitude": 118.8506
          },
          {
            "name": "利津县",
            "latitude": 37.6467,
            "longitude": 118.3906
          },
          {
            "name": "广饶县",
            "latitude": 37.1607,
            "longitude": 118.5468
          },
          {
            "name": "市区",
            "latitude": 37.5546,
            "longitude": 118.5863
          }
        ]
      },
      {
        "name": "烟台市",
        "districts": [
          {
            "name": "芝罘区",
            "latitude": 37.5239,
            "longitude": 121.358
          },
          {
            "name": "福山区",
            "latitude": 37.4842,
            "longitude": 121.1397
          },
          {
            "name": "牟平区",
            "latitude": 37.2738,
            "longitude": 121.5747
          },
          {
            "name": "莱山区",
            "latitude": 37.3847,
            "longitude": 121.431
          },
          {
            "name": "蓬莱区",
            "latitude": 37.658,
            "longitude": 120.8391
          },
          {
            "name": "龙口市",
            "latitude": 37.6082,
            "longitude": 120.4932
          },
          {
            "name": "莱阳市",
            "latitude": 36.8965,
            "longitude": 120.745
          },
          {
            "name": "莱州市",
            "latitude": 37.189,
            "longitude": 119.9823
          },
          {
            "name": "招远市",
            "latitude": 37.3389,
            "longitude": 120.3915
          },
          {
            "name": "栖霞市",
            "latitude": 37.2845,
            "longitude": 120.8847
          },
          {
            "name": "海阳市",
            "latitude": 36.8431,
            "longitude": 121.1086
          },
          {
            "name": "市区",
            "latitude": 37.3168,
            "longitude": 120.9043
          }
        ]
      },
      {
        "name": "潍坊市",
        "districts": [
          {
            "name": "潍城区",
            "latitude": 36.6968,
            "longitude": 119.0274
          },
          {
            "name": "寒亭区",
            "latitude": 36.9969,
            "longitude": 119.1415
          },
          {
            "name": "坊子区",
            "latitude": 36.5295,
            "longitude": 119.3612
          },
          {
            "name": "奎文区",
            "latitude": 36.686,
            "longitude": 119.1907
          },
          {
            "name": "临朐县",
            "latitude": 36.36,
            "longitude": 118.5512
          },
          {
            "name": "昌乐县",
            "latitude": 36.5301,
            "longitude": 118.908
          },
          {
            "name": "青州市",
            "latitude": 36.6751,
            "longitude": 118.4627
          },
          {
            "name": "诸城市",
            "latitude": 36.007,
            "longitude": 119.4098
          },
          {
            "name": "寿光市",
            "latitude": 37.0133,
            "longitude": 118.8223
          },
          {
            "name": "安丘市",
            "latitude": 36.2991,
            "longitude": 119.1109
          },
          {
            "name": "高密市",
            "latitude": 36.3812,
            "longitude": 119.7071
          },
          {
            "name": "昌邑市",
            "latitude": 36.8775,
            "longitude": 119.4408
          },
          {
            "name": "市区",
            "latitude": 36.5877,
            "longitude": 119.0945
          }
        ]
      },
      {
        "name": "济宁市",
        "districts": [
          {
            "name": "任城区",
            "latitude": 35.3762,
            "longitude": 116.568
          },
          {
            "name": "兖州区",
            "latitude": 35.5683,
            "longitude": 116.7471
          },
          {
            "name": "微山县",
            "latitude": 34.8846,
            "longitude": 116.9799
          },
          {
            "name": "鱼台县",
            "latitude": 35.015,
            "longitude": 116.568
          },
          {
            "name": "金乡县",
            "latitude": 35.0479,
            "longitude": 116.3096
          },
          {
            "name": "嘉祥县",
            "latitude": 35.4271,
            "longitude": 116.3007
          },
          {
            "name": "汶上县",
            "latitude": 35.7107,
            "longitude": 116.4997
          },
          {
            "name": "泗水县",
            "latitude": 35.6348,
            "longitude": 117.3408
          },
          {
            "name": "梁山县",
            "latitude": 35.7952,
            "longitude": 116.1183
          },
          {
            "name": "曲阜市",
            "latitude": 35.6107,
            "longitude": 117.0262
          },
          {
            "name": "邹城市",
            "latitude": 35.3482,
            "longitude": 117.0827
          },
          {
            "name": "市区",
            "latitude": 35.4017,
            "longitude": 116.6855
          }
        ]
      },
      {
        "name": "泰安市",
        "districts": [
          {
            "name": "泰山区",
            "latitude": 36.2095,
            "longitude": 117.1767
          },
          {
            "name": "岱岳区",
            "latitude": 36.1841,
            "longitude": 117.0435
          },
          {
            "name": "宁阳县",
            "latitude": 35.828,
            "longitude": 116.9268
          },
          {
            "name": "东平县",
            "latitude": 35.9695,
            "longitude": 116.3343
          },
          {
            "name": "新泰市",
            "latitude": 35.8902,
            "longitude": 117.6062
          },
          {
            "name": "肥城市",
            "latitude": 36.1063,
            "longitude": 116.7375
          },
          {
            "name": "市区",
            "latitude": 36.0313,
            "longitude": 116.9708
          }
        ]
      },
      {
        "name": "威海市",
        "districts": [
          {
            "name": "环翠区",
            "latitude": 37.3773,
            "longitude": 122.1141
          },
          {
            "name": "文登区",
            "latitude": 37.1186,
            "longitude": 122.0044
          },
          {
            "name": "荣成市",
            "latitude": 37.1162,
            "longitude": 122.4046
          },
          {
            "name": "乳山市",
            "latitude": 36.9636,
            "longitude": 121.5265
          },
          {
            "name": "市区",
            "latitude": 37.1439,
            "longitude": 122.0124
          }
        ]
      },
      {
        "name": "日照市",
        "districts": [
          {
            "name": "东港区",
            "latitude": 35.4513,
            "longitude": 119.3748
          },
          {
            "name": "岚山区",
            "latitude": 35.284,
            "longitude": 119.1984
          },
          {
            "name": "五莲县",
            "latitude": 35.7375,
            "longitude": 119.2435
          },
          {
            "name": "莒县",
            "latitude": 35.6673,
            "longitude": 118.8803
          },
          {
            "name": "市区",
            "latitude": 35.535,
            "longitude": 119.1743
          }
        ]
      },
      {
        "name": "临沂市",
        "districts": [
          {
            "name": "兰山区",
            "latitude": 35.2,
            "longitude": 118.2846
          },
          {
            "name": "罗庄区",
            "latitude": 34.9288,
            "longitude": 118.2676
          },
          {
            "name": "河东区",
            "latitude": 35.1283,
            "longitude": 118.5128
          },
          {
            "name": "沂南县",
            "latitude": 35.538,
            "longitude": 118.4071
          },
          {
            "name": "郯城县",
            "latitude": 34.6258,
            "longitude": 118.3228
          },
          {
            "name": "沂水县",
            "latitude": 35.9092,
            "longitude": 118.6025
          },
          {
            "name": "兰陵县",
            "latitude": 34.8558,
            "longitude": 117.9844
          },
          {
            "name": "费县",
            "latitude": 35.245,
            "longitude": 117.9439
          },
          {
            "name": "平邑县",
            "latitude": 35.4291,
            "longitude": 117.6758
          },
          {
            "name": "莒南县",
            "latitude": 35.2081,
            "longitude": 118.8839
          },
          {
            "name": "蒙阴县",
            "latitude": 35.7415,
            "longitude": 118.03
          },
          {
            "name": "临沭县",
            "latitude": 34.8803,
            "longitude": 118.6586
          },
          {
            "name": "市区",
            "latitude": 35.2242,
            "longitude": 118.2978
          }
        ]
      },
      {
        "name": "德州市",
        "districts": [
          {
            "name": "德城区",
            "latitude": 37.4346,
            "longitude": 116.382
          },
          {
            "name": "陵城区",
            "latitude": 37.4047,
            "longitude": 116.691
          },
          {
            "name": "宁津县",
            "latitude": 37.6811,
            "longitude": 116.8069
          },
          {
            "name": "庆云县",
            "latitude": 37.7954,
            "longitude": 117.456
          },
          {
            "name": "临邑县",
            "latitude": 37.2283,
            "longitude": 116.8944
          },
          {
            "name": "齐河县",
            "latitude": 36.7184,
            "longitude": 116.674
          },
          {
            "name": "平原县",
            "latitude": 37.1418,
            "longitude": 116.4292
          },
          {
            "name": "夏津县",
            "latitude": 37.0103,
            "longitude": 116.0309
          },
          {
            "name": "武城县",
            "latitude": 37.2376,
            "longitude": 116.0841
          },
          {
            "name": "乐陵市",
            "latitude": 37.668,
            "longitude": 117.1398
          },
          {
            "name": "禹城市",
            "latitude": 36.9126,
            "longitude": 116.5745
          },
          {
            "name": "市区",
            "latitude": 37.2939,
            "longitude": 116.6512
          }
        ]
      },
      {
        "name": "聊城市",
        "districts": [
          {
            "name": "东昌府区",
            "latitude": 36.444,
            "longitude": 115.9361
          },
          {
            "name": "茌平区",
            "latitude": 36.5973,
            "longitude": 116.1744
          },
          {
            "name": "阳谷县",
            "latitude": 36.1443,
            "longitude": 115.8696
          },
          {
            "name": "莘县",
            "latitude": 36.1335,
            "longitude": 115.5469
          },
          {
            "name": "东阿县",
            "latitude": 36.3231,
            "longitude": 116.2896
          },
          {
            "name": "冠县",
            "latitude": 36.5302,
            "longitude": 115.5349
          },
          {
            "name": "高唐县",
            "latitude": 36.8329,
            "longitude": 116.2509
          },
          {
            "name": "临清市",
            "latitude": 36.7761,
            "longitude": 115.7749
          },
          {
            "name": "市区",
            "latitude": 36.4727,
            "longitude": 115.9222
          }
        ]
      },
      {
        "name": "滨州市",
        "districts": [
          {
            "name": "滨城区",
            "latitude": 37.4183,
            "longitude": 117.9761
          },
          {
            "name": "沾化区",
            "latitude": 37.8192,
            "longitude": 118.087
          },
          {
            "name": "惠民县",
            "latitude": 37.3708,
            "longitude": 117.5738
          },
          {
            "name": "阳信县",
            "latitude": 37.6004,
            "longitude": 117.5673
          },
          {
            "name": "无棣县",
            "latitude": 37.97,
            "longitude": 117.8105
          },
          {
            "name": "博兴县",
            "latitude": 37.1832,
            "longitude": 118.2204
          },
          {
            "name": "邹平市",
            "latitude": 36.9505,
            "longitude": 117.6644
          },
          {
            "name": "市区",
            "latitude": 37.4732,
            "longitude": 117.8428
          }
        ]
      },
      {
        "name": "菏泽市",
        "districts": [
          {
            "name": "牡丹区",
            "latitude": 35.278,
            "longitude": 115.4639
          },
          {
            "name": "定陶区",
            "latitude": 35.0978,
            "longitude": 115.6228
          },
          {
            "name": "曹县",
            "latitude": 34.8212,
            "longitude": 115.5471
          },
          {
            "name": "单县",
            "latitude": 34.7343,
            "longitude": 116.1164
          },
          {
            "name": "成武县",
            "latitude": 34.9842,
            "longitude": 115.9386
          },
          {
            "name": "巨野县",
            "latitude": 35.2729,
            "longitude": 116.0326
          },
          {
            "name": "郓城县",
            "latitude": 35.6052,
            "longitude": 115.8891
          },
          {
            "name": "鄄城县",
            "latitude": 35.549,
            "longitude": 115.546
          },
          {
            "name": "东明县",
            "latitude": 35.1765,
            "longitude": 115.0713
          },
          {
            "name": "市区",
            "latitude": 35.1688,
            "longitude": 115.692
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
            "name": "荥阳市",
            "latitude": 34.7998,
            "longitude": 113.3517
          },
          {
            "name": "新密市",
            "latitude": 34.5081,
            "longitude": 113.4333
          },
          {
            "name": "新郑市",
            "latitude": 34.4533,
            "longitude": 113.7295
          },
          {
            "name": "登封市",
            "latitude": 34.4123,
            "longitude": 113.035
          },
          {
            "name": "市区",
            "latitude": 34.6859,
            "longitude": 113.5111
          }
        ]
      },
      {
        "name": "开封市",
        "districts": [
          {
            "name": "龙亭区",
            "latitude": 34.8238,
            "longitude": 114.2792
          },
          {
            "name": "顺河回族区",
            "latitude": 34.8069,
            "longitude": 114.4287
          },
          {
            "name": "鼓楼区",
            "latitude": 34.733,
            "longitude": 114.3
          },
          {
            "name": "禹王台区",
            "latitude": 34.7406,
            "longitude": 114.385
          },
          {
            "name": "祥符区",
            "latitude": 34.7076,
            "longitude": 114.4753
          },
          {
            "name": "杞县",
            "latitude": 34.4996,
            "longitude": 114.7617
          },
          {
            "name": "通许县",
            "latitude": 34.4348,
            "longitude": 114.4958
          },
          {
            "name": "尉氏县",
            "latitude": 34.3823,
            "longitude": 114.1548
          },
          {
            "name": "兰考县",
            "latitude": 34.8756,
            "longitude": 114.9706
          },
          {
            "name": "市区",
            "latitude": 34.6671,
            "longitude": 114.4723
          }
        ]
      },
      {
        "name": "洛阳市",
        "districts": [
          {
            "name": "老城区",
            "latitude": 34.7146,
            "longitude": 112.4438
          },
          {
            "name": "西工区",
            "latitude": 34.6952,
            "longitude": 112.3824
          },
          {
            "name": "瀍河回族区",
            "latitude": 34.7067,
            "longitude": 112.5091
          },
          {
            "name": "涧西区",
            "latitude": 34.6266,
            "longitude": 112.3416
          },
          {
            "name": "吉利区",
            "latitude": 34.4883,
            "longitude": 112.2625
          },
          {
            "name": "洛龙区",
            "latitude": 34.6015,
            "longitude": 112.544
          },
          {
            "name": "孟津县",
            "latitude": 34.4883,
            "longitude": 112.2625
          },
          {
            "name": "新安县",
            "latitude": 34.8316,
            "longitude": 112.1217
          },
          {
            "name": "栾川县",
            "latitude": 33.9081,
            "longitude": 111.6105
          },
          {
            "name": "嵩县",
            "latitude": 34.0063,
            "longitude": 112.0427
          },
          {
            "name": "汝阳县",
            "latitude": 34.0567,
            "longitude": 112.4286
          },
          {
            "name": "宜阳县",
            "latitude": 34.478,
            "longitude": 112.023
          },
          {
            "name": "洛宁县",
            "latitude": 34.3407,
            "longitude": 111.5
          },
          {
            "name": "伊川县",
            "latitude": 34.3996,
            "longitude": 112.4621
          },
          {
            "name": "偃师市",
            "latitude": 34.4883,
            "longitude": 112.2625
          },
          {
            "name": "偃师区",
            "latitude": 34.6384,
            "longitude": 112.7801
          },
          {
            "name": "孟津区",
            "latitude": 34.8326,
            "longitude": 112.485
          },
          {
            "name": "市区",
            "latitude": 34.4883,
            "longitude": 112.2625
          }
        ]
      },
      {
        "name": "平顶山市",
        "districts": [
          {
            "name": "新华区",
            "latitude": 33.7655,
            "longitude": 113.1821
          },
          {
            "name": "卫东区",
            "latitude": 33.7617,
            "longitude": 113.3688
          },
          {
            "name": "石龙区",
            "latitude": 33.887,
            "longitude": 112.889
          },
          {
            "name": "湛河区",
            "latitude": 33.6966,
            "longitude": 113.2586
          },
          {
            "name": "宝丰县",
            "latitude": 33.9107,
            "longitude": 113.0274
          },
          {
            "name": "叶县",
            "latitude": 33.5447,
            "longitude": 113.3441
          },
          {
            "name": "鲁山县",
            "latitude": 33.7425,
            "longitude": 112.7337
          },
          {
            "name": "郏县",
            "latitude": 33.9994,
            "longitude": 113.2267
          },
          {
            "name": "舞钢市",
            "latitude": 33.2838,
            "longitude": 113.5195
          },
          {
            "name": "汝州市",
            "latitude": 34.1568,
            "longitude": 112.8043
          },
          {
            "name": "市区",
            "latitude": 33.7749,
            "longitude": 113.1354
          }
        ]
      },
      {
        "name": "安阳市",
        "districts": [
          {
            "name": "文峰区",
            "latitude": 36.0343,
            "longitude": 114.4183
          },
          {
            "name": "北关区",
            "latitude": 36.162,
            "longitude": 114.3796
          },
          {
            "name": "殷都区",
            "latitude": 36.1336,
            "longitude": 114.2892
          },
          {
            "name": "龙安区",
            "latitude": 36.0419,
            "longitude": 114.2512
          },
          {
            "name": "安阳县",
            "latitude": 36.1686,
            "longitude": 114.1177
          },
          {
            "name": "汤阴县",
            "latitude": 35.9023,
            "longitude": 114.4557
          },
          {
            "name": "滑县",
            "latitude": 35.4659,
            "longitude": 114.6673
          },
          {
            "name": "内黄县",
            "latitude": 35.9006,
            "longitude": 114.8165
          },
          {
            "name": "林州市",
            "latitude": 36.0099,
            "longitude": 113.8545
          },
          {
            "name": "市区",
            "latitude": 35.9799,
            "longitude": 114.3611
          }
        ]
      },
      {
        "name": "鹤壁市",
        "districts": [
          {
            "name": "鹤山区",
            "latitude": 35.9665,
            "longitude": 114.1271
          },
          {
            "name": "山城区",
            "latitude": 35.9148,
            "longitude": 114.2235
          },
          {
            "name": "淇滨区",
            "latitude": 35.7871,
            "longitude": 114.2265
          },
          {
            "name": "浚县",
            "latitude": 35.6715,
            "longitude": 114.4824
          },
          {
            "name": "淇县",
            "latitude": 35.6613,
            "longitude": 114.1618
          },
          {
            "name": "市区",
            "latitude": 35.8002,
            "longitude": 114.2443
          }
        ]
      },
      {
        "name": "新乡市",
        "districts": [
          {
            "name": "红旗区",
            "latitude": 35.2755,
            "longitude": 113.9651
          },
          {
            "name": "卫滨区",
            "latitude": 35.2767,
            "longitude": 113.845
          },
          {
            "name": "凤泉区",
            "latitude": 35.3856,
            "longitude": 113.8602
          },
          {
            "name": "牧野区",
            "latitude": 35.3379,
            "longitude": 113.9087
          },
          {
            "name": "新乡县",
            "latitude": 35.2024,
            "longitude": 113.8343
          },
          {
            "name": "获嘉县",
            "latitude": 35.1968,
            "longitude": 113.645
          },
          {
            "name": "原阳县",
            "latitude": 35.0219,
            "longitude": 113.9507
          },
          {
            "name": "延津县",
            "latitude": 35.2724,
            "longitude": 114.237
          },
          {
            "name": "封丘县",
            "latitude": 35.0332,
            "longitude": 114.4842
          },
          {
            "name": "卫辉市",
            "latitude": 35.4954,
            "longitude": 114.0745
          },
          {
            "name": "辉县市",
            "latitude": 35.5373,
            "longitude": 113.6819
          },
          {
            "name": "长垣市",
            "latitude": 35.2128,
            "longitude": 114.7629
          },
          {
            "name": "市区",
            "latitude": 35.2707,
            "longitude": 114.0208
          }
        ]
      },
      {
        "name": "焦作市",
        "districts": [
          {
            "name": "解放区",
            "latitude": 35.2356,
            "longitude": 113.2131
          },
          {
            "name": "中站区",
            "latitude": 35.2686,
            "longitude": 113.1563
          },
          {
            "name": "马村区",
            "latitude": 35.2934,
            "longitude": 113.3676
          },
          {
            "name": "山阳区",
            "latitude": 35.1912,
            "longitude": 113.2346
          },
          {
            "name": "修武县",
            "latitude": 35.2299,
            "longitude": 113.4475
          },
          {
            "name": "博爱县",
            "latitude": 35.1857,
            "longitude": 113.0578
          },
          {
            "name": "武陟县",
            "latitude": 35.0478,
            "longitude": 113.3985
          },
          {
            "name": "温县",
            "latitude": 34.9426,
            "longitude": 113.0493
          },
          {
            "name": "沁阳市",
            "latitude": 35.1281,
            "longitude": 112.8818
          },
          {
            "name": "孟州市",
            "latitude": 34.9217,
            "longitude": 112.764
          },
          {
            "name": "市区",
            "latitude": 35.1445,
            "longitude": 113.157
          }
        ]
      },
      {
        "name": "濮阳市",
        "districts": [
          {
            "name": "华龙区",
            "latitude": 35.7765,
            "longitude": 115.0335
          },
          {
            "name": "清丰县",
            "latitude": 35.9218,
            "longitude": 115.1644
          },
          {
            "name": "南乐县",
            "latitude": 36.0917,
            "longitude": 115.2412
          },
          {
            "name": "范县",
            "latitude": 35.7963,
            "longitude": 115.5355
          },
          {
            "name": "台前县",
            "latitude": 35.9585,
            "longitude": 115.8676
          },
          {
            "name": "濮阳县",
            "latitude": 35.5863,
            "longitude": 115.1502
          },
          {
            "name": "市区",
            "latitude": 35.8552,
            "longitude": 115.3321
          }
        ]
      },
      {
        "name": "许昌市",
        "districts": [
          {
            "name": "魏都区",
            "latitude": 34.0366,
            "longitude": 113.8173
          },
          {
            "name": "建安区",
            "latitude": 34.015,
            "longitude": 113.7329
          },
          {
            "name": "鄢陵县",
            "latitude": 34.0071,
            "longitude": 114.1969
          },
          {
            "name": "襄城县",
            "latitude": 33.8556,
            "longitude": 113.5613
          },
          {
            "name": "禹州市",
            "latitude": 34.1947,
            "longitude": 113.3858
          },
          {
            "name": "长葛市",
            "latitude": 34.2306,
            "longitude": 113.8477
          },
          {
            "name": "市区",
            "latitude": 34.0566,
            "longitude": 113.757
          }
        ]
      },
      {
        "name": "漯河市",
        "districts": [
          {
            "name": "源汇区",
            "latitude": 33.5307,
            "longitude": 113.9209
          },
          {
            "name": "郾城区",
            "latitude": 33.6652,
            "longitude": 113.9378
          },
          {
            "name": "召陵区",
            "latitude": 33.5656,
            "longitude": 114.182
          },
          {
            "name": "舞阳县",
            "latitude": 33.5431,
            "longitude": 113.6735
          },
          {
            "name": "临颍县",
            "latitude": 33.8381,
            "longitude": 113.9558
          },
          {
            "name": "市区",
            "latitude": 33.6285,
            "longitude": 113.934
          }
        ]
      },
      {
        "name": "三门峡市",
        "districts": [
          {
            "name": "湖滨区",
            "latitude": 34.766,
            "longitude": 111.2751
          },
          {
            "name": "陕州区",
            "latitude": 34.6379,
            "longitude": 111.3696
          },
          {
            "name": "渑池县",
            "latitude": 34.8337,
            "longitude": 111.7961
          },
          {
            "name": "卢氏县",
            "latitude": 33.9675,
            "longitude": 110.9884
          },
          {
            "name": "义马市",
            "latitude": 34.7436,
            "longitude": 111.8998
          },
          {
            "name": "灵宝市",
            "latitude": 34.4314,
            "longitude": 110.7732
          },
          {
            "name": "市区",
            "latitude": 34.5633,
            "longitude": 111.3504
          }
        ]
      },
      {
        "name": "南阳市",
        "districts": [
          {
            "name": "宛城区",
            "latitude": 32.9053,
            "longitude": 112.6319
          },
          {
            "name": "卧龙区",
            "latitude": 33.0305,
            "longitude": 112.4673
          },
          {
            "name": "南召县",
            "latitude": 33.4688,
            "longitude": 112.389
          },
          {
            "name": "方城县",
            "latitude": 33.2946,
            "longitude": 113.0116
          },
          {
            "name": "西峡县",
            "latitude": 33.4826,
            "longitude": 111.4326
          },
          {
            "name": "镇平县",
            "latitude": 33.0656,
            "longitude": 112.1862
          },
          {
            "name": "内乡县",
            "latitude": 33.2213,
            "longitude": 111.8418
          },
          {
            "name": "淅川县",
            "latitude": 32.9856,
            "longitude": 111.4382
          },
          {
            "name": "社旗县",
            "latitude": 32.9764,
            "longitude": 112.9913
          },
          {
            "name": "唐河县",
            "latitude": 32.6151,
            "longitude": 112.852
          },
          {
            "name": "新野县",
            "latitude": 32.5473,
            "longitude": 112.4087
          },
          {
            "name": "桐柏县",
            "latitude": 32.4899,
            "longitude": 113.4279
          },
          {
            "name": "邓州市",
            "latitude": 32.6802,
            "longitude": 112.05
          },
          {
            "name": "市区",
            "latitude": 32.9818,
            "longitude": 112.3945
          }
        ]
      },
      {
        "name": "商丘市",
        "districts": [
          {
            "name": "梁园区",
            "latitude": 34.4771,
            "longitude": 115.598
          },
          {
            "name": "睢阳区",
            "latitude": 34.247,
            "longitude": 115.5706
          },
          {
            "name": "民权县",
            "latitude": 34.6901,
            "longitude": 115.1706
          },
          {
            "name": "睢县",
            "latitude": 34.3937,
            "longitude": 115.0353
          },
          {
            "name": "宁陵县",
            "latitude": 34.4493,
            "longitude": 115.292
          },
          {
            "name": "柘城县",
            "latitude": 34.1058,
            "longitude": 115.3018
          },
          {
            "name": "虞城县",
            "latitude": 34.3638,
            "longitude": 115.9078
          },
          {
            "name": "夏邑县",
            "latitude": 34.2177,
            "longitude": 116.15
          },
          {
            "name": "永城市",
            "latitude": 33.9667,
            "longitude": 116.3239
          },
          {
            "name": "市区",
            "latitude": 34.3235,
            "longitude": 115.5944
          }
        ]
      },
      {
        "name": "信阳市",
        "districts": [
          {
            "name": "浉河区",
            "latitude": 32.0458,
            "longitude": 113.9616
          },
          {
            "name": "平桥区",
            "latitude": 32.3447,
            "longitude": 114.0576
          },
          {
            "name": "罗山县",
            "latitude": 32.0261,
            "longitude": 114.4371
          },
          {
            "name": "光山县",
            "latitude": 31.9359,
            "longitude": 114.8362
          },
          {
            "name": "新县",
            "latitude": 31.6404,
            "longitude": 114.8526
          },
          {
            "name": "商城县",
            "latitude": 31.7603,
            "longitude": 115.3685
          },
          {
            "name": "固始县",
            "latitude": 32.1308,
            "longitude": 115.7036
          },
          {
            "name": "潢川县",
            "latitude": 32.1274,
            "longitude": 115.1577
          },
          {
            "name": "淮滨县",
            "latitude": 32.4402,
            "longitude": 115.3184
          },
          {
            "name": "息县",
            "latitude": 32.4057,
            "longitude": 114.865
          },
          {
            "name": "市区",
            "latitude": 32.0857,
            "longitude": 114.8558
          }
        ]
      },
      {
        "name": "周口市",
        "districts": [
          {
            "name": "川汇区",
            "latitude": 33.6211,
            "longitude": 114.7199
          },
          {
            "name": "淮阳区",
            "latitude": 33.7134,
            "longitude": 114.9099
          },
          {
            "name": "扶沟县",
            "latitude": 34.0941,
            "longitude": 114.4313
          },
          {
            "name": "西华县",
            "latitude": 33.7875,
            "longitude": 114.4703
          },
          {
            "name": "商水县",
            "latitude": 33.5138,
            "longitude": 114.5422
          },
          {
            "name": "沈丘县",
            "latitude": 33.2894,
            "longitude": 115.1708
          },
          {
            "name": "郸城县",
            "latitude": 33.636,
            "longitude": 115.2946
          },
          {
            "name": "太康县",
            "latitude": 34.0918,
            "longitude": 114.8484
          },
          {
            "name": "鹿邑县",
            "latitude": 33.8884,
            "longitude": 115.3786
          },
          {
            "name": "项城市",
            "latitude": 33.2707,
            "longitude": 114.8854
          },
          {
            "name": "市区",
            "latitude": 33.6906,
            "longitude": 114.8651
          }
        ]
      },
      {
        "name": "驻马店市",
        "districts": [
          {
            "name": "驿城区",
            "latitude": 32.9667,
            "longitude": 113.8825
          },
          {
            "name": "西平县",
            "latitude": 33.3661,
            "longitude": 113.917
          },
          {
            "name": "上蔡县",
            "latitude": 33.2952,
            "longitude": 114.402
          },
          {
            "name": "平舆县",
            "latitude": 32.9863,
            "longitude": 114.6406
          },
          {
            "name": "正阳县",
            "latitude": 32.5416,
            "longitude": 114.4913
          },
          {
            "name": "确山县",
            "latitude": 32.6984,
            "longitude": 113.9678
          },
          {
            "name": "泌阳县",
            "latitude": 32.8604,
            "longitude": 113.4011
          },
          {
            "name": "汝南县",
            "latitude": 32.9158,
            "longitude": 114.3181
          },
          {
            "name": "遂平县",
            "latitude": 33.1601,
            "longitude": 113.8945
          },
          {
            "name": "新蔡县",
            "latitude": 32.7779,
            "longitude": 114.9431
          },
          {
            "name": "市区",
            "latitude": 32.9569,
            "longitude": 114.1858
          }
        ]
      },
      {
        "name": "济源市",
        "districts": [
          {
            "name": "济源市",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
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
            "latitude": 30.5823,
            "longitude": 114.2934
          }
        ]
      },
      {
        "name": "黄石市",
        "districts": [
          {
            "name": "黄石港区",
            "latitude": 30.2323,
            "longitude": 115.0588
          },
          {
            "name": "西塞山区",
            "latitude": 30.1771,
            "longitude": 115.1637
          },
          {
            "name": "下陆区",
            "latitude": 30.1929,
            "longitude": 114.9855
          },
          {
            "name": "铁山区",
            "latitude": 30.2117,
            "longitude": 114.8987
          },
          {
            "name": "阳新县",
            "latitude": 29.8232,
            "longitude": 115.134
          },
          {
            "name": "大冶市",
            "latitude": 30.0658,
            "longitude": 114.8389
          },
          {
            "name": "市区",
            "latitude": 30.1172,
            "longitude": 115.0133
          }
        ]
      },
      {
        "name": "十堰市",
        "districts": [
          {
            "name": "茅箭区",
            "latitude": 32.5184,
            "longitude": 110.7873
          },
          {
            "name": "张湾区",
            "latitude": 32.6406,
            "longitude": 110.623
          },
          {
            "name": "郧阳区",
            "latitude": 32.8604,
            "longitude": 110.7308
          },
          {
            "name": "郧西县",
            "latitude": 33.0421,
            "longitude": 110.1424
          },
          {
            "name": "竹山县",
            "latitude": 32.2348,
            "longitude": 110.0649
          },
          {
            "name": "竹溪县",
            "latitude": 32.0319,
            "longitude": 109.7843
          },
          {
            "name": "房县",
            "latitude": 32.0724,
            "longitude": 110.6249
          },
          {
            "name": "丹江口市",
            "latitude": 32.5634,
            "longitude": 111.1879
          },
          {
            "name": "市区",
            "latitude": 32.4955,
            "longitude": 110.4932
          }
        ]
      },
      {
        "name": "宜昌市",
        "districts": [
          {
            "name": "西陵区",
            "latitude": 30.7199,
            "longitude": 111.3187
          },
          {
            "name": "伍家岗区",
            "latitude": 30.6515,
            "longitude": 111.3809
          },
          {
            "name": "点军区",
            "latitude": 30.6708,
            "longitude": 111.1773
          },
          {
            "name": "猇亭区",
            "latitude": 30.5509,
            "longitude": 111.4482
          },
          {
            "name": "夷陵区",
            "latitude": 30.9744,
            "longitude": 111.2495
          },
          {
            "name": "远安县",
            "latitude": 31.171,
            "longitude": 111.5785
          },
          {
            "name": "兴山县",
            "latitude": 31.3156,
            "longitude": 110.8167
          },
          {
            "name": "秭归县",
            "latitude": 30.8978,
            "longitude": 110.6786
          },
          {
            "name": "长阳土家族自治县",
            "latitude": 30.4785,
            "longitude": 110.8479
          },
          {
            "name": "五峰土家族自治县",
            "latitude": 30.1686,
            "longitude": 110.708
          },
          {
            "name": "宜都市",
            "latitude": 30.2916,
            "longitude": 111.3701
          },
          {
            "name": "当阳市",
            "latitude": 30.8202,
            "longitude": 111.8356
          },
          {
            "name": "枝江市",
            "latitude": 30.4452,
            "longitude": 111.7231
          },
          {
            "name": "市区",
            "latitude": 30.7043,
            "longitude": 111.241
          }
        ]
      },
      {
        "name": "襄阳市",
        "districts": [
          {
            "name": "襄城区",
            "latitude": 31.9471,
            "longitude": 112.0591
          },
          {
            "name": "樊城区",
            "latitude": 32.1191,
            "longitude": 111.9839
          },
          {
            "name": "襄州区",
            "latitude": 32.1713,
            "longitude": 112.2407
          },
          {
            "name": "南漳县",
            "latitude": 31.638,
            "longitude": 111.7586
          },
          {
            "name": "谷城县",
            "latitude": 32.1689,
            "longitude": 111.4889
          },
          {
            "name": "保康县",
            "latitude": 31.7081,
            "longitude": 111.207
          },
          {
            "name": "老河口市",
            "latitude": 32.4285,
            "longitude": 111.7607
          },
          {
            "name": "枣阳市",
            "latitude": 32.0886,
            "longitude": 112.7667
          },
          {
            "name": "宜城市",
            "latitude": 31.6685,
            "longitude": 112.3659
          },
          {
            "name": "市区",
            "latitude": 31.9931,
            "longitude": 111.9591
          }
        ]
      },
      {
        "name": "鄂州市",
        "districts": [
          {
            "name": "梁子湖区",
            "latitude": 30.1681,
            "longitude": 114.623
          },
          {
            "name": "华容区",
            "latitude": 30.4803,
            "longitude": 114.7235
          },
          {
            "name": "鄂城区",
            "latitude": 30.328,
            "longitude": 114.9035
          },
          {
            "name": "市区",
            "latitude": 30.3255,
            "longitude": 114.75
          }
        ]
      },
      {
        "name": "荆门市",
        "districts": [
          {
            "name": "东宝区",
            "latitude": 31.1716,
            "longitude": 112.099
          },
          {
            "name": "掇刀区",
            "latitude": 30.8877,
            "longitude": 112.2061
          },
          {
            "name": "沙洋县",
            "latitude": 30.6603,
            "longitude": 112.3918
          },
          {
            "name": "钟祥市",
            "latitude": 31.2409,
            "longitude": 112.5787
          },
          {
            "name": "京山市",
            "latitude": 31.0808,
            "longitude": 113.1069
          },
          {
            "name": "市区",
            "latitude": 31.0083,
            "longitude": 112.4765
          }
        ]
      },
      {
        "name": "孝感市",
        "districts": [
          {
            "name": "孝南区",
            "latitude": 30.9389,
            "longitude": 114.0096
          },
          {
            "name": "孝昌县",
            "latitude": 31.2333,
            "longitude": 114.0279
          },
          {
            "name": "大悟县",
            "latitude": 31.5715,
            "longitude": 114.3041
          },
          {
            "name": "云梦县",
            "latitude": 30.9995,
            "longitude": 113.7715
          },
          {
            "name": "应城市",
            "latitude": 30.9198,
            "longitude": 113.5494
          },
          {
            "name": "安陆市",
            "latitude": 31.2996,
            "longitude": 113.6279
          },
          {
            "name": "汉川市",
            "latitude": 30.6159,
            "longitude": 113.6744
          },
          {
            "name": "市区",
            "latitude": 31.0826,
            "longitude": 113.8521
          }
        ]
      },
      {
        "name": "荆州市",
        "districts": [
          {
            "name": "沙市区",
            "latitude": 30.3197,
            "longitude": 112.3902
          },
          {
            "name": "荆州区",
            "latitude": 30.4108,
            "longitude": 112.1034
          },
          {
            "name": "公安县",
            "latitude": 29.9514,
            "longitude": 112.1486
          },
          {
            "name": "江陵县",
            "latitude": 30.0945,
            "longitude": 112.4679
          },
          {
            "name": "石首市",
            "latitude": 29.7327,
            "longitude": 112.5076
          },
          {
            "name": "洪湖市",
            "latitude": 29.9944,
            "longitude": 113.5381
          },
          {
            "name": "松滋市",
            "latitude": 30.0995,
            "longitude": 111.6902
          },
          {
            "name": "监利市",
            "latitude": 29.8449,
            "longitude": 113.0006
          },
          {
            "name": "市区",
            "latitude": 30.056,
            "longitude": 112.4808
          }
        ]
      },
      {
        "name": "黄冈市",
        "districts": [
          {
            "name": "黄州区",
            "latitude": 30.5099,
            "longitude": 114.9421
          },
          {
            "name": "团风县",
            "latitude": 30.7158,
            "longitude": 115.0064
          },
          {
            "name": "红安县",
            "latitude": 31.2839,
            "longitude": 114.6219
          },
          {
            "name": "罗田县",
            "latitude": 30.9263,
            "longitude": 115.4727
          },
          {
            "name": "英山县",
            "latitude": 30.8668,
            "longitude": 115.7664
          },
          {
            "name": "浠水县",
            "latitude": 30.5026,
            "longitude": 115.2677
          },
          {
            "name": "蕲春县",
            "latitude": 30.3226,
            "longitude": 115.5937
          },
          {
            "name": "黄梅县",
            "latitude": 29.9926,
            "longitude": 115.9346
          },
          {
            "name": "麻城市",
            "latitude": 31.2126,
            "longitude": 115.0836
          },
          {
            "name": "武穴市",
            "latitude": 30.0089,
            "longitude": 115.619
          },
          {
            "name": "市区",
            "latitude": 30.6342,
            "longitude": 115.3308
          }
        ]
      },
      {
        "name": "咸宁市",
        "districts": [
          {
            "name": "咸安区",
            "latitude": 29.8486,
            "longitude": 114.3854
          },
          {
            "name": "嘉鱼县",
            "latitude": 30.0075,
            "longitude": 113.9605
          },
          {
            "name": "通城县",
            "latitude": 29.2236,
            "longitude": 113.8463
          },
          {
            "name": "崇阳县",
            "latitude": 29.4563,
            "longitude": 114.0617
          },
          {
            "name": "通山县",
            "latitude": 29.5526,
            "longitude": 114.6093
          },
          {
            "name": "赤壁市",
            "latitude": 29.7368,
            "longitude": 113.8831
          },
          {
            "name": "市区",
            "latitude": 29.6376,
            "longitude": 114.1244
          }
        ]
      },
      {
        "name": "随州市",
        "districts": [
          {
            "name": "曾都区",
            "latitude": 31.638,
            "longitude": 113.4301
          },
          {
            "name": "随县",
            "latitude": 31.9488,
            "longitude": 113.2509
          },
          {
            "name": "广水市",
            "latitude": 31.6772,
            "longitude": 113.806
          },
          {
            "name": "市区",
            "latitude": 31.7547,
            "longitude": 113.4957
          }
        ]
      },
      {
        "name": "恩施土家族苗族自治州",
        "districts": [
          {
            "name": "恩施市",
            "latitude": 30.3032,
            "longitude": 109.5108
          },
          {
            "name": "利川市",
            "latitude": 30.2336,
            "longitude": 108.8207
          },
          {
            "name": "建始县",
            "latitude": 30.5735,
            "longitude": 109.934
          },
          {
            "name": "巴东县",
            "latitude": 30.8216,
            "longitude": 110.294
          },
          {
            "name": "宣恩县",
            "latitude": 29.8806,
            "longitude": 109.5582
          },
          {
            "name": "咸丰县",
            "latitude": 29.7315,
            "longitude": 108.9975
          },
          {
            "name": "来凤县",
            "latitude": 29.4198,
            "longitude": 109.2387
          },
          {
            "name": "鹤峰县",
            "latitude": 29.9132,
            "longitude": 110.1934
          },
          {
            "name": "市区",
            "latitude": 30.1096,
            "longitude": 109.5684
          }
        ]
      },
      {
        "name": "仙桃市",
        "districts": [
          {
            "name": "仙桃市",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "潜江市",
        "districts": [
          {
            "name": "潜江市",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "天门市",
        "districts": [
          {
            "name": "天门市",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "神农架林区",
        "districts": [
          {
            "name": "神农架林区",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
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
            "name": "浏阳市",
            "latitude": 28.2285,
            "longitude": 113.7155
          },
          {
            "name": "宁乡市",
            "latitude": 28.1253,
            "longitude": 112.3531
          },
          {
            "name": "市区",
            "latitude": 28.2043,
            "longitude": 113.0087
          }
        ]
      },
      {
        "name": "株洲市",
        "districts": [
          {
            "name": "荷塘区",
            "latitude": 27.901,
            "longitude": 113.2195
          },
          {
            "name": "芦淞区",
            "latitude": 27.8052,
            "longitude": 113.2547
          },
          {
            "name": "石峰区",
            "latitude": 27.9285,
            "longitude": 113.142
          },
          {
            "name": "天元区",
            "latitude": 27.7064,
            "longitude": 113.0739
          },
          {
            "name": "渌口区",
            "latitude": 27.4753,
            "longitude": 113.1402
          },
          {
            "name": "攸县",
            "latitude": 27.168,
            "longitude": 113.4818
          },
          {
            "name": "茶陵县",
            "latitude": 26.8011,
            "longitude": 113.6457
          },
          {
            "name": "炎陵县",
            "latitude": 26.3747,
            "longitude": 113.8442
          },
          {
            "name": "醴陵市",
            "latitude": 27.6576,
            "longitude": 113.4641
          },
          {
            "name": "市区",
            "latitude": 27.4242,
            "longitude": 113.3629
          }
        ]
      },
      {
        "name": "湘潭市",
        "districts": [
          {
            "name": "雨湖区",
            "latitude": 27.9261,
            "longitude": 112.8509
          },
          {
            "name": "岳塘区",
            "latitude": 27.8866,
            "longitude": 112.9976
          },
          {
            "name": "湘潭县",
            "latitude": 27.6089,
            "longitude": 112.7735
          },
          {
            "name": "湘乡市",
            "latitude": 27.7682,
            "longitude": 112.3459
          },
          {
            "name": "韶山市",
            "latitude": 27.9169,
            "longitude": 112.5194
          },
          {
            "name": "市区",
            "latitude": 27.8213,
            "longitude": 112.6975
          }
        ]
      },
      {
        "name": "衡阳市",
        "districts": [
          {
            "name": "珠晖区",
            "latitude": 26.8768,
            "longitude": 112.6711
          },
          {
            "name": "雁峰区",
            "latitude": 26.8326,
            "longitude": 112.6077
          },
          {
            "name": "石鼓区",
            "latitude": 26.9624,
            "longitude": 112.6047
          },
          {
            "name": "蒸湘区",
            "latitude": 26.8792,
            "longitude": 112.5435
          },
          {
            "name": "南岳区",
            "latitude": 27.2572,
            "longitude": 112.6964
          },
          {
            "name": "衡阳县",
            "latitude": 27.103,
            "longitude": 112.3473
          },
          {
            "name": "衡南县",
            "latitude": 26.74,
            "longitude": 112.6775
          },
          {
            "name": "衡山县",
            "latitude": 27.2348,
            "longitude": 112.8697
          },
          {
            "name": "衡东县",
            "latitude": 27.0791,
            "longitude": 113.0222
          },
          {
            "name": "祁东县",
            "latitude": 26.8005,
            "longitude": 111.9549
          },
          {
            "name": "耒阳市",
            "latitude": 26.4187,
            "longitude": 112.9157
          },
          {
            "name": "常宁市",
            "latitude": 26.3593,
            "longitude": 112.43
          },
          {
            "name": "市区",
            "latitude": 26.8786,
            "longitude": 112.6117
          }
        ]
      },
      {
        "name": "邵阳市",
        "districts": [
          {
            "name": "双清区",
            "latitude": 27.2418,
            "longitude": 111.5464
          },
          {
            "name": "大祥区",
            "latitude": 27.1595,
            "longitude": 111.4855
          },
          {
            "name": "北塔区",
            "latitude": 27.2482,
            "longitude": 111.4201
          },
          {
            "name": "新邵县",
            "latitude": 27.4256,
            "longitude": 111.4646
          },
          {
            "name": "邵阳县",
            "latitude": 26.9794,
            "longitude": 111.3255
          },
          {
            "name": "隆回县",
            "latitude": 27.3464,
            "longitude": 110.9654
          },
          {
            "name": "洞口县",
            "latitude": 27.0977,
            "longitude": 110.5921
          },
          {
            "name": "绥宁县",
            "latitude": 26.7075,
            "longitude": 110.1993
          },
          {
            "name": "新宁县",
            "latitude": 26.5417,
            "longitude": 110.918
          },
          {
            "name": "城步苗族自治县",
            "latitude": 26.3188,
            "longitude": 110.3185
          },
          {
            "name": "武冈市",
            "latitude": 26.7813,
            "longitude": 110.7391
          },
          {
            "name": "邵东市",
            "latitude": 27.187,
            "longitude": 111.8503
          },
          {
            "name": "市区",
            "latitude": 27.0029,
            "longitude": 111.0687
          }
        ]
      },
      {
        "name": "岳阳市",
        "districts": [
          {
            "name": "岳阳楼区",
            "latitude": 29.3357,
            "longitude": 113.2145
          },
          {
            "name": "云溪区",
            "latitude": 29.5086,
            "longitude": 113.2977
          },
          {
            "name": "君山区",
            "latitude": 29.4768,
            "longitude": 112.8668
          },
          {
            "name": "岳阳县",
            "latitude": 29.1662,
            "longitude": 113.2208
          },
          {
            "name": "华容县",
            "latitude": 29.4912,
            "longitude": 112.6417
          },
          {
            "name": "湘阴县",
            "latitude": 28.7006,
            "longitude": 112.7966
          },
          {
            "name": "平江县",
            "latitude": 28.756,
            "longitude": 113.7144
          },
          {
            "name": "汨罗市",
            "latitude": 28.7989,
            "longitude": 113.1149
          },
          {
            "name": "临湘市",
            "latitude": 29.4907,
            "longitude": 113.514
          },
          {
            "name": "市区",
            "latitude": 29.1916,
            "longitude": 113.1535
          }
        ]
      },
      {
        "name": "常德市",
        "districts": [
          {
            "name": "武陵区",
            "latitude": 29.0148,
            "longitude": 111.7051
          },
          {
            "name": "鼎城区",
            "latitude": 29.1785,
            "longitude": 111.8562
          },
          {
            "name": "安乡县",
            "latitude": 29.4424,
            "longitude": 112.1556
          },
          {
            "name": "汉寿县",
            "latitude": 28.8589,
            "longitude": 112.037
          },
          {
            "name": "澧县",
            "latitude": 29.7436,
            "longitude": 111.7048
          },
          {
            "name": "临澧县",
            "latitude": 29.48,
            "longitude": 111.6189
          },
          {
            "name": "桃源县",
            "latitude": 28.9122,
            "longitude": 111.2633
          },
          {
            "name": "石门县",
            "latitude": 29.7954,
            "longitude": 111.0379
          },
          {
            "name": "津市市",
            "latitude": 29.4601,
            "longitude": 111.8955
          },
          {
            "name": "市区",
            "latitude": 29.3207,
            "longitude": 111.6971
          }
        ]
      },
      {
        "name": "张家界市",
        "districts": [
          {
            "name": "永定区",
            "latitude": 29.119,
            "longitude": 110.4615
          },
          {
            "name": "武陵源区",
            "latitude": 29.3463,
            "longitude": 110.5009
          },
          {
            "name": "慈利县",
            "latitude": 29.393,
            "longitude": 110.9275
          },
          {
            "name": "桑植县",
            "latitude": 29.562,
            "longitude": 110.1819
          },
          {
            "name": "市区",
            "latitude": 29.3551,
            "longitude": 110.5179
          }
        ]
      },
      {
        "name": "益阳市",
        "districts": [
          {
            "name": "资阳区",
            "latitude": 28.68,
            "longitude": 112.3602
          },
          {
            "name": "赫山区",
            "latitude": 28.4734,
            "longitude": 112.4368
          },
          {
            "name": "南县",
            "latitude": 29.2362,
            "longitude": 112.4378
          },
          {
            "name": "桃江县",
            "latitude": 28.4583,
            "longitude": 111.9839
          },
          {
            "name": "安化县",
            "latitude": 28.2806,
            "longitude": 111.3841
          },
          {
            "name": "沅江市",
            "latitude": 28.9699,
            "longitude": 112.5566
          },
          {
            "name": "市区",
            "latitude": 28.6831,
            "longitude": 112.1932
          }
        ]
      },
      {
        "name": "郴州市",
        "districts": [
          {
            "name": "北湖区",
            "latitude": 25.6568,
            "longitude": 112.8899
          },
          {
            "name": "苏仙区",
            "latitude": 25.7932,
            "longitude": 113.0884
          },
          {
            "name": "桂阳县",
            "latitude": 25.8868,
            "longitude": 112.6013
          },
          {
            "name": "宜章县",
            "latitude": 25.3943,
            "longitude": 112.9479
          },
          {
            "name": "永兴县",
            "latitude": 26.2091,
            "longitude": 113.192
          },
          {
            "name": "嘉禾县",
            "latitude": 25.6308,
            "longitude": 112.4074
          },
          {
            "name": "临武县",
            "latitude": 25.339,
            "longitude": 112.5607
          },
          {
            "name": "汝城县",
            "latitude": 25.5501,
            "longitude": 113.6698
          },
          {
            "name": "桂东县",
            "latitude": 25.9796,
            "longitude": 113.9004
          },
          {
            "name": "安仁县",
            "latitude": 26.5756,
            "longitude": 113.3588
          },
          {
            "name": "资兴市",
            "latitude": 25.9322,
            "longitude": 113.4575
          },
          {
            "name": "市区",
            "latitude": 25.8134,
            "longitude": 113.0976
          }
        ]
      },
      {
        "name": "永州市",
        "districts": [
          {
            "name": "零陵区",
            "latitude": 26.13,
            "longitude": 111.5546
          },
          {
            "name": "冷水滩区",
            "latitude": 26.5298,
            "longitude": 111.6324
          },
          {
            "name": "祁阳县",
            "latitude": 25.8192,
            "longitude": 111.7437
          },
          {
            "name": "东安县",
            "latitude": 26.4897,
            "longitude": 111.3362
          },
          {
            "name": "双牌县",
            "latitude": 25.9101,
            "longitude": 111.7092
          },
          {
            "name": "道县",
            "latitude": 25.4933,
            "longitude": 111.5961
          },
          {
            "name": "江永县",
            "latitude": 25.1936,
            "longitude": 111.2456
          },
          {
            "name": "宁远县",
            "latitude": 25.6455,
            "longitude": 111.9793
          },
          {
            "name": "蓝山县",
            "latitude": 25.3124,
            "longitude": 112.1881
          },
          {
            "name": "新田县",
            "latitude": 25.8838,
            "longitude": 112.2278
          },
          {
            "name": "江华瑶族自治县",
            "latitude": 24.9712,
            "longitude": 111.7441
          },
          {
            "name": "祁阳市",
            "latitude": 26.452,
            "longitude": 111.9669
          },
          {
            "name": "市区",
            "latitude": 25.8192,
            "longitude": 111.7437
          }
        ]
      },
      {
        "name": "怀化市",
        "districts": [
          {
            "name": "鹤城区",
            "latitude": 27.612,
            "longitude": 109.9472
          },
          {
            "name": "中方县",
            "latitude": 27.5088,
            "longitude": 110.1603
          },
          {
            "name": "沅陵县",
            "latitude": 28.5709,
            "longitude": 110.5952
          },
          {
            "name": "辰溪县",
            "latitude": 27.8901,
            "longitude": 110.2659
          },
          {
            "name": "溆浦县",
            "latitude": 27.8314,
            "longitude": 110.6506
          },
          {
            "name": "会同县",
            "latitude": 26.9089,
            "longitude": 109.804
          },
          {
            "name": "麻阳苗族自治县",
            "latitude": 27.7842,
            "longitude": 109.7224
          },
          {
            "name": "新晃侗族自治县",
            "latitude": 27.2286,
            "longitude": 109.1617
          },
          {
            "name": "芷江侗族自治县",
            "latitude": 27.3952,
            "longitude": 109.6033
          },
          {
            "name": "靖州苗族侗族自治县",
            "latitude": 26.5429,
            "longitude": 109.5846
          },
          {
            "name": "通道侗族自治县",
            "latitude": 26.2086,
            "longitude": 109.7367
          },
          {
            "name": "洪江市",
            "latitude": 27.2325,
            "longitude": 110.0793
          },
          {
            "name": "市区",
            "latitude": 27.3928,
            "longitude": 109.9426
          }
        ]
      },
      {
        "name": "娄底市",
        "districts": [
          {
            "name": "娄星区",
            "latitude": 27.7183,
            "longitude": 112.0088
          },
          {
            "name": "双峰县",
            "latitude": 27.4487,
            "longitude": 112.185
          },
          {
            "name": "新化县",
            "latitude": 27.8679,
            "longitude": 111.2383
          },
          {
            "name": "冷水江市",
            "latitude": 27.6815,
            "longitude": 111.4858
          },
          {
            "name": "涟源市",
            "latitude": 27.7424,
            "longitude": 111.7822
          },
          {
            "name": "市区",
            "latitude": 27.6918,
            "longitude": 111.74
          }
        ]
      },
      {
        "name": "湘西土家族苗族自治州",
        "districts": [
          {
            "name": "吉首市",
            "latitude": 28.31,
            "longitude": 109.7625
          },
          {
            "name": "泸溪县",
            "latitude": 28.1585,
            "longitude": 109.9961
          },
          {
            "name": "凤凰县",
            "latitude": 28.0061,
            "longitude": 109.5113
          },
          {
            "name": "花垣县",
            "latitude": 28.426,
            "longitude": 109.4319
          },
          {
            "name": "保靖县",
            "latitude": 28.6664,
            "longitude": 109.5639
          },
          {
            "name": "古丈县",
            "latitude": 28.5982,
            "longitude": 109.9983
          },
          {
            "name": "永顺县",
            "latitude": 29.0102,
            "longitude": 109.9704
          },
          {
            "name": "龙山县",
            "latitude": 29.2194,
            "longitude": 109.5095
          },
          {
            "name": "市区",
            "latitude": 28.5494,
            "longitude": 109.718
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
            "latitude": 23.1946,
            "longitude": 113.4232
          }
        ]
      },
      {
        "name": "韶关市",
        "districts": [
          {
            "name": "武江区",
            "latitude": 24.7095,
            "longitude": 113.3804
          },
          {
            "name": "浈江区",
            "latitude": 24.908,
            "longitude": 113.5777
          },
          {
            "name": "曲江区",
            "latitude": 24.6416,
            "longitude": 113.6284
          },
          {
            "name": "始兴县",
            "latitude": 24.8482,
            "longitude": 114.1088
          },
          {
            "name": "仁化县",
            "latitude": 25.1406,
            "longitude": 113.7812
          },
          {
            "name": "翁源县",
            "latitude": 24.4195,
            "longitude": 114.023
          },
          {
            "name": "乳源瑶族自治县",
            "latitude": 24.8058,
            "longitude": 113.1696
          },
          {
            "name": "新丰县",
            "latitude": 24.0652,
            "longitude": 114.1377
          },
          {
            "name": "乐昌市",
            "latitude": 25.2431,
            "longitude": 113.244
          },
          {
            "name": "南雄市",
            "latitude": 25.1839,
            "longitude": 114.3811
          },
          {
            "name": "市区",
            "latitude": 24.7965,
            "longitude": 113.7432
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
            "latitude": 22.6405,
            "longitude": 114.0897
          }
        ]
      },
      {
        "name": "珠海市",
        "districts": [
          {
            "name": "香洲区",
            "latitude": 22.2573,
            "longitude": 113.5347
          },
          {
            "name": "斗门区",
            "latitude": 22.2268,
            "longitude": 113.2497
          },
          {
            "name": "金湾区",
            "latitude": 22.0351,
            "longitude": 113.2846
          },
          {
            "name": "市区",
            "latitude": 22.1731,
            "longitude": 113.3563
          }
        ]
      },
      {
        "name": "汕头市",
        "districts": [
          {
            "name": "龙湖区",
            "latitude": 23.3906,
            "longitude": 116.7606
          },
          {
            "name": "金平区",
            "latitude": 23.3841,
            "longitude": 116.6414
          },
          {
            "name": "濠江区",
            "latitude": 23.2725,
            "longitude": 116.7162
          },
          {
            "name": "潮阳区",
            "latitude": 23.3323,
            "longitude": 116.4899
          },
          {
            "name": "潮南区",
            "latitude": 23.1736,
            "longitude": 116.4113
          },
          {
            "name": "澄海区",
            "latitude": 23.5209,
            "longitude": 116.8156
          },
          {
            "name": "南澳县",
            "latitude": 23.4347,
            "longitude": 117.0613
          },
          {
            "name": "市区",
            "latitude": 23.3584,
            "longitude": 116.6995
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
            "latitude": 23.003,
            "longitude": 112.9717
          }
        ]
      },
      {
        "name": "江门市",
        "districts": [
          {
            "name": "蓬江区",
            "latitude": 22.6537,
            "longitude": 113.0539
          },
          {
            "name": "江海区",
            "latitude": 22.5485,
            "longitude": 113.1282
          },
          {
            "name": "新会区",
            "latitude": 22.3812,
            "longitude": 113.0292
          },
          {
            "name": "台山市",
            "latitude": 22.0428,
            "longitude": 112.7106
          },
          {
            "name": "开平市",
            "latitude": 22.3711,
            "longitude": 112.5399
          },
          {
            "name": "鹤山市",
            "latitude": 22.6687,
            "longitude": 112.7963
          },
          {
            "name": "恩平市",
            "latitude": 22.2328,
            "longitude": 112.2815
          },
          {
            "name": "市区",
            "latitude": 22.4141,
            "longitude": 112.7914
          }
        ]
      },
      {
        "name": "湛江市",
        "districts": [
          {
            "name": "赤坎区",
            "latitude": 21.2778,
            "longitude": 110.3778
          },
          {
            "name": "霞山区",
            "latitude": 21.1906,
            "longitude": 110.3798
          },
          {
            "name": "坡头区",
            "latitude": 21.3094,
            "longitude": 110.4996
          },
          {
            "name": "麻章区",
            "latitude": 21.1514,
            "longitude": 110.2476
          },
          {
            "name": "遂溪县",
            "latitude": 21.2597,
            "longitude": 110.0187
          },
          {
            "name": "徐闻县",
            "latitude": 20.4192,
            "longitude": 110.2448
          },
          {
            "name": "廉江市",
            "latitude": 21.6354,
            "longitude": 110.1296
          },
          {
            "name": "雷州市",
            "latitude": 20.783,
            "longitude": 110.0011
          },
          {
            "name": "吴川市",
            "latitude": 21.4276,
            "longitude": 110.7126
          },
          {
            "name": "市区",
            "latitude": 21.1616,
            "longitude": 110.2902
          }
        ]
      },
      {
        "name": "茂名市",
        "districts": [
          {
            "name": "茂南区",
            "latitude": 21.6758,
            "longitude": 110.8837
          },
          {
            "name": "电白区",
            "latitude": 21.6491,
            "longitude": 111.1956
          },
          {
            "name": "高州市",
            "latitude": 22.0294,
            "longitude": 110.9697
          },
          {
            "name": "化州市",
            "latitude": 21.839,
            "longitude": 110.5353
          },
          {
            "name": "信宜市",
            "latitude": 22.4257,
            "longitude": 111.1185
          },
          {
            "name": "市区",
            "latitude": 21.9238,
            "longitude": 110.9406
          }
        ]
      },
      {
        "name": "肇庆市",
        "districts": [
          {
            "name": "端州区",
            "latitude": 23.0965,
            "longitude": 112.4706
          },
          {
            "name": "鼎湖区",
            "latitude": 23.2028,
            "longitude": 112.6155
          },
          {
            "name": "高要区",
            "latitude": 23.0277,
            "longitude": 112.4608
          },
          {
            "name": "广宁县",
            "latitude": 23.6716,
            "longitude": 112.4368
          },
          {
            "name": "怀集县",
            "latitude": 23.9636,
            "longitude": 112.172
          },
          {
            "name": "封开县",
            "latitude": 23.556,
            "longitude": 111.7171
          },
          {
            "name": "德庆县",
            "latitude": 23.2701,
            "longitude": 111.9798
          },
          {
            "name": "四会市",
            "latitude": 23.4243,
            "longitude": 112.6812
          },
          {
            "name": "市区",
            "latitude": 23.4016,
            "longitude": 112.3167
          }
        ]
      },
      {
        "name": "惠州市",
        "districts": [
          {
            "name": "惠城区",
            "latitude": 23.1579,
            "longitude": 114.48
          },
          {
            "name": "惠阳区",
            "latitude": 22.8658,
            "longitude": 114.4708
          },
          {
            "name": "博罗县",
            "latitude": 23.3473,
            "longitude": 114.2819
          },
          {
            "name": "惠东县",
            "latitude": 23.0307,
            "longitude": 114.9447
          },
          {
            "name": "龙门县",
            "latitude": 23.6614,
            "longitude": 114.1318
          },
          {
            "name": "市区",
            "latitude": 23.2126,
            "longitude": 114.4618
          }
        ]
      },
      {
        "name": "梅州市",
        "districts": [
          {
            "name": "梅江区",
            "latitude": 24.2618,
            "longitude": 116.1723
          },
          {
            "name": "梅县区",
            "latitude": 24.3789,
            "longitude": 116.1872
          },
          {
            "name": "大埔县",
            "latitude": 24.3418,
            "longitude": 116.6567
          },
          {
            "name": "丰顺县",
            "latitude": 23.9129,
            "longitude": 116.2876
          },
          {
            "name": "五华县",
            "latitude": 23.7963,
            "longitude": 115.6341
          },
          {
            "name": "平远县",
            "latitude": 24.6891,
            "longitude": 115.9262
          },
          {
            "name": "蕉岭县",
            "latitude": 24.6766,
            "longitude": 116.1898
          },
          {
            "name": "兴宁市",
            "latitude": 24.2605,
            "longitude": 115.7475
          },
          {
            "name": "市区",
            "latitude": 24.2897,
            "longitude": 116.1002
          }
        ]
      },
      {
        "name": "汕尾市",
        "districts": [
          {
            "name": "城区",
            "latitude": 22.7691,
            "longitude": 115.426
          },
          {
            "name": "海丰县",
            "latitude": 22.961,
            "longitude": 115.2783
          },
          {
            "name": "陆河县",
            "latitude": 23.2776,
            "longitude": 115.6226
          },
          {
            "name": "陆丰市",
            "latitude": 22.9567,
            "longitude": 115.7848
          },
          {
            "name": "市区",
            "latitude": 22.9911,
            "longitude": 115.5279
          }
        ]
      },
      {
        "name": "河源市",
        "districts": [
          {
            "name": "源城区",
            "latitude": 23.6851,
            "longitude": 114.6448
          },
          {
            "name": "紫金县",
            "latitude": 23.5192,
            "longitude": 115.0569
          },
          {
            "name": "龙川县",
            "latitude": 24.3292,
            "longitude": 115.3563
          },
          {
            "name": "连平县",
            "latitude": 24.3342,
            "longitude": 114.5375
          },
          {
            "name": "和平县",
            "latitude": 24.4466,
            "longitude": 115.0054
          },
          {
            "name": "东源县",
            "latitude": 23.9277,
            "longitude": 114.8197
          },
          {
            "name": "市区",
            "latitude": 24.0403,
            "longitude": 114.9034
          }
        ]
      },
      {
        "name": "阳江市",
        "districts": [
          {
            "name": "江城区",
            "latitude": 21.7771,
            "longitude": 111.891
          },
          {
            "name": "阳东区",
            "latitude": 21.9623,
            "longitude": 112.091
          },
          {
            "name": "阳西县",
            "latitude": 21.7125,
            "longitude": 111.6024
          },
          {
            "name": "阳春市",
            "latitude": 22.2178,
            "longitude": 111.6884
          },
          {
            "name": "市区",
            "latitude": 21.9174,
            "longitude": 111.8182
          }
        ]
      },
      {
        "name": "清远市",
        "districts": [
          {
            "name": "清城区",
            "latitude": 23.6718,
            "longitude": 113.137
          },
          {
            "name": "清新区",
            "latitude": 23.9077,
            "longitude": 112.829
          },
          {
            "name": "佛冈县",
            "latitude": 23.8771,
            "longitude": 113.5596
          },
          {
            "name": "阳山县",
            "latitude": 24.5039,
            "longitude": 112.6757
          },
          {
            "name": "连山壮族瑶族自治县",
            "latitude": 24.5673,
            "longitude": 112.0866
          },
          {
            "name": "连南瑶族自治县",
            "latitude": 24.5586,
            "longitude": 112.2617
          },
          {
            "name": "英德市",
            "latitude": 24.2201,
            "longitude": 113.318
          },
          {
            "name": "连州市",
            "latitude": 24.9317,
            "longitude": 112.4534
          },
          {
            "name": "市区",
            "latitude": 24.2798,
            "longitude": 112.7901
          }
        ]
      },
      {
        "name": "东莞市",
        "districts": [
          {
            "name": "市区",
            "latitude": 22.9319,
            "longitude": 113.88
          }
        ]
      },
      {
        "name": "中山市",
        "districts": [
          {
            "name": "市区",
            "latitude": 22.5173,
            "longitude": 113.3988
          }
        ]
      },
      {
        "name": "潮州市",
        "districts": [
          {
            "name": "湘桥区",
            "latitude": 23.6703,
            "longitude": 116.7115
          },
          {
            "name": "潮安区",
            "latitude": 23.461,
            "longitude": 116.6793
          },
          {
            "name": "饶平县",
            "latitude": 23.8341,
            "longitude": 116.9119
          },
          {
            "name": "市区",
            "latitude": 23.6551,
            "longitude": 116.7676
          }
        ]
      },
      {
        "name": "揭阳市",
        "districts": [
          {
            "name": "榕城区",
            "latitude": 23.5039,
            "longitude": 116.4503
          },
          {
            "name": "揭东区",
            "latitude": 23.6262,
            "longitude": 116.3114
          },
          {
            "name": "揭西县",
            "latitude": 23.4915,
            "longitude": 115.9114
          },
          {
            "name": "惠来县",
            "latitude": 23.026,
            "longitude": 116.2259
          },
          {
            "name": "普宁市",
            "latitude": 23.2833,
            "longitude": 116.071
          },
          {
            "name": "市区",
            "latitude": 23.3862,
            "longitude": 116.194
          }
        ]
      },
      {
        "name": "云浮市",
        "districts": [
          {
            "name": "云城区",
            "latitude": 22.8798,
            "longitude": 112.1236
          },
          {
            "name": "云安区",
            "latitude": 23.0732,
            "longitude": 112.0056
          },
          {
            "name": "新兴县",
            "latitude": 22.6203,
            "longitude": 112.2104
          },
          {
            "name": "郁南县",
            "latitude": 23.0382,
            "longitude": 111.6128
          },
          {
            "name": "罗定市",
            "latitude": 22.685,
            "longitude": 111.4865
          },
          {
            "name": "市区",
            "latitude": 22.8593,
            "longitude": 111.8878
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
            "name": "武鸣区",
            "latitude": 23.2505,
            "longitude": 108.2529
          },
          {
            "name": "隆安县",
            "latitude": 23.1028,
            "longitude": 107.6866
          },
          {
            "name": "马山县",
            "latitude": 23.6586,
            "longitude": 108.1634
          },
          {
            "name": "上林县",
            "latitude": 23.5155,
            "longitude": 108.6394
          },
          {
            "name": "宾阳县",
            "latitude": 23.1617,
            "longitude": 108.9334
          },
          {
            "name": "横县",
            "latitude": 22.9844,
            "longitude": 108.4364
          },
          {
            "name": "横州市",
            "latitude": 22.7692,
            "longitude": 109.1623
          },
          {
            "name": "市区",
            "latitude": 22.9844,
            "longitude": 108.4364
          }
        ]
      },
      {
        "name": "柳州市",
        "districts": [
          {
            "name": "城中区",
            "latitude": 24.3631,
            "longitude": 109.4649
          },
          {
            "name": "鱼峰区",
            "latitude": 24.3038,
            "longitude": 109.4154
          },
          {
            "name": "柳南区",
            "latitude": 24.3785,
            "longitude": 109.2129
          },
          {
            "name": "柳北区",
            "latitude": 24.4521,
            "longitude": 109.3822
          },
          {
            "name": "柳江区",
            "latitude": 24.1664,
            "longitude": 109.2203
          },
          {
            "name": "柳城县",
            "latitude": 24.6232,
            "longitude": 109.2231
          },
          {
            "name": "鹿寨县",
            "latitude": 24.5385,
            "longitude": 109.8192
          },
          {
            "name": "融安县",
            "latitude": 25.1337,
            "longitude": 109.5077
          },
          {
            "name": "融水苗族自治县",
            "latitude": 25.3369,
            "longitude": 109.0515
          },
          {
            "name": "三江侗族自治县",
            "latitude": 25.742,
            "longitude": 109.5023
          },
          {
            "name": "市区",
            "latitude": 24.7038,
            "longitude": 109.38
          }
        ]
      },
      {
        "name": "桂林市",
        "districts": [
          {
            "name": "秀峰区",
            "latitude": 25.2816,
            "longitude": 110.2622
          },
          {
            "name": "叠彩区",
            "latitude": 25.3175,
            "longitude": 110.3355
          },
          {
            "name": "象山区",
            "latitude": 25.1987,
            "longitude": 110.2805
          },
          {
            "name": "七星区",
            "latitude": 25.2607,
            "longitude": 110.3489
          },
          {
            "name": "雁山区",
            "latitude": 25.099,
            "longitude": 110.3601
          },
          {
            "name": "临桂区",
            "latitude": 25.3014,
            "longitude": 110.0644
          },
          {
            "name": "阳朔县",
            "latitude": 24.8508,
            "longitude": 110.4767
          },
          {
            "name": "灵川县",
            "latitude": 25.3755,
            "longitude": 110.4107
          },
          {
            "name": "全州县",
            "latitude": 25.93,
            "longitude": 111.0197
          },
          {
            "name": "兴安县",
            "latitude": 25.602,
            "longitude": 110.5918
          },
          {
            "name": "永福县",
            "latitude": 24.9909,
            "longitude": 109.9114
          },
          {
            "name": "灌阳县",
            "latitude": 25.4515,
            "longitude": 111.0687
          },
          {
            "name": "龙胜各族自治县",
            "latitude": 25.8625,
            "longitude": 110.0006
          },
          {
            "name": "资源县",
            "latitude": 26.0611,
            "longitude": 110.5904
          },
          {
            "name": "平乐县",
            "latitude": 24.5532,
            "longitude": 110.7899
          },
          {
            "name": "恭城瑶族自治县",
            "latitude": 24.9434,
            "longitude": 110.9009
          },
          {
            "name": "荔浦市",
            "latitude": 24.5191,
            "longitude": 110.3618
          },
          {
            "name": "市区",
            "latitude": 25.2705,
            "longitude": 110.4573
          }
        ]
      },
      {
        "name": "梧州市",
        "districts": [
          {
            "name": "万秀区",
            "latitude": 23.5686,
            "longitude": 111.3164
          },
          {
            "name": "长洲区",
            "latitude": 23.554,
            "longitude": 111.1675
          },
          {
            "name": "龙圩区",
            "latitude": 23.2259,
            "longitude": 111.2784
          },
          {
            "name": "苍梧县",
            "latitude": 23.7581,
            "longitude": 111.313
          },
          {
            "name": "藤县",
            "latitude": 23.505,
            "longitude": 110.7735
          },
          {
            "name": "蒙山县",
            "latitude": 24.127,
            "longitude": 110.5543
          },
          {
            "name": "岑溪市",
            "latitude": 22.9198,
            "longitude": 111.0225
          },
          {
            "name": "市区",
            "latitude": 23.5226,
            "longitude": 111.0608
          }
        ]
      },
      {
        "name": "北海市",
        "districts": [
          {
            "name": "海城区",
            "latitude": 21.5017,
            "longitude": 109.1459
          },
          {
            "name": "银海区",
            "latitude": 21.5211,
            "longitude": 109.268
          },
          {
            "name": "铁山港区",
            "latitude": 21.5463,
            "longitude": 109.4756
          },
          {
            "name": "合浦县",
            "latitude": 21.7237,
            "longitude": 109.3427
          },
          {
            "name": "市区",
            "latitude": 21.5732,
            "longitude": 109.308
          }
        ]
      },
      {
        "name": "防城港市",
        "districts": [
          {
            "name": "港口区",
            "latitude": 21.6388,
            "longitude": 108.4479
          },
          {
            "name": "防城区",
            "latitude": 21.7612,
            "longitude": 108.0675
          },
          {
            "name": "上思县",
            "latitude": 22.0468,
            "longitude": 107.8965
          },
          {
            "name": "东兴市",
            "latitude": 21.615,
            "longitude": 108.0616
          },
          {
            "name": "市区",
            "latitude": 21.7654,
            "longitude": 108.1184
          }
        ]
      },
      {
        "name": "钦州市",
        "districts": [
          {
            "name": "钦南区",
            "latitude": 21.8924,
            "longitude": 108.7611
          },
          {
            "name": "钦北区",
            "latitude": 22.1703,
            "longitude": 108.5455
          },
          {
            "name": "灵山县",
            "latitude": 22.3101,
            "longitude": 109.1407
          },
          {
            "name": "浦北县",
            "latitude": 22.2646,
            "longitude": 109.5353
          },
          {
            "name": "市区",
            "latitude": 22.1593,
            "longitude": 108.9956
          }
        ]
      },
      {
        "name": "贵港市",
        "districts": [
          {
            "name": "港北区",
            "latitude": 23.2141,
            "longitude": 109.6544
          },
          {
            "name": "港南区",
            "latitude": 22.9043,
            "longitude": 109.6953
          },
          {
            "name": "覃塘区",
            "latitude": 23.1417,
            "longitude": 109.4076
          },
          {
            "name": "平南县",
            "latitude": 23.533,
            "longitude": 110.4063
          },
          {
            "name": "桂平市",
            "latitude": 23.3287,
            "longitude": 110.0797
          },
          {
            "name": "市区",
            "latitude": 23.2244,
            "longitude": 109.8487
          }
        ]
      },
      {
        "name": "玉林市",
        "districts": [
          {
            "name": "玉州区",
            "latitude": 22.6615,
            "longitude": 110.1527
          },
          {
            "name": "福绵区",
            "latitude": 22.4924,
            "longitude": 110.0089
          },
          {
            "name": "容县",
            "latitude": 22.8267,
            "longitude": 110.6046
          },
          {
            "name": "陆川县",
            "latitude": 22.2458,
            "longitude": 110.2657
          },
          {
            "name": "博白县",
            "latitude": 22.0611,
            "longitude": 109.8734
          },
          {
            "name": "兴业县",
            "latitude": 22.7933,
            "longitude": 109.9234
          },
          {
            "name": "北流市",
            "latitude": 22.5235,
            "longitude": 110.4611
          },
          {
            "name": "市区",
            "latitude": 22.5149,
            "longitude": 110.1843
          }
        ]
      },
      {
        "name": "百色市",
        "districts": [
          {
            "name": "右江区",
            "latitude": 23.9373,
            "longitude": 106.4983
          },
          {
            "name": "田阳区",
            "latitude": 23.7243,
            "longitude": 106.804
          },
          {
            "name": "田东县",
            "latitude": 23.6094,
            "longitude": 107.1837
          },
          {
            "name": "德保县",
            "latitude": 23.3781,
            "longitude": 106.5857
          },
          {
            "name": "那坡县",
            "latitude": 23.2418,
            "longitude": 105.8268
          },
          {
            "name": "凌云县",
            "latitude": 24.3598,
            "longitude": 106.6427
          },
          {
            "name": "乐业县",
            "latitude": 24.8245,
            "longitude": 106.5118
          },
          {
            "name": "田林县",
            "latitude": 24.3891,
            "longitude": 105.993
          },
          {
            "name": "西林县",
            "latitude": 24.492,
            "longitude": 105.095
          },
          {
            "name": "隆林各族自治县",
            "latitude": 24.6746,
            "longitude": 105.3014
          },
          {
            "name": "靖西市",
            "latitude": 23.1437,
            "longitude": 106.3137
          },
          {
            "name": "平果市",
            "latitude": 23.535,
            "longitude": 107.5703
          },
          {
            "name": "市区",
            "latitude": 23.9425,
            "longitude": 106.3605
          }
        ]
      },
      {
        "name": "贺州市",
        "districts": [
          {
            "name": "八步区",
            "latitude": 24.3314,
            "longitude": 111.7769
          },
          {
            "name": "平桂区",
            "latitude": 24.2951,
            "longitude": 111.4363
          },
          {
            "name": "昭平县",
            "latitude": 24.1024,
            "longitude": 110.9693
          },
          {
            "name": "钟山县",
            "latitude": 24.4998,
            "longitude": 111.1892
          },
          {
            "name": "富川瑶族自治县",
            "latitude": 24.8856,
            "longitude": 111.3039
          },
          {
            "name": "市区",
            "latitude": 24.4229,
            "longitude": 111.3351
          }
        ]
      },
      {
        "name": "河池市",
        "districts": [
          {
            "name": "金城江区",
            "latitude": 24.6539,
            "longitude": 107.8646
          },
          {
            "name": "宜州区",
            "latitude": 24.476,
            "longitude": 108.5404
          },
          {
            "name": "南丹县",
            "latitude": 25.1142,
            "longitude": 107.4619
          },
          {
            "name": "天峨县",
            "latitude": 25.0133,
            "longitude": 106.9912
          },
          {
            "name": "凤山县",
            "latitude": 24.5575,
            "longitude": 107.0139
          },
          {
            "name": "东兰县",
            "latitude": 24.5174,
            "longitude": 107.3853
          },
          {
            "name": "罗城仫佬族自治县",
            "latitude": 24.8978,
            "longitude": 108.819
          },
          {
            "name": "环江毛南族自治县",
            "latitude": 25.0987,
            "longitude": 108.285
          },
          {
            "name": "巴马瑶族自治县",
            "latitude": 24.1523,
            "longitude": 107.2005
          },
          {
            "name": "都安瑶族自治县",
            "latitude": 24.1661,
            "longitude": 108.1131
          },
          {
            "name": "大化瑶族自治县",
            "latitude": 23.9635,
            "longitude": 107.7074
          },
          {
            "name": "市区",
            "latitude": 24.601,
            "longitude": 107.762
          }
        ]
      },
      {
        "name": "来宾市",
        "districts": [
          {
            "name": "兴宾区",
            "latitude": 23.6582,
            "longitude": 109.1859
          },
          {
            "name": "忻城县",
            "latitude": 24.0119,
            "longitude": 108.7449
          },
          {
            "name": "象州县",
            "latitude": 24.0135,
            "longitude": 109.7653
          },
          {
            "name": "武宣县",
            "latitude": 23.6046,
            "longitude": 109.6805
          },
          {
            "name": "金秀瑶族自治县",
            "latitude": 24.0848,
            "longitude": 110.1307
          },
          {
            "name": "合山市",
            "latitude": 23.7972,
            "longitude": 108.9366
          },
          {
            "name": "市区",
            "latitude": 23.8617,
            "longitude": 109.4073
          }
        ]
      },
      {
        "name": "崇左市",
        "districts": [
          {
            "name": "江州区",
            "latitude": 22.5239,
            "longitude": 107.4562
          },
          {
            "name": "扶绥县",
            "latitude": 22.5186,
            "longitude": 107.824
          },
          {
            "name": "宁明县",
            "latitude": 21.9994,
            "longitude": 107.2883
          },
          {
            "name": "龙州县",
            "latitude": 22.426,
            "longitude": 106.8527
          },
          {
            "name": "大新县",
            "latitude": 22.808,
            "longitude": 107.1306
          },
          {
            "name": "天等县",
            "latitude": 23.1111,
            "longitude": 107.074
          },
          {
            "name": "凭祥市",
            "latitude": 22.0888,
            "longitude": 106.8316
          },
          {
            "name": "市区",
            "latitude": 22.4965,
            "longitude": 107.2082
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
            "latitude": 19.8669,
            "longitude": 110.3951
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
            "latitude": 18.3519,
            "longitude": 109.4554
          }
        ]
      },
      {
        "name": "三沙市",
        "districts": [
          {
            "name": "西沙群岛",
            "latitude": 12.5227,
            "longitude": 112.8413
          },
          {
            "name": "南沙群岛",
            "latitude": 12.5227,
            "longitude": 112.8413
          },
          {
            "name": "中沙群岛的岛礁及其海域",
            "latitude": 12.5227,
            "longitude": 112.8413
          },
          {
            "name": "市区",
            "latitude": 12.5227,
            "longitude": 112.8413
          }
        ]
      },
      {
        "name": "儋州市",
        "districts": [
          {
            "name": "市区",
            "latitude": 19.5793,
            "longitude": 109.3901
          }
        ]
      },
      {
        "name": "五指山市",
        "districts": [
          {
            "name": "五指山市",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "琼海市",
        "districts": [
          {
            "name": "琼海市",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "文昌市",
        "districts": [
          {
            "name": "文昌市",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "万宁市",
        "districts": [
          {
            "name": "万宁市",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "东方市",
        "districts": [
          {
            "name": "东方市",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "定安县",
        "districts": [
          {
            "name": "定安县",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "屯昌县",
        "districts": [
          {
            "name": "屯昌县",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "澄迈县",
        "districts": [
          {
            "name": "澄迈县",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "临高县",
        "districts": [
          {
            "name": "临高县",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "白沙黎族自治县",
        "districts": [
          {
            "name": "白沙黎族自治县",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "昌江黎族自治县",
        "districts": [
          {
            "name": "昌江黎族自治县",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "乐东黎族自治县",
        "districts": [
          {
            "name": "乐东黎族自治县",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "陵水黎族自治县",
        "districts": [
          {
            "name": "陵水黎族自治县",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "保亭黎族苗族自治县",
        "districts": [
          {
            "name": "保亭黎族苗族自治县",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "琼中黎族苗族自治县",
        "districts": [
          {
            "name": "琼中黎族苗族自治县",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
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
            "name": "城口县",
            "latitude": 31.8818,
            "longitude": 108.7351
          },
          {
            "name": "丰都县",
            "latitude": 29.8848,
            "longitude": 107.8309
          },
          {
            "name": "垫江县",
            "latitude": 30.2533,
            "longitude": 107.4378
          },
          {
            "name": "忠县",
            "latitude": 30.3357,
            "longitude": 107.9148
          },
          {
            "name": "云阳县",
            "latitude": 31.0363,
            "longitude": 108.8569
          },
          {
            "name": "奉节县",
            "latitude": 30.9523,
            "longitude": 109.3496
          },
          {
            "name": "巫山县",
            "latitude": 31.1152,
            "longitude": 109.9012
          },
          {
            "name": "巫溪县",
            "latitude": 31.5031,
            "longitude": 109.3534
          },
          {
            "name": "石柱土家族自治县",
            "latitude": 30.0937,
            "longitude": 108.2985
          },
          {
            "name": "秀山土家族苗族自治县",
            "latitude": 28.4917,
            "longitude": 109.0181
          },
          {
            "name": "酉阳土家族苗族自治县",
            "latitude": 28.8999,
            "longitude": 108.8003
          },
          {
            "name": "彭水苗族土家族自治县",
            "latitude": 29.354,
            "longitude": 108.2663
          },
          {
            "name": "市区",
            "latitude": 29.8986,
            "longitude": 107.366
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
            "name": "金堂县",
            "latitude": 30.7227,
            "longitude": 104.6088
          },
          {
            "name": "大邑县",
            "latitude": 30.6151,
            "longitude": 103.3644
          },
          {
            "name": "蒲江县",
            "latitude": 30.2343,
            "longitude": 103.4915
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
            "latitude": 30.6595,
            "longitude": 103.9504
          }
        ]
      },
      {
        "name": "自贡市",
        "districts": [
          {
            "name": "自流井区",
            "latitude": 29.2729,
            "longitude": 104.7023
          },
          {
            "name": "贡井区",
            "latitude": 29.3725,
            "longitude": 104.633
          },
          {
            "name": "大安区",
            "latitude": 29.3783,
            "longitude": 104.9177
          },
          {
            "name": "沿滩区",
            "latitude": 29.2458,
            "longitude": 104.8475
          },
          {
            "name": "荣县",
            "latitude": 29.4158,
            "longitude": 104.3214
          },
          {
            "name": "富顺县",
            "latitude": 29.1063,
            "longitude": 105.0228
          },
          {
            "name": "市区",
            "latitude": 29.2986,
            "longitude": 104.7408
          }
        ]
      },
      {
        "name": "攀枝花市",
        "districts": [
          {
            "name": "东区",
            "latitude": 26.5939,
            "longitude": 101.743
          },
          {
            "name": "西区",
            "latitude": 26.6122,
            "longitude": 101.5479
          },
          {
            "name": "仁和区",
            "latitude": 26.394,
            "longitude": 101.7263
          },
          {
            "name": "米易县",
            "latitude": 26.9277,
            "longitude": 101.9928
          },
          {
            "name": "盐边县",
            "latitude": 26.9303,
            "longitude": 101.58
          },
          {
            "name": "市区",
            "latitude": 26.6916,
            "longitude": 101.718
          }
        ]
      },
      {
        "name": "泸州市",
        "districts": [
          {
            "name": "江阳区",
            "latitude": 28.8526,
            "longitude": 105.4051
          },
          {
            "name": "纳溪区",
            "latitude": 28.6424,
            "longitude": 105.3898
          },
          {
            "name": "龙马潭区",
            "latitude": 28.9684,
            "longitude": 105.4485
          },
          {
            "name": "泸县",
            "latitude": 29.1192,
            "longitude": 105.4987
          },
          {
            "name": "合江县",
            "latitude": 28.7456,
            "longitude": 105.9253
          },
          {
            "name": "叙永县",
            "latitude": 28.0926,
            "longitude": 105.4626
          },
          {
            "name": "古蔺县",
            "latitude": 27.9759,
            "longitude": 105.93
          },
          {
            "name": "市区",
            "latitude": 28.6281,
            "longitude": 105.58
          }
        ]
      },
      {
        "name": "德阳市",
        "districts": [
          {
            "name": "旌阳区",
            "latitude": 31.1734,
            "longitude": 104.4085
          },
          {
            "name": "罗江区",
            "latitude": 31.3147,
            "longitude": 104.5281
          },
          {
            "name": "中江县",
            "latitude": 30.8812,
            "longitude": 104.7985
          },
          {
            "name": "广汉市",
            "latitude": 31.0008,
            "longitude": 104.2925
          },
          {
            "name": "什邡市",
            "latitude": 31.2731,
            "longitude": 104.0202
          },
          {
            "name": "绵竹市",
            "latitude": 31.4315,
            "longitude": 104.1232
          },
          {
            "name": "市区",
            "latitude": 31.1791,
            "longitude": 104.3618
          }
        ]
      },
      {
        "name": "绵阳市",
        "districts": [
          {
            "name": "涪城区",
            "latitude": 31.4177,
            "longitude": 104.684
          },
          {
            "name": "游仙区",
            "latitude": 31.5303,
            "longitude": 104.9155
          },
          {
            "name": "安州区",
            "latitude": 31.5691,
            "longitude": 104.3468
          },
          {
            "name": "三台县",
            "latitude": 31.1129,
            "longitude": 105.0364
          },
          {
            "name": "盐亭县",
            "latitude": 31.242,
            "longitude": 105.4728
          },
          {
            "name": "梓潼县",
            "latitude": 31.648,
            "longitude": 105.1883
          },
          {
            "name": "北川羌族自治县",
            "latitude": 31.9368,
            "longitude": 104.265
          },
          {
            "name": "平武县",
            "latitude": 32.441,
            "longitude": 104.398
          },
          {
            "name": "江油市",
            "latitude": 31.9467,
            "longitude": 104.9268
          },
          {
            "name": "市区",
            "latitude": 31.6494,
            "longitude": 104.8037
          }
        ]
      },
      {
        "name": "广元市",
        "districts": [
          {
            "name": "利州区",
            "latitude": 32.4449,
            "longitude": 105.7599
          },
          {
            "name": "昭化区",
            "latitude": 32.1651,
            "longitude": 105.835
          },
          {
            "name": "朝天区",
            "latitude": 32.6538,
            "longitude": 105.9556
          },
          {
            "name": "旺苍县",
            "latitude": 32.3672,
            "longitude": 106.3961
          },
          {
            "name": "青川县",
            "latitude": 32.5098,
            "longitude": 105.1794
          },
          {
            "name": "剑阁县",
            "latitude": 31.9168,
            "longitude": 105.4969
          },
          {
            "name": "苍溪县",
            "latitude": 31.9098,
            "longitude": 106.1068
          },
          {
            "name": "市区",
            "latitude": 32.2811,
            "longitude": 105.8185
          }
        ]
      },
      {
        "name": "遂宁市",
        "districts": [
          {
            "name": "船山区",
            "latitude": 30.5217,
            "longitude": 105.5963
          },
          {
            "name": "安居区",
            "latitude": 30.3664,
            "longitude": 105.4199
          },
          {
            "name": "蓬溪县",
            "latitude": 30.7749,
            "longitude": 105.7137
          },
          {
            "name": "大英县",
            "latitude": 30.5746,
            "longitude": 105.2504
          },
          {
            "name": "射洪市",
            "latitude": 30.9023,
            "longitude": 105.3818
          },
          {
            "name": "市区",
            "latitude": 30.628,
            "longitude": 105.4724
          }
        ]
      },
      {
        "name": "内江市",
        "districts": [
          {
            "name": "市中区",
            "latitude": 29.5384,
            "longitude": 104.9584
          },
          {
            "name": "东兴区",
            "latitude": 29.6551,
            "longitude": 105.1991
          },
          {
            "name": "威远县",
            "latitude": 29.5933,
            "longitude": 104.5872
          },
          {
            "name": "资中县",
            "latitude": 29.8077,
            "longitude": 104.801
          },
          {
            "name": "隆昌市",
            "latitude": 29.362,
            "longitude": 105.2466
          },
          {
            "name": "市区",
            "latitude": 29.5913,
            "longitude": 104.9585
          }
        ]
      },
      {
        "name": "乐山市",
        "districts": [
          {
            "name": "市中区",
            "latitude": 29.6068,
            "longitude": 103.7915
          },
          {
            "name": "沙湾区",
            "latitude": 29.3433,
            "longitude": 103.5874
          },
          {
            "name": "五通桥区",
            "latitude": 29.4097,
            "longitude": 103.8022
          },
          {
            "name": "金口河区",
            "latitude": 29.2855,
            "longitude": 103.0646
          },
          {
            "name": "犍为县",
            "latitude": 29.2264,
            "longitude": 103.9735
          },
          {
            "name": "井研县",
            "latitude": 29.6386,
            "longitude": 104.0486
          },
          {
            "name": "夹江县",
            "latitude": 29.7706,
            "longitude": 103.5541
          },
          {
            "name": "沐川县",
            "latitude": 29.0012,
            "longitude": 103.8181
          },
          {
            "name": "峨边彝族自治县",
            "latitude": 29.0451,
            "longitude": 103.2072
          },
          {
            "name": "马边彝族自治县",
            "latitude": 28.7821,
            "longitude": 103.4797
          },
          {
            "name": "峨眉山市",
            "latitude": 29.501,
            "longitude": 103.3935
          },
          {
            "name": "市区",
            "latitude": 29.3282,
            "longitude": 103.6109
          }
        ]
      },
      {
        "name": "南充市",
        "districts": [
          {
            "name": "顺庆区",
            "latitude": 30.9444,
            "longitude": 106.1009
          },
          {
            "name": "高坪区",
            "latitude": 30.7818,
            "longitude": 106.2502
          },
          {
            "name": "嘉陵区",
            "latitude": 30.6945,
            "longitude": 105.9399
          },
          {
            "name": "南部县",
            "latitude": 31.3461,
            "longitude": 105.902
          },
          {
            "name": "营山县",
            "latitude": 31.1561,
            "longitude": 106.7122
          },
          {
            "name": "蓬安县",
            "latitude": 30.9993,
            "longitude": 106.4232
          },
          {
            "name": "仪陇县",
            "latitude": 31.4299,
            "longitude": 106.5143
          },
          {
            "name": "西充县",
            "latitude": 31.0576,
            "longitude": 105.8504
          },
          {
            "name": "阆中市",
            "latitude": 31.5959,
            "longitude": 106.073
          },
          {
            "name": "市区",
            "latitude": 31.1117,
            "longitude": 106.1962
          }
        ]
      },
      {
        "name": "眉山市",
        "districts": [
          {
            "name": "东坡区",
            "latitude": 30.05,
            "longitude": 103.7422
          },
          {
            "name": "彭山区",
            "latitude": 30.2488,
            "longitude": 103.8592
          },
          {
            "name": "仁寿县",
            "latitude": 29.9797,
            "longitude": 104.2192
          },
          {
            "name": "洪雅县",
            "latitude": 29.6872,
            "longitude": 103.1721
          },
          {
            "name": "丹棱县",
            "latitude": 30.0078,
            "longitude": 103.4278
          },
          {
            "name": "青神县",
            "latitude": 29.8161,
            "longitude": 103.8318
          },
          {
            "name": "市区",
            "latitude": 29.9649,
            "longitude": 103.7087
          }
        ]
      },
      {
        "name": "宜宾市",
        "districts": [
          {
            "name": "翠屏区",
            "latitude": 28.9038,
            "longitude": 104.6606
          },
          {
            "name": "南溪区",
            "latitude": 28.8923,
            "longitude": 104.9389
          },
          {
            "name": "叙州区",
            "latitude": 28.6957,
            "longitude": 104.5415
          },
          {
            "name": "江安县",
            "latitude": 28.6594,
            "longitude": 105.1137
          },
          {
            "name": "长宁县",
            "latitude": 28.4953,
            "longitude": 104.9188
          },
          {
            "name": "高县",
            "latitude": 28.4569,
            "longitude": 104.5844
          },
          {
            "name": "珙县",
            "latitude": 28.191,
            "longitude": 104.8004
          },
          {
            "name": "筠连县",
            "latitude": 28.036,
            "longitude": 104.5821
          },
          {
            "name": "兴文县",
            "latitude": 28.2487,
            "longitude": 105.1351
          },
          {
            "name": "屏山县",
            "latitude": 28.7061,
            "longitude": 104.0167
          },
          {
            "name": "市区",
            "latitude": 28.5285,
            "longitude": 104.7292
          }
        ]
      },
      {
        "name": "广安市",
        "districts": [
          {
            "name": "广安区",
            "latitude": 30.6199,
            "longitude": 106.6972
          },
          {
            "name": "前锋区",
            "latitude": 30.5343,
            "longitude": 106.8671
          },
          {
            "name": "岳池县",
            "latitude": 30.5358,
            "longitude": 106.4137
          },
          {
            "name": "武胜县",
            "latitude": 30.3677,
            "longitude": 106.2241
          },
          {
            "name": "邻水县",
            "latitude": 30.2564,
            "longitude": 106.9947
          },
          {
            "name": "华蓥市",
            "latitude": 30.3161,
            "longitude": 106.7529
          },
          {
            "name": "市区",
            "latitude": 30.4384,
            "longitude": 106.6583
          }
        ]
      },
      {
        "name": "达州市",
        "districts": [
          {
            "name": "通川区",
            "latitude": 31.3594,
            "longitude": 107.438
          },
          {
            "name": "达川区",
            "latitude": 31.1098,
            "longitude": 107.4186
          },
          {
            "name": "宣汉县",
            "latitude": 31.5138,
            "longitude": 107.9291
          },
          {
            "name": "开江县",
            "latitude": 31.0456,
            "longitude": 107.8841
          },
          {
            "name": "大竹县",
            "latitude": 30.6852,
            "longitude": 107.2728
          },
          {
            "name": "渠县",
            "latitude": 30.9429,
            "longitude": 106.9815
          },
          {
            "name": "万源市",
            "latitude": 31.9806,
            "longitude": 107.9883
          },
          {
            "name": "市区",
            "latitude": 31.2339,
            "longitude": 107.5589
          }
        ]
      },
      {
        "name": "雅安市",
        "districts": [
          {
            "name": "雨城区",
            "latitude": 29.9216,
            "longitude": 103.0316
          },
          {
            "name": "名山区",
            "latitude": 30.1266,
            "longitude": 103.2207
          },
          {
            "name": "荥经县",
            "latitude": 29.7345,
            "longitude": 102.6856
          },
          {
            "name": "汉源县",
            "latitude": 29.4257,
            "longitude": 102.6174
          },
          {
            "name": "石棉县",
            "latitude": 29.2286,
            "longitude": 102.2866
          },
          {
            "name": "天全县",
            "latitude": 30.0715,
            "longitude": 102.5707
          },
          {
            "name": "芦山县",
            "latitude": 30.4153,
            "longitude": 103.0077
          },
          {
            "name": "宝兴县",
            "latitude": 30.5612,
            "longitude": 102.7108
          },
          {
            "name": "市区",
            "latitude": 29.9356,
            "longitude": 102.7664
          }
        ]
      },
      {
        "name": "巴中市",
        "districts": [
          {
            "name": "巴州区",
            "latitude": 31.8212,
            "longitude": 106.8656
          },
          {
            "name": "恩阳区",
            "latitude": 31.7293,
            "longitude": 106.5723
          },
          {
            "name": "通江县",
            "latitude": 32.1284,
            "longitude": 107.3464
          },
          {
            "name": "南江县",
            "latitude": 32.3326,
            "longitude": 106.8303
          },
          {
            "name": "平昌县",
            "latitude": 31.5915,
            "longitude": 107.1602
          },
          {
            "name": "市区",
            "latitude": 31.9206,
            "longitude": 106.955
          }
        ]
      },
      {
        "name": "资阳市",
        "districts": [
          {
            "name": "雁江区",
            "latitude": 30.0859,
            "longitude": 104.7488
          },
          {
            "name": "安岳县",
            "latitude": 29.9939,
            "longitude": 105.395
          },
          {
            "name": "乐至县",
            "latitude": 30.3082,
            "longitude": 105.0215
          },
          {
            "name": "市区",
            "latitude": 30.1293,
            "longitude": 105.0551
          }
        ]
      },
      {
        "name": "阿坝藏族羌族自治州",
        "districts": [
          {
            "name": "马尔康市",
            "latitude": 32.0134,
            "longitude": 102.0152
          },
          {
            "name": "汶川县",
            "latitude": 31.1628,
            "longitude": 103.2882
          },
          {
            "name": "理县",
            "latitude": 31.5731,
            "longitude": 103.0143
          },
          {
            "name": "茂县",
            "latitude": 31.8462,
            "longitude": 103.6319
          },
          {
            "name": "松潘县",
            "latitude": 32.6167,
            "longitude": 103.529
          },
          {
            "name": "九寨沟县",
            "latitude": 33.3119,
            "longitude": 103.9266
          },
          {
            "name": "金川县",
            "latitude": 31.5202,
            "longitude": 101.8037
          },
          {
            "name": "小金县",
            "latitude": 31.1291,
            "longitude": 102.4692
          },
          {
            "name": "黑水县",
            "latitude": 32.162,
            "longitude": 103.0513
          },
          {
            "name": "壤塘县",
            "latitude": 32.149,
            "longitude": 101.0503
          },
          {
            "name": "阿坝县",
            "latitude": 32.8793,
            "longitude": 101.7645
          },
          {
            "name": "若尔盖县",
            "latitude": 33.658,
            "longitude": 102.8876
          },
          {
            "name": "红原县",
            "latitude": 32.7243,
            "longitude": 102.6328
          },
          {
            "name": "市区",
            "latitude": 32.2112,
            "longitude": 102.6973
          }
        ]
      },
      {
        "name": "甘孜藏族自治州",
        "districts": [
          {
            "name": "康定市",
            "latitude": 29.9581,
            "longitude": 101.7475
          },
          {
            "name": "泸定县",
            "latitude": 29.7422,
            "longitude": 102.1128
          },
          {
            "name": "丹巴县",
            "latitude": 30.9449,
            "longitude": 101.7621
          },
          {
            "name": "九龙县",
            "latitude": 28.9127,
            "longitude": 101.6285
          },
          {
            "name": "雅江县",
            "latitude": 29.9131,
            "longitude": 100.9697
          },
          {
            "name": "道孚县",
            "latitude": 30.8831,
            "longitude": 101.1946
          },
          {
            "name": "炉霍县",
            "latitude": 31.483,
            "longitude": 100.6663
          },
          {
            "name": "甘孜县",
            "latitude": 32.0527,
            "longitude": 99.7694
          },
          {
            "name": "新龙县",
            "latitude": 30.9684,
            "longitude": 100.2473
          },
          {
            "name": "德格县",
            "latitude": 32.0589,
            "longitude": 98.9615
          },
          {
            "name": "白玉县",
            "latitude": 31.0399,
            "longitude": 99.2788
          },
          {
            "name": "石渠县",
            "latitude": 33.1936,
            "longitude": 98.1925
          },
          {
            "name": "色达县",
            "latitude": 32.3453,
            "longitude": 100.2109
          },
          {
            "name": "理塘县",
            "latitude": 29.8991,
            "longitude": 100.2228
          },
          {
            "name": "巴塘县",
            "latitude": 29.9025,
            "longitude": 99.3039
          },
          {
            "name": "乡城县",
            "latitude": 29.106,
            "longitude": 99.7352
          },
          {
            "name": "稻城县",
            "latitude": 28.8297,
            "longitude": 100.2248
          },
          {
            "name": "得荣县",
            "latitude": 28.7309,
            "longitude": 99.3197
          },
          {
            "name": "市区",
            "latitude": 30.5536,
            "longitude": 100.3082
          }
        ]
      },
      {
        "name": "凉山彝族自治州",
        "districts": [
          {
            "name": "西昌市",
            "latitude": 27.8585,
            "longitude": 102.1364
          },
          {
            "name": "木里藏族自治县",
            "latitude": 28.3551,
            "longitude": 100.9477
          },
          {
            "name": "盐源县",
            "latitude": 27.5984,
            "longitude": 101.4602
          },
          {
            "name": "德昌县",
            "latitude": 27.3245,
            "longitude": 102.1859
          },
          {
            "name": "会理县",
            "latitude": 27.8358,
            "longitude": 102.4933
          },
          {
            "name": "会东县",
            "latitude": 26.567,
            "longitude": 102.7352
          },
          {
            "name": "宁南县",
            "latitude": 27.0855,
            "longitude": 102.7089
          },
          {
            "name": "普格县",
            "latitude": 27.5427,
            "longitude": 102.5625
          },
          {
            "name": "布拖县",
            "latitude": 27.5944,
            "longitude": 102.8757
          },
          {
            "name": "金阳县",
            "latitude": 27.6988,
            "longitude": 103.1952
          },
          {
            "name": "昭觉县",
            "latitude": 28.016,
            "longitude": 102.8473
          },
          {
            "name": "喜德县",
            "latitude": 28.2004,
            "longitude": 102.4427
          },
          {
            "name": "冕宁县",
            "latitude": 28.5086,
            "longitude": 102.0625
          },
          {
            "name": "越西县",
            "latitude": 28.5846,
            "longitude": 102.6207
          },
          {
            "name": "甘洛县",
            "latitude": 28.9678,
            "longitude": 102.7588
          },
          {
            "name": "美姑县",
            "latitude": 28.4403,
            "longitude": 103.0945
          },
          {
            "name": "雷波县",
            "latitude": 28.2819,
            "longitude": 103.4974
          },
          {
            "name": "会理市",
            "latitude": 26.5842,
            "longitude": 102.2552
          },
          {
            "name": "市区",
            "latitude": 27.8358,
            "longitude": 102.4933
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
            "name": "开阳县",
            "latitude": 27.0702,
            "longitude": 107.0408
          },
          {
            "name": "息烽县",
            "latitude": 27.1461,
            "longitude": 106.6758
          },
          {
            "name": "修文县",
            "latitude": 26.9271,
            "longitude": 106.5847
          },
          {
            "name": "清镇市",
            "latitude": 26.6848,
            "longitude": 106.3357
          },
          {
            "name": "市区",
            "latitude": 26.7484,
            "longitude": 106.6885
          }
        ]
      },
      {
        "name": "六盘水市",
        "districts": [
          {
            "name": "钟山区",
            "latitude": 26.7129,
            "longitude": 104.9039
          },
          {
            "name": "六枝特区",
            "latitude": 26.231,
            "longitude": 105.3766
          },
          {
            "name": "水城区",
            "latitude": 26.3539,
            "longitude": 104.9215
          },
          {
            "name": "盘州市",
            "latitude": 25.7667,
            "longitude": 104.6608
          },
          {
            "name": "市区",
            "latitude": 26.2661,
            "longitude": 104.9657
          }
        ]
      },
      {
        "name": "遵义市",
        "districts": [
          {
            "name": "红花岗区",
            "latitude": 27.712,
            "longitude": 107.1033
          },
          {
            "name": "汇川区",
            "latitude": 27.8604,
            "longitude": 106.8226
          },
          {
            "name": "播州区",
            "latitude": 27.5074,
            "longitude": 106.8156
          },
          {
            "name": "桐梓县",
            "latitude": 28.4095,
            "longitude": 106.8803
          },
          {
            "name": "绥阳县",
            "latitude": 28.1386,
            "longitude": 107.1976
          },
          {
            "name": "正安县",
            "latitude": 28.5009,
            "longitude": 107.4049
          },
          {
            "name": "道真仡佬族苗族自治县",
            "latitude": 28.9278,
            "longitude": 107.6102
          },
          {
            "name": "务川仡佬族苗族自治县",
            "latitude": 28.6562,
            "longitude": 107.9136
          },
          {
            "name": "凤冈县",
            "latitude": 27.9243,
            "longitude": 107.7646
          },
          {
            "name": "湄潭县",
            "latitude": 27.756,
            "longitude": 107.4841
          },
          {
            "name": "余庆县",
            "latitude": 27.3892,
            "longitude": 107.7016
          },
          {
            "name": "习水县",
            "latitude": 28.3499,
            "longitude": 106.3512
          },
          {
            "name": "赤水市",
            "latitude": 28.4877,
            "longitude": 105.9167
          },
          {
            "name": "仁怀市",
            "latitude": 27.8342,
            "longitude": 106.3416
          },
          {
            "name": "市区",
            "latitude": 28.1039,
            "longitude": 107.0934
          }
        ]
      },
      {
        "name": "安顺市",
        "districts": [
          {
            "name": "西秀区",
            "latitude": 26.1905,
            "longitude": 106.0476
          },
          {
            "name": "平坝区",
            "latitude": 26.4035,
            "longitude": 106.2855
          },
          {
            "name": "普定县",
            "latitude": 26.3397,
            "longitude": 105.7347
          },
          {
            "name": "镇宁布依族苗族自治县",
            "latitude": 25.8384,
            "longitude": 105.8271
          },
          {
            "name": "关岭布依族苗族自治县",
            "latitude": 25.8578,
            "longitude": 105.5598
          },
          {
            "name": "紫云苗族布依族自治县",
            "latitude": 25.6954,
            "longitude": 106.1829
          },
          {
            "name": "市区",
            "latitude": 26.0542,
            "longitude": 105.9396
          }
        ]
      },
      {
        "name": "毕节市",
        "districts": [
          {
            "name": "七星关区",
            "latitude": 27.4026,
            "longitude": 105.3268
          },
          {
            "name": "大方县",
            "latitude": 27.2247,
            "longitude": 105.6875
          },
          {
            "name": "黔西县",
            "latitude": 27.0749,
            "longitude": 105.403
          },
          {
            "name": "金沙县",
            "latitude": 27.4441,
            "longitude": 106.2684
          },
          {
            "name": "织金县",
            "latitude": 26.6428,
            "longitude": 105.7858
          },
          {
            "name": "纳雍县",
            "latitude": 26.8029,
            "longitude": 105.2778
          },
          {
            "name": "威宁彝族回族苗族自治县",
            "latitude": 26.9062,
            "longitude": 104.1311
          },
          {
            "name": "赫章县",
            "latitude": 27.1304,
            "longitude": 104.6314
          },
          {
            "name": "黔西市",
            "latitude": 27.0455,
            "longitude": 106.1149
          },
          {
            "name": "市区",
            "latitude": 27.0749,
            "longitude": 105.403
          }
        ]
      },
      {
        "name": "铜仁市",
        "districts": [
          {
            "name": "碧江区",
            "latitude": 27.7162,
            "longitude": 109.209
          },
          {
            "name": "万山区",
            "latitude": 27.5469,
            "longitude": 109.1428
          },
          {
            "name": "江口县",
            "latitude": 27.7214,
            "longitude": 108.7694
          },
          {
            "name": "玉屏侗族自治县",
            "latitude": 27.3278,
            "longitude": 108.9825
          },
          {
            "name": "石阡县",
            "latitude": 27.4858,
            "longitude": 108.1619
          },
          {
            "name": "思南县",
            "latitude": 27.8441,
            "longitude": 108.1435
          },
          {
            "name": "印江土家族苗族自治县",
            "latitude": 27.992,
            "longitude": 108.5254
          },
          {
            "name": "德江县",
            "latitude": 28.2591,
            "longitude": 108.0892
          },
          {
            "name": "沿河土家族自治县",
            "latitude": 28.6197,
            "longitude": 108.338
          },
          {
            "name": "松桃苗族自治县",
            "latitude": 28.1222,
            "longitude": 109.036
          },
          {
            "name": "市区",
            "latitude": 27.8635,
            "longitude": 108.6398
          }
        ]
      },
      {
        "name": "黔西南布依族苗族自治州",
        "districts": [
          {
            "name": "兴义市",
            "latitude": 24.9966,
            "longitude": 104.8513
          },
          {
            "name": "兴仁市",
            "latitude": 25.4956,
            "longitude": 105.272
          },
          {
            "name": "普安县",
            "latitude": 25.7217,
            "longitude": 104.9936
          },
          {
            "name": "晴隆县",
            "latitude": 25.8352,
            "longitude": 105.2019
          },
          {
            "name": "贞丰县",
            "latitude": 25.417,
            "longitude": 105.6869
          },
          {
            "name": "望谟县",
            "latitude": 25.2272,
            "longitude": 106.1661
          },
          {
            "name": "册亨县",
            "latitude": 24.9181,
            "longitude": 105.8313
          },
          {
            "name": "安龙县",
            "latitude": 25.1352,
            "longitude": 105.3731
          },
          {
            "name": "市区",
            "latitude": 25.3433,
            "longitude": 105.422
          }
        ]
      },
      {
        "name": "黔东南苗族侗族自治州",
        "districts": [
          {
            "name": "凯里市",
            "latitude": 26.6091,
            "longitude": 107.9069
          },
          {
            "name": "黄平县",
            "latitude": 26.9472,
            "longitude": 107.8618
          },
          {
            "name": "施秉县",
            "latitude": 27.0638,
            "longitude": 108.1495
          },
          {
            "name": "三穗县",
            "latitude": 26.9344,
            "longitude": 108.7557
          },
          {
            "name": "镇远县",
            "latitude": 27.1156,
            "longitude": 108.4678
          },
          {
            "name": "岑巩县",
            "latitude": 27.3584,
            "longitude": 108.6982
          },
          {
            "name": "天柱县",
            "latitude": 26.9214,
            "longitude": 109.2469
          },
          {
            "name": "锦屏县",
            "latitude": 26.5593,
            "longitude": 109.1264
          },
          {
            "name": "剑河县",
            "latitude": 26.6506,
            "longitude": 108.6682
          },
          {
            "name": "台江县",
            "latitude": 26.639,
            "longitude": 108.3026
          },
          {
            "name": "黎平县",
            "latitude": 26.151,
            "longitude": 109.0665
          },
          {
            "name": "榕江县",
            "latitude": 26.0309,
            "longitude": 108.4124
          },
          {
            "name": "从江县",
            "latitude": 25.7133,
            "longitude": 108.723
          },
          {
            "name": "雷山县",
            "latitude": 26.3391,
            "longitude": 108.1458
          },
          {
            "name": "麻江县",
            "latitude": 26.4446,
            "longitude": 107.5777
          },
          {
            "name": "丹寨县",
            "latitude": 26.2246,
            "longitude": 107.9251
          },
          {
            "name": "市区",
            "latitude": 26.6064,
            "longitude": 108.4397
          }
        ]
      },
      {
        "name": "黔南布依族苗族自治州",
        "districts": [
          {
            "name": "都匀市",
            "latitude": 26.146,
            "longitude": 107.4714
          },
          {
            "name": "福泉市",
            "latitude": 26.7716,
            "longitude": 107.4859
          },
          {
            "name": "荔波县",
            "latitude": 25.3951,
            "longitude": 107.9231
          },
          {
            "name": "贵定县",
            "latitude": 26.4269,
            "longitude": 107.1986
          },
          {
            "name": "瓮安县",
            "latitude": 27.1665,
            "longitude": 107.415
          },
          {
            "name": "独山县",
            "latitude": 25.6302,
            "longitude": 107.5576
          },
          {
            "name": "平塘县",
            "latitude": 25.784,
            "longitude": 107.1072
          },
          {
            "name": "罗甸县",
            "latitude": 25.4132,
            "longitude": 106.7039
          },
          {
            "name": "长顺县",
            "latitude": 25.9949,
            "longitude": 106.3982
          },
          {
            "name": "龙里县",
            "latitude": 26.5007,
            "longitude": 106.9901
          },
          {
            "name": "惠水县",
            "latitude": 25.9775,
            "longitude": 106.717
          },
          {
            "name": "三都水族自治县",
            "latitude": 25.8464,
            "longitude": 107.95
          },
          {
            "name": "市区",
            "latitude": 26.0878,
            "longitude": 107.2432
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
            "name": "晋宁区",
            "latitude": 24.6074,
            "longitude": 102.5773
          },
          {
            "name": "富民县",
            "latitude": 25.3607,
            "longitude": 102.5615
          },
          {
            "name": "宜良县",
            "latitude": 24.9413,
            "longitude": 103.1927
          },
          {
            "name": "石林彝族自治县",
            "latitude": 24.7409,
            "longitude": 103.4186
          },
          {
            "name": "嵩明县",
            "latitude": 25.2952,
            "longitude": 103.0966
          },
          {
            "name": "禄劝彝族苗族自治县",
            "latitude": 25.9378,
            "longitude": 102.5866
          },
          {
            "name": "寻甸回族彝族自治县",
            "latitude": 25.6606,
            "longitude": 103.1214
          },
          {
            "name": "安宁市",
            "latitude": 24.8448,
            "longitude": 102.3845
          },
          {
            "name": "市区",
            "latitude": 25.2037,
            "longitude": 102.8433
          }
        ]
      },
      {
        "name": "曲靖市",
        "districts": [
          {
            "name": "麒麟区",
            "latitude": 25.3568,
            "longitude": 103.9075
          },
          {
            "name": "沾益区",
            "latitude": 25.7819,
            "longitude": 103.8388
          },
          {
            "name": "马龙区",
            "latitude": 25.3634,
            "longitude": 103.5071
          },
          {
            "name": "陆良县",
            "latitude": 25.033,
            "longitude": 103.7024
          },
          {
            "name": "师宗县",
            "latitude": 24.6735,
            "longitude": 104.1225
          },
          {
            "name": "罗平县",
            "latitude": 24.9775,
            "longitude": 104.3421
          },
          {
            "name": "富源县",
            "latitude": 25.4613,
            "longitude": 104.3611
          },
          {
            "name": "会泽县",
            "latitude": 26.4559,
            "longitude": 103.4622
          },
          {
            "name": "宣威市",
            "latitude": 26.2698,
            "longitude": 104.1455
          },
          {
            "name": "市区",
            "latitude": 25.4859,
            "longitude": 103.9321
          }
        ]
      },
      {
        "name": "玉溪市",
        "districts": [
          {
            "name": "红塔区",
            "latitude": 24.3637,
            "longitude": 102.4932
          },
          {
            "name": "江川区",
            "latitude": 24.3514,
            "longitude": 102.7628
          },
          {
            "name": "通海县",
            "latitude": 24.1107,
            "longitude": 102.7045
          },
          {
            "name": "华宁县",
            "latitude": 24.2782,
            "longitude": 102.9921
          },
          {
            "name": "易门县",
            "latitude": 24.6894,
            "longitude": 102.1152
          },
          {
            "name": "峨山彝族自治县",
            "latitude": 24.2401,
            "longitude": 102.2133
          },
          {
            "name": "新平彝族傣族自治县",
            "latitude": 24.0231,
            "longitude": 101.7329
          },
          {
            "name": "元江哈尼族彝族傣族自治县",
            "latitude": 23.5787,
            "longitude": 102.0111
          },
          {
            "name": "澄江市",
            "latitude": 24.6704,
            "longitude": 102.9393
          },
          {
            "name": "市区",
            "latitude": 24.2562,
            "longitude": 102.4405
          }
        ]
      },
      {
        "name": "保山市",
        "districts": [
          {
            "name": "隆阳区",
            "latitude": 25.2,
            "longitude": 99.0645
          },
          {
            "name": "施甸县",
            "latitude": 24.6527,
            "longitude": 99.153
          },
          {
            "name": "龙陵县",
            "latitude": 24.4931,
            "longitude": 98.8379
          },
          {
            "name": "昌宁县",
            "latitude": 24.7527,
            "longitude": 99.5864
          },
          {
            "name": "腾冲市",
            "latitude": 25.2727,
            "longitude": 98.4954
          },
          {
            "name": "市区",
            "latitude": 24.8742,
            "longitude": 99.0274
          }
        ]
      },
      {
        "name": "昭通市",
        "districts": [
          {
            "name": "昭阳区",
            "latitude": 27.4241,
            "longitude": 103.6105
          },
          {
            "name": "鲁甸县",
            "latitude": 27.2072,
            "longitude": 103.4204
          },
          {
            "name": "巧家县",
            "latitude": 27.0022,
            "longitude": 103.1231
          },
          {
            "name": "盐津县",
            "latitude": 28.1246,
            "longitude": 104.2238
          },
          {
            "name": "大关县",
            "latitude": 27.8988,
            "longitude": 103.9055
          },
          {
            "name": "永善县",
            "latitude": 27.95,
            "longitude": 103.6476
          },
          {
            "name": "绥江县",
            "latitude": 28.5329,
            "longitude": 104.0078
          },
          {
            "name": "镇雄县",
            "latitude": 27.5632,
            "longitude": 104.8274
          },
          {
            "name": "彝良县",
            "latitude": 27.6253,
            "longitude": 104.2349
          },
          {
            "name": "威信县",
            "latitude": 27.8856,
            "longitude": 105.0438
          },
          {
            "name": "水富市",
            "latitude": 28.505,
            "longitude": 104.2213
          },
          {
            "name": "市区",
            "latitude": 27.7926,
            "longitude": 104.0242
          }
        ]
      },
      {
        "name": "丽江市",
        "districts": [
          {
            "name": "古城区",
            "latitude": 26.8646,
            "longitude": 100.3242
          },
          {
            "name": "玉龙纳西族自治县",
            "latitude": 26.8306,
            "longitude": 100.2383
          },
          {
            "name": "永胜县",
            "latitude": 26.4855,
            "longitude": 100.6988
          },
          {
            "name": "华坪县",
            "latitude": 26.6405,
            "longitude": 101.244
          },
          {
            "name": "宁蒗彝族自治县",
            "latitude": 27.2607,
            "longitude": 100.771
          },
          {
            "name": "市区",
            "latitude": 26.8164,
            "longitude": 100.6553
          }
        ]
      },
      {
        "name": "普洱市",
        "districts": [
          {
            "name": "思茅区",
            "latitude": 22.7329,
            "longitude": 100.8485
          },
          {
            "name": "宁洱哈尼族彝族自治县",
            "latitude": 23.0943,
            "longitude": 101.1893
          },
          {
            "name": "墨江哈尼族自治县",
            "latitude": 23.3575,
            "longitude": 101.5496
          },
          {
            "name": "景东彝族自治县",
            "latitude": 24.3922,
            "longitude": 100.7913
          },
          {
            "name": "景谷傣族彝族自治县",
            "latitude": 23.3636,
            "longitude": 100.558
          },
          {
            "name": "镇沅彝族哈尼族拉祜族自治县",
            "latitude": 23.9426,
            "longitude": 100.9755
          },
          {
            "name": "江城哈尼族彝族自治县",
            "latitude": 22.6205,
            "longitude": 101.7875
          },
          {
            "name": "孟连傣族拉祜族佤族自治县",
            "latitude": 22.2888,
            "longitude": 99.4704
          },
          {
            "name": "澜沧拉祜族自治县",
            "latitude": 22.6623,
            "longitude": 99.9758
          },
          {
            "name": "西盟佤族自治县",
            "latitude": 22.694,
            "longitude": 99.5107
          },
          {
            "name": "市区",
            "latitude": 23.1149,
            "longitude": 100.6657
          }
        ]
      },
      {
        "name": "临沧市",
        "districts": [
          {
            "name": "临翔区",
            "latitude": 23.8426,
            "longitude": 100.1329
          },
          {
            "name": "凤庆县",
            "latitude": 24.6045,
            "longitude": 99.9153
          },
          {
            "name": "云县",
            "latitude": 24.3202,
            "longitude": 100.2281
          },
          {
            "name": "永德县",
            "latitude": 24.0837,
            "longitude": 99.4202
          },
          {
            "name": "镇康县",
            "latitude": 23.8964,
            "longitude": 98.9973
          },
          {
            "name": "双江拉祜族佤族布朗族傣族自治县",
            "latitude": 23.4655,
            "longitude": 99.8767
          },
          {
            "name": "耿马傣族佤族自治县",
            "latitude": 23.6382,
            "longitude": 99.4249
          },
          {
            "name": "沧源佤族自治县",
            "latitude": 23.2698,
            "longitude": 99.2635
          },
          {
            "name": "市区",
            "latitude": 23.8901,
            "longitude": 99.6574
          }
        ]
      },
      {
        "name": "楚雄彝族自治州",
        "districts": [
          {
            "name": "楚雄市",
            "latitude": 24.8742,
            "longitude": 101.3219
          },
          {
            "name": "双柏县",
            "latitude": 24.5299,
            "longitude": 101.6349
          },
          {
            "name": "牟定县",
            "latitude": 25.4015,
            "longitude": 101.5901
          },
          {
            "name": "南华县",
            "latitude": 25.0978,
            "longitude": 101.0309
          },
          {
            "name": "姚安县",
            "latitude": 25.5114,
            "longitude": 101.204
          },
          {
            "name": "大姚县",
            "latitude": 25.9416,
            "longitude": 101.2368
          },
          {
            "name": "永仁县",
            "latitude": 26.1384,
            "longitude": 101.5543
          },
          {
            "name": "元谋县",
            "latitude": 25.7762,
            "longitude": 101.864
          },
          {
            "name": "武定县",
            "latitude": 25.7249,
            "longitude": 102.1948
          },
          {
            "name": "禄丰县",
            "latitude": 25.4175,
            "longitude": 101.5651
          },
          {
            "name": "禄丰市",
            "latitude": 25.1794,
            "longitude": 102.0193
          },
          {
            "name": "市区",
            "latitude": 25.4175,
            "longitude": 101.5651
          }
        ]
      },
      {
        "name": "红河哈尼族彝族自治州",
        "districts": [
          {
            "name": "个旧市",
            "latitude": 23.3193,
            "longitude": 103.129
          },
          {
            "name": "开远市",
            "latitude": 23.723,
            "longitude": 103.3937
          },
          {
            "name": "蒙自市",
            "latitude": 23.3318,
            "longitude": 103.4868
          },
          {
            "name": "弥勒市",
            "latitude": 24.2193,
            "longitude": 103.3835
          },
          {
            "name": "屏边苗族自治县",
            "latitude": 23.0972,
            "longitude": 103.7422
          },
          {
            "name": "建水县",
            "latitude": 23.6772,
            "longitude": 102.883
          },
          {
            "name": "石屏县",
            "latitude": 23.7397,
            "longitude": 102.4465
          },
          {
            "name": "泸西县",
            "latitude": 24.5121,
            "longitude": 103.7762
          },
          {
            "name": "元阳县",
            "latitude": 23.0632,
            "longitude": 102.8124
          },
          {
            "name": "红河县",
            "latitude": 23.2443,
            "longitude": 102.235
          },
          {
            "name": "金平苗族瑶族傣族自治县",
            "latitude": 22.7763,
            "longitude": 103.0957
          },
          {
            "name": "绿春县",
            "latitude": 22.8734,
            "longitude": 102.2389
          },
          {
            "name": "河口瑶族自治县",
            "latitude": 22.7823,
            "longitude": 103.8159
          },
          {
            "name": "市区",
            "latitude": 23.4122,
            "longitude": 103.1107
          }
        ]
      },
      {
        "name": "文山壮族苗族自治州",
        "districts": [
          {
            "name": "文山市",
            "latitude": 23.3947,
            "longitude": 104.0838
          },
          {
            "name": "砚山县",
            "latitude": 23.6818,
            "longitude": 104.2452
          },
          {
            "name": "西畴县",
            "latitude": 23.3581,
            "longitude": 104.6807
          },
          {
            "name": "麻栗坡县",
            "latitude": 23.2204,
            "longitude": 104.8966
          },
          {
            "name": "马关县",
            "latitude": 22.9503,
            "longitude": 104.263
          },
          {
            "name": "丘北县",
            "latitude": 24.1214,
            "longitude": 104.1037
          },
          {
            "name": "广南县",
            "latitude": 23.963,
            "longitude": 104.999
          },
          {
            "name": "富宁县",
            "latitude": 23.7047,
            "longitude": 105.7442
          },
          {
            "name": "市区",
            "latitude": 23.5493,
            "longitude": 104.627
          }
        ]
      },
      {
        "name": "西双版纳傣族自治州",
        "districts": [
          {
            "name": "景洪市",
            "latitude": 22.1061,
            "longitude": 100.9192
          },
          {
            "name": "勐海县",
            "latitude": 21.9543,
            "longitude": 100.3305
          },
          {
            "name": "勐腊县",
            "latitude": 21.7328,
            "longitude": 101.4527
          },
          {
            "name": "市区",
            "latitude": 21.9311,
            "longitude": 100.9008
          }
        ]
      },
      {
        "name": "大理白族自治州",
        "districts": [
          {
            "name": "大理市",
            "latitude": 25.7427,
            "longitude": 100.2107
          },
          {
            "name": "漾濞彝族自治县",
            "latitude": 25.5996,
            "longitude": 99.8918
          },
          {
            "name": "祥云县",
            "latitude": 25.511,
            "longitude": 100.7705
          },
          {
            "name": "宾川县",
            "latitude": 25.8705,
            "longitude": 100.6207
          },
          {
            "name": "弥渡县",
            "latitude": 25.1858,
            "longitude": 100.5739
          },
          {
            "name": "南涧彝族自治县",
            "latitude": 24.8969,
            "longitude": 100.4176
          },
          {
            "name": "巍山彝族回族自治县",
            "latitude": 25.2414,
            "longitude": 100.1719
          },
          {
            "name": "永平县",
            "latitude": 25.3683,
            "longitude": 99.5946
          },
          {
            "name": "云龙县",
            "latitude": 25.8889,
            "longitude": 99.3067
          },
          {
            "name": "洱源县",
            "latitude": 26.081,
            "longitude": 99.8654
          },
          {
            "name": "剑川县",
            "latitude": 26.4329,
            "longitude": 99.7439
          },
          {
            "name": "鹤庆县",
            "latitude": 26.3315,
            "longitude": 100.2712
          },
          {
            "name": "市区",
            "latitude": 25.6792,
            "longitude": 100.1199
          }
        ]
      },
      {
        "name": "德宏傣族景颇族自治州",
        "districts": [
          {
            "name": "瑞丽市",
            "latitude": 24.0318,
            "longitude": 97.8046
          },
          {
            "name": "芒市",
            "latitude": 24.3234,
            "longitude": 98.4208
          },
          {
            "name": "梁河县",
            "latitude": 24.738,
            "longitude": 98.3162
          },
          {
            "name": "盈江县",
            "latitude": 24.8563,
            "longitude": 97.9155
          },
          {
            "name": "陇川县",
            "latitude": 24.3763,
            "longitude": 97.9604
          },
          {
            "name": "市区",
            "latitude": 24.4652,
            "longitude": 98.0835
          }
        ]
      },
      {
        "name": "怒江傈僳族自治州",
        "districts": [
          {
            "name": "泸水市",
            "latitude": 26.0596,
            "longitude": 98.856
          },
          {
            "name": "福贡县",
            "latitude": 26.9895,
            "longitude": 98.8622
          },
          {
            "name": "贡山独龙族怒族自治县",
            "latitude": 27.8852,
            "longitude": 98.5021
          },
          {
            "name": "兰坪白族普米族自治县",
            "latitude": 26.6264,
            "longitude": 99.2583
          },
          {
            "name": "市区",
            "latitude": 26.8902,
            "longitude": 98.8697
          }
        ]
      },
      {
        "name": "迪庆藏族自治州",
        "districts": [
          {
            "name": "香格里拉市",
            "latitude": 27.9023,
            "longitude": 99.8224
          },
          {
            "name": "德钦县",
            "latitude": 28.3507,
            "longitude": 99.0235
          },
          {
            "name": "维西傈僳族自治县",
            "latitude": 27.4424,
            "longitude": 99.1467
          },
          {
            "name": "市区",
            "latitude": 27.8985,
            "longitude": 99.3309
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
            "name": "林周县",
            "latitude": 30.1124,
            "longitude": 91.3436
          },
          {
            "name": "当雄县",
            "latitude": 30.4188,
            "longitude": 90.8833
          },
          {
            "name": "尼木县",
            "latitude": 29.5965,
            "longitude": 90.0878
          },
          {
            "name": "曲水县",
            "latitude": 29.4386,
            "longitude": 90.7054
          },
          {
            "name": "墨竹工卡县",
            "latitude": 29.9101,
            "longitude": 92.0269
          },
          {
            "name": "市区",
            "latitude": 29.835,
            "longitude": 91.0582
          }
        ]
      },
      {
        "name": "日喀则市",
        "districts": [
          {
            "name": "桑珠孜区",
            "latitude": 29.2616,
            "longitude": 88.9512
          },
          {
            "name": "南木林县",
            "latitude": 29.8095,
            "longitude": 89.3747
          },
          {
            "name": "江孜县",
            "latitude": 28.9039,
            "longitude": 89.6634
          },
          {
            "name": "定日县",
            "latitude": 28.4714,
            "longitude": 86.9931
          },
          {
            "name": "萨迦县",
            "latitude": 28.8472,
            "longitude": 88.3422
          },
          {
            "name": "拉孜县",
            "latitude": 29.1722,
            "longitude": 87.8515
          },
          {
            "name": "昂仁县",
            "latitude": 29.9148,
            "longitude": 86.6478
          },
          {
            "name": "谢通门县",
            "latitude": 29.9092,
            "longitude": 88.0754
          },
          {
            "name": "白朗县",
            "latitude": 28.811,
            "longitude": 89.0981
          },
          {
            "name": "仁布县",
            "latitude": 29.2176,
            "longitude": 89.9694
          },
          {
            "name": "康马县",
            "latitude": 28.4371,
            "longitude": 89.6468
          },
          {
            "name": "定结县",
            "latitude": 28.2305,
            "longitude": 87.9073
          },
          {
            "name": "仲巴县",
            "latitude": 30.4787,
            "longitude": 83.6563
          },
          {
            "name": "亚东县",
            "latitude": 27.8081,
            "longitude": 89.0734
          },
          {
            "name": "吉隆县",
            "latitude": 28.8618,
            "longitude": 85.2992
          },
          {
            "name": "聂拉木县",
            "latitude": 28.593,
            "longitude": 86.0602
          },
          {
            "name": "萨嘎县",
            "latitude": 29.3977,
            "longitude": 85.0762
          },
          {
            "name": "岗巴县",
            "latitude": 28.309,
            "longitude": 88.566
          },
          {
            "name": "市区",
            "latitude": 29.0241,
            "longitude": 87.7918
          }
        ]
      },
      {
        "name": "昌都市",
        "districts": [
          {
            "name": "卡若区",
            "latitude": 31.4426,
            "longitude": 97.238
          },
          {
            "name": "江达县",
            "latitude": 31.8036,
            "longitude": 98.0356
          },
          {
            "name": "贡觉县",
            "latitude": 30.7414,
            "longitude": 98.4887
          },
          {
            "name": "类乌齐县",
            "latitude": 31.4278,
            "longitude": 96.4031
          },
          {
            "name": "丁青县",
            "latitude": 31.666,
            "longitude": 95.3158
          },
          {
            "name": "察雅县",
            "latitude": 30.5811,
            "longitude": 97.8405
          },
          {
            "name": "八宿县",
            "latitude": 30.1581,
            "longitude": 96.8769
          },
          {
            "name": "左贡县",
            "latitude": 29.558,
            "longitude": 97.8012
          },
          {
            "name": "芒康县",
            "latitude": 29.6146,
            "longitude": 98.6153
          },
          {
            "name": "洛隆县",
            "latitude": 30.7316,
            "longitude": 95.9076
          },
          {
            "name": "边坝县",
            "latitude": 30.8853,
            "longitude": 94.5948
          },
          {
            "name": "市区",
            "latitude": 30.7827,
            "longitude": 97.0107
          }
        ]
      },
      {
        "name": "林芝市",
        "districts": [
          {
            "name": "巴宜区",
            "latitude": 29.7765,
            "longitude": 94.3754
          },
          {
            "name": "工布江达县",
            "latitude": 30.0184,
            "longitude": 93.2364
          },
          {
            "name": "米林县",
            "latitude": 29.2421,
            "longitude": 94.0102
          },
          {
            "name": "墨脱县",
            "latitude": 28.7232,
            "longitude": 95.0032
          },
          {
            "name": "波密县",
            "latitude": 30.1191,
            "longitude": 95.5493
          },
          {
            "name": "察隅县",
            "latitude": 28.6778,
            "longitude": 97.0574
          },
          {
            "name": "朗县",
            "latitude": 28.9566,
            "longitude": 93.1012
          },
          {
            "name": "市区",
            "latitude": 29.3591,
            "longitude": 94.619
          }
        ]
      },
      {
        "name": "山南市",
        "districts": [
          {
            "name": "乃东区",
            "latitude": 29.2113,
            "longitude": 91.821
          },
          {
            "name": "扎囊县",
            "latitude": 29.2732,
            "longitude": 91.3978
          },
          {
            "name": "贡嘎县",
            "latitude": 29.2078,
            "longitude": 90.9351
          },
          {
            "name": "桑日县",
            "latitude": 29.3999,
            "longitude": 92.2235
          },
          {
            "name": "琼结县",
            "latitude": 29.0046,
            "longitude": 91.6067
          },
          {
            "name": "曲松县",
            "latitude": 28.9452,
            "longitude": 92.2016
          },
          {
            "name": "措美县",
            "latitude": 28.5688,
            "longitude": 91.5099
          },
          {
            "name": "洛扎县",
            "latitude": 28.2103,
            "longitude": 90.8645
          },
          {
            "name": "加查县",
            "latitude": 29.2855,
            "longitude": 92.7133
          },
          {
            "name": "隆子县",
            "latitude": 28.4794,
            "longitude": 92.9093
          },
          {
            "name": "错那县",
            "latitude": 27.6687,
            "longitude": 92.8946
          },
          {
            "name": "浪卡子县",
            "latitude": 28.7546,
            "longitude": 90.6293
          },
          {
            "name": "市区",
            "latitude": 28.8341,
            "longitude": 91.8089
          }
        ]
      },
      {
        "name": "那曲市",
        "districts": [
          {
            "name": "色尼区",
            "latitude": 31.2468,
            "longitude": 92.0279
          },
          {
            "name": "嘉黎县",
            "latitude": 30.663,
            "longitude": 92.9579
          },
          {
            "name": "比如县",
            "latitude": 31.4412,
            "longitude": 93.488
          },
          {
            "name": "聂荣县",
            "latitude": 32.2441,
            "longitude": 92.6362
          },
          {
            "name": "安多县",
            "latitude": 32.2603,
            "longitude": 91.6819
          },
          {
            "name": "申扎县",
            "latitude": 31.0295,
            "longitude": 88.726
          },
          {
            "name": "索县",
            "latitude": 31.5838,
            "longitude": 94.3123
          },
          {
            "name": "班戈县",
            "latitude": 31.214,
            "longitude": 90.1157
          },
          {
            "name": "巴青县",
            "latitude": 32.1928,
            "longitude": 94.0292
          },
          {
            "name": "尼玛县",
            "latitude": 32.5039,
            "longitude": 86.6185
          },
          {
            "name": "双湖县",
            "latitude": 34.1054,
            "longitude": 88.2328
          },
          {
            "name": "市区",
            "latitude": 31.8623,
            "longitude": 91.3479
          }
        ]
      },
      {
        "name": "阿里地区",
        "districts": [
          {
            "name": "普兰县",
            "latitude": 30.6326,
            "longitude": 81.5239
          },
          {
            "name": "札达县",
            "latitude": 31.548,
            "longitude": 79.5466
          },
          {
            "name": "噶尔县",
            "latitude": 31.9998,
            "longitude": 80.3098
          },
          {
            "name": "日土县",
            "latitude": 33.9779,
            "longitude": 80.712
          },
          {
            "name": "革吉县",
            "latitude": 32.039,
            "longitude": 82.0564
          },
          {
            "name": "改则县",
            "latitude": 33.8343,
            "longitude": 84.2777
          },
          {
            "name": "措勤县",
            "latitude": 30.7432,
            "longitude": 85.2034
          },
          {
            "name": "市区",
            "latitude": 32.1107,
            "longitude": 81.9471
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
            "name": "蓝田县",
            "latitude": 34.0948,
            "longitude": 109.4169
          },
          {
            "name": "周至县",
            "latitude": 33.9496,
            "longitude": 108.114
          },
          {
            "name": "市区",
            "latitude": 34.2576,
            "longitude": 108.9615
          }
        ]
      },
      {
        "name": "铜川市",
        "districts": [
          {
            "name": "王益区",
            "latitude": 35.0499,
            "longitude": 109.0667
          },
          {
            "name": "印台区",
            "latitude": 35.1119,
            "longitude": 109.1008
          },
          {
            "name": "耀州区",
            "latitude": 35.0525,
            "longitude": 108.8359
          },
          {
            "name": "宜君县",
            "latitude": 35.3789,
            "longitude": 109.198
          },
          {
            "name": "市区",
            "latitude": 35.1483,
            "longitude": 109.0503
          }
        ]
      },
      {
        "name": "宝鸡市",
        "districts": [
          {
            "name": "渭滨区",
            "latitude": 34.2822,
            "longitude": 107.1116
          },
          {
            "name": "金台区",
            "latitude": 34.4345,
            "longitude": 107.0901
          },
          {
            "name": "陈仓区",
            "latitude": 34.3527,
            "longitude": 107.3836
          },
          {
            "name": "凤翔县",
            "latitude": 34.4114,
            "longitude": 107.3548
          },
          {
            "name": "岐山县",
            "latitude": 34.4057,
            "longitude": 107.6837
          },
          {
            "name": "扶风县",
            "latitude": 34.4127,
            "longitude": 107.9147
          },
          {
            "name": "眉县",
            "latitude": 34.1449,
            "longitude": 107.8261
          },
          {
            "name": "陇县",
            "latitude": 34.8708,
            "longitude": 106.7686
          },
          {
            "name": "千阳县",
            "latitude": 34.7608,
            "longitude": 107.1719
          },
          {
            "name": "麟游县",
            "latitude": 34.7795,
            "longitude": 107.7038
          },
          {
            "name": "凤县",
            "latitude": 33.9878,
            "longitude": 106.7596
          },
          {
            "name": "太白县",
            "latitude": 33.9336,
            "longitude": 107.4146
          },
          {
            "name": "凤翔区",
            "latitude": 34.5711,
            "longitude": 107.4298
          },
          {
            "name": "市区",
            "latitude": 34.4114,
            "longitude": 107.3548
          }
        ]
      },
      {
        "name": "咸阳市",
        "districts": [
          {
            "name": "秦都区",
            "latitude": 34.3553,
            "longitude": 108.6694
          },
          {
            "name": "杨陵区",
            "latitude": 34.2749,
            "longitude": 108.0443
          },
          {
            "name": "渭城区",
            "latitude": 34.4181,
            "longitude": 108.795
          },
          {
            "name": "三原县",
            "latitude": 34.6972,
            "longitude": 108.9737
          },
          {
            "name": "泾阳县",
            "latitude": 34.603,
            "longitude": 108.7732
          },
          {
            "name": "乾县",
            "latitude": 34.5227,
            "longitude": 108.2219
          },
          {
            "name": "礼泉县",
            "latitude": 34.592,
            "longitude": 108.4751
          },
          {
            "name": "永寿县",
            "latitude": 34.5715,
            "longitude": 108.0598
          },
          {
            "name": "长武县",
            "latitude": 35.1631,
            "longitude": 107.8296
          },
          {
            "name": "旬邑县",
            "latitude": 35.2103,
            "longitude": 108.4877
          },
          {
            "name": "淳化县",
            "latitude": 34.8633,
            "longitude": 108.5644
          },
          {
            "name": "武功县",
            "latitude": 34.3102,
            "longitude": 108.1839
          },
          {
            "name": "兴平市",
            "latitude": 34.3016,
            "longitude": 108.4689
          },
          {
            "name": "彬州市",
            "latitude": 35.0451,
            "longitude": 108.0617
          },
          {
            "name": "市区",
            "latitude": 34.6377,
            "longitude": 108.4006
          }
        ]
      },
      {
        "name": "渭南市",
        "districts": [
          {
            "name": "临渭区",
            "latitude": 34.5484,
            "longitude": 109.5579
          },
          {
            "name": "华州区",
            "latitude": 34.4067,
            "longitude": 109.8034
          },
          {
            "name": "潼关县",
            "latitude": 34.5024,
            "longitude": 110.2881
          },
          {
            "name": "大荔县",
            "latitude": 34.7921,
            "longitude": 110.0056
          },
          {
            "name": "合阳县",
            "latitude": 35.2014,
            "longitude": 110.1859
          },
          {
            "name": "澄城县",
            "latitude": 35.2165,
            "longitude": 109.8948
          },
          {
            "name": "蒲城县",
            "latitude": 34.9619,
            "longitude": 109.6214
          },
          {
            "name": "白水县",
            "latitude": 35.2658,
            "longitude": 109.5636
          },
          {
            "name": "富平县",
            "latitude": 34.8734,
            "longitude": 109.2292
          },
          {
            "name": "韩城市",
            "latitude": 35.5742,
            "longitude": 110.3865
          },
          {
            "name": "华阴市",
            "latitude": 34.5227,
            "longitude": 110.048
          },
          {
            "name": "市区",
            "latitude": 34.8969,
            "longitude": 109.8713
          }
        ]
      },
      {
        "name": "延安市",
        "districts": [
          {
            "name": "宝塔区",
            "latitude": 36.571,
            "longitude": 109.6428
          },
          {
            "name": "安塞区",
            "latitude": 36.9208,
            "longitude": 109.1643
          },
          {
            "name": "延长县",
            "latitude": 36.537,
            "longitude": 110.1311
          },
          {
            "name": "延川县",
            "latitude": 36.8765,
            "longitude": 110.0769
          },
          {
            "name": "志丹县",
            "latitude": 36.7464,
            "longitude": 108.6557
          },
          {
            "name": "吴起县",
            "latitude": 36.9791,
            "longitude": 108.1216
          },
          {
            "name": "甘泉县",
            "latitude": 36.3473,
            "longitude": 109.1788
          },
          {
            "name": "富县",
            "latitude": 36.0156,
            "longitude": 109.0391
          },
          {
            "name": "洛川县",
            "latitude": 35.7384,
            "longitude": 109.5555
          },
          {
            "name": "宜川县",
            "latitude": 36.0649,
            "longitude": 110.1855
          },
          {
            "name": "黄龙县",
            "latitude": 35.6967,
            "longitude": 109.9381
          },
          {
            "name": "黄陵县",
            "latitude": 35.6228,
            "longitude": 108.9456
          },
          {
            "name": "子长市",
            "latitude": 37.2258,
            "longitude": 109.615
          },
          {
            "name": "市区",
            "latitude": 36.4109,
            "longitude": 109.4038
          }
        ]
      },
      {
        "name": "汉中市",
        "districts": [
          {
            "name": "汉台区",
            "latitude": 33.1831,
            "longitude": 107.0382
          },
          {
            "name": "南郑区",
            "latitude": 32.8054,
            "longitude": 106.9673
          },
          {
            "name": "城固县",
            "latitude": 33.2185,
            "longitude": 107.2554
          },
          {
            "name": "洋县",
            "latitude": 33.3629,
            "longitude": 107.6098
          },
          {
            "name": "西乡县",
            "latitude": 32.8871,
            "longitude": 107.7465
          },
          {
            "name": "勉县",
            "latitude": 33.2388,
            "longitude": 106.658
          },
          {
            "name": "宁强县",
            "latitude": 32.9067,
            "longitude": 106.137
          },
          {
            "name": "略阳县",
            "latitude": 33.3772,
            "longitude": 106.1565
          },
          {
            "name": "镇巴县",
            "latitude": 32.5099,
            "longitude": 107.8773
          },
          {
            "name": "留坝县",
            "latitude": 33.608,
            "longitude": 106.9558
          },
          {
            "name": "佛坪县",
            "latitude": 33.5424,
            "longitude": 107.9232
          },
          {
            "name": "市区",
            "latitude": 33.1491,
            "longitude": 107.1205
          }
        ]
      },
      {
        "name": "榆林市",
        "districts": [
          {
            "name": "榆阳区",
            "latitude": 38.384,
            "longitude": 109.6425
          },
          {
            "name": "横山区",
            "latitude": 37.8501,
            "longitude": 109.4566
          },
          {
            "name": "府谷县",
            "latitude": 39.182,
            "longitude": 110.8615
          },
          {
            "name": "靖边县",
            "latitude": 37.4794,
            "longitude": 108.806
          },
          {
            "name": "定边县",
            "latitude": 37.3795,
            "longitude": 107.7485
          },
          {
            "name": "绥德县",
            "latitude": 37.5141,
            "longitude": 110.3897
          },
          {
            "name": "米脂县",
            "latitude": 37.8223,
            "longitude": 110.1795
          },
          {
            "name": "佳县",
            "latitude": 38.0719,
            "longitude": 110.3674
          },
          {
            "name": "吴堡县",
            "latitude": 37.5888,
            "longitude": 110.6855
          },
          {
            "name": "清涧县",
            "latitude": 37.1808,
            "longitude": 110.2821
          },
          {
            "name": "子洲县",
            "latitude": 37.5276,
            "longitude": 109.8706
          },
          {
            "name": "神木市",
            "latitude": 38.8225,
            "longitude": 110.3267
          },
          {
            "name": "市区",
            "latitude": 37.9002,
            "longitude": 109.8847
          }
        ]
      },
      {
        "name": "安康市",
        "districts": [
          {
            "name": "汉滨区",
            "latitude": 32.813,
            "longitude": 108.8888
          },
          {
            "name": "汉阴县",
            "latitude": 32.8975,
            "longitude": 108.488
          },
          {
            "name": "石泉县",
            "latitude": 33.0592,
            "longitude": 108.2424
          },
          {
            "name": "宁陕县",
            "latitude": 33.5311,
            "longitude": 108.4454
          },
          {
            "name": "紫阳县",
            "latitude": 32.4436,
            "longitude": 108.4384
          },
          {
            "name": "岚皋县",
            "latitude": 32.2413,
            "longitude": 108.8786
          },
          {
            "name": "平利县",
            "latitude": 32.2866,
            "longitude": 109.2642
          },
          {
            "name": "镇坪县",
            "latitude": 31.9346,
            "longitude": 109.4503
          },
          {
            "name": "旬阳县",
            "latitude": 32.6831,
            "longitude": 108.9423
          },
          {
            "name": "白河县",
            "latitude": 32.725,
            "longitude": 109.912
          },
          {
            "name": "旬阳市",
            "latitude": 32.8986,
            "longitude": 109.4153
          },
          {
            "name": "市区",
            "latitude": 32.6831,
            "longitude": 108.9423
          }
        ]
      },
      {
        "name": "商洛市",
        "districts": [
          {
            "name": "商州区",
            "latitude": 33.8905,
            "longitude": 109.8668
          },
          {
            "name": "洛南县",
            "latitude": 34.1599,
            "longitude": 110.2672
          },
          {
            "name": "丹凤县",
            "latitude": 33.6794,
            "longitude": 110.436
          },
          {
            "name": "商南县",
            "latitude": 33.4063,
            "longitude": 110.7578
          },
          {
            "name": "山阳县",
            "latitude": 33.4212,
            "longitude": 109.9733
          },
          {
            "name": "镇安县",
            "latitude": 33.3761,
            "longitude": 109.0681
          },
          {
            "name": "柞水县",
            "latitude": 33.6883,
            "longitude": 109.2742
          },
          {
            "name": "市区",
            "latitude": 33.6602,
            "longitude": 109.9491
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
            "name": "永登县",
            "latitude": 36.6036,
            "longitude": 103.2509
          },
          {
            "name": "皋兰县",
            "latitude": 36.3897,
            "longitude": 103.8799
          },
          {
            "name": "榆中县",
            "latitude": 35.9931,
            "longitude": 104.2329
          },
          {
            "name": "市区",
            "latitude": 36.1942,
            "longitude": 103.6664
          }
        ]
      },
      {
        "name": "嘉峪关市",
        "districts": [
          {
            "name": "市区",
            "latitude": 39.8294,
            "longitude": 98.2113
          }
        ]
      },
      {
        "name": "金昌市",
        "districts": [
          {
            "name": "金川区",
            "latitude": 38.6481,
            "longitude": 102.1609
          },
          {
            "name": "永昌县",
            "latitude": 38.2861,
            "longitude": 101.9664
          },
          {
            "name": "市区",
            "latitude": 38.4671,
            "longitude": 102.0636
          }
        ]
      },
      {
        "name": "白银市",
        "districts": [
          {
            "name": "白银区",
            "latitude": 36.5557,
            "longitude": 104.1599
          },
          {
            "name": "平川区",
            "latitude": 36.7147,
            "longitude": 104.9145
          },
          {
            "name": "靖远县",
            "latitude": 36.5061,
            "longitude": 104.6897
          },
          {
            "name": "会宁县",
            "latitude": 35.958,
            "longitude": 105.0955
          },
          {
            "name": "景泰县",
            "latitude": 37.1398,
            "longitude": 104.0513
          },
          {
            "name": "市区",
            "latitude": 36.5749,
            "longitude": 104.5822
          }
        ]
      },
      {
        "name": "天水市",
        "districts": [
          {
            "name": "秦州区",
            "latitude": 34.3952,
            "longitude": 105.6267
          },
          {
            "name": "麦积区",
            "latitude": 34.416,
            "longitude": 106.1356
          },
          {
            "name": "清水县",
            "latitude": 34.7378,
            "longitude": 106.1324
          },
          {
            "name": "秦安县",
            "latitude": 34.9486,
            "longitude": 105.6904
          },
          {
            "name": "甘谷县",
            "latitude": 34.8036,
            "longitude": 105.2679
          },
          {
            "name": "武山县",
            "latitude": 34.6733,
            "longitude": 104.8809
          },
          {
            "name": "张家川回族自治县",
            "latitude": 34.9865,
            "longitude": 106.2751
          },
          {
            "name": "市区",
            "latitude": 34.7087,
            "longitude": 105.7156
          }
        ]
      },
      {
        "name": "武威市",
        "districts": [
          {
            "name": "凉州区",
            "latitude": 37.9122,
            "longitude": 102.7532
          },
          {
            "name": "民勤县",
            "latitude": 38.8312,
            "longitude": 103.188
          },
          {
            "name": "古浪县",
            "latitude": 37.528,
            "longitude": 103.3335
          },
          {
            "name": "天祝藏族自治县",
            "latitude": 37.2664,
            "longitude": 102.7653
          },
          {
            "name": "市区",
            "latitude": 37.8845,
            "longitude": 103.01
          }
        ]
      },
      {
        "name": "张掖市",
        "districts": [
          {
            "name": "甘州区",
            "latitude": 39.0044,
            "longitude": 100.5073
          },
          {
            "name": "肃南裕固族自治县",
            "latitude": 39.0536,
            "longitude": 98.8671
          },
          {
            "name": "民乐县",
            "latitude": 38.4764,
            "longitude": 100.7691
          },
          {
            "name": "临泽县",
            "latitude": 39.3462,
            "longitude": 100.1769
          },
          {
            "name": "高台县",
            "latitude": 39.5401,
            "longitude": 99.5936
          },
          {
            "name": "山丹县",
            "latitude": 38.5231,
            "longitude": 101.1781
          },
          {
            "name": "市区",
            "latitude": 38.9906,
            "longitude": 100.182
          }
        ]
      },
      {
        "name": "平凉市",
        "districts": [
          {
            "name": "崆峒区",
            "latitude": 35.5106,
            "longitude": 106.742
          },
          {
            "name": "泾川县",
            "latitude": 35.3478,
            "longitude": 107.4355
          },
          {
            "name": "灵台县",
            "latitude": 35.0681,
            "longitude": 107.4036
          },
          {
            "name": "崇信县",
            "latitude": 35.2442,
            "longitude": 106.997
          },
          {
            "name": "庄浪县",
            "latitude": 35.2489,
            "longitude": 106.0606
          },
          {
            "name": "静宁县",
            "latitude": 35.4286,
            "longitude": 105.6702
          },
          {
            "name": "华亭市",
            "latitude": 35.1972,
            "longitude": 106.5992
          },
          {
            "name": "市区",
            "latitude": 35.2922,
            "longitude": 106.7012
          }
        ]
      },
      {
        "name": "酒泉市",
        "districts": [
          {
            "name": "肃州区",
            "latitude": 39.6036,
            "longitude": 98.7931
          },
          {
            "name": "金塔县",
            "latitude": 40.3745,
            "longitude": 99.1751
          },
          {
            "name": "瓜州县",
            "latitude": 40.734,
            "longitude": 95.7647
          },
          {
            "name": "肃北蒙古族自治县",
            "latitude": 39.3383,
            "longitude": 96.143
          },
          {
            "name": "阿克塞哈萨克族自治县",
            "latitude": 39.0294,
            "longitude": 94.4235
          },
          {
            "name": "玉门市",
            "latitude": 40.2403,
            "longitude": 97.4603
          },
          {
            "name": "敦煌市",
            "latitude": 40.3666,
            "longitude": 94.1252
          },
          {
            "name": "市区",
            "latitude": 39.9552,
            "longitude": 96.555
          }
        ]
      },
      {
        "name": "庆阳市",
        "districts": [
          {
            "name": "西峰区",
            "latitude": 35.669,
            "longitude": 107.6664
          },
          {
            "name": "庆城县",
            "latitude": 36.0407,
            "longitude": 107.676
          },
          {
            "name": "环县",
            "latitude": 36.6096,
            "longitude": 107.0661
          },
          {
            "name": "华池县",
            "latitude": 36.4387,
            "longitude": 108.0261
          },
          {
            "name": "合水县",
            "latitude": 36.002,
            "longitude": 108.3033
          },
          {
            "name": "正宁县",
            "latitude": 35.4047,
            "longitude": 108.3692
          },
          {
            "name": "宁县",
            "latitude": 35.566,
            "longitude": 108.1097
          },
          {
            "name": "镇原县",
            "latitude": 35.7803,
            "longitude": 107.1718
          },
          {
            "name": "市区",
            "latitude": 35.9389,
            "longitude": 107.7986
          }
        ]
      },
      {
        "name": "定西市",
        "districts": [
          {
            "name": "安定区",
            "latitude": 35.6386,
            "longitude": 104.632
          },
          {
            "name": "通渭县",
            "latitude": 35.2079,
            "longitude": 105.1891
          },
          {
            "name": "陇西县",
            "latitude": 35.1061,
            "longitude": 104.6275
          },
          {
            "name": "渭源县",
            "latitude": 35.1362,
            "longitude": 104.1404
          },
          {
            "name": "临洮县",
            "latitude": 35.5252,
            "longitude": 103.9053
          },
          {
            "name": "漳县",
            "latitude": 34.722,
            "longitude": 104.3606
          },
          {
            "name": "岷县",
            "latitude": 34.4239,
            "longitude": 104.2404
          },
          {
            "name": "市区",
            "latitude": 35.1086,
            "longitude": 104.4422
          }
        ]
      },
      {
        "name": "陇南市",
        "districts": [
          {
            "name": "武都区",
            "latitude": 33.2863,
            "longitude": 105.1281
          },
          {
            "name": "成县",
            "latitude": 33.7427,
            "longitude": 105.6826
          },
          {
            "name": "文县",
            "latitude": 32.9413,
            "longitude": 104.7771
          },
          {
            "name": "宕昌县",
            "latitude": 34.009,
            "longitude": 104.4463
          },
          {
            "name": "康县",
            "latitude": 33.2791,
            "longitude": 105.6308
          },
          {
            "name": "西和县",
            "latitude": 33.9116,
            "longitude": 105.3316
          },
          {
            "name": "礼县",
            "latitude": 34.105,
            "longitude": 105.0571
          },
          {
            "name": "徽县",
            "latitude": 33.8874,
            "longitude": 106.0201
          },
          {
            "name": "两当县",
            "latitude": 33.9011,
            "longitude": 106.3923
          },
          {
            "name": "市区",
            "latitude": 33.6737,
            "longitude": 105.3851
          }
        ]
      },
      {
        "name": "临夏回族自治州",
        "districts": [
          {
            "name": "临夏市",
            "latitude": 35.5747,
            "longitude": 103.1873
          },
          {
            "name": "临夏县",
            "latitude": 35.5146,
            "longitude": 103.0457
          },
          {
            "name": "康乐县",
            "latitude": 35.2445,
            "longitude": 103.654
          },
          {
            "name": "永靖县",
            "latitude": 36.0028,
            "longitude": 103.2197
          },
          {
            "name": "广河县",
            "latitude": 35.4719,
            "longitude": 103.6198
          },
          {
            "name": "和政县",
            "latitude": 35.3109,
            "longitude": 103.3332
          },
          {
            "name": "东乡族自治县",
            "latitude": 35.6927,
            "longitude": 103.4463
          },
          {
            "name": "积石山保安族东乡族撒拉族自治县",
            "latitude": 35.712,
            "longitude": 102.8973
          },
          {
            "name": "市区",
            "latitude": 35.5655,
            "longitude": 103.3004
          }
        ]
      },
      {
        "name": "甘南藏族自治州",
        "districts": [
          {
            "name": "合作市",
            "latitude": 34.9925,
            "longitude": 103.081
          },
          {
            "name": "临潭县",
            "latitude": 34.7449,
            "longitude": 103.6792
          },
          {
            "name": "卓尼县",
            "latitude": 34.4538,
            "longitude": 103.3063
          },
          {
            "name": "舟曲县",
            "latitude": 33.6274,
            "longitude": 104.3215
          },
          {
            "name": "迭部县",
            "latitude": 34.0035,
            "longitude": 103.5642
          },
          {
            "name": "玛曲县",
            "latitude": 33.8355,
            "longitude": 101.6684
          },
          {
            "name": "碌曲县",
            "latitude": 34.3892,
            "longitude": 102.4711
          },
          {
            "name": "夏河县",
            "latitude": 35.0187,
            "longitude": 102.5002
          },
          {
            "name": "市区",
            "latitude": 34.3832,
            "longitude": 103.074
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
            "name": "湟中区",
            "latitude": 36.6014,
            "longitude": 101.5242
          },
          {
            "name": "大通回族土族自治县",
            "latitude": 37.1319,
            "longitude": 101.4591
          },
          {
            "name": "湟源县",
            "latitude": 36.6185,
            "longitude": 101.1697
          },
          {
            "name": "市区",
            "latitude": 36.6842,
            "longitude": 101.5874
          }
        ]
      },
      {
        "name": "海东市",
        "districts": [
          {
            "name": "乐都区",
            "latitude": 36.4863,
            "longitude": 102.4308
          },
          {
            "name": "平安区",
            "latitude": 36.4044,
            "longitude": 102.006
          },
          {
            "name": "民和回族土族自治县",
            "latitude": 36.1379,
            "longitude": 102.7685
          },
          {
            "name": "互助土族自治县",
            "latitude": 36.8426,
            "longitude": 102.1581
          },
          {
            "name": "化隆回族自治县",
            "latitude": 36.0805,
            "longitude": 102.2123
          },
          {
            "name": "循化撒拉族自治县",
            "latitude": 35.7178,
            "longitude": 102.4684
          },
          {
            "name": "市区",
            "latitude": 36.2783,
            "longitude": 102.3407
          }
        ]
      },
      {
        "name": "海北藏族自治州",
        "districts": [
          {
            "name": "门源回族自治县",
            "latitude": 37.4552,
            "longitude": 101.7322
          },
          {
            "name": "祁连县",
            "latitude": 38.3122,
            "longitude": 99.717
          },
          {
            "name": "海晏县",
            "latitude": 37.0799,
            "longitude": 100.7822
          },
          {
            "name": "刚察县",
            "latitude": 37.4722,
            "longitude": 99.9925
          },
          {
            "name": "市区",
            "latitude": 37.5799,
            "longitude": 100.556
          }
        ]
      },
      {
        "name": "黄南藏族自治州",
        "districts": [
          {
            "name": "同仁市",
            "latitude": 35.4226,
            "longitude": 102.0776
          },
          {
            "name": "尖扎县",
            "latitude": 35.9033,
            "longitude": 101.8626
          },
          {
            "name": "泽库县",
            "latitude": 35.1006,
            "longitude": 101.4058
          },
          {
            "name": "河南蒙古族自治县",
            "latitude": 34.5059,
            "longitude": 101.5531
          },
          {
            "name": "市区",
            "latitude": 35.2331,
            "longitude": 101.7248
          }
        ]
      },
      {
        "name": "海南藏族自治州",
        "districts": [
          {
            "name": "共和县",
            "latitude": 36.4642,
            "longitude": 100.0337
          },
          {
            "name": "同德县",
            "latitude": 35.0746,
            "longitude": 100.5896
          },
          {
            "name": "贵德县",
            "latitude": 35.9993,
            "longitude": 101.4343
          },
          {
            "name": "兴海县",
            "latitude": 35.5276,
            "longitude": 99.7357
          },
          {
            "name": "贵南县",
            "latitude": 35.7007,
            "longitude": 100.9059
          },
          {
            "name": "市区",
            "latitude": 35.7533,
            "longitude": 100.5398
          }
        ]
      },
      {
        "name": "果洛藏族自治州",
        "districts": [
          {
            "name": "玛沁县",
            "latitude": 34.5106,
            "longitude": 99.7729
          },
          {
            "name": "班玛县",
            "latitude": 32.9291,
            "longitude": 100.5254
          },
          {
            "name": "甘德县",
            "latitude": 34.0226,
            "longitude": 100.136
          },
          {
            "name": "达日县",
            "latitude": 33.482,
            "longitude": 99.395
          },
          {
            "name": "久治县",
            "latitude": 33.4859,
            "longitude": 100.9991
          },
          {
            "name": "玛多县",
            "latitude": 34.8119,
            "longitude": 98.2305
          },
          {
            "name": "市区",
            "latitude": 33.8737,
            "longitude": 99.8431
          }
        ]
      },
      {
        "name": "玉树藏族自治州",
        "districts": [
          {
            "name": "玉树市",
            "latitude": 32.9142,
            "longitude": 96.66
          },
          {
            "name": "杂多县",
            "latitude": 33.0609,
            "longitude": 94.2825
          },
          {
            "name": "称多县",
            "latitude": 33.919,
            "longitude": 97.0133
          },
          {
            "name": "治多县",
            "latitude": 34.8792,
            "longitude": 92.6031
          },
          {
            "name": "囊谦县",
            "latitude": 32.1695,
            "longitude": 96.1288
          },
          {
            "name": "曲麻莱县",
            "latitude": 34.954,
            "longitude": 95.2611
          },
          {
            "name": "市区",
            "latitude": 33.6495,
            "longitude": 95.3248
          }
        ]
      },
      {
        "name": "海西蒙古族藏族自治州",
        "districts": [
          {
            "name": "格尔木市",
            "latitude": 33.9019,
            "longitude": 91.2802
          },
          {
            "name": "德令哈市",
            "latitude": 37.7231,
            "longitude": 96.9961
          },
          {
            "name": "茫崖市",
            "latitude": 38.1824,
            "longitude": 92.1904
          },
          {
            "name": "乌兰县",
            "latitude": 36.8087,
            "longitude": 98.2058
          },
          {
            "name": "都兰县",
            "latitude": 36.1778,
            "longitude": 97.1503
          },
          {
            "name": "天峻县",
            "latitude": 38.0559,
            "longitude": 98.4447
          },
          {
            "name": "大柴旦行政委员会",
            "latitude": 36.9593,
            "longitude": 95.587
          },
          {
            "name": "市区",
            "latitude": 36.9593,
            "longitude": 95.587
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
            "name": "永宁县",
            "latitude": 38.2804,
            "longitude": 106.2538
          },
          {
            "name": "贺兰县",
            "latitude": 38.6844,
            "longitude": 106.2518
          },
          {
            "name": "灵武市",
            "latitude": 37.9871,
            "longitude": 106.5469
          },
          {
            "name": "市区",
            "latitude": 38.4042,
            "longitude": 106.2948
          }
        ]
      },
      {
        "name": "石嘴山市",
        "districts": [
          {
            "name": "大武口区",
            "latitude": 39.0825,
            "longitude": 106.3303
          },
          {
            "name": "惠农区",
            "latitude": 39.1805,
            "longitude": 106.6539
          },
          {
            "name": "平罗县",
            "latitude": 38.8827,
            "longitude": 106.5322
          },
          {
            "name": "市区",
            "latitude": 39.0486,
            "longitude": 106.5055
          }
        ]
      },
      {
        "name": "吴忠市",
        "districts": [
          {
            "name": "利通区",
            "latitude": 37.736,
            "longitude": 106.2625
          },
          {
            "name": "红寺堡区",
            "latitude": 37.3663,
            "longitude": 106.2197
          },
          {
            "name": "盐池县",
            "latitude": 37.6265,
            "longitude": 107.0613
          },
          {
            "name": "同心县",
            "latitude": 36.979,
            "longitude": 106.2576
          },
          {
            "name": "青铜峡市",
            "latitude": 37.9413,
            "longitude": 105.9551
          },
          {
            "name": "市区",
            "latitude": 37.5298,
            "longitude": 106.3512
          }
        ]
      },
      {
        "name": "固原市",
        "districts": [
          {
            "name": "原州区",
            "latitude": 36.1264,
            "longitude": 106.2594
          },
          {
            "name": "西吉县",
            "latitude": 35.9333,
            "longitude": 105.7194
          },
          {
            "name": "隆德县",
            "latitude": 35.5916,
            "longitude": 106.0711
          },
          {
            "name": "泾源县",
            "latitude": 35.5176,
            "longitude": 106.3469
          },
          {
            "name": "彭阳县",
            "latitude": 35.9654,
            "longitude": 106.6523
          },
          {
            "name": "市区",
            "latitude": 35.8269,
            "longitude": 106.2098
          }
        ]
      },
      {
        "name": "中卫市",
        "districts": [
          {
            "name": "沙坡头区",
            "latitude": 37.2879,
            "longitude": 105.1378
          },
          {
            "name": "中宁县",
            "latitude": 37.3156,
            "longitude": 105.6684
          },
          {
            "name": "海原县",
            "latitude": 36.5169,
            "longitude": 105.7956
          },
          {
            "name": "市区",
            "latitude": 37.0401,
            "longitude": 105.5339
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
            "name": "乌鲁木齐县",
            "latitude": 43.385,
            "longitude": 87.3506
          },
          {
            "name": "市区",
            "latitude": 43.8176,
            "longitude": 87.6496
          }
        ]
      },
      {
        "name": "克拉玛依市",
        "districts": [
          {
            "name": "独山子区",
            "latitude": 44.2906,
            "longitude": 84.8926
          },
          {
            "name": "克拉玛依区",
            "latitude": 45.2438,
            "longitude": 84.9404
          },
          {
            "name": "白碱滩区",
            "latitude": 45.613,
            "longitude": 85.2674
          },
          {
            "name": "乌尔禾区",
            "latitude": 45.9773,
            "longitude": 85.585
          },
          {
            "name": "市区",
            "latitude": 45.2812,
            "longitude": 85.1713
          }
        ]
      },
      {
        "name": "吐鲁番市",
        "districts": [
          {
            "name": "高昌区",
            "latitude": 42.6718,
            "longitude": 89.2636
          },
          {
            "name": "鄯善县",
            "latitude": 42.2849,
            "longitude": 90.6049
          },
          {
            "name": "托克逊县",
            "latitude": 42.4422,
            "longitude": 88.4191
          },
          {
            "name": "市区",
            "latitude": 42.4663,
            "longitude": 89.4292
          }
        ]
      },
      {
        "name": "哈密市",
        "districts": [
          {
            "name": "伊州区",
            "latitude": 42.35,
            "longitude": 93.5134
          },
          {
            "name": "巴里坤哈萨克自治县",
            "latitude": 44.2744,
            "longitude": 92.7866
          },
          {
            "name": "伊吾县",
            "latitude": 43.5659,
            "longitude": 94.9102
          },
          {
            "name": "市区",
            "latitude": 43.3968,
            "longitude": 93.7367
          }
        ]
      },
      {
        "name": "昌吉回族自治州",
        "districts": [
          {
            "name": "昌吉市",
            "latitude": 44.1678,
            "longitude": 87.0683
          },
          {
            "name": "阜康市",
            "latitude": 44.4181,
            "longitude": 88.2988
          },
          {
            "name": "呼图壁县",
            "latitude": 44.3766,
            "longitude": 86.6859
          },
          {
            "name": "玛纳斯县",
            "latitude": 44.5,
            "longitude": 86.128
          },
          {
            "name": "奇台县",
            "latitude": 44.5225,
            "longitude": 90.1051
          },
          {
            "name": "吉木萨尔县",
            "latitude": 44.3474,
            "longitude": 89.0465
          },
          {
            "name": "木垒哈萨克自治县",
            "latitude": 44.0961,
            "longitude": 90.8042
          },
          {
            "name": "市区",
            "latitude": 44.3469,
            "longitude": 88.3053
          }
        ]
      },
      {
        "name": "博尔塔拉蒙古自治州",
        "districts": [
          {
            "name": "博乐市",
            "latitude": 44.7897,
            "longitude": 81.6504
          },
          {
            "name": "阿拉山口市",
            "latitude": 45.1515,
            "longitude": 82.529
          },
          {
            "name": "精河县",
            "latitude": 44.5484,
            "longitude": 82.9167
          },
          {
            "name": "温泉县",
            "latitude": 44.9633,
            "longitude": 80.9449
          },
          {
            "name": "市区",
            "latitude": 44.8632,
            "longitude": 82.0102
          }
        ]
      },
      {
        "name": "巴音郭楞蒙古自治州",
        "districts": [
          {
            "name": "库尔勒市",
            "latitude": 41.573,
            "longitude": 85.7253
          },
          {
            "name": "轮台县",
            "latitude": 41.812,
            "longitude": 84.5718
          },
          {
            "name": "尉犁县",
            "latitude": 40.8498,
            "longitude": 86.8532
          },
          {
            "name": "若羌县",
            "latitude": 38.9709,
            "longitude": 89.7591
          },
          {
            "name": "且末县",
            "latitude": 38.0956,
            "longitude": 85.4861
          },
          {
            "name": "焉耆回族自治县",
            "latitude": 42.0884,
            "longitude": 86.0704
          },
          {
            "name": "和静县",
            "latitude": 42.8218,
            "longitude": 85.1958
          },
          {
            "name": "和硕县",
            "latitude": 42.1349,
            "longitude": 87.5811
          },
          {
            "name": "博湖县",
            "latitude": 41.8507,
            "longitude": 86.8795
          },
          {
            "name": "市区",
            "latitude": 41.133,
            "longitude": 86.458
          }
        ]
      },
      {
        "name": "阿克苏地区",
        "districts": [
          {
            "name": "阿克苏市",
            "latitude": 41.1713,
            "longitude": 80.2629
          },
          {
            "name": "库车市",
            "latitude": 41.7801,
            "longitude": 83.451
          },
          {
            "name": "温宿县",
            "latitude": 41.576,
            "longitude": 80.4568
          },
          {
            "name": "沙雅县",
            "latitude": 40.3996,
            "longitude": 82.9152
          },
          {
            "name": "新和县",
            "latitude": 41.3595,
            "longitude": 81.9805
          },
          {
            "name": "拜城县",
            "latitude": 42.0394,
            "longitude": 81.8939
          },
          {
            "name": "乌什县",
            "latitude": 41.2554,
            "longitude": 79.2751
          },
          {
            "name": "阿瓦提县",
            "latitude": 40.0561,
            "longitude": 80.4348
          },
          {
            "name": "柯坪县",
            "latitude": 40.451,
            "longitude": 78.9956
          },
          {
            "name": "市区",
            "latitude": 41.1209,
            "longitude": 81.074
          }
        ]
      },
      {
        "name": "克孜勒苏柯尔克孜自治州",
        "districts": [
          {
            "name": "阿图什市",
            "latitude": 40.1252,
            "longitude": 76.8603
          },
          {
            "name": "阿克陶县",
            "latitude": 38.6383,
            "longitude": 75.2192
          },
          {
            "name": "阿合奇县",
            "latitude": 40.8479,
            "longitude": 77.8852
          },
          {
            "name": "乌恰县",
            "latitude": 39.8241,
            "longitude": 74.9094
          },
          {
            "name": "市区",
            "latitude": 39.8589,
            "longitude": 76.2185
          }
        ]
      },
      {
        "name": "喀什地区",
        "districts": [
          {
            "name": "喀什市",
            "latitude": 39.5209,
            "longitude": 76.1818
          },
          {
            "name": "疏附县",
            "latitude": 39.3703,
            "longitude": 75.6144
          },
          {
            "name": "疏勒县",
            "latitude": 39.1878,
            "longitude": 76.3569
          },
          {
            "name": "英吉沙县",
            "latitude": 38.7956,
            "longitude": 76.366
          },
          {
            "name": "泽普县",
            "latitude": 38.1183,
            "longitude": 77.2174
          },
          {
            "name": "莎车县",
            "latitude": 38.3197,
            "longitude": 77.0062
          },
          {
            "name": "叶城县",
            "latitude": 36.9904,
            "longitude": 77.2216
          },
          {
            "name": "麦盖提县",
            "latitude": 38.8413,
            "longitude": 78.2367
          },
          {
            "name": "岳普湖县",
            "latitude": 39.1135,
            "longitude": 76.9725
          },
          {
            "name": "伽师县",
            "latitude": 39.5922,
            "longitude": 77.2221
          },
          {
            "name": "巴楚县",
            "latitude": 39.4908,
            "longitude": 78.7092
          },
          {
            "name": "塔什库尔干塔吉克自治县",
            "latitude": 37.0135,
            "longitude": 75.8428
          },
          {
            "name": "市区",
            "latitude": 38.6962,
            "longitude": 76.9123
          }
        ]
      },
      {
        "name": "和田地区",
        "districts": [
          {
            "name": "和田市",
            "latitude": 37.149,
            "longitude": 79.9532
          },
          {
            "name": "和田县",
            "latitude": 35.671,
            "longitude": 79.3443
          },
          {
            "name": "墨玉县",
            "latitude": 38.585,
            "longitude": 80.1397
          },
          {
            "name": "皮山县",
            "latitude": 36.7187,
            "longitude": 78.2767
          },
          {
            "name": "洛浦县",
            "latitude": 38.0273,
            "longitude": 80.7432
          },
          {
            "name": "策勒县",
            "latitude": 35.8254,
            "longitude": 80.833
          },
          {
            "name": "于田县",
            "latitude": 37.1645,
            "longitude": 81.987
          },
          {
            "name": "民丰县",
            "latitude": 37.1459,
            "longitude": 83.3388
          },
          {
            "name": "市区",
            "latitude": 37.0358,
            "longitude": 80.577
          }
        ]
      },
      {
        "name": "伊犁哈萨克自治州",
        "districts": [
          {
            "name": "伊宁市",
            "latitude": 44.0086,
            "longitude": 81.2783
          },
          {
            "name": "奎屯市",
            "latitude": 44.4832,
            "longitude": 85.0477
          },
          {
            "name": "霍尔果斯市",
            "latitude": 44.4615,
            "longitude": 80.5177
          },
          {
            "name": "伊宁县",
            "latitude": 44.006,
            "longitude": 81.7478
          },
          {
            "name": "察布查尔锡伯自治县",
            "latitude": 43.6117,
            "longitude": 81.1354
          },
          {
            "name": "霍城县",
            "latitude": 44.2601,
            "longitude": 80.9774
          },
          {
            "name": "巩留县",
            "latitude": 43.4816,
            "longitude": 82.227
          },
          {
            "name": "新源县",
            "latitude": 43.371,
            "longitude": 83.5506
          },
          {
            "name": "昭苏县",
            "latitude": 42.7705,
            "longitude": 80.9789
          },
          {
            "name": "特克斯县",
            "latitude": 42.92,
            "longitude": 82.0008
          },
          {
            "name": "尼勒克县",
            "latitude": 43.8108,
            "longitude": 83.2282
          },
          {
            "name": "市区",
            "latitude": 43.7441,
            "longitude": 82.0627
          }
        ]
      },
      {
        "name": "塔城地区",
        "districts": [
          {
            "name": "塔城市",
            "latitude": 46.8065,
            "longitude": 83.1926
          },
          {
            "name": "乌苏市",
            "latitude": 44.3926,
            "longitude": 84.2666
          },
          {
            "name": "额敏县",
            "latitude": 46.5849,
            "longitude": 84.1985
          },
          {
            "name": "沙湾县",
            "latitude": 45.7181,
            "longitude": 84.2909
          },
          {
            "name": "托里县",
            "latitude": 45.652,
            "longitude": 83.8895
          },
          {
            "name": "裕民县",
            "latitude": 45.9951,
            "longitude": 82.809
          },
          {
            "name": "和布克赛尔蒙古自治县",
            "latitude": 46.25,
            "longitude": 86.2101
          },
          {
            "name": "沙湾市",
            "latitude": 44.3457,
            "longitude": 85.4697
          },
          {
            "name": "市区",
            "latitude": 45.7181,
            "longitude": 84.2909
          }
        ]
      },
      {
        "name": "阿勒泰地区",
        "districts": [
          {
            "name": "阿勒泰市",
            "latitude": 47.8847,
            "longitude": 87.9178
          },
          {
            "name": "布尔津县",
            "latitude": 48.3134,
            "longitude": 87.2308
          },
          {
            "name": "富蕴县",
            "latitude": 46.5324,
            "longitude": 89.3866
          },
          {
            "name": "福海县",
            "latitude": 46.3625,
            "longitude": 88.0466
          },
          {
            "name": "哈巴河县",
            "latitude": 48.3102,
            "longitude": 86.4025
          },
          {
            "name": "青河县",
            "latitude": 46.263,
            "longitude": 90.3977
          },
          {
            "name": "吉木乃县",
            "latitude": 47.3995,
            "longitude": 86.2006
          },
          {
            "name": "市区",
            "latitude": 47.2951,
            "longitude": 87.9404
          }
        ]
      },
      {
        "name": "石河子市",
        "districts": [
          {
            "name": "石河子市",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "阿拉尔市",
        "districts": [
          {
            "name": "阿拉尔市",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "图木舒克市",
        "districts": [
          {
            "name": "图木舒克市",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "五家渠市",
        "districts": [
          {
            "name": "五家渠市",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "北屯市",
        "districts": [
          {
            "name": "北屯市",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "铁门关市",
        "districts": [
          {
            "name": "铁门关市",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "双河市",
        "districts": [
          {
            "name": "双河市",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "可克达拉市",
        "districts": [
          {
            "name": "可克达拉市",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "昆玉市",
        "districts": [
          {
            "name": "昆玉市",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "胡杨河市",
        "districts": [
          {
            "name": "胡杨河市",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
          }
        ]
      },
      {
        "name": "新星市",
        "districts": [
          {
            "name": "新星市",
            "latitude": 30,
            "longitude": 114
          },
          {
            "name": "市区",
            "latitude": 30,
            "longitude": 114
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
            "latitude": 22.3397,
            "longitude": 114.1544
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
            "name": "花王堂区",
            "latitude": 22.1988,
            "longitude": 113.5468
          },
          {
            "name": "望德堂区",
            "latitude": 22.1942,
            "longitude": 113.5501
          },
          {
            "name": "大堂区",
            "latitude": 22.1899,
            "longitude": 113.5439
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
            "name": "路凼填海区",
            "latitude": 22.1399,
            "longitude": 113.5677
          },
          {
            "name": "圣方济各堂区",
            "latitude": 22.1256,
            "longitude": 113.56
          },
          {
            "name": "市区",
            "latitude": 22.1727,
            "longitude": 113.5598
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
