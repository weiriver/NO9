<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <Button type="primary" icon="el-icon-edit" @click="toAdd" v-if="Auth(501201)">新增</Button>
        <Select clearable  class="search-select" size="mini" v-model="typeX" placeholder="" @change="typeSelectChange">
          <Option label="类型" value="type"></Option>
          <Option label="型号" value="model"></Option>
          <Option label="基本信息" value="detail"></Option>
        </Select>
      </div>

      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form v-if="typeX === 'type'" :model="ruleFormType" ref="ruleFormType" label-width="120px" :inline="true" class="form-inline" size="mini">

          <FormItem label="设备类型名称" prop="nameX">
            <Input v-model="ruleFormType.nameX"></Input>
          </FormItem>
          <FormItem label="是否内置" prop="isBuildIn">
            <Radio v-model="ruleFormType.isBuildIn" label="true">是</Radio>
            <Radio v-model="ruleFormType.isBuildIn" label="false">否</Radio>
          </FormItem>
          <FormItem label="是否标配" prop="isStandard">
            <Radio v-model="ruleFormType.isStandard" label="true">是</Radio>
            <Radio v-model="ruleFormType.isStandard" label="false">否</Radio>
          </FormItem>
          <FormItem label="是否回收" prop="isRetrieve">
            <Radio v-model="ruleFormType.isRetrieve" label="true">是</Radio>
            <Radio v-model="ruleFormType.isRetrieve" label="false">否</Radio>
          </FormItem>
          <FormItem label="设备状态" prop="status">
            <Select clearable  v-model="ruleFormType.status" placeholder="请选择设备状态">
              <Option label="启用" value="true"></Option>
              <Option label="停用" value="false"></Option>
            </Select>
          </FormItem>

          

          <FormItem class="full-line">
            <Button type="primary" @click="search()">查询</Button>
            <Button @click="resetForm('ruleFormType')">重置</Button>
          </FormItem>
        </Form>
        <Form v-if="typeX === 'model'" :model="ruleFormModel" ref="ruleFormModel" label-width="120px"  :inline="true" class="form-inline" size="mini">

          <!--<FormItem label="设备类型" prop="goodsId">-->
            <!--<Select clearable  v-model="ruleFormModel.goodsId" placeholder="请选择设备类型">-->
              <!--<Option v-for="item in deviceTypeList" :key = "item.id" :value = "item.id" :label="item.nameX"></Option>-->
            <!--</Select>-->
          <!--</FormItem>-->
          <FormItem label="型号名称" prop="nameX">
            <Input v-model="ruleFormModel.nameX"></Input>
          </FormItem>
          <!--<FormItem label="供应商" prop="supplierId">-->
            <!--<Select clearable  v-model="ruleFormModel.supplierId" placeholder="请选择供应商">-->
              <!--<Option v-for="item in supplierList" :key = "item.id" :value = "item.id" :label="item.supplierName"></Option>-->
            <!--</Select>-->
          <!--</FormItem>-->
          <FormItem label="设备状态" prop="status">
            <Select clearable  v-model="ruleFormModel.status" placeholder="请选择设备状态">
              <Option label="启用" value="true"></Option>
              <Option label="停用" value="false"></Option>
            </Select>
          </FormItem>
          <!--<FormItem label="设备型号图片" prop="namexxxxxxx">-->
          <!--<Input v-model="ruleFormModel.namexxxxxxx"></Input>-->
          <!--</FormItem>-->
          <!--<FormItem label="设备单价" prop="price">-->
            <!--<Input v-model="ruleFormModel.price"></Input>-->
          <!--</FormItem>-->
          <!--<FormItem label="设备单位" prop="unit">-->
            <!--<Select clearable  v-model="ruleFormModel.unit" placeholder="请选择设备单位">-->
              <!--<Option v-for="item in unitList" :key = "item.valueX" :value = "item.valueX" :label="item.nameX"></Option>-->
            <!--</Select>-->
          <!--</FormItem>-->

          <FormItem label="是否内置" prop="isBuildIn">
            <Radio v-model="ruleFormModel.isBuildIn" label="true">是</Radio>
            <Radio v-model="ruleFormModel.isBuildIn" label="false">否</Radio>
          </FormItem>
          <!--<FormItem label="预警上限" prop="warnUpperLimit">-->
            <!--<Input v-model="ruleFormModel.warnUpperLimit"></Input>-->
          <!--</FormItem>-->
          <!--<FormItem label="预警下限" prop="warnLowerLimit">-->
            <!--<Input v-model="ruleFormModel.warnLowerLimit"></Input>-->
          <!--</FormItem>-->
          <!--<FormItem label="厂家信息" prop="manufacturerInformation">-->
            <!--<Input v-model="ruleFormModel.manufacturerInformation"></Input>-->
          <!--</FormItem>-->

          <FormItem class="full-line">
            <Button type="primary" @click="search()">查询</Button>
            <Button @click="resetForm('ruleFormModel')">重置</Button>
          </FormItem>
        </Form>
        <Form v-if="typeX === 'detail'" :model="ruleFormDetail" ref="ruleFormDetail" label-width="120px"  :inline="true" class="form-inline" size="mini">
          <!--<FormItem label="设备编号" prop="namexxxxxxx">-->
          <!--<Input v-model="ruleFormDetail.namexxxxxxx"></Input>-->
          <!--</FormItem>-->
          <!--<FormItem label="站点编号" prop="namexxxxxxx">-->
          <!--<Input v-model="ruleFormDetail.namexxxxxxx"></Input>-->
          <!--</FormItem>-->
          <FormItem label="设备类型" prop="goodsId">
            <Select clearable  v-model="ruleFormDetail.goodsId" placeholder="请选择设备类型" @change="deviceTypeChange">
              <Option v-for="item in deviceTypeList" :key = "item.id" :value = "item.id"  :label="item.nameX"></Option>
            </Select>
          </FormItem>
          <FormItem label="设备型号" prop="dversionId">
            <Select clearable  v-model="ruleFormDetail.dversionId" placeholder="请选择设备型号" :disabled="deviceTypeSelected">
              <Option v-for="item in modelTypeList" :key = "item.id" :value = "item.id"  :label="item.nameX"></Option>
            </Select>
          </FormItem>
          <FormItem label="设备序列号" prop="code">
            <Input v-model="ruleFormDetail.code"></Input>
          </FormItem>
          <FormItem label="设备状态" prop="isGood">
            <Select clearable  v-model="ruleFormDetail.isGood" placeholder="请选择设备状态">
              <Option label="正常" value="true"></Option>
              <Option label="故障" value="false"></Option>
            </Select>
          </FormItem>
          <FormItem label="运行状态" prop="runningState">
            <Select clearable  v-model="ruleFormDetail.runningState" placeholder="请选择运行状态">
              <Option v-for="item in runningstateList" :key = "item.value" :value = "item.value"  :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="存放位置" prop="warehouseId">
            <Select clearable  v-model="ruleFormDetail.warehouseId" placeholder="请选择存放位置">
              <Option v-for="item in storeList" :key = "item.id" :value = "item.id"  :label="item.nameX"></Option>
            </Select>
          </FormItem>


          <FormItem label="投入使用日期" prop="useDate">
            <DatePicker
              v-model="ruleFormDetail.useDate"
              type="daterange"
              placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
            </DatePicker>
          </FormItem>
          <FormItem label="到期日期" prop="expireDate">
            <DatePicker
              v-model="ruleFormDetail.expireDate"
              type="daterange"
              placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
            </DatePicker>
          </FormItem>
          <FormItem label="所属区域" prop="regionCode">
            <AreaCascader ref="as" :ruturnAllLevelResultFlag="true" v-model="ruleFormDetail.regionCode" @areaSelectResult="areaSelectResult" :stage="2" :res="regionCode"></AreaCascader>
          </FormItem>


          <FormItem class="full-line">
            <Button type="primary" @click="search()">查询</Button>
            <Button @click="resetForm('ruleFormDetail')">重置</Button>
          </FormItem>
        </Form>


      </div>

      <!--表格-->
      <div slot="TableSlot">
        <Table stripe v-show="typeX === 'type'" :data="tableDataType" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
          <TableColumn
            label="序号"
            width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
            </template>
          </TableColumn>
          <TableColumn label="类型名称" prop="nameX"></TableColumn>
          <TableColumn
            label="是否内置"
            width="100">
            <template slot-scope="scope">
              {{ scope.row.isBuildIn | getTxt }}
            </template>
          </TableColumn>
          <TableColumn
            label="是否标配"
            width="100">
            <template slot-scope="scope">
              {{ scope.row.isStandard | getTxt }}
            </template>
          </TableColumn>
          <TableColumn
            label="是否回收"
            width="100">
            <template slot-scope="scope">
              {{ scope.row.isRetrieve | getTxt }}
            </template>
          </TableColumn>
          <TableColumn
            label="状态"
            width="140">
            <template slot-scope="scope">
              <RadioGroup v-model="scope.row.status" typeOptions @change="(value) =>statusChange(value, scope.row.id)">
                <RadioButton label="true">启用</RadioButton>
                <RadioButton label="false">停用</RadioButton>
              </RadioGroup>
            </template>
          </TableColumn>
          <TableColumn label="备注" prop="remark"></TableColumn>
          <TableColumn
            label="操作"
            width="140">
            <template slot-scope="scope">
              <Button v-if="Auth(501202)" @click="editItem(scope.row.id)" type="text" typeOptions>修改</Button>
              <Button v-if="Auth(501203)" @click="openDeleteDialog(scope.row.id)" type="text" typeOptions>删除</Button>
            </template>
          </TableColumn>
        </Table>


        <Table stripe v-show="typeX === 'model'" :data="tableDataModel" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
          <TableColumn
            label="序号"
            width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
            </template>
          </TableColumn>
          <TableColumn label="型号名称" prop="nameX"></TableColumn>
          <TableColumn label="设备类型" prop="deviceTypeName"></TableColumn>
          <TableColumn
            label="是否内置"
            width="100">
            <template slot-scope="scope">
              {{ scope.row.isBuildIn | getTxt }}
            </template>
          </TableColumn>
          <TableColumn
            label="状态"
            width="140">
            <template slot-scope="scope">
              <RadioGroup v-model="scope.row.status" typeOptions @change="(value) =>statusChange(value, scope.row.id)">
                <RadioButton label="true">启用</RadioButton>
                <RadioButton label="false">停用</RadioButton>
              </RadioGroup>
            </template>
          </TableColumn>
          <TableColumn label="备注" prop="remark"></TableColumn>
          <TableColumn
            label="操作"
            width="210">
            <template slot-scope="scope">
              <Button @click="toDetail(scope.row.id)" type="text" typeOptions>查看</Button>
              <Button v-if="Auth(501302)" @click="editItem(scope.row.id)" type="text" typeOptions>修改</Button>
              <Button v-if="Auth(501303)" @click="openDeleteDialog(scope.row.id)" type="text" typeOptions>删除</Button>
            </template>
          </TableColumn>
        </Table>

        <Table stripe v-show="typeX === 'detail'" :data="tableDataDetail" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
          <TableColumn
            label="序号"
            width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
            </template>
          </TableColumn>
          <TableColumn label="设备类型" prop="deviceTypeName"></TableColumn>
          <TableColumn label="设备型号" prop="deviceVersionName"></TableColumn>
          <TableColumn label="设备序列号" prop="code" width="120"></TableColumn>
          <!--<TableColumn label="所属区域" prop="regionName"></TableColumn>-->
          <TableColumn label="存放位置" prop="warehouseName"></TableColumn>
          <!--<TableColumn label="投入使用日期" prop="useDate"></TableColumn>-->
          <!--<TableColumn label="到期日期" prop="expireDate"></TableColumn>-->
          <TableColumn
            label="运行状态"
            width="100">
            <template slot-scope="scope">
              {{ scope.row.runningState | getTxt }}
            </template>
          </TableColumn>
          <TableColumn
            label="设备状态"
            width="100">
            <template slot-scope="scope">
              {{ scope.row.isGood ? '正常' : '故障' }}
            </template>
          </TableColumn>
          <TableColumn
            label="操作"
            width="210">
            <template slot-scope="scope">
              <Button @click="toDetail(scope.row.id)" type="text" typeOptions>查看</Button>
              <Button v-if="Auth(501102)" @click="editItem(scope.row.id)" type="text" typeOptions>修改</Button>
              <Button @click="toCv(scope.row.code)" type="text" typeOptions>履历</Button>
              <Button v-if="Auth(501103)" @click="openDeleteDialog(scope.row.id)" type="text" typeOptions>删除</Button>
            </template>
          </TableColumn>
        </Table>

      </div>

    </TablePage>
    <Dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <div>
        此操作将永久删除该文件, 是否继续?
      </div>
      <span slot="footer" class="dialog-footer">
      <Button @click="dialogVisible = false">取 消</Button>
      <Button type="primary" @click="deleteItem">确 定</Button></span>
    </Dialog>
  </div>
