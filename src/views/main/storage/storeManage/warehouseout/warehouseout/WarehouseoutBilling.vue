<!--入库开单-->
<template>
  <div>
    <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>

    <h3 class="mt10 mb20">
      设备耗材列表
    </h3>
    <div>

      <Table stripe :data="tableData" border style="width: 100%">
        <TableColumn type="index" label="序号" width="50" align="center"></TableColumn>
        <TableColumn label="物品名称" prop="goodsName"></TableColumn>
        <TableColumn label="设备编号">
          <template slot-scope="scope">
            <div v-if="scope.row.type === 'device'">
              <Input v-model="scope.row.code" :class="{'_is-error':scope.row.goodsCodeRequired}"
                     @focus="goodsCodeClicked(scope)"></Input>
              <div :class="{'_is-error':scope.row.goodsCodeRequired}" v-if="scope.row.goodsCodeRequired">请选择设备编号</div>
            </div>
            <div v-if="scope.row.type !== 'device'">
              无
            </div>
          </template>
        </TableColumn>

        <TableColumn label="数量">
          <template slot-scope="scope">
            <div>
              {{ scope.row.maxCount }}{{ scope.row.maxUnit }}
            </div>
            <div v-if="scope.row.minUnit">
              {{ scope.row.minCount }}{{ scope.row.minUnit }}
            </div>
          </template>
        </TableColumn>
        <TableColumn label="大小单位转换值" prop="unitValue"></TableColumn>
        <TableColumn label="单价" prop="price"></TableColumn>
          <!--后台minCount 如果没有默认为0-->
        <TableColumn label="金额">
          <template slot-scope="scope">
                <span v-if="scope.row.unitValue">
                  {{((Number(scope.row.maxCount) + Number(scope.row.minCount / scope.row.unitValue)) * scope.row.price).toFixed(2) }}
                </span>
            <span v-if="!scope.row.unitValue">
                  {{ scope.row.maxCount * scope.row.price }}
                </span>
          </template>
        </TableColumn>
        <TableColumn label="备注" prop="remark">
          <template slot-scope="scope">
            <Input v-model="scope.row.remark"></Input>
          </template>
        </TableColumn>
      </Table>
      <Form :inline="true" class="mt25" label-width="100px" size="mini">
        <!--<FormItem label="附件上传">-->
          <!--<ModalUpload></ModalUpload>-->
        <!--</FormItem>-->
        <FormItem label="合计金额(元)">
          <Input v-model="totalPrice"></Input>
        </FormItem>
      </Form>
      <div class="mt25 mb20 tc">
        <Button type="primary" @click="submit">出库</Button>
      </div>
    </div>
    <!--设备编号--弹窗-->
    <Dialog title="设备编号" :visible.sync="goodsCodeDialogVisible" width="60%">
      <div>

        <Table stripe :data="goodsCodeTableData" border style="width: 100%" height="200" ref="goodsCodeTable"
               @select="selectChange">
          <TableColumn type="selection" width="55" :selectable='checkboxInit'></TableColumn>
          <TableColumn fixed label="序号" width="50" align="center" type="index"></TableColumn>
          <TableColumn label="设备编号" prop="code">
          </TableColumn>
          <TableColumn label="设备大类" prop="deviceTypeName"></TableColumn>
          <TableColumn label="设备类型" prop="deviceVersionName"></TableColumn>
          <TableColumn label="价格" prop="price"></TableColumn>
        </Table>
        <div>
          <Pagination :totalCount="totalCount*1"></Pagination>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Pagination from '@/components/pagination/Pagination'

