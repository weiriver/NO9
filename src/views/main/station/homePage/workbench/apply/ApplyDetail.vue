<template>
  <div class="applyDetail">
     <Tabs class="" type="border-card">
       <TabPane label="业务信息">
          <div>
            <div class="card">
              <!-- 各种申请都有的 -->
              <DetailList :keyName="'name'" :valueName="'value'" :detailList="base"></DetailList>
            </div>
            <div class="card">
              <!--建站申请-->
              <div v-if="detail && flowName =='station_add'">
                <DetailList :keyName="'name'" :valueName="'value'" :detailList="stationBuild" :isShowTitle="false"></DetailList>
              </div>
              <!--站点迁址:-未有数据测试-->
              <div v-if="detail && flowName =='station_move'">
                <DetailList :keyName="'name'" :valueName="'value'" :detailList="stationMove" :isShowTitle="false"></DetailList>
              </div>
              <!--恢复撤站申请-->
              <div v-if="detail && flowName =='station_restore'">
                <DetailList :keyName="'name'" :valueName="'value'" :detailList="stationRestore" :isShowTitle="false"></DetailList>
              </div>
              <!--站点停开机-->
              <div v-if="detail && flowName =='station_openclose'">
                <DetailList :keyName="'name'" :valueName="'value'" :detailList="stationOpenClose" :isShowTitle="false"></DetailList>
              </div>
              <!--快三销售-->
              <div v-if="detail && flowName =='station_saleright'">
                <DetailList :keyName="'name'" :valueName="'value'" :detailList="stationSaleright" :isShowTitle="false"></DetailList>
              </div>
              <!--站主信息变更-->
              <div v-if="detail && flowName =='station_responsor_change'">
                <DetailList :keyName="'name'" :valueName="'value'" :detailList="responsorChange" :isShowTitle="false"></DetailList>
                <div>
                  <h3 class="h3 mb12">
                    设备信息
                  </h3>
                  <div v-if="!detail.newDeviceInfos">暂无信息</div>
                  <Table v-if="detail.newDeviceInfos" stripe :data="JSON.parse(detail.newDeviceInfos)" border ref="selection">
                    <TableColumn label="序号" width="50" type="index" align="center"></TableColumn>
                    <TableColumn label="设备名称" prop="nameX"></TableColumn>
                    <TableColumn label="设备编号" prop="deviceCode"></TableColumn>
                    <TableColumn label="投注机类型" prop="typeX">
                      <template slot-scope="scope">
                        <span>{{deviceTypeList.length>0?deviceTypeList.find(v => v.id == scope.row.typeX).deviceModelName:''}}</span>
                      </template>
                    </TableColumn>
                    <TableColumn label="价格" prop="price"></TableColumn>
                    <TableColumn label="备注" prop="remark"></TableColumn>
                  </Table>
                </div>
              </div>
              <!--固定销售限额申请-->
              <div v-if="detail && flowName =='station_relexsale'">
                <DetailList :keyName="'name'" :valueName="'value'" :detailList="relexSale" :isShowTitle="false"></DetailList>
              </div>
              <!--临时销售限额申请-->
              <div v-if="detail && flowName =='station_templimit'">
                <DetailList :keyName="'name'" :valueName="'value'" :detailList="templimit" :isShowTitle="false"></DetailList>
              </div>
              <!--消息发布-->
              <div v-if="detail && flowName =='message_publish'">
                <DetailList :keyName="'name'" :valueName="'value'" :detailList="publish" :isShowTitle="false"></DetailList>
                <div class="message_content">
                  <div class="keyName">消息内容</div>
                  <div class="valueName" v-html="detail['msgContent']"></div>
                </div>
              </div>
              <!--基本资料变更申请-->
              <div v-if="detail && flowName =='station_basic_change'">
                <DetailList :keyName="'name'" :valueName="'value'" :detailList="basicChange" :isShowTitle="false"></DetailList>
              </div>
              <!--站点注销票-->
              <div v-if="detail && flowName =='station_cancelticket'">
                <DetailList :keyName="'name'" :valueName="'value'" :detailList="cancelticket" :isShowTitle="false"></DetailList>
              </div>
              <!--站点撤销-->
              <div v-if="detail && flowName =='station_repeal'">
                <DetailList :keyName="'name'" :valueName="'value'" :detailList="repeal" :isShowTitle="false"></DetailList>
              </div>
              <!--站点变更-->
              <div v-if="detail && flowName =='station_change'">
                <DetailList :keyName="'name'" :valueName="'value'" :detailList="stationChange" :isShowTitle="false"></DetailList>
                  <h3 class="h3 mb12">
                    设备信息
                  </h3>
                  <div v-if="!detail.newDeviceInfos">暂无信息</div>
                  <Table v-if="detail.newDeviceInfos" stripe :data="JSON.parse(detail.newDeviceInfos)" border ref="selection">
                    <TableColumn label="序号" width="50" type="index" align="center"></TableColumn>
                    <TableColumn label="设备名称" prop="nameX"></TableColumn>
                    <TableColumn label="设备编号" prop="deviceCode"></TableColumn>
                    <TableColumn label="投注机类型" prop="typeX">
                      <template slot-scope="scope">
                        <span>{{deviceTypeList.length>0?deviceTypeList.find(v => v.id == scope.row.typeX).deviceModelName:''}}</span>
                      </template>
                    </TableColumn>
                    <TableColumn label="价格" prop="price"></TableColumn>
                    <TableColumn label="备注" prop="remark"></TableColumn>
                  </Table>
              </div>
            </div>
          </div>
          <!--错误信息-->
          <div v-if="detail && isFinished === false && from === 'file'">
            <h3 class="h3 mb12">
              错误信息
            </h3>
            <div class="autoLayoutDetail">
              <!--所属区域-->
              <div class="autoLayoutItem">
                {{detail.extInfo}}
              </div>
            </div>
            <Button class="mt12" type="primary" size="default" @click="retry">重试</Button>
          </div>
          <!--历史记录-->
          <div v-if="historyData.length">
            <h3 class="h3 mb12">
              处理意见
            </h3>
            <Table stripe :data="historyData" :height="200" border style="width: 100%" ref="history">
              <TableColumn label="序号" width="50" type="index" align="center"></TableColumn>
              <TableColumn label="步骤名" prop="nodeName"></TableColumn>
              <TableColumn label="处理人" prop="acceptByName"></TableColumn>
              <TableColumn label="下一步" prop="toNodeName"></TableColumn>
              <TableColumn label="处理意见" prop="content"></TableColumn>
              <TableColumn label="处理时间" prop="finishDate">
                <template slot-scope="scope">
                  <span>{{scope.row.finishDate ? scope.row.finishDate.substr(0, 10) : ''}}</span>
                </template>
              </TableColumn>
            </Table>
          </div>

          <!-- 知会已阅按钮 -->
          <div v-show="showReadButton">
            <Button type="primary" class="mt20" :disabled="notify" @click="setRead()">设置为已阅</Button>
          </div>
       </TabPane>
       <TabPane label="流程图预览">
         <mySteps :nodeList="nodeList" :currentNodeCode="currentNodeCode"></mySteps>
       </TabPane>
     </Tabs>
  </div>
