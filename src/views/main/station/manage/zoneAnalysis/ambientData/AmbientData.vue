<template>
  <div class="ambientData wrapper">
    <div class="muban">
      <ImportFile
              :conf="[]"
              :exportTitle="importTitle"
              :btnStyle="'border-radius:3'"
              :showAreaSelect="false"
              :recordObj="recordObj"
              :downloadObj="downloadObj"
              :selectList ="yearList"
              :selectTitle = "importSelectTitle"
              :showSelect ="importShowSelect"
              :tabPaneLabel="'环境数据导入'"
              :uploadApiCode="300197" >
      </ImportFile>
    </div>
    <div class="ambient_content wrapper_content">
      <!--左边-->
      <div class="leftbox mt12 flex6">
        <ButtonGroup size="small">
          <Button v-for="(item,index) in btnList" v-bind:type="item.type"
                  @click="querySingle(item.btnum, item.unit)"
                  :key="item.id">{{item.value}}
          </Button>
        </ButtonGroup>
        <!--echart地图-->
        <div class="map-parent">
          <div id='echartMap'></div>
          <div id='echartMap_child'></div>
        </div>
      </div>
      <!--右边-->
      <div class="rightbox" style="padding-top: 47px;">
        <h1 style="font-size: 18px;line-height: 30px">{{Obj.content.regionName === ''?'全省' : Obj.content.regionName}}</h1>
        <!--手风琴-->
        <Collapse v-model="defaultPanel" accordion class="myCollapse">
          <CollapseItem v-for="(value, key ,index) in dataList" :key="index+1" :title="key">
            <!--{{key}}-->
            <div class="collapseItemLine" v-if="defaultBtnKey === 0 || defaultBtnKey === 1" v-for="(data,index) in value">
              <span v-if="defaultBtnKey === 1">{{data.regionName}} </span>
              <span v-if="defaultBtnKey === 0">人口（万人）</span>
              <span>{{data.population}}{{unit}}</span>
            </div>
            <div class="collapseItemLine" v-if="defaultBtnKey === 0 || defaultBtnKey === 2" v-for="(data,index) in value">
              <span v-if="defaultBtnKey === 2">{{data.regionName}} </span>
              <span v-if="defaultBtnKey === 0">面积（平方千米）</span>
              <span>{{data.acrea}}{{unit}}</span>
            </div>
            <div class="collapseItemLine" v-if="defaultBtnKey === 0 || defaultBtnKey === 3" v-for="(data,index) in value">
              <span v-if="defaultBtnKey === 3">{{data.regionName}} </span>
              <span v-if="defaultBtnKey === 0">GDP（元）</span>
              <span>{{data.gdp}}{{unit}}</span>
            </div>
            <div class="collapseItemLine" v-if="defaultBtnKey === 0 || defaultBtnKey === 4" v-for="(data,index) in value">
              <span v-if="defaultBtnKey === 4">{{data.regionName}} </span>
              <span v-if="defaultBtnKey === 0">人均收入（元）</span>
              <span>{{data.income}}{{unit}}</span>
            </div>
            <div class="collapseItemLine" v-if="defaultBtnKey === 0 || defaultBtnKey === 5" v-for="(data,index) in value">
              <span v-if="defaultBtnKey === 5">{{data.regionName}} </span>
              <span v-if="defaultBtnKey === 0">消费品零售总额（万元）</span>
              <span>{{data.spending}}{{unit}}</span>
            </div>
          </CollapseItem>
        </Collapse>
      </div>
    </div>
  </div>
</template>

<script>
  import syncScript from '../../../../../../util/sync_script'
