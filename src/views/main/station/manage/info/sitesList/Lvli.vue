<template>
  <div style="position: relative; margin-top: 20px" v-loading="spinShow">
    <div class="makeMiddle">
      <div class="autoLayout32">
        <!--过滤标签-->
        <div class="autoLayoutItem item100">
          <div class="autoLeft">
            过滤标签
          </div>
          <div class="autoRight autoRightBorder pl12">
            <Checkbox :indeterminate="indeterminate2"
                      :value="checkAll2"
                      @click.prevent.native="handleCheckAll2">全选
            </Checkbox>
            <CheckboxGroup v-model="checkAllGroup2" @on-change="checkAllGroupChange2">
              <Checkbox  v-for="item in list" :key="item.id" :label="item.flowCode">{{ item.flowName }}</Checkbox>
            </CheckboxGroup>
          </div>
        </div>
        <br>
        <Button type="primary" class="mt10" @click="searchLvli">查询</Button>
      </div>
      <div>
        <div class="timeline-block mb20" v-if="flows.length > 0">
          <ul  class="lvliTimeline ivu-timeline">
            <li class="lvliTimelineItem ivu-timeline-item" v-for="(flow, index) in flows" :key = "index">
              <div class="ivu-timeline-item-tail"></div>
              <div class="ivu-timeline-item-head ivu-timeline-item-head-blue"></div>
              <div class="ivu-timeline-item-content">
                <div class="time">
                  <section class="dateTop">{{ ToDate(flow.flowArchivesBo.createDate).split(' ')[0] }}</section>
                  <section class="timeBottom">{{ ToDate(flow.flowArchivesBo.createDate).split(' ')[1] }}</section>
                </div>
                <div class="timeLineContent">
                  <div class="ivu-alert ivu-alert-info ivu-alert-with-desc">
                    <div class="ivu-alert-message">
                      {{station.stationOrigin ? index+2 :index+1}}. {{ flow.flowArchivesBo.flowType }}
                      <a @click="toDetail(flow.flowArchivesBo)" class="showDetailBtn">【流程详情】</a>
                      标题为“【{{ stationCode }}】【{{ flow.flowArchivesBo.bizTitle }}】”，在【{{ ToTime(flow.flowArchivesBo.createDate) }}】发起，归档状态：【{{ flow.flowArchivesBo.status.text }}】。
                    </div>
                    <div class="ivu-alert-desc">
                      <div v-if="flow.stationList.length">
                        <div class="showDetailBtn" @click="$forceUpdate(flow.stationList.showDetail = !flow.stationList.showDetail)" >
                          {{ flow.stationList.showDetail ? '【点击隐藏改动详情】': '【点击显示改动详情】' }}
                        </div>
                        <div v-show="flow.stationList.showDetail">
                          <div v-for="(s,i) in flow.stationList">
                            将【{{ s.content }}】从【{{ s.oldValue }}】改为【{{ s.newValue }}】。
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li></li>
          </ul>
        </div>
        <div v-if="flows.length === 0">
          无记录
        </div>
      </div>
    </div>
    <!--<Spin size="large" fix v-if=""></Spin>-->
  </div>
</template>
<script type="text/ecmascript-6">
  // import {
  //   Alert,
  //   Icon,
  //   Button,
  //   Card,
  //   Checkbox,
  //   CheckboxGroup,
  //   Timeline,
  //   TimelineItem,
  //   Spin
  // } from 'iview'
  var FileSaver = require('file-saver')
  export default {
    name: 'lvli',
    props: {
      stationCode: null
    },
    data() {
      return {
        list: [],
        checkAll2: false, // 是否全选
        checkAllGroup2: [],
        indeterminate2: false,
        spinShow: true,
        spinShowCard: true,
        flows: [],
        station: {}
      }
    },
    watch: {
      stationCode() {
        this.getList()
      }
    },
    methods: {
      toDetail(flowDetail) {
        console.log('flow', flowDetail)
        flowDetail.sysModule = '站点管理系统'
        flowDetail.flowName = flowDetail.flowType
        sessionStorage.setItem('applyDetail', JSON.stringify(flowDetail))
        this.$router.push('/index/applyDetail?from=file')
      },
      exportPdf () {
        this.downLoadPdf('pdf')
      },
      searchLvli() {
        this.spinShowCard = true
        this.query('data')
      },
      // checkbox 全选
      handleCheckAll2() {
        if (this.indeterminate2) {
          this.checkAll2 = false
        } else {
          this.checkAll2 = !this.checkAll2
        }
        this.indeterminate2 = false
        if (this.checkAll2) {
          this.checkAllGroup2 = this.list.map(e => e.flowCode)
        } else {
          this.checkAllGroup2 = []
        }
      },
      // checkbox 变化的时候
      checkAllGroupChange2(data) {
        if (data.length === this.list.length) {
          this.indeterminate2 = false
          this.checkAll2 = true
        } else if (data.length > 0) {
          this.indeterminate2 = true
          this.checkAll2 = false
        } else {
          this.indeterminate2 = false
          this.checkAll2 = false
        }
      },
      downLoadPdf(type) {
        this.postJson('station', {
          apiCode: 300008,
          content: {
            stationCode: this.stationCode,
            dataType: type,
            queryList: this.list.length === this.checkAllGroup2.length ? ['all'] : this.checkAllGroup2
          }
        }, 'blob').then(res => {
          var blob = new Blob([res], {type: 'application/pdf;charset=UTF-8'})
          FileSaver.saveAs(blob, this.stationCode + '.pdf')
        })
      },
      //  查询
      query(type) {
        this.station = {}
        this.flows = []
        this.postJson('station', {
          apiCode: 300008,
          content: {
            stationCode: this.stationCode,
            dataType: type,
            queryList: this.list.length === this.checkAllGroup2.length ? ['all'] : this.checkAllGroup2
          }
        }).then(res => {
          console.log(res)
          if (res.code === '0') {
            console.log(res.content)
            this.station = res.content.station
            this.flows = res.content.flows
            this.flows.forEach(function (flow) {
              flow.stationList.showDetail = false
            })
            this.spinShowCard = false
          } else {
          }
        })
      },
      // 获取业务列表同时执行 query
      getList() {
        this.list = []
        this.postJson('', {
          apiCode: 200051,
          content: {
            sysModule: 'station',
            paginated: false
          }
        }).then(res => {
          console.log(res)
          if (res.code === '0') {
            this.list = res.content.dataList
            this.checkAll2 = true
            this.checkAllGroup2 = this.list.map(e => e.flowCode)
            this.searchLvli()
            this.spinShow = false
          }
        })
      }
    },
    mounted() {
      this.getList()
    },
    created: function () {
    }
  }
</script>
<style lang="scss" scoped="">
  .autoRight{
    .el-checkbox-group{
      label:nth-child(7){
        margin-left: 0;
      }
      label:nth-child(11){
        margin-left: 15px;
      }
      label:nth-child(12){
        margin-left: 0;
      }
    }
  }
  .showDetailBtn {
    color: #2d8cf0;
    cursor: pointer;
  }
  .btn {
    margin-top: 20px;
  }
</style>
