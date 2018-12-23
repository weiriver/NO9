<template>
  <div>

    <Tabs class="_blue-header" type="border-card" v-model="typeX" @tab-click="tabClick">

      <TabPane label="设施" name="facilities">
        <div class="content_title">
          基本信息
        </div>
        <Form :model="ruleFormfacilities" :rules="rulesfacilities" ref="ruleFormfacilities" label-width="120px"
              class="ruleForm">
          <FormItem label="设施名称" prop="nameX">
            <Input v-model="ruleFormfacilities.nameX"></Input>
          </FormItem>
          <FormItem label="设施编号" prop="code">
            <Input v-model="ruleFormfacilities.code"></Input>
          </FormItem>
          <FormItem label="设施单价" prop="price">
            <Input v-model="ruleFormfacilities.price"></Input>
          </FormItem>
          <FormItem label="设施大单位" prop="maxUnit">
            <Select clearable v-model="ruleFormfacilities.maxUnit" placeholder="请选择设施大单位">
              <Option v-for="item in unitList" :key="item.value" :value="item.value" :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="设施小单位" prop="minUnit">
            <Select clearable v-model="ruleFormfacilities.minUnit" placeholder="请选择设施小单位">
              <Option v-for="item in unitList" :key="item.value" :value="item.value" :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="大小单位转化值" prop="unitValue">
            <Input v-model="ruleFormfacilities.unitValue"></Input>
          </FormItem>
          <FormItem label="供应商" prop="supplierId">
            <Select clearable v-model="ruleFormfacilities.supplierId" placeholder="请选择供应商">
              <Option v-for="item in supplierList" :key="item.id" :value="item.id" :label="item.supplierName"></Option>
            </Select>
          </FormItem>
          <FormItem label="预警上限" prop="warnUpperLimit">
            <Input v-model="ruleFormfacilities.warnUpperLimit"></Input>
          </FormItem>
          <FormItem label="预警下限" prop="warnLowerLimit">
            <Input v-model="ruleFormfacilities.warnLowerLimit"></Input>
          </FormItem>
          <FormItem label="厂家信息" prop="manufacturerInformation">
            <Input v-model="ruleFormfacilities.manufacturerInformation"></Input>
          </FormItem>
          <FormItem label="备注" prop="remark">
            <Input type="textarea"
                   autosize
                   v-model="ruleFormfacilities.remark"></Input>
          </FormItem>
          <FormItem label="上传图片" prop="abd">
            <ModalUpload class="mb20" :api="uploadConfFacilities" :isMultiple="true">
              <div slot="warnTxt">只能上传jpg/png文件，且不超过500kb</div>
            </ModalUpload>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submitForm('ruleFormfacilities')">保存</Button>
            <Button @click="resetForm('ruleFormfacilities')">重置</Button>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="耗材" name="consumables">
        <div class="content_title">
          基本信息
        </div>
        <Form :model="ruleFormconsumables" :rules="rulesconsumables" ref="ruleFormconsumables" label-width="120px"
              class="ruleForm">

          <FormItem label="耗材名称" prop="nameX">
            <Input v-model="ruleFormconsumables.nameX"></Input>
          </FormItem>
          <FormItem label="耗材编号" prop="code">
            <Input v-model="ruleFormconsumables.code"></Input>
          </FormItem>
          <FormItem label="耗材单价（元）" prop="price">
            <Input v-model="ruleFormconsumables.price"></Input>
          </FormItem>
          <FormItem label="耗材大单位" prop="maxUnit">
            <Select clearable v-model="ruleFormconsumables.maxUnit" placeholder="请选择耗材大单位">
              <Option v-for="item in unitList" :key="item.value" :value="item.value" :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="耗材小单位" prop="minUnit">
            <Select clearable v-model="ruleFormconsumables.minUnit" placeholder="请选择耗材小单位">
              <Option v-for="item in unitList" :key="item.value" :value="item.value" :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="大小单位转化值" prop="unitValue">
            <Input v-model="ruleFormconsumables.unitValue"></Input>
          </FormItem>
          <FormItem label="供应商" prop="supplierId">
            <Select clearable v-model="ruleFormconsumables.supplierId" placeholder="请选择供应商">
              <Option v-for="item in supplierList" :key="item.id" :value="item.id" :label="item.supplierName"></Option>
            </Select>
          </FormItem>

          <FormItem label="预警上限" prop="warnUpperLimit">
            <Input v-model="ruleFormconsumables.warnUpperLimit"></Input>
          </FormItem>
          <FormItem label="预警下限" prop="warnLowerLimit">
            <Input v-model="ruleFormconsumables.warnLowerLimit"></Input>
          </FormItem>
          <FormItem label="厂家信息" prop="manufacturerInformation">
            <Input v-model="ruleFormconsumables.manufacturerInformation"></Input>
          </FormItem>
          <FormItem label="备注" prop="remark">
            <Input type="textarea"
                   autosize
                   v-model="ruleFormconsumables.remark"></Input>
          </FormItem>
          <FormItem label="上传图片" prop="abd">
            <ModalUpload class="mb20" :api="uploadConfConsumables" :isMultiple="true">
              <div slot="warnTxt">只能上传jpg/png文件，且不超过500kb</div>
            </ModalUpload>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submitForm('ruleFormconsumables')">保存</Button>
            <Button @click="resetForm('ruleFormconsumables')">重置</Button>
          </FormItem>
        </Form>
      </TabPane>
    </Tabs>

  </div>
