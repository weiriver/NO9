<template>
  <div>
    <!--<keep-alive>-->
    <Tabs class="_blue-header" type="border-card">
      <TabPane label="业务详情">
        <div>
          <h5>站点信息</h5>
          <Form ref="Obj" :model="Obj" label-width="200px" :rules="rules" class="Obj ruleForm">
            <FormItem label="投注站编号" prop="stationCode">
              <span v-show="$route.params.id">{{Obj.stationCode}}</span>
              <!--远程搜索-->
              <Select v-show="!$route.params.id" v-model="Obj.stationCode" filterable
                      remote
                      :remote-method="remoteMethod1"
                      @change="handleSelect"
                      placeholder="编号最少8个字"
                      :loading="loading1">
                <Option v-for="(option, index) in options1" :value="option.value" :key="index"
                        :disabled="option.status == 'cancel' " :label="option.label">
                </Option>
              </Select>
            </FormItem>
            <FormItem label="负责人姓名" prop="oldPrincipal">
              <Input v-model="Obj.oldPrincipal"></Input>
            </FormItem>
            <FormItem label="负责人手机号" prop="oldMobile">
              <Input v-model="Obj.oldMobile"></Input>
            </FormItem>
            <FormItem label="负责人身份证号" prop="oldIdcard">
              <Input v-model="Obj.oldIdcard"></Input>
            </FormItem>
            <FormItem label="原因" prop="reason">
              <Input v-model="Obj.reason"></Input>
            </FormItem>
            <h5>原业主信息</h5>
            <FormItem label="原业主头像">
              <myEpai :is-idcard="true"
                      :uploadConf='uploadConf' :imgType="'flow_head_old'" ref="flow_head_old"
                      @imguploadResult="imguploadResult_flow_head_old"></myEpai>
            </FormItem>
            <FormItem label="原业主身份证照片">
              <myEpai :is-idcard="false" @IDcardInfo="getIdCardInfo"
                      :uploadConf='uploadConf' :imgType="'flow_idcard_old'" ref="flow_idcard_old"
                      @imguploadResult="imguploadResult_flow_idcard_old"></myEpai>
            </FormItem>
            <FormItem label="销售保证金收款单照片" prop="principal">
              <myEpai :is-idcard="false"
                      :uploadConf='uploadConf' :imgType="'flow_deposit'" ref="flow_deposit"
                      @imguploadResult="imguploadResult_flow_deposit"></myEpai>
            </FormItem>
            <FormItem label="销售保证金收款金额" prop="oldDeposit">
              <Input v-model="Obj.oldDeposit"></Input>
            </FormItem>
            <h5>新业主信息</h5>
            <FormItem label="新业主头像照片" prop="principal">
              <myEpai :is-idcard="true"
                      :uploadConf='uploadConf' :imgType="'flow_head'" ref="flow_head"
                      @imguploadResult="imguploadResult_flow_head"></myEpai>
            </FormItem>
            <FormItem label="新业主身份证照片" prop="principal">
              <myEpai :is-idcard="false" @IDcardInfo="getIdCardInfo"
                      :uploadConf='uploadConf' :imgType="'flow_idcard'" ref="flow_idcard"
                      @imguploadResult="imguploadResult_flow_idcard"></myEpai>
            </FormItem>
            <FormItem label="新业主姓名" prop="newPrincipal">
              <Input v-model="Obj.newPrincipal"></Input>
            </FormItem>
            <FormItem label="性别" prop="sex">
              <Select v-model="Obj.sex" clearable>
                <Option value="male" label="男"></Option>
                <Option value="female" label="女"></Option>
              </Select>
            </FormItem>
            <FormItem label="年龄" prop="age">
              <Input v-model="Obj.age"></Input>
            </FormItem>
            <FormItem label="身份证号" prop="newIdcard">
              <Input v-model="Obj.newIdcard" :maxlength='20' @on-blur="checkIdcard"></Input>
            </FormItem>
            <FormItem label="联系方式" prop="newMobile">
              <Input v-model="Obj.newMobile"></Input>
            </FormItem>
            <FormItem label="户口所在地" prop="newResidence">
              <Input v-model="Obj.newResidence"></Input>
            </FormItem>
            <FormItem label="银行卡号" prop="newBankAccountNo">
              <Input v-model="Obj.newBankAccountNo"></Input>
            </FormItem>
            <FormItem label="是否个体" prop="isPerson">
              <Select v-model="Obj.isPerson" clearable>
                <Option value="true">是</Option>
                <Option value="false">否</Option>
              </Select>
            </FormItem>
            <FormItem label="开户预留手机号" prop="newBankAccountMobile">
              <Input v-model="Obj.newBankAccountMobile"></Input>
            </FormItem>
            <FormItem label="银行类型" prop="newBankType">
              <Select v-model="Obj.newBankType">
                <Option v-for="(bank, index) in bankTypeList" :key="index" :value="bank.value" :label="bank.text">
                </Option>
              </Select>
            </FormItem>
            <FormItem label="联系人姓名" prop="contactUser">
              <Input v-model="Obj.contactUser"></Input>
            </FormItem>
            <h5>变更证明</h5>
            <FormItem label="变更证明" prop="principal">
              <myEpai :is-idcard="false"
                      :uploadConf='uploadConf' :imgType="'flow_change_voucher'" ref="flow_change_voucher"
                      @imguploadResult="imguploadResult_flow_change_voucher"></myEpai>
            </FormItem>
            <FormItem label="变更证明模板" prop="principal">
              <Button @click="downloadFile">点击下载</Button>
            </FormItem>
            <h5>设备信息</h5>
            <div class="devicediv" style="padding-right: 30px;">
              <Row type="flex" justify="center">
                <Col :md="3"> 名称
                </Col>
                <Col :md="3" :offset="1"> 编码
                </Col>
                <Col :md="3" :offset="1"> 投注机类型
                </Col>
                <Col :md="3" :offset="1"> 价格（元）
                </Col>
                <Col :md="3" :offset="1"> 是否移交
                </Col>
                <Col :md="3" :offset="1"> 备注
                </Col>
              </Row>
              <div v-for="(device,index) in deviceInfo" :key='device.index' class="mt10">
                <Row type="flex" justify="center">
                  <Col :md="3">
                    <!--<FormItem prop="nameX" >-->
                      <Input type="text" class="eqp-name" v-bind:class="device.nameXValidate?'':'ivu-form-item-error'"
                              v-model="device.nameX"></Input>
                      <div class="ivu-form-item-error-tip" v-show="!device.nameXValidate">设备名称不能为空</div>
                    <!--</FormItem>-->
                  </Col>
                  <Col :md="3" :offset="1">
                    <!--<FormItem prop="deviceCode">-->
                      <Input type="text" v-model="device.deviceCode"  class="eqp-code"
                              v-bind:class="device.deviceCodeValidate?'':'ivu-form-item-error'"></Input>
                      <div class="ivu-form-item-error-tip" v-show="!device.deviceCodeValidate">设备编码不能为空</div>
                    <!--</FormItem>-->
                  </Col>
                  <Col :md="3" :offset="1">
                    <!--<FormItem prop="typeX" >-->
                      <Select v-model="device.typeX" class="eqp-type" v-bind:class="device.typeXValidate?'':'ivu-form-item-error'"
                              clearable>
                        <Option v-for="(type, index) in deviceTypeList" :key="index" :value="type.id">
                          {{type.deviceModelName}}
                        </Option>
                      </Select>
                      <!-- <IInput type="text"  v-model="device.typeX"></IInput> -->
                      <div class="ivu-form-item-error-tip" v-show="!device.typeXValidate">设备类型不能为空</div>
                    <!--</FormItem>-->
                  </Col>
                  <Col :md="3" :offset="1">
                    <Input type="text" v-model="device.price" class="eqp-price"></Input>
                  </Col>
                  <Col :md="3" :offset="1">
                    <Checkbox v-model="device.isTransfer" class="eqp-transfer"></Checkbox>
                  </Col>
                  <Col :md="3" :offset="1">
                    <Input type="text" v-model="device.remarks" class="eqp-tips"
                            v-bind:class="device.isTransfer||device.remarks?'':'ivu-form-item-error'"></Input>
                    <div class="error-text" v-show="!device.isTransfer&&!device.remarks">不移交请填写原因</div>
                  </Col>
                </Row>
              </div>

              <Row>
                <Col :span="8" :offset="16">
                  <Button type="ghost" style="margin: 12px 20px 0 0;" @click="addDevice">增加</Button>
                  <Button type="error" style="margin-top: 12px;" @click="reduceDevice">减少</Button>
                </Col>
              </Row>
            </div>
            <!--按钮区域-->
            <FormItem>
              <Button type="primary" class="mr20 mt12" @click="save('draft')">暂存</Button>
              <Button @click="reset" class="mr20 mt12">重置</Button>
              <Chuli :node-list="nodeList" :flowId="Obj.flowId" :nodeCode="beginNode.code"
                     @chuliConfirm="chuliConfirm" :instanceId="instanceId"
                     @vertify="checkForm" ref="chuliBtn"></Chuli>
            </FormItem>
          </Form>
        </div>
      </TabPane>
      <TabPane label="流程图">
        <Mysteps :nodeList='nodeList'></Mysteps>
      </TabPane>
    </Tabs>
    <!--</keep-alive>-->
  </div>
