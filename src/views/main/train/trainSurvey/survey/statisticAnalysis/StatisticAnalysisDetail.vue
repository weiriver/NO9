<template>
  <div style="position: relative;">
    <div style="position: absolute;top: 0;right: 0;z-index: 10;">
      <Button type="primary" @click="show_list">列表</Button>
      <Button @click="$router.go(-1)">返回</Button>
    </div>
    <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
    <div style="margin-bottom: 10px;position: relative;">
      <h3>
        统计
      </h3>
      <div style="position: absolute;top: 0;right: 0;">
        <Select v-model="choose_type" style="width:100px" @change="choose_statistics_type">
          <Option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
          </Option>
          <!--<Option value="1">饼状图</Option>-->
          <!--&lt;!&ndash; <Option value="2">表格图</Option> &ndash;&gt;-->
          <!--<Option value="3">柱状图</Option>-->
        </Select>
      </div>
    </div>
    <div class="statistics_map">
      <div class="cell" v-for="(item, index) in data_list">
        <div class="_up">
          <div class="question_title">
            <div class="question_item _index">{{index+1}}、</div>
            <div class="question_item _question_body">{{item.questionContent}}</div>
            <div class="question_item _right">
              (答题数: {{item.stationCount}})
            </div>
          </div>
          <div class="answer_choose">
            <span>问题选项：{{item.answers}}</span>
          </div>
        </div>
        <div class="_down">
          <div class="statistics_pie" :id="gernerateId(index)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // echarts相关
  var echarts = require('echarts/lib/echarts')
  // 引入柱状图
  require('echarts/lib/chart/pie')
  require('echarts/lib/chart/bar')
  // 引入提示框和标题组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')
  export default {
    name: 'StatisticAnalysisDetail',
    data: function () {
      return {
        detail: [],
        data_list: [],
        surveyId: '',
        choose_type: 1,
        options: [
          {
            value: 1,
            label: '饼状图'
          },
          {
            value: 3,
            label: '柱状图'
          }
        ],
      }
    },
    methods: {
      choose_statistics_type(value) {
        console.log(value)
        this.randering_data(Number.parseInt(value))
      },
      show_list() {
        this.$router.push(`/trainSurvey/statisticAnalysisList/${this.surveyId}`)
      },
      gernerateId(index) { // order: 临时 常规， index：数据索引
        let id = 'statistics_pie_' + index
        return id
      },
      randering_data(type) {
        this.data_list.forEach((item, index) => {
          setTimeout(() => {
            if (type === 1) {
              // 默认渲染饼图
              this.map_flag = '1'
              this.randering_data_pie(this.gernerateId(index), item.abcdList, item.abcdMap)
            } else if (type === 2) {
              // 渲染表格
              this.map_flag = '2'
              this.randering_data_pie(this.gernerateId(index), item.abcdList, item.abcdMap)
            } else if (type === 3) {
              // 渲染柱状图
              this.map_flag = '1'
              this.randering_data_bar(this.gernerateId(index), item.abcdList, item.abcdMap)
            }
          }, 20)
        })
      },
      // 渲染饼图
      randering_data_pie(id, options, data) {
        let myChart = echarts.init(document.getElementById(id))
        myChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: options
          },
          series: [
            {
              name: '统计详情',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: data,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }, true)
      },
      // 渲染柱状图
      randering_data_bar(id, options, data) {
        let names = data.map(v => {
          return v.name
        })
        let values = data.map(v => {
          return v.value
        })
        let myChart = echarts.init(document.getElementById(id))
        myChart.setOption({
          xAxis: {
            type: 'category',
            data: names
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: values,
            type: 'bar'
          }]
        }, true)
      }
    },
    async mounted() {
      let id = this.$route.params.id
      this.surveyId = this.$route.params.id
      var res = await this.postJson('train', {
        apiCode: 610002,
        content: {
          surveyId: id
        }
      })
      console.log(res.content)
      this.detail = [
        {name: '问卷名称', value: res.content.surveyBo.surveyTitle},
        {name: '问卷编号', value: res.content.surveyBo.surveyNo},
        {name: '发布方式', value: res.content.surveyBo.publishType ? res.content.surveyBo.publishType.text : ''},
        {name: '发起时间', value: res.content.surveyBo.createDate},
        {name: '发布对象', value: res.content.surveyBo.sites},
        {name: '发布人', value: res.content.surveyBo.createByName},
        {name: '有效期', value: `${res.content.surveyBo.createDate ? res.content.surveyBo.createDate : ''}~${res.content.surveyBo.exceptFinishedTime ? res.content.surveyBo.exceptFinishedTime : ''}`},
        {name: '已提交站点数', value: res.content.surveyBo.commitCount},
        {name: '回收率', value: res.content.surveyBo.finishRate},
        {name: '问卷内容', value: res.content.surveyBo.surveyContent}
      ]
      this.data_list = res.content.answerList
      this.randering_data(1)
      console.log('res.content', res.content)
    }
  }
</script>

<style lang="scss">
  .statistics_map {
    font-size: 15px;
    .cell {
      border: solid 1px #eee;
      width: 48%;
      /*min-width: 460px;*/
      /*height: 350px;*/
      margin-left: 7px;
      margin-top: 5px;
      display: inline-block;
      ._up {
        height: 30%;
        overflow: auto;
        padding: 10px;
        .question_item {
          display: inline;
        }
        ._question_body {
          width: 70%;
          display: inline-block;
          padding-left: 2px;
        }
        ._index {
          width: 10px;
          vertical-align: top;
        }
        ._right {
          float: right;
        }
        .answer_choose {
          margin-top: 5px;
        }
      }
      ._down {
        border: solid 1px #eee;
        height: 70%;
        .statistics_pie {
          height: 245px;
        }
      }
    }
  }
</style>
