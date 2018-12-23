<!--入库开单-->
<template>
  <div>
    <h3 class="mt10 mb20">
      基本信息
    </h3>
    <!--采购入库-中心管理员-->
    <Form ref="ruleForm" :inline="true" :rules="rules" class="form-inline" label-width="100px" :model="ruleForm"
          size="mini">
      <FormItem label="采购单标题" prop="title">
        <Input v-model="ruleForm.title	"></Input>
      </FormItem>
      <FormItem label="入库仓库" prop="toWarehouse">
        <Select clearable v-model="ruleForm.toWarehouse">
          <Option v-for="item in wareHouseList" :key="item.id" :label="item.nameX" :value="item.id"></Option>
        </Select>
      </FormItem>
      <FormItem label="采购员" prop="creatBy">
        <AreauserSelect ref="user" :checkboxFlag="false"></AreauserSelect>
      </FormItem>
      <FormItem label="到货日期" prop="purchaseDate">
        <DatePicker v-model="ruleForm.purchaseDate" type="date" placeholder="选择日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
        </DatePicker>
      </FormItem>
      <FormItem label="备注" prop="remark">
        <Input v-model="ruleForm.remark"></Input>
      </FormItem>
    </Form>
    <h3 class="mt10 mb20">
      设备耗材列表
    </h3>
    <div>
      <Table stripe :data="tableData" border style="width: 100%" class="add-minus">
        <TableColumn fixed label="序号" width="50" align="center" type="index"></TableColumn>

        <TableColumn label="物品名称">
          <template slot-scope="scope">
            <Input v-model="scope.row.goodsName" :class="{'_is-error':scope.row.goodsIdRequired}"
                   @focus="showGoodsList(scope)"></Input>
            <div :class="{'_is-error':scope.row.goodsIdRequired}" v-if="scope.row.goodsIdRequired">请输入</div>
          </template>
        </TableColumn>
        <TableColumn label="物品类型">
          <template slot-scope="scope">
            <Select v-model="scope.row.goodsType" placeholder="请先填写物品名称" clearable :disabled="true"
                    :class="{'_is-error':scope.row.goodsTypeRequired}">
              <Option v-for="item in goodsTypeList" :value="item.value" :key="item.value" :label="item.text"></Option>
            </Select>
            <div :class="{'_is-error':scope.row.goodsTypeRequired}" v-if="scope.row.goodsIdRequired">请选择</div>
          </template>
        </TableColumn>
        <TableColumn label="设备编号">
          <template slot-scope="scope">
            <Input v-model="scope.row.goodsCode" :class="{'_is-error':scope.row.goodsCodeRequired}"
                   @focus="goodsCodeClicked(scope)"></Input>
            <div :class="{'_is-error':scope.row.goodsCodeRequired}" v-if="scope.row.goodsCodeRequired">请输入</div>
          </template>
        </TableColumn>
        <TableColumn label="数量">
          <template slot-scope="scope" width="100">
            <div class="inline-block width60">
              <Input
                 v-model="scope.row.amountMax" width="60"
                 :disabled="scope.row.goodsType=='device'"
                 :class="{'_is-error':scope.row.amountMaxRequired}"
                 @blur="checkTableData"
              ></Input>
            </div>
            {{scope.row.amountMaxLabel}}
            <div :class="{'_is-error':scope.row.amountMaxRequired}" v-if="scope.row.amountMaxRequired">请输入</div>
          </template>
        </TableColumn>
        <TableColumn label="单价(元)">
          <template slot-scope="scope" width="60">
            <div style="line-height: 28px;">
              {{scope.row.price}}
            </div>
          </template>
        </TableColumn>
        <TableColumn label="金额(元)">
          <template slot-scope="scope" width="60">
            <div style="line-height: 28px;">
                <span v-if="!(scope.row.unitValue && scope.row.amountMin)">
                    {{ scope.row.amountMax * scope.row.price}}
                </span>
              <span v-if="scope.row.unitValue && scope.row.amountMin">
                   {{((Number(scope.row.amountMax) + Number(scope.row.amountMin/scope.row.unitValue)) * scope.row.price).toFixed(2)}}
                </span>
            </div>
          </template>
        </TableColumn>
      </Table>

      <div class="mt10 mb20">
        <Button type="primary" @click="addLine">增行</Button>
        <Button @click="minusLine" :disabled="tableData.length == 1">减行</Button>
      </div>

      <Form :inline="true" class="mt25" label-width="100px" size="mini">
        <FormItem label="附件上传">
          <ModalUpload
             :api="uploadConf"
             :type="['jpg', 'bmp', 'png']"
          ></ModalUpload>
        </FormItem>
        <FormItem label="合计金额(元)">
          <Input v-model="totalPrice"></Input>
        </FormItem>
      </Form>
      <div class="mt25 mb20 tc">
        <Button type="primary" @click="submit">入库</Button>
      </div>
    </div>

    <!--选择物品名称--弹窗-->
    <Dialog title="提示(只能选择一种类型)" :visible.sync="dialogVisible" width="80%">
      <Tabs v-model="goodsLabel" class="_blue-header" type="border-card" @tab-click="tabClick">
        <TabPane label="设备" name="设备"></TabPane>
        <TabPane label="设施" name="设施"></TabPane>
        <TabPane label="耗材" name="耗材"></TabPane>
        <Table stripe :data="goodsTableData" border style="width: 100%" height="200" ref="multipleTable"
               @selection-change="handleSelectionChange">
          <TableColumn type="selection" width="55"></TableColumn>
          <TableColumn fixed label="序号" width="50" align="center" type="index"></TableColumn>
          <TableColumn label="物品名称" prop="goodsNameX"></TableColumn>
          <TableColumn label="物品类型" prop="type">
            <template slot-scope="scope">{{ scope.row.type | getTxt }}</template>
          </TableColumn>
          <TableColumn label="大类名称" prop="goodsNameX"></TableColumn>
          <TableColumn label="小类名称" prop="versionNameX"></TableColumn>
          <TableColumn label="价格" prop="price"></TableColumn>
          <TableColumn label="大单位" prop="maxUnit"></TableColumn>
        </Table>

      </Tabs>
      <div slot="footer" class="dialog-footer">
        <Button @click="dialogVisible = false">取 消</Button>
        <Button type="primary" @click="chooseGoodsName">确 定</Button>
      </div>
    </Dialog>

    <!--设备编号--弹窗-->
    <Dialog title="设备编号" :visible.sync="goodsCodeDialogVisible" width="60%">
      <div>
        <Table stripe :data="goodsCodeTableData" border style="width: 100%" height="200" ref="goodsCodeTable">
          <!--<TableColumn type="selection" width="55"></TableColumn>-->
          <TableColumn fixed label="序号" width="50" align="center" type="index"></TableColumn>
          <TableColumn label="设备编号" prop="code">
            <template slot-scope="scope">
              <a class="highlight" @click="chooseGoodsCode(scope)">{{scope.row.code}}</a>
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
import {mapState} from 'vuex'


