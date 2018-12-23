<template>
  <div>

    <Tabs class="_blue-header" type="border-card" v-model="typeX" @tab-click="tabClick">

      <TabPane label="类型" name="type">
        <div>
          <div class="content_title">
            基本信息
          </div>
          <Form v-if="typeX === 'type'" :model="ruleFormType" :rules="rulesType" ref="ruleFormType" label-width="120px"
                class="ruleForm">

            <FormItem label="设备类型名称" prop="nameX">
              <Input v-model="ruleFormType.nameX"></Input>
            </FormItem>
            <FormItem label="设备单位" prop="maxUnit">
              <Select clearable v-model="ruleFormType.maxUnit" placeholder="请选择设备单位">
                <Option v-for="item in unitList" :key="item.value" :value="item.value" :label="item.text"></Option>
              </Select>
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


            <FormItem label="备注" prop="remark">
              <Input type="textarea"
                     autosize
                     v-model="ruleFormType.remark"></Input>
            </FormItem>

            <FormItem>
              <Button type="primary" @click="submitForm('ruleFormType')">保存</Button>
              <Button @click="resetForm('ruleFormType')">重置</Button>
            </FormItem>
          </Form>

        </div>
      </TabPane>
      <TabPane label="型号" name="model">
        <div class="content_title">
          基本信息
        </div>
        <div>
          <Form v-if="typeX === 'model'" :model="ruleFormModel" :rules="rulesModel" ref="ruleFormModel"
                label-width="120px" class="ruleForm">

            <FormItem label="设备类型" prop="goodsId">
              <Select clearable v-model="ruleFormModel.goodsId" placeholder="请选择设备类型">
                <Option v-for="item in deviceTypeList" :key="item.id" :value="item.id" :label="item.nameX"></Option>
              </Select>
            </FormItem>
            <FormItem label="型号名称" prop="nameX">
              <Input v-model="ruleFormModel.nameX"></Input>
            </FormItem>
            <FormItem label="供应商" prop="supplierId">
              <Select clearable v-model="ruleFormModel.supplierId" placeholder="请选择供应商">
                <Option v-for="item in supplierList" :key="item.id" :value="item.id"
                        :label="item.supplierName"></Option>
              </Select>
            </FormItem>
            <FormItem label="设备单价" prop="price">
              <Input v-model="ruleFormModel.price"></Input>
            </FormItem>


            <FormItem label="是否内置" prop="isBuildIn">
              <Radio v-model="ruleFormModel.isBuildIn" label="true">是</Radio>
              <Radio v-model="ruleFormModel.isBuildIn" label="false">否</Radio>
            </FormItem>
            <FormItem label="预警上限" prop="warnUpperLimit">
              <Input v-model="ruleFormModel.warnUpperLimit"></Input>
            </FormItem>
            <FormItem label="预警下限" prop="warnLowerLimit">
              <Input v-model="ruleFormModel.warnLowerLimit"></Input>
            </FormItem>
            <FormItem label="厂家信息" prop="manufacturerInformation">
              <Input v-model="ruleFormModel.manufacturerInformation"></Input>
            </FormItem>


            <FormItem label="备注" prop="remark">
              <Input type="textarea"
                     autosize
                     v-model="ruleFormModel.remark"></Input>
            </FormItem>

            <FormItem label="上传图片" prop="abd">
              <ModalUpload class="mb20" :api="uploadConf" :isMultiple="true">
                <div slot="warnTxt">只能上传jpg/png文件，且不超过500kb</div>
              </ModalUpload>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="submitForm('ruleFormModel')">保存</Button>
              <Button @click="resetForm('ruleFormModel')">重置</Button>
            </FormItem>
          </Form>
        </div>
      </TabPane>
      <TabPane label="基本信息" name="detail">
        <div class="content_title">
          基本信息
        </div>
        <div>
          <Form v-if="typeX === 'detail'" :model="ruleFormDetail" :rules="rulesDetail" ref="ruleFormDetail"
                label-width="120px" class="ruleForm">
            <!--<FormItem label="设备编号" prop="namexxxxxxx">-->
            <!--<Input v-model="ruleFormDetail.namexxxxxxx"></Input>-->
            <!--</FormItem>-->
            <!--<FormItem label="站点编号" prop="namexxxxxxx">-->
            <!--<Input v-model="ruleFormDetail.namexxxxxxx"></Input>-->
            <!--</FormItem>-->
            <FormItem label="设备类型" prop="goodsId">
              <Select clearable v-model="ruleFormDetail.goodsId" placeholder="请选择设备类型" @change="deviceTypeChange">
                <Option v-for="item in deviceTypeList" :key="item.id" :value="item.id" :label="item.nameX"></Option>
              </Select>
            </FormItem>
            <FormItem label="设备型号" prop="dversionId">
              <Select clearable v-model="ruleFormDetail.dversionId" placeholder="请选择设备型号"
                      :disabled="deviceTypeSelected">
                <Option v-for="item in modelTypeList" :key="item.id" :value="item.id" :label="item.nameX"></Option>
              </Select>
            </FormItem>
            <FormItem label="设备序列号" prop="code">
              <Input v-model="ruleFormDetail.code"></Input>
            </FormItem>
            <!--<FormItem label="设备状态" prop="isGood">-->
            <!--<Select clearable  v-model="ruleFormDetail.isGood" placeholder="请选择设备状态">-->
            <!--<Option label="正常" value="true"></Option>-->
            <!--<Option label="故障" value="false"></Option>-->
            <!--</Select>-->
            <!--</FormItem>-->
            <!--<FormItem label="运行状态" prop="runningState">-->
            <!--<Select clearable  v-model="ruleFormDetail.runningState" placeholder="请选择运行状态">-->
            <!--<Option v-for="item in runningstateList" :key = "item.value" :value = "item.value"  :label="item.text"></Option>-->
            <!--</Select>-->
            <!--</FormItem>-->
            <!--<FormItem label="存放位置" prop="warehouseId">-->
            <!--<Select clearable  v-model="ruleFormDetail.warehouseId" placeholder="请选择存放位置">-->
            <!--<Option v-for="item in storeList" :key = "item.id" :value = "item.id"  :label="item.nameX"></Option>-->
            <!--</Select>-->
            <!--</FormItem>-->


            <!--<FormItem label="投入使用日期" prop="useDate">-->
            <!--<DatePicker-->
            <!--v-model="ruleFormDetail.useDate"-->
            <!--type="date"-->
            <!--placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">-->
            <!--</DatePicker>-->
            <!--</FormItem>-->
            <!--<FormItem label="到期日期" prop="expireDate">-->
            <!--<DatePicker-->
            <!--v-model="ruleFormDetail.expireDate"-->
            <!--type="date"-->
            <!--placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">-->
            <!--</DatePicker>-->
            <!--</FormItem>-->
            <!--<FormItem label="所属区域" prop="regionCode">-->
            <!--<AreaCascader ref="as" :ruturnAllLevelResultFlag="true" v-model="ruleFormDetail.regionCode" @areaSelectResult="areaSelectResult" :stage="2" :res="regionCode"></AreaCascader>-->
            <!--</FormItem>-->
            <!--<FormItem label="设备编号" prop="namexxxxxxx">-->
            <!--<Input v-model="ruleFormDetail.namexxxxxxx"></Input>-->
            <!--</FormItem>-->
            <!--<FormItem label="价格" prop="namexxxxxxx">-->
            <!--<Input v-model="ruleFormDetail.namexxxxxxx"></Input>-->
            <!--</FormItem>-->
            <!--<FormItem label="押金" prop="namexxxxxxx">-->
            <!--<Input v-model="ruleFormDetail.namexxxxxxx"></Input>-->
            <!--</FormItem>-->
            <FormItem label="备注" prop="remark">
              <Input type="textarea"
                     autosize
                     v-model="ruleFormDetail.remark"></Input>
            </FormItem>

            <FormItem>
              <Button type="primary" @click="submitForm('ruleFormDetail')">保存</Button>
              <Button @click="resetForm('ruleFormDetail')">重置</Button>
            </FormItem>
          </Form>
        </div>
      </TabPane>
    </Tabs>


  </div>