</template>

<script>
  export default {
    name: 'Subindex',
    data: function () {
      return {
        deviceTypeSelected: true,
        modelTypeList: [],
        unitList: [],
        supplierList: [],
        deviceTypeList: [],
        storeList: [],
        ruleFormType: {
        },
        ruleFormModel: {
        },
        ruleFormDetail: {
        },
        dialogVisible: false,
        deleteId: '',
        confirmSearch: {
          page: 1
        },
        typeX: 'type',
        totalCount: 20,
        regionCode: '',
        Obj: {},
        tableHeight: 0,
        msg: '',
        tableDataType: [],
        tableDataModel: [],
        tableDataDetail: [],
        searchForm: {
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
        // console.log('detailList变化', this.detailList, val)
        console.log('val', val)
        if (this.typeX === 'model') {
          this.getDeviceType()
          this.getSupplierList()
          // this.getUnitList()
        }
        if (this.typeX === 'detail') {
          this.getDeviceType()
          this.getStoreList()
        }
        this.search()
      }
    },
    methods: {
      toCv (code) {
        this.$router.push(`/storeSet/deviceListCv/${code}`)
      },
      async getStoreList() {
        var res = await this.postJson('ws', {
          apiCode: 500004,
          content: {
            paginated: false
          }
        })
        if (res.code == 0) {
          console.log('getStoreList', res.content)
          this.storeList = res.content.dataList
        }
      },
      deviceTypeChange (val) {
        console.log('val', val)
        this.deviceTypeSelected = true
        this.getModelType()
      },
      async getModelType () {
        var res = await this.postJson('ws', {
          apiCode: 501307,
          content: {
            typeId: this.ruleFormDetail.goodsId
          }
        })
        if (res.code == 0) {
          this.modelTypeList = res.content
          this.deviceTypeSelected = false
        }
      },
      // async getUnitList() {
      //   // 获取枚举、数字字典
      //   var res = await this.postJson('base', {
      //     apiCode: 200031,
      //     content: {
      //       sysModule: 'storage',
      //       typeX: 'stDeviceUnit'
      //     }
      //   })
      //   if (res.code === '0') {
      //     this.unitList = res.content.dataList
      //   }
      // },
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
      async getDeviceType () {
        var res = await this.postJson('ws', {
          apiCode: 501008,
          content: {
            type: 'device'
          }
        })
        if (res.code == 0) {
          this.deviceTypeList = res.content
        }
      },
      openDeleteDialog(id) {
        this.dialogVisible = true
        this.deleteId = id
      },
      async deleteItem () {
        var apiCode = 501203
        if (this.typeX === 'type') {
          apiCode = 501203
        }
        if (this.typeX === 'model') {
          apiCode = 501303
        }
        if (this.typeX === 'detail') {
          apiCode = 501103
        }
        var res = await this.postJson('ws', {
          apiCode,
          content: {
            id: this.deleteId
          }
        })
        if (res.code == 0) {
          this.showMsg('删除成功', 'success')
          this.init()
          this.dialogVisible = false
        }
      },
      toAdd() {
        this.$router.push(`/storeSet/deviceAdd?variety=${this.typeX}`)
      },
      initAboutTypeX () {
        var ruleFormName = 'ruleFormType'
        if (this.typeX === 'type') {
          ruleFormName = 'ruleFormType'
        }
        if (this.typeX === 'model') {
          ruleFormName = 'ruleFormModel'
        }
        if (this.typeX === 'detail') {
          ruleFormName = 'ruleFormDetail'
          if (this.ruleFormDetail.useDate) {
            this.ruleFormDetail.useStartTime = this.ruleFormDetail.useDate[0]
            this.ruleFormDetail.useEndTime = this.ruleFormDetail.useDate[1]
          }
          if (this.ruleFormDetail.expireDate) {
            this.ruleFormDetail.expirationStartTime = this.ruleFormDetail.expireDate[0]
            this.ruleFormDetail.expirationEndTime = this.ruleFormDetail.expireDate[1]
          }
        }
        this.searchForm = this[ruleFormName]
        this.searchForm.page = 1
      },
      typeSelectChange (val) {
      },
      areaSelectResult (result) {
        console.log('areaSelectResult', result)
        // 第一次加载会触发但是 result是空
        // console.log('this.ruleForm.regionCode', this.ruleForm.regionCode)
        // console.log('this.regionCode', this.regionCode)
        if (result.length > 0) {
          this.searchForm.regionCode = result[result.length - 1].value
          this.searchForm.regionName = result[result.length - 1].label
        } else {
          this.searchForm.regionCode = ''
          this.searchForm.regionName = ''
        }
      },
      async statusChange (value, id) {
        var apiCode = 501205
        if (this.typeX === 'type') {
          apiCode = 501205
        }
        if (this.typeX === 'model') {
          apiCode = 501305
        }
        console.log('新状态的值', value, id)
        var res = await this.postJson('ws', {
          apiCode,
          content: {
            id: id,
            status: value
          }
        })
        console.log('数据返回', res.content)
        if (res.code == 0) {
          this.showMsg('状态修改成功', 'success')
          this.init()
        }
      },
      toDetail (id) {
        this.$router.push(`/storeSet/deviceDetail/${id}?variety=${this.typeX}`)
      },
      editItem (id) {
        console.log('`/storeSet/deviceAdd/${id}?variety=${this.typeX}`', `/storeSet/deviceAdd/${id}?variety=${this.typeX}`)
        this.$router.push(`/storeSet/deviceAdd/${id}?variety=${this.typeX}`)
      },
      async init() {
        this.Event.$on('pagechange', (val) => {
          this.confirmSearch.page = val
          this.query()
        })
        // 获取 type
        if(location.hash.includes('?')) {
          this.typeX = location.hash.split('?')[1].split('=')[1]
        }
        this.search()
      },
      search () {
        this.initAboutTypeX()
        this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
        console.log('this.confirmSearch', this.confirmSearch)
        this.Event.$emit('pageInit', 1)
        this.query()
      },
      async query() {
        var apiCode = 501204
        var tableName = 'tableDataType'
        if (this.typeX === 'type') {
          apiCode = 501204
          tableName = 'tableDataType'
        }
        if (this.typeX === 'model') {
          apiCode = 501304
          tableName = 'tableDataModel'
        }
        if (this.typeX === 'detail') {
          apiCode = 501104
          tableName = 'tableDataDetail'
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
        this[formName] = {
        }
        this.searchForm = {}
        console.log('重置', this.searchForm, this[formName])
        if (this.typeX === 'detail') {
          this.$refs.as.clear()
          this.deviceTypeSelected = true
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
