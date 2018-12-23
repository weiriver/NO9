<template>
  <div class="situation-div">
    <div class="query">
      <Select clearable  v-model="timeCondition" placeholder="请选择" class="search-select" @change="timeOptionscommand">
        <Option v-for="item in timeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
        </Option>
      </Select>
    </div>

    <div class="statistics">
      <div class="line">
        <div class="box1">
          <div class="title">
            待入库商品数
          </div>
          <div class="num">
            {{ periodData.waitIn }}
          </div>
        </div>

        <div class="box">
          <div class="title">
            已入库商品数
          </div>
          <div class="num">
              {{ periodData.inTotal }}
          </div>
        </div>

        <div class="box">
          <div class="title">
            待出库商品数
          </div>
          <div class="num">
              {{ periodData.waitOut	 }}
          </div>
        </div>

        <div class="box">
          <div class="title">
            已出库商品数
          </div>
          <div class="num">
              {{ periodData.outTotal }}
          </div>
        </div>
        <div class="box">
          <div class="title">
            入库总数
          </div>
          <div class="num">
            {{ statisticsData.inTotal }}
          </div>
        </div>

        <div class="box">
          <div class="title">
            出库总数
          </div>
          <div class="num">
              {{ statisticsData.outTotal }}
          </div>
        </div>

        <div class="box">
          <div class="title">
            库存总数
          </div>
          <div class="num">
              {{ statisticsData.inventoryTotal }}
          </div>
        </div>

        <div class="box">
          <div class="title">
            损耗数量
          </div>
          <div class="num">
              {{ statisticsData.lossTotal }}
          </div>
        </div>
      </div>
    </div>

    <!--高德地图-->
    <!--<div id="my_container" class="mt20">-->
      <!--<Spin v-if="spinShow" fix></Spin>-->
      <!--坐标点-->
      <!--<div class="location" style="position: absolute; left: 20px;top: 20px;z-index: 151">-->
      <!--X:<span v-text="lng"></span>-->
      <!--Y:<span v-text="lat"></span>-->
      <!--</div>-->
    <!--</div>-->
    <!--消息及代办事宜-->
    <div class="todo-div mb20">
      <div class="todo-title">
        <span>
          消息及待办事宜
        </span>
        <span>
        </span>
      </div>
      <div class="todo-content">
          <div class="msg-line" v-for="item in receiveMessageData" :key="item.id">
              <div class="msg-title">{{ item.title }}</div>
              <div class="msg-time">{{ item.createDate }}</div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import remoteLoad from '@/util/remoteLoad'

