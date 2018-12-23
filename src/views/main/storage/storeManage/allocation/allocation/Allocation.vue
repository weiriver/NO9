<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <!-- <div slot="btn_groups">
        <Select clearable  class="search-select" size="mini" v-model="searchForm.status">
          <Option label="全部" value=""></Option>
          <Option label="待处理" value="true"></Option>
          <Option label="已完成" value="false"></Option>
        </Select>
      </div> -->

      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="单据编号" prop="bizId">
            <Input v-model="searchForm.bizId"/>
          </FormItem>
          <FormItem label="单据主题" prop="title">
            <Input v-model="searchForm.title"/>
          </FormItem>
          <FormItem label="调出仓库" prop="warehouseRegionOut">
            <WarehouseRegion ref="warehouseRegionOut" v-model="searchForm.warehouseRegionOut"></WarehouseRegion>
            <!--<Select clearable v-model="searchForm.fromRegion" @change="changeRegion">-->
            <!--<Option v-for="item in regionOptions" :key="item.value" :value="item.value" :label="item.label"></Option>-->
            <!--</Select>-->
          </FormItem>
          <!--<FormItem label="调出仓库名称" prop="fromWarehouse">-->
          <!--<Select clearable v-model="searchForm.fromWarehouse">-->
          <!--<Option v-for="item in warehouseOptions" :key="item.value" :value="item.value"-->
          <!--:label="item.label"></Option>-->
          <!--</Select>-->
          <!--</FormItem>-->
          <FormItem label="调入仓库" prop="warehouseRegionIn">
            <WarehouseRegion ref="warehouseRegionIn" v-model="searchForm.warehouseRegionIn"></WarehouseRegion>
            <!--<Select clearable v-model="searchForm.toRegion" @change="changeRegion">-->
            <!--<Option v-for="item in regionOptions" :key="item.value" :value="item.value" :label="item.label"></Option>-->
            <!--</Select>-->
          </FormItem>
          <!--<FormItem label="调入仓库名称" prop="toWarehouse">-->
          <!--<Select clearable v-model="searchForm.toWarehouse">-->
          <!--<Option v-for="item in warehouseOptions" :key="item.value" :value="item.value"-->
          <!--:label="item.label"></Option>-->
          <!--</Select>-->
          <!--</FormItem>-->
          <FormItem label="调拨人员" prop="createByName">
            <Input v-model="searchForm.createByName"/>
          </FormItem>
          <FormItem label="调拨时间" prop="createDate">
            <DatePicker type="daterange" placeholder="选择日期" v-model="searchForm.createDate"
                        value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"
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
          <TableColumn label="单据编号" prop="bizId"></TableColumn>
          <TableColumn label="单据主题" prop="title"></TableColumn>
          <TableColumn label="调拨时间" prop="createDate"></TableColumn>
          <TableColumn label="调拨人员" prop="createByName"></TableColumn>
          <TableColumn label="调出仓库" prop="fromWarehouseName"></TableColumn>
          <TableColumn label="调入仓库" prop="toWarehouseName"></TableColumn>
          <TableColumn label="备注" prop="remark"></TableColumn>
          <TableColumn
             label="操作"
             width="140">
            <template slot-scope="scope">
              <Button @click="editItem(scope.row.id)" type="text" size="small">详情</Button>
            </template>
          </TableColumn>
        </Table>
      </div>

    </TablePage>
  </div>
</template>

<script>
import WarehouseRegion from './WarehouseRegion'

export default {
  name: 'Subindex',
  data: function () {
    return {
      confirmSearch: {
        page: 1
      },
      ruleForm: {
        status: ''
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
        {}
      ],
      regionOptions: [],
      warehouseOptions: [],
      warehouseRegionOut: [],
      warehouseRegionIn: []
    }
  },
  components: {WarehouseRegion},
  methods: {
    showActiveItem(val) {
      console.log('activeItem', val)
    },
    editItem(id) {
      console.log('点击修改', id)
      this.$router.push(`/store/allocationDetail/${id}`)
    },
    // 列表加载
    async init_list() {
      this.Event.$on('pagechange', (val) => {
        this.confirmSearch.page = val
        this.query()
      })
      this.search()
    },
    search() {
      this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
      if (this.confirmSearch.warehouseRegionOut) {
        this.confirmSearch.fromRegion = this.confirmSearch.warehouseRegionOut[0]
        this.confirmSearch.fromWarehouse = this.confirmSearch.warehouseRegionOut[1]
        delete this.confirmSearch.warehouseRegionOut
      }
      if (this.confirmSearch.warehouseRegionIn) {
        this.confirmSearch.toRegion = this.confirmSearch.warehouseRegionIn[0]
        this.confirmSearch.toWarehouse = this.confirmSearch.warehouseRegionIn[1]
        delete this.confirmSearch.warehouseRegionIn
      }
      this.Event.$emit('pageInit', 1)
      if (this.confirmSearch.createDate) {
        this.confirmSearch.startCreateTime = this.confirmSearch.createDate[0]
        this.confirmSearch.endCreateTime = this.confirmSearch.createDate[1]
      }
      this.query()
    },
    resetForm(formName) {
      this[formName] = {
        page: 1
      }
      this.$refs.warehouseRegionOut.clear()
      this.$refs.warehouseRegionIn.clear()
    },
    // 改变区域
    changeRegion(selected) {
      console.log('selectedRegion', selected)
      this.query_warehouse(selected)
    },
    // 请求调拨单列表
    async query() {
      var res = await this.postJson('ws', {
        apiCode: 501801,
        content: this.confirmSearch
      })
      // console.log('res.content.dataList', res.content.dataList)
      this.tableData = res.content.dataList
      this.totalCount = res.content.dataPage.totalCount
    },
    // 请求区域树
    async query_region() {
      var res = await this.postJson('account', {
        apiCode: 100027,
        content: {
          showLevel: 'second'
        }
      })
      console.log('res.content.regionTree', res.content.regionTree.children)
      let regions = res.content.regionTree.children
      let temp = []
      regions.forEach(obj => {
        temp.push({
          value: obj.id,
          label: obj.name
        })
      })
      this.regionOptions = temp
      // console.log('regionOptions', this.regionOptions)
    },
    // 请求仓库
    async query_warehouse(val) {
      var res = await this.postJson('ws', {
        apiCode: 500008,
        content: {
          regionCode: val
        }
      })
      console.log('res.content(warehouse)', res.content)
      let temp = []
      res.content.forEach(obj => {
        temp.push({
          value: obj.id,
          label: obj.nameX
        })
      })
      this.warehouseOptions = temp
      // console.log('warehouseOptions', this.warehouseOptions)
    }

  },
  mounted() {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init_list()
    this.query_region()
  }
}
</script>

<style lang="scss">
  .el-date-editor {
    width: 100% !important;
  }
</style>
