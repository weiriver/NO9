<template>
  <div>
    <TablePage :totalCount="totalCount" :showPowerSearch="false">

      <!--顶部按钮组-->
      <div slot="btn_groups">
        <Print
                :btnStyle="'border-radius: 4px 0 0 4px '"
                :tableHeader="checkboxList"
                :printTitle="'变更信息列表'"
                :tableData="changeInfo"
        ></Print>
        <Export
                :btnStyle="'border-radius:0 4px 4px 0'"
                :queryObj="{page: page}"
                :checkboxList="checkboxList"
                :exportObjOrigin="exportObj"
                :sysModule="'station'"
                :fileSaveName="'变更信息列表'"
                :btnName="'导出'"
                :isOther="true"
        ></Export>
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
          <TableColumn label="内容" prop="changeContent"></TableColumn>
          <TableColumn label="旧值" prop="oldValue"></TableColumn>
          <TableColumn label="新值" prop="newValue"></TableColumn>
          <TableColumn label="变更日期" prop="changeTime">
            <template slot-scope="scope">{{ToDate(scope.row.changeTime)}}</template>
          </TableColumn>
          <TableColumn label="变更类型" prop="flowName"></TableColumn>
          <TableColumn label="变更人" prop="operName"></TableColumn>
          <TableColumn
                  label="操作" width="100px">
            <template slot-scope="scope">
              <Button type="text" :disabled="setDisabled(scope.row.processId)" @click="jumpTo(scope.row.processId)">
                相关流程
              </Button>
            </template>
          </TableColumn>
        </Table>

      </div>

    </TablePage>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'changeRecord',
    props: {
      stationCode: null
    },
    data() {
      return {
        showTable: false,
        exportObj: {
          apiCode: 300024,
          content: {
            colNames: [],
            colCNNames: [],
            fileType: 'excel',
            fileName: '变更信息列表'
          }
        },
        confirmSearch: {
          page: 1
        },
        searchForm: {
          page: 1
        },
        loading: true, // 表格加载
        pageSize: 20, // 每页显示条数
        totalCount: 0, // 总条数
        page: 1,
        tableHeight: 0, // 默认是0
        changeInfo: [], // 变更记录
        biangengTableHeader: [ // 变更记录
          {
            type: 'index1',
            title: '序号',
            width: 62,
            align: 'center',
            render: (h, params) => {
              return h('span', {}, params.index + 1 + (this.page - 1) * 20)
            }
          },
          {
            title: '内容',
            key: 'changeContent'
          },
          {
            title: '旧值',
            key: 'oldValue'
          },
          {
            title: '新值',
            key: 'newValue'
          },
          {
            title: '变更日期',
            key: 'changeTime',
            render: (h, params) => h('span', {}, this.ToDate(params.row.changeTime))
          },
          {
            title: '变更类型',
            key: 'flowName'
          },
          {
            title: '变更人',
            key: 'operName'
          },
          {
            title: '操作',
            key: 'edit',
            width: 150,
            className: 'table-edit-column',
            render: (h, params) => {
              return h('div', [
                h('a', {
                  attrs: {
                    disabled: this.setDisabled(params.row.processId)
                  },
                  props: {
                    type: 'text',
                    size: 'small',
                    disabled: true
                  },
                  style: {
                    marginRight: '5px',
                    display: 'inline'
                  },
                  on: {
                    click: () => {
                      if (params.row.processId) {
                        var urlStr = '/manage/sitesChangeDetail/' + params.row.processId
                        this.$router.push(urlStr)
                      }
                    }
                  }
                }, '相关流程')
              ])
            }
          }
        ], // “变更记录” 表格头部信息
        checkboxList: []
      }
    },
    methods: {
      setDisabled(prosessId) {
        if (prosessId) {
          return false
        } else {
          return true
        }
      },
      // element-ui表格数据查询
      async query() {
        this.showTable = false
        this.confirmSearch.stationCode = this.stationCode
        console.log(this.confirmSearch)
        var res = await this.postJson('station', {
          apiCode: 300009,
          content: this.confirmSearch
        })
        this.changeInfo = res.content.dataList
        this.totalCount = res.content.dataPage.totalCount
        this.checkboxList = []
        res.content.dataQry.colCNNames.forEach((v, i) => {
          this.checkboxList.push({
            text: v,
            value: res.content.dataQry.colNames[i]
          })
        })
        this.showTable = true
        this.$nextTick(() => {
          this.tableHeight = this.tableHeightCal('el-main', 220)
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
          this.query()
        })
        this.search()
      },
      // 点击-相关流程-跳转
      jumpTo (id) {
        let url = '/manage/sitesChangeDetail/' + id
        this.$router.push(url)
      }
      // // 获取“变更记录”
      // getChangeInfo() {
      //   this.showTable = false
      //   this.changeInfo = []
      //   this.loading = true
      //   this.postJson('station', {
      //     apiCode: 300009,
      //     content: {
      //       stationCode: this.stationCode,
      //       page: this.page
      //     }
      //   }).then(res => {
      //     this.changeInfo = res.content.dataList
      //     if (this.changeInfo.length > 0) {
      //       this.totalCount = res.content.dataPage.totalCount
      //       this.checkboxList = []
      //       res.content.dataQry.colCNNames.forEach((v, i) => {
      //         this.checkboxList.push({
      //           text: v,
      //           value: res.content.dataQry.colNames[i]
      //         })
      //       })
      //       this.showTable = true
      //       // this.$nextTick(() => {
      //         this.tableHeight = this.tableHeightCal('el-main', 220)
      //       // })
      //     }
      //     this.loading = false
      //   })
      // },
    },
    mounted() {
      this.tableHeight = this.tableHeightCal('el-main', 150)
    },
    watch: {
      stationCode () {
        this.search()
        this.exportObj.content.stationCode = this.stationCode
      },
      '$route': 'getChangeInfo'
    },
    created: function () {
      this.init()
      this.exportObj.content.stationCode = this.stationCode
    }
  }
</script>

<style scoped>

</style>