export default {
  name: 'situation',
  data: function () {
    return {
      periodData: [],
      statisticsData: [],
      timeCondition: 'today',
      timeOptions: [
        {
          value: 'today',
          label: '今日'
        },
        {
          value: 'yesterday',
          label: '昨日'
        },
        {
          value: 'lastseven',
          label: '近七天'
        },
        {
          value: 'lastmonth',
          label: '近30天'
        }
      ],
      AMap: null,
      AMapUI: null,
      heatmap: {},
      receiveMessageData: []
    }
  },
  methods: {
    timeOptionscommand() {
      this.getPeriodStore()
    },
    initMap() {
      let MapCityName = 'xinjiang'
      // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
      let AMapUI = this.AMapUI = window.AMapUI
      let AMap = this.AMap = window.AMap
      setTimeout(() => {
        this.createAmap('郑州市')
      }, 10)
      // AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
      //   let mapConfig = {
      //     zoom: 16,
      //     cityName: MapCityName
      //   }
      //   if (this.lat && this.lng) {
      //     mapConfig.center = [this.lng, this.lat]
      //   }
      //   let map = new AMap.Map('js-container', mapConfig)
      //   // 加载地图搜索插件
      //   AMap.service('AMap.PlaceSearch', () => {
      //     this.placeSearch = new AMap.PlaceSearch({
      //       pageSize: 5,
      //       pageIndex: 1,
      //       citylimit: true,
      //       city: MapCityName,
      //       map: map,
      //       panel: 'js-result'
      //     })
      //   })
      //   // 启用工具条
      //   AMap.plugin(['AMap.ToolBar'], function () {
      //     map.addControl(new AMap.ToolBar({
      //       position: 'RB'
      //     }))
      //   })
      //   // 创建地图拖拽
      //   let positionPicker = new PositionPicker({
      //     mode: 'dragMap', // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
      //     map: map // 依赖地图对象
      //   })
      //   // 拖拽完成发送自定义 drag 事件
      //   positionPicker.on('success', positionResult => {
      //     // 过滤掉初始化地图后的第一次默认拖放
      //     if (!this.dragStatus) {
      //       this.dragStatus = true
      //     } else {
      //       this.$emit('drag', positionResult)
      //     }
      //   })
      //   // 启动拖放
      //   positionPicker.start()
      // })
    },
    createAmap(regionName) {
      const that = this
      var AMap = this.AMap
      let map = this.map = new AMap.Map('my_container',
        {
          zoom: 12,
          center: [113.65, 34.76],
          expandZoomRange: true
        }
      )
      map.setDefaultCursor('default') // 设置默认鼠标样式
      map.plugin(['AMap.ToolBar'],
        function () {
          map.addControl(new AMap.ToolBar())
        })
      map.plugin(['AMap.Scale'], function () {
        var scale = new AMap.Scale()
        map.addControl(scale)
      })
      // 输入框提示
      AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function () {
        // 实例化Autocomplete
        let autoOptions = {
          city: that.cityCode, // 兴趣点城市
          citylimit: true, // 将城市限定在兴趣点范围内
          input: 'tipinput'
        }
        let searchOptions = {
          city: that.cityCode,
          citylimit: true,
          map: map,
          panel: 'panel',
          pageSize: 5,
          pageIndex: 1
        }
        let placeSearch = new AMap.PlaceSearch(searchOptions)
        let autoComplete = new AMap.Autocomplete(autoOptions)
        that.placeSearch = placeSearch
        that.autoComplete = autoComplete
        map.addControl(autoComplete)
        map.addControl(placeSearch)
        AMap.event.addListener(autoComplete, 'select', function (e) {
          placeSearch.setCity(e.poi.adcode)
          placeSearch.search(e.poi.name)
          // that.query(e)
          that.setCity(e)
        })
      })
      AMap.plugin('AMap.DistrictSearch', function () {
        let districtSearch = new AMap.DistrictSearch({
          // 关键字对应的行政区级别，country表示国家
          // level: 'country',
          showBiz: false,
          //  显示下级行政区级数，1表示返回下一级行政区
          subdistrict: 1
        })
        that.districtSearch = districtSearch
        districtSearch.search(that.cityCode, function (status, result) {
          if (status === 'complete') {
            that.areaCodeArr = result.districtList[0].districtList
          }
        })
        // that.select_by_reginCode(that.cityCode)
      })
      /* 测量距离 */
      map.plugin(['AMap.RangingTool'], function () {
        that.ruler = new AMap.RangingTool(map)
        // that.ruler.turnOn()
        AMap.event.addListener(that.ruler, 'end', function (e) {
          that.ruler.turnOff()
        })
      })
      /* 热力图 */
      map.plugin(['AMap.Heatmap'], function () {
        // 初始化heatmap对象
        that.heatmap = new AMap.Heatmap(map, {
          radius: 25, // 给定半径
          opacity: [0, 0.8]
        })
        that.heatmap.hide()
        console.log(123)
      })

      /* 鼠标在地图上移动的时候，获取经纬度坐标 */
      map.on('mousemove', function (e) {
        that.lng = e.lnglat.getLng()
        that.lat = e.lnglat.getLat()
      })

      /* 设置右键菜单 */
      var contextMenu = new AMap.ContextMenu()  // 创建右键菜单
      let contextMenuPositon
      let middleLocationArr = [] // 存‘起终点’经纬度坐标,中间件
      let locationStartMarker = []
      let locationEndMarker = []
      contextMenu.addItem('设为起点', function () {
        if (locationStartMarker.length) {
          locationStartMarker[0].setMap(null)
          locationStartMarker = []
        }
        var marker = new AMap.Marker({
          map: map,
          position: contextMenuPositon, // 基点位置
          icon: 'http://webapi.amap.com/theme/v1.3/markers/n/start.png'
        })
        locationStartMarker.push(marker)
        that.locStart = JSON.parse(JSON.stringify(middleLocationArr))
      }, 0)
      contextMenu.addItem('设为终点', function () {
        if (locationEndMarker.length) {
          locationEndMarker[0].setMap(null)
          locationEndMarker = []
        }
        var marker = new AMap.Marker({
          map: map,
          position: contextMenuPositon, // 基点位置
          icon: 'http://webapi.amap.com/theme/v1.3/markers/n/end.png'
        })
        locationEndMarker.push(marker)
        that.locEnd = JSON.parse(JSON.stringify(middleLocationArr))
      }, 1)

      // 地图绑定鼠标右击事件——弹出右键菜单
      map.on('rightclick', function (e) {
        contextMenu.open(map, e.lnglat)
        contextMenuPositon = e.lnglat
        middleLocationArr = [e.lnglat.lng, e.lnglat.lat]
      })
      map.on('click', function (e) {
        that.addNewMarker(e)
      })
      map.on('moveend', function () {
        that.query()
      })
      map.on('complete', function () {
        that.query()
      })
    },
    async getPeriodStore () {
      var res = await this.postJson('ws', {
        apiCode: 501902,
        content: {
          timeCondition: this.timeCondition
        }
      })
      if (res.code == 0) {
        this.periodData = res.content
      }
    },
    async query() {
      var res = await this.postJson('ws', {
        apiCode: 501901,
        content: {
        }
      })
      if (res.code == 0) {
        this.statisticsData = res.content
      }
    },
    // 收件箱
    async queryReceiveMessages() {
      let param = {
        apiCode: 200090,
        content: {
          page: 1,
          limit: 10
        }
      }
      var res = await this.postJson('common', param)
      if (res.code === '0') {
        this.receiveMessageData = res.content.dataList
        console.log('this.receiveMessageData', this.receiveMessageData)
      }
    }
  },
  async mounted() {
    this.query()
    this.getPeriodStore()
    this.queryReceiveMessages()
  },
  async created() {
    // 已载入高德地图API，则直接初始化地图
    // if (window.AMap && window.AMapUI) {
    if (window.AMap) {
      this.initMap()
      // 未载入高德地图API，则先载入API再初始化
    } else {
      await remoteLoad(`http://webapi.amap.com/maps?v=1.4.4&key=4199fe377dd77297c6e4cee01bd0b266&plugin=AMap.MarkerClusterer,AMap.Riding`)
      // await remoteLoad('http://webapi.amap.com/ui/1.0/main.js')
      this.initMap()
    }
  }
}
</script>

