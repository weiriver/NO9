<template>
  <!--<keep-alive>-->
  <Tabs class="_blue-header" type="border-card" v-if="showContent">
    <TabPane label="业务详情">
      <Form :model="Obj" :rules="ruleInline" ref="Obj" label-width="200px" class="Obj ruleForm">

        <FormItem label="协议书" prop="" v-if="currentNodeCode == 'shi_zhong_xin_fa_fang_tou_zhu_she_bei'">
          <Gaopaiyi :is-idcard="true" :isDisabled="isDisabled"
                    :uploadConf='uploadConf' :imgType="'flow_protocol'" ref="flow_protocol"></Gaopaiyi>
        </FormItem>
        <FormItem label="合同照片" prop="" v-if="currentNodeCode == 'shi_zhong_xin_fa_fang_tou_zhu_she_bei'">
          <Gaopaiyi :is-idcard="true" :isDisabled="isDisabled"
                    :uploadConf='uploadConf' :imgType="'flow_contract'" ref="flow_contract"></Gaopaiyi>
        </FormItem>
        <FormItem label="人身照" prop="">
          <Gaopaiyi :is-idcard="true" :isDisabled="isDisabled"
                    :uploadConf='uploadConf' :imgType="'flow_head'" ref="flow_head"></Gaopaiyi>
        </FormItem>
        <FormItem label="人身照" prop="">
          <Gaopaiyi :is-idcard="true" :isDisabled="isDisabled"
                    :uploadConf='uploadConf' :imgType="'flow_head'" ref="flow_head"></Gaopaiyi>
        </FormItem>


        <FormItem label="身份证正面照" prop="">
          <Gaopaiyi :is-idcard="true" :isDisabled="isDisabled"
                    :uploadConf='uploadConf' :imgType="'flow_idcard'" ref="flow_idcard"></Gaopaiyi>
        </FormItem>
        <FormItem label="收款凭证" prop="">
          <Gaopaiyi :is-idcard="true" :isDisabled="isDisabled"
                    :uploadConf='uploadConf' :imgType="'flow_deposit'" ref="flow_deposit"></Gaopaiyi>
        </FormItem>

        <FormItem label="所属区域" prop="regionCode">
          <span v-if="!editableObj.regionCode.editable">{{Obj.regionName}}</span>
          <AreaCascader ref="as"
                        :res="Obj.regionCode"
                        :stage="3"
                        :show_all_levels="true"
                        :select_any_level_flag="true"
                        :disabled="!editableObj.regionCode.editable"
                        @sendToAreaSelect="areaSelectResult"
                        v-model="Obj.regionCode"
                        v-if="editableObj.regionCode.editable"
          ></AreaCascader>
        </FormItem>


        <FormItem label="站点编号" prop="contactUser" class="two-item-line">
          <Input v-model="Obj.stationCode" :disabled="!Obj.regionCode && !editableObj.stationCode.editable"
                 :maxlength='10'></Input>
          <Button type="primary" @click="loadSiteInfo"
                  :disabled="!Obj.regionCode && !editableObj.stationCode.editable">加载可用编号
          </Button>
        </FormItem>
        <FormItem label="主站编号" prop="masterStationCode">
          <Input v-model="Obj.masterStationCode"
                 :disabled="!Obj.regionCode  && !editableObj.masterStationCode.editable" :maxlength='10'
                 placeholder="编号长度至少为8位/没有主站编码传0"></Input>
        </FormItem>
        <FormItem label="业主姓名" prop="principal">
          <Input v-model="Obj.principal" :maxlength='20' :disabled="!editableObj.principal.editable"></Input>
        </FormItem>
        <FormItem label="手机号码" prop="mobile">
          <Input v-model="Obj.mobile" :maxlength="11" :disabled="!editableObj.mobile.editable"></Input>
        </FormItem>
        <FormItem label="联系人姓名" prop="contactUser">
          <Input v-model="Obj.contactUser" :maxlength='20' :disabled="!editableObj.contactUser.editable"></Input>
        </FormItem>
        <FormItem label="身份证号" prop="idCard">
          <Input v-model="Obj.idCard" :maxlength="18" :disabled="!editableObj.idCard.editable"></Input>
        </FormItem>
        <FormItem label="银行类型" prop="bankType">
          <Select v-model="Obj.bankType" :disabled="!editableObj.bankType.editable">
            <Option v-for="item in bankTypeList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem label="银行卡号" prop="bankAccountNo">
          <Input v-model="Obj.bankAccountNo" :maxlength='20' :disabled="!editableObj.bankAccountNo.editable"></Input>
        </FormItem>
        <FormItem label="文化程度" prop="education">
          <Select v-model="Obj.education" :disabled="!editableObj.education.editable">
            <Option v-for="item in eduList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem label="户籍地址" prop="residence">
          <Input v-model="Obj.residence" :maxlength='20' :disabled="!editableObj.residence.editable"></Input>
        </FormItem>

        <FormItem label="站点类型" prop="stationType">
          <Select clearable v-model="Obj.stationType" :disabled="!editableObj.stationType.editable">
            <Option v-for="item in stationTypeList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem label="经营模式" prop="operateModeId">
          <Select clearable v-model="Obj.operateModeId" :disabled="!editableObj.operateModeId.editable">
            <Option v-for="item in operateModeList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem label="站点等级" prop="starLevel">
          <Select clearable v-model="Obj.starLevel" :disabled="!editableObj.starLevel.editable">
            <Option v-for="item in starLevelList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem label="账户控制类型" prop="accountType">
          <Select clearable v-model="Obj.accountType" :disabled="!editableObj.accountType.editable">
            <Option v-for="item in accountTypeList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem label="代理商" prop="agent">
          <Select clearable v-model="Obj.agent" :disabled="!editableObj.agent.editable">
            <Option v-for="item in agentList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem label="可用余额下限" prop="accountLimit" :disabled="!editableObj.accountLimit.editable">
          <Select clearable v-model="Obj.accountLimit">
            <Option value="0" label="0"></Option>
            <Option value="-5000" label="-5000"></Option>
          </Select>
        </FormItem>
        <FormItem label="保证金确认" prop="accountLimit" :disabled="!editableObj.depositCheck.editable">
          <Select clearable v-model="Obj.accountLimit">
            <Option v-for="item in radioList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem label="销售保证金" prop="deposit">
          <Select clearable v-model="Obj.deposit" :disabled="!editableObj.deposit.editable">
            <Option value="0" label="0"></Option>
            <Option value="5000" label="5000"></Option>
            <Option value="10000" label="10000"></Option>
            <Option value="20000" label="20000"></Option>
          </Select>
        </FormItem>

        <FormItem label="是否经营快三" prop="operateKuai3">
          <Select clearable v-model="Obj.operateKuai3" :disabled="!editableObj.operateKuai3.editable">
            <Option v-for="item in radioList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem label="是否经营幸运彩" prop="operateLuckyLottery">
          <Select clearable v-model="Obj.operateLuckyLottery" :disabled="!editableObj.operateLuckyLottery.editable">
            <Option v-for="item in radioList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem label="幸运彩站号" prop="luckyLotteryStationCode">
          <Input v-model="Obj.luckyLotteryStationCode" :maxlength='20'
                 :disabled="!editableObj.luckyLotteryStationCode.editable"></Input>
        </FormItem>

        <FormItem label="是否个体" prop="isPerson">
          <Select clearable v-model="Obj.isPerson" :disabled="!editableObj.isPerson.editable">
            <Option v-for="item in radioList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
        </FormItem>

        <FormItem label="代销费类型" prop="commissionType">
          <Select clearable v-model="Obj.commissionType">
            <Option v-for="item in commisionTypeList" :value="item.value" :label="item.text"
                    :key="item.value"></Option>
          </Select>
        </FormItem>

        <FormItem label="站点地址" prop="address">
          <Input v-model="Obj.address" :maxlength='50' :disabled="!editableObj.address.editable"></Input>
        </FormItem>
        <FormItem label="站票面地址" prop="printAddr">
          <Input v-model="Obj.printAddr" :disabled="!editableObj.address.printAddr" :maxlength='50'></Input>
        </FormItem>

        <FormItem label="投注站房产" prop="houseType">
          <Select clearable v-model="Obj.houseType" :disabled="!editableObj.houseType.editable">
            <Option v-for="item in houseTypeList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
        </FormItem>

        <FormItem label="租金" prop="rental">
          <Input v-model="Obj.rental" :maxlength='10' :disabled="!editableObj.rental.editable"></Input>
        </FormItem>

        <FormItem label="站点面积" prop="stationArea">
          <Input v-model="Obj.stationArea" :maxlength='10' :disabled="!editableObj.stationArea.editable"></Input>
        </FormItem>

        <FormItem label="城市类别" prop="stationCityTownId">
          <Select clearable v-model="Obj.stationCityTownId" :disabled="!editableObj.stationCityTownId.editable">
            <Option v-for="item in cityTownList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem label="能否派2名销售员培训" prop="canSalerTrained">
          <Select clearable v-model="Obj.canSalerTrained" :disabled="!editableObj.canSalerTrained.editable">
            <Option v-for="item in radioList" :value="item.value" :label="item.text" :key="item.value"></Option>
          </Select>
        </FormItem>

        <FormItem label="考试成绩" prop="examResult" number :disabled="!editableObj.examResult.editable">
          <Input v-model="Obj.examResult" :maxlength='2'></Input>
        </FormItem>

        <FormItem label="签约日期" prop="signDate"
                  v-if="Obj.flow.fromNodeCode === 'shi_zhong_xin_fa_fang_tou_zhu_she_bei' || Obj.flow.fromNodeCode === 'sheng_zhong_xin_dian_nao_piao_bu_fu_shen'">
          <DatePicker
             :disabled="!editableObj.signDate.editable"
             type="date"
             v-model="Obj.signDate"
             placeholder="选择日期"
             @change="selDateEvent"
             value-format="yyyy-MM-dd"
             :clearable="false"
          ></DatePicker>
        </FormItem>


        <FormItem label="协议时限" prop="limitDate"
                  v-if="Obj.flow.fromNodeCode === 'shi_zhong_xin_fa_fang_tou_zhu_she_bei' || Obj.flow.fromNodeCode === 'sheng_zhong_xin_dian_nao_piao_bu_fu_shen'">
          <DatePicker
             :disabled="!editableObj.limitDate.editable"
             type="date"
             v-model="Obj.limitDate"
             placeholder="选择日期"
             @change="selDateEvent2"
             value-format="yyyy-MM-dd"
             :clearable="false"
          ></DatePicker>
        </FormItem>


        <FormItem label="协议编号" prop="contractSn">
          <Input v-model="Obj.contractSn" :maxlength='6' :disabled="!editableObj.contractSn.editable"></Input>
        </FormItem>

        <FormItem label="邮政编码" prop="postcode">
          <Input v-model="Obj.postcode" :maxlength='6' :disabled="!editableObj.postcode.editable"></Input>
        </FormItem>

        <FormItem label="批量的批号" prop="batchNo">
          <Input v-model="Obj.batchNo" :maxlength='6' :disabled="!editableObj.batchNo.editable"></Input>
        </FormItem>


        <FormItem label="处理意见" prop="flow">
          <Input type="textarea" :autosize="true" v-model="Obj.flow.content" :maxlength='6'></Input>
        </FormItem>

        <FormItem label="站点流程文件" prop="flow">
          <Button type="primary" @click="gotoOffice">新建站点流程文件</Button>
        </FormItem>

        <!--站点流程文件-->
        <!--<div>-->
        <!--<h3 class="h3">-->
        <!--站点流程文件-->
        <!--</h3>-->
        <!--<div class="autoLayout_modify mt12">-->
        <!--<Button type="primary" @click="gotoOffice">新建站点流程文件</Button>-->
        <!--</div>-->
        <!--</div>-->

        <!--设备信息-->
        <h3 v-if="Obj.flow.fromNodeCode === 'shi_zhong_xin_fa_fang_tou_zhu_she_bei'">
          设备信息
        </h3>
        <div class="devicediv" v-if="Obj.flow.fromNodeCode === 'shi_zhong_xin_fa_fang_tou_zhu_she_bei'">
          <Row type="flex">
            <Col :md="2"> 设备名称</Col>
            <Col :md="1" offset="1"> 编码</Col>
            <Col :md="1" offset="1"> 站点</Col>
            <Col :md="2" offset="1"> 设备ID</Col>
            <Col :md="2" offset="1"> 型号名称</Col>
            <Col :md="2" offset="1"> 类别ID</Col>
            <Col :md="1" offset="1"> 类别</Col>
            <Col :md="1" offset="1"> 价格</Col>
            <Col :md="1" offset="1"> 备注</Col>
          </Row>
          <div v-for="(device,index) in Obj.deviceInfo" :key='device.index'>
            <Row type="flex">
              <Col :md="2">
                <FormItem prop="nameX">
                  <IInput type="text" v-model="device.nameX"></IInput>
                </FormItem>
              </Col>
              <Col :md="1" offset="1">
                <FormItem prop="deviceCode">
                  <IInput type="text" v-model="device.deviceCode"></IInput>
                </FormItem>
              </Col>
              <Col :md="1" offset="1">
                <FormItem prop="stationCode">
                  <IInput type="text" v-model="device.stationCode"></IInput>
                </FormItem>
              </Col>
              <Col :md="2" offset="1">
                <FormItem prop="modelId">
                  <IInput type="text" v-model="device.modelId"></IInput>
                </FormItem>
              </Col>
              <Col :md="2" offset="1">
                <FormItem prop="modelName">
                  <IInput type="text" v-model="device.modelName"></IInput>
                </FormItem>
              </Col>
              <Col :md="2" offset="1">
                <FormItem prop="typeId">
                  <IInput type="text" v-model="device.typeId"></IInput>
                </FormItem>
              </Col>
              <Col :md="1" offset="1">
                <FormItem prop="typeX">
                  <IInput type="text" v-model="device.typeX"></IInput>
                </FormItem>
              </Col>
              <Col :md="1" offset="1">
                <FormItem prop="price">
                  <IInput type="text" v-model="device.price"></IInput>
                </FormItem>
              </Col>
              <Col :md="1" offset="1">
                <FormItem prop="extInfo">
                  <IInput type="text" v-model="device.extInfo"></IInput>
                </FormItem>
              </Col>
            </Row>
          </div>

          <Row>
            <Col span="8" offset="16">
              <Button type="ghost" style="margin: 12px 20px 0 0;" @click="addDevice">增加</Button>
              <Button type="error" style="margin-top: 12px;" @click="reduceDevice">减少</Button>
            </Col>
          </Row>
        </div>

        <FormItem label="附件信息" prop="postcode">
          <!--<UploadFile @toggleModalFlag="toggleModalFlag" :historyFileList="historyFileData" :ajaxConf="uploadConf"-->
          <!--@uploadResult="uploadResult" :isQueryHis="false"></UploadFile>-->
          <ModalUpload class="" :api="uploadConf" :isMultiple="true" :historyFileList="historyFileData"
                       :isQueryHis="false">
            <div slot="warnTxt">只能上传jpg/png文件，且不超过500kb</div>
          </ModalUpload>
        </FormItem>


        <div style="padding-left: 200px;">
          <Button type="primary" class="mr10 mt12" @click="save('draft')">暂存</Button>
          <Button @click="resetForm('Obj')" class="mr20 mt12">重置</Button>
          <Chuli :node-list="nodeList" :flowId="Obj.flowId" :nodeCode="currentNodeCode"
                 @chuliConfirm="chuliConfirm" :instanceId="instanceId"
                 @vertify="checkForm" ref="chuliBtn"></Chuli>
          <!--<Button type="primary" @click="submitForm('Obj')">保存</Button>-->
        </div>
      </Form>


      <!--处理按钮-->
      <!--<Chuli class="mb25" :node-list="nodeList" :flowId="Obj.flowId" :nodeCode="currentNodeCode"-->
      <!--@chuliConfirm="chuliConfirm" :instanceId="instanceId"></Chuli>-->

      <Dialog :visible.sync="useableStationCodeFlag" title="选择站点" width="568px"
              :append-to-body="true">
        <Table :loading="loading" :height="300" border ref="selection" :data="data1">
          <TableColumn label="序号" type="index" width="50"></TableColumn>
          <TableColumn label="站点编号">
            <template slot-scope="scope">
              <Button @click="editItem(scope.row)" type="text" size="small">
                {{scope.row.stationCode}}
              </Button>
            </template>
          </TableColumn>
        </Table>
      </Dialog>
    </TabPane>
    <TabPane label="流程图">
      <Mysteps :nodeList='nodeList' :currentNodeCode="currentNodeCode"></Mysteps>
    </TabPane>
  </Tabs>
  <!--</keep-alive>-->
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
    const validator = (rule, value, callback) => {
      // 先判断，是否符合规则
      if (!this.stationCodeBeginRule.includes(this.Obj.stationCode.substr(0, 4))) {
        callback(new Error(`站点编号应以${this.stationCodeBeginRule.join(' 或 ')}开头`))
      } else {
        this.postJson('biz', {
          apiCode: 200001,
          content: {
            stationCode: this.Obj.stationCode
          }
        }).then(res => {
          if (res.code === '0') {
            if (!res.content) {
              callback()
            } else if (res.content && res.content.stationStat === '2') {
              callback()
            } else {
              callback(new Error('该站点已经存在，不可使用'))
            }
          }
        })
      }
    }
    const validator3 = (rule, value, callback) => {
      if (value == 0) {
        callback()
      } else if (value.length < 8) {
        callback(new Error(`站点编号长度应大于8位数`))
      } else if (value.substr(0, 4) !== stationCodeBegin.substr(0, 4)) {
        callback(new Error(`站点编号应以${stationCodeBegin.substr(0, 4)}开头`))
      } else {
        callback()
      }
      // if (value != 0 && value.length > 8 && value.substr(0, 4) !== stationCodeBegin.substr(0, 4)) {
      // } else {
      // }
    }
    const validator4 = (rule, value, callback) => {
      // 先判断，是否符合规则
      if (value === '') {
        callback(new Error('请输入银行卡号'))
      } else {
        this.postJson('biz', {
          apiCode: 200018,
          content: {
            certNo: this.Obj.idCard,
            cardNo: value,
            name: this.Obj.principal
          }
        }).then(res => {
          if (res.code === '0') {
            callback()
          } else {
            callback(new Error('银行卡号与身份证号、业主姓名不匹配'))
          }
        })
      }
    }
    return {
      instanceId: JSON.parse(sessionStorage.getItem('sitesAdd')) ? JSON.parse(sessionStorage.getItem('sitesAdd')).instanceId : '',
      uploadConf: {
        sysModule: 'flow',
        hostBizObj: 'flow_files',
        hostBizId: ''
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
      // 是否禁用图片修改
      isDisabled: true,
      historyFileData: [],
      ruleInline: {
        regionCode: [
          {required: true, message: '所属区域不能为空', trigger: 'change'}
        ],
        stationCode: [
          {required: true, message: '站点编号不能为空', trigger: 'change'},
          {validator: validator, required: true, trigger: 'change'},
          {min: 8, message: '编号长度为8位', trigger: 'change'}
        ],
        masterStationCode: [
          {required: true, message: '主站编号不能为空', trigger: 'blur'},
          {validator: validator3, required: true, trigger: 'blur'}
        ],
        principal: [
          {required: true, message: '业主姓名不能为空', trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '手机号码不能为空', trigger: 'blur'},
          {min: 11, message: '不能少于11个字', trigger: 'blur'}
        ],
        idCard: [
          {required: true, message: '身份证号码不能为空', trigger: 'blur'},
          {min: 15, message: '不能少于15个字', trigger: 'blur'}
        ],
        residence: [
          {required: true, message: '户籍地址不能为空', trigger: 'blur'}
        ],
        stationType: [
          {required: true, message: '站点类型不能为空', trigger: 'change'}
        ],
        operateModeId: [
          {required: true, message: '经营模式不能为空', trigger: 'change'}
        ],
        accountType: [
          {required: true, message: '账户控制类型不能为空', trigger: 'change'}
        ],
        agent: [
          {required: true, message: '代理商不能为空', trigger: 'change'}
        ],
        accountLimit: [
          {required: true, message: '可用余额下限不能为空', trigger: 'change'}
        ],
        deposit: [
          {required: true, message: '销售保证金不能为空', trigger: 'change'}
        ],
        operateKuai3: [
          {required: true, message: '是否经营快三不能为空', trigger: 'change'}
        ],
        operateLuckyLottery: [
          {required: true, message: '是否经营幸运彩不能为空', trigger: 'change'}
        ],
        isPerson: [
          {required: true, message: '是否个体不能为空', trigger: 'change'}
        ],
        commissionType: [
          {required: true, message: '代销费类型不能为空', trigger: 'change'}
        ],
        bankType: [
          {required: true, message: '银行类型不能为空', trigger: 'change'}
        ],
        bankAccountNo: [
          {required: true, min: 16, message: '请输入正确的银行卡号', trigger: 'blur'},
          {validator: validator4, required: true, trigger: 'blur'}
        ],
        address: [
          {required: true, message: '站点地址不能为空', trigger: 'blur'}
        ],
        printAddr: [
          {required: true, message: '站票面地址不能为空', trigger: 'blur'}
        ],
        houseType: [
          {required: true, message: '投注站房产不能为空', trigger: 'change'}
        ],
        stationArea: [
          {required: true, message: '站点面积不能为空', trigger: 'change'}
        ],
        stationCityTownId: [
          {required: true, message: '城市类别不能为空', trigger: 'change'}
        ],
        examResult: [
          {required: true, message: '考试成绩不能为空/只能为数字', trigger: 'blur'},
          {required: true, type: 'number', message: '考试成绩不能为空/只能为数字', trigger: 'change'}
        ],
        signDate: [
          {required: true, type: 'date', message: '签约日期不能为空', trigger: 'change'}
        ],
        limitDate: [
          {required: true, type: 'date', message: '协议时限不能为空', trigger: 'change'}
        ],
        contractSn: [
          {required: true, message: '协议编号不能为空', trigger: 'blur'}
        ]
      }, // 校验规则
      Obj: {
        regionCode: '410403003000',
        flow: {
          content: ''
        },
        content: {
          page: 1
        },
        deviceInfo: [
          {
            nameX: '',
            deviceCode: '',
            stationCode: '',
            modelId: '',
            modelName: '',
            typeId: '',
            typeX: '',
            price: '',
            extInfo: ''
          }
        ]
      },
      Obj2: {
        accountLimit: '-5000',
        accountType: 'none',
        address: '123123123123',
        agent: '1',
        agentName: '福彩中心',
        bankType: '0',
        batchNo: '123123123',
        canSalerTrained: 'true',
        commissionType: '0',
        contactUser: '123123',
        contractSn: '123123123123',
        deposit: '0',
        depositCheck: 'true',
        education: 'primary',
        examResult: '123123',
        flow: {
          acceptById: 2,
          acceptByName: '刘德华',
          acceptByType: 'userDefined1',
          agreed: true,
          bizKey: '123123123123123123',
          bizTitle: '建站申请',
          content: '123123123',
          draft: false,
          flowId: 4,
          flowName: '建站申请',
          fromNodeCode: 'station_add_begin',
          fromNodeName: '拟稿',
          processMode: 'web',
          sysModule: 'station',
          toNodeCode: 'shi_guan_li_zhong_xin_shen_he',
          toNodeName: '初审'
        },
        flowId: 4,
        houseType: 'owner',
        idCard: '123123123123123123',
        isPerson: 'true',
        limitDate: '2018-6-20',
        luckyLotteryStationCode: '123123123123123',
        masterStationCode: '0',
        mobile: '12312312312',
        operateKuai3: 'true',
        operateLuckyLottery: 'true',
        operateModeId: '72',
        operateModeName: '双彩店',
        postcode: '123123',
        principal: '12312312312312',
        printAddr: '1231233',
        regionCode: '410403003000',
        regionName: '栎城乡',
        rental: '12312',
        residence: '123123123',
        reused: 'false',
        signDate: '2018-6-20',
        starLevel: 'one',
        stationArea: '123123',
        stationCityTownId: '',
        stationCityTownName: '市区',
        stationCode: '41041010',
        stationType: '0',
        title: '建站申请'
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
      // 第一个步骤，起始节点
      beginNode: '',
      submitObj: {},
      // 第一个步骤，起始节点
      currentNodeCode: '',
      // 可编辑对象
      editableObj: null
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
    addDevice() {
      console.log(1)
      var device = {
        nameX: '',
        deviceCode: '',
        stationCode: '',
        modelId: '',
        modelName: '',
        typeId: '',
        typeX: '',
        price: '',
        extInfo: ''
      }
      this.Obj.deviceInfo.push(device)
    },
    reduceDevice() {
      console.log(2)
      let devicelength = this.deviceInfo.length
      // 当数组只剩下一个元素时不允许删除
      if (devicelength === 1) {
        return
      }
      this.deviceInfo.splice(devicelength - 1, 1)
    },
    // 获取代销费类型
    getCommisionTypeList() {
      this.commisionTypeList = this.$store.state.station_enumDic.commissionType
    },
    getBankTypeList() {
      this.bankTypeList = this.$store.state.station_enumDic.bankType
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
    // 签约日期
    selDateEvent(date) {
      console.log(date)
      this.Obj.signDate = date
      // this.Obj.signDate = new Date(date)
      // this.$set(this.Obj, 'signDate', new Date(date))
      // this.$set(this.Obj, 'signDate', date)
    },
    // 协议时限
    selDateEvent2(date) {
      this.Obj.limitDate = date
      // this.Obj.limitDate = new Date(date)
      // this.$set(this.Obj, 'limitDate', new Date(date))
      // this.$set(this.Obj, 'limitDate', date)
    },
    // 所属区域结果
    async areaSelectResult(val) {
      console.log(val)
      this.Obj.regionCode = val.regionCode
      this.Obj.regionName = val.regionName
      this.getStationCodeBeginRule()
    },
    editItem(item) {
      this.Obj.stationCode = item.stationCode
      this.useableStationCodeFlag = false
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
    checkForm() {
      // this.$refs['chuliBtn'].showSteps()
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
      this.Obj.nodeBo = val.nodeBo
      this.Obj.flow.sendMsg = val.nextInfo.sendMsg
      this.Obj.flow.showDetail = val.nextInfo.showDetail
      this.Obj.flow.acceptByName = val.nodeBo.acceptByName
      this.Obj.flow.acceptById = val.nodeBo.acceptById
      this.Obj.flow.acceptByType = val.nodeBo.acceptByType
      console.log(this.Obj)
      // 提交到后台
      this.save()
    },
    // 最底部按钮
    save(draft) {
      this.Obj.flow.bizKey = this.Obj.stationCode
      // 获取站点经验模式名称
      if (this.editableObj.operateModeId.editable) {
        this.Obj.operateModeName = this.operateModeList.filter(ele => ele.value === this.Obj.operateModeId)[0].text
      }
      // 获取代理名称
      if (this.editableObj.stationCityTownId.editable) {
        this.Obj.agentName = this.agentList.filter(ele => ele.value === this.Obj.agent)[0].text
      }
      // 获取城市类别名称
      if (this.editableObj.stationCityTownId.editable) {
        this.Obj.stationCityTownName = this.cityTownList.filter(ele => ele.value === this.Obj.stationCityTownId)[0].text
      }
      this.posFlag = false
      // 获取站点经验模式名称
      if (this.Obj.operateModeName) this.Obj.operateModeName = this.operateModeList.filter(ele => ele.value === this.Obj.operateModeId)[0].text
      // 获取代理名称
      if (this.Obj.agentName) this.Obj.agentName = this.agentList.filter(ele => ele.value === this.Obj.agent)[0].text
      // 获取城市类别名称
      // if (this.Obj.stationCityTownName) this.Obj.stationCityTownName = this.cityTownList.filter(ele => ele.value === this.Obj.stationCityTownId)[0].text
      if (this.Obj.stationCityTownId) {
        this.Obj.stationCityTownName = this.cityTownList.filter(ele => ele.value === (this.Obj.stationCityTownId + ''))[0].text
      } else {
        this.Obj.stationCityTownId = ''
        this.Obj.stationCityTownName = ''
      }
      if (draft) {
        this.Obj.flow.draft = true
        this.submitObj = this.Obj
        this.submit(true)
      } else {
        this.Obj.flow.draft = false
        // 固定写死
        this.Obj.flow.sysModule = 'station'
        this.Obj.flow.processMode = 'web'
        const obj = JSON.parse(JSON.stringify(this.Obj))
        obj.signDate = this.ToDate(obj.signDate)
        obj.limitDate = this.ToDate(obj.limitDate)
        obj.flow.content = obj.content
        delete obj.content
        this.submitObj = obj
        this.submit(false)
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
          this.Obj.flow = {}
          this.$router.go(-1)
        }
      })
    },
    // 重置
    resetForm(formName) {
      this.Obj = {}
      this.init()
    },
    // 获取可编辑字段列表
    getEdiableList(flowId) {
      this.postJson('common', {
        apiCode: 200116,
        content: {
          flowId
        }
      }).then(res => {
        console.log(res.content)
        const list = res.content
        this.editableObj = list.filter(v => {
          return v.nodeCode == this.currentNodeCode
        })[0].fieldDetails
        console.log(this.editableObj)
      })
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
        const userId = JSON.parse(sessionStorage.getItem('login')).uid
        this.uploadConf.hostBizId = `temp$${userId}$${this.flowCode}$${this.fromNodeCode}`
        this.Obj.flow.fromNodeCode = nodelist[1].code
        // this.Obj.flow.fromNodeCode = 'shi_zhong_xin_fa_fang_tou_zhu_she_bei'
        this.Obj.flow.fromNodeName = nodelist[1].nameX
        this.Obj.flow.toNodeCode = nodelist[2].code
        this.Obj.flow.toNodeName = nodelist[2].nameX
        this.Obj.flow.acceptByName = nodelist[2].acceptByName
        this.Obj.flow.acceptById = nodelist[2].acceptById
        this.Obj.flow.acceptByType = nodelist[2].acceptByType.value
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
      // var merge = require('object-merge')
      if (res.content.bizObject.regionCode) {
        this.Obj.regionCode = res.content.bizObject.regionCode
        await this.getStationCodeBeginRule()
      }
      this.Obj = Object.assign(this.Obj, res.content.bizObject)
      console.log(this.Obj)
      // this.Obj.deposit += ''
      this.Obj.canSalerTrained += ''
      this.Obj.stationArea += ''
      this.Obj.reused += ''
      this.Obj.operateLuckyLottery += ''
      this.Obj.operateKuai3 += ''
      this.Obj.isPerson += ''
      this.Obj.depositCheck += ''
      this.Obj.signDate = new Date(this.Obj.signDate)
      this.Obj.limitDate = new Date(this.Obj.limitDate)
      this.Obj.education = this.Obj.education ? this.Obj.education.value : ''
      this.Obj.houseType = this.Obj.houseType ? this.Obj.houseType.value : ''
    },
    // 改变处理状态，并获取相关业务信息
    async getFlowDetail(flowId, bizId, waitTaskId, instanceId) {
      this.spinShow = true
      const res = await this.postJson('common', {
        apiCode: 200110,
        content: {flowId, bizId, waitTaskId, instanceId}
      })
      // .then(res => {})
      this.spinShow = false
      if (res.code == 0) {
        this.showMsg('数据加载成功')
        console.log('我是该流程的相关信息')
        console.log(res)
        this.historyData = res.content.finishList
        this.setNodeList(res)
        this.setFlowFile(res.content.filesList)
        let obj = res.content.bizObject
        await this.areaSelectResult({regionCode: obj.regionCode})
        // 特殊处理的字段
        obj.education = obj.education ? obj.education.value : ''
        obj.houseType = obj.houseType ? obj.houseType.value : ''
        this.Obj.stationArea = obj.stationArea + ''
        this.$set(this.Obj, 'signDate', obj.signDate ? new Date(obj.signDate) : new Date())
        this.$set(this.Obj, 'limitDate', obj.limitDate ? new Date(obj.limitDate) : new Date())
        this.Obj.limitDate = obj.limitDate ? new Date(obj.limitDate) : ''
        // this.stationCodeBeginRule = [obj.masterStationCode.substr(0, 4)]
        // 可批量处理的字段
        let arr = ['id', 'title', 'stationCode', 'principal', 'mobile', 'contactUser', 'idCard', 'education', 'residence', 'operateModeId', 'operateModeName', 'masterStationCode', 'accountType', 'agent', 'agentName', 'luckyLotteryStationCode', 'bankAccountNo', 'bankAccountMobile', 'regionCode', 'regionName', 'address', 'printAddr', 'houseType', 'rental', 'monopoly', 'steadyPower', 'computerizedPhone', 'stationCityTownName', 'contractSn', 'postcode', 'batchNo', 'fileNo', 'createBy', 'createByName', 'extInfo', 'commissionType', 'isFinished', 'examResult'
        ]
        let stringfyArr = [
          'stationType',
          'accountLimit',
          'deposit',
          'depositCheck',
          'operateKuai3',
          'isPerson',
          'starLevel',
          'bankType',
          'stationCityTownId',
          'canSalerTrained',
          'reused',
          'operateLuckyLottery'
        ]
        for (let j = 0; j < stringfyArr.length; j++) {
          if (obj[stringfyArr[j]] != null) {
            this.Obj[stringfyArr[j]] = obj[stringfyArr[j]] + ''
          }
        }
        for (let i = 0; i < arr.length; i++) {
          if (obj[arr[i]]) {
            if (arr[i] == 'regionCode') {
              this.$set(this.Obj, 'regionCode', obj[arr[i]])
            } else {
              this.Obj[arr[i]] = obj[arr[i]]
            }
          }
        }
        console.log(this.Obj)
        this.showContent = true
      }
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
    setNodeList(res) {
      const nodelist = res.content.flowDiagram.nodeList
      this.nodeList = nodelist
      console.log(nodelist)
      const currentNodeInfo = nodelist.filter(v => {
        return v.code == this.currentNodeCode
      })[0]
      // this.Obj.flow.acceptByName = currentNodeInfo.acceptByName
      // this.Obj.flow.acceptById = currentNodeInfo.acceptById
      // this.Obj.flow.acceptByType = currentNodeInfo.acceptByType.value
      this.fromNodeCode = nodelist[1].code
      this.uploadConf.hostBizId = `${currentNodeInfo.instanceId}$${this.flowCode}$${this.currentNodeCode}`
    },
    gotoOffice() {
      window.open(`http://10.13.0.129:10900/index?bizType=stationAdd&bizId=${this.Obj.flow.bizId}&instanceId=${this.Obj.flow.instanceId}`, '_blank')
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
    // List-渠道类型
    channelTypeList() {
      return this.$store.state['station_enumDic'].stationChannelType
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
    },
    middleVal() {
      // console.log(stationCodeBegin)
      stationCodeBegin = this.Obj.stationCode.substr(0, 4)
      return this.Obj.stationCode
    }
  },
  components: {
    Chuli,
    Mysteps,
    AreaCascader,
    Gaopaiyi,
    ModalUpload
  },
  mounted: async function () {
    // 路由传参
    console.log(11555)
    // 获取代销费类型
    this.getCommisionTypeList()
    // 获取银行类型
    this.getBankTypeList()
    // 获取代理商
    this.getAgentList()
    const buz = JSON.parse(sessionStorage.getItem('todosSitesAdd'))
    console.log(buz)
    // 当前节点
    const {flowId, flowName, flowCode, bizId, instanceId, id, nodeCode, nodeName} = buz
    this.flowCode = flowCode
    this.Obj.flowId = flowId
    this.Obj.title = flowName
    this.currentNodeCode = nodeCode
    this.Obj.flow = {}
    this.Obj.flow.instanceId = instanceId
    this.Obj.nodeBo = {}
    this.Obj.nodeBo.instanceId = instanceId
    this.Obj.flow.bizId = bizId
    this.Obj.flow.waitTaskId = id
    this.Obj.flow.fromNodeCode = nodeCode
    this.Obj.flow.fromNodeName = nodeName
    this.Obj.flow.bizTitle = flowName
    this.Obj.flow.flowId = flowId
    this.Obj.flow.agreed = true + '' // 是否同意，默认同意
    this.Obj.flow.flowName = flowName
    // 获取可编辑字段
    await this.getEdiableList(flowId)
    // 获取流程图
    // this.getFlowInfo(flowId)
    // 获取站点类型
    this.getStationTypeList()
    // 获取业务的内容信息（以前填写的表单）
    // this.getOldInfo(flowId, bizId, instanceId)
    // 改变处理状态
    this.getFlowDetail(flowId, bizId, id, instanceId)
  }
}
</script>

<style scoped>

</style>
