<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button v-if="Auth(501001)" type="primary" icon="el-icon-edit" @click="toAdd">新增</Button>
        <Select class="search-select" size="mini" v-model="typeX" placeholder="">
          <Option label="设施" value="facilities"></Option>
          <Option label="耗材" value="consumables"></Option>
        </Select>
        <!--</ButtonGroup>-->
      </div>

      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form v-if="typeX === 'facilities'" :inline="true" class="form-inline" label-width="140px"
              :model="facilitiesForm" size="mini"
              ref="facilitiesForm">

          <FormItem label="设施名称" prop="name">
            <Input v-model="facilitiesForm.nameX"></Input>
          </FormItem>
          <FormItem label="设施编号" prop="code">
            <Input v-model="facilitiesForm.code"></Input>
          </FormItem>

          <FormItem label="供应商" prop="supplierId">
            <Select clearable v-model="facilitiesForm.supplierId" placeholder="请选择供应商">
              <Option v-for="item in supplierList" :key="item.id" :value="item.id" :label="item.supplierName"></Option>
            </Select>
          </FormItem>
          <FormItem class="full-line">
            <Button type="primary" @click="search()">查询</Button>
            <Button @click="resetForm('facilitiesForm')">重置</Button>
          </FormItem>
        </Form>
        <Form v-if="typeX === 'consumables'" :inline="true" class="form-inline" label-width="140px"
              :model="consumablesForm" size="mini"
              ref="consumablesForm">

          <FormItem label="耗材名称" prop="name">
            <Input v-model="consumablesForm.nameX"></Input>
          </FormItem>
          <FormItem label="耗材编号" prop="code">
            <Input v-model="consumablesForm.code"></Input>
          </FormItem>
          <FormItem label="供应商" prop="supplierId">
            <Select clearable v-model="consumablesForm.supplierId" placeholder="请选择供应商">
              <Option v-for="item in supplierList" :key="item.id" :value="item.id" :label="item.supplierName"></Option>
            </Select>
          </FormItem>
          <FormItem class="full-line">
            <Button type="primary" @click="search()">查询</Button>
            <Button @click="resetForm('consumablesForm')">重置</Button>
          </FormItem>
        </Form>

      </div>

      <!--表格-->
      <div slot="TableSlot">
        <Table stripe v-show="typeX === 'facilities'" :data="tableDataFacilities" :height="tableHeight" border
               style="width: 100%" v-if="tableHeight">

          <TableColumn fixed label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
            </template>
          </TableColumn>
          <!--<TableColumn-->
          <!--label="设施图片"-->
          <!--width="100">-->
          <!--<template slot-scope="scope">-->
          <!--{{ scope.row.isBuildIn | getTxt }}-->
          <!--</template>-->
          <!--</TableColumn>-->
          <TableColumn label="设施名称" prop="nameX"></TableColumn>
          <TableColumn label="设施编号" prop="code"></TableColumn>
          <TableColumn label="设施单价" prop="price"></TableColumn>
          <TableColumn label="预警上限" prop="warnUpperLimit"></TableColumn>
          <TableColumn label="预警下限" prop="warnLowerLimit"></TableColumn>
          <TableColumn
             label="操作"
             width="140">
            <template slot-scope="scope">
              <Button @click="toDetail(scope.row.id)" type="text" typeOptions>查看</Button>
              <Button v-if="Auth(501002)" @click="editItem(scope.row.id)" type="text" typeOptions>修改</Button>
            </template>
          </TableColumn>
        </Table>
        <Table stripe v-show="typeX === 'consumables'" :data="tableDataConsumables" :height="tableHeight" border
               style="width: 100%" v-if="tableHeight">

          <TableColumn fixed label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
            </template>
          </TableColumn>
          <!--<TableColumn-->
          <!--label="耗材图片"-->
          <!--width="100">-->
          <!--<template slot-scope="scope">-->
          <!--{{ scope.row.isBuildIn | getTxt }}-->
          <!--</template>-->
          <!--</TableColumn>-->
          <TableColumn label="耗材名称" prop="nameX"></TableColumn>
          <TableColumn label="耗材编号" prop="code"></TableColumn>
          <TableColumn label="耗材单价" prop="price"></TableColumn>
          <TableColumn label="预警上限" prop="warnUpperLimit"></TableColumn>
          <TableColumn label="预警下限" prop="warnLowerLimit"></TableColumn>
          <TableColumn
             label="操作"
             width="140">
            <template slot-scope="scope">
              <Button @click="toDetail(scope.row.id)" type="text" typeOptions>查看</Button>
              <Button @click="editItem(scope.row.id)" type="text" typeOptions v-if="Auth(501002)">修改</Button>
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
      supplierList: [],
      facilitiesForm: {},
      consumablesForm: {},
      confirmSearch: {
        page: 1
      },
      typeX: 'facilities',
      totalCount: 20,
      tableHeight: 0,
      msg: '',
      tableDataFacilities: [],
      tableDataConsumables: [],
      searchForm: {
        typeX: 'facilities',
        page: 1
      }
    }
  },
  computed: {
    runningstateList() {
      return JSON.parse(sessionStorage.getItem('all_enumDic')).StorageEnum$runningstateEnum
      // return this.$store.state['all_enumDic'].StorageEnum$runningstateEnum
    }
  },
  watch: {
    typeX(val) {
      console.log('val', val)
      this.search()
    }
  },
  methods: {
    async getSupplierList() {
      var res = await this.postJson('ws', {
        apiCode: 500013,
        content: {
          paginated: false
        }
      })
      if (res.code == 0) {
        console.log('SupplierList数据返回', res.content)
        this.supplierList = res.content.dataList
      }
    },
    toAdd() {
      this.$router.push(`/storeSet/consumableAdd?variety=${this.typeX}`)
    },
    initAboutTypeX() {
      var ruleFormName = 'facilitiesForm'
      if (this.typeX === 'facilities') {
        ruleFormName = 'facilitiesForm'
      }
      if (this.typeX === 'consumables') {
        ruleFormName = 'consumablesForm'
      }
      this.searchForm = this[ruleFormName]
      this.searchForm.page = 1
      this.searchForm.typeX = this.typeX
    },
    typeSelectChange(val) {
    },
    toDetail(id) {
      this.$router.push(`/storeSet/consumableDetail/${id}?variety=${this.typeX}`)
    },
    editItem(id) {
      console.log('`/storeSet/deviceAdd/${id}?variety=${this.typeX}`', `/storeSet/deviceAdd/${id}?variety=${this.typeX}`)
      this.$router.push(`/storeSet/consumableAdd/${id}?variety=${this.typeX}`)
    },
    async init() {
      this.Event.$on('pagechange', (val) => {
        this.confirmSearch.page = val
        this.query()
      })
      // 获取 type
      if (location.hash.includes('?')) {
        this.typeX = location.hash.split('?')[1].split('=')[1]
      }
      this.search()
    },
    search() {
      this.initAboutTypeX()
      this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
      console.log('this.confirmSearch', this.confirmSearch)
      this.Event.$emit('pageInit', 1)
      this.query()
    },
    async query() {
      var apiCode = 501004
      var tableName = 'tableDataFacilities'
      if (this.typeX === 'facilities') {
        tableName = 'tableDataFacilities'
      }
      if (this.typeX === 'consumables') {
        tableName = 'tableDataConsumables'
      }
      var res = await this.postJson('ws', {
        apiCode,
        content: this.confirmSearch
      })
      if (res.code == 0) {
        this[tableName] = res.content.dataList
        this.totalCount = res.content.dataPage.totalCount
      }
    },
    resetForm(formName) {
      this[formName] = {}
      this.searchForm = {}
    }
  },
  mounted() {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.getSupplierList()
    this.init()
  }
}
</script>

<style></style>
