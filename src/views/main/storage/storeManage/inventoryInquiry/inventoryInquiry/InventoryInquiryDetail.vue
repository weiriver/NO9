<!--库存明细-->
<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Print
           :btnStyle="'border-radius: 4px 0 0 4px '"
           :tableHeader="tableHeader"
           :printTitle="'库存明细列表'"
           :tableData="tableData"
        ></Print>
        <Export
           :btnStyle="'border-radius:0 4px 4px 0'"
           :queryObj="confirmSearch"
           :checkboxList="checkboxList"
           :exportObjOrigin="exportObj"
           :sysModule="'ws'"
           :fileSaveName="'库存明细列表'"
        ></Export>
        <!--</ButtonGroup>-->
      </div>
      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="操作类型" prop="name">
            <Select clearable v-model="searchForm.transfer">
              <Option v-for="item in transfer" :value="item.value" :key="item.value" :label="item.nameX"></Option>
            </Select>
          </FormItem>
          <FormItem label="操作时间" prop="name">
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
          <TableColumn
             label="序号"
             width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
            </template>
          </TableColumn>
          <TableColumn label="物品名称" prop="goodsName"></TableColumn>
          <TableColumn label="操作时间" prop="createDate"></TableColumn>
          <TableColumn label="变更类型" prop="transfer"></TableColumn>
          <TableColumn label="操作类型" prop="typeX"></TableColumn>
          <TableColumn label="设备编码" prop="goodsCode"></TableColumn>
          <TableColumn label="数量" prop="amountMax"></TableColumn>
          <TableColumn label="剩余库存" prop="restAmountMax"></TableColumn>
          <TableColumn label="发放位置" prop="fromWarehouseName"></TableColumn>
          <TableColumn
             label="相关流程"
             width="70">
            <template slot-scope="scope">
              <Button :disabled="scope.row.status" @click="editItem(scope.row.id)" type="text" size="small">相关流程
              </Button>
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
          text: '物品名称',
          value: 'goodsName'
        },
        {
          text: '操作时间',
          value: 'createDate'
        },
        {
          text: '变更类型',
          value: 'transfer'
        },
        {
          text: '操作类型',
          value: 'typeX'
        },
        {
          text: '数量',
          value: 'amountMax'
        },
        {
          text: '剩余库存',
          value: 'restAmountMax'
        },
        {
          text: '发放位置',
          value: 'fromWarehouseName'
        }
      ],
      warehouseId: 0,
      goodsId: 0,
      checkboxList: [], // 导出弹框-展示出来的多选框
      exportObj: {
        apiCode: 502005,
        content: {
          colNames: [],
          colCNNames: [],
          fileType: 'excel',
          fileName: '库存明细列表'
        }
      },
      totalCount: 20,
      tableHeight: 0,
      tableData: [],
      searchForm: {
        warehouseId: '',//仓库id
        goodsId: '',//耗材id
        transfer: '',
        startTime: '',
        endTime: '',
        page: 1
      },
      confirmSearch: {
        page: 1
      },
      transfer: [{
        value: 'in',
        nameX: '入库'
      }, {
        value: 'out',
        nameX: '出库'
      }]
    }
  },
  methods: {
    editItem(id) {
      this.$router.push(`/store/inventoryInquiryFlow/${id}`)
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
      // 库存明细列表
      var res = await this.postJson('ws', {
        apiCode: 502004,
        content: this.confirmSearch
      })
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
        goodsId: this.goodsId,
        warehouseId: this.warehouseId,
        page: 1
      }
    }
  },
  mounted: function () {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    const {id} = this.$route.params
    console.log('查询ID:' + id)
    this.goodsId = id.split('-')[0]
    this.warehouseId = id.split('-')[1]
    this.searchForm = {
      goodsId: this.goodsId,
      warehouseId: this.warehouseId,
      page: 1
    }
    this.init()
  }
}
</script>

<style></style>