<style lang="scss">
  .situation-div {
    padding: 20px;
    .query {
      text-align: right;
    }
    .statistics {
      background: $main-color;
      border-radius: 10px;
      padding: 23px 10px;
      margin-top: 20px;
      .line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .box1 {
          background: $main-color;
          width: 100px;
          text-align: center;
          line-height: 25px;
        }
        .box {
          background: $main-color;
          width: 100px;
          text-align: center;
          border-left: 1.5px solid $border-color;
          line-height: 25px;
        }
        .box1, .box {
          .title {
            color: $header-font-color;
            font-size: 12px;
          }
          .num {
            color: $header-font-color;
            font-size: 22px;
          }
        }
      }
    }
    // .statistics-div {
    //   .line {
    //     display: flex;
    //     justify-content: space-between;
    //     align-items: center;
    //     margin-top: 20px;
    //     .box {
    //       width: 180px;
    //       height: 100px;
    //       text-align: center;
    //       border: 1px solid $border-color;
    //       line-height: 40px;
    //       .title {
    //         font-size: 12px;
    //       }
    //       .num {
    //         font-size: 40px;
    //       }
    //     }
    //   }
    // }
    .todo-div {
      border: 1px solid $border-color;
      margin-top: 20px;
      .todo-title {
        border-bottom: 1px solid $border-color;
        padding: 0 20px;
        height: 40px;
        color: #ffffff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: $main-color;
      }
      .todo-content {
        padding: 20px;
          .msg-line {
            display: flex;
            justify-content: space-between;
            align-content: center;
            color: #6d7380;
            font-size: 14px;
            line-height: 26px;
            .msg-title {
            }
          }
      }
    }
  }

  #my_container {
    width: 100%;
    height: 410px;
    box-sizing: border-box;
    border: 1px solid #dddee1;
    border-radius: 0 0 4px 4px;
    font-size: 12px
  }
</style>