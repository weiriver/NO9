<template>
  <div class="layout">
    <div class="layout_top" :style="{background: '#fff',}">
      <div class="resetHeight ">
        站点信息：<span class="oneset">{{Obj.stationCode}}</span>
        <span class="twoset" v-if="false">万州区太白岩61号（重百超市旁）</span>
        <Button type="ghost" @click="showCircle" v-if="false">显示保护区</Button>
      </div>
      <div class="resetHeight mt12">
        站点坐标：<Input v-model="Obj.stationLng" style="width: 130px;"></Input>
        <Input v-model="Obj.stationLat" style="width: 130px;"></Input>
        <Button type="primary" @click='jiupian'>坐标纠偏</Button>
        <Button type="primary" @click='save'>保存</Button>
      </div>
      <div class="resetHeight">
        查找位置：<input class="ivu-input" style="width: 264px;" id="tipinput"/>
      </div>

    </div>
    <Content class="layout_bottom makeMiddle">
      <!--<Content :style="{padding: '0 16px 16px'}">-->

      <Card style="margin-top: 12px;">
        <div style="position: relative;">
          <div id="my_container" style="width: 100%; position: relative;"
               :style="{height:mapHeight+'px'}">
            <!--坐标点-->
            <div class="location" style="position: absolute; left: 20px;top: 20px;z-index: 1000">
              X:<span v-text="lng"></span>
              Y:<span v-text="lat"></span>
            </div>
          </div>
          <!--骑行导航-->
          <div id="panel" ref="panel"></div>

          <div class="info-tip">
            <div id="centerCoord"></div>
            <div id="tips"></div>
          </div>
        </div>
      </Card>
    </Content>
  </div>
</template>

<script>
import remoteLoad from '@/util/remoteLoad'
// import AMap from 'AMap'   // 在页面中引入高德地图
import img from '@/assets/img/station/sitelogo/ticai.png'