export default {
  name: 'Subindex',
  data: function () {
    return {
      totalCount: 20,
      goodsCodeTableData: [],
      detail: [],
      activeIndex: 0,
      goodsCodeDialogVisible: false,
      res: '',
      Obj: {},
      msg: '',
      tableData: [
        {
          name: '名称'
        }
      ],
      ruleForm: {
        status: ''
      },
      selectedCode: [],
      dversionId: '',
      goodsId: '',
      fromWarehouse: '' // 查询设备编号的时候的出入仓库
    }
  },
  components: {Pagination},
  computed: {
    totalPrice() {
      let count = 0
      this.tableData.forEach(v => {
        if (v.minCount && v.unitValue) {
          count += Number(((Number(v.maxCount) + Number(v.minCount / v.unitValue)) * v.price).toFixed(2))
        } else if (!(v.minCount && v.unitValue)) {
          count += v.maxCount * v.price
        }
      })
      return count.toFixed(2)
    }
  },
  methods: {
    // 判定编号是否被选择了,同时勾选当前的设备编号值
    checkboxInit(row) {
      if (this.selectedCode.indexOf(row.code) > -1 && this.tableData[this.activeIndex].code !== row.code) {
        return 0//不可勾选
      }
      else {
        return 1//可勾选
      }

    },
    selectChange(selection, row) {
      var codeIndex = this.selectedCode.findIndex((item) => {
        return item === this.tableData[this.activeIndex].code
      })
      if (codeIndex > -1) {
        this.selectedCode.splice(codeIndex, 1)
      }
      this.$refs.goodsCodeTable.clearSelection()
      this.$refs.goodsCodeTable.toggleRowSelection(row, true)
      this.chooseGoodsCode(row)
    },
    // 选择物品编号
    chooseGoodsCode(item) {
      this.$set(this.tableData[this.activeIndex], 'code', item.code)
      this.$set(this.tableData[this.activeIndex], 'goodsCodeRequired', false)
      this.selectedCode.push(item.code)
      this.tableData[this.activeIndex].price = item.price
      this.goodsCodeDialogVisible = false
    },
    async getGoodsCodeTableData(page) {
      const obj = {dversionId: this.dversionId, goodsId: this.goodsId, warehouseId: this.fromWarehouse, page}
      const res = await this.postJson('ws', {apiCode: 501107, content: obj})
      if (res.code == 0) {
        this.goodsCodeTableData = res.content.dataList
        this.totalCount = res.content.dataPage.totalCount
        // 显示的时候如果有设备编号则勾选
        for (var i = 0; i < this.goodsCodeTableData.length; i++) {
          var item = this.goodsCodeTableData[i]
          if (this.tableData[this.activeIndex].code === item.code) {
            this.$nextTick(() => {
              this.$refs.goodsCodeTable.toggleRowSelection(item, true)
            })
            return
          }
        }
      }
    },
    // 设备编号--被点击
    goodsCodeClicked(item) {
      console.log('获取编号item', item, item.$index)
      this.activeIndex = item.$index
      this.goodsCodeDialogVisible = true
      this.dversionId = item.row.versionId
      this.goodsId = item.row.id
      // this.dversionId = ''
      // this.goodsId = ''
      this.getGoodsCodeTableData(1)
      this.Event.$emit('pageInit', 1)
    },
    // 检查增减行的数据格式是否正确
    async checkTableData() {
      return new Promise(resolve => {
        if (this.tableData && this.tableData.length) {
          for (var i = 0; i < this.tableData.length; i++) {
            var v = this.tableData[i]
            if (v.type === 'device' && (v.code === '' || v.code === null)) {
              console.log(123213)
              v.goodsCodeRequired = true
              this.$set(this.tableData, i, v)
              resolve(false)
              break
            }
          }
          resolve(true)
        } else {
          resolve(true)
        }
      })
    },
    async submit() {
      var tableDataCheckedOk = await this.checkTableData()
      console.log('this.tableData', this.tableData, tableDataCheckedOk)

      if (tableDataCheckedOk) {
        var res = await this.postJson('ws', {
          apiCode: 501401,
          content: {
            id: this.$route.params.id,
            resultList: this.tableData,
            type: 'out'
          }
        })
        if (res.code == 0) {
          this.showMsg('操作成功', 'success')
          this.$router.push(`/store/warehouseout`)
        }
      }
    },
    dealTableData(originData) {
      this.tableData = []
      originData.forEach((item) => {
        var newObj = {
          id: item.goodsId,
          type: item.goodsType.value,
          versionId: item.dversionId,
          maxCount: item.amountMax,
          minCount: item.amountMin,
          code: item.goodsCode,
          remark: item.remark,
          unitValue: item.unitValue,
          price: item.price,
          maxUnit: item.maxUnit,
          minUnit: item.minUnit,
          goodsName: item.goodsName
        }
        // 如果是设备类型的数据,数量为几就插入几条数据，每条数据的数量是1
        if (item.goodsType.value === 'device' && item.amountMax > 1) {
          newObj.maxCount = 1
          for (var i =0; i < item.amountMax; i ++) {
            this.tableData.push(JSON.parse(JSON.stringify(newObj)))
          }
        } else {
          this.tableData.push(newObj)
        }
      })
    }
  },
  async mounted() {
    this.Event.$on('pagechange', (val) => {
      this.getGoodsCodeTableData(val)
    })
    let id = this.$route.params.id
    var state = location.hash.split('?')[1].split('=')[1]
    var apiCode = 501403
    if (state === 'todo') {
      apiCode = 501404
    } else {
      apiCode = 501406
    }
    var res = await this.postJson('ws', {
      apiCode,
      content: {
        id
      }
    })
    var flowData
    if (state === 'todo') {
      flowData = res.content.stDispatchBiz.content
    }
    this.detail = [
      {name: '单据编号', value: flowData.id},
      {name: '单据主题', value: flowData.title},
      {name: '出库人员', value: flowData.createByName},
      {name: '出库日期', value: flowData.createDate},
      {name: '出库仓库', value: flowData.fromWarehouseName},
      {name: '入库仓库', value: flowData.toWarehouseName},
      {name: '关联单据', value: flowData.bizId},
      {name: '备注', value: flowData.remark}
    ]
    this.fromWarehouse = flowData.fromWarehouse
    var originData = res.content.detailList

    // 根据设备的数量添加相应数量的数据，然后删除该条多数量的数据
    this.dealTableData(originData)
  }
}
</script>

<style lang="scss">
  .el-input._is-error > .el-input__inner, .el-select._is-error > .el-input > .el-input__inner {
    border-color: #f56c6c
  }

  ._is-error {
    color: #f56c6c;
  }

  .add-minus.el-table .cell {
    line-height: 16px;
  }

  .add-minus.el-table td {
    vertical-align: top;
  }
</style>
