<template>
  <div>
    <!--游戏玩法耗材分析-->
    <div class="echart-body">
      <div class="echart-query">
        <!-- 游戏类型选择 -->
        <Select clearable v-model="gameId_value" placeholder="游戏类型" class="search-select"
                @change="changeGameId">
          <Option v-for="item in gameId_options"
                  :key="item.gameId"
                  :label="item.gameName"
                  :value="item.gameId">
          </Option>
        </Select>
        <!-- 区域选择 -->
        <div class="search-select">
          <AreaCascader :stage="1" ref="area" v-model="regionCode" :placeholder="'区域'"
                        @areaSelectResult="areaSelect"></AreaCascader>
        </div>
      </div>
      <!-- 游戏玩法耗材分析图 -->
      <v-chart :options="game_consumables_options"/>
    </div>
    <!--游戏玩法耗材分析（按年）-->
    <div class="echart-body mt12">
      <div class="echart-query">
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
          <AreaCascader :stage="1" ref="area" v-model="regionCode_year" :placeholder="'区域'"
                        @areaSelectResult="areaSelectYear"></AreaCascader>
        </div>
      </div>
      <!-- 游戏玩法耗材分析（按年）图 -->
      <v-chart :options="game_consumables_year_options"/>
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
      // 游戏玩法耗材分析图
      game_consumables_options: {
        title: {
          text: '游戏玩法耗材分析图'
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
          name: '销量/使用张数',
          type: 'line',
          areaStyle: {},
          // data: ['100', '200']
          data: []
        }]
      },
      // 游戏玩法耗材分析（按年）
      game_consumables_year_options: {
        title: {
          text: '游戏玩法耗材分析（按年）'
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
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          // data: ['一月', '二月']
          data: []
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [{
          name: '销量/使用张数',
          type: 'line',
          areaStyle: {},
          // data: ['200', '100']
          data: []
        }]
      },
      // 游戏类型下拉框选项
      gameId_options: [
        {
          gameId: '',
          gameName: ''
        }
      ],
      gameId_value: '',
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
      }, {
        value: '2015',
        label: '2015'
      }, {
        value: '2014',
        label: '2014'
      }, {
        value: '2013',
        label: '2013'
      }],
      year_value: '2018',
      regionCode: '640000000000',
      regionCode_year: '640000000000'
      // year_value: '',
      // regionCode: '',
      // regionCode_year: ''
    }
  },
  methods: {
    // 游戏类型下拉框选项加载
    async init_game_dropdown() {
      var res = await this.postJson('ws', {
        apiCode: 503006,
        content: {}
      })
      console.log('res.content(game-dropdown)', res.content)
      this.gameId_options = res.content
      // 加载第一个选项为游戏id
      this.gameId_value = this.gameId_options[0].gameId
      this.init()
      this.init_year()
    },
    // 游戏玩法耗材分析
    async init() {
      var res = await this.postJson('ws', {
        apiCode: 503008,
        content: {
          gameId: this.gameId_value,
          regionCode: this.regionCode
        }
      })
      console.log('res.content(1)', res.content)
      // 将返回的对象存入两个数组
      let arrX = []
      let arrY = []
      if (res.content) {
        res.content.forEach((obj) => {
          arrX.push(obj.regionName)
          arrY.push(obj.efficiency)
        })
      }
      console.log(arrX, arrY)
      // 更新X,Y轴数据
      this.game_consumables_options.xAxis = [
        {
          type: 'category',
          boundaryGap: false,
          data: arrX
        }
      ]
      this.game_consumables_options.series = [
        {
          name: '销量/使用张数',
          type: 'line',
          areaStyle: {},
          data: arrY
        }
      ]
    },
    // 游戏玩法耗材分析（按年）
    async init_year() {
      var res = await this.postJson('ws', {
        apiCode: 503009,
        content: {
          dateType: this.year_value,
          regionCode: this.regionCode_year
        }
      })
      console.log('res.content(year)', res.content)
      let arrX = []
      let arrY = []
      if (res.content) {
        res.content.forEach((obj) => {
          arrX.push(obj.month + '月')
          arrY.push(obj.efficiency)
        })
      }
      console.log(arrX, arrY)
      // 更新X,Y轴数据
      this.game_consumables_year_options.xAxis = [
        {
          type: 'category',
          data: arrX
        }
      ]
      this.game_consumables_year_options.series = [
        {
          name: '销量/使用张数',
          type: 'line',
          data: arrY
        }
      ]
    },
    // 改变游戏类型（情况）
    changeGameId() {
      this.init()
    },
    // 改变年份
    changeYear() {
      if (this.year_value) {
        this.init_year()
      }
      console.log('year_value', this.year_value)
    },
    // 区域选择结果
    areaSelect(result) {
      console.log('areaSelect1', result)
      if (result) {
        this.regionCode = result.value
      } else {
        this.regionCode = ''
      }
      this.init()
    },
    // 区域选择结果（按年）
    areaSelectYear(result) {
      console.log('areaSelectYear', result)
      if (result) {
        this.regionCode_year = result.value
      } else {
        this.regionCode_year = ''
      }
      this.init_year()
    }
  },
  mounted() {
    this.init_game_dropdown()
    // 改为加载下拉框第一个数据
    // this.init()
    // this.init_year()
  }
}
</script>

<style lang="scss">
  @import url('../../../../../../assets/css/echarts-report.scss');
</style>