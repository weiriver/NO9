<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button type="primary" icon="el-icon-edit" @click="$router.push('/storeSet/supplierAdd')" v-if="Auth(500010)">
          新增
        </Button>
        <!--</ButtonGroup>-->
      </div>

      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">

          <FormItem label="供应商名称" prop="supplierName">
            <Input v-model="searchForm.supplierName	"></Input>
          </FormItem>

          <FormItem label="手机号码" prop="mobile">
            <Input v-model="searchForm.mobile"></Input>
          </FormItem>
          <FormItem label="负责人" prop="contactUser">
            <Input v-model="searchForm.contactUser"></Input>
          </FormItem>
          <FormItem label="邮箱" prop="email">
            <Input v-model="searchForm.email"></Input>
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
          <TableColumn
             label="序号"
             width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
            </template>
          </TableColumn>
          <TableColumn label="供应商名称" prop="supplierName"></TableColumn>
          <TableColumn label="负责人" prop="contactUser" width="140"></TableColumn>
          <TableColumn label="手机号码" prop="mobile" width="140"></TableColumn>
          <TableColumn label="邮箱" prop="email" width="140"></TableColumn>
          <TableColumn label="详细地址" prop="address"></TableColumn>
          <!--<TableColumn-->
          <!--label="仓库类型"-->
          <!--width="100">-->
          <!--<template slot-scope="scope">-->
          <!--{{ scope.row.typeX | getTxt }}-->
          <!--</template>-->
          <!--</TableColumn>-->
          <TableColumn
             label="操作"
             width="100">
            <template slot-scope="scope">
              <Button @click="toDetail(scope.row.id)" type="text">查看</Button>
              <Button @click="editItem(scope.row.id)" type="text" v-if="Auth(500011)">修改</Button>
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
      totalCount: 20,
      res: '',
      tableHeight: 0,
      tableData: [],
      searchForm: {
        page: 1
      }
    }
  },
  methods: {
    toDetail(id) {
      this.$router.push(`/storeSet/supplierDetail/${id}`)
    },
    editItem(id) {
      this.$router.push(`/storeSet/supplierAdd/${id}`)
    },
    async init() {
      this.Event.$on('pagechange', (val) => {
        this.confirmSearch.page = val
        this.query()
      })
      this.search()
    },
    search() {
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
