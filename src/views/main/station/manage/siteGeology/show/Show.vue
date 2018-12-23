<template>
  <div>
    <TablePage :showPagination="false">
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="所属区域">
            <AreaCascader ref="as" :stage="3"
                          :selectstageFlag="true" :allFlag="true" :res="searchForm.regionCode"
                          @areaSelectAllResult="areaSelectResult" v-model="searchForm.regionCode">
            </AreaCascader>
          </FormItem>
          <FormItem label="设立区域">
            <Select clearable v-model="searchForm.stationCityTownId">
              <Option v-for="item in stationCityTownEnum"
                      :key="item.value" :value="item.value" :label="item.text">
              </Option>
            </Select>
          </FormItem>
          <FormItem label="是否经营快3">
            <RadioGroup v-model="searchForm.operateKuai3">
              <Radio label='true'>是</Radio>
              <Radio label='false'>否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="经营模式">
            <Select clearable v-model="searchForm.operateModeId">
              <Option v-for="item in operateModeEnum"
                      :value="item.value" :key="item.value" :label="item.text">
              </Option>
            </Select>
          </FormItem>
          <FormItem class="full-line">
            <Button type="primary" @click="search()">查询</Button>
            <Button @click="resetForm('searchForm')">重置</Button>
          </FormItem>
        </Form>
      </div>
    </TablePage>
    <!-- 地图头部 -->
    <div style="height: 29px;line-height:29px;border: 1px solid #dddee1;padding: 6px;" class="mt12">
      经营类型:
      <span v-for="(item, index) in stationAnalysisList" :key="index">
        {{item.operateModeName}}站点{{item.stationCount}}个
      </span>
      <div style="float: right">
        <ButtonGroup>
          <Button type="primary" @click="measureDistance()">测距</Button>
          <Button type="danger" @click="clearMeasure()">清除</Button>
        </ButtonGroup>
      </div>
    </div>
    <!-- 地图 -->
    <div style="width: 100%;flex: 1;margin-bottom: 8px;">
      <div id="my_container"
           style="width: 100%;height: 500px; border: 1px solid #dddee1;
            border-radius:0 0 4px 4px;font-size: 12px">
      </div>
      <!--骑行导航-->
      <div id="panel" ref="panel"></div>
      <div class="info-tip">
        <div id="centerCoord"></div>
        <div id="tips"></div>
      </div>
    </div>

  </div>
</template>

<script>
import remoteLoad from '@/util/remoteLoad'

