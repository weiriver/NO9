<!--入库开单-->
<template>
  <div>
    <h3 class="mt10 mb20">
      基本信息
    </h3>
    <Form :inline="true" :rules="rules" class="form-inline" label-width="100px" :model="Obj" size="mini"
          ref="Obj">
      <FormItem label="单据主题" prop="title">
        <Input v-model="Obj.title"></Input>
      </FormItem>
      <FormItem label="备注" prop="remark">
        <Input v-model="Obj.remark"></Input>
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
        <!--领用是不不能精确到设备编号的，这一步在出库的时候选择-->
        <!--<TableColumn label="设备编号">-->
        <!--<template slot-scope="scope">-->
        <!--<Input v-model="scope.row.goodsCode" :class="{'_is-error':scope.row.goodsCodeRequired}"></Input>-->
        <!--<div :class="{'_is-error':scope.row.goodsCodeRequired}" v-if="scope.row.goodsCodeRequired">请输入</div>-->
        <!--</template>-->
        <!--</TableColumn>-->
        <TableColumn label="数量(大)">
          <template slot-scope="scope" width="100">
            <div class="inline-block width60">
              <Input v-model="scope.row.amountMax" width="60" type="tel" maxlength="4"
                     :class="{'_is-error':scope.row.amountMaxRequired}" @blur="checkTableData"></Input>
            </div>
            {{scope.row.amountMaxLabel}}
            <div :class="{'_is-error':scope.row.amountMaxRequired}" v-if="scope.row.amountMaxRequired">请输入</div>
          </template>
        </TableColumn>
        <TableColumn label="数量(小)">
          <template slot-scope="scope" width="100">
            <div class="inline-block width60">
              <Input v-model="scope.row.amountMin" width="60"
                     :disabled="!scope.row.amountMinLabel"
                     :class="{'_is-error':scope.row.amountMinRequired}" @blur="checkTableData"></Input>
            </div>
            {{scope.row.amountMinLabel}}
            <div :class="{'_is-error':scope.row.amountMinRequired}" v-if="scope.row.amountMinRequired">请输入</div>
          </template>
        </TableColumn>
        <TableColumn label="单价(元)">
          <template slot-scope="scope" width="60">
            <div style="line-height: 28px;">
              {{scope.row.price}}
            </div>
          </template>
        </TableColumn>
        <!--<TableColumn label="大小单位转换值" prop="unitValue"></TableColumn>-->
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
        <TableColumn label="备注">
          <template slot-scope="scope" width="60">
            <Input v-model="scope.row.remark" width="60"></Input>
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
        <Button type="primary" @click="submit" :disabled="flag">领用申请</Button>
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
          <TableColumn label="小单位" prop="minUnit"></TableColumn>
        </Table>

      </Tabs>
      <div slot="footer" class="dialog-footer">
        <Button @click="dialogVisible = false">取 消</Button>
        <Button type="primary" @click="chooseGoodsName">确 定</Button>
      </div>
    </Dialog>

    <!--设备编号--弹窗-->
    <!--<Dialog title="设备编号" :visible.sync="goodsCodeDialogVisible" width="60%">-->
    <!--<div>-->
    <!--<Table stripe :data="goodsCodeTableData" border style="width: 100%" height="200" ref="goodsCodeTable">-->
    <!--&lt;!&ndash;<TableColumn type="selection" width="55"></TableColumn>&ndash;&gt;-->
    <!--<TableColumn fixed label="序号" width="50" align="center" type="index"></TableColumn>-->
    <!--<TableColumn label="设备编号" prop="code">-->
    <!--<template slot-scope="scope">-->
    <!--<a class="highlight" @click="chooseGoodsCode(scope)">{{scope.row.code}}</a>-->
    <!--</template>-->
    <!--</TableColumn>-->
    <!--<TableColumn label="设备大类" prop="deviceTypeName"></TableColumn>-->
    <!--<TableColumn label="设备类型" prop="deviceVersionName"></TableColumn>-->
    <!--<TableColumn label="价格" prop="price"></TableColumn>-->
    <!--</Table>-->
    <!--<Pagination :totalCount="totalCount*1"></Pagination>-->
    <!--</div>-->
    <!--</Dialog>-->

  </div>
</template>
<script>
import {mapState} from 'vuex'


