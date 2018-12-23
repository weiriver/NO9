<template>
  <div>
    <Chuli :node-list="nodeList" :nodeCode="'dian_nao_piao_bu_shen_he'"></Chuli>

    <div v-if="false">
      <DatePicker
         v-model="value1"
         type="date"
         placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
      </DatePicker>
      {{value1}}
      <Tabs class="_blue-header" type="border-card" @tab-click="tabClick">
        <TabPane label="定时补偿123"></TabPane>
        <TabPane label="定时补偿123"></TabPane>
        <TabPane label="定时补偿123"></TabPane>
        <TabPane label="定时补偿123"></TabPane>
        <TabPane label="定时补偿123"></TabPane>
        <div>
          <TablePage>
            <!--顶部按钮组-->
            <div slot="btn_groups">
              <!--<ButtonGroup>-->
              <Button type="primary" icon="el-icon-edit" @click="clearArea">清除区域选择</Button>
              <Button type="primary" icon="el-icon-edit">123</Button>
              <Button type="primary" icon="el-icon-share">1321</Button>
              <Button type="primary" icon="el-icon-delete">321</Button>
              <!--</ButtonGroup>-->
            </div>

            <!--查询条件-->
            <div slot="query">
              <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
              <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
                    ref="searchForm">

                <FormItem label="单票最大兑换金额" prop="name">
                  <Input v-model="searchForm.name"></Input>
                </FormItem>

                <FormItem label="活动区域" prop="region">
                  <Select clearable v-model="searchForm.region" placeholder="请选择活动区域">
                    <Option label="区域一" value="shanghai"></Option>
                    <Option label="区域二" value="beijing"></Option>
                  </Select>
                </FormItem>


                <FormItem label="活动区域" prop="region">
                  <AreaCascader :stage="3" :res="res" ref="area"></AreaCascader>
                </FormItem>


                <FormItem label="特殊资源" prop="resource" class="full-line">
                  <RadioGroup v-model="searchForm.resource">
                    <Radio label="线上品牌商赞助"></Radio>
                    <Radio label="线下场地免费"></Radio>
                  </RadioGroup>
                </FormItem>

                <FormItem label="活动性质" prop="type" class="full-line">
                  <CheckboxGroup v-model="searchForm.type">
                    <Checkbox label="美食/餐厅线上活动" name="type"></Checkbox>
                    <Checkbox label="地推活动" name="type"></Checkbox>
                    <Checkbox label="线下主题活动" name="type"></Checkbox>
                    <Checkbox label="单纯品牌曝光" name="type"></Checkbox>
                  </CheckboxGroup>
                </FormItem>

                <FormItem label="活动性质" prop="type" class="full-line">
                  <CheckboxGroup v-model="searchForm.type">
                    <Checkbox label="美食/餐厅线上活动" name="type"></Checkbox>
                    <Checkbox label="地推活动" name="type"></Checkbox>
                    <Checkbox label="线下主题活动" name="type"></Checkbox>
                    <Checkbox label="单纯品牌曝光" name="type"></Checkbox>
                  </CheckboxGroup>
                </FormItem>


                <FormItem label="活动时间" required class="full-line">
                  <Col :span="11">
                    <FormItem prop="date1">
                      <DatePicker type="date" placeholder="选择日期" v-model="searchForm.date1" value-format="yyyy-MM-dd"
                                  style="width: 100%;"></DatePicker>
                    </FormItem>
                  </Col>
                  <Col class="line" :span="1">-</Col>
                  <Col :span="11">
                    <FormItem prop="date2" class="width100">
                      <TimePicker type="fixed-time" placeholder="选择时间" v-model="searchForm.date2"
                                  style="width: 100%;"></TimePicker>
                    </FormItem>
                  </Col>
                </FormItem>

                <FormItem class="full-line">
                  <Button type="primary" @click="search()">立即创建</Button>
                  <Button @click="resetForm('searchForm')">重置</Button>
                </FormItem>
              </Form>


            </div>

            <!--表格-->
            <div slot="TableSlot">
              <Table stripe :data="tableData" height="250" border style="width: 100%">

                <TableColumn fixed label="序号" width="50" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
                  </template>
                </TableColumn>
                <TableColumn label="日期" prop="date" width="180"></TableColumn>
                <TableColumn label="姓名" prop="name" width="180"></TableColumn>
                <TableColumn label="地址" prop="address"></TableColumn>
              </Table>
            </div>

          </TablePage>
        </div>
      </Tabs>
      <DetailList :keyName="'title'" :valueName="'content'" :checkboxList="checkboxList"></DetailList>
      <DetailList :keyName="'name'" :valueName="'value'" :checkboxList="station_basic_change_arr"></DetailList>
    </div>
  </div>
