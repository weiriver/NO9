<template>
  <div>
    <div v-if="showTable">
      <TablePage :totalCount="totalCount" :showPowerSearch="false">
        <!--顶部按钮组-->
        <div slot="btn_groups">
          <ButtonGroup>
            <Print
                    :btnStyle="'border-radius: 4px 0 0 4px '"
                    :tableHeader="checkboxList"
                    :printTitle="'奖惩信息列表'"
                    :tableData="changeInfo"
            ></Print>
            <Export
                    :btnStyle="'border-radius:0 4px 4px 0'"
                    :queryObj="{page: page}"
                    :checkboxList="checkboxList"
                    :exportObjOrigin="exportObj"
                    :sysModule="'station'"
                    :fileSaveName="'奖惩信息列表'"
                    :btnName="'导出'"
                    :isOther="true"
            ></Export>
          </ButtonGroup>
        </div>

        <!--表格-->
        <div slot="TableSlot">
          <Table stripe :data="changeInfo"  border style="width: 100%" :height="tableHeight">
            <TableColumn
                    label="序号"
                    width="50">
              <template slot-scope="scope">
                {{ scope.$index + 1 + (page - 1) * 20 }}
              </template>
            </TableColumn>
            <TableColumn label="奖惩对象">
              <template slot-scope="scope">
                {{scope.row.rewardPunishObject ? scope.row.rewardPunishObject.text : ''}}
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
        pageSize: 20, // 每页显示条数
        totalCount: 0, // 总条数
        page: 1,
        tableHeight: 0, // 默认是0
        changeInfo: [], // 变更记录
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
      // element-ui表格数据查询
      async query() {
        this.$set(this.confirmSearch, 'stationCode', this.stationCode)
        console.log(this.confirmSearch)
        var res = await this.postJson('station', {
          apiCode: 300007,
          content: this.confirmSearch
        })
        this.changeInfo = res.content.dataList
        if (this.changeInfo.length > 0) {
          this.showTable = true
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
</style>
