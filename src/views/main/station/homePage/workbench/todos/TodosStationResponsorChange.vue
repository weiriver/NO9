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
  import expandRow from './Table-expand.vue'
  // import {mapMutations} from 'vuex'

  export default {
    components: {
      Mysteps, Chuli, myEpai, expandRow
    },
    data() {
      const validatorNumber = (rule, value, callback, source, options) => {
        if (regexp.isNumber(value)) {
          callback()
        } else {
          callback(new Error('只支持数字'))
        }
      }
      return {
        instanceId: JSON.parse(sessionStorage.getItem('todosStationResponsorChange')) ? JSON.parse(sessionStorage.getItem('todosStationResponsorChange')).instanceId : '',
        spinShow: false,
        currentNodeCode: '',
        uploadConf: {
          sysModule: 'flow',
          hostBizObj: 'flow_files',
          hostBizId: ''
        },
        // 是否禁用图片修改
        isDisabled: true,
        historyFileData: [],
        radioList: [
          {value: 'true', text: '是'},
          {value: 'false', text: '否'}
        ], // 单选列表
        ruleInline: {
          stationCode: [
            {required: true, message: '站点编号不能为空', trigger: 'change'},
            {min: 8, message: '编号长度为8位', trigger: 'blur'}
          ],
          reason: [
            {required: true, message: '原因不能为空', trigger: 'blur'}
          ],
          newPrincipal: [
            {required: true, message: '姓名不能为空', trigger: 'blur'}
          ],
          newIdcard: [
            {required: true, message: '身份证号不能为空', trigger: 'blur'}
          ],
          newMobile: [
            {required: true, message: '联系方式不能为空', trigger: 'blur'}
          ],
          newResidence: [
            {required: true, message: '户口所在地不能为空', trigger: 'blur'}
          ],
          newBankAccountNo: [
            {required: true, message: '银行卡号不能为空', trigger: 'blur'}
          ],
          newBankAccountMobile: [
            {required: true, message: '开户预留手机号不能为空', trigger: 'blur'}
          ],
          newBankType: [
            {required: true, message: '银行类型不能为空', trigger: 'blur'}
          ],
          oldDeposit: [
            {required: true, message: '销售保证金收款金额不能为空', trigger: 'blur'},
            {validator: validatorNumber, message: '销售保证金收款金额为数字', trigger: 'blur'}
          ],
          oldDepositReason: [
            {required: true, message: '请确认原收款单图片，未确认请填写备注', trigger: 'blur'}
          ],
          oldPrincipalPhotoReason: [
            {required: true, message: '请确认原业主头像照片，未确认请填写备注', trigger: 'blur'}
          ],
          oldIdcardPhotoReason: [
            {required: true, message: '请确认原业主身份证照片，未确认请填写备注', trigger: 'blur'}
          ]
        }, // 校验规则
        Obj: {
          regionCode: ''
        },
        // 流程图跳线
        nodeList: [],
        // 显示/隐藏 坐标标注200005
        posFlag: false,
        // 表格加载
        loading: false,
        // 显示/隐藏 上传弹窗
        modalFlag: false,
        // 空站号列表显示/隐藏
        useableStationCodeFlag: false,
        tabsIndex: 1, // tab切换，默认第一个
        // 当前激活的tab名字
        // 内容区域开关
        showContent: false,
        // 显示隐藏的查询框
        searchBox_flag: false,
        flowCode: '',
        fromNodeCode: '',
        // 表格内容信息
        // 第一个步骤，起始节点
        beginNode: '',
        stationList: [],
        bankTypeList: [],
        loadingStation: false,
        commisionTypeList: [],
        // 设备型号
        deviceTypeList: [],
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
        // 可编辑对象
        editableObj: null,
        // 历史处理意见 表格头部信息
        historyTableHeader: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(expandRow, {
                props: {
                  row: params.row
                }
              })
            }
          },
          {
            type: 'index',
            title: '序号',
            width: 62,
            align: 'center'
          },
          {
            title: '步骤名',
            key: 'nodeName',
            sortable: true
          },
          {
            title: '处理人',
            key: 'acceptByName',
            sortable: true
          },
          {
            title: '下一步',
            key: 'toNodeName',
            sortable: true
          },
          {
            title: '处理意见',
            key: 'content',
            sortable: true
          },
          {
            title: '处理时间',
            key: 'finishDate',
            render: (h, params) => this.ToDate(params.row.finishDate)
          }
        ],
        historyData: []
      }
    },
    watch: {},
    methods: {
      // 高拍仪获取到的 “人身照” base64字符串
      personalImg(val) {
        if (val.type === 'upload') { // 上传
        } else { // 预览结果
        }
      },
      // 高拍仪获取到的 “身份证件” base64字符串
      idCardImg(val) {
        if (val.type === 'upload') { // 上传
        } else { // 预览结果
        }
      },
      // 显示‘上传附件’弹窗
      showModal() {
        this.modalFlag = true
      },
      // 上传结果
      uploadResult(file) {
        // console.log('我是上传结果', file)
      },
      // 组件关闭modal的广波
      toggleModalFlag(val) {
        // console.log(val)
        this.modalFlag = val
      },
      // 删除弹窗
      del() {
      },
      // vertify点击提交按钮时验证
      checkForm() {
        this.$refs['Obj'].validate((valid) => {
          if (valid) {
            this.$refs['chuliBtn'].showSteps()
          } else {
            this.showMsg('请输入正确的必填信息', 'error')
          }
        })
      },
      // 提交到不同业务的按钮点击结果
      chuliConfirm(val) {
        this.Obj.flow.toNodeCode = val.nextInfo.toNodeCode
        this.Obj.flow.toNodeName = val.nextInfo.toNodeName
        if (val.nextInfo.acceptById) {
          this.Obj.flow.acceptByName = val.nextInfo.acceptByName
          this.Obj.flow.acceptById = val.nextInfo.acceptById
        }
        this.Obj.flow.sendMsg = val.nextInfo.sendMsg
        this.Obj.flow.showDetail = val.nextInfo.showDetail
        this.Obj.nodeBo = val.nodeBo
        this.Obj.flow.acceptByName = val.nodeBo.acceptByName
        this.Obj.flow.acceptById = val.nodeBo.acceptById
        this.Obj.flow.acceptByType = val.nodeBo.acceptByType
        // 提交到后台
        this.save()
      },
      // 最底部按钮
      save(draft) {
        this.Obj.flow.bizKey = this.Obj.stationCode
        this.posFlag = false
        this.validate().then(res => {
          if (res) {
            this.Obj.newDeviceInfos = JSON.stringify(this.deviceInfo)
            this.Obj.flow.draft = draft ? 'true' : 'false'
            // 固定写死
            this.Obj.flow.sysModule = 'station'
            this.Obj.flow.processMode = 'web'
            console.log(this.Obj)
            this.spinShow = true
            this.postJson({
              apiCode: 200111,
              content: this.Obj
            }).then(res => {
              this.spinShow = false
              if (res.code === '0') {
                this.showMsg('提交成功')
                this.Obj = {}
                this.Obj.flow = {}
                this.$router.go(-1)
              }
            })
          }
        })
      },
      // 校验输入的必填项和规则
      async validate() {
        var check = false
        await this.$refs['Obj'].validate((valid) => {
          if (valid) {
            check = true
          }
        })
        if (this.editableObj.newDeviceInfos.editable) {
          this.deviceInfo.forEach((e) => {
            if (!e.deviceCode) {
              e.deviceCodeValidate = false
              check = false
            } else {
              e.deviceCodeValidate = true
            }
            if (!e.nameX) {
              e.nameXValidate = false
              check = false
            } else {
              e.nameXValidate = true
            }
            if (!e.typeX) {
              e.typeXValidate = false
              check = false
            } else {
              e.typeXValidate = true
            }
            if (!e.isTransfer && !e.remarks) {
              check = false
            }
          })
        }
        if (!check) {
          this.showMsg('请输入正确的必填信息', 'error')
        }
        return check
      },
      // 获取站点列表
      getStationList(sCode) {
        this.postJson({
          apiCode: 300019,
          content: {
            searchKey: sCode
          }
        }, 'station').then(res => {
          if (res.code === '0') {
            this.stationList = res.content
          }
        })
      },
      queryStationInfo() {
        if (!this.Obj.stationCode) {
          return
        } else {
          this.postJson({
            apiCode: 300002,
            content: {
              stationCode: this.Obj.stationCode
            }
          }, 'station').then(res => {
            if (res.code === '0') {
              let responseList = res.content.dataList
              if (responseList) {
                let response = responseList[0]
                this.$set(this.Obj, 'oldIdcard', response.idCard)
                this.$set(this.Obj, 'oldMobile', response.mobile)
                this.$set(this.Obj, 'oldPrincipal', response.nameX)
              }
            }
          })
          this.postJson({
            apiCode: 200001,
            content: {
              stationCode: this.Obj.stationCode
            }
          }, 'biz').then(res => {
            if (res.code === '0') {
              let response = res.content
              this.$set(this.Obj, 'contactUser', response.linkMan)
            }
          })
        }
      },
      getBankTypeList() {
        // this.postJson({
        //   apiCode: 200031,
        //   content: {
        //     sysModule: 'station',
        //     nameX: '',
        //     typeX: 'bankType', // 消息类型
        //     paginated: false
        //   }
        // }).then(res => {
        //   this.bankTypeList = res.content.dataList
        // })
        this.bankTypeList = this.$store.state.station_enumDic.bankType
      },
      getDeviceTypeList() {
        this.postJson({
          apiCode: 300091,
          content: {}
        }, 'station').then(res => {
          if (res.code === '0') {
            let response = res.content.dataList
            this.deviceTypeList = response
          }
        })
      },
      addDevice() {
        if (!this.editableObj.newDeviceInfos.editable) {
          return
        }
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
        if (!this.editableObj.newDeviceInfos.editable) {
          return
        }
        let devicelength = this.deviceInfo.length
        // 当数组只剩下一个元素时不允许删除
        if (devicelength === 1) {
          return
        }
        this.deviceInfo.splice(devicelength - 1, 1)
      },
      // 获取可编辑字段列表
      getEdiableList(flowId) {
        this.postJson({
          apiCode: 200116,
          content: {
            flowId
          }
        }).then(res => {
          console.log(this.currentNodeCode)
          console.log(res.content)
          const list = res.content
          this.editableObj = list.filter(v => {
            return v.nodeCode == this.currentNodeCode
          })[0].fieldDetails
          console.log(this.editableObj)
        })
      },
      // 改变处理状态，并获取相关业务信息
      getFlowDetail(flowId, bizId, waitTaskId, instanceId) {
        this.spinShow = true
        this.postJson({
          apiCode: 200110,
          content: {flowId, bizId, waitTaskId, instanceId}
        }).then(res => {
          console.log(res)
          this.spinShow = false
          if (res.code == 0) {
            // // this.showMsg('数据加载成功')
            // console.log('我是该流程的相关信息')
            // console.log(res)
            this.historyData = res.content.finishList
            this.setNodeList(res)
            this.setFlowFile(res.content.filesList)
            let obj = res.content.bizObject
            for (let key in obj) {
              if (obj[key] != null) {
                if (key === 'newDeviceInfos') {
                  let arr = JSON.parse(obj[key])
                  this.deviceInfo = []
                  arr.forEach((val) => {
                    let obj = {
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
                    obj.nameX = val.nameX
                    if (val.nameX) {
                      obj.nameXValidate = true
                    } else {
                      obj.nameXValidate = false
                    }
                    obj.typeX = val.typeX
                    if (val.typeX) {
                      obj.typeXValidate = true
                    } else {
                      obj.typeXValidate = false
                    }
                    obj.price = val.price
                    obj.isTransfer = val.isTransfer
                    obj.remarks = val.remarks
                    obj.deviceCode = val.deviceCode
                    this.deviceInfo.push(obj)
                  })
                  console.log(this.deviceInfo)
                  // this.deviceInfo = JSON.parse(obj[key])
                  // console.log(this.deviceInfo)
                } else {
                  if (key === 'sex') {
                    this.Obj['sex'] = obj[key].value
                  } else {
                    this.Obj[key] = (obj[key] + '')
                  }
                }
              }
            }
            // console.log(this.Obj)
          }
        })
      },
      setNodeList(res) {
        const nodelist = res.content.flowDiagram.nodeList
        this.nodeList = nodelist
        // console.log(nodelist)
        const currentNodeInfo = nodelist.filter(v => {
          return v.code == this.currentNodeCode
        })[0]
        // this.Obj.flow.acceptByName = currentNodeInfo.acceptByName
        // this.Obj.flow.acceptById = currentNodeInfo.acceptById
        // this.Obj.flow.acceptByType = currentNodeInfo.acceptByType.value
        this.uploadConf.hostBizId = `${currentNodeInfo.instanceId}$${this.flowCode}$${this.currentNodeCode}`
        // this.fromNodeCode = nodelist[1].code
      },
      setFlowFile(fileList) {
        if (fileList.length === 0) {
          return
        }
        this.historyFileData = []
        let uid = this.$store.state.uid
        fileList.forEach(file => {
          let fileType = file.extInfo
          if (fileType) {
            this.$refs[fileType].base64str = file.showUrl
            // 设置图片是否可编辑
            if (uid == file.createBy) {
              this.$refs[fileType].isDisabledPic = false
            }
          } else {
            this.historyFileData.push(file)
          }
        })
      },
      // ...mapMutations({
      //   SET_ENUM_DIC: 'SET_ENUM_DIC'
      // })
    },
    computed: {},
    mounted: function () {
      setTimeout(() => {
        this.showContent = true
      }, 100)
      const buz = JSON.parse(sessionStorage.getItem('todosStationResponsorChange'))
      const {flowId, flowName, flowCode, bizId, instanceId, id, nodeCode, nodeName} = buz
      this.flowCode = flowCode
      this.Obj.flowId = flowId
      this.Obj.title = flowName
      this.currentNodeCode = nodeCode
      this.Obj.nodeBo = {}
      this.Obj.nodeBo.instanceId = instanceId
      this.Obj.flow = {content: ''}
      this.Obj.flow.instanceId = instanceId
      this.Obj.flow.bizId = bizId
      this.Obj.flow.waitTaskId = id
      this.Obj.flow.fromNodeCode = nodeCode
      this.Obj.flow.fromNodeName = nodeName
      this.Obj.flow.bizTitle = flowName
      this.Obj.flow.flowId = flowId
      this.Obj.flow.agreed = true + '' // 是否同意，默认同意
      this.Obj.flow.flowName = flowName
      // 获取可编辑字段
      this.getEdiableList(flowId)
      // 改变处理状态，并获取相关业务信息
      this.getFlowDetail(flowId, bizId, id, instanceId)
      // 获取银行类型
      this.getBankTypeList()
      // 获取设备类型
      this.getDeviceTypeList()
      console.log('当前执行到的节点', this.Obj.flow.fromNodeName)
      console.log(this.Obj)
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
