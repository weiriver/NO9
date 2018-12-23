<!--库存明细-->
<template>
    <div>
        <TablePage :totalCount="totalCount">
            <!--查询条件-->
            <div slot="query">
                <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
                <Form :inline="true" class="form-inline" label-width="140px" :model="dataForm" size="mini"
                      ref="dataForm">
                    <FormItem label="消息标题" prop="name">
                        <Input v-model="dataForm.title"></Input>
                    </FormItem>
                    <FormItem class="full-line">
                        <Button type="primary" @click="search()">查询</Button>
                        <Button @click="resetForm('dataForm')">重置</Button>
                    </FormItem>
                </Form>
            </div>
            <!--表格-->
            <div slot="TableSlot">
                <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
                    <TableColumn
                            label="序号"
                            width="50">
                        <template slot-scope="scope">
                            {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
                        </template>
                    </TableColumn>
                    <TableColumn label="标题" prop="title"></TableColumn>
                    <TableColumn label="发送方式" prop="sendMode"></TableColumn>
                    <TableColumn label="销售范围" prop="startStationSale">
                        <template slot-scope="scope">
                            <span>{{(scope.row.startStationSale === null ? 0 : scope.row.startStationSale) + '/' + (scope.row.endStationSale === null ? 0 : scope.row.endStationSale)}}</span>
                        </template>
                    </TableColumn>
                    <TableColumn label="已读/总数" prop="readNum">
                        <template slot-scope="scope">
                            <span>{{(scope.row.readNum === null ? 0 : scope.row.readNum) + '/' + (scope.row.totalNum === null ? 0 : scope.row.totalNum)}}</span>
                        </template>
                    </TableColumn>
                    <TableColumn label="发送时间" prop="createDate"></TableColumn>
                    <TableColumn
                            label="操作"
                            width="120">
                        <template slot-scope="scope">
                            <Button @click="getDetail(scope.row.id)" type="text" size="small">查看已读站点</Button>
                        </template>
                    </TableColumn>
                </Table>
            </div>
        </TablePage>
        <Dialog
            title="已读站点"
            :visible.sync="dialogVisible"
            width="40%">
            <div>
                <p v-for="station in stationsDetail">
                    {{ station }}
                </p>
                <p v-if="!stationsDetail || stationsDetail.length === 0">
                    暂无已读站点
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
              <Button type="primary" @click="dialogVisible = false">确 定</Button>
            </span>
        </Dialog>
    </div>
</template>

<script>
  export default {
    name: 'Subindex',
    data: function () {
      return {
        dialogVisible: false, // 提示modal框
        stationsDetail: '',// 已读站点
        totalCount: 0,
        tableHeight: 0,
        tableData: [],// 表格数据
        searchForm: {
          page: 1
        },
        confirmSearch: {
          page: 1,
        },
        // 表单提交数据绑定model
        dataForm: {}
      }
    },
    methods: {
      // 获取已读站点详情
      getDetail(id) {
        this.postJson('station', {
          apiCode: 300272,
          content: {
            id
          }
        }).then(res => {
          if (res.code === '0') {
            console.log('请求详情返回值', res.content)
            this.stationsDetail = res.content.readStations
            this.dialogVisible = true
          }
        })
      },
      // 初始化查询内容
      initAboutTypeX () {
        this.searchForm = this['dataForm']
        this.searchForm.page = 1
      },
      async init() {
        this.Event.$on('pagechange', (val) => {
          this.confirmSearch.page = val
          this.query()
        })
        this.search()
      },
      search () {
        this.initAboutTypeX()
        this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
        this.Event.$emit('pageInit', 1)
        this.query()
      },
      async query() {
        var apiCode = 300271
        var res = await this.postJson('station', {
          apiCode,
          content: this.confirmSearch
        })
        if (res.code == 0) {
          this.tableData =  res.content.dataList
          this.totalCount = res.content.dataPage.totalCount
        }
      },
      resetForm(formName) {
        this[formName] = {}
        this.searchForm = {}
      }
    },
    mounted: function() {
      this.tableHeight = this.tableHeightCal('el-main', 150)
      this.init()
    }
  }
</script>

<style></style>
