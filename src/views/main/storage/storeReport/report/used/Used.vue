<template>
  <div>
    <!--耗材使用情况分析-->
    <div class="echart-body">
      <!--查询条件-->
      <div class="echart-query">
        <div class="search-select">
          <AreaCascader :stage="1" ref="area" @areaSelectResult="areaSelectResult"></AreaCascader>
        </div>
        <Select clearable v-model="value1" placeholder="请选择" class="search-select" @change="searchmodel_use_goods">
          <Option v-for="item in lotterList"
                  :key="item.id"
                  :label="item.nameX"
                  :value="item.id">
          </Option>
        </Select>
      </div>
      <v-chart :options="haocai_shiyong_quyu_options"/>
    </div>
    <div class="echart-body">
      <!--查询条件-->
      <div class="echart-query" >
        <Select v-model="value2" placeholder="请选择" class="search-select" @change="searchmodel_by_Year_times">
          <Option v-for="item in timeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
          </Option>
        </Select>
        <Select clearable v-model="value3" placeholder="请选择" class="search-select" @change="searchmodel_by_Year_goods">
          <Option v-for="item in lotterList"
                  :key="item.id"
                  :label="item.nameX"
                  :value="item.id">
          </Option>
        </Select>
        <div class="search-select">
          <AreaCascader :stage="1" ref="area_by_year" @areaSelectResult="areaSelectResult_by_Year"></AreaCascader>
        </div>
      </div>
      <v-chart :options="haocai_shiyong_shijian_options"/>
    </div>

    <!--区域耗材使用情况-->
    <div class="echart-body">
      <div class="echart-query" style="position: absolute;right: -20px;top: -25px;">
        <div class="search-select">
          <AreaCascader :stage="1" ref="area_efficiency" @areaSelectResult="areaSelectResult_efficiency"></AreaCascader>
        </div>
      </div>
      <v-chart :options="haocai_shiyong_xiaolv_options"/>
    </div>

    <!--列表-->
    <div class="mb20">
      <!--顶部按钮组-->
      <div class="content_title" style="font-size: 18px;font-weight: bold;color: #444;padding: 10px 6px;">
        耗材使用排名
      </div>
      <div>
        <div class="search-select">
          <AreaCascader :stage="1" ref="area_reta" @areaSelectResult="areaSelectResult_reta"></AreaCascader>
        </div>
        <Select clearable v-model="value5" placeholder="请选择" class="search-select" @change="searchmodel_reat_goods">
          <Option v-for="item in lotterList"
                  :key="item.id"
                  :label="item.nameX"
                  :value="item.id">
          </Option>
        </Select>
      </div>
      <!--表格-->
      <div class="mt12">
        <Table stripe :data="tableData" height="250" border style="width: 100%">
          <TableColumn fixed label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index + 1}} </span>
            </template>
          </TableColumn>
          <TableColumn label="地市" prop="regionName" width="180"></TableColumn>
          <TableColumn label="使用数量" prop="useCount" width="180"></TableColumn>
          <TableColumn label="排名" prop="rank"></TableColumn>
        </Table>
      </div>

    </div>
  </div>
</template>

<script>
import echarts from 'vue-echarts'