export default {
  name: 'show',
  data() {
    return {
      searchForm: {},
      // confirmSearch: {},
      markers: [],
      moveLoadingFlag: false,
      queryLoadingFlag: false,
      typeImageList: {},
      stationMap: {},
      stationAnalysisList: [],
      stationList: [],
      clusterer: null,
      AMap: '',
      map: null,
      ruler: '', // 测量点距离
      heatmap: '', // 热力图
      heatmapStatus: false, // 热力图开关状态
      locStart: null, // 路线规划起点
      locEnd: null, // 路线规划起点
      ridingPath: null, // 路线规划
      centerMarker: null // 鼠标点击，圆心标记
    }
  },
  computed: {
    stationCityTownEnum() {
      return this.$store.state['station_enumDic'].stationCityTown
    },
    operateModeEnum() {
      return this.$store.state['station_enumDic'].operateMode
    }
  },
  watch: {
    locStart(val) {
      if (val && this.locEnd) this.ridingPathCreat()
    },
    locEnd(val) {
      if (val && this.locStart) this.ridingPathCreat()
    },
    stationList(val) {
      this.addMarkerAndClusterer()
    }
  },
  methods: {
    // 区域选择结果
    areaSelectResult(result) {
      if (result) {
        this.searchForm.regionCode = result[result.length - 1].value
        this.searchForm.regionName = result[result.length - 1].label
      } else {
        this.searchForm.regionCode = ''
        this.searchForm.regionName = ''
      }
    },
    async search() {
      this.queryLoadingFlag = true
      if (this.searchForm.regionName) this.map.setCity(this.searchForm.regionName)
      this.searchForm.stationLngMax = null
      this.searchForm.stationLngMin = null
      this.searchForm.stationLatMax = null
      this.searchForm.stationLatMin = null
      const res = await this.postJsonWithMask('station', {
        apiCode: 300066,
        content: this.searchForm
      })
      if (res.code == 0) {
        this.queryLoadingFlag = false
        this.clearMap()
        this.stationList = res.content.stationList
        this.stationAnalysisList = res.content.stationAnalysis
      }
    },
    clearMap() {
      this.map.clearMap()
      this.markers.forEach((marker) => {
        marker.setMap(null)
      })
      this.markers = []
      this.stationMap = []
    },
    resetFrom(formName) {
      this[formName] = {}
      this.$refs.as.clear()
      this.searchForm = {}
      this.searchForm.regionCode = ''
    },
    async getTypeImageList() {
      const res = await this.postJsonWithMask('station', {
        apiCode: 300131,
        content: {}
      })
      if (res.code == 0) {
        this.typeImageList = res.content.dataList
      }
    },
    addMarkerAndClusterer() {
      console.log('addMarkerAndClusterer')
      var markers = this.markers
      var myself = this
      this.stationList.forEach((station) => {
        if (station.stationCode in myself.stationMap) return
        let typeImage = myself.typeImageList.find((item) => station.operateModeId === item.typeId)
        let iconPath = typeImage ? typeImage.flagPicture : 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b2.png'
        var k = new myself.AMap.Marker({
          map: myself.map,
          icon: iconPath,
          position: [station.stationLng, station.stationLat],
          title: station.stationCode
          // offset: new myself.AMap.Pixel(-12, -36)
        })

        // 实例化信息窗体
        var content = ''
        content += '<div class="info-title">' + station.stationCode + '</div><div class="info-content">'
        content += '地址：' + station.stationAddr
        content += '<br/>电话：' + station.mobile
        content += '<br/>负责人：' + station.nameX
        var infoWindow = new myself.AMap.AdvancedInfoWindow({
          content: content,
          offset: new myself.AMap.Pixel(0, -30)
        })
        // 鼠标点击marker弹出自定义的信息窗体
        myself.AMap.event.addListener(k, 'click', function () {
          console.log('dfsfds')
          infoWindow.open(myself.map, k.getPosition())
        })

        k.setLabel({
          offset: new myself.AMap.Pixel(20, 20),
          content: station.stationCode
        })
        markers.push(k)
        myself.stationMap[station.stationCode] = station
      })
      this.markers = markers
      if (this.clusterer) {
        this.clusterer.setMap(null)
      }
      this.clusterer = new this.AMap.MarkerClusterer(this.map, markers, {gridSize: 100})
    },
    /* 创建地图 */
    createAmap() {
      // import AMap from 'AMap'   // 在页面中引入高德地图
      var AMap = this.AMap = window.AMap
      let map = this.map = new AMap.Map('my_container',
        {
          zoom: 11,
          expandZoomRange: true
        }
      )
      map.setDefaultCursor('default') // 设置默认鼠标样式
      AMap.plugin(['AMap.ToolBar'],
        function () {
          map.addControl(new AMap.ToolBar())
        })
      map.plugin(['AMap.Scale'], function () {
        var scale = new AMap.Scale()
        map.addControl(scale)
      })
      /* 测量距离 */
      const that = this
      map.plugin(['AMap.RangingTool'], function () {
        that.ruler = new AMap.RangingTool(map)
        // that.ruler.turnOn()
        AMap.event.addListener(that.ruler, 'end', function (e) {
          that.ruler.turnOff()
        })
      })

      /* 设置右键菜单 */
      var contextMenu = new AMap.ContextMenu()  // 创建右键菜单
      let contextMenuPositon
      let middleLocationArr = [] // 存‘起终’经纬度坐标,中间件
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

      // map.on('moveend', function(e) {
      //   that.moveQuery()
      // })
      // map.on('zoomend', function(e) {
      //   that.moveQuery()
      // })
      // map.on('complete', function(e) {
      //   that.moveQuery()
      // })
    },
    /* 测量距离 */
    measureDistance() {
      this.ruler.turnOn()
    },
    /* 清除测量距离 */
    clearMeasure() {
      this.ruler.turnOff()
      this.clearMap()
      this.addMarkerAndClusterer()
    },
    /* 路程规划创建 */
    ridingPathCreat() { // 骑行导航（根据起点和终点获取骑行路线)
      var AMap = this.AMap
      if (!this.ridingPath) {
        this.ridingPath = new AMap.Riding({
          map: this.map,
          panel: 'panel',
          count: 1
        })
      }
      // 根据起终点坐标规划骑行路线
      this.ridingPath.search(this.locStart, this.locEnd)
    }
    // moveQuery() {},
  },
  async mounted() {
    if (window.AMap) {
      this.createAmap()
      // 未载入高德地图API，则先载入API再初始化
    } else {
      await remoteLoad(`http://webapi.amap.com/maps?v=1.4.4&key=4199fe377dd77297c6e4cee01bd0b266&plugin=AMap.MarkerClusterer,AMap.Riding`)
      // await remoteLoad('http://webapi.amap.com/ui/1.0/main.js')
      this.createAmap()
    }
    this.getTypeImageList()
  }
}
</script>

<style scoped>

</style>