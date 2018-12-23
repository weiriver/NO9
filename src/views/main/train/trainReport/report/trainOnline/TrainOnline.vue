<template>
  <TablePage :showPagination="false" :showStatBtn="true" :showStatTitle="true">
      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="statForm" size="mini"
              ref="statForm">
          <FormItem label="培训时间">
            <DatePicker v-model="statForm.trainDate"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
            ></DatePicker>
          </FormItem>
          <FormItem label="区域">
            <AreaCascader v-model="statForm.regionCode" :placeholder="'请选择区域'"
                          @areaSelectResult="areaSelectResult" ref="area" :stage="1"
            ></AreaCascader>
          </FormItem>
          <FormItem label="培训对象">
            <Select v-model="statForm.objectType" placeholder="请选择培训对象">
              <Option v-for="item in objectTypeEnum"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
              ></Option>
            </Select>
          </FormItem>
          <FormItem label="培训类型">
            <Select v-model="statForm.trainType" placeholder="请选择培训类型">
              <Option v-for="item in trainTypeEnum"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
              ></Option>
            </Select>
          </FormItem>
          <FormItem label="课程类型">
            <Select v-model="statForm.courseTypeId" placeholder="请选择课程类型">
              <Option v-for="item in courseTypeList"
                      :key="item.courseTypeId"
                      :label="item.courseTypeName"
                      :value="item.courseTypeId"
              ></Option>
            </Select>
          </FormItem>
          <FormItem class="full-line">
            <Button type="primary" @click="stat()">统计</Button>
            <Button @click="resetForm('statForm')">重置</Button>
          </FormItem>
        </Form>
      </div>
      <!-- 报表 -->
      <div slot="Report">
        <div class="stat_chart">
          <div class="chart_title">在线培训完成情况</div>
          <v-chart class="v_chart" :options="train_chart_options"/>
        </div>
        <div class="stat_chart" v-show="showRegionChart">
          <div class="chart_title">分区域培训统计</div>
          <v-chart class="v_chart" :options="region_chart_options"/>
        </div>
        <div class="stat_chart">
          <div class="chart_title">课程分类统计</div>
          <v-chart class="v_chart" :options="course_chart_options"/>
        </div>
      </div>
  </TablePage>
</template>

<script>
export default {
  name: 'TrainOnline',
  data() {
    return {
      // 统计条件
      statForm: {},
      // 课程类型列表
      courseTypeList: [],
      // 在线培训完成情况
      train_chart_options: {
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data:['已完成','未完成']
        },
        series: [
          {
            name:'在线培训完成情况',
            type:'pie',
            radius: ['0%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              // {value:335, name:'已完成'},
              // {value:310, name:'未完成'}
            ]
          }
        ]
      },
      // 分区域培训统计
      region_chart_options: {
        tooltip : {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['已完成', '未完成']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          // data: ['区域一','区域二']
          data: []
        },
        yAxis:  {
          type: 'value'
        },
        series: [
          {
            name: '已完成',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            // data: [320, 302]
            data: []
          },
          {
            name: '未完成',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            // data: [120, 132]
            data: []
          }
        ]
      },
      // 课程分类统计
      course_chart_options: {
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          x: 'right',
          data: []
          // data:['直接访问','邮件营销']
        },
        series: [
          {
            name:'课程分类统计',
            type:'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              // {value:335, name:'直接访问'},
              // {value:310, name:'邮件营销'}
            ]
          }
        ]

      },
      showRegionChart: true
    }
  },
  computed: {
    objectTypeEnum() {
      return this.$store.state['all_enumDic'].TrainEnum$TrainObjectTypeEnum
    },
    trainTypeEnum() {
      return this.$store.state['all_enumDic'].TrainEnum$TrainTypeEnum
    }
  },
  methods: {
    areaSelectResult(result) {
      if (result) {
        this.statForm.regionCode = result.value
      } else {
        this.statForm.regionCode = ''
      }
    },
    // 获取课程类型
    async getCourseType() {
      var res = await this.postJson('train', {
        apiCode: 630009,
        content: {}
      })
      if (res.code == 0) {
        let courses = res.content.dataList
        console.log('courses', courses)
        courses.forEach(item => {
          console.log('item', item)
          this.courseTypeList.push({
            courseTypeId: item.id,
            courseTypeName: item.courseTypeName
          })
        })
        console.log('this.courseTypeList', this.courseTypeList)
      }
    },
    // 统计按钮
    stat() {
      if (this.statForm.trainDate) {
        this.statForm.dateStart = this.statForm.trainDate[0]
        this.statForm.dateEnd = this.statForm.trainDate[1]
      }
      console.log('statForm', this.statForm)
      if (this.statForm.regionCode === '') {
        this.showRegionChart = true
      } else {
        this.showRegionChart = false
      }
      this.query()
    },
    // 请求图表数据
    async query() {
      var res = await this.postJson('train', {
        apiCode: 670001,
        content: this.statForm
      })
      if (res.code == 0) {
        console.log('statTrainOL', res.content)
        // 在线培训完成情况
        let train = res.content.train[0]
        this.train_chart_options.series[0].data = []
        this.train_chart_options.series[0].data.push({
          value: train.completeCount,
          name: '已完成'
        }, {
          value: train.notCompleteCount,
          name: '未完成'
        })
        // 分区域培训统计
        let region = res.content.region
        this.region_chart_options.xAxis.data = []
        this.region_chart_options.series[0].data = []
        this.region_chart_options.series[1].data = []
        region.forEach(item => {
          this.region_chart_options.xAxis.data.push(item.regionName)
          this.region_chart_options.series[0].data.push(item.completeCount)
          this.region_chart_options.series[1].data.push(item.notCompleteCount)
        })
        // 课程分类统计
        let course = res.content.course
        this.course_chart_options.legend.data = [null]
        this.course_chart_options.series[0].data = [null]
        course.forEach(item => {
          this.course_chart_options.legend.data.push(item.courseType)
          this.course_chart_options.series[0].data.push({
            value: item.count,
            name: item.courseType
          })
        })
      }
    },
    resetForm(formRef) {
      this.$refs[formRef].resetFields()
      this.$refs['area'].clear()
      this.statForm = {}
      this.statForm.regionCode = ''
    }
  },
  mounted() {
    this.query()
    this.getCourseType()
  }
}
</script>

<style lang="scss" scoped>
  .stat_chart {
    display: inline-block;
    width: 50%;
    .chart_title {
      line-height: 50px;
      font-weight: 700;
      font-size: 16px;
      text-align: center
    }
    .v_chart {
      width: 100%
    }
  }

</style>
