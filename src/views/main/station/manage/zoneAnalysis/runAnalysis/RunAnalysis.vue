<template>
  <div class="runAnalysis wrapper" style="position: relative">
    <div class="wrapper_content">
      <!--左边-->
      <div class="leftbox mt12">
        <!--echart地图-->
        <div id='echartMap'></div>
      </div>
      <!--右边-->
      <div class="rightbox flex8" style="display: flex;">
        <div class="centerBox">
          <h3 class="barTitle" style="border: 0;">{{chosedArea}}2018年{{chosedIndex}}（元）排行榜</h3>
          <!-- <div id="barEchart"></div> -->
          <Chart :id="barEchart" :option="barEchartOption" ref="barEchart"></Chart>
          <!-- <div class="btns">
            <h4>对比指标</h4>
            <Button type="primary" class="compareBtn" @click="compareBtn(0)">重庆市指数</Button>
            <Button type="primary" class="compareBtn" @click="compareBtn(1)">重庆市最高</Button>
            <Button type="primary" class="compareBtn" @click="compareBtn(2)">重庆市最低</Button>
          </div> -->
        </div>
        <div class="barTimeline">
          <ul>
            <li v-for="(item,index) in timelineList" :key="item.id">
              <div class="liTail"></div>
              <div :class="['liHead',index==currentIndex ? 'headBlue' : '']"></div>
              <div class="liContent">
                <span class="timelineTitle" :class="{active:index==currentIndex}" @click="TLClicked(item.type, item.title)">{{item.title}}</span>
              </div>
            </li>
            <!--<li>-->
              <!--<div class="liTail"></div>-->
              <!--<div class="liHead headBlue"></div>-->
              <!--<div class="liContent">-->
                <!--<span class="timelineTitle">总销量2</span>-->
              <!--</div>-->
            <!--</li>-->
            <!--<li>-->
              <!--<div class="liTail"></div>-->
              <!--<div class="liHead"></div>-->
              <!--<div class="liContent">-->
                <!--<span class="timelineTitle">总销量3</span>-->
              <!--</div>-->
            <!--</li>-->
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import syncScript from '../../../../../../util/sync_script'
  import Chart from '@/components/chart/Chart'