</template>

<script>
import Chuli from '@/components/chuli/Chuli'

export default {
  name: 'Subindex',
  data: function () {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('年龄不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value < 18) {
            callback(new Error('必须年满18岁'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.searchForm2.checkPass !== '') {
          this.$refs.searchForm2.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.searchForm2.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      value1: '',
      res: 410403004000,
      // 基本资料变更
      station_basic_change_arr: [
        {name: '站点编号', value: 'stationCode'},
        {name: '修改内容复选框', value: 'modifyCheck'},
        {name: '原区域编码', value: 'oldRegionCode'},
        {name: '新区域编号', value: 'regionCode'},
        {name: '原区域', value: 'oldRegionName'},
        {name: '新区域', value: 'regionName'},
        {name: '原站点地址', value: 'oldAddress'},
        {name: '新站点地址', value: 'address'},
        {name: '原手机号码', value: 'oldMobile'},
        {name: '新手机号码', value: 'mobile'},
        {name: '原户籍地址', value: 'oldResidence'},
        {name: '新户籍地址', value: 'residence'},
        {name: '原是否经营幸运彩', value: 'oldOperateLuckyLottery'},
        {name: '是否经营幸运彩', value: 'operateLuckyLottery'},
        {name: '原幸运彩站号', value: 'oldLuckyLotteryStationCode'},
        {name: '幸运彩站号', value: 'luckyLotteryStationCode'},
        {name: '原站点面积', value: 'oldArea'},
        {name: '现站点面积', value: 'area'},
        {name: '原联系人姓名', value: 'oldContactUserName'},
        {name: '联系人姓名', value: 'contactUserName'},
        {name: '原银行类型', value: 'oldBankType'},
        {name: '银行类型', value: 'bankType'},
        {name: '原银行账号', value: 'oldBankAccountNo'},
        {name: '银行账号', value: 'bankAccountNo'},
        {name: '原银行预留手机号', value: 'oldBankAccountMobile'},
        {name: '银行预留手机号', value: 'bankAccountMobile'}

      ],
      checkboxList: [
        {
          title: '单票最小兑换金额',
          content: '内容'
        },
        {
          title: '标题',
          content: '内容'
        },
        {
          title: '标题',
          content: '03 王小虎 上海市普陀区金沙江路 1518 弄 2 2016-05-02 王小虎 上海市普陀区金沙江路 1518 弄 3 2016-05-04 王小虎 上海市普陀区金沙江路 1518 弄 4 2016-05-01 王小虎 上海市普陀区金沙江路 1518 弄 5 2016-05-08 王小虎'
        },
        {
          title: '标题',
          content: '内容'
        },
        {
          title: '单票最小兑换金额',
          content: '内容'
        },
        {
          title: '站点渠道类型名称',
          content: '03 王小虎 上海市普陀区金沙江路 1518 弄 2 2016-05-02 王小虎 上海市普陀区金沙江路 1518 弄 3 2016-05-04 王小虎 上海市普陀区金沙江路 1518 弄 4 2016-05-01 王小虎 上海市普陀区金沙江路 1518 弄 5 2016-05-08 王小虎'
        },
        {
          title: '站点渠道类型名称',
          content: '03 王小虎 上海市普陀区金沙江路 1518 弄 2 2016-05-02 王小虎 上海市普陀区金沙江路 1518 弄 3 2016-05-04 王小虎 上海市普陀区金沙江路 1518 弄 4 2016-05-01 王小虎 上海市普陀区金沙江路 1518 弄 5 2016-05-08 王小虎'
        }
      ],
      msg: '',
      tableHeader: [],
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      searchForm: {
        type: []
      },
      nodeList: [{
        'id': 180479,
        'code': 'station_openclose',
        'nameX': '开始',
        'nodeType': {'text': '启动节点', 'value': 'start'},
        'chooseType': {'text': '复选', 'value': 'checkbox'},
        'acceptByType': {'text': '用户自选', 'value': 'userDefined'},
        'acceptById': '',
        'acceptByName': '',
        'instanceId': 30092,
        'sendMsg': true,
        'showDetail': false,
        'status': {'text': '已处理', 'value': 'finished'},
        'taskType': {'text': '串行', 'value': 'manyOne'},
        'timeLimitType': {'text': '相对时间', 'value': 'relativeTime'},
        'timeLimit': '',
        'ccBy': '',
        'ccByName': '',
        'userScope': '',
        'userScopeId': null,
        'userScopeName': '',
        'createBy': null,
        'createByName': null,
        'lastUpdate': '2018-10-11 13:52:29',
        'createDate': null,
        'extInfo': null,
        'goBack': null,
        'canModify': false,
        'proTrans': [{
          'id': null,
          'nameX': '',
          'instanceId': null,
          'fromNode': 'station_openclose',
          'toNode': 'station_openclose_begin',
          'finishSeq': null,
          'status': null,
          'extInfo': null,
          'isBack': false
        }],
        'pftList': [],
        'jumpNodes': [{'toNodeCode': 'station_openclose_begin', 'isBack': false, 'toNodeName': '站点停开机申请'}]
      }, {
        'id': 180480,
        'code': 'station_openclose_begin',
        'nameX': '站点停开机申请',
        'nodeType': {'text': '任务节点', 'value': 'task'},
        'chooseType': {'text': '复选', 'value': 'checkbox'},
        'acceptByType': {'text': '用户自选', 'value': 'userDefined'},
        'acceptById': '1',
        'acceptByName': '系统管理员',
        'instanceId': 30092,
        'sendMsg': true,
        'showDetail': false,
        'status': {'text': '已处理', 'value': 'finished'},
        'taskType': {'text': '串行', 'value': 'manyOne'},
        'timeLimitType': {'text': '相对时间', 'value': 'relativeTime'},
        'timeLimit': '',
        'ccBy': '',
        'ccByName': '',
        'userScope': '',
        'userScopeId': null,
        'userScopeName': '',
        'createBy': null,
        'createByName': null,
        'lastUpdate': '2018-10-11 13:52:30',
        'createDate': null,
        'extInfo': null,
        'goBack': null,
        'canModify': false,
        'proTrans': [{
          'id': null,
          'nameX': '',
          'instanceId': null,
          'fromNode': 'station_openclose_begin',
          'toNode': 'di_shi_shen_he',
          'finishSeq': null,
          'status': null,
          'extInfo': null,
          'isBack': false
        }],
        'pftList': [{
          'id': 141853,
          'instanceId': 30092,
          'acceptBy': 1,
          'acceptByName': '系统管理员',
          'changeThing': null,
          'agreed': true,
          'content': null,
          'doSeq': 0,
          'doWith': false,
          'finishDate': '2018-10-11 13:52:30',
          'timedOut': false,
          'toNodeName': '市级审核',
          'firstHandleDate': null,
          'transferTime': null,
          'transferHandleDate': null,
          'transfer': null,
          'transferName': null,
          'taskType': {'text': '串行', 'value': 'manyOne'},
          'nodeCode': 'station_openclose_begin',
          'nodeName': '站点停开机申请',
          'createDate': '2018-10-11 13:52:30',
          'processMode': {'text': '管理系统', 'value': 'web'},
          'notify': false,
          'notifyDate': null,
          'extInfo': null,
          'pds': [{
            'id': 479,
            'changeName': 'id',
            'content': '允许强制归档',
            'oldValue': '',
            'newValue': '7839',
            'oldText': '',
            'newText': '7839',
            'finishTaskId': 141853,
            'flowId': 13,
            'flowName': '站点停开机申请',
            'createBy': 1,
            'createByName': '系统管理员',
            'createDate': '2018-10-11 13:52:30',
            'extInfo': null
          }, {
            'id': 480,
            'changeName': 'title',
            'content': '业务标题',
            'oldValue': '',
            'newValue': '[41010446]站点停开机申请',
            'oldText': '',
            'newText': '[41010446]站点停开机申请',
            'finishTaskId': 141853,
            'flowId': 13,
            'flowName': '站点停开机申请',
            'createBy': 1,
            'createByName': '系统管理员',
            'createDate': '2018-10-11 13:52:30',
            'extInfo': null
          }, {
            'id': 481,
            'changeName': 'stationCode',
            'content': '站点编号',
            'oldValue': '',
            'newValue': '41010446',
            'oldText': '',
            'newText': '41010446',
            'finishTaskId': 141853,
            'flowId': 13,
            'flowName': '站点停开机申请',
            'createBy': 1,
            'createByName': '系统管理员',
            'createDate': '2018-10-11 13:52:30',
            'extInfo': null
          }, {
            'id': 482,
            'changeName': 'type',
            'content': '开关机类型',
            'oldValue': '',
            'newValue': 'boot',
            'oldText': '',
            'newText': '开机',
            'finishTaskId': 141853,
            'flowId': 13,
            'flowName': '站点停开机申请',
            'createBy': 1,
            'createByName': '系统管理员',
            'createDate': '2018-10-11 13:52:30',
            'extInfo': null
          }, {
            'id': 483,
            'changeName': 'reason',
            'content': '申请原因',
            'oldValue': '',
            'newValue': 'test',
            'oldText': '',
            'newText': 'test',
            'finishTaskId': 141853,
            'flowId': 13,
            'flowName': '站点停开机申请',
            'createBy': 1,
            'createByName': '系统管理员',
            'createDate': '2018-10-11 13:52:30',
            'extInfo': null
          }, {
            'id': 484,
            'changeName': 'createByName',
            'content': '创建人',
            'oldValue': '',
            'newValue': '系统管理员',
            'oldText': '',
            'newText': '系统管理员',
            'finishTaskId': 141853,
            'flowId': 13,
            'flowName': '站点停开机申请',
            'createBy': 1,
            'createByName': '系统管理员',
            'createDate': '2018-10-11 13:52:30',
            'extInfo': null
          }, {
            'id': 485,
            'changeName': 'createDate',
            'content': '申请时间',
            'oldValue': '',
            'newValue': 'Thu Oct 11 13:52:28 CST 2018',
            'oldText': '',
            'newText': 'Thu Oct 11 13:52:28 CST 2018',
            'finishTaskId': 141853,
            'flowId': 13,
            'flowName': '站点停开机申请',
            'createBy': 1,
            'createByName': '系统管理员',
            'createDate': '2018-10-11 13:52:30',
            'extInfo': null
          }]
        }],
        'jumpNodes': [{'toNodeCode': 'di_shi_shen_he', 'isBack': false, 'toNodeName': '市级审核'}]
      }, {
        'id': 180481,
        'code': 'di_shi_shen_he',
        'nameX': '市级审核',
        'nodeType': {'text': '任务节点', 'value': 'task'},
        'chooseType': {'text': '复选', 'value': 'checkbox'},
        'acceptByType': {'text': '用户自选', 'value': 'userDefined'},
        'acceptById': '29,27',
        'acceptByName': '杜若琳,杜晖',
        'instanceId': 30092,
        'sendMsg': true,
        'showDetail': false,
        'status': {'text': '处理中', 'value': 'waited'},
        'taskType': {'text': '并行', 'value': 'manyAll'},
        'timeLimitType': {'text': '相对时间', 'value': 'relativeTime'},
        'timeLimit': '12',
        'ccBy': '29,27',
        'ccByName': '杜若琳,杜晖',
        'userScope': null,
        'userScopeId': null,
        'userScopeName': null,
        'createBy': 1,
        'createByName': '系统管理员',
        'lastUpdate': '2018-10-11 13:52:30',
        'createDate': '2018-09-13 16:18:32',
        'extInfo': null,
        'goBack': null,
        'canModify': false,
        'proTrans': [{
          'id': null,
          'nameX': '',
          'instanceId': null,
          'fromNode': 'di_shi_shen_he',
          'toNode': 'du_dao_yuan_shen_pi',
          'finishSeq': null,
          'status': null,
          'extInfo': null,
          'isBack': false
        }, {
          'id': null,
          'nameX': '不同意',
          'instanceId': null,
          'fromNode': 'di_shi_shen_he',
          'toNode': 'station_openclose_begin',
          'finishSeq': null,
          'status': null,
          'extInfo': null,
          'isBack': true
        }],
        'pftList': [],
        'jumpNodes': [{
          'toNodeCode': 'du_dao_yuan_shen_pi',
          'isBack': false,
          'toNodeName': '省中心电脑部预审'
        }, {'toNodeCode': 'station_openclose_begin', 'isBack': true, 'toNodeName': '站点停开机申请'}]
      }, {
        'id': 180482,
        'code': 'du_dao_yuan_shen_pi',
        'nameX': '省中心电脑部预审',
        'nodeType': {'text': '任务节点', 'value': 'task'},
        'chooseType': {'text': '复选', 'value': 'checkbox'},
        'acceptByType': {'text': '用户自选', 'value': 'userDefined'},
        'acceptById': '',
        'acceptByName': '',
        'instanceId': 30092,
        'sendMsg': true,
        'showDetail': false,
        'status': {'text': '待处理', 'value': 'untreated'},
        'taskType': {'text': '串行', 'value': 'manyOne'},
        'timeLimitType': {'text': '相对时间', 'value': 'relativeTime'},
        'timeLimit': '',
        'ccBy': '',
        'ccByName': '',
        'userScope': '',
        'userScopeId': null,
        'userScopeName': '',
        'createBy': null,
        'createByName': null,
        'lastUpdate': null,
        'createDate': null,
        'extInfo': null,
        'goBack': null,
        'canModify': true,
        'proTrans': [{
          'id': null,
          'nameX': '',
          'instanceId': null,
          'fromNode': 'du_dao_yuan_shen_pi',
          'toNode': 'dian_nao_piao_bu_shen_he',
          'finishSeq': null,
          'status': null,
          'extInfo': null,
          'isBack': false
        }, {
          'id': null,
          'nameX': '不同意',
          'instanceId': null,
          'fromNode': 'du_dao_yuan_shen_pi',
          'toNode': 'station_openclose_begin',
          'finishSeq': null,
          'status': null,
          'extInfo': null,
          'isBack': true
        }, {
          'id': null,
          'nameX': null,
          'instanceId': null,
          'fromNode': 'du_dao_yuan_shen_pi',
          'toNode': 'di_shi_shen_he',
          'finishSeq': null,
          'status': null,
          'extInfo': 'true',
          'isBack': true
        }],
        'pftList': [],
        'jumpNodes': [{
          'toNodeCode': 'dian_nao_piao_bu_shen_he',
          'isBack': false,
          'toNodeName': '电脑票部审核'
        }, {
          'toNodeCode': 'station_openclose_begin',
          'isBack': true,
          'toNodeName': '站点停开机申请'
        }, {'toNodeCode': 'di_shi_shen_he', 'isBack': true, 'toNodeName': '市级审核'}]
      }, {
        'id': 180483,
        'code': 'dian_nao_piao_bu_shen_he',
        'nameX': '电脑票部审核',
        'nodeType': {'text': '任务节点', 'value': 'task'},
        'chooseType': {'text': '复选', 'value': 'checkbox'},
        'acceptByType': {'text': '用户自选', 'value': 'userDefined'},
        'acceptById': '',
        'acceptByName': '',
        'instanceId': 30092,
        'sendMsg': true,
        'showDetail': false,
        'status': {'text': '待处理', 'value': 'untreated'},
        'taskType': {'text': '串行', 'value': 'manyOne'},
        'timeLimitType': {'text': '相对时间', 'value': 'relativeTime'},
        'timeLimit': '',
        'ccBy': '',
        'ccByName': '',
        'userScope': '',
        'userScopeId': null,
        'userScopeName': '',
        'createBy': null,
        'createByName': null,
        'lastUpdate': null,
        'createDate': null,
        'extInfo': null,
        'goBack': null,
        'canModify': true,
        'proTrans': [{
          'id': null,
          'nameX': '',
          'instanceId': null,
          'fromNode': 'dian_nao_piao_bu_shen_he',
          'toNode': 'station_openclose_end',
          'finishSeq': null,
          'status': null,
          'extInfo': null,
          'isBack': false
        }, {
          'id': null,
          'nameX': null,
          'instanceId': null,
          'fromNode': 'dian_nao_piao_bu_shen_he',
          'toNode': 'station_openclose_begin',
          'finishSeq': null,
          'status': null,
          'extInfo': 'true',
          'isBack': true
        }, {
          'id': null,
          'nameX': null,
          'instanceId': null,
          'fromNode': 'dian_nao_piao_bu_shen_he',
          'toNode': 'di_shi_shen_he',
          'finishSeq': null,
          'status': null,
          'extInfo': 'true',
          'isBack': true
        }, {
          'id': null,
          'nameX': null,
          'instanceId': null,
          'fromNode': 'dian_nao_piao_bu_shen_he',
          'toNode': 'du_dao_yuan_shen_pi',
          'finishSeq': null,
          'status': null,
          'extInfo': 'true',
          'isBack': true
        }],
        'pftList': [],
        'jumpNodes': [{
          'toNodeCode': 'station_openclose_end',
          'isBack': false,
          'toNodeName': '结束'
        }, {
          'toNodeCode': 'station_openclose_begin',
          'isBack': true,
          'toNodeName': '站点停开机申请'
        }, {'toNodeCode': 'di_shi_shen_he', 'isBack': true, 'toNodeName': '市级审核'}, {
          'toNodeCode': 'du_dao_yuan_shen_pi',
          'isBack': true,
          'toNodeName': '省中心电脑部预审'
        }]
      }, {
        'id': 180484,
        'code': 'station_openclose_end',
        'nameX': '结束',
        'nodeType': {'text': '结束节点', 'value': 'end'},
        'chooseType': {'text': '复选', 'value': 'checkbox'},
        'acceptByType': {'text': '用户自选', 'value': 'userDefined'},
        'acceptById': '',
        'acceptByName': '',
        'instanceId': 30092,
        'sendMsg': true,
        'showDetail': false,
        'status': {'text': '待处理', 'value': 'untreated'},
        'taskType': {'text': '串行', 'value': 'manyOne'},
        'timeLimitType': {'text': '相对时间', 'value': 'relativeTime'},
        'timeLimit': '',
        'ccBy': '',
        'ccByName': '',
        'userScope': '',
        'userScopeId': null,
        'userScopeName': '',
        'createBy': null,
        'createByName': null,
        'lastUpdate': null,
        'createDate': null,
        'extInfo': null,
        'goBack': null,
        'canModify': true,
        'proTrans': [],
        'pftList': [],
        'jumpNodes': null
      }]
    }
  },
  methods: {
    clearArea() {
      this.$refs.area.clear()
    },
    search() {
      console.log('查询', this.searchForm)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    tabClick(tab, event) {
      console.log(tab)
    }
  },
  mounted() {
    // this.res = 410403004000
    // this.showMsg('123123', 'error')
    // this.showMsg('123123', 'warning')
    // this.showMsg('123123', 'success')
    // this.showMsg('123123')
  },
  components: {Chuli}
}
</script>

<style></style>