export default {
  name: 'Subindex',
  data: function () {
    return {
      totalCount: 20,
      activeIndex: 0,
      dialogVisible: false,
      // 设备编号
      goodsCodeDialogVisible: false,
      res: '',
      Obj: {},
      msg: '',
      tableData: [
        {
          goodsName: '',
          goodsId: '',
          goodsIdRequired: false,
          goodsType: '',
          goodsTypeRequired: false,
          goodsCode: '',
          goodsCodeRequired: false,
          price: '',
          amountMax: '',
          amountMaxLabel: '箱',
          amountMaxRequired: false,
          amountMin: 0,
          amountMinLabel: '小单位',
          amountMinRequired: false
        }
      ],
      ruleForm: {},
      ruleForm1: {
        status: ''
      },
      rules: {
        title: [
          {required: true, message: '请选择采购单标题', trigger: 'blur'}
        ],
        toWarehouse: [
          {required: true, message: '请输入采购入库仓库', trigger: 'change'}
        ],
        goodsTypeId: [
          {required: true, message: '请输入物品类别ID', trigger: 'blur'}
        ],
        goodsTypeName: [
          {required: true, message: '请输入物品类别名称'}
        ],
        faultProblem: [
          {required: true, message: '请输入故障描述', trigger: 'blur'}
        ]
      },
      goodsTableData: [],
      allGoodsList: [],
      wareHouseList: [],
      goodsCodeTableData: [],
      multipleSelection: [],
      uploadConf: {
        sysModule: 'flow',
        hostBizObj: 'st_inventory_biz', // 采购入单写死
        hostBizId: ''
      },
      goodsLabel: '设备'
    }
  },
  methods: {
    // 选择物品名称
    chooseGoodsName(item) {
      let arr = []
      this.multipleSelection.forEach(v => {
        console.log(v)
        arr.push({
          goodsCode: '', // 默认初始值
          goodsName: v.goodsNameX,
          dversionId: v.versionId,
          goodsId: v.goodsId,
          goodsIdRequired: false,
          goodsType: v.type ? v.type.value : '',
          goodsTypeRequired: false,
          price: v.price,
          amountMax: '',
          amountMaxLabel: v.maxUnit,
          amountMin: 0,
          amountMinRequired: false
        })
      })
      this.tableData.splice(this.activeIndex, 1)
      this.tableData.splice(this.activeIndex, 0, ...arr)
      console.log(this.tableData)
      // this.$set(this.tableData[this.activeIndex], 'getNOFlag', true)
      // this.$set(this.tableData[this.activeIndex], 'no', '11111')
      this.dialogVisible = false
    },
    // 选择物品编号
    chooseGoodsCode(item) {
      let index = item.$index
      // this.tableData[index].goodsCode = item.row.code
      this.$set(this.tableData[this.activeIndex], 'goodsCode', item.row.code)
      console.log(index)
      this.goodsCodeDialogVisible = false
      // console.log(this.tableData[index].goodsCode)
    },
    // 减行
    minusLine() {
      var len = this.tableData.length
      if (len > 1) {
        this.tableData.splice(len - 1, 1)
      }
    },
    // 增行
    addLine() {
      this.tableData.push({
        goodsName: '',
        goodsId: '',
        goodsIdRequired: false,
        goodsType: '',
        goodsTypeRequired: false,
        goodsCode: '',
        goodsCodeRequired: false,
        price: '',
        amountMax: '',
        amountMaxRequired: false,
        amountMaxLabel: '',
        amountMin: '',
        amountMinLabel: '',
        amountMinRequired: false
      })
    },
    // 弹窗--显示列表
    async showGoodsList(item) {
      this.tabClick()
      console.log('获取编号item', item, item.$index)
      this.dialogVisible = true
      this.multipleSelection = []
      setTimeout(() => {
        this.$refs.multipleTable.clearSelection()
      }, 100)
      this.activeIndex = item.$index
    },
    // 设备编号--被点击
    goodsCodeClicked(item) {
      console.log('获取编号item', item, item.$index)
      let index = this.activeIndex = item.$index
      if (this.tableData[index].goodsType == 'device') {
        console.log(this.tableData[index])
        this.goodsCodeDialogVisible = true
        this.tableData[index].amountMax = 1
        this.getGoodsCodeTableData(item.row)
      }
    },
    // 获取设备编号列表
    async getGoodsCodeTableData(v) {
      console.log(v)
      const obj = {dversionId: v.dversionId, goodsId: v.goodsId, runningState: 'purchase'}
      const res = await this.postJson('ws', {apiCode: 501107, content: obj})
      if (res.code == 0) {
        // 已经选中的设备编号
        let choosedGoodsCodeArr = this.tableData.map(v => v.goodsCode)
        let originArr = res.content.dataList
        this.goodsCodeTableData = originArr.filter(v => !choosedGoodsCodeArr.includes(v.code))
        this.totalCount = res.content.dataPage.totalCount
      }
    },
    // 获取物品列表信息
    async getGoodsList() {
      const res = await this.postJson('ws', {apiCode: 501007})
      if (res.code == 0) {
        this.allGoodsList = res.content
        this.goodsTableData = res.content.device
        console.log(this.goodsTableData)
      }
    },
    // 检查增减行的数据格式是否正确
    async checkTableData() {
      return new Promise(resolve => {
        if (this.tableData && this.tableData.length) {
          this.tableData.forEach((v, i) => {
            // 默认要求，goodsId，goodsType，amountMax，是必须的；amountMin默认为0,可以不校验
            // goodsCode，设备编码 如果类型为设备时,此项必填
            if (v.goodsId === '') {
              v.goodsIdRequired = true
              this.$set(this.tableData, i, v)
              resolve(false)
            } else {
              v.goodsIdRequired = false
              this.$set(this.tableData, i, v)
            }
            if (v.goodsType === '') {
              v.goodsTypeRequired = true
              this.$set(this.tableData, i, v)
              resolve(false)
            } else {
              v.goodsTypeRequired = false
              this.$set(this.tableData, i, v)
            }
            if (v.amountMax === '') {
              v.amountMaxRequired = true
              this.$set(this.tableData, i, v)
              resolve(false)
            } else if (!this.Regexp.isNumber(v.amountMax)) {
              v.amountMaxRequired = true
              this.showMsg('数量必须为正整数', 'warning')
              resolve(false)
            } else if (!this.Regexp.isNumber(v.amountMin)) {
              v.amountMinRequired = true
              this.showMsg('数量必须为正整数', 'warning')
              resolve(false)
            } else {
              v.amountMaxRequired = false
              this.$set(this.tableData, i, v)
            }
            if (v.amountMax < 0 || v.amountMin < 0) {
              if (v.amountMax < 0) {
                v.amountMaxRequired = true
                this.showMsg('数量必须为正数', 'warning')
              }
              if (v.amountMin < 0) {
                v.amountMinRequired = true
                this.showMsg('数量必须为正数', 'warning')
              }
              resolve(false)
            }
            if (v.goodsType == 'device' && v.goodsCode === '') {
              console.log(123213)
              v.goodsCodeRequired = true
              this.$set(this.tableData, i, v)
              resolve(false)
            } else {
              v.goodsCodeRequired = false
              this.$set(this.tableData, i, v)
            }
            resolve(true)
          })
        } else {
          resolve(true)
        }
      })
    },
    checkFormData() {
      return new Promise(resolve => {
        this.$refs['ruleForm'].validate(async (valid) => {
          resolve(valid)
        })
      })
    },
    // 提交
    async submit() {
      this.ruleForm.createBy = this.$refs.user.userSelectId
      this.ruleForm.createByName = this.$refs.user.userSelectName
      const formDataCheckedOk = await this.checkFormData()
      const tableDataCheckedOk = await this.checkTableData()
      if (formDataCheckedOk && tableDataCheckedOk) {
        this.ruleForm.dataList = this.tableData
        console.log(this.ruleForm)
        const res = await this.postJson('ws', {apiCode: 502001, content: this.ruleForm})
        if (res.code == 0) {
          this.showMsg('入库成功')
        }
        // this.tableData = []
        // this.ruleForm = {}
        this.refresh()
      }
      console.log('this.tableData', this.tableData)
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
    // checkbox 多选事件
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    // 仓库列表下拉
    async getWareHouseList() {
      const res = await this.postJson('ws', {apiCode: 500008, content: {typeX: 'center'}})
      if (res.code == 0) {
        console.log(res.content)
        this.wareHouseList = res.content
      }
    },
    refresh() {
      this.$router.replace({
        path: '/refresh',
        query: {
          t: Date.now()
        }
      })
    }
  },
  mounted() {
    this.getGoodsList()
    // 仓库列表下拉
    this.getWareHouseList()
  },
  computed: {
    totalPrice() {
      let count = 0
      this.tableData.forEach(v => {
        if (v.amountMin && v.unitValue) {
          count += Number(((Number(v.amountMax) + Number(v.amountMin / v.unitValue)) * v.price).toFixed(2))
        } else if (!(v.amountMin && v.unitValue)) {
          count += v.amountMax * v.price
        }
      })
      return count.toFixed(2)
    },
    ...mapState({
      goodsTypeList: state => state['all_enumDic']['StorageEnum$goodsTypeEnum']
    })
    // ...mapState({
    // wareHouseList: state => state['all_enumDic']['StorageEnum$wareHouseTypeEnum']
    // })
  }
}
</script>

<style lang="scss">
  @import url('../../../../../../assets/css/storage-flow.scss');
</style>