</template>

<script>
export default {
  data() {
    return {
      uploadConf: {
        sysModule: 'storage',
        hostBizObj: 'st_device_version',
        hostBizId: ''
      },
      storeList: [],
      deviceTypeSelected: true,
      modelTypeList: [],
      unitList: [],
      supplierList: [],
      deviceTypeList: [],
      typeX: 'type',
      regionCode: '',
      ruleFormType: {
        isBuildIn: 'true',
        isStandard: 'true',
        isRetrieve: 'true'
      },
      ruleFormModel: {
        isBuildIn: 'true'
      },
      ruleFormDetail: {},
      rulesType: {
        nameX: [
          {required: true, message: '请输入设备类型名称', trigger: 'blur'}
        ],
        maxUnit: [
          {required: true, message: '请选择设备单位', trigger: 'change'}
        ],
        isStandard: [
          {required: true, message: '请选择是否标配', trigger: 'change'}
        ],
        isBuildIn: [
          {required: true, message: '请选择是否内置', trigger: 'change'}
        ],
        isRetrieve: [
          {required: true, message: '请选择是否回收', trigger: 'change'}
        ]
      },
      rulesModel: {
        goodsId: [
          {required: true, message: '请选择设备类型', trigger: 'change'}
        ],
        nameX: [
          {required: true, message: '请输入设备型号名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入设备序列号', trigger: 'blur'}
        ],
        supplierId: [
          {required: true, message: '请选择供应商', trigger: 'change'}
        ],
        price: [
          {required: true, message: '请输入设备单价', trigger: 'blur'}
        ],
        isBuildIn: [
          {required: true, message: '请选择是否内置', trigger: 'change'}
        ],
        warnUpperLimit: [
          {required: true, message: '请输入预警上限', trigger: 'blur'}
        ],
        warnLowerLimit: [
          {required: true, message: '请输入预警下限', trigger: 'blur'}
        ]
      },
      rulesDetail: {
        code: [
          {required: true, message: '请输入设备序列号', trigger: 'blur'}
        ],
        goodsId: [
          {required: true, message: '请选择设备类型', trigger: 'change'}
        ],
        dversionId: [
          {required: true, message: '请选择设备型号', trigger: 'change'}
        ],
        isGood: [
          {required: true, message: '请选择设备状态', trigger: 'change'}
        ],
        runningState: [
          {required: true, message: '请选择运行状态', trigger: 'change'}
        ],
        supplierId: [
          {required: true, message: '请选择供应商', trigger: 'change'}
        ],
        warehouseId: [
          {required: true, message: '请选择存放位置', trigger: 'change'}
        ],
        useDate: [
          {required: true, message: '请选择投入使用日期', trigger: 'change'}
        ],
        expireDate: [
          {required: true, message: '请选择到期日期', trigger: 'change'}
        ],
        regionCode: [
          {required: true, message: '请选择所属区域', trigger: 'change'}
        ]
      }
    }
  },
  computed: {
    runningstateList() {
      return JSON.parse(sessionStorage.getItem('all_enumDic')).StorageEnum$runningstateEnum
      // return this.$store.state['all_enumDic'].StorageEnum$runningstateEnum
    }
  },
  methods: {
    deviceTypeChange(val) {
      console.log('val', val)
      this.deviceTypeSelected = true
      this.getModelType()
    },
    async getModelType() {
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
    async getUnitList() {
      this.unitList = this.$store.state.all_enumDic.stDeviceUnit
    },
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
    async getDeviceType() {
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
    areaSelectResult(result) {
      console.log('areaSelectResult', result)
      // 第一次加载会触发但是 result是空
      this.ruleFormDetail.regionCode = result[result.length - 1].value
      this.ruleFormDetail.regionName = result[result.length - 1].label
      // console.log('this.ruleForm.regionCode', this.ruleForm.regionCode)
      // console.log('this.regionCode', this.regionCode)
    },
    submitForm(formName) {
      var apiCode = 501201
      if (this.$route.params.id) {
        if (this.typeX === 'type') {
          apiCode = 501202
          delete this[formName].isDelete
        }
        if (this.typeX === 'model') {
          apiCode = 501302
        }
        if (this.typeX === 'detail') {
          apiCode = 501102
        }
      } else {
        if (this.typeX === 'type') {
          apiCode = 501201
        }
        if (this.typeX === 'model') {
          apiCode = 501301
        }
        if (this.typeX === 'detail') {
          apiCode = 501101
        }
      }

      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.$route.params.id) {
            this[formName].id = this.$route.params.id
          }
          var res = await this.postJson('ws', {
            apiCode,
            content: this[formName]
          })
          console.log('数据返回', res.content)
          if (res.code == 0) {
            if (this.$route.params.id) {
              this.showMsg('修改成功', 'success')
            } else {
              this.showMsg('新增成功', 'success')
            }

            this.$router.push(`/storeSet/deviceList?variety=${this.typeX}`)
          } else {
            this.showMsg(res.msg, 'warning')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      if (this.$route.params.id) {
        this.initDevice()
      } else {
        if (formName === 'ruleFormType') {
          this.ruleFormType = {
            isBuildIn: 'true',
            isStandard: 'true',
            isRetrieve: 'true'
          }
        }
        if (formName === 'ruleFormModel') {
          this.ruleFormModel = {
            isBuildIn: 'true'
          }
        }
        if (formName === 'ruleFormDetail') {
          this.ruleFormDetail = {}
        }
      }
    },
    tabClick(tab, event) {
      console.log('tab 更改', this.typeX)
      if (this.typeX === 'type') {
        this.getUnitList()
      }
      if (this.typeX === 'model') {
        this.getDeviceType()
        this.getSupplierList()
      }
      if (this.typeX === 'detail') {
        this.getDeviceType()
        // this.getStoreList()
      }
    },
    async initDevice() {
      let id = this.$route.params.id
      var apiCode = 501206
      var ruleFormName = 'ruleFormType'
      if (this.typeX === 'type') {
        apiCode = 501206
        ruleFormName = 'ruleFormType'
        this.getUnitList()
      }
      if (this.typeX === 'model') {
        apiCode = 501306
        ruleFormName = 'ruleFormModel'
        this.uploadConf.hostBizId = id
        this.getDeviceType()
        this.getSupplierList()
      }
      if (this.typeX === 'detail') {
        apiCode = 501105
        ruleFormName = 'ruleFormDetail'
        this.getDeviceType()
        // this.getStoreList()
      }
      var res = await this.postJson('ws', {
        apiCode,
        content: {
          id
        }
      })
      if (res.code == 0) {
        this[ruleFormName] = this.BooleanToString(res.content)
        if (this.typeX === 'detail') {
          this.ruleFormDetail.useDate = this.ToDate(this.ruleFormDetail.useDate)
          this.ruleFormDetail.expireDate = this.ToDate(this.ruleFormDetail.expireDate)
          this[ruleFormName].runningState = this[ruleFormName].runningState.value
          this.regionCode = this.ruleFormDetail.regionCode
        }
      }
    },
    refresh() {
      this.$router.replace({
        path: '/refresh',
        query: {
          t: Date.now()
        }
      })
    },
    routerChange() {
      this.refresh()
    }
  },
  watch: {
    '$route': 'routerChange'
  },
  mounted: async function () {
    if (location.hash.includes('?')) {
      this.typeX = location.hash.split('?')[1].split('=')[1]
    }
    let id = this.$route.params.id
    if (id) {
      this.initDevice()
    } else {
      this.getDeviceType()
      this.getSupplierList()
      this.getUnitList()
      // this.getStoreList()
    }
  }
}
</script>

<style lang="scss">
  .device-type-select-block {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 16px;
    label {
      width: 120px;
      text-align: right;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    .el-select {
      width: 300px;
    }
  }
</style>
