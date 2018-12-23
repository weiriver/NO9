<!--库存查询-->
<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">

        <!--<ButtonGroup>-->
        <Print
           :btnStyle="'border-radius: 4px 0 0 4px '"
           :tableHeader="tableHeader"
           :printTitle="'库存列表'"
           :tableData="tableData"
        ></Print>
        <Export
           :btnStyle="'border-radius:0 4px 4px 0'"
           :queryObj="confirmSearch"
           :checkboxList="checkboxList"
           :exportObjOrigin="exportObj"
           :sysModule="'ws'"
           :fileSaveName="'库存列表'"
        ></Export>
        <!--</ButtonGroup>-->
      </div>
      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">

          <FormItem label="仓库名称" prop="name">
            <Select clearable v-model="searchForm.warehouseId">
              <Option v-for="item in warehouseList" :value="item.id" :key="item.id" :label="item.nameX"></Option>
            </Select>
          </FormItem>

          <FormItem label="物品名称" prop="region">
            <Select clearable v-model="searchForm.goodsId">
              <Option v-for="item in lotterList" :value="item.id" :key="item.id" :label="item.nameX"></Option>
            </Select>
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
          <TableColumn label="仓库名称" prop="warehouseName"></TableColumn>
          <TableColumn label="物品名称" prop="goodsName"></TableColumn>
          <TableColumn label="库存数量" prop="amountMax"></TableColumn>
          <TableColumn
             label="操作"
             width="70">
            <template slot-scope="scope">
              <Button @click="editItem(scope.row.goodsId, scope.row.warehouseId)" type="text" size="small">查看明细</Button>
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
      tableHeader: [
        {
          text: '仓库名称',
          value: 'warehouseName'
        },
        {
          text: '物品名称',
          value: 'goodsName'
        },
        {
          text: '库存数量',
          value: 'amountMax'
        }
      ], // 表格头部信息
      checkboxList: [], // 导出弹框-展示出来的多选框
      exportObj: {
        apiCode: 502003,
        content: {
          colNames: [],
          colCNNames: [],
          fileType: 'excel',
          fileName: '库存列表'
        }
      },
      totalCount: 20,
      tableHeight: 0,
      tableData: [],
      confirmSearch: {
        page: 1
      },
      searchForm: {
        warehouseId: '',
        goodsId: '',
        page: 1
      },
      lotterList: [],
      warehouseList: []
    }
  },
  methods: {
    editItem(id1, id2) {
      this.$router.push('/store/InventoryInquiryDetail/' + id1 + '-' + id2)
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
      // 耗材名称列表
      var goods = await this.postJson('ws', {
        apiCode: 501004,
        content: {
          typeX: 'all',
          paginated: false
        }
      })
      this.lotterList = goods.content.dataList
      // 仓库名称列表
      var warehouse = await this.postJson('ws', {
        apiCode: 500021,
        content: {}
      })
      this.warehouseList = warehouse.content
      // 库存列表
      var res = await this.postJson('ws', {
        apiCode: 502002,
        content: this.confirmSearch
      })
      console.log(res)
      this.tableData = res.content.dataList
      this.totalCount = res.content.dataPage.totalCount
      this.checkboxList = []
      res.content.dataQry.colCNNames.forEach((v, i) => {
        this.checkboxList.push({
          text: v,
          value: res.content.dataQry.colNames[i]
        })
      })
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
