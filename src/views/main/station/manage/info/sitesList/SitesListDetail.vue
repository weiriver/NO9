<template>
  <div class="outter-wrapper">
    <div style="margin-bottom: 20px">
      <Tabs @tab-click="tabsChange" v-model="tabName" type="border-card">
        <TabPane label="站点明细" name="siteDetail"></TabPane>
        <TabPane label="销量概况" name="saleInfo"></TabPane>
        <TabPane label="销量详情" name="saleDetail"></TabPane>
        <TabPane label="人员情况" name="userInfo"></TabPane>
        <TabPane label="经营分析" name="orAnalysis"></TabPane>
        <TabPane label="履历" name="resume"></TabPane>
        <TabPane label="变更记录" name="updateRecord"></TabPane>
        <TabPane label="奖惩信息" name="prz_And_pub"></TabPane>
        <TabPane label="信息发布" name="publish"></TabPane>
        <TabPane label="巡查记录" name="patrolRecord"></TabPane>
      </Tabs>
    </div>
    <div v-if="tabName === 'siteDetail'">
      <div>
        <DetailList :title="'站点基本信息'" :keyName="'name'" :valueName="'value'" :detailList="siteDetail_site"></DetailList>
      </div>
      <div v-if="siteDetail_geo.length !== 0">
        <DetailList :title="'站点地理'" :keyName="'name'" :valueName="'value'" :detailList="siteDetail_geo"></DetailList>
      </div>
      <div v-if="siteDetail_geo.length === 0">
        <h3>站点地理</h3>
        <div class="placeholder">暂无数据</div>
      </div>
      <div>
        <DetailList :title="'热线信息'" :keyName="'name'" :valueName="'value'" :detailList="siteDetail_hotLine"></DetailList>
      </div>
    </div>
    <div v-if="tabName === 'saleInfo'">
      <div v-loading="spinYearOrd">
        <h3 class="mb20">
          销量概况
        </h3>
        <div class="sale_echart">
          <div class="e_left">
            <div id="pie"></div>
          </div>
          <div class="e_right">
            <div id="bar"></div>
          </div>
        </div>
        <div class="year-ord-div" v-if="yearOrd">
          年销量排行
          <span class="year-ord">{{ yearOrd.countyOrd }}</span>/{{ yearOrd.countyStationCount }}({{
          yearOrd.countryRegionName }}排行);
          <span class="year-ord">{{ yearOrd.cityOrd }}</span>/{{ yearOrd.cityStationCount }}({{
          yearOrd.cityRegionName }}排行);
          <span class="year-ord">{{ yearOrd.provOrd }}</span>/{{ yearOrd.proStationCount }}({{
          yearOrd.proRegionName }}排行)。
          <!--<Spin size="large" fix v-if="spinYearOrd"></Spin>-->
        </div>
      </div>
    </div>
    <div v-if="tabName === 'saleDetail'">
      <h3>销量详情</h3>
      <div class="detail-form" v-loading="spinSaleDetail">
        <Form :model="ruleForm" ref="formRef" label-width="110px">
          <FormItem label="游戏范围">
            <Checkbox :indeterminate="indeterminateSalesDetails" :value="checkAllSalesDetails"
                      @click.prevent.native="handleCheckAllGame">全选
            </Checkbox>
            <CheckboxGroup v-model="checkGameAllArray" @change="checkAllGameChange">
              <Checkbox v-for="item in gameList" :label="item.value" :key="item.value">{{ item.text }}
              </Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="时间范围">
            <DatePicker type="daterange" v-model="selectDateValue" placement="bottom-end"
                        @change="archiveDateEvent"></DatePicker>
          </FormItem>
          <FormItem label="快速设置时间">
            <Select clearable v-model="quickDate" @change="chooseQuickDate">
              <Option v-for="item in quickDateType" :value="item.value" :key="item.value" :label="item.text">
              </Option>
            </Select>
          </FormItem>
          <FormItem label="查询颗粒度">
            <Select clearable v-model="salesDetailsSearch.dateType">
              <Option v-for="item in dateTypeArray" :value="item.value" :key="item.value" :label="item.text">
              </Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="getSalesInfo()">查询</Button>
          </FormItem>
        </Form>
        <div style="position: relative;width: 100%;">
          <div class="saleDetailEchart" id="bar2"></div>
        </div>
      </div>
    </div>
    <div v-if="tabName === 'userInfo'">
      <div>
        <DetailList :title="'业主信息'" :keyName="'name'" :valueName="'value'" :detailList="ownerDetail"></DetailList>
      </div>
    </div>
    <div v-if="tabName === 'orAnalysis'">
        <!--地图容器-->
      <div class="or-wrapper">
        <div v-show="btnSwitch == 1" style="position: relative;min-height: 500px;">
          <div v-show="btnSwitch == 1 && hasMap" class="emptyTxt">
            暂无地理信息
          </div>
          <div id="my_container" v-show="btnSwitch == 1 && !hasMap" :style="{height:mapHeight+'px'}">
          </div>
          <!--<Spin size="large" fix v-if="spinMap"></Spin>-->
        </div>
        <!--经营分析对比-->
        <div class="analysisCompare" v-show="btnSwitch == 2" style="position: relative;">
          <div id="analyser"></div>
          <div class="analysisCompareTable">
            <Table highlight-row :data="data5">
              <TableColumn type="index" label="序号"></TableColumn>
              <TableColumn prop="stationCode" label="站点编号"></TableColumn>
              <TableColumn prop="saleMoney" label="销售额（元）"></TableColumn>
              <TableColumn prop="singleMoney" label="单票金额（元）"></TableColumn>
              <TableColumn label="建站时间">
                <template slot-scope="scope">{{ToDate(scope.row.setUpTime)}}</template>
              </TableColumn>
            </Table>
          </div>
          <!--<Spin size="large" fix v-if="spinAnalysis"></Spin>-->
        </div>
        <!--地图右上角的按钮-->
        <div class="btnSwitch">
          <Button type="primary" v-if="btnSwitch == 1" @click="btnSwitch=2">经营分析对比</Button>
          <Button type="success" v-else @click="btnSwitch=1">返回地图</Button>
        </div>
      </div>
    </div>
    <div v-if="tabName === 'resume'">
      <lvli :stationCode="code"></lvli>
    </div>
    <div v-if="tabName === 'updateRecord'">
      <ChangeRecord :stationCode="code"></ChangeRecord>
    </div>
    <div v-if="tabName === 'prz_And_pub'">
      <JiangCheng :stationCode="code"></JiangCheng>
    </div>
    <div v-if="tabName === 'publish'">
      <InforPublish :stationCode="code"></InforPublish>
    </div>
    <div v-if="tabName === 'patrolRecord'">
      <PatrolRecord :stationCode="code"></PatrolRecord>
    </div>
  </div>
