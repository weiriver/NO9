<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->


      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">

          <FormItem label="单据编号" prop="name">
            <Input v-model="searchForm.nameX	"></Input>
          </FormItem>
          <FormItem label="单据主题" prop="name">
            <Input v-model="searchForm.nameX	"></Input>
          </FormItem>
          <FormItem class="full-line" label="置换时间" prop="name">
            <DatePicker type="daterange" placeholder="选择日期" v-model="searchForm.date1" value-format="yyyy-MM-dd"
            ></DatePicker>
          </FormItem>
          <FormItem class="full-line">
            <Button type="primary" @click="search()">查询</Button>
            <Button @click="resetForm('searchForm')">重置</Button>
          </FormItem>
        </Form>
      </div>

      <!--表格-->
      <div slot="TableSlot">
        <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight">

          <TableColumn fixed label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
            </template>
          </TableColumn>
          <TableColumn label="单据编号" prop="nameX"></TableColumn>
          <TableColumn label="单据主题" prop="regionName"></TableColumn>
          <TableColumn
            label="置换时间"
            width="100">
            <template slot-scope="scope">
              {{ scope.row.typeX | getTxt }}
            </template>
          </TableColumn>
          <TableColumn label="置换人员" prop="adminName"></TableColumn>
          <TableColumn label="备注" prop="extInfo"></TableColumn>
          <TableColumn
            label="操作"
            width="140">
            <template slot-scope="scope">
              <Button  @click="editItem(scope.row)" type="text" typeOptions>查看</Button>
            </template>
          </TableColumn>
        </Table>
      </div>

    </TablePage>
  </div>
</template>

<script>
  export default {
    name: 'Subindex',
    data: function () {
      return {
        confirmSearch: {
          page: 1
        },
        searchForm: {
          page: 1,
          status: ''
        },
        totalCount: 20,
        tableHeight: 0,

        res: '',
        Obj: {},
        msg: '',
        tableData: [
          {
          }
        ]
      }
    },
    methods: {
      editItem (item) {
        console.log('点击修改', item)
        this.$router.push('/repair/replacementManageDetail')
      },
      async init() {
        this.Event.$on('pagechange', (val) => {
          this.confirmSearch.page = val
          this.query()
        })
        // 暂时使用假数据
        // this.search()
      },
      search () {
        this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
        this.Event.$emit('pageInit', 1)
        this.query()
      },
      async query() {
        var res = await this.postJson('ws', {
          apiCode: 500013,
          content: this.confirmSearch
        })
        this.tableData = res.content.dataList
        this.totalCount = res.content.dataPage.totalCount
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

<style></style>
