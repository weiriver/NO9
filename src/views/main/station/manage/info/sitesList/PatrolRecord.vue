<template>
  <div>
    <div v-if="showTable">
      <div v-show="!showDetail">
        <TablePage :totalCount="totalCount" :showPowerSearch="false">
          <!--表格-->
          <div slot="TableSlot">
            <Table stripe :data="tableData"  border style="width: 100%" :height="tableHeight">
              <TableColumn
                      label="序号"
                      width="50">
                <template slot-scope="scope">
                  {{ scope.$index + 1 + (page - 1) * 20 }}
                </template>
              </TableColumn>
              <TableColumn label="巡查类别">
                <template slot-scope="scope">
                  <Button @click="getDetail(scope.row.id)" type="text">{{scope.row.edit}}</Button>
                </template>
              </TableColumn>
              <TableColumn label="奖惩对象编号" prop="rewardPunishCode"></TableColumn>
              <TableColumn label="奖惩类型" prop="rewardPunishType"></TableColumn>
              <TableColumn label="奖惩原因" prop="rewardPunishReason"></TableColumn>
              <TableColumn label="奖惩日期">
                <template slot-scope="scope">
                  {{ToDate(scope.row.rewardPunishDate)}}
                </template>
              </TableColumn>
              <TableColumn
                      label="操作" width="100px">
                <template slot-scope="scope">
                  <Button type="text" @click="jumpTo(scope.row.processId)">
                    修改
                  </Button>
                  <Button type="text" @click="delete (scope.row.processId)">
                    删除
                  </Button>
                </template>
              </TableColumn>
            </Table>
          </div>
        </TablePage>
      </div>
      <div v-show="showDetail">
        <DetailList :title="'巡查任务详情'" :keyName="'name'" :valueName="'value'" :detailList="taskDetail"></DetailList>
        <div v-if="imgInfo.length">
          <h3>图片信息</h3>
          <!--发起图片-->
          <div class="imgInfo-box">
            <div>发起图片</div>
            <div>
              <img :src="url" alt=""  v-for="(url, key) in imgInfo.createImgs" :key="key">
            </div>
          </div>
          <!--处理图片-->
          <div class="imgInfo-box">
            <div>发起图片</div>
            <div>
              <img :src="url" alt=""  v-for="(url, key) in imgInfo.handleImgs" :key="key">
            </div>
          </div>
          <!--确认图片-->
          <div class="imgInfo-box">
            <div>发起图片</div>
            <div>
              <img :src="url" alt=""  v-for="(url, key) in imgInfo.confirmImgs" :key="key">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!showTable" class="warning-text">
      暂无数据
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'jiangCheng',
    props: {
      stationCode: null
    },
    data() {
      return {
        showTable: false,
        showDetail: false,
        totalCount: 0,
        taskDetail: [],
        imgInfo: [],
        exportObj: {
          apiCode: 300056,
          content: {
            colNames: [],
            colCNNames: [],
            fileType: 'excel',
            fileName: '奖惩信息列表'
          }
        },
        confirmSearch: {
          page: 1
        },
        searchForm: {
          page: 1
        },
        delFlag: false, // “删除按钮”弹窗
        delId: '', // “删除按钮”弹窗
        loading: true, // 表格加载
        page: 1,
        tableHeight: 0, // 默认是0
        tableData: [], // 变更记录
        checkboxList: []
      }
    },
    methods: {
      jumpTo(id) {
        this.$router.push('/manage/jiangChengAdd/' + id)
      },
      delete (id) {
        this.delFlag = false
        this.postJson('station', {
          apiCode: 300054,
          content: {
            id: id
          }
        }).then(res => {
          if (res.code === '0') {
            this.showMsg('删除成功')
            this.query()
          }
        })
      },
      getDetail (id) {
        // this.spinShow = true
        this.detail = {}
        this.postJson('station', {
          apiCode: 300316,
          content: {
            taskItemId: id
          }
        }).then(res => {
          // this.detail = res.content
          let data = res.content
          this.taskDetail = [
            {name: '任务单号', value: data.taskItemNo},
            {name: '任务类别', value: data.taskTypeName},
            {name: '任务名称', value: data.taskName},
            {name: '任务内容', value: data.content},
            {name: '站点编号', value: data.siteNo},
            {name: '任务状态', value: data.taskItemStatusName},
            {name: '业主评分', value: data.patrollerScore},
            {name: '站点得分', value: data.siteScore},
            {name: '发起人', value: data.taskItemProcessBo.createByName},
            {name: '发起时间', value: ToDate(data.taskItemProcessBo.createTime)},
            {name: '处理人', value: data.taskItemProcessBo.handleByName},
            {name: '处理时间', value: dToDate(data.taskItemProcessBo.handleTime)},
            {name: '确认人', value: data.taskItemProcessBo.confirmByName},
            {name: '确认时间', value: ToDate(data.taskItemProcessBo.confirmTime)},
            {name: '发起内容', value: data.taskItemProcessBo.createContent},
            {name: '处理内容', value: data.taskItemProcessBo.handleContent},
            {name: '确认内容', value: data.taskItemProcessBo.confirmContent}
          ]
          this.imgInfo = data.taskItemProcessBo
          this.showDetail = true
          // this.siteDetail_site = [
          //   {name: '站点编号', value: data.stationCode},
          //   {name: '站点地址', value: data.stationAddr}
          // ]
          console.log('detail', this.detail)
          // this.spinShow = false
        })
      },
      // element-ui表格数据查询
      async query() {
        this.$set(this.confirmSearch, 'stationCode', this.stationCode)
        console.log(this.confirmSearch)
        var res = await this.postJson('station', {
          apiCode: 300007,
          content: this.confirmSearch
        })
        this.tableData = res.content.dataList
        if (this.tableData.length > 0) {
          this.showTable = true
          this.showDetail = false
        } else {
          this.showTable = false
        }
        this.totalCount = res.content.dataPage.totalCount
        this.checkboxList = []
        res.content.dataQry.colCNNames.forEach((v, i) => {
          this.checkboxList.push({
            text: v,
            value: res.content.dataQry.colNames[i]
          })
        })
        this.$nextTick(() => {
          this.tableHeight = this.tableHeightCal('el-main', 40)
        })
      },
      search() {
        this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
        this.Event.$emit('pageInit', 1)
        this.query()
      },
      async init() {
        this.Event.$on('pagechange', (val) => {
          this.confirmSearch.page = this.page = val
          this.exportObj.content = Object.assign(this.exportObj.content, {
            stationCode: this.stationCode,
            page: this.page
          })
          this.query()
        })
        this.search()
      }
    },
    mounted() {
    },
    watch: {
      stationCode() {
        this.query()
        this.exportObj.content.rewardPunishCode = this.stationCode
      },
      '$route': 'query'
    },
    created: function () {
      this.query()
      this.exportObj.content.rewardPunishCode = this.stationCode
    }
  }
</script>
<style lang="scss">
  .warning-text{
    line-height: 350px;
    text-align: center;
  }
  .imgInfo-box{
    display: flex;
    font-size: 14px;
    margin-bottom: 20px;
    div:nth-child(1) {
      min-width: 140px;
      background-color: $list-title-bg-color;
      min-height: 20px;
      border: 1px solid $border-color;
      padding: 10px;
      text-align: right;
    }
    div:nth-child(2){
      min-width: 200px;
      border: 1px solid $border-color;
      min-height: 20px;
      flex: 1;
      padding: 10px;
      text-align: left;
      border-left: none ;
      word-break: break-all;
    }
  }
</style>