export default {
  name: 'ambientData',
  data() {
    return {
      unit: '',
      recordObj: {apiCode: 200105, sysModule: 'station', tableName: 'environment_info_data'}, // 导入记录，200105为公共导入记录接口
      downloadObj: {sysModule: 'station', hostBizObj: 'environmentInfo_xls', hostBizId: '1'},
      yearList: [],
      importSelectTitle: '导入年份',
      importShowSelect: true,
      importTitle: '导入环境信息',
      btnList: [
        {
          value: '全部',
          btnum: 0,
          type: 'success',
          unit: ''
        },
        {
          value: '人口',
          btnum: 1,
          type: 'ghost',
          unit: '(万人)'
        },
        {
          value: '面积',
          btnum: 2,
          type: 'ghost',
          unit: '(km²)'
        },
        {
          value: 'GDP',
          btnum: 3,
          type: 'ghost',
          unit: '(亿元)'
        },
        {
          value: '人均收入',
          btnum: 4,
          type: 'ghost',
          unit: '(元)'
        },
        {
          value: '消费品零售总额',
          btnum: 5,
          type: 'ghost',
          unit: '(亿元)'
        }
      ],
      // 默认第一个按钮
      defaultBtnKey: 0,
      // 默认第一个按钮
      defaultBtnKey: 0,
      defaultRegionName: '全省',
      dataList: [],
      cityMap: {
        '郑州市': '410100',
        '开封市': '410200',
        '洛阳市': '410300',
        '平顶山市': '410400',
        '安阳市': '410500',
        '鹤壁市': '410600',
        '新乡市': '410700',
        '焦作市': '410800',
        '濮阳市': '410900',
        '许昌市': '411000',
        '漯河市': '411100',
        '三门峡市': '411200',
        '南阳市': '411300',
        '商丘市': '411400',
        '信阳市': '411500',
        '周口市': '411600',
        '驻马店市': '411700'
      },
      Obj: {
        apiCode: 300198,
        content: {
          regionName: '全省'
        }
      },
      // 默认展示第一个coll
      defaultPanel: '1'
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const id = 'sync_echarts'
      // const url = 'https://cdn.bootcss.com/echarts/4.0.4/echarts.min.js'
      const url = 'https://cdnjs.cloudflare.com/ajax/libs/echarts/4.1.0.rc2/echarts.min.js'
      syncScript(id, url, fn)
      function fn() {
        vm.createMap('河南', 'henan', 'echartMap')
      }
    })
  },
  methods: {
    // 查询
    async query(page) {
      if (page) this.Obj.content.page = 1
      let res = await this.postJson('station', this.Obj)
      this.dataList = res.content
      console.log(this.dataList)
    },
    // 创建地图
    createMap(name, code, mapId) {
      var echarts = require('echarts')
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById(mapId))

      var data = []
      var data2 = []
      var option

      // myChart.showLoading()
      const json = require('../../../../../../assets/province/henan/' + code + '.json')
      var geoJson = json
      for (var i = 0; i < geoJson.features
        .length; i++) {
        data.push({name: geoJson.features[i].properties.name, value: (Math.random() * 10000).toFixed(2)})
        data2.push({name: geoJson.features[i].properties.name, value: (Math.random() * 10000).toFixed(2) * 1.3})
      }
      option = {
        backgroundColor: '#fff', // 背景颜色
        tooltip: {
          trigger: 'item',
          // formatter: '{b}<br/>{c} (p / km2)'
          formatter: '{b}'
        },
        title: {
          text: name,
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
            dataView: { // 显示数据视窗
              show: false,
              readOnly: false
            }
          }
        },
        visualMap: { // 左侧颜色控制条
          show: false,
          min: 800,
          max: 10000,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['lightskyblue', 'yellow', 'orangered']
          }
        },
        series: [
          {
            name: code,
            type: 'map',
            mapType: code,
            label: {
              normal: {
                show: true, // 地图上显示地区名字
                textStyle: {
                  color: 'black'
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
      if (mapId === 'echartMap_child') {
        option.series[0].label.normal.show = false
      }
      echarts.registerMap(code, geoJson)
      myChart.setOption(option, true)

      const that = this
      // 单击显示下级地图
      myChart.off('click')
      myChart.on('click', function (params) {
        var cityName = params.name
        var cityCode = that.cityMap[cityName]
        that.Obj.content.regionName = cityName
        that.query()
        // 判断是否有下一级
        if (!cityCode) {
          return
        }
        console.log(option.series[0].label.normal.show)
        that.createMap(cityName, cityCode, 'echartMap_child')
      })
    },
    querySingle(btnum, unit) {
      this.defaultBtnKey = btnum
      this.unit = unit
      // 设置指定选中
      this.btnList.forEach((item, index) => {
        if (btnum === index) {
          item.type = 'success'
        } else {
          item.type = 'ghost'
        }
      })
      if (btnum === 0) {
        this.Obj.content.regionName = this.defaultRegionName
        this.query()
      } else {
        // 查询全部
        this.Obj.content.regionName = ''
        this.query()
      }
    },
    setYearList() {
      var date = new Date()
      var year = date.getFullYear()
      var i = 0
      while (i++ < 5) {
        this.yearList.push({value: year, label: year})
        year = parseInt(year) - 1
      }
    }
  },
  mounted() {
    this.query()
    this.setYearList()
  }
}
</script>

<style lang="scss">
  /*.ambientData{*/
    /*height: calc(100% - 51px);*/
    /*display: flex;*/
    /*flex-direction: column;*/
  /*}*/
  @import "../../../../../../assets/css/station/zoneAnalysis";
  /*.ambient {*/
    /*flex-direction: column;*/
    /*height: 100%;*/
  /*}*/

  .muban {
    padding: 12px 0;
  }
  .ambient_content {
    border: 1px solid #dddee1;
    border-color: #e9eaec;
    border-radius: 6px;
    margin: 0 12px 12px 0;
    .map-parent{
      width:100%;
      height:95%;
      display:flex
    }
    .map-parent>div{
      flex:1;
      height: 100%;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      padding: 10px;
    }
    .myCollapse .collapseItemLine{
      line-height: 30px;
      border-bottom: 1px solid #d2d2d2;
      padding: 5px;
      margin: 0 5px;
    }
    .myCollapse .collapseItemLine span:last-child{
      float: right;
      padding-right: 10px;
    }
    .el-collapse{
      border-left: 1px solid #ebeef5;
      border-right: 1px solid #ebeef5;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
    }
    .el-collapse-item__wrap{
      background: none;
    }
    .el-collapse-item__content{
      overflow-y: auto!important;
      max-height: 240px;
      background: none;
    }
  }
</style>