</template>

<script>
// 站点变更，设备列表，站主信息变更---有设备信息详情
export default {
  name: 'ApplyDetail',
    data() {
    return {
      Obj: {},
      from: '',
      isFinished: null,
      name: 'Android',
      nodeList: [],
      currentNodeCode: '',
      currentNodeName: '',
      showReadButton: false,
      notify: '',
      // 不同业务展示不同的数据---start
      base: [],
      stationBuild: [],// 建站申请
      stationMove: [],// 站点迁址
      stationRestore: [],// 恢复撤站申请
      stationOpenClose: [],// 站点停开机
      stationSaleright: [],// 快三销售
      responsorChange: [],// 站主信息变更
      relexSale: [],// 固定销售限额申请
      templimit: [],// 临时销售限额申请
      publish: [],// 消息发布
      basicChange: [],// 基本资料变更申请
      cancelticket: [],// 站点注销票
      repeal: [], // 站点撤销
      stationChange: [],// 站点变更
      // 不同业务展示不同的数据---end
      detail: '',
      flowName: '', // 对应不同业务的名称
      historyData: [],
      deviceTypeList: [],
      flowId: '',
      bizId: ''
    }
  },
  computed: {
    // List-代销费类型
    accountTypeList() {
      return this.$store.state['station_enumDic'].StationEnum$accountTypeEnum
    },
    commisionTypeList() {
      return this.$store.state.station_enumDic.commissionType
    },
    bankTypeList() {
      return this.$store.state.station_enumDic.bankType
    },
    stationTypeList() {
      return JSON.parse(sessionStorage.getItem('stationType'))
    }
  },
  methods: {
    async getDeviceTypeList() {
      var res = await this.postJson('station', {
        apiCode: 300091,
        content: {}
      })
      if (res.code == '0') {
        let response = res.content.dataList
        this.deviceTypeList = response
      }
    },
    // 获取站点类型列表
    async getStationTypeList() {
      var res = await this.postJson('station', {
        apiCode: 300014
      })
      if (res.code == '0') {
        var stationTypeList = res.content
        sessionStorage.setItem('stationType', JSON.stringify(res.content))
        var stationTypeData = stationTypeList.find((item) => {
          return item.value == this.detail.stationType
        })
        this.$set(this.detail, 'stationTypeName', this.getTxt(stationTypeData))
      }
    },
    getFrom() {
      var query = location.hash.split('?')[1].split('=')
      if (query[0] === 'from') {
        this.from = query[1]
      }
    },
    async retry() {
      var res = await this.postJsonWithMask('common', {
        apiCode: 200113,
        content: {
          flowId: this.flowId, // 业务ID
          bizId: this.bizId // 业务实例id
        }
      })
      if (res.code === '0') {
        this.showMsg('重试成功')
      }
    },
    async getDetail(flowId, bizId, instanceId, showDetail) {
      this.detail = {}
      var res = await this.postJsonWithMask('common', {
        apiCode: 200112,
        content: {flowId, bizId, instanceId, showDetail}
      })
      this.historyData = res.content.finishList
      this.detail = res.content.bizObject
      this.isFinished = res.content.bizObject ? res.content.bizObject.isFinished : null
      // 针对有时候数字字典没有值的情况
      if (this.bankTypeList) {
        var oldBankTypeData = this.bankTypeList.find((item) => {
          return item.value == this.detail.oldBankType
        })
        this.detail.oldBankTypeName = this.getTxt(oldBankTypeData)
      }
      if (this.accountTypeList) {
        var acccountTypeData = this.accountTypeList.find((item) => {
          return item.value == this.detail.accountType
        })
        this.detail.accountTypeName = this.getTxt(acccountTypeData)
      }
      if (this.commisionTypeList) {
        var commissionTypeData = this.commisionTypeList.find((item) => {
          return item.value == this.detail.commissionType
        })
        this.detail.commissionTypeName = this.getTxt(commissionTypeData)
      }
      if (this.stationTypeList) {
        var stationTypeData = this.stationTypeList.find((item) => {
          return item.value == this.detail.stationType
        })
        this.detail.stationTypeName = this.getTxt(stationTypeData)
      } else {
        this.getStationTypeList()
      }
      if (this.$store.state.station_enumDic.msgType) {
        var msgType = this.$store.state.station_enumDic.msgType.find((item) => {
          return item.value == this.detail.msgType
        })
        this.detail.msgType = this.getTxt(msgType)
      }
      if (res.code == 0) {
        this.nodeList = res.content.flowDiagram.nodeList
        let arr = this.nodeList.filter(v => {
          return v.nameX == this.currentNodeCode
        })
        if (arr.length > 0) {
          this.currentNodeCode = arr[0].code
        }
      }
      // 根据不通的业务显示不同的内容
      this.showDiffentDetail(flowId)
    },
    showDiffentDetail(flowId) {
      var flowTypeArr = this.$store.state.station_enumDic.FlowEnum$flowTypeEnum
      const target = flowTypeArr.filter(v => {
        return v.value == flowId
      })[0]
      setTimeout(() => {
        this.flowName = target.text
        // 显示不同类型的信息---组装detailList需要的数据
        this.showDetail()
        if (this.flowName == 'station_change' || this.flowName == 'station_responsor_change') { // 如果站点变更申请的详情，需要从热线获取设备的类型
          this.getDeviceTypeList()
        }
      }, 200)
    },
    // 组装详情需要用到的数据
    showDetail () {
      // 各种申请都有的 --base
      const buz = JSON.parse(sessionStorage.getItem('applyDetail'))
      let _stationCode = this.flowName == 'station_recovercert' ? this.detail.stationCodes : this.detail.stationCode
      this.base = [
        {name: '所属系统', value: buz.sysModule.text},
        {name: '业务类型', value: buz.flowName},
        {name: '业务标题', value: buz.bizTitle},
        {name: '当前处理节点', value: this.currentNodeName},
        {name: '创建人', value: buz.createByName},
        {name: '最后更新日期', value: buz.createDate?buz.createDate.substr(0, 10) : ''},
        {name: '站点编号', value: _stationCode}
      ]
      switch (this.flowName) {
        case 'station_add': // 建站申请---todo:有些禁用选项还没有搞定
          this.stationBuild = [
            {name: '所属区域', value: this.detail.regionName},
            {name: '主站编号', value: this.detail.masterStationCode},
            {name: '业主姓名', value: this.detail.principal},
            {name: '手机号码', value: this.detail.mobile},
            {name: '联系人姓名', value: this.detail.contactUser},
            {name: '身份证号', value: this.detail.idCard},
            {name: '文化程度', value: this.detail.education.text},
            {name: '户籍地址', value: this.detail.residence},
            {name: '站点类型', value: this.detail.stationTypeName},
            {name: '经营模式', value: this.detail.operateModeName},
            {name: '站点等级', value: this.detail.starLevel},
            {name: '账户控制类型', value: this.detail.accountTypeName},
            {name: '代理商', value: this.detail.agentName},
            {name: '可用余额下限', value: this.detail.accountLimit},
            {name: '保证金确认', value: this.detail.depositCheck ? '是' : '否'},
            {name: '销售保证金', value: this.detail.deposit},
            {name: '是否经营快三', value: this.detail.operateKuai3 ? '是' : '否'},
            {name: '是否经营幸运彩', value: this.detail.operateLuckyLottery ? '是' : '否'},
            {name: '幸运彩站号', value: this.detail.luckyLotteryStationCode},
            {name: '是否个体', value: this.detail.isPerson ? '是' : '否'},
            {name: '代销费类型', value: this.detail.commissionTypeName},
            {name: '银行类型', value: this.detail.bankTypeName},
            {name: '银行卡号', value: this.detail.bankAccountNo},
            {name: '站点地址', value: this.detail.address},
            {name: '站票面地址', value: this.detail.printAddr},
            {name: '投注站房产', value: this.detail.houseType.text},
            {name: '租金', value: this.detail.rental},
            {name: '站点面积', value: this.detail.stationArea},
            {name: '乡镇类型', value: this.detail.stationCityTownName},
            {name: '能否派2名销售员培训', value: this.detail.canSalerTrained ? '是':'否' },
            {name: '考试成绩', value: this.detail.examResult},
            {name: '签约日期', value: this.detail.signDate},
            {name: '协议时限', value: this.detail.limitDate},
            {name: '协议编号', value: this.detail.contractSn},
            {name: '是否为撤站复用', value: this.detail.reused ? '是' : '否'},
            {name: '邮政编码', value: this.detail.postcode}
          ]
          break;
        case 'station_move':// 站点迁址
          this.stationMove = [
            {name: '业主姓名', value: this.detail.principal},
            {name: '身份证号', value: this.detail.idCard},
            {name: '手机号码', value: this.detail.mobile},
            {name: '原区域名称', value: this.detail.oldRegionName},
            {name: '原站点地址', value: this.detail.oldAddres},
            {name: '现区域名称', value: this.detail.newRegionName},
            {name: '现站点地址', value: this.detail.newAddress},
            {name: '打印票地址', value: this.detail.printAddr},
            {name: '迁移原因', value: this.detail.reason},
          ]
          break;
        case 'station_restore':// 恢复撤站申请
          this.stationRestore = [
            {name: '业主姓名', value: this.detail.principal},
            {name: '身份证号', value: this.detail.idCard},
            {name: '手机号码', value: this.detail.mobile},
            {name: '站点地址', value: this.detail.address},
            {name: '账户欠款余额', value: this.detail.account},
            {name: '业务标题', value: this.detail.title}
          ]
          break;
        case 'station_openclose': // 站点停开机
          this.stationOpenClose = [
            {name: '业务标题', value: this.detail.title},
            {name: '申请原因', value: this.detail.reason},
            {name: '站点地址', value: this.detail.address},
            {name: '创建人', value: this.detail.createByName},
            {name: '身份证号', value: this.detail.idCard},
            {name: '手机号码', value: this.detail.mobile},
            {name: '业主姓名', value: this.detail.principal}
          ]
          break;
        case 'station_saleright':// 快三销售
          this.stationSaleright = [
            {name: '游戏名称', value: '快三'},
            {name: '投注权限', value: this.getTxt(this.detail.wager)},
            {name: '兑奖权限', value: this.getTxt(this.detail.cash)},
            {name: '注销权限', value: this.getTxt(this.detail.cancel)},
            {name: '代兑费率', value: this.detail.cashCommission},
            {name: '代销费率', value: this.detail.saleCommission},
            {name: '市级发行费比率', value: this.detail.stationCityRate},
            {name: '省级发行费比率', value: this.detail.stationProvRate},
            {name: '中彩福利金比率', value: this.detail.stationZcRate},
            {name: '兑换校验模式', value: this.detail.stationCashMode},
            {name: '注销时间上限', value: this.detail.cancelTimeLimit},
            {name: '注销次数上限', value: this.detail.issueCancelTimes},
            {name: '期注销金额上限', value: this.detail.issueCancelMoney},
            {name: '单票最小兑换金额', value: this.detail.minCashPerTick},
            {name: '单票最大兑换金额', value: this.detail.maxCashPerTick},
            {name: '单票最小金额', value: this.detail.minMoneyPerTick},
            {name: '单票最大金额', value: this.detail.maxMoneyPerTick},
            {name: '单票保护金额', value: this.detail.protectMoney},
            {name: '最小兑奖奖等', value: this.detail.minWinLevel},
            {name: '最大兑奖奖等', value: this.detail.maxWinLevel}
          ]
          break;
        case 'station_responsor_change':// 站主信息变更
          this.responsorChange = [
            {name: '原负责人姓名', value: this.detail.oldPrincipal},
            {name: '负责人手机号', value: this.detail.oldMobile},
            {name: '原负责人身份证号', value: this.detail.oldIdcard},
            {name: '原因', value: this.detail.reason},
            {name: '销售保证金收款金额', value: this.detail.oldDeposit},
            {name: '新业主姓名', value: this.detail.newPrincipal},
            {name: '新业主年龄', value: this.detail.age},
            {name: '新业主联系人', value: this.detail.contactUser},
            {name: '新业主性别', value: this.getTxt(this.detail.sex)},
            {name: '新业主身份证号', value: this.detail.newIdcard},
            {name: '联系方式', value: this.detail.newMobile},
            {name: '户口所在地', value: this.detail.newResidence},
            {name: '银行卡号', value: this.detail.newBankAccountNo},
            {name: '开户预留手机号', value: this.detail.newBankAccountMobile},
            {name: '银行类型', value: this.detail.newBankTypeName}
          ]
          break;
        case 'station_relexsale': // 固定销售限额申请
          this.relexSale = [
            {name: '申请人姓名', value: this.detail.principal},
            {name: '移动电话', value: this.detail.mobile},
            {name: '身份证号码', value: this.detail.idCard},
            {name: '销售限额', value: this.flowName =='station_relexsale' ? this.detail.oldAccountLimit : this.detail.oldAccountLimitTmp},
            {name: '投注站地址', value: this.detail.address},
            {name: '申请销售限额', value:this.flowName =='station_relexsale' ? this.detail.newAccountLimit :this.detail.newAccountLimitTmp}
          ]
          break;
        case 'station_templimit':
          this.templimit = [
            {name: '申请人姓名', value: this.detail.principal},
            {name: '移动电话', value: this.detail.mobile},
            {name: '身份证号码', value: this.detail.idCard},
            {name: '销售限额', value: this.detail.oldAccountLimitTmp},
            {name: '投注站地址', value: this.detail.address},
            {name: '申请销售限额', value:this.detail.newAccountLimitTmp}
          ]
          break;
        case 'message_publish': // 消息发布
          this.publish = [
            {name: '标题', value: this.detail.title},
            {name: '发送方式', value: this.getTxt(this.detail.sendMode)},
            {name: '消息类型', value: this.detail.msgType},
            {name: '接收站点编号', value: this.detail.stationIds},
            {name: '接收对象用户ID', value: this.detail.userIds},
            {name: '选择站点方式', value:this.getTxt(this.detail.chooseStationType)},
            {name: '区域', value: this.detail.regionCode},
            {name: '起始站点编号', value: this.detail.startStation},
            {name: '截止站点编号', value: this.detail.endStation},
            {name: '销量起始值', value: this.detail.startStationSale},
            {name: '销量截止值', value: this.detail.endStationSale},
            {name: '发送到管理员', value:this.getTxt(this.detail.sendToManager)}
          ]
          break;
        case 'station_basic_change':// 基本资料变更申请
          this.basicChange = [
            {name: '原区域编码', value:  this.detail.oldRegionCode},
            {name: '新区域编号', value: this.detail.regionCode},
            {name: '原区域', value: this.detail.oldRegionName},
            {name: '新区域', value: this.detail.regionName},
            {name: '原站点地址', value: this.detail.oldAddress},
            {name: '新站点地址', value: this.detail.address},
            {name: '原手机号码', value: this.detail.oldMobile},
            {name: '新手机号码', value: this.detail.mobile},
            {name: '原户籍地址', value: this.detail.oldResidence},
            {name: '新户籍地址', value: this.detail.residence},
            {name: '原是否经营幸运彩', value: this.getTxt(this.detail.oldOperateLuckyLottery)},
            {name: '是否经营幸运彩', value: this.getTxt(this.detail.operateLuckyLottery)},
            {name: '原幸运彩站号', value: this.detail.oldLuckyLotteryStationCode},
            {name: '幸运彩站号', value: this.detail.luckyLotteryStationCode},
            {name: '原站点面积', value:this.detail.oldArea},
            {name: '现站点面积', value:this.detail.area},
            {name: '原联系人姓名', value: this.detail.oldContactUserName},
            {name: '联系人姓名', value: this.detail.contactUserName},
            {name: '原银行类型', value: this.detail.oldBankTypeName},
            {name: '银行类型', value: this.detail.bankTypeName},
            {name: '原银行账号', value: this.detail.oldBankAccountNo},
            {name: '银行账号', value: this.detail.bankAccountNo},
            {name: '原银行预留手机号', value: this.detail.oldBankAccountMobile},
            {name: '银行预留手机号', value: this.detail.bankAccountMobile}
          ]
          break;
        case 'station_cancelticket':// 站点注销票
         this.cancelticket = [
            {name: '游戏名称', value:  this.detail.gameName},
            {name: '期号', value: this.detail.issue},
            {name: '流水号', value: this.detail.draw},
            {name: '注销票投注时间', value: this.detail.saleTime?this.detail.saleTime.substr(0, 10):''},
            {name: '注销彩票原因', value: this.detail.reason},
            {name: '注销票投注金额', value: this.detail.saleMoney}
         ]
         break;
        case 'station_repeal':// 站点撤销
          this.repeal = [
            {name: '负责人姓名', value:  this.detail.principal},
            {name: '联系电话', value: this.detail.mobile},
            {name: '身份证号码', value: this.detail.idCard},
            {name: '站点地址', value: this.detail.address},
            {name: '投注站销售保证金额', value: this.detail.deposit},
            {name: '撤销原因', value: this.detail.cancelReason}
          ]
         break;
        case 'station_change':// 站点变更
          this.stationChange = [
            {name: '原主站编号', value:  this.detail.masterStationCodeOld},
            {name: '主站编号', value: this.detail.masterStationCode},
            {name: '原业主姓名', value: this.detail.principalOld},
            {name: '业主姓名', value: this.detail.principal},
            {name: '原手机号码', value: this.detail.mobileOld},
            {name: '手机号码', value: this.detail.mobile},
            {name: '原联系人姓名', value: this.detail.contractManOld},
            {name: '联系人姓名', value: this.detail.contractMan},
            {name: '原身份证号', value: this.detail.idCardOld},
            {name: '身份证号', value: this.detail.idCard},
            {name: '原文化程度', value: this.getTxt(this.detail.educationOld)},
            {name: '文化程度', value: this.getTxt(this.detail.education)},
            {name: '原户籍地址', value: this.detail.residenceOld},
            {name: '户籍地址', value: this.detail.residence},
            {name: '原站点类型', value: this.detail.stationTypeNameOld},
            {name: '站点类型', value: this.detail.stationTypeName},
            {name: '原经营模式', value: this.detail.operateModeNameOld},
            {name: '经营模式', value: this.detail.operateModeName},
            {name: '原站点等级', value: this.detail.starLevelOld},
            {name: '站点等级', value: this.detail.starLevel},
            {name: '原账户控制类型', value: this.detail.accountTypeNameOld},
            {name: '账户控制类型', value: this.detail.accountTypeName},
            {name: '原销售保证金', value: this.detail.depositAmountOld},
            {name: '销售保证金', value: this.detail.depositAmount},
            {name: '原是否经营快三', value: this.detail.saleKuaiKaiOld == null ? '' : (this.detail.saleKuaiKaiOld ? '是' : '否')},
            {name: '是否经营快三', value: this.detail.saleKuaiKai == null ? '' : (this.detail.saleKuaiKai ? '是' : '否')},
            {name: '原是否经营幸运彩', value: this.detail.isOperateLuckyLotteryOld == null ? '' : (this.detail.isOperateLuckyLotteryOld ? '是' : '否')},
            {name: '是否经营幸运彩', value: this.detail.isOperateLuckyLottery == null ? '' : (this.detail.isOperateLuckyLottery ? '是' : '否')},
            {name: '原是否个体', value: this.detail.isPersonOld == null ? '' : (this.detail.isPersonOld ? '是' : '否')},
            {name: '是否个体', value: this.detail.isPerson == null ? '' : (this.detail.isPerson ? '是' : '否')},
            {name: '原代销费类型', value: this.detail.commissionTypeNameOld},
            {name: '代销费类型', value: this.detail.commissionTypeName},
            {name: '原银行类型', value: this.detail.bankTypeNameOld},
            {name: '银行类型', value: this.detail.bankTypeName},
            {name: '原银行卡号', value: this.detail.bankAccountNoOld},
            {name: '银行卡号', value: this.detail.bankAccountNo},
            {name: '原银行预留手机号', value: this.detail.bankAccountMobileOld},
            {name: '银行预留手机号', value: this.detail.bankAccountMobile},
            {name: '原投注站房产', value: this.detail.houseTypeOld == null ? '' : (this.detail.houseTypeOld=='owner'?'自有':'租用')},
            {name: '投注站房产', value: this.detail.houseType == null ? '' : (this.detail.houseType=='owner'?'自有':'租用')},
            {name: '原站点面积', value: this.detail.acreageOld},
            {name: '站点面积', value: this.detail.acreage},
            {name: '原乡镇类型', value: this.detail.stationCityTownNameOld},
            {name: '乡镇类型', value: this.detail.stationCityTownName},
            {name: '原考试成绩', value: this.detail.examResultOld},
            {name: '考试成绩', value: this.detail.examResult},
          ]
          if (this.detail.isOperateLuckyLotteryOld) {
            let luckyLotteryStationCode = [
              {name: '原幸运彩站号', value: this.detail.luckyLotteryStationCodeOld},
              {name: '幸运彩站号', value: this.detail.luckyLotteryStationCode}
            ]
            this.stationChange = [...this.stationChange, ...luckyLotteryStationCode]
          }
          if (this.detail.houseType === 'rent') {
            let rentalArr = [
              {name: '原租金', value: this.detail.rentalOld},
              {name: '现租金', value: this.detail.rental},
            ]
            this.stationChange = [...this.stationChange, ...rentalArr]
          }
          break;
      }
    },
    // 知会-设置已阅
    async setRead() {
      var res = await this.postJsonWithMask('common', {
        apiCode: 200070,
        content: {finishTaskId: this.Obj.flow.waitTaskId}
      })
      if (res.code == 0) {
        this.showMsg('设置已读成功')
        this.notify = true
      }
    }
  },
  mounted: function () {
    this.getFrom()
    const buz = JSON.parse(sessionStorage.getItem('applyDetail'))
    console.log(buz)
    var {flowId, bizId, id, currentNodeName, notify, referer, showDetail, nodeName, instanceId} = buz
    // 知会查看-显示已阅按钮
    this.showReadButton = referer === 'attention'
    // 是否已阅
    this.notify = notify
    if (this.from === 'file') {
      currentNodeName = '结束'
    } else {
      showDetail = true
    }
    if (!currentNodeName) {
      currentNodeName = nodeName
    }
    if (this.from === 'done' || this.from === 'attention') {
      id = instanceId
    }
    this.currentNodeCode = currentNodeName
    this.currentNodeName = currentNodeName
    // 并获取相关业务信息
    this.getDetail(flowId, bizId, id, showDetail)
    this.flowId = flowId
    this.bizId = bizId
  }
}
</script>

<style scoped lang="scss">
// 针对信息发布-信息内容做特殊处理
.message_content{
  display: flex;
  justify-content: center;
  width: 48%;
  font-size: 14px;
  color: #606266;
  .keyName{
    min-width: 140px;
    background-color:  $list-title-bg-color;
    min-height: 20px;
    border: 1px solid $border-color;
    padding: 10px;
    text-align: right;
  }
  .valueName{
    min-width: 200px;
    border: 1px solid $border-color;
    min-height: 20px;
    flex: 1;
    padding: 10px 10px;
    text-align: left;
    border-left: none;
    word-break: break-all;
  }
}
</style>