// var AMap = require('Amap')
export default {
  name: 'manage',
  data() {
    return {
      mapHeight: 0,
      Obj: {},
      markera: '', // marker标签
      circleArrs: [], // 圆圈数组
      AMap: '',
      map: null,
      ruler: '', // 测量点距离
      heatmap: '', // 热力图
      heatmapStatus: 0, // 热力图开关状态
      lng: '0', // 坐标点位置
      lat: '0', // 坐标点位置
      locStart: null, // 路线规划起点
      locEnd: null, // 路线规划起点
      ridingPath: null, // 路线规划
      centerMarker: null, // 鼠标点击，圆心标记
      placeStr: ''
    }
  },
  computed: {
    menuitemClasses: function () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    }
  },
  watch: {
    locStart(val) {
      if (val && this.locEnd) this.ridingPathCreat()
    },
    locEnd(val) {
      if (val && this.locStart) this.ridingPathCreat()
    }
  },
  beforeRouteEnter(to, from, next) {
    next(async (vm) => {
      console.log('vm', vm)
      if (window.AMap) {
        vm.mapHeight = vm.tableHeightCal('el-main', 52)
        vm.getInfo(vm.$route.params.id)
        // 未载入高德地图API，则先载入API再初始化
      } else {
        await remoteLoad('http://webapi.amap.com/maps?v=1.4.4&key=4199fe377dd77297c6e4cee01bd0b266&plugin=AMap.Autocomplete,AMap.PlaceSearch,AMap.MarkerClusterer,AMap.Riding,AMap.AdvancedInfoWindow')
        vm.mapHeight = vm.tableHeightCal('el-main', 52)
        console.log(vm.$route.params.id)
        vm.getInfo(vm.$route.params.id)
      }
      // const that = vm
      // const id = 'sync_amap'
      // const url = 'http://webapi.amap.com/maps?v=1.4.4&key=4199fe377dd77297c6e4cee01bd0b266&plugin=AMap.Autocomplete,AMap.PlaceSearch,AMap.MarkerClusterer,AMap.Riding,AMap.AdvancedInfoWindow'
      // syncScript(id, url, fn)
      // function fn() {
      //   var AMap = require('AMap')
      //   that.AMap = AMap
      //   vm.mapHeight = vm.TableHeightCal('makeMiddle', 52)
      //   // that.createAmap()
      //   // that.searchPlace()
      //   that.getInfo(that.$route.params.id)
      // }
    })
  },
  // mounted() {
  // },
  // activated: function () {
  //   // this.getInfo(this.$route.params.id)
  // },
  methods: {
    // 保存
    async save() {
      if (this.$route.params.id === 'null') {
        const res = await this.postJson('station', {
          apiCode: 300062,
          content: {
            stationCode: sessionStorage.getItem('info_stationCode'),
            stationLng: this.Obj.stationLng,
            stationLat: this.Obj.stationLat
          }
        })
        if (res.code == 0) {
          this.showMsg('新增站点' + '[' + sessionStorage.getItem('info_stationCode') + ']坐标成功！')
          this.$router.go(-1)
        }
      } else {
        const res = await this.postJson('station', {
          apiCode: 300063,
          content: {
            id: this.Obj.id,
            stationLng: this.Obj.stationLng,
            stationLat: this.Obj.stationLat
          }
        })
        if (res.code == 0) {
          this.showMsg('保存成功')
        }
      }
    },
    // 纠偏
    async jiupian() {
      const res = await this.postJson('station', {
        apiCode: 300065,
        content: {
          stationLng: this.Obj.stationLng,
          stationLat: this.Obj.stationLat
        }
      })
      if (res.code == 0) {
        this.showMsg('纠偏成功')
        this.Obj.stationLng = res.content.lng
        this.Obj.stationLat = res.content.lat
      }
    },
    /* 创建地图 */
    async createAmap() {
      // import AMap from 'AMap'   // 在页面中引入高德地图
      var AMap = this.AMap = window.AMap
      const that = this
      console.log(that.Obj.stationLng, that.Obj.stationLat)
      let map = this.map = new AMap.Map('my_container',
        {
          zoom: 16,
          // center: [106.575202, 29.606268],
          // center: [113.647191, 34.76165],
          center: [that.Obj.stationLng, that.Obj.stationLat],
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
      var markera = this.markera = new AMap.Marker({
        // position: [106.575202, 29.606268],
        position: [that.Obj.stationLng, that.Obj.stationLat],
        // icon: '../../static/img/center.png',
        icon: new AMap.Icon({
          size: new AMap.Size(17, 39), // 图标大小
          image: img
        }),
        // offset: new AMap.Pixel(-9, -36),
        offset: new AMap.Pixel(-9, -39),
        draggable: true,
        cursor: 'move',
        raiseOnDrag: true
      })

      // 设置label标签
      markera.setLabel({ // label默认蓝框白底左上角显示，样式className为：amap-marker-label
        offset: new AMap.Pixel(24, 44), // 修改label相对于maker的位置
        content: that.Obj.stationCode
      })
      markera.setMap(map)
      makersArr.push(markera)

      // 标记点被点击之后，显示出弹窗
      var infowindow
      markera.on('click', function (e) {
        that.getStationDetail(that.Obj.stationCode).then(res => {
          if (res.code === '0') {
            const {stationAddr, stationCode} = res.content
            const createDate = that.ToTime(res.content.createDate)
            const {linkMan, mobile} = res.content.stationMaster
            AMap.plugin('AMap.AdvancedInfoWindow', function () {
              infowindow = new AMap.AdvancedInfoWindow({
                content: `<div class="info-title">站点编号: ${stationCode}</div>
                      <div class="info-content">
                        <span>地址：${stationAddr} </span><br/>
                        <span>负责人：${linkMan}</span><br/>
                        <span>电话：${mobile}</span><br/>
                        <span>建站日期：${createDate}</span>
                      </div>
                      `,
                offset: new AMap.Pixel(0, -40)
              })
              // <img src="https://webapi.amap.com/images/amap.jpg">
              // <img src="../../static/img/zwtp.jpg">
            })
            return true
          } else {
            return false
          }
        }).then(res => {
          if (res) {
            infowindow.open(map, e.target.getPosition())
          } else {
            that.showMsg('请稍候重试', 'info')
          }
        })
      })

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

      createCircle([that.Obj.stationLng, that.Obj.stationLat])
      // 拖拽开始的时候回调
      AMap.event.addListener(markera, 'dragstart', function (e) {
        // 先关闭信息窗口
        if (infowindow) infowindow.close()
        console.log(e)
        // 虚线圆移出
        if (circleArrs.length >= 1) {
          map.remove(circleArrs[0])
          circleArrs.shift()
        }
      })
      // 拖拽后回调
      AMap.event.addListener(markera, 'dragend', function (e) {
        // console.log(e)
        console.log('lng' + e.lnglat.lng, 'lat' + e.lnglat.lat)
        createCircle([e.lnglat.lng, e.lnglat.lat])
        // 重置标记点中心
        markera.setPosition(new AMap.LngLat(e.lnglat.lng, e.lnglat.lat))
        // 重置打开弹窗的位置
        if (infowindow) infowindow.open(map, e.target.getPosition())
        // 设置坐标点
        that.Obj.stationLng = e.lnglat.lng
        that.Obj.stationLat = e.lnglat.lat
      })

      /* 鼠标在地图上移动的时候，获取经纬度坐标 */
      map.on('mousemove', function (e) {
        that.lng = e.lnglat.getLng()
        that.lat = e.lnglat.getLat()
      })

      // 其他站点的markers渲染
      var markers = []
      var points = [ // 其他的站点（如需）
        // [106.576795, 29.605634],
        // [106.581253, 29.607928],
        // [106.567091, 29.604533],
        // [106.565911, 29.606921]
      ]
      points.forEach(function (marker) {
        var k = new AMap.Marker({
          map: map,
          icon: img,
          position: [marker[0], marker[1]],
          offset: new AMap.Pixel(-12, -36)
        })
        // 鼠标移上去之后，显示marker的title
        k.setTitle('鼠标移上去之后，显示marker的title')
        // 设置label标签
        k.setLabel({ // label默认蓝框白底左上角显示，样式className为：amap-marker-label
          offset: new AMap.Pixel(24, 44), // 修改label相对于maker的位置
          content: '我是marker的label标签'
        })
        markers.push(k)
      })
    },
    // “显示保护区” 开关
    showCircle() {
      // 虚线圆移出
      if (this.circleArrs.length >= 1) {
        this.map.remove(this.circleArrs[0])
        this.circleArrs.shift()
      } else {
        var AMap = this.AMap
        var circle = new AMap.Circle({
          center: new AMap.LngLat(this.Obj.stationLng, this.Obj.stationLat), // 圆心位置
          radius: 200, // 半径
          strokeColor: '#F33', // 线颜色
          strokeOpacity: 1, // 线透明度
          strokeWeight: 1, // 线粗细度
          strokeStyle: 'dashed', // 线透明度
          fillColor: '#f37d77', // 填充颜色
          fillOpacity: 0.5 // 填充透明度
        })
        this.circleArrs.push(circle)
        circle.setMap(this.map)
      }
    },
    // 获取站点的详细信息
    async getStationDetail(stationCode) {
      return await this.postJson('station', {
        apiCode: 300018,
        content: {
          stationCode
        }
      })
    },
    // 获取该站点的地理信息
    async getInfo(mapId) {
      if (mapId == null) {
        console.log(sessionStorage.getItem('info_stationCode'))
        this.Obj = {
          stationCode: sessionStorage.getItem('info_stationCode'),
          stationLat: '34.749437',
          stationLng: '113.663134',
          id: '',
          mapSource: ''
        }
        this.createAmap()
        this.searchPlace()
      } else {
        console.log(mapId)
        const res = await this.postJson('station', {apiCode: 300064, content: {id: mapId}})
        console.log(res)
        const {stationCode, stationLat, stationLng, id, mapSource} = res.content
        this.Obj = {stationCode, stationLat, stationLng, id, mapSource}
        this.createAmap()
        this.searchPlace()
      }
    },
    searchPlace() {
      // const placeStr = this.placeStr
      var AMap = this.AMap
      let map = this.map
      // var map = new AMap.Map('my_container', {
      //   resizeEnable: true
      // })
      // AMap.service(['AMap.PlaceSearch'], function () {
      var autoOptions = {
        input: 'tipinput'
      }
      var auto = new AMap.Autocomplete(autoOptions)
      var placeSearch = new AMap.PlaceSearch({ // 构造地点查询类
        pageSize: 5,
        type: '',
        pageIndex: 1,
        city: '410000', // 城市
        map: map,
        panel: 'panel'
      })
      AMap.event.addListener(auto, 'select', select) // 注册监听，当选中某条记录时会触发
      function select(e) {
        placeSearch.setCity(e.poi.adcode)
        placeSearch.search(e.poi.name)  // 关键字查询查询
      }

      // var cpoint = [113.60596, 34.630256] // 中心点坐标
      // placeSearch.searchNearBy(placeStr, cpoint, 200, function (status, result) {
      //   // placeSearch.searchNearBy('', cpoint, 200, function (status, result) {
      //   console.log(result)
      // })
      // })
    }
  }
}
</script>

<style lang="scss">

  .layout {
    display: flex;
    flex-direction: column;
  }

  .layout_top {

  }

  .layout_bottom {
    flex: 1 !important;
  }

  .info-title {
    color: white;
    font-size: 14px;
    background-color: rgba(0, 155, 255, 0.8);
    line-height: 26px;
    padding: 0px 0 0 6px;
    font-weight: lighter;
    letter-spacing: 1px
  }

  .info-content {
    padding: 4px;
    color: #666666;
    line-height: 23px;
    span {
      font-size: 12px;
      line-height: 23px;
      color: black;
    }
  }

  .info-content img {
    display: inline-block;
    width: 80px;
    float: left;
    margin: 3px;
  }

  .oneset, .twoset {
    display: inline-block;
    height: 30px;
    border: 1px solid #bbbec4;
    border-radius: 6px;
    background: #f8f8f9;
    line-height: 28px;
    text-align: left;
    text-indent: 10px;
  }

  .oneset {
    width: 130px;
  }

  .twoset {
    width: 260px;
  }

  .ivu-layout-header {
    height: auto;
    line-height: 44px;
  }

  .resetHeight:nth-child(1) {
    padding-top: 8px;
  }

  .resetHeight:nth-child(2) {
    padding-bottom: 12px;
  }

  /* 高德地图 */
  .amap-marker .marker-route {
    position: absolute;
    width: 40px;
    height: 44px;
    color: #e90000;
    background: url(http://webapi.amap.com/theme/v1.3/images/newpc/poi-1.png) no-repeat;
    cursor: pointer;
  }

  .amap-marker .marker-marker-bus-from {
    background-position: -334px -180px;
  }

  #panel {
    position: absolute;
    background-color: white;
    max-height: 90%;
    overflow-y: auto;
    top: 10px;
    right: 10px;
    width: 280px;
  }

  .info-tip {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 12px;
    background-color: #fff;
    height: 35px;
    text-align: left;
  }

  /* iview layout */
  .layout-con {
    height: 100%;
    width: 100%;
  }

  .menu-item span {
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }

  .menu-item i {
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
  }

  .collapsed-menu span {
    width: 0px;
    transition: width .2s ease;
  }

  .collapsed-menu i {
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
  }


</style>
