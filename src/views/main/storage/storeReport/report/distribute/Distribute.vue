<template>
  <div>
    <!--耗材区域分布情况-->
    <div class="echart-body">
      <div class="echart-query">
        <!-- 耗材类型选择 -->
        <Select clearable v-model="goodsId_condition" placeholder="耗材类型" class="search-select"
                @change="changeGoodsIdCondition">
          <Option v-for="item in goodsId_options"
                  :key="item.id"
                  :label="item.nameX"
                  :value="item.id">
          </Option>
        </Select>
        <!-- 区域选择 -->
        <div class="search-select">
          <AreaCascader :stage="1" ref="area" v-model="regionCode_condition" :placeholder="'区域'"
                        @areaSelectResult="areaSelectCondition"></AreaCascader>
        </div>
      </div>
      <!-- 耗材区域分布情况图 -->
      <v-chart :options="distribute_condition_options"/>
    </div>
    <!--耗材区域分布趋势-->
    <div class="echart-body mt12">
      <div class="echart-query">
        <!-- 耗材类型选择 -->
        <Select clearable v-model="goodsId_trend" placeholder="耗材类型" class="search-select"
                @change="changeGoodsIdTrend">
          <Option v-for="item in goodsId_options"
                  :key="item.id"
                  :label="item.nameX"
                  :value="item.id">
          </Option>
        </Select>
        <!-- 年份选择 -->
        <Select clearable v-model="year_value" placeholder="年份" class="search-select"
                @change="changeYear">
          <Option v-for="item in year_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
          </Option>
        </Select>
        <!-- 区域选择 -->
        <div class="search-select">
          <AreaCascader :stage="1" ref="area" v-model="regionCode_trend" :placeholder="'区域'"
                        @areaSelectResult="areaSelectTrend"></AreaCascader>
        </div>
      </div>
      <!-- 耗材区域分布走势图 -->
      <v-chart :options="distribute_trend_options"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'distribute',
  data() {
    let data = []
    for (let i = 0; i <= 360; i++) {
      let t = i / 180 * Math.PI
      let r = Math.sin(2 * t) * Math.cos(2 * t)
      data.push([r, i])
    }
    return {
      // 区域分布情况图数据
      distribute_condition_options: {
        title: {
          text: '耗材区域分布情况'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: []
        },
        toolbox: {
          show: false,
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          // data: ['城市一', '城市二']
          data: []
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [{
          name: '库存数量',
          type: 'line',
          areaStyle: {},
          // data: ['100', '200']
          data: []
        }]
      },
      // 区域分布走势图数据
      distribute_trend_options: {
        title: {
          text: '耗材区域分布走势'
        },
        xAxis: {
          type: 'category',
          // data: ['一月', '二月']
          data: []
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis'
        },
        series: [{
          name: '库存数量',
          type: 'line',
          // data: ['200', '100']
          data: []
        }]
      },
      // 耗材类型下拉框选项
      goodsId_options: [
        {
          id: '',
          nameX: ''
        }
      ],
      goodsId_condition: '',
      goodsId_trend: '',
      // 年份下拉框选项
      year_options: [{
        value: '2018',
        label: '2018'
      }, {
        value: '2017',
        label: '2017'
      }, {
        value: '2016',
        label: '2016'
      }],
      year_value: '2018',
      regionCode_condition: '640000000000',
      regionCode_trend: '640000000000'
      // year_value: '',
      // regionCode_condition: '',
      // regionCode_trend: ''
      // regionCode_condition: '650400000000' //吐鲁番
    }
  },
  methods: {
    // 耗材类型下拉框选项加载
    async init_type_dropdown() {
      var res = await this.postJson('ws', {
        // apiCode: 501008,
        apiCode: 501004,
        content: {
          // type: 'consumables'
          typeX: 'all',
          paginated: false
        }
      })
      console.log('res.content(consumables-dropdown)', res.content.dataList)
      this.goodsId_options = res.content.dataList
      // 加载第一个选项为耗材id
      this.goodsId_condition = this.goodsId_options[0].id
      this.init_condition()
      this.goodsId_trend = this.goodsId_options[0].id
      this.init_trend()
    },
    // 区域分布情况加载
    async init_condition() {
      var res = await this.postJson('ws', {
        apiCode: 503001,
        content: {
          goodsId: this.goodsId_condition,
          regionCode: this.regionCode_condition
        }
      })
      console.log('res.content(condition)', res.content)
      // 将返回的对象存入两个数组
      let arrX = []
      let arrY = []
      if (res.content) {
        res.content.forEach((obj) => {
          arrX.push(obj.regionName)
          arrY.push(obj.amountMax)
        })
      }
      console.log(arrX, arrY)
      // 更新X,Y轴数据
      this.distribute_condition_options.xAxis = [
        {
          type: 'category',
          boundaryGap: false,
          data: arrX
        }
      ]
      this.distribute_condition_options.series = [
        {
          name: '库存数量',
          type: 'line',
          areaStyle: {},
          data: arrY
        }
      ]
    },
    // 区域分布走势加载
    async init_trend() {
      var res = await this.postJson('ws', {
        apiCode: 503004,
        content: {
          goodsId: this.goodsId_trend,
          dateType: this.year_value,
          regionCode: this.regionCode_trend
        }
      })
      console.log('res.content(trend)', res.content)
      // // 如果不传区域代码，将相同月份的数值相加
      // if (this.regionCode_trend === '') {
      //   let temp = {}
      //   res.content.forEach(obj => {
      //     if (temp[obj.month]) {
      //       temp[obj.month] += obj.amountMax
      //     } else {
      //       temp[obj.month] = obj.amountMax
      //     }
      //   })
      //   let totalContent = []
      //   for (let i in temp) {
      //     totalContent.push({month:i, amountMax: temp[i]})
      //   }
      //   console.log('totalContent', totalContent)
      //   // 将对象存入两个数组
      //   var arrX = []
      //   var arrY = []
      //   totalContent.forEach((obj) => {
      //     arrX.push(obj.month + '月')
      //     arrY.push(obj.amountMax)
      //   })
      //   console.log(arrX, arrY)
      // } else {
      //   // 如果传区域代码，直接将返回的对象存入两个数组
      //   var arrX = []
      //   var arrY = []
      //   res.content.forEach((obj) => {
      //     arrX.push(obj.month + '月')
      //     arrY.push(obj.amountMax)
      //   })
      //   console.log(arrX, arrY)
      // }
      // 将返回的对象存入两个数组
      let arrX = []
      let arrY = []
      if (res.content) {
        res.content.forEach((obj) => {
          arrX.push(obj.month + '月')
          arrY.push(obj.amountMax)
        })
      }
      console.log(arrX, arrY)
      // 更新X,Y轴数据
      this.distribute_trend_options.xAxis = [
        {
          type: 'category',
          data: arrX
        }
      ]
      this.distribute_trend_options.series = [
        {
          name: '库存数量',
          type: 'line',
          data: arrY
        }
      ]
    },
    // 改变耗材类型（情况）
    changeGoodsIdCondition() {
      this.init_condition()
    },
    // 改变耗材类型（走势）
    changeGoodsIdTrend() {
      if (this.year_value) {
        this.init_trend()
      }
    },
    // 改变年份，触发改变区域分布走势
    changeYear() {
      if (this.year_value) {
        this.init_trend()
      }
      console.log('year_value', this.year_value)
    },
    // 区域选择结果（情况）
    areaSelectCondition(result) {
      console.log('areaSelectCondition', result)
      if (result) {
        this.regionCode_condition = result.value
      } else {
        this.regionCode_condition = ''
      }
      this.init_condition()
    },
    // 区域选择结果（走势）
    areaSelectTrend(result) {
      console.log('areaSelectTrend', result)
      if (result) {
        this.regionCode_trend = result.value
      } else {
        this.regionCode_trend = ''
      }
      if (this.year_value) {
        this.init_trend()
      }
    }
  },
  mounted() {
    this.init_type_dropdown()
    // 改为加载下拉框第一个数据
    // this.init_condition()
    // this.init_trend()
  }
}
</script>

<style lang="scss">
  @import url('../../../../../../assets/css/echarts-report.scss');
</style>