</template>

<script>
export default {
  data() {
    return {
      uploadConfFacilities: {
        sysModule: 'storage',
        hostBizObj: 'st_facilities',
        hostBizId: ''
      },
      uploadConfConsumables: {
        sysModule: 'storage',
        hostBizObj: 'st_goods_type',
        hostBizId: ''
      },
      supplierList: [],
      typeX: 'facilities',
      ruleFormconsumables: {},
      ruleFormfacilities: {},
      rulesfacilities: {
        nameX: [
          {required: true, message: '请输入设施名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入设施编号', trigger: 'blur'}
        ],
        maxUnit: [
          {required: true, message: '请选择设施大单位', trigger: 'change'}
        ],
        minUnit: [
          {required: true, message: '请选择设施小单位', trigger: 'change'}
        ],
        unitValue: [
          {required: true, message: '请选择大小单位转化值', trigger: 'change'}
        ],
        warnUpperLimit: [
          {required: true, message: '请输入预警上限', trigger: 'blur'}
        ],
        warnLowerLimit: [
          {required: true, message: '请输入预警下限', trigger: 'blur'}
        ]
      },
      rulesconsumables: {
        nameX: [
          {required: true, message: '请输入耗材名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入耗材编号', trigger: 'blur'}
        ],
        extInfo: [
          {required: true, message: '请输入耗材型号', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '请输入耗材单价', trigger: 'blur'}
        ],
        maxUnit: [
          {required: true, message: '请选择耗材大单位', trigger: 'change'}
        ],
        minUnit: [
          {required: true, message: '请选择耗材小单位', trigger: 'change'}
        ],
        unitValue: [
          {required: true, message: '请选择大小单位转化值', trigger: 'change'}
        ],
        warnUpperLimit: [
          {required: true, message: '请输入预警上限', trigger: 'blur'}
        ],
        warnLowerLimit: [
          {required: true, message: '请输入预警下限', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    unitList() {
      return this.$store.state.all_enumDic.stDeviceUnit
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
    submitForm(formName) {
      this[formName].typeX = this.typeX
      var apiCode = 501001
      if (this.$route.params.id) {
        apiCode = 501002
      } else {
        apiCode = 501001
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

            this.$router.push(`/storeSet/consumableList?variety=${this.typeX}`)
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
        if (formName === 'ruleFormconsumables') {
          this.ruleFormconsumables = {}
        }
        if (formName === 'ruleFormfacilities') {
          this.ruleFormfacilities = {}
        }
      }
    },
    tabClick(tab, event) {
    },
    async initDevice() {
      let id = this.$route.params.id
      var apiCode = 501005
      var ruleFormName = 'ruleFormType'
      if (this.typeX === 'consumables') {
        ruleFormName = 'ruleFormconsumables'
        this.uploadConfConsumables.hostBizId = id
      }
      if (this.typeX === 'facilities') {
        ruleFormName = 'ruleFormfacilities'
        this.uploadConfFacilities.hostBizId = id
      }
      var res = await this.postJson('ws', {
        apiCode,
        content: {
          id
        }
      })
      if (res.code == 0) {
        this[ruleFormName] = this.BooleanToString(res.content)
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
    await this.getSupplierList()
    if (location.hash.includes('?')) {
      this.typeX = location.hash.split('?')[1].split('=')[1]
    }
    let id = this.$route.params.id
    console.log('id', id)
    if (id) {
      this.initDevice()
    }
  }
}
</script>

<style></style>