</template>

<script>
  import lvli from './Lvli'
  import ChangeRecord from './ChangeRecord'
  import JiangCheng from './JiangCheng'
  import InforPublish from './InforPublish'
  import PatrolRecord from './PatrolRecord'
  import {mapState} from 'vuex'
  // import syncScript from '../../../../../../util/sync_script'
  import remoteLoad from '@/util/remoteLoad'
  import {GetDateStart} from '../../../../../../util/util'
export default {
  name: 'a',
  components: {
    lvli, ChangeRecord, JiangCheng, InforPublish, PatrolRecord
  },
  data() {
    return {
      tabName: 'saleDetail',
      checkGameAllArray: [],
      siteDetail_site: [], // 站点基本信息
      siteDetail_geo: [], // 站点基本信息-地理
      siteDetail_hotLine: [], // 站点基本信息-热线
      btnSwitch: 1, // “地图”与“经营分析对比”切换 1：地图，2：经营分析对比
      hasMap: true,
      mapHeight: 500,
      spinMap: false,
      yearOrd: {},
      ruleForm: {},
      gameList: [],
      ownerDetail: [], // 业主详情
      data5: [], // 经营分析表数据
      salesDetailsSearch: {
        dateType: 'day'
      },
      dateTypeArray: [
        {
          text: ' 按天',
          value: 'day'
        },
        {
          text: ' 按周',
          value: 'week'
        },
        {
          text: ' 按月',
          value: 'month'
        },
        {
          text: ' 按年',
          value: 'year'
        }
      ],
      quickDateType: [
        {
          text: ' 本周',
          value: 'nowW'
        },
        {
          text: ' 本月',
          value: 'nowM'
        },
        {
          text: ' 近三月',
          value: 'nowThree'
        },
        {
          text: ' 本年',
          value: 'nowY'
        }
      ],
      id: '',
      code: '',
      spinYearOrd: true,
      spinSaleDetail: false,
      indeterminateSalesDetails: false,
      checkAllSalesDetails: true, // 是否全选
      selectDateValue: [], // 选择日期
      checkGameAllArray: [],
      quickDate: 'nowW',
    }
  },
  computed: {
    ...mapState({
      // 设备状态
      stationTypeList: state => state['station_enumDic']['StationEnum$stationTypeEnum'],
      bankTypeList: state => state['station_enumDic']['bankType']
    })
  },
  methods: {
    getStationType(type) {
      return this.stationTypeList[type].text
    },
    tabsChange (val) {
      this.tabName = val.name
      if (this.tabName === 'saleInfo') { // 创建详细信息中的月销量图和年销量echart图
        this.createEchart()
      } else if (this.tabName === 'saleDetail') { // 创建销量详情echart图
        this.getSalesInfo()
        // vm.createSaleDetailEchart() 画图必须先获取数据
      } else if (this.tabName === 'orAnalysis') {
        this.getAnalyze()
      } else if (this.tabName === 'siteDetail') {
        this.getInfo(this.$route.params.id)
      }
    },
    /* 经营分析部分开始 */
    // 创建“经营分析对比”的echart图
    // 获取该站点的地理信息
    getMapInfo() {
      this.spinMap = true
      this.postJson('station', {
        apiCode: 300061,
        content: {
          stationCode: this.detail.stationCode
        }
      }).then(res => {
        console.log(res)
        if (res.content.dataList[0]) {
          var {stationLat, stationLng} = res.content.dataList[0]
          this.mapObj = {stationLat, stationLng}
          this.createAmap()
          this.hasMap = true
        } else {
          this.hasMap = false
          this.spinMap = false
        }
      })
    },
    /* 创建地图 */
    async createAmap() {
      // import AMap from 'AMap'   // 在页面中引入高德地图
      var AMap = this.AMap
      const that = this
      console.log(that.mapObj.stationLng, that.mapObj.stationLat)
      if (that.mapObj.stationLng === null || that.mapObj.stationLat === null) {
        return
      }
      let map = this.map = new AMap.Map('my_container',
        {
          zoom: 16,
          // center: [106.575202, 29.606268],
          // center: [113.647191, 34.76165],
          center: [that.mapObj.stationLng, that.mapObj.stationLat],
          expandZoomRange: true
        }
      )
      this.map = map
      map.setDefaultCursor('default') // 设置默认鼠标样式
      AMap.plugin(['AMap.ToolBar'],
        function () {
          map.addControl(new AMap.ToolBar())
        })
      map.plugin(['AMap.Scale'], function () {
        var scale = new AMap.Scale()
        map.addControl(scale)
      })
      // map.setCity(500105) // 根据城市代码，设置城市
      // 标记点
      // map.setCity(500105) // 根据城市代码，设置城市

      var makersArr = []
      let img = require('@/assets/img/station/center.png')
      var markera = new AMap.Marker({
        // position: [106.575202, 29.606268],
        position: [that.mapObj.stationLng, that.mapObj.stationLat],
        // icon: '../../static/img/center.png',
        icon: new AMap.Icon({
          size: new AMap.Size(17, 39), // 图标大小
          image: img
        }),
        // offset: new AMap.Pixel(-9, -36),
        offset: new AMap.Pixel(-9, -39),
        draggable: false,
        cursor: 'move',
        raiseOnDrag: true
      })

      // 设置label标签
      markera.setLabel({ // label默认蓝框白底左上角显示，样式className为：amap-marker-label
        offset: new AMap.Pixel(24, 44), // 修改label相对于maker的位置
        content: that.detail.stationCode
      })
      markera.setMap(map)
      makersArr.push(markera)

      var circle
      var circleArrs = this.circleArrs = []

      function createCircle(pos) {
        circle = new AMap.Circle({
          center: new AMap.LngLat(pos[0] + '', pos[1] + ''), // 圆心位置
          radius: 200, // 半径
          strokeColor: '#F33', // 线颜色
          strokeOpacity: 1, // 线透明度
          strokeWeight: 1, // 线粗细度
          strokeStyle: 'dashed', // 线透明度
          fillColor: '#f37d77', // 填充颜色
          fillOpacity: 0.5 // 填充透明度
        })
        circleArrs.push(circle)
        circle.setMap(map)
      }

      createCircle([that.mapObj.stationLng, that.mapObj.stationLat])
      this.spinMap = false
    },
    createAnalyserEchart(analyserData) {
      console.log(analyserData)
      setTimeout(() => {
        var echarts = require('echarts')
        // 饼状图---基于准备好的dom，初始化echarts实例
        var myChartPie = echarts.init(document.getElementById('analyser'))
        var optionAnalyser
        optionAnalyser = {
          title: {
            text: '基础雷达图'
          },
          tooltip: {},
          legend: {
            data: analyserData.map(e => {
              return 'stationCode:' + e.stationCode
            })
          },
          radar: {
            // shape: 'circle',
            name: {
              textStyle: {
                color: '#fff',
                backgroundColor: '#999',
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            center: ['50%', '50%'],
            radius: 120,
            shape: 'circle',
            indicator: [
              {name: '销售额'},
              {name: '单票金额'},
              {name: '建站时间'}
            ]
          },
          series: [{
            name: '',
            type: 'radar',
            // areaStyle: {normal: {}},
            data: analyserData.map(e => {
              let value = []
              value.push(e.saleMoney)
              value.push(e.singleMoney)
              let time = this.ToDate(e.setUpTime).split('-').join('')
              value.push(time)
              var result = {
                value: value,
                name: 'stationCode:' + e.stationCodegetAnalyze
              }
              return result
            })
          }]
        }
        console.log(optionAnalyser)
        // this.spinAnalysis = false
        myChartPie.setOption(optionAnalyser, true)
      }, 200)
    },
    getAnalyze() {
      this.spinAnalysis = true
      this.postJson('station', {
        apiCode: 300011,
        content: {
          stationCodes: this.code
        }
      }).then(res => {
        console.log('经营分析数据获取', res)
        this.data5 = res.content
        this.createAnalyserEchart(res.content)
        this.spinAnalysis = false
      })
    },
    /* 经营分析部分结束 */
    loadScript(vm) {
      // const id = 'sync_echarts'
      // const url = 'https://cdn.bootcss.com/echarts/4.0.4/echarts.min.js'
      const url = 'https://cdnjs.cloudflare.com/ajax/libs/echarts/4.1.0.rc2/echarts.min.js'
      remoteLoad(url).then(fn)

      function fn() {
        // if (vm.tabsIndex === '站点明细') { // 创建销量概况标签中的月销量图和年销量echart图
        if (vm.tabName === 'saleInfo') { // 创建详细信息中的月销量图和年销量echart图
          vm.createEchart()
        } else if (vm.tabName === 'saleDetail') { // 创建销量详情echart图
          vm.getSalesInfo()
          // vm.createSaleDetailEchart() 画图必须先获取数据
        } else if (vm.tabName === 'orAnalysis') {
          vm.getAnalyze()
        }
      }

      // const that = vm
      // // const id2 = 'sync_amap'
      // const url2 = 'http://webapi.amap.com/maps?v=1.4.4&key=4199fe377dd77297c6e4cee01bd0b266&plugin=AMap.MarkerClusterer,AMap.Riding'
      // remoteLoad(url2).then(fn2())
      //
      // function fn2() {
      //   // var AMap = require('AMap')
      //   that.AMap = AMap
      //   that.mapHeight = that.TableHeightCal('analyserBox', 52)
      //   that.getMapInfo()
      // }
    },
    /* 销售详情部分开始 */
    // checkbox 变化的时候
    checkAllGameChange(data) {
      if (data.length === this.gameList.length) {
        this.indeterminateSalesDetails = false
        this.checkAllSalesDetails = true
      } else if (data.length > 0) {
        this.indeterminateSalesDetails = true
        this.checkAllSalesDetails = false
      } else {
        this.indeterminateSalesDetails = false
        this.checkAllSalesDetails = false
      }
    },
    // checkbox 全选
    handleCheckAllGame() {
      if (this.indeterminateSalesDetails) {
        this.checkAllSalesDetails = false
      } else {
        this.checkAllSalesDetails = !this.checkAllSalesDetails
      }
      this.indeterminateSalesDetails = false

      if (this.checkAllSalesDetails) {
        this.checkGameAllArray = this.gameList.map(e => {
          return e.value
        })
      } else {
        this.checkGameAllArray = []
      }
    },
    // 日期
    archiveDateEvent(event) {
      console.log('销量详情的日期', this.selectDateValue)
    },
    chooseQuickDate(value) {
      console.log('value', value)
      var startTime = ''
      if (value === 'nowW') {
        startTime = GetDateStart.getWeekStartDate(new Date())
      } else if (value === 'nowM') {
        startTime = GetDateStart.getMonthStartDate(new Date())
      } else if (value === 'nowThree') {
        startTime = GetDateStart.getNearlyThreeStartDate(new Date())
      } else if (value === 'nowY') {
        startTime = GetDateStart.getYearStartDate(new Date())
      }
      // this.selectDateValue[0] = new Date(startTime)
      this.$set(this.selectDateValue, 0, new Date(startTime))
      this.$set(this.selectDateValue, 1, new Date())
    },
    // 获取销售详情
    getSalesInfo() {
      console.log('获取销售详情')
      this.spinSaleDetail = true
      this.formatSaleInfo()
      console.log('获取销售详情2')
      this.postJson('station', {
        apiCode: 300012,
        content: this.salesDetailsSearch
      }).then(res => {
        console.log('销量详情返回', res.content)
        var echartData = JSON.parse(res.content)
        this.createSaleDetailEchart(echartData)
        this.spinSaleDetail = false
      })
    },
    // 创建“销量详情”中的echart图
    createSaleDetailEchart(salesData) {
      setTimeout(function () {
        var echarts = require('echarts')
        // 柱状图---基于准备好的dom，初始化echarts实例
        var myChartBar = echarts.init(document.getElementById('bar2'))
        var optionBar
        optionBar = {
          title: {
            text: '销量',
            subtext: '电脑票(元)',
            x: 'left'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params) {
              var k = params[0].name + '<br>'
              for (var i = 0; i < params.length; i++) {
                k += params[i].marker + params[i].seriesName + ': ' + params[i].value + '元' + '<br>'
              }
              return k
            }
          },
          legend: {
            data: salesData.items
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: salesData.dates
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: salesData.items.map(e => {
            let type = 'bar'
            if (e.includes('平均')) {
              type = 'line'
            }
            return {
              name: e,
              type,
              data: salesData.detail[e]
            }
          })
        }
        myChartBar.setOption(optionBar, true)
      }, 300)
    },
    getGameList() {
      this.postJson('station', {
        apiCode: 300162,
        content: {}
      }).then(res => {
        this.gameList = res.content
        this.checkGameAllArray = this.gameList.map(e => {
          return e.value
        })
      })
    },
    /* 销售详情部分结束 */
    /* 站点明细销售概况部分开始 */
    createEchart() {
      this.getDetailEchartsData('month')
      this.getDetailEchartsData('year')
      this.getDetailEchartsData('yearOrd')
    },
    // 获取详情
    getDetailEchartsData(type) {
      if (type === 'yearOrd') {
        this.spinYearOrd = true
      }
      this.postJson('station', {
        apiCode: 300010,
        content: {
          stationCode: this.code,
          salesType: type
        }
      }).then(res => {
        if (type === 'month') {
          this.createEchartMonthBar(res.content)
        } else if (type === 'year') {
          this.createEchartYearPie(res.content)
        } else if (type === 'yearOrd') {
          this.yearOrd = res.content
          this.spinYearOrd = false
        }
      })
    },
    // 创建“详细信息”中的月销量的柱状图
    createEchartMonthBar(data) {
      var monthArray = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
      var echarts = require('echarts')
      // 柱状图---基于准备好的dom，初始化echarts实例
      var myChartBar = echarts.init(document.getElementById('bar'))
      var optionBar
      optionBar = {
        title: {
          text: '月销量',
          subtext: '电脑票(万元)',
          x: 'left'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            var k = params[0].name + '<br>'
            for (var i = 0; i < params.length; i++) {
              k += params[i].marker + params[i].seriesName + ': ' + params[i].value + ' 万元' + '<br>'
            }
            return k
          }
        },
        legend: {
          // 拿到游戏类型的名字
          data: data ? data.map(e => e.name) : []
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: data ? monthArray.slice(0, data[0].data.length) : []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: data
      }
      myChartBar.setOption(optionBar, true)
    },
    // 创建“详细信息”中的年销量的饼图
    createEchartYearPie(data) {
      console.log('createEchartYearPie', data)
      var echarts = require('echarts')
      // 饼状图---基于准备好的dom，初始化echarts实例
      var myChartPie = echarts.init(document.getElementById('pie'))
      var optionPie
      optionPie = {
        title: {
          text: '年销量',
          subtext: '单位:万元',
          x: 'left',
          y: '30'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}({d}%)<br> 年销量: {c}万元 '
        },
        legend: {
          orient: 'horizontal',
          left: '20',
          top: '0',
          data: data ? data.map(e => e.name) : []
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: data ? data.map(e => {
              return {
                name: e.name,
                value: e.data[0]
              }
            }) : [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChartPie.setOption(optionPie, true)
      /*
      *      setTimeout(function () {
        myChartPie.setOption({
          series: [{
            data: [
              {value: 344, name: '双色球'},
              {value: 244, name: '3D'},
              {value: 144, name: '七乐彩'},
              {value: 44, name: '快3游戏'}
            ]
          }]
        })
      }, 2000)
      */
    },
    /* 站点明细销售概况部分结束 */
    // 查询按钮
    searchBtn(page) {
      this.searchBox_flag = !this.searchBox_flag
    },
    // 调取后台获取数据
    sliderValueChange(val) {
      var AMap = this.AMap
      var that = this
      if (this.timer) {
        window.clearTimeout(this.timer)
      }
      this.timer = setTimeout(function () {
        that.map.clearMap() // 先清楚旧数据makers
        // 标记点
        that.points.push([106.581253, 29.607928])
        that.points.push([106.567091, 29.604533])
        that.points.push([106.565911, 29.606921])
        var markers = []
        that.points.forEach(function (marker) {
          var k = new AMap.Marker({
            map: that.map,
            icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b2.png', // 地图上marker的图片
            position: [marker[0], marker[1]],
            offset: new AMap.Pixel(-12, -36)
          })
          markers.push(k)
        })
      }, 200)
    },
    // 获取详情
    getInfo(id) {
      console.log('获取详情')
      this.postJson('station', {
        apiCode: 300004,
        content: {
          id: id
        }
      }).then(res => {
        // if(res)
        let data = res.content
        this.code = data.stationCode
        this.siteDetail_site = [
          {name: '站点编号', value: data.stationCode},
          {name: '站点地址', value: data.stationAddr},
          {name: '区域编码', value: data.regionCode},
          {name: '区域名称', value: data.regionName},
          {name: '创建时间', value: data.setUpTime},
          {name: '经营方式', value: data.operateModeName},
          {name: '等级', value: data.stationStar},
          {name: '站点状态', value: data.stationStatus.text},
          {name: '站点邮编', value: data.stationPostcode},
          {name: '年租金', value: data.rental},
          {name: '站点面积', value: data.stationAcreage},
          {name: '建站时间', value: this.ToTime(data.setUpTime)},
          {name: '合同签订情况', value: data.contractSigning ? data.contractSigning.text : ''},
          {name: '合同版本号', value: data.contractVersion},
          {name: '合同开始时间', value: this.ToTime(data.contractSignTime)},
          {name: '合同到期时间', value: this.ToTime(data.contractExpireTime)},
          {name: '保证金', value: data.bail},
          {name: '是否快3', value: data.operateKuai3?'是':'否'},
          {name: '经营模式名', value: data.operateModeName},
          {name: '站点渠道类型名称', value: data.stationChannelTypeName},
          {name: '经营类别', value: data.operateTypes ? data.operateTypes.text: ''},
          {name: '站点电话', value: data.stationPhone},
          {name: '站点来源', value: data.stationOrigin ? data.stationOrigin.text : ''},
          {name: '银行类型', value: data.bankTypeName},
          {name: '银行账号', value: data.bankAccount},
          {name: '银行电话', value: data.bankAccountMobile}
        ]
        if (data.stationMap !== null) {
          this.siteDetail_geo = [
            {name: '地理信息ID', value: data.stationMap.id},
            {name: '站点经度', value: data.stationMap.stationLng},
            {name: '站点纬度', value: data.stationMap.stationLat},
            {name: '地理信息来源', value: data.stationMap.mapSource ? data.stationMap.mapSource.text : ''}]
        }
        this.siteDetail_hotLine = [
          {name: '代销商名称', value: data.stationHotline.agentName},
          {name: '账户控制类型', value: data.stationHotline.accountTypeName},
          {name: '主站编号', value: data.stationHotline.masterStationId},
          {name: '代销费类型', value: data.stationHotline.commissionTypeName},
          {name: '站票面打印地址', value: data.stationHotline.printAddr},
          {name: '可用余额下限', value: data.stationHotline.accountLimit}
        ]
        this.ownerDetail = [
          {name: '姓名', value: data.stationMaster.nameX},
          {name: '文化程度', value: data.stationMaster.cultureDegree},
          {name: '年龄', value: data.stationMaster.age},
          {name: '身份证号', value: data.stationMaster.idCard},
          {name: '联系方式', value: data.stationMaster.mobile},
          {name: '户籍地址', value: data.stationMaster.hkAddress},
        ]
      })
    },
    // tabs切换
    // tabsChange(item) {
    //   this.tabsIndex = item.name
    //   console.log('item.apicode', item.apiCode, this.auth(item.apiCode))
    // },
    // 销售详情查询初始化
    formatSaleInfo() {
      this.salesDetailsSearch.stationCode = this.code
      this.salesDetailsSearch.startDate = this.ToDate(this.selectDateValue[0].getTime()).split('-').join('')
      this.salesDetailsSearch.endDate = this.ToDate(this.selectDateValue[1].getTime()).split('-').join('')
      this.salesDetailsSearch.games = this.checkGameAllArray.join(',')
    }
  },
  mounted: async function () {
    // this.query()
    // 路由传参
    var {id} = this.$route.params
    console.log(id)
    console.log({name: '站点详情', to: '/manage/sitesListDetail/' + id})
    // this.$store.commit('SET_BREADCRUMB_LAST', {name: '站点详情', to: '/manage/sitesListDetail/' + id})
    this.getGameList()
    await this.getInfo(id)
    console.log('理论上的获取详情的 await 之后执行的')
    // 初始化销售详情里面的时间范围
    this.chooseQuickDate('nowW')
    // // 兼容IE显示问题
    // setTimeout(() => {
    //     this.showContent = true
    // }, 200)
  }
}
</script>

<style lang="scss">
  .outter-wrapper{
    .el-tabs--border-card{
      &>.el-tabs__content{
        padding: 0;
      }
    }
    .placeholder{
      font-size: 14px;
      line-height: 40px;
    }
    .sale_echart {
      margin-top: 12px;
      display: flex;
      height: 200px;
      .e_left {
        flex: 2;
        #pie {
          height: 100%;
        }
      }
      .e_right {
        flex: 3;
        #bar {
          height: 100%;
        }
      }
    }
  }
  .year-ord-div {
    position: relative;
  }
  .year-ord {
    display: inline-block;
    background-color: #ffe855;
    color: #ffffff;
    font-size: 19px;
    font-weight: bold;
    border-radius: 5px;
    padding: 0px 10px;
    margin-top: 10px;
    margin-bottom: 0;
    margin-right: 2px;
  }
  .detail-form{
    .el-form-item__content{
      .el-input__inner{
        width: 303px;
      }
      .el-checkbox__label {
        display: inline-block;
        padding-left: 4px;
        line-height: 19px;
        font-size: 14px;
      }
      .el-checkbox-group{
        .el-checkbox{
          margin-left: 12px;
        }
        .el-checkbox:nth-child(1){
          margin-left: 0;
        }
      }
    }
    .saleDetailEchart {
      width: 100%;
      height: 300px;
      margin-top: 20px;
    }
  }
  .or-wrapper{
    position: relative;
    .emptyTxt{
      line-height: 200px;
      text-align: center;
    }
    #my_container, .analysisCompare {
      width: 100%;
      height: auto;
      position: relative;
      padding-top: 25px;
      /*border: 1px solid #eaebed;*/
      .slider {
        position: absolute;
        z-index: 100;
        width: 80%;
        bottom: 20px;
        left: 50%;
        margin-left: -40%;
      }
      .analysisCompareTable {
        box-sizing: border-box;
        padding: 20px;
      }
    }

    .analysisCompare {
      border: none;
    }
    .btnSwitch {
      position: absolute;
      right: 60px;
      top: 22px;
      width: auto !important;
      height: 30px;
      z-index: 100;
      button {
        float: right;
      }
    }
    #analyser {
      width: 600px;
      height: 400px;
    }
  }
</style>