export default {
  name: 'used',
  data() {
    return {
      value1: '',
      value2: '2018',
      value3: '',
      value4: '',
      value5: '',
      haocai_shiyong_quyu_options: {
        title: {
          text: '耗材使用情况分析'
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
          // data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
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
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '使用量',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: []
          }
        ]
      },
      haocai_shiyong_shijian_options: {
        title: {
          text: '耗材使用情况分析（按年份）',
          subtext: ''
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
        xAxis: {
          // data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          data: []
        },
        yAxis: {
          type : 'value'
        },
        series: [
          {
            type: 'bar',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: '#83bff6'},
                    {offset: 0.5, color: '#188df0'},
                    {offset: 1, color: '#188df0'}
                  ]
                )
              },
              emphasis: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: '#2378f7'},
                    {offset: 0.7, color: '#2378f7'},
                    {offset: 1, color: '#83bff6'}
                  ]
                )
              }
            },
            data: []
          }
        ]
      },
      haocai_shiyong_xiaolv_options: {
        title: {
          text: '耗材使用效率分析'
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
          // data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
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
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            // data: ['城市/片区一', '城市/片区二', '城市/片区三', '城市/片区四', '城市/片区五', '城市/片区六', '城市/片区七']
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            type: 'line',
            data: []
          }
        ]
      },
      timeOptions: [
        {
          value: '2018',
          label: '2018年'
        }, {
          value: '2017',
          label: '2017年'
        }, {
          value: '2016',
          label: '2016年'
        }
      ],
      tableData: [],
      lotterList: [],
      lotterRate: [],
      // 默认耗材ID
      goodsId: '4',
      autoRegioncode: '640000000000',
      // 使用情况（年初至今）
      goodsId_Use: '',
      regionCode_Use: '',
      // 使用情况（按年份）
      times_by_Year: '2018',
      goodsId_by_Year: '',
      regionCode_by_Year: '',
      // 使用效率
      regionCode_by_Efficiency: '',
      // 排行
      goodsId_Rate: '',
      regionCode_Rate: ''
    }
  },
  methods: {
    async init() {
      // 开始
      this.search()
    },
    search() {
      // 初始化方法
      this.query()
      this.query_Use(this.goodsId, this.autoRegioncode)
      this.query_by_Year(this.times_by_Year, this.goodsId, this.autoRegioncode)
      this.query_by_Efficiency(this.autoRegioncode)
      this.query_Rate(this.goodsId, this.autoRegioncode)
    },

    // 函数构造体
    async query() {
      // 耗材名称列表
      var lotter = await this.postJson('ws', {
        apiCode: 501004,
        content: {
          typeX: 'all',
          paginated: false
        }
      })
      this.lotterList = lotter.content.dataList
    },
    async query_Use(id, region) {
      if (id === ''){
        this.goodsId_Use = this.goodsId
      } else {
        this.goodsId_Use = id
      }
      if (region === ''){
      } else {
        this.regionCode_Use = region
      }
      // 耗材使用情况分析（年初到目前）
      var useds = await this.postJson('ws', {
        apiCode: 503002,
        content: {
          goodsId: this.goodsId_Use,
          regionCode: this.regionCode_Use
        }
      })
      let useX = []
      let useY = []
      for (var i = 0; i < useds.content.length; i++) {
        useX.push(useds.content[i].regionName)
        useY.push(useds.content[i].amountMax)
      }
      this.haocai_shiyong_quyu_options.xAxis[0].data = useX
      this.haocai_shiyong_quyu_options.series[0].data = useY
    },
    async query_by_Year(year,id,region) {
      if (year === ''){
      } else {
        this.times_by_Year = year
      }
      if (id === ''){
        this.goodsId_by_Year = this.goodsId
      } else {
        this.goodsId_by_Year = id
      }
      if (region === ''){
      } else {
        this.regionCode_by_Year = region
      }
      // 耗材使用情况分析（按年）
      var _useds = await this.postJson('ws', {
        apiCode: 503005,
        content: {
          goodsId: this.goodsId_by_Year,
          dateType: this.times_by_Year,
          regionCode: this.regionCode_by_Year
        }
      })
      let yearX = []
      let yearY = []
      for (var i = 0; i < _useds.content.length; i++) {
        yearX.push(_useds.content[i].month + '月')
        yearY.push(_useds.content[i].amountMax)
      }
      this.haocai_shiyong_shijian_options.xAxis.data = yearX
      this.haocai_shiyong_shijian_options.series[0].data = yearY
    },
    async query_by_Efficiency(region) {
      if (region === ''){
      } else {
        this.regionCode_by_Efficiency = region
      }
      // 耗材使用效率情况
      var __useds = await this.postJson('ws', {
        apiCode: 503007,
        content: {
          regionCode: this.regionCode_by_Efficiency
        }
      })
      let efficiencyX = []
      let efficiencyY = []
      for (var i = 0; i < __useds.content.length; i++) {
        efficiencyX.push(__useds.content[i].regionName)
        efficiencyY.push(__useds.content[i].efficiency)
      }
      this.haocai_shiyong_xiaolv_options.xAxis[0].data = efficiencyX
      this.haocai_shiyong_xiaolv_options.series[0].data = efficiencyY
    },
    async query_Rate(id, region) {
      if (id === ''){
        this.goodsId_Rate = this.goodsId
      } else {
        this.goodsId_Rate = id
      }
      if (region === ''){
      } else {
        this.regionCode_Rate = region
      }
      // 耗材使用排名
      var lotterRate = await this.postJson('ws', {
        apiCode: 503003,
        content: {
          goodsId: this.goodsId_Rate,
          regionCode: this.regionCode_Rate
        }
      })
      this.tableData = lotterRate.content
    },

    // 使用情况（年初至今）
    searchmodel_use_goods() {
      if (this.value1) {
        this.goodsId_Use = this.value1
      } else {
        this.goodsId_Use = this.goodsId
      }
      this.query_Use(this.goodsId_Use,this.regionCode_Use)
    },
    areaSelectResult(val) {
      if (val) {
        this.regionCode_Use = val.value
      } else {
        this.regionCode_Use = ''
      }
      this.query_Use(this.goodsId_Use,this.regionCode_Use)
    },
    // 使用情况（按年份）
    searchmodel_by_Year_times () {
      if (this.value1) {
        this.goodsId_by_Year = this.value2
      } else {
        this.goodsId_by_Year = this.goodsId
      }
      this.times_by_Year = this.value2
      this.query_by_Year(this.times_by_Year,this.goodsId_by_Year,this.regionCode_by_Year)
    },
    searchmodel_by_Year_goods() {
      // 获取耗材ID并保存
      this.goodsId_by_Year = this.value3
      this.query_by_Year(this.times_by_Year,this.goodsId_by_Year,this.regionCode_by_Year)
    },
    areaSelectResult_by_Year (val) {
      if (val) {
        // 获取区域ID并保存
        this.regionCode_by_Year = val.value
      } else {
        this.regionCode_by_Year = ''
      }
      this.query_by_Year(this.times_by_Year,this.goodsId_by_Year,this.regionCode_by_Year)
    },
    // 耗材使用效率
    areaSelectResult_efficiency (val) {
      if (val) {
        // 获取区域ID并保存
        this.regionCode_by_Efficiency = val.value
      } else {
        this.regionCode_by_Efficiency = ''
      }
      this.query_by_Efficiency(this.regionCode_by_Efficiency)
    },
    // 排行
    searchmodel_reat_goods () {
      // 获取耗材ID并保存
      this.goodsId_Rate = this.value5
      this.query_Rate(this.goodsId_Rate,this.regionCode_Rate)
    },
    areaSelectResult_reta (val) {
      if (val) {
        // 获取区域ID并保存
        this.regionCode_Rate = val.value
      } else {
        this.regionCode_Rate = ''
      }
      this.query_Rate(this.goodsId_Rate,this.regionCode_Rate)
    },
    resetForm(formName) {
      this[formName] = {
        page: 1
      }
    }
  },
  mounted() {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init()
  }
}
</script>

<style lang="scss">
  @import url('../../../../../../assets/css/echarts-report.scss');
</style>