export default {
  name: 'runAnalysis',
  components: {
    Chart
  },
  data() {
    return {
      // 当前timeline 序号
      currentIndex: 0,
      timelineList: [
        {title: '总销量', type: '0'},
        {title: '人均销量', type: '1'},
        {title: '单机销量', type: '2'},
        {title: '彩票发展指数', type: '3'},
        {title: '单站服务面积', type: '4'},
        {title: '单站服务人数', type: '5'}
      ],
      cityMap: {
        郑州市: '410100000000',
        开封市: '410200000000',
        洛阳市: '410300000000',
        平顶山市: '410400000000',
        安阳市: '410500000000',
        鹤壁市: '410600000000',
        新乡市: '410700000000',
        焦作市: '410800000000',
        濮阳市: '410900000000',
        许昌市: '411000000000',
        漯河市: '411100000000',
        三门峡市: '411200000000',
        南阳市: '411300000000',
        商丘市: '411400000000',
        信阳市: '411500000000',
        周口市: '411600000000',
        驻马店市: '411700000000',
        济源市: '419000000000'
      },
      defaultAreaCode: '',
      // 排行榜 柱状图echart
      barEchart: 'barEchart',
      echartMap: 'echartMap',
      barEchartOption: {
        // title: {x: '1%', y: '10%', text: '河南省2018年总销量（元）排行榜'},
        animation: true,
        calculable: true,
        grid: {
          top: '18%',
          left: '1%',
          borderWidth: 0,
          y: 80,
          y2: 60,
          width: '80%'
        },
        series: [
          {
            type: 'bar',
            barWidth: 18,
            markLine: {
              data: []
            },
            label: {
              normal: {
                show: true,
                position: 'right',
                formatter: '{b} {c}',
                lineHeight: 96,
                rich: {
                  name: {
                    textBorderColor: '#fff'
                  }
                }
              }
            },
            itemStyle: {
              emphasis: {
                barBorderRadius: 7
              },
              normal: {
                barBorderRadius: 7,
                color: function (params) {
                  // 颜色请勿随意修改
                  var colorList = [
                    '#20E141',
                    '#36B34B',
                    '#63C031',
                    '#AAC540',
                    '#FEDE00',
                    '#FCB712',
                    '#FC8612',
                    '#EB5A19',
                    '#EC1A23',
                    '#ED1A9B',
                    '#AF268E',
                    '#722790',
                    '#522E90',
                    '#3F14BC',
                    '#0072BB',
                    '#0193CE',
                    '#02BCD5'
                  ]
                  return colorList[params.dataIndex]
                }
              }
            },
            data: []
          }
        ],
        tooltip: {trigger: 'item'},
        xAxis: [
          {
            show: false,
            type: 'value'
          }
        ],
        yAxis: [
          {
            type: 'category',
            show: false,
            data: []
          }
        ]
      },
      mapOption: {},
      // 销量数据缓存
      dataList: [],
      // 地图点击的区域
      chosedArea: '河南省',
      // 时间轴选中的指标
      chosedIndex: '总销量'
    }
  },
  methods: {
    // 创建地图
    createMap() {
      var echarts = require('echarts')
      console.log(echarts)
      // // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('echartMap'))
      var _this = this
      var data = []

      function showProvince() {
        var name = 'henan'
        const json = require('../../../../../../assets/province/' +
          name +
          '.json')
        var geoJson = json
        _this.mapGeoJson = JSON.stringify(geoJson)
        for (var i = 0; i < geoJson.features.length; i++) {
          // let cityName = geoJson.features[i].properties.name
          data.push({
            id: geoJson.features[i].id,
            selected: false,
            name: geoJson.features[i].properties.name,
            // value: _this.cityMap[cityName]
            value: (Math.random() * 10000).toFixed(2)
          })
        }
        // showMap(geoJson)
        // })
        _this.mapOption = {
          backgroundColor: '#fff', // 背景颜色
          tooltip: {
            trigger: 'item',
            formatter: '{b}'
          },
          title: {
            text: '河南省',
            left: 'center',
            textStyle: {
              color: '#404a59'
            }
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            x: 'right',
            y: 'center',
            feature: {
              mark: {
                show: true
              },
              restore: {},
              dataView: {
                // 显示数据视窗
                show: false,
                readOnly: false
              }
            }
          },
          visualMap: {
            // 左侧颜色控制条
            show: false,
            min: 100,
            max: 50000,
            text: ['High', 'Low'],
            realtime: true,
            calculable: true,
            inRange: {
              color: ['lightskyblue', 'yellow', 'orangered']
            }
          },
          series: [
            {
              name: 'henan',
              type: 'map',
              mapType: name,
              label: {
                normal: {
                  show: true, // 地图上显示地区名字
                  textStyle: {
                    color: '#fff'
                  }
                },
                emphasis: {
                  textStyle: {
                    color: '#fff'
                  }
                }
              },
              roam: false,
              selectedMode: 'single',
              showLegendSymbol: false,
              itemStyle: {
                normal: {
                  show: true,
                  borderColor: '#389BB7',
                  areaColor: '#404a59'
                },
                emphasis: {
                  show: true,
                  areaColor: '#389BB7',
                  borderWidth: 0
                }
              },
              animation: false,
              data: data
              // animationDurationUpdate: 1000,
              // animationEasingUpdate: 'quinticInOut'
            }
          ]
        }

        echarts.registerMap(name, geoJson)
        myChart.setOption(_this.mapOption, true)
      }

      showProvince()
      myChart.off('click')
      let that = this
      myChart.on('click', function (params) {
        that.chosedArea = params.name
        that.chosedIndex = that.timelineList[0]['title']
        // let cityCode = params.value
        let cityCode = _this.cityMap[params.name]
        // console.log(_this.cityMap[params.name])
        // console.log(cityCode)
        that.getInfo(cityCode, that.dataType)
      })

      myChart.off('restore')
      myChart.on('restore', function () {
        that.chosedArea = '河南'
        that.chosedIndex = '总销量'
        let cityCode = ''
        that.getInfo(cityCode, that.dataType)
      })
      this.bindBarEchart()
    },
    bindBarEchart() {
      this.$refs.barEchart.chart.off('click')
      let that = this
      this.$refs.barEchart.chart.on('click', function (params) {
        let cityName = params.name
        let cityCode = that.cityMap[cityName]
        if (cityCode) {
          that.$router.push('/manage/runAnalysisDetail/' + cityCode)
        } else {
          that.showMsg('它没有详情啦~~', 'error')
        }
      })
    },
    // timeline 点击事件
    TLClicked(type, name) {
      this.chosedIndex = name
      this.currentIndex = type
      this.barEchartOption.yAxis[0].data = []
      this.barEchartOption.series[0].data = []
      this.dataList.forEach(v => {
        this.barEchartOption.yAxis[0].data.push(v.regionName)
        if (type === '0') {
          this.barEchartOption.series[0].data.push(v.totalSale)
        } else if (type === '1') {
          this.barEchartOption.series[0].data.push(v.singleSale)
        } else if (type === '2') {
          this.barEchartOption.series[0].data.push(v.singleStation)
        } else if (type === '3') {
          this.barEchartOption.series[0].data.push(v.genlotIndex)
        } else if (type === '4') {
          this.barEchartOption.series[0].data.push(v.singleAcrea)
        } else if (type === '5') {
          this.barEchartOption.series[0].data.push(v.singlePopulation)
        }
      })
    },
    async getInfo(areaCode, dataType) {
      // 先注释
      this.barEchartOption.yAxis[0].data = []
      this.barEchartOption.series[0].data = []
      let res = await this.postJsonWithMask('station',
        {
          apiCode: 300171,
          content: {
            dataType: dataType,
            regionCode: areaCode + ''
          }
        })
      if (res.code === '0') {
        // 数据缓存
        this.dataList = res.content
        this.currentIndex = 0
        // 默认显示总销量
        res.content.forEach(v => {
          // 先注释
          this.barEchartOption.yAxis[0].data.push(v.regionName)
          this.barEchartOption.series[0].data.push(v.totalSale)
        })
      }
    }
  },
  mounted() {
    // this.createMap()
    this.getInfo(this.defaultAreaCode, this.dataType)
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const id = 'sync_echarts'
      // const url = 'https://cdn.bootcss.com/echarts/4.0.4/echarts.min.js'
      const url = 'https://cdnjs.cloudflare.com/ajax/libs/echarts/4.1.0.rc2/echarts.min.js'
      syncScript(id, url, fn)

      function fn() {
        setTimeout(function () {
          vm.createMap()
        }, 200)
      }
    })
  }
}
</script>

<style lang="scss">
  @import "../../../../../../assets/css/station/zoneAnalysis";
.runAnalysis{
  .barTitle {
    position: absolute;
    top: 10%;
  }
  .barTimeline{
    height: 100%;
    position: relative;
    ul{
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      li{
        margin: 0!important;
        padding: 0 0 12px;
        list-style: none;
        position: relative;
        .liTail{
          height: 100%;
          border-left: 1px solid #e9eaec;
          position: absolute;
          left: 6px;
          top: 0;
        }
        .liHead{
          width: 13px;
          height: 13px;
          background-color: #fff;
          border-radius: 50%;
          border: 1px solid rgb(210, 210, 210);
          color: rgb(210, 210, 210);
          position: absolute;
        }
        .headBlue{
          border-color: #2d8cf0;
          color: #2d8cf0;
        }
        .liContent{
          padding: 1px 10px 10px 0;
          width: 100px;
          left: -100px;
          text-align: right;
          font-size: 14px;
          position: relative;
          top: -3px;
          .timelineTitle{
            padding-right: 6px;
            color: #495060;
          }
          .active{
            color: #57a3f3;
          }
        }
      }
      li:nth-last-of-type(1) {
        .liTail{
          display: none;
        }
      }
    }
  }
}
</style>