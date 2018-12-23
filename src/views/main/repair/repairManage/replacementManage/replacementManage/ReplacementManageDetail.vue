<template>
  <div>

    <Tabs class="_blue-header" type="border-card" @tab-click="tabClick">
      <TabPane label="业务详情">
        <div>
          <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
          <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight">

            <TableColumn fixed label="序号" width="50" align="center">
              <template slot-scope="scope">
                <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
              </template>
            </TableColumn>
            <TableColumn label="物品编号" prop="nameX"></TableColumn>
            <TableColumn label="物品名称" type="xxxx"></TableColumn>
            <TableColumn label="单位" prop="nameX" width="50"></TableColumn>
            <TableColumn label="数量" type="index" width="50"></TableColumn>
            <TableColumn label="单价" prop="nameX" width="50"></TableColumn>
            <TableColumn label="金额" prop="adminName"></TableColumn>
            <TableColumn label="备注" prop="extInfo"></TableColumn>
          </Table>
        </div>
      </TabPane>
      <TabPane label="流程图">
        <div>
          流程图
        </div>
      </TabPane>


    </Tabs>

  </div>
</template>

<script>
  export default {
    name: 'Subindex',
    data: function () {
      return {
        res: '',
        Obj: {},
        tableHeight: 0,
        msg: '',
        detail: [
          {name: '单据编号', value: 'xxx'},
          {name: '单据主题', value: 'xxx'},
          {name: '备注', value: 'xxx'},
          {name: '置换人员', value: 'xx'},
          {name: '置换日期', value: 'xx'},
          {name: '关联单据', value: 'xxx'}
        ],
        tableHeader: [],
        tableData: [
        ],
        searchForm: {
          status: ''
        }
      }
    },
    methods: {
      async statusChange (value, id) {
        console.log('新状态的值', value, id)
        var res = await this.postJson('ws', {
          apiCode: 500006,
          content: {
            id: id,
            status: value
          }
        })
        console.log('数据返回', res.content)
        if (res.content.updated == 1) {
          this.showMsg('状态修改成功', 'success')
          this.init()
        }
      },
      editItem (item) {
        console.log('点击修改', item)
        this.$router.push('/storeSet/storeAdd')
      },
      async init() {
        this.Event.$on('pagechange', (val) => {
          console.log(val)
          this.query(val)
        })
        var res = await this.postJson('ws', {
          apiCode: 500004,
          content: this.searchForm
        })
        console.log('数据返回', res.content)
        // this.tableData = res.content.dataList
      },
      query() {
      },
      search() {
        console.log('查询', this.searchForm)
        this.init()
      },
      resetForm(formName) {
        this[formName] = {
          status: ''
        }
      },
      tabClick(tab, event) {
        console.log(tab, event)
      }
    },
    mounted() {
      this.tableHeight = this.tableHeightCal('el-main', 150)
      this.init()
    }
  }
</script>

<style></style>