export default {
  name: 'Subindex',
  data: function () {
    return {
      flag: true, // 申请按钮是否点击，true 不可点击
      totalCount: 20,
      activeIndex: 0,
      dialogVisible: false,
      // 设备编号
      // goodsCodeDialogVisible: false,
      res: '',
      msg: '',
      tableData: [],
      Obj: {},
      rules: {
        title: [
          {required: true, message: '请输入单据主题', trigger: 'blur'}
        ]
      },
      goodsTableData: [],
      allGoodsList: [],
      wareHouseList: [],
      // goodsCodeTableData: [],
      multipleSelection: [],
      flowCode: 0,
      fromNodeCode: '',
      uploadConf: {
        sysModule: 'flow',
        hostBizObj: 'flow_files',
        hostBizId: ''
      },
      goodsLabel: '设备'
    }
  },
  methods: {
    async getWareHouseId() {
      var res = await this.postJson('ws', {apiCode: 500020, content: {}})
      if (res.code == 0) {
        console.log('res.content.warehouseId', res.content.warehouseId)
        this.flag = false
      } else {
        this.showMsg(res.msg, 'error')
        this.flag = true
      }
    },
    // 选择物品名称
    chooseGoodsName(item) {
      let arr = []
      this.multipleSelection.forEach(v => {
        console.log(v)
        arr.push({
          // goodsCode: '', // 默认初始值
          goodsName: v.goodsNameX,
          dversionId: v.versionId,
          dversionIdRequired: false,
          goodsId: v.goodsId,
          goodsIdRequired: false,
          goodsType: v.type ? v.type.value : '',
          goodsTypeRequired: false,
          unitValue: v.unitValue ? v.unitValue : 0,
          price: v.price,
          amountMax: '',
          amountMaxRequired: false,
          amountMaxLabel: v.maxUnit,
          amountMin: '',
          amountMinLabel: v.minUnit,
          amountMinRequired: false
        })
      })
      this.tableData.splice(this.activeIndex, 1)
      this.tableData.splice(this.activeIndex, 0, ...arr)
      // console.log(this.tableData)
      // this.$set(this.tableData[this.activeIndex], 'getNOFlag', true)
      // this.$set(this.tableData[this.activeIndex], 'no', '11111')
      console.log('小单位数量', this.tableData[this.activeIndex].amountMinLabel)
      this.dialogVisible = false
    },
    // 选择物品编号
    // chooseGoodsCode(item) {
    //   let index = item.$index
    //   // this.tableData[index].goodsCode = item.row.code
    //   this.$set(this.tableData[this.activeIndex], 'goodsCode', item.row.code)
    //   console.log(index)
    //   this.goodsCodeDialogVisible = false
    //   // console.log(this.tableData[index].goodsCode)
    // },
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
        // goodsCode: '',
        // goodsCodeRequired: false,
        dversionId: '',
        dversionIdRequired: false,
        unitValue: '',
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
    // // 设备编号--被点击
    // goodsCodeClicked(item) {
    //   console.log('获取编号item', item, item.$index)
    //   let index = item.$index
    //   if (this.tableData[index].goodsType == 'device') {
    //     console.log(this.tableData[index])
    //     this.goodsCodeDialogVisible = true
    //     this.getGoodsCodeTableData(item)
    //   }
    // },
    // async getGoodsCodeTableData(v) {
    //   const obj = {dversionId: v.dversionId, goodsId: v.goodsId}
    //   const res = await this.postJson('ws', {apiCode: 501107, content: obj})
    //   if (res.code == 0) {
    //     console.log(res)
    //     this.goodsCodeTableData = res.content.dataList
    //     this.totalCount = res.content.dataPage.totalCount
    //   }
    // },
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
            if (v.dversionId === '') {
              v.dversionIdRequired = true
              this.$set(this.tableData, i, v)
              resolve(false)
            } else {
              v.dversionIdRequired = false
              this.$set(this.tableData, i, v)
            }
            // 如果是设备的话只判定大单位数量
            if (v.goodsType == 'device') {
              if (v.amountMax === '') {
                v.amountMaxRequired = true
                this.$set(this.tableData, i, v)
                resolve(false)
              } else if (v.amountMax <= 0 || !this.Regexp.isInt(v.amountMax)) {
                v.amountMaxRequired = true
                v.amountMax = ''
                this.showMsg('数量必须为正整数', 'warning')
                this.$set(this.tableData, i, v)
                resolve(false)
              } else {
                v.amountMaxRequired = false
                this.$set(this.tableData, i, v)
              }
            } else {
              if (v.amountMax === '' && v.amountMin === '') {
                v.amountMaxRequired = true
                v.amountMinRequired = true
                this.$set(this.tableData, i, v)
                resolve(false)
              } else if (v.amountMax < 0 || v.amountMin < 0) {
                if (v.amountMax < 0) {
                  v.amountMaxRequired = true
                }
                if (v.amountMin < 0) {
                  v.amountMinRequired = true
                }
                this.showMsg('数量必须为正数', 'warning')
                this.$set(this.tableData, i, v)
                resolve(false)
              } else if (!this.Regexp.isNumber(v.amountMax) || !this.Regexp.isNumber(v.amountMin)) {
                if (!this.Regexp.isNumber(v.amountMax)) {
                  v.amountMaxRequired = true
                }
                if (!this.Regexp.isNumber(v.amountMin)) {
                  v.amountMinRequired = true
                }
                this.showMsg('数量必须为正整数', 'warning')
                this.$set(this.tableData, i, v)
                resolve(false)
              } else if (Number(v.amountMax) + Number(v.amountMin) < 1) {
                v.amountMaxRequired = true
                v.amountMinRequired = true
                this.showMsg('数量和必须大于等于1', 'warning')
                this.$set(this.tableData, i, v)
                resolve(false)
              } else {
                v.amountMaxRequired = false
                v.amountMinRequired = false
                this.$set(this.tableData, i, v)
              }
              //
            }

            // if (v.goodsType == 'device' && v.goodsCode === '') {
            //   console.log(123213)
            //   v.goodsCodeRequired = true
            //   this.$set(this.tableData, i, v)
            //   resolve(false)
            // }
            resolve(true)
          })
        } else {
          resolve(true)
        }
      })
    },
    checkFormData() {
      return new Promise(resolve => {
        this.$refs['Obj'].validate(async (valid) => {
          resolve(valid)
        })
      })
    },
    // 提交
    async submit() {
      const formDataCheckedOk = await this.checkFormData()
      const tableDataCheckedOk = await this.checkTableData()
      console.log(tableDataCheckedOk)
      if (formDataCheckedOk && tableDataCheckedOk) {
        console.log(123)
        this.Obj.resultList = this.tableData.map(v => {
          if (v.amountMin && v.amountMax == '') {
            v.amountMax = 0
          }
          return {
            id: v.goodsId,
            type: v.goodsType,
            versionId: v.dversionId,
            maxCount: v.amountMax,
            minCount: v.amountMin ? v.amountMin : 0,
            // code: v.goodsCode,
            remark: v.remark
          }
        })
        console.log(JSON.stringify(this.Obj))
        const res = await this.postJson('biz', {apiCode: 200079, content: this.Obj})
        if (res.code == 0) {
          this.showMsg('领用申请成功')
          this.refresh()
        }
      }
      console.log('this.tableData', this.tableData)
    },
    refresh() {
      this.$router.replace({
        path: '/refresh',
        query: {
          t: Date.now()
        }
      })
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
    // 获取流程图
    getFlowInfo(flowId) {
      this.postJsonWithMask('common', {
        apiCode: 200053,
        content: {
          flowId,
          sysModule: 'station'
        }
      }).then(res => {
        const nodelist = res.content.nodeList
        console.log(nodelist)
        this.beginNode = nodelist.filter(v => {
          return v.code.includes('begin')
        })[0]
        this.nodeList = nodelist
        this.fromNodeCode = nodelist[1].code
        let userId = sessionStorage.getItem('login') ? JSON.parse(sessionStorage.getItem('login')).uid : JSON.parse(sessionStorage.getItem('loginInfo')).uid
        this.uploadConf.hostBizId = `temp$${userId}$${this.flowCode}$${this.fromNodeCode}`
        this.Obj.flow.fromNodeCode = nodelist[1].code
        this.Obj.flow.fromNodeName = nodelist[1].nameX
        this.Obj.flow.toNodeCode = nodelist[2].code
        this.Obj.flow.toNodeName = nodelist[2].nameX
        this.Obj.flow.acceptByName = nodelist[2].acceptByName
        this.Obj.flow.acceptById = nodelist[2].acceptById
        this.Obj.flow.acceptByType = nodelist[2].acceptByType.value
      })
    }
  },
  mounted() {
    this.getWareHouseId()
    this.getGoodsList()
    // 仓库列表下拉
    this.getWareHouseList()
    // 初始化默认添加1行
    this.addLine()
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
  },
  beforeMount() {
    const flowTypelist = this.$store.state['all_enumDic']['FlowEnum$flowTypeEnum']
    console.log(flowTypelist)
    let flowTarget = flowTypelist.filter(v => {
      return v.text == 'recipients_flow'
    }).map(v => {
      return {flowId: v.value, flowCode: v.text}
    })[0]
    console.log(flowTarget)
    if (flowTarget) {
      let flowName = ''
      let {flowId, flowCode} = flowTarget
      this.flowCode = flowCode
      this.Obj.flowId = flowId
      // this.Obj.title = flowName
      this.Obj.sysModuleEnum = 'storage'
      this.Obj.flow = {}
      this.Obj.flow.bizTitle = flowName
      this.Obj.flow.flowId = flowId
      this.Obj.flow.agreed = true + '' // 是否同意，默认同意
      this.Obj.flow.flowName = flowName
      // 获取流程图
      this.getFlowInfo(flowId)
    }
  },
  components: {}

}
</script>

<style lang="scss">
  @import url('../../../../../../assets/css/storage-flow.scss');
</style>
