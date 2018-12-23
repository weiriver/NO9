<template>
  <div class="SitesBindAdd">
    <div class="content_title">
      基本信息
    </div>
    <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
      <FormItem label="站点编号" prop="stationCode">
        <Autocomplete
                v-model="ruleForm.stationCode"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入内容"
                @select="handleSelect"
        ></Autocomplete>
        <Button style="margin-left: 25px;" :disabled="!(ruleForm.stationCode&&ruleForm.stationCode.length===8)" @click="showDetail(ruleForm.stationCode)">站点信息</Button>
      </FormItem>
      <FormItem label="即开站编号" prop="jkStationCode">
        <Input v-model="ruleForm.jkStationCode" placeholder="选填一个栏位,正整数" ></Input>
      </FormItem>
      <FormItem label="中福大厅编号" prop="zfStationCode">
        <Input v-model="ruleForm.zfStationCode" placeholder="请输入"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="submitForm('ruleForm')">绑定</Button>
        <Button @click="resetForm('ruleForm')">重置</Button>
      </FormItem>
    </Form>
    <Dialog
            title="站点基本信息"
            :visible.sync="dialogVisible"
            width="63%">
      <DetailList :title="'站点基本信息'" :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
      <span slot="footer" class="dialog-footer">
        <Button @click="dialogVisible = false">取 消</Button>
        <Button type="primary" @click="dialogVisible = false">确 定</Button>
      </span>
    </Dialog>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'SitesBindAdd',
    data() {
      const validator = (rule, value, callback, source, options) => {
        if (!Number.isInteger(value * 1)) {
          callback(new Error('请输入正整数'))
        } else if (value <= 0) {
          callback(new Error('只能填写正整数'))
        } else {
          callback()
        }
      }
      const validator1 = (rule, value, callback, source, options) => {
        if (value) {
          this.postJson('station', {
            apiCode: 300169,
            content: {hallCode: value}
          }).then(res => {
            if (res.code === '0') {
              if (res.content.result == 0) {
                callback(new Error(res.content.detail))
              } else {
                callback()
              }
            } else {
              callback()
            }
          })
        } else {
          callback()
        }
      }
      return {
        detail: [
        ],
        dialogVisible: false,
        oneSCode: '',
        ruleForm: {
          jkStationCode: ''
        },
        rules: {
          stationCode: [
            {required: true, message: '站点编号不能为空', trigger: 'change'}
          ],
          jkStationCode: [
            {required: true, message: '必须输入其中一个栏位', trigger: 'blur'},
            {validator: validator, required: true, trigger: 'blur'}
          ],
          zfStationCode: [
            {validator: validator1, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 点击显示站点信息详情
      showDetail(stationCode) {
        console.log(stationCode)
        // const that = this
        this.getStationDetail(stationCode)
        // const id = 'sync_echarts'
        // // const url = 'https://cdn.bootcss.com/echarts/4.0.4/echarts.min.js'
        // const url = 'https://cdnjs.cloudflare.com/ajax/libs/echarts/4.1.0.rc2/echarts.min.js'
        // syncScript(id, url, fn)
        //
        // function fn() {
        //   // 创建详细信息中的月销量图和年销量echart图
        //   // that.createEchart()
        //   // 创建销量详情echart图
        //   // vm.createSaleDetailEchart()
        // }
      },
      async getStationDetail(stationCode) {
        var res = await this.postJson('station', {
          apiCode: 300018,
          content: {stationCode: stationCode * 1}
        })
        if (res.code === '0') {
          console.log(res.content)
          if (res.content === null) {
            this.showMsg('站点详细信息不存在', 'warning')
            return
          }
          this.dialogVisible = true
          this.detail = [
            {name: '站点编号', value: res.content.stationCode},
            {name: '区域编码', value: res.content.regionCode},
            {name: '区域名称', value: res.content.regionName},
            {name: '负责人', value: res.content.stationMaster.nameX},
            {name: '站点电话', value: res.content.stationPhone},
            {name: '经营模式名', value: res.content.operateModeName},
            {name: '建站时间', value: res.content.setUpTime ? res.content.setUpTime.split(' ')[0] : ''},
            {name: '站点地址', value: res.content.stationAddr}
          ]
        }
      },
      // 站点编号输入框 变化，搜索出相关的站点编号
      async querySearchAsync(sCode, cb) {
        if (sCode ? sCode.length : '' === 1) {
          this.oneSCode = sCode
        }
        if (sCode === undefined) {
          cb([])
          return
        } else if(sCode === '') {
          sCode = this.oneSCode
        }
        // 根据号码查询所有相关的站点编号
        var res = await this.postJson('station', {
          apiCode: 300019,
          content: {searchKey: sCode}
        })
        res.content.forEach((val) => {
          this.$set(val, 'value', `${val.station_code}-${val.name_x}`)
        })
        let arr = res.content
        cb(arr)
      },
      handleSelect(item) {
        this.ruleForm.stationCode = item.station_code
      },
      resetForm(formName) {
        // this[formName] = {}
        if (this.$route.params.id) {
          this.initSupplier()
        } else {
          this[formName] = {}
        }
      },
      async initSupplier() {
        let id1 = this.$route.params.id
        var res = await this.postJson('station', {
          apiCode: 300168,
          content: {
            id: id1
          }
        })
        const {id, stationCode, jkStationCode, zfStationCode} = res.content
        this.ruleForm = {id: id, stationCode: stationCode, jkStationCode, zfStationCode}
      },
      submitForm(formName, status = 'false') {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            if (this.$route.params.id) {
              this.save(300114, '修改成功')
            } else {
              this.save(300113, '新增成功')
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      async save(apiCode, msg) {
        let res = await this.postJson('station', {
          apiCode,
          content: this.ruleForm
        })
        if (res.code == 0) {
          this.showMsg(msg, 'success')
          this.$router.back(-1)
        } else {
          this.showMsg(res.msg, 'warning')
        }
      }
    },
    computed: {
    },
    watch: {
      ruleForm(val) {
        console.log(val)
      }
    },
    mounted: async function () {
      let id = this.$route.params.id
      if (id) {
        this.initSupplier()
      }
    }
  }
</script>

<style lang="scss">
.SitesBindAdd{
  .el-autocomplete{
    width: 65% !important;
  }
}
</style>