<template>
  <div class="distributeModel wrapper">
    <div class="wrapper_content">
      <!--左边-->
      <div class="leftbox mt12">

        <!--echart地图-->
        <div id='echartMap'></div>
      </div>
      <!--右边-->
      <div class="rightbox flex6">
        <h1 class="relative" style="font-size: 20px;line-height: 30px">
          {{title}}
          <!--<Goback style="top: 0;" :title="'详情'" :tar="'/manage/sitesList'" :type="'primary'"></Goback>-->
        </h1>
        <!--投注站总括(截止至2018-4-23)-->
        <div class="tableList">
          <div class="title">投注站总括</div>
          <Table stripe :data="data2" border style="width: 100%" v-if="data2.length>0">
            <TableColumn label="投注站(个)" prop="stationTotal"></TableColumn>
            <TableColumn label="今年新增(台)" prop="yearAdd"></TableColumn>
            <TableColumn label="在线投注机(台)" prop="stationBoot"></TableColumn>
            <TableColumn label="开机率" prop="bootRate">
              <template slot-scope="scope">
                <span>{{scope.row.bootRate}}%</span>
              </template>
            </TableColumn>
          </Table>
          <!--<Table :loading="loading" class="table" border stripe :columns="columns2" :data="data2" v-if="data2.length>0"></Table>-->
        </div>
        <!--销售总括(截止至2018-4-22)-->
        <div class="tableList">
          <div class="title">销售总括</div>
          <Table stripe :data="data4" border style="width: 100%" v-if="data4.length>0">
            <TableColumn label="今年销售任务" prop="yearGoal"></TableColumn>
            <TableColumn label="今年销售量" prop="yearSale"></TableColumn>
            <TableColumn label="本月销售量" prop="monthSale"></TableColumn>
            <TableColumn label="开机率" prop="finishRate">
              <template slot-scope="scope">
                <span>{{scope.row.finishRate}}%</span>
              </template>
            </TableColumn>
          </Table>
          <!--<Table :loading="loading" class="table" border stripe :columns="columns4" :data="data4" v-if="data4.length>0"></Table>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import syncScript from '../../../../../../util/sync_script'
export default {
  name: 'distributeModel',
  data() {
    return {
      title: '河南',
      loading: false,
      // 表格内容信息
      data4: [],
      // 表格内容信息
      data2: [],
      Obj: {
        apiCode: 300001,
        content: {
          regionName: ''
        }
      }
    }
  },
  methods: {
    recoverData() {
      this.Obj.content.regionName = ''
      this.title = '河南'
      this.query()
    },
    async query(page) {
      if (page) this.Obj.content.page = 1
      this.loading = true
      let res = await this.postJsonWithMask('station', this.Obj)
      this.loading = false
      const {
        stationTotal,
        stationBoot,
        yearAdd,
        bootRate
      } = res.content.content
      this.data2 = [{
        stationTotal,
        stationBoot,
        yearAdd,
        bootRate
      }]
      const {
        yearGoal,
        yearSale,
        monthSale,
        finishRate
      } = res.content.content
      this.data4 = [{
        yearGoal,
        yearSale,
        monthSale,
        finishRate
      }]
      console.log(this.data2)
    },
    // 创建地图
    createMap() {
      var echarts = require('echarts')
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('echartMap'))

      var data = []
      var data2 = []
      var option
      const that = this
      var name = 'henan'
      // myChart.showLoading()
      const json = require('../../../../../../assets/province/' + name + '.json')
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
          text: '河南',
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
            restore: {
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
            name: 'henan',
            type: 'map',
            mapType: name,
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
            roam: false, // 是否开启缩放
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
      myChart.setOption(option, true)
      myChart.on('click', function (params) {
        if (params.componentType === 'series') {
          var name = params.name
          console.log(name)
          that.title = name
          that.Obj.content.regionName = name
          that.query()
        }
      })

      myChart.on('restore', function (params) {
        that.recoverData()
      })

      // setTimeout(function () {
      //   myChart.setOption({
      //     series: [{
      //       name: 'henan',
      //       data: data2
      //     }]
      //   })
      // }, 2000)
    }
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
  },
  mounted() {
    this.query()
  }
}
</script>

<style lang="scss">
  @import "../../../../../../assets/css/station/zoneAnalysis";
</style>