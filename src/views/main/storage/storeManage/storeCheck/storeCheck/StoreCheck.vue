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
           :printTitle="'物品列表'"
           :tableData="tableData"
        ></Print>
        <Export
           :btnStyle="'border-radius:0 4px 4px 0'"
           :queryObj="confirmSearch"
           :checkboxList="checkboxList"
           :exportObjOrigin="exportObj"
           :sysModule="'ws'"
           :fileSaveName="'物品列表'"
        ></Export>
        <!--</ButtonGroup>-->
      </div>
      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="物品名称" prop="goodsNameX">
            <Input v-model="searchForm.goodsNameX" @focus="showGoodsList()"></Input>
          </FormItem>
          <FormItem label="物品编号" prop="dversionId" v-if="goodsType == 'device'">
            <Input v-model="searchForm.dversionId"
                   @focus="goodsCodeClicked()"></Input>
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
          <TableColumn label="物品编号" prop="goodsCode"></TableColumn>
          <TableColumn label="单位" prop="unit"></TableColumn>
          <!--<TableColumn label="所属区域" prop="regionName"></TableColumn>-->
          <TableColumn label="库存数量" prop="inventoryCount"></TableColumn>
          <TableColumn label="损耗数量" prop="lossCount"></TableColumn>
          <TableColumn label="单价" prop="price"></TableColumn>
          <TableColumn label="金额" prop="totalPrice"></TableColumn>
          <TableColumn
             label="操作"
             width="70">
            <template slot-scope="scope">
              <Button @click="editItem(scope.row)" type="text" size="small">盘点统计</Button>
            </template>
          </TableColumn>
        </Table>
      </div>
    </TablePage>
    <!--选择物品名称--弹窗-->
    <Dialog title="提示(只能选择一种类型)" :visible.sync="dialogVisible" width="80%">
      <Tabs v-model="goodsLabel" class="_blue-header" type="border-card" @tab-click="tabClick">
        <TabPane label="设备" name="设备"></TabPane>
        <TabPane label="设施" name="设施"></TabPane>
        <TabPane label="耗材" name="耗材"></TabPane>
        <Table stripe :data="goodsTableData" border style="width: 100%" height="200" ref="multipleTable">
          <TableColumn fixed label="序号" width="50" align="center" type="index"></TableColumn>
          <TableColumn label="物品名称" prop="goodsNameX">
            <template slot-scope="scope">
              <a class="highlight" @click="chooseGoodsNameX(scope.row)">{{scope.row.goodsNameX}}</a>
            </template>
          </TableColumn>
          <TableColumn label="物品类型" prop="type">
            <template slot-scope="scope">{{ scope.row.type | getTxt }}</template>
          </TableColumn>
          <TableColumn label="大类名称" prop="goodsNameX"></TableColumn>
          <TableColumn label="小类名称" prop="versionNameX"></TableColumn>
          <TableColumn label="价格" prop="price"></TableColumn>
          <TableColumn label="大单位" prop="maxUnit"></TableColumn>
        </Table>

      </Tabs>
    </Dialog>

    <!--设备编号--弹窗-->
    <Dialog title="设备编号" :visible.sync="goodsCodeDialogVisible" width="60%">
      <div>
        <Table stripe :data="goodsCodeTableData" border style="width: 100%" height="200" ref="goodsCodeTable">
          <!--<TableColumn type="selection" width="55"></TableColumn>-->
          <TableColumn fixed label="序号" width="50" align="center" type="index"></TableColumn>
          <TableColumn label="设备编号" prop="code">
            <template slot-scope="scope">
              <a class="highlight" @click="chooseGoodsCode(scope.row)">{{scope.row.code}}</a>
            </template>
          </TableColumn>
          <TableColumn label="设备大类" prop="deviceTypeName"></TableColumn>
          <TableColumn label="设备类型" prop="deviceVersionName"></TableColumn>
          <TableColumn label="价格" prop="price"></TableColumn>
        </Table>
        <Pagination :totalCount="totalCount*1"></Pagination>
      </div>
    </Dialog>

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
          text: '物品编号',
          value: 'goodsCode'
        },
        {
          text: '单位',
          value: 'unit'
        }
        ,
        {
          text: '所属区域',
          value: 'regionName'
        }
        ,
        {
          text: '库存数量',
          value: 'inventoryCount'
        }
        ,
        {
          text: '损耗数量',
          value: 'lossCount'
        }
        ,
        {
          text: '单价',
          value: 'price'
        }
        ,
        {
          text: '金额',
          value: 'totalPrice'
        }
      ], // 表格头部信息
      checkboxList: [], // 导出弹框-展示出来的多选框
      exportObj: {
        apiCode: 501010,
        content: {
          colNames: [],
          colCNNames: [],
          fileType: 'excel',
          fileName: '物品列表'
        }
      },
      totalCount: 20,
      tableHeight: 0,
      tableData: [],
      confirmSearch: {
        page: 1
      },
      searchForm: {
        page: 1
        // permissionRegionCodeList:['650100000000']
      },
      warehouseList: [],
      goodsTableData: [],
      allGoodsList: [],
      dialogVisible: false,
      goodsCodeDialogVisible: false,
      chooseGood: {},
      goodsCodeTableData: [],
      goodsType: '',
      goodsLabel: '设备'
    }
  },
  methods: {
    // 选择物品编号
    chooseGoodsCode(item) {
      console.log(item)
      this.$set(this.searchForm, 'dversionId', item.code)
      this.goodsCodeDialogVisible = false
    },
    async getGoodsCodeTableData() {
      const obj = {dversionId: this.chooseGood.versionId, goodsId: this.chooseGood.goodsId}
      const res = await this.postJson('ws', {apiCode: 501107, content: obj})
      if (res.code == 0) {
        this.goodsCodeTableData = res.content.dataList
        this.totalCount = res.content.dataPage.totalCount
      }
    },
    // 设备编号--被点击
    goodsCodeClicked() {
      if (this.chooseGood.type.value == 'device') {
        this.goodsCodeDialogVisible = true
        this.getGoodsCodeTableData()
      }
    },
    // 选择物品名称
    chooseGoodsNameX(item) {
      console.log('item', item)
      this.chooseGood = item
      this.goodsType = this.chooseGood.type.value
      this.searchForm.goodsId = item.goodsId
      this.$set(this.searchForm, 'goodsNameX', item.goodsNameX)
      this.dialogVisible = false
    },
    // 弹窗--显示列表
    async showGoodsList() {
      this.dialogVisible = true
      this.tabClick()
    },
    // tab点击事件
    tabClick() {
      console.log('this.goodsLabel', this.goodsLabel)
      if (this.goodsLabel == '设备') {
        this.goodsTableData = this.allGoodsList.device
        console.log('设备', this.goodsLabel)
      }
      if (this.goodsLabel == '设施') {
        this.goodsTableData = this.allGoodsList.facilities
        console.log('设施', this.goodsLabel)
      }
      if (this.goodsLabel == '耗材') {
        this.goodsTableData = this.allGoodsList.consumables
        console.log('耗材', this.goodsLabel)
      }
    },
    // 获取物品列表信息
    async getGoodsList() {
      const res = await this.postJson('ws', {apiCode: 501007})
      if (res.code == 0) {
        this.allGoodsList = res.content
        this.goodsTableData = res.content.device
      }
    },
    editItem(item) {
      this.$router.push(`/store/storeCheckCensus?goodsId=${item.goodsId}&dversionId=${item.dversionId}`)
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
      // 库存列表
      var res = await this.postJson('ws', {
        apiCode: 501009,
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
      this.goodsType = ''
      this[formName] = {
        page: 1
        // permissionRegionCodeList:['650100000000']
      }
    }
  },
  mounted() {
    this.getGoodsList()
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init()
  }
}
</script>

<style></style>
