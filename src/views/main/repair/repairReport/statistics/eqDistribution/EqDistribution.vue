<template>
  <div>
    <!--设备区域分布情况-->
    <div class="echart-body">
      <Select clearable  v-model="distGoodsType" placeholder="设备类型" class="search-select echart-query"
              @change="changeDistGoodsType">
        <Option v-for="item in distGoodsTypeOptions"
                :key="item.id"
                :label="item.nameX"
                :value="item.id">
        </Option>
      </Select>
      <v-chart :options="eqp_distribution_options"/>
    </div>
    <!--故障设备近一年统计-->
    <div class="echart-body mt20">
      <div class="echart-query">
        <Select clearable  v-model="quesGoodsType" placeholder="设备类型" class="search-select"
                @change="changeQuesGoodsType">
          <Option v-for="item in quesGoodsTypeOptions"
                  :key="item.id"
                  :label="item.nameX"
                  :value="item.id">
          </Option>
        </Select>
        <Select clearable  v-model="version" placeholder="设备型号" class="search-select"
                @change="changeVersion" :disabled="versionDisabled">
          <Option v-for="item in versionOptions"
                  :key="item.id"
                  :label="item.nameX"
                  :value="item.id">
          </Option>
        </Select>
        <Select clearable  v-model="question" placeholder="故障" class="search-select"
                @change="changeQuestion" :disabled="questionDiabled">
          <Option v-for="item in questionOptions"
                  :key="item.id"
                  :label="item.nameX"
                  :value="item.id">
          </Option>
        </Select>
      </div>
      <v-chart :options="question_eqp_options"/>
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
      eqp_distribution_options: {
        title: {
          text: '设备区域分布情况'
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
            // data: ['城市一', '城市二', '城市三', '城市四', '城市五', '城市六', '城市七']
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: []
        // series: [
        //   {
        //     name: '邮件营销',
        //     type: 'line',
        //     stack: '总量',
        //     areaStyle: {},
        //     data: [120, 132, 101, 134, 90, 230, 210]
        //   }
        // ]
      },
      question_eqp_options: {
        title: {
          text: '故障设备近一年统计'
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
            // data: ['城市一', '城市二', '城市三', '城市四', '城市五', '城市六', '城市七']
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          // {
          //   name: '邮件营销',
          //   type: 'line',
          //   stack: '总量',
          //   areaStyle: {},
          //   data: [120, 132, 101, 134, 90, 230, 210]
          // }
        ]
      },
      distGoodsTypeOptions: [
        // {
        //   value: '1',
        //   label: '投注单'
        // }
      ],
      quesGoodsTypeOptions: [
        // {
        //   value: '1',
        //   label: '投注单'
        // }
      ],
      versionOptions: [
        // {
        //   value: '1',
        //   label: 'f110'
        // }
      ],
      questionOptions: [
        // {
        //   value: '1',
        //   label: '故障类型'
        // }
      ],
      distGoodsType: null,
      quesGoodsType: null,
      version: null,
      question: null,
      versionDisabled: true,
      questionDiabled: true
    }
  },
  methods: {
    // 改变设备类型（区域分布）
    changeDistGoodsType() {
      if (this.distGoodsType) {
        this.query_eqp_distribution()
      }
    },
    // 改变设备类型（故障设备）
    changeQuesGoodsType() {
      if (this.quesGoodsType) {
        this.query_question_eqp()
      } else {
        // 如果设备类型为空，设备型号、故障类型不可选、置空
        this.versionDisabled = true
        this.questionDiabled = true
        this.version = null
        this.question = null
      }
    },
    // 改变设备型号
    changeVersion() {
      if (this.version) {
        this.query_question_eqp()
      } else {
        // 如果设备型号为空，故障类型不可选、置空
        this.questionDiabled = true
        this.question = null
      }
    },
    // 改变故障类型
    changeQuestion() {
      if (this.question) {
        this.query_question_eqp()
      }
    },
    // 请求设备区域分布
    async query_eqp_distribution() {
      var res = await this.postJson('eqp', {
        apiCode: 800050,
        content: {
          typeId: this.distGoodsType
        }
      })
      console.log('设备分布', res.content)
      if (res.code == 0) {
        // x轴
        this.eqp_distribution_options.xAxis[0].data = res.content.data
        // y轴
        this.eqp_distribution_options.series = res.content.series
        // 如果options为空，加载下拉框
        console.log('length', this.distGoodsTypeOptions.length)
        if (this.distGoodsTypeOptions.length === 0) {
          this.distGoodsTypeOptions = res.content.items
        }
      }
    },
    // 请求故障设备统计
    async query_question_eqp() {
      var res = await this.postJson('eqp', {
        apiCode: 800051,
        content: {
          goodsTypeId: this.quesGoodsType,
          goodsVersionId: this.version,
          questionId: this.question
        }
      })
      console.log('故障设备',res)
      if (res.code == 0) {
        // x轴
        this.question_eqp_options.xAxis[0].data = res.content.data
        // y轴
        this.question_eqp_options.series = res.content.series
        // 如果options为空，加载下拉框
        if (this.quesGoodsTypeOptions.length === 0) {
          this.quesGoodsTypeOptions = res.content.items
        }
        // 如果有设备类型，加载设备型号
        if (this.quesGoodsType) {
          this.versionOptions = res.content.items
          this.versionDisabled = false
        }
        // 如果有设备类型和设备型号，加载故障类型
        if (this.quesGoodsType && this.version) {
          this.questionOptions = res.content.items
          this.questionDiabled = false
        }
      }
    }
  },
  mounted() {
    this.query_eqp_distribution()
    this.query_question_eqp()
  }
}
</script>

<style lang="scss">
  @import url('../../../../../../assets/css/echarts-report.scss');
</style>