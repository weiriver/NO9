<template>
  <Tabs class="_blue-header" type="border-card">
    <TabPane label="业务详情">
      <div class="content-title">{{Obj.title?Obj.title:'站点基本信息'}}</div>
      <Form :model="Obj" :rules="ruleInline" ref="Obj" label-width="200px" class="Obj ruleForm">
        <FormItem label="人身照" prop="">
          <Gaopaiyi :is-idcard="true"
                    :uploadConf='uploadConf' :imgType="'flow_head'" ref="flow_head"></Gaopaiyi>
        </FormItem>
        <FormItem label="身份证正面照" prop="">
          <Gaopaiyi :is-idcard="true"
                    :uploadConf='uploadConf' :imgType="'flow_idcard'" ref="flow_idcard"></Gaopaiyi>
        </FormItem>
        <FormItem label="收款凭证" prop="">
          <Gaopaiyi :is-idcard="true"
                    :uploadConf='uploadConf' :imgType="'flow_deposit'" ref="flow_deposit"></Gaopaiyi>
        </FormItem>
        <FormItem label="投注站站号" prop="stationCode" class="two-item-line">
          <!--<div style="background: red">还没开始</div>-->
          <Select v-model="Obj.stationCode" filterable remote :remote-method="getStationList"
                  :loading="loadingStation" @on-change="queryStationInfo">
            <Option v-for="(station, index) in stationList" :value="station.station_code" :key="index">
              {{station.station_code}}-{{station.name_x}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="主站编号" prop="masterStationCode">
          <Input :disabled="!changeFlags['masterStationCode']" v-model="Obj.masterStationCode"
                 :maxlength='10'
                 placeholder="编号长度至少为8位/没有主站编码传0"></Input>
          <Checkbox v-model="changeFlags['masterStationCode']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="业主姓名" prop="principal">
          <Input :disabled="!changeFlags['principal']" v-model="Obj.principal" :maxlength='10'></Input>
          <Checkbox v-model="changeFlags['principal']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="手机号码" prop="mobile">
          <Input :disabled="!changeFlags['mobile']" v-model="Obj.mobile" :maxlength='11'></Input>
          <Checkbox v-model="changeFlags['mobile']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="联系人姓名" prop="contractMan">
          <Input :disabled="!changeFlags['contractMan']" v-model="Obj.contractMan" :maxlength='10'></Input>
          <Checkbox v-model="changeFlags['contractMan']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="身份证号" prop="idCard">
          <Input :disabled="!changeFlags['idCard']" v-model="Obj.idCard" :maxlength='18'></Input>
          <Checkbox v-model="changeFlags['idCard']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="文化程度" prop="education">
          <Select clearable v-model="Obj.education" :disabled="!changeFlags['education']">
            <Option v-for="item in eduList" :value="item.value" :key="item.value" :label="item.text"></Option>
          </Select>
          <Checkbox v-model="changeFlags['education']" class="checkbox-position"></Checkbox>
        </FormItem>

        <FormItem label="户籍地址" prop="residence">
          <Input v-model="Obj.residence" :maxlength='20' :disabled="!changeFlags['residence']"></Input>
          <Checkbox v-model="changeFlags['residence']" class="checkbox-position"></Checkbox>
        </FormItem>

        <FormItem label="站点类型" prop="stationType">
          <Select clearable v-model="Obj.stationType" :disabled="!changeFlags['stationType']">
            <Option v-for="item in stationTypeList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
          <Checkbox v-model="changeFlags['stationType']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="经营模式" prop="operateModeId">
          <Select clearable v-model="Obj.operateModeId" :disabled="!changeFlags['operateModeId']">
            <Option v-for="item in operateModeList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
          <Checkbox v-model="changeFlags['operateModeId']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="站点等级" prop="starLevel">
          <Select clearable v-model="Obj.starLevel" :disabled="!changeFlags['starLevel']">
            <Option v-for="item in starLevelList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
          <Checkbox v-model="changeFlags['starLevel']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="账户控制类型" prop="accountType">
          <Select clearable v-model="Obj.accountType" :disabled="!changeFlags['accountType']">
            <Option v-for="item in accountTypeList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
          <Checkbox v-model="changeFlags['accountType']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="可用余额下限" prop="accountLimit">
          <Select clearable v-model="Obj.accountLimit" :disabled="!changeFlags['accountLimit']">
            <Option value="0" label="0"></Option>
            <Option value="-5000" label="-5000"></Option>
          </Select>
          <Checkbox v-model="changeFlags['accountLimit']" class="checkbox-position"></Checkbox>
        </FormItem>

        <FormItem label="销售保证金" prop="deposit">
          <Select clearable v-model="Obj.deposit" :disabled="!changeFlags['deposit']">
            <Option value="0" label="0"></Option>
            <Option value="5000" label="5000"></Option>
            <Option value="10000" label="10000"></Option>
            <Option value="20000" label="20000"></Option>
          </Select>
          <Checkbox v-model="changeFlags['deposit']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="是否经营快三" prop="operateKuai3">
          <Select clearable v-model="Obj.operateKuai3" :disabled="!changeFlags['operateKuai3']">
            <Option v-for="item in radioList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
          <Checkbox v-model="changeFlags['operateKuai3']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="是否经营幸运彩" prop="operateLuckyLottery">
          <Select clearable v-model="Obj.operateLuckyLottery" :disabled="!changeFlags['operateLuckyLottery']">
            <Option v-for="item in radioList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
          <Checkbox v-model="changeFlags['operateLuckyLottery']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="幸运彩站号" prop="luckyLotteryStationCode">
          <Input v-model="Obj.luckyLotteryStationCode" :maxlength='20'
                 :disabled="!changeFlags['luckyLotteryStationCode']"></Input>
          <Checkbox v-model="changeFlags['luckyLotteryStationCode']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="是否个体" prop="isPerson">
          <Select clearable v-model="Obj.isPerson" :disabled="!changeFlags['isPerson']">
            <Option v-for="item in radioList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
          <Checkbox v-model="changeFlags['isPerson']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="代销费类型" prop="commissionType">
          <Select clearable v-model="Obj.commissionType" :disabled="!changeFlags['commissionType']">
            <Option v-for="item in commisionTypeList" :value="item.value" :label="item.text"
                    :key="item.value"></Option>
          </Select>
          <Checkbox v-model="changeFlags['commissionType']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="银行类型" prop="bankType">
          <Select v-model="Obj.bankType" :disabled="!changeFlags['bankType']">
            <Option v-for="item in bankTypeList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
          <Checkbox v-model="changeFlags['bankType']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="银行卡号" prop="bankAccountNo">
          <Input v-model="Obj.bankAccountNo" :maxlength='20' :disabled="!changeFlags['bankAccountNo']"></Input>
          <Checkbox v-model="changeFlags['bankAccountNo']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="银行预留手机号" prop="bankAccountMobile">
          <Input v-model="Obj.bankAccountMobile" :maxlength='20'
                 :disabled="!changeFlags['bankAccountMobile']"></Input>
          <Checkbox v-model="changeFlags['bankAccountMobile']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="投注站房产" prop="houseType">
          <Select clearable v-model="Obj.houseType" :disabled="!changeFlags['houseType']">
            <Option v-for="item in houseTypeList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
          <Checkbox v-model="changeFlags['houseType']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="租金" prop="rental">
          <Input v-model="Obj.rental" :maxlength='10' :disabled="!changeFlags['rental']"></Input>
          <Checkbox v-model="changeFlags['rental']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="站点面积" prop="stationArea">
          <Input v-model="Obj.stationArea" :maxlength='10' :disabled="!changeFlags['stationArea']"></Input>
          <Checkbox v-model="changeFlags['stationArea']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="城市类别" prop="stationCityTownId">
          <Select clearable v-model="Obj.stationCityTownId" :disabled="!changeFlags['stationCityTownId']">
            <Option v-for="item in cityTownList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
          <Checkbox v-model="changeFlags['stationCityTownId']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="能否派2名销售员培训" prop="canSalerTrained">
          <Select clearable v-model="Obj.canSalerTrained" :disabled="!changeFlags['canSalerTrained']">
            <Option v-for="item in radioList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
          <Checkbox v-model="changeFlags['canSalerTrained']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="能否安装程控电话" prop="computerizedPhone">
          <Select clearable v-model="Obj.computerizedPhone" :disabled="!changeFlags['computerizedPhone']">
            <Option v-for="item in radioList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
          <Checkbox v-model="changeFlags['computerizedPhone']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="能否专卖彩票" prop="monopoly">
          <Select clearable v-model="Obj.monopoly" :disabled="!changeFlags['monopoly']">
            <Option v-for="item in radioList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
          <Checkbox v-model="changeFlags['monopoly']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="是否电源稳" prop="steadyPower">
          <Select clearable v-model="Obj.steadyPower" :disabled="!changeFlags['steadyPower']">
            <Option v-for="item in radioList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
          <Checkbox v-model="changeFlags['steadyPower']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="考试成绩" prop="examResult">
          <Input v-model="Obj.examResult" :maxlength='2' :disabled="!changeFlags['examResult']"></Input>
          <Checkbox v-model="changeFlags['examResult']" class="checkbox-position"></Checkbox>
        </FormItem>
        <FormItem label="设备信息" prop="newDeviceInfos">
          <Button type="ghost" :disabled="!changeFlags['newDeviceInfos']"
                  @click="addDevice">增加
          </Button>
          <Button type="error" :disabled="!changeFlags['newDeviceInfos']"
                  @click="reduceDevice">减少
          </Button>
          <!--<Input v-model="Obj.examResult" :maxlength='2' placeholder="操作下方按钮，添加/减少设备信息" :disabled="true"></Input>-->
          <Checkbox v-model="changeFlags['newDeviceInfos']" class="checkbox-position"></Checkbox>
        </FormItem>

        <div style="display:flex;">

          <div class="deviceright">
            <Row type="flex" justify="center" class="mb10">
              <Col :md="4" :offset="1"> 名称</Col>
              <Col :md="4" :offset="1"> 编码</Col>
              <Col :md="4" :offset="1"> 投注机类型</Col>
              <Col :md="3" :offset="1"> 价格（元）</Col>
              <Col :md="4" :offset="1"> 备注</Col>
            </Row>
            <div class="deviceright-item" v-for="(device,index) in deviceInfo"
                 :key='device.index'>
              <Row type="flex" justify="center">
                <Col :md="4" :offset="1">
                  <FormItem prop="nameX" :class="device.nameXValidate?'':'is-error'">
                    <Input type="text" :disabled="!changeFlags['newDeviceInfos']" @blur="checkForm"
                           v-model="device.nameX"></Input>
                    <div class="el-form-item__error" v-show="changeFlags['newDeviceInfos'] && !device.nameXValidate">
                      设备名称不能为空
                    </div>
                  </FormItem>
                </Col>
                <Col :md="4" :offset="1">
                  <FormItem prop="deviceCode" :class="device.deviceCodeValidate?'':'is-error'">
                    <Input type="text" v-model="device.deviceCode" :disabled="!changeFlags['newDeviceInfos']"
                           @blur="checkForm"></Input>
                    <div class="el-form-item__error"
                         v-show="changeFlags['newDeviceInfos'] && !device.deviceCodeValidate">设备编码不能为空
                    </div>
                  </FormItem>
                </Col>
                <Col :md="4" :offset="1">
                  <FormItem prop="typeX" :class="device.typeXValidate?'':'is-error'">
                    <Select v-model="device.typeX" :disabled="!changeFlags['newDeviceInfos']" @change="checkForm"
                            clearable>
                      <Option v-for="(type, index) in deviceTypeList" :key="index" :value="type.id"
                              :label="type.deviceModelName">
                      </Option>
                    </Select>
                    <!-- <Input type="text"  v-model="device.typeX"></Input> -->
                    <div class="el-form-item__error" v-show="changeFlags['newDeviceInfos'] && !device.typeXValidate">
                      设备类型不能为空
                    </div>
                  </FormItem>
                </Col>
                <Col :md="3" :offset="1">
                  <Input type="text" v-model="device.price" :disabled="!changeFlags['newDeviceInfos']"></Input>
                </Col>
                <Col :md="4" :offset="1">
                  <Input type="text" v-model="device.remark" :disabled="!changeFlags['newDeviceInfos']"></Input>
                </Col>
              </Row>
            </div>

            <!--<Row>-->
            <!--<Col span="8" :offset="16">-->
            <!--<Button type="ghost" style="margin: 12px 20px 0 0;" @click="addDevice">增加</Button>-->
            <!--<Button type="error" style="margin-top: 12px;" @click="reduceDevice">减少</Button>-->
            <!--</Col>-->
            <!--</Row>-->
          </div>
        </div>
        <!--*******************************************************-->

        <FormItem label="处理意见" prop="flow" class="mt10">
          <Input type="textarea" :autosize="true" v-model="Obj.flow.content" :maxlength='6'></Input>
        </FormItem>
        <FormItem label="附件信息" prop="postcode">
          <ModalUpload class="" :api="uploadConf" :isMultiple="true">
            <div slot="warnTxt">只能上传jpg/png文件，且不超过500kb</div>
          </ModalUpload>
        </FormItem>


        <FormItem>
          <Button type="primary" class="mr20 mt12" @click="save('draft')">暂存</Button>
          <Button @click="resetForm('Obj')" class="mr20 mt12">重置</Button>
          <Chuli :node-list="nodeList" :flowId="flowObj.flowId" :nodeCode="beginNode.code"
                 @chuliConfirm="chuliConfirm" :instanceId="instanceId"
                 @vertify="checkForm" ref="chuliBtn"></Chuli>
          <!--<Button type="primary" @click="submitForm('Obj')">保存</Button>-->
        </FormItem>
      </Form>

      <!--<Dialog :visible.sync="useableStationCodeFlag" title="选择站点" width="568px"-->
      <!--:append-to-body="true">-->
      <!--<Table :loading="loading" :height="300" border ref="selection" :data="data1">-->
      <!--<TableColumn label="序号" type="index" width="50"></TableColumn>-->
      <!--<TableColumn label="站点编号">-->
      <!--<template slot-scope="scope">-->
      <!--<Button @click="editItem(scope.row)" type="text" size="small">-->
      <!--{{scope.row.stationCode}}-->
      <!--</Button>-->
      <!--</template>-->
      <!--</TableColumn>-->
      <!--</Table>-->
      <!--</Dialog>-->
    </TabPane>
    <TabPane label="流程图">
      <Mysteps :nodeList='nodeList'></Mysteps>
    </TabPane>
  </Tabs>
</template>

<script>
import ModalUpload from '@/components/upload/modalUpload/ModalUpload'
import Chuli from '@/components/chuli/Chuli'
import Mysteps from '@/components/mysteps/MySteps'
import {mapState, mapMutations} from 'vuex'
import AreaCascader from '@/components/areaCascader/AreaCascader'
import Gaopaiyi from '@/components/gaopaiyi/Gaopaiyi'

var stationCodeBegin = 0
export default {
  data() {
    const validatorStationNo = (rule, value, callback, source, options) => {
      if (value === '0') {
        callback()
      }
      this.postJson('biz', {
        apiCode: 200001,
        content: {
          stationCode: value
        }
      }).then(res => {
        if (res.code === '0') {
          if (!res.content) {
            callback(new Error('该站点不存在'))
          } else if (res.content && res.content.stationStat != '0') {
            callback(new Error('该站点已停机或已注销'))
          } else {
            callback()
          }
        }
      })
    }
    return {
      instanceId: JSON.parse(sessionStorage.getItem('draftFromApply')) ? JSON.parse(sessionStorage.getItem('draftFromApply')).instanceId : '',
      uploadConf: {
        sysModule: 'flow',
        hostBizObj: 'flow_files',
        hostBizId: ''
      },
      loadingStation: false,
      changeFlags: {
        rent: true,
        masterStationCode: true,
        luckyLotteryStationCode: false
      },
      stationTypeList: [], // 站点类型列表
      radioList: [
        {value: 'true', text: '是'},
        {value: 'false', text: '否'}
      ], // 单选列表
      deposits: [
        {value: 0, text: 0},
        {value: 5000, text: 5000},
        {value: 10000, text: 10000},
        {value: 20000, text: 20000}
      ], // 销售保证金
      ruleInline: {
        stationCode: [
          {required: true, message: '站点编号不能为空', trigger: 'change'},
          {min: 8, message: '编号长度为8位', trigger: 'blur'}
        ],
        masterStationCode: [
          {required: true, message: '主站编号不能为空', trigger: 'change'},
          {validator: validatorStationNo, required: true, trigger: 'change'},
          {max: 8, message: '编号长度为8位/没有主站编码传0', trigger: 'blur'}
        ]
      }, // 校验规则
      Obj: {
        regionCode: '',
        flow: {
          content: ''
        }
      },
      objOld: {},
      flowObj: {
        flow: {
          content: ''
        }
      },
      // 流程图跳线
      nodeList: [],
      // 显示/隐藏 坐标标注200005
      posFlag: false,
      // 表格加载
      loading: false,
      // 显示/隐藏 上传弹窗
      modalFlag: false,
      // 上传附件基本配置
      conf: {
        // tooltips: [1, 2],
        uploadUrl: ''
      },
      // 空站号列表显示/隐藏
      useableStationCodeFlag: false,
      tabsIndex: 1, // tab切换，默认第一个
      // 当前激活的tab名字
      // 内容区域开关
      showContent: false,
      // 显示隐藏的查询框
      searchBox_flag: false,
      // 表格头部信息
      tableHeader: [
        {
          type: 'index',
          title: '序号',
          width: 60,
          align: 'center'
        },
        {
          title: '站点编号',
          key: 'stationCode',
          render: (h, params) => {
            return h('div', [
              h('a', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.Obj.stationCode = params.row.stationCode
                    this.useableStationCodeFlag = false
                  }
                }
              }, params.row.stationCode)
            ])
          }
        }
      ],
      flowCode: '',
      fromNodeCode: '',
      // 表格内容信息
      data1: [],
      // 代理商列表
      agentList: [],
      // 代销费类型
      commisionTypeList: [],
      // 编号开头，必须以该数组的其中之一为开头
      stationCodeBeginRule: [],
      bankTypeList: [],
      // 设备型号
      deviceTypeList: [],
      stationList: [],
      deviceInfo: [
        {
          deviceCode: '',
          deviceCodeValidate: true,
          nameX: '',
          nameXValidate: true,
          typeX: '',
          typeXValidate: true,
          price: '',
          remark: ''
        }
      ],
      // 第一个步骤，起始节点
      beginNode: '',
      submitObj: {}
    }
  },
  watch: {
    Obj: {
      handler(newName, oldName) {
        stationCodeBegin = newName.stationCode
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
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
    // 获取站点列表
    getStationList(sCode) {
      this.postJson('station', {
        apiCode: 300019,
        content: {
          searchKey: sCode
        }
      }).then(res => {
        if (res.code === '0') {
          this.stationList = res.content
        }
      })
    },
    queryStationInfo() {
      var stationCode = this.Obj.stationCode
      if (!stationCode) {
        return
      } else {
        // 将obj置为空
        this.Obj = {}
        this.Obj.stationCode = stationCode

        this.objOld = {}
        // 将所有勾选项置空
        this.changeFlags = {
          rent: true,
          luckyLotteryStationCode: true
        }
        // 查询本地站点信息
        this.postJson('station', {
          apiCode: 300004,
          content: {
            id: this.Obj.stationCode
          }
        }).then(res => {
          if (res.code === '0') {
            let response = res.content
            console.log(response)
            // 站点信息
            this.Obj.stationCityTownId = response.stationCityTownId
            this.Obj.stationCityTownName = response.stationCityTownName
            this.Obj.stationType = response.stationType
            this.Obj.operateModeId = response.operateModeId
            this.Obj.starLevel = response.stationStar
            this.Obj.depositAmount = response.bail
            this.Obj.saleKuaiKai = response.operateKuai3
            this.Obj.bankType = response.bankType
            this.Obj.bankAccountNo = response.backAccount
            this.Obj.bankAccountMobile = response.bankAccountMobile
            this.Obj.houseType = response.houseType
            this.Obj.rent = response.yearRental
            this.Obj.acreage = response.stationAcreage
            // 设备信息
            this.Obj.deviceInfo = response.deviceList
            // 业主信息
            if (response.stationMaster) {
              this.Obj.examResult = response.stationMaster.examResult
              this.Obj.principal = response.stationMaster.nameX
              this.Obj.mobile = response.stationMaster.mobile
              this.Obj.contractMan = response.stationMaster.linkMan
              this.Obj.idCard = response.stationMaster.idCard
              this.Obj.education = response.stationMaster.cultureDegree
              this.Obj.residence = response.stationMaster.hkAddress
            }
            // 热线信息
            if (response.stationHotline) {
              this.Obj.accountType = response.stationHotline.accountType
              this.Obj.accountLimit = response.stationHotline.accountLimit
              this.Obj.commissionType = response.stationHotline.commissionType
            }
            // 暂无字段
            // this.Obj.isOperateLuckyLottery = response.
            // this.Obj.luckyLotteryStationCode = response.
            // this.Obj.isPerson = response.
            // this.Obj.canSalerTrained = response.
            // this.Obj.computerizedPhone = response.
            // this.Obj.monopoly = response.
            // this.Obj.steadyPower = response.
          }
          // 查询热线站点信息
          this.queryHotlineStationInfo()
        })
      }
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
        remark: ''
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
    async getStationCodeBeginRule() {
      return this.postJson('account', {
        apiCode: 100030,
        content: {
          regionCode: this.Obj.regionCode
        }
      }).then(res => {
        if (res.code === '0') {
          this.stationCodeBeginRule = res.content.correctRegionCode.split(',')
          console.log(this.stationCodeBeginRule)
        }
      })
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
    // 加载‘空站号列表’
    async loadSiteInfo() {
      let list = await this.postJson('station', {
        apiCode: 300020,
        content: {
          regionCode: this.Obj.regionCode
        }
      })
      if (list.content) {
        this.data1 = list.content.map(v => {
          return {stationCode: v}
        })
      } else {
        this.data1 = []
      }
      if (this.data1 && this.data1.length === 1) {
        this.Obj.stationCode = this.data1[0].stationCode
        this.useableStationCodeFlag = false
      } else {
        this.useableStationCodeFlag = true
      }
    },
    // 删除弹窗
    del() {
    },
    // vertify点击提交按钮时验证
    async checkForm() {
      this.$refs['Obj'].validate((valid) => {
        if (valid) {
        } else {
          this.showMsg('请输入正确的必填信息', 'error')
        }
      })
      var check = false
      if (!this.changeFlags['newDeviceInfos']) {
        check = true
      } else {
        check = true
        this.deviceInfo.forEach((e) => {
          if (!e.deviceCode) {
            e.deviceCodeValidate = false
            check = false
            // this.showMsg('请输入正确的必填信息', 'error')
          } else {
            e.deviceCodeValidate = true
          }
          if (!e.nameX) {
            e.nameXValidate = false
            check = false
            // this.showMsg('请输入正确的必填信息', 'error')
          } else {
            e.nameXValidate = true
          }
          if (!e.typeX) {
            e.typeXValidate = false
            check = false
            // this.showMsg('请输入正确的必填信息', 'error')
          } else {
            e.typeXValidate = true
          }
        })
      }
      if (!check) {
        return check
      }
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
      if (val.nextInfo.acceptById) {
        this.flowObj.flow.acceptByName = val.nextInfo.acceptByName
        this.flowObj.flow.acceptById = val.nextInfo.acceptById
      }
      this.flowObj.nodeBo = val.nodeBo
      this.flowObj.flow.sendMsg = val.nextInfo.sendMsg
      this.flowObj.flow.showDetail = val.nextInfo.showDetail
      this.flowObj.flow.acceptByName = val.nodeBo.acceptByName
      this.flowObj.flow.acceptById = val.nodeBo.acceptById
      this.flowObj.flow.acceptByType = val.nodeBo.acceptByType
      // 提交到后台
      this.save()
    },
    // 最底部按钮
    save(draft) {
      this.flowObj.flow.bizKey = this.Obj.stationCode
      this.posFlag = false
      // 固定写死
      this.flowObj.flow.sysModule = 'station'
      this.flowObj.flow.processMode = 'web'

      // 获取城市类别名称
      if (this.Obj.stationCityTownId) {
        let arr = this.cityTownList.filter(ele => ele.value == this.Obj.stationCityTownId)
        this.Obj.stationCityTownName = arr.length > 0 ? arr[0].text : ''
      }
      var submit = {}
      submit.stationCode = this.Obj.stationCode
      for (let name in this.changeFlags) {
        if (this.changeFlags[name]) {
          submit[name] = this.Obj[name]
          submit[name + 'Old'] = this.objOld[name]
          // 设置设备信息
          if (name === 'newDeviceInfos') {
            submit[name] = JSON.stringify(this.deviceInfo)
            submit['oldDeviceInfos'] = this.objOld[name]
          }
        }
      }
      submit.flow = this.flowObj.flow
      submit.flowId = this.flowObj.flowId
      submit.title = this.flowObj.title
      submit.id = this.Obj.id
      this.submitObj = submit
      if (draft) {
        // for (var key in this.Obj) {
        //   if (key != 'flow') this.submitObj[key] = this.Obj[key]
        // }
        this.flowObj.flow.draft = true
        this.submit(true)
      } else {
        this.validate().then(res => {
          if (res) {
            this.flowObj.flow.draft = false
            this.submit(false)
          }
        })
      }
    },
    submit(draft) {
      this.postJsonWithMask('common', {
        apiCode: 200079,
        content: this.submitObj
      }).then(res => {
        if (res.code === '0') {
          this.showMsg(`${draft ? '暂存' : '提交'}成功`)
          this.Obj = {}
          this.flowObj.flow = {}
          this.$router.go(-1)
        }
      })
    },
    // 重置
    resetForm(formName) {
      this.Obj = {}
      this.init()
    },
    // resetForm(formName) {
    //   this[formName] = {
    //     goodsId: this.goodsId,
    //     warehouseId: this.warehouseId,
    //     page: 1
    //   }
    // },
    // 校验输入的必填项和规则
    async validate() {
      var check = false
      await this.$refs['Obj'].validate((valid) => {
        if (valid) {
          check = true
        } else {
          this.showMsg('请输入正确的必填信息', 'error')
          check = false
        }
      })
      return check
    },
    // 获取代理商列表
    getAgentList() {
      this.postJson('biz', {
        apiCode: 200005
      }).then(res => {
        // console.log(res)
        this.agentList = res.content
      })
    },
    // 获取代销费类型
    getCommisionTypeList() {
      this.commisionTypeList = this.$store.state.station_enumDic.commissionType
    },
    init() {
      const buz = JSON.parse(sessionStorage.getItem('sitesAdd'))
      console.log(buz)
      const {id, flowName, flowCode} = buz
      this.flowCode = flowCode
      this.Obj.flowId = id
      this.Obj.title = flowName
      this.Obj.flow = {content: ''}
      this.Obj.flow.bizTitle = flowName
      this.Obj.flow.flowId = id
      this.Obj.flow.agreed = true // 是否同意，默认同意
      this.Obj.flow.flowName = flowName
      // 获取流程图
      this.getFlowInfo(id)
    },
    // 获取流程图
    getFlowInfo(flowId) {
      this.postJsonWithMask('pubilc', {
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
        this.flowObj.flow.fromNodeCode = nodelist[1].code
        this.flowObj.flow.fromNodeName = nodelist[1].nameX
        this.flowObj.flow.toNodeCode = nodelist[2].code
        this.flowObj.flow.toNodeName = nodelist[2].nameX
        this.flowObj.flow.acceptByName = nodelist[2].acceptByName
        this.flowObj.flow.acceptById = nodelist[2].acceptById
        this.flowObj.flow.acceptByType = nodelist[2].acceptByType.value
        const userId = JSON.parse(sessionStorage.getItem('login')).uid
        this.uploadConf.hostBizId = `temp$${userId}$${this.flowCode}$${this.fromNodeCode}`
      })
    },
    // 获取站点类型列表
    getStationTypeList() {
      this.postJson('station', {
        apiCode: 300014
      }).then(res => {
        // console.log(res)
        if (res.code === '0') {
          this.stationTypeList = res.content
          this.SET_ENUM_DIC({
            target: 'stationType',
            content: res.content
          })
          sessionStorage.setItem('stationType', JSON.stringify(res.content))
        }
      })
    },
    getBankTypeList() {
      this.bankTypeList = this.$store.state.station_enumDic.bankType
    },
    // 获取草稿信息
    async getDraftDetail(flowId, bizId, instanceId) {
      const res = await this.postJsonWithMask('common', {
        apiCode: 200112,
        content: {flowId, bizId, instanceId, showDetail: false}
      })
      console.log(res)
      let target = res.content.bizObject
      this.Obj = Object.assign(this.Obj, res.content.bizObject)
      this.Obj.education = this.Obj.education ? this.Obj.education.value : ''
      Object.keys(target).some(v => {
        if (v.includes('Old')) {
          let key = v.split('Old')[0]
          if (target[key + 'Old'] != null && target[key + 'Old'] != undefined) {
            this.Obj[key] = target[key + 'Old'] + ''
          }
          delete this.Obj[key + 'Old']
        } else {
        }
      })
      for (let key in this.Obj) {
        if (this.Obj[key] === true || this.Obj[key] === false) {
          this.Obj[key] += ''
        }
      }
      this.queryHotlineStationInfo()
    },
    // 查询热线站点信息
    queryHotlineStationInfo() {
      this.postJson('biz', {
        apiCode: 200001,
        content: {
          stationCode: this.Obj.stationCode
        }
      }).then(res => {
        if (res.code === '0') {
          let response = res.content
          console.log(response)
          this.Obj.accountType = response.accountType
          this.Obj.accountLimit = response.accountLimit
          this.Obj.commissionType = response.commissionType
          this.Obj.masterStationCode = response.masterStationId
        }
        // 将obj的值写入oldObj
        this.objOld = {...this.Obj}
        console.log(this.objOld)
      })
    },
    ...mapMutations({
      SET_ENUM_DIC: 'SET_ENUM_DIC'
    })
  },
  computed: {
    ...mapState({
      operateModeList: state => state['station_enumDic']['operateMode']
    }),
    ...mapState(['jumpNodeArr']),
    // List-区域类型（设立区域）
    cityTownList() {
      return this.$store.state['station_enumDic'].stationCityTown
    },
    // List-文化程度、学历
    eduList() {
      return this.$store.state['station_enumDic'].CommonEnum$eduEnum
    },
    // List-站点等级(一星，二星，三星)
    starLevelList() {
      return this.$store.state['station_enumDic'].MisEnum$stationStarLevelEnum
    },
    // List-代销费类型
    accountTypeList() {
      return this.$store.state['station_enumDic'].StationEnum$accountTypeEnum
    },
    // List-投注站房产
    houseTypeList() {
      return this.$store.state['station_enumDic'].StationEnum$houseTypeEnum
    }
  },
  components: {
    Chuli,
    Mysteps,
    AreaCascader,
    Gaopaiyi,
    ModalUpload
  },
  mounted() {
    // 获取代理商
    this.getAgentList()
    // 获取代销费类型
    this.getCommisionTypeList()
    // 获取站点类型
    this.getStationTypeList()
    // 获取设备类型
    this.getDeviceTypeList()
    // 获取银行类型
    this.getBankTypeList()
    // this.Obj = {}
    if (this.$route.query.from == 'apply') {
      const buz = JSON.parse(sessionStorage.getItem('draftFromApply'))
      console.log(buz)
      const {flowId, bizId, id, flowCode, flowName} = buz
      this.flowCode = flowCode
      this.Obj.id = id
      this.Obj.flowId = flowId
      this.Obj.title = flowName
      this.Obj.flow = {
        flow: {
          content: {}
        }
      }
      this.Obj.flow.bizTitle = flowName
      this.Obj.flow.flowId = flowId
      this.Obj.flow.agreed = true + '' // 是否同意，默认同意
      this.Obj.flow.flowName = flowName
      this.flowObj = this.Obj
      this.getDraftDetail(flowId, bizId, id)
      // 获取流程图
      this.getFlowInfo(flowId)
    } else {
      const buz = JSON.parse(sessionStorage.getItem('stationChange'))
      console.log(buz)
      const {id, flowName, flowCode} = buz
      this.flowCode = flowCode
      this.flowObj.flowId = id
      this.flowObj.title = flowName
      this.flowObj.flow = {}
      this.flowObj.flow.bizTitle = flowName
      this.flowObj.flow.flowId = id
      this.flowObj.flow.agreed = true // 是否同意，默认同意
      this.flowObj.flow.flowName = flowName
      // 获取流程图
      this.getFlowInfo(id)
    }
  }
}
</script>

<style>
  .checkbox-position {
    position: absolute;
    right: -20px
  }

  .deviceInfo {
    width: 156px;
    font-size: 13px;
    text-align: center;
    line-height: 30px;
    /*background-color: #f8f8f9;*/
    /*border-radius: 6px 0 0 6px;*/
    /*border: 1px solid #e8e8ea;*/
    /*border-right: none;*/
  }

  .deviceright {
    flex: 1;
  }

  .deviceright-item .el-form-item__content {
    margin: 0 !important;
    width: 100% !important;
  }
</style>