</template>

<script>
  import Mysteps from '@/components/mysteps/MySteps'
  import Chuli from '@/components/chuli/Chuli'
  import myEpai from '@/components/gaopaiyi/Ecamera'
  import {regexp} from '../../../../../../util/util'
  import {mapMutations} from 'vuex'
  export default {
    name: 'a',
    components: {
      Mysteps, Chuli, myEpai
    },
    data() {
      const validatorNumber = (rule, value, callback, source, options) => {
        if (regexp.isNumber(value)) {
          callback()
        } else {
          callback(new Error('只支持数字'))
        }
      }
      const validatorNumbers = (rule, value, callback, source, options) => {
        if (value.indexOf('X') == -1) {
          if (value.length < 18) {
            callback(new Error('身份证号长度不够'))
          } else {
            callback()
          }
        } else {
          if (value.length < 18) {
            callback(new Error('身份证号长度不够'))
          } else {
            if (value.split('X')[0] != '' && value.split('X')[1] == '' && regexp.isNumber(value.split('X')[0])) {
              callback()
            } else {
              callback(new Error('只支持数字'))
            }
          }
        }
      }
      return {
        instanceId: JSON.parse(sessionStorage.getItem('draftFromApply')) ? JSON.parse(sessionStorage.getItem('draftFromApply')).instanceId : '',
        // 流程图跳线
        nodeList: [],
        gameList: [],
        detail: [],
        uploadConf: {
          sysModule: 'flow',
          hostBizObj: 'flow_files',
          hostBizId: ''
        },
        bankTypeList: [],
        deviceTypeList: [],
        radioList: [
          {value: 'true', text: '是'},
          {value: 'false', text: '否'}
        ], // 单选列表
        flowCode: '',
        boxFlag: true,
        posFlag: false,
        // 上传附件基本配置
        conf: {
          // tooltips: [1, 2],
          uploadUrl: ''
        },
        flow_head_old: '',
        flow_idcard_old: '',
        flow_deposit: '',
        flow_head: '',
        flow_idcard: '',
        flow_change_voucher: '',
        deviceInfo: [
          {
            deviceCode: '',
            deviceCodeValidate: true,
            nameX: '',
            nameXValidate: true,
            typeX: '',
            typeXValidate: true,
            price: '',
            isTransfer: false,
            remarks: ''
          }
        ],
        showContent: false,
        beginNode: '',
        Obj: {
          stationCode: '',
          flow: {
            content: ''
          }
        },
        options1: [],
        loading1: false,
        rules: {
          stationCode: [
            {required: true, message: '站点编号不能为空', trigger: 'blur'},
            {min: 8, message: '编号长度为8位', trigger: 'blur'}
          ],
          oldMobile: [
            {required: true, message: '负责人手机号不能为空', trigger: 'change'},
            {validator: validatorNumber, message: '负责人手机号应为数字', trigger: 'change'}
          ],
          oldIdcard: [
            {required: true, message: '负责人身份证号不能为空', trigger: 'blur'},
            {validator: validatorNumbers, message: '负责人身份证号不合法', trigger: 'blur'}
          ],
          oldPrincipal: [
            {required: true, message: '负责人姓名不能为空', trigger: 'change'}
          ],
          reason: [
            {required: true, message: '原因不能为空', trigger: 'blur'}
          ],
          newPrincipal: [
            {required: true, message: '新业主姓名不能为空', trigger: 'blur'}
          ],
          contactUser: [
            {required: true, message: '联系人不能为空', trigger: 'blur'}
          ],
          sex: [
            {required: true, message: '性别不能为空', trigger: 'change'}
          ],
          age: [
            {required: true, message: '年龄不能为空', trigger: 'blur'},
            {validator: validatorNumber, message: '年龄应为数字', trigger: 'change'}
          ],
          newIdcard: [
            {required: true, message: '身份证号不能为空', trigger: 'blur'},
            {validator: validatorNumbers, message: '身份证号不合法', trigger: 'blur'}
          ],
          newMobile: [
            {required: true, message: '联系方式不能为空', trigger: 'blur'},
            {validator: validatorNumber, message: '联系方式应为数字', trigger: 'change'}
          ],
          newResidence: [
            {required: true, message: '户口所在地不能为空', trigger: 'blur'}
          ],
          newBankAccountNo: [
            {required: true, message: '银行卡号不能为空', trigger: 'blur'},
            {validator: validatorNumber, message: '银行卡号应为数字', trigger: 'change'}
          ],
          isPerson: [
            {required: true, message: '站主类型不能为空', trigger: 'change'}
          ],
          newBankAccountMobile: [
            {required: true, message: '开户预留手机号不能为空', trigger: 'blur'},
            {validator: validatorNumber, message: '手机号应为数字', trigger: 'change'}
          ],
          newBankType: [
            {required: true, message: '银行类型不能为空', trigger: 'change'}
          ],
          oldDeposit: [
            {required: true, message: '销售保证金收款金额不能为空', trigger: 'change'},
            {validator: validatorNumber, message: '销售保证金收款金额为数字', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      downloadFile() {
        var newTab = window.open('about:blank')
        this.postJson('common', {
          apiCode: 200002,
          content: {
            sysModule: 'station',
            hostBizObj: 'flow_change_voucher_template',
            hostBizId: 1
          }
        }).then(res => {
          if (res.code === '0') {
            console.log(res)
            newTab.location.href = res.content[0].httpUrl
            // setTimeout(function () {
            //   newTab.close()
            // }, 500)
          } else {
            this.showMsg('获取附件失败！', 'warning')
          }
        })
      },
      // 获取银行类型列表
      getBankTypeList() {
        console.log(this.$store.state.station_enumDic.bankType)
        this.bankTypeList = this.$store.state.station_enumDic.bankType
        console.log(this.bankTypeList)
      },
      // 获取设备类型
      getDeviceTypeList() {
        this.postJson('station', {
          apiCode: 300091,
          content: {}
        }).then(res => {
          if (res.code === '0') {
            let response = res.content.dataList
            this.deviceTypeList = response
          }
        })
      },
      // 获取身份证信息
      getIdCardInfo(val) {
        this.$set(this.Obj, 'newPrincipal', val.name)
        this.$set(this.Obj, 'newResidence', val.address)
        this.$set(this.Obj, 'newIdcard', val.card)
        this.$set(this.Obj, 'sex', val.sex === '男' ? 'male' : 'female')
        this.$set(this.Obj, 'age', val.age)
      },
      // 图片上传结果处理
      imguploadResult_flow_head_old(val) {
        this.flow_head_old = val.res
      },
      imguploadResult_flow_idcard_old(val) {
        this.flow_idcard_old = val.res
      },
      imguploadResult_flow_deposit(val) {
        this.flow_deposit = val.res
      },
      imguploadResult_flow_head(val) {
        this.flow_head = val.res
      },
      imguploadResult_flow_idcard(val) {
        this.flow_idcard = val.res
      },
      imguploadResult_flow_change_voucher(val) {
        this.flow_change_voucher = val.res
      },
      addDevice() {
        var device = {
          deviceCode: '',
          deviceCodeValidate: true,
          nameX: '',
          nameXValidate: true,
          typeX: '',
          typeXValidate: true,
          price: '',
          isTransfer: false,
          remarks: ''
        }
        this.deviceInfo.push(device)
      },
      reduceDevice() {
        let devicelength = this.deviceInfo.length
        // 当数组只剩下一个元素时不允许删除
        if (devicelength === 1) {
          return
        }
        this.deviceInfo.splice(devicelength - 1, 1)
      },
      checkIdcard() {
        // 验证身份证
        this.postJson({
          apiCode: 200021,
          content: {
            idCard: this.Obj.newIdcard
          }
        }, 'biz').then(res => {
          if (res.code === '0') {
            console.log(res)
            this.$set(this.Obj, 'age', res.content.age)
            this.$set(this.Obj, 'sex', res.content.sex)
          }
        })
      },
      // 站点编号后台请求
      remoteMethod1(query) {
        if (query !== '') {
          this.loading1 = true
          this.postJson('station', {
            apiCode: 300019,
            content: {
              searchKey: query
            }
          }).then(res => {
            if (res.code === '0') {
              this.loading1 = false
              this.options1 = res.content.map(v => {
                return {
                  label: `${v.station_code}-${v.status_name}-${v.name_x}`,
                  value: v.station_code,
                  status: v.station_status
                }
              })
            }
          })
        } else {
          this.options1 = []
        }
      },
      handleSelect () {
        console.log(this.Obj.stationCode)
        this.postJson('station', {
          apiCode: 300002,
          content: {
            stationCode: this.Obj.stationCode
          }
        }).then(res => {
          if (res.code === '0') {
            let responseList = res.content.dataList
            console.log(responseList)
            if (responseList) {
              let response = responseList[0]
              this.$set(this.Obj, 'oldIdcard', response.idCard)
              this.$set(this.Obj, 'oldMobile', response.mobile)
              this.$set(this.Obj, 'oldPrincipal', response.nameX)
            }
          }
        })
      },
      // 上传结果
      uploadResult(file) {
        console.log('我是上传结果', file)
      },
      // 提交到不同业务的按钮点击结果
      chuliConfirm(val) {
        if (val.nextInfo.acceptById) {
          this.Obj.flow.acceptByName = val.nextInfo.acceptByName
          this.Obj.flow.acceptById = val.nextInfo.acceptById
        }
        this.Obj.nodeBo = val.nodeBo
        this.Obj.flow.sendMsg = val.nextInfo.sendMsg
        this.Obj.flow.showDetail = val.nextInfo.showDetail
        this.Obj.flow.acceptByName = val.nodeBo.acceptByName
        this.Obj.flow.acceptById = val.nodeBo.acceptById
        this.Obj.flow.acceptByType = val.nodeBo.acceptByType
        // 提交到后台
        this.save()
      },
      // 重置
      reset() {
        // this.Obj.stationCode = ''
        this.init(true)
      },
      // 最底部按钮
      save(draft) {
        this.Obj.flow.bizKey = this.Obj.stationCode
        this.posFlag = false
        // 固定写死
        this.Obj.flow.sysModule = 'station'
        this.Obj.flow.processMode = 'web'
        this.Obj.newDeviceInfos = JSON.stringify(this.deviceInfo)
        if (draft) {
          this.Obj.flow.draft = true
          this.submit(true)
        } else {
          this.Obj.flow.draft = false
          this.submit(false)
        }
      },
      // vertify点击提交按钮时验证
      checkForm() {
        console.log(this.flow_head_old)
        // 原业主图片信息
        if (this.flow_head_old === '') {
          this.showMsg('请上传原业主头像照片', 'error')
          this.$refs.flow_head_old.$el.querySelector('.preview_img').style.border = '1px solid red'
          return
        } else {
          this.$refs.flow_head_old.$el.querySelector('.preview_img').style.border = '1px solid #d5d5d5'
        }
        if (this.flow_idcard_old === '') {
          this.showMsg('请上传原业主身份证照片', 'error')
          this.$refs.flow_idcard_old.$el.querySelector('.preview_img').style.border = '1px solid red'
          return
        } else {
          this.$refs.flow_idcard_old.$el.querySelector('.preview_img').style.border = '1px solid #d5d5d5'
        }
        if (this.flow_deposit === '') {
          this.showMsg('请上传销售保证金收款单照片', 'error')
          this.$refs.flow_deposit.$el.querySelector('.preview_img').style.border = '1px solid red'
          return
        } else {
          this.$refs.flow_deposit.$el.querySelector('.preview_img').style.border = '1px solid #d5d5d5'
        }
        // 新业主图片信息
        if (this.flow_head === '') {
          this.showMsg('请上传新业主头像照片', 'error')
          this.$refs.flow_head.$el.querySelector('.preview_img').style.border = '1px solid red'
          return
        } else {
          this.$refs.flow_head.$el.querySelector('.preview_img').style.border = '1px solid #d5d5d5'
        }
        if (this.flow_idcard === '') {
          this.showMsg('请上传新业主身份证照片', 'error')
          this.$refs.flow_idcard.$el.querySelector('.preview_img').style.border = '1px solid red'
          return
        } else {
          this.$refs.flow_idcard.$el.querySelector('.preview_img').style.border = '1px solid #d5d5d5'
        }
        if (this.flow_change_voucher === '') {
          this.showMsg('请上传变更证明照片', 'error')
          this.$refs.flow_change_voucher.$el.querySelector('.preview_img').style.border = '1px solid red'
          return
        } else {
          this.$refs.flow_change_voucher.$el.querySelector('.preview_img').style.border = '1px solid #d5d5d5'
        }

        this.$refs['Obj'].validate((valid) => {
          if (valid) {
            this.$refs['chuliBtn'].showSteps()
          } else {
            this.showMsg('请输入正确的必填信息', 'error')
          }
        })
      },
      submit(draft) {
        this.bankTypeList.find(item => {
          if (item.value === this.Obj.newBankType) {
            this.$set(this.Obj, 'newBankName', item.text)
          }
        })
        this.postJsonWithMask('common', {
          apiCode: 200079,
          content: this.Obj
        }).then(res => {
          if (res.code === '0') {
            this.showMsg(`${draft ? '暂存' : '提交'}成功`)
            this.Obj = {}
            this.Obj.flow = {}
            this.$router.go(-1)
          }
        })
      },
      // 获取流程图
      getFlowInfo(flowId, intanceId) {
        this.postJson('common', {
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
          this.Obj.flow.fromNodeCode = nodelist[1].code
          this.Obj.flow.fromNodeName = nodelist[1].nameX
          this.Obj.flow.toNodeCode = nodelist[2].code
          this.Obj.flow.toNodeName = nodelist[2].nameX
          this.Obj.flow.acceptByName = nodelist[2].acceptByName
          this.Obj.flow.acceptById = nodelist[2].acceptById
          this.Obj.flow.acceptByType = nodelist[2].acceptByType.value
          const userId = JSON.parse(sessionStorage.getItem('login')).uid
          // this.uploadConf.hostBizId = `temp$${userId}$${this.flowCode}$${this.fromNodeCode}`
          if (this.$route.query.from == 'apply') { // 如果是从我的申请过来的修改，则存在实例ID
            this.uploadConf.hostBizId = `${intanceId}$${this.flowCode}$${this.fromNodeCode}`
          } else {
            this.uploadConf.hostBizId = `temp$${userId}$${this.flowCode}$${this.fromNodeCode}`
          }
        })
      },
      // 获取草稿信息
      getDraftDetail(flowId, bizId, instanceId) {
        this.postJsonWithMask('common', {
          apiCode: 200112,
          content: {flowId, bizId, instanceId, showDetail: false}
        }).then(res => {
          console.log(res)
          // var merge = require('object-merge')
          let bizObject = res.content.bizObject
          bizObject.isPerson = bizObject.isPerson + ''
          bizObject.oldDeposit = bizObject.oldDeposit ? bizObject.oldDeposit + '' : ''
          this.Obj = Object.assign(this.Obj, bizObject)
          if (bizObject.sex) {
            this.Obj['sex'] = bizObject.sex.value
          }
          if (bizObject.age) {
            this.Obj['age'] = bizObject.age + ''
          }
          if (bizObject.newDeviceInfos) {
            this.deviceInfo = JSON.parse(bizObject.newDeviceInfos)
          }
          this.boxFlag = false
          this.boxFlag = true
          this.showContent = true
          setTimeout(() => {
            this.setFlowFile(res.content.filesList)
          }, 100)
        })
      },
      setFlowFile(fileList) {
        if (fileList.length === 0) {
          return
        }
        fileList.forEach(file => {
          let fileType = file.extInfo
          if (fileType) {
            console.log(fileType)
            this.$refs[fileType].base64str = file.showUrl
            if (file.showUrl !== '') {
              this[fileType] = 0
            } else {
              this[fileType] = 1
            }
            console.log(this[fileType])
          }
        })
        console.log()
      },
      getIssueByGame () {
        if (this.$route.query.from != 'apply') {
          this.Obj.issue = ''
        }
        this.issueList = []
        if (!this.Obj.gameId) {
          return
        }
        this.postJsonWithMask('biz', {
          apiCode: 200002,
          content: {
            gameId: this.Obj.gameId
          }
        }).then(res => {
          console.log(res)
          if (res.code === '0') {
            this.issueList = res.content
          }
        })
      },
      init(flag) {
        this.showContent = false
        this.Obj = {}
        if (this.$route.query.from == 'apply') {
          if (flag) {
            this.$refs.flow_head_old.clear()
            this.$refs.flow_idcard_old.clear()
            this.$refs.flow_deposit.clear()
            this.$refs.flow_head.clear()
            this.$refs.flow_idcard.clear()
            this.$refs.flow_change_voucher.clear()
          }
          const buz = JSON.parse(sessionStorage.getItem('draftFromApply'))
          console.log(buz)
          const {flowId, bizId, id, flowCode, flowName} = buz
          this.getDraftDetail(flowId, bizId, id)
          this.flowCode = flowCode
          this.Obj.flowId = flowId
          this.Obj.title = flowName
          this.Obj.flow = {}
          this.Obj.flow.bizTitle = flowName
          this.Obj.flow.flowId = flowId
          this.Obj.flow.agreed = true + '' // 是否同意，默认同意
          this.Obj.flow.flowName = flowName
          // 获取流程图
          this.getFlowInfo(flowId, id)
        } else {
          if (flag) {
            this.$refs.flow_head_old.clear()
            this.$refs.flow_idcard_old.clear()
            this.$refs.flow_deposit.clear()
            this.$refs.flow_head.clear()
            this.$refs.flow_idcard.clear()
            this.$refs.flow_change_voucher.clear()
          }
          const buz = JSON.parse(sessionStorage.getItem('stationResponsorChange'))
          const {id, flowName, flowCode} = buz
          this.flowCode = flowCode
          this.Obj.flowId = id
          this.Obj.title = flowName
          this.Obj.flow = {}
          this.Obj.flow.bizTitle = flowName
          this.Obj.flow.flowId = id
          this.Obj.flow.agreed = true // 是否同意，默认同意
          this.Obj.flow.flowName = flowName
          this.showContent = true
          // 获取流程图
          this.getFlowInfo(id)
        }
        // 获取银行类型
        this.getBankTypeList()
        // 获取设备类型
        this.getDeviceTypeList()
      },
      ...mapMutations({
        SET_ENUM_DIC: 'SET_ENUM_DIC'
      })
    },
    mounted() {
      this.init(false)
    }
  }
</script>


<style lang="scss">
  .error-text{
    color: #f56c6c;
    width: 96px;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
  }
</style>
