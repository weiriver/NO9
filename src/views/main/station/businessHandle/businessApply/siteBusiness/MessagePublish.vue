<template>
  <Tabs type="border-card">
    <TabPane label="业务详情">
      <Form ref="Obj" :model="Obj" :rules="ruleInline" label-width="200px">
          <h3>基本信息</h3>
          <!-- 消息标题 -->
          <FormItem prop="title" label="消息标题">
            <Input v-model="Obj.title" :maxlength='10'/>
          </FormItem>
          <!--发布渠道-->
          <FormItem prop="sendMode" label="发布渠道">
            <Select v-model="Obj.sendMode" filterable>
              <Option v-for="(mode, index) in messagePublishList" :value="mode.value" :key="index" :label="mode.text">
              </Option>
            </Select>
          </FormItem>
          <!--消息类型-->
          <FormItem prop="msgType" label="消息类型">
              <Select v-model="Obj.msgType">
              <Option v-for="(msgType, index) in $store.state.station_enumDic.msgType" :value="msgType.value"
                      :key="index" :label="msgType.text">
              </Option>
            </Select>
          </FormItem>
          <!--是否发送给管理员-->
          <FormItem prop="sendToManager" v-if="Obj.sendMode === 'app'" label="是否发送给管理员">
            <Select v-model="Obj.sendToManager" filterable>
              <Option value="true" :label="'是'"></Option>
              <Option value="false" :label="'否'"></Option>
            </Select>
          </FormItem>
          <div v-if="Obj.sendMode === 'web'">
            <h3>站内通知</h3>
            <div class="autoLayout_modify">
              <!--投注站点号-->
              <FormItem prop="userIds" label="接收用户">
                <Input id="userChose" @focus="showCheckBoxTree()" readonly :autosize="true" v-model="Obj.userName" type="textarea" :maxlength='100'/>
              </FormItem>

              <FormItem prop="msgContent" label="消息内容">
                <Input v-model="Obj.msgContent" :maxlength="5000" type="textarea" :autosize="true"/>
              </FormItem>
            </div>
          </div>
          <div v-if="Obj.sendMode === 'app'">
            <h3>APP通知</h3>
            <!--消息类型-->
            <FormItem prop="chooseStationType" label="站点选择方式">
              <Select v-model="Obj.chooseStationType" filterable>
                <Option v-for="(chooseStationType, index) in chooseStationTypeList"
                        :value="chooseStationType.value" :key="index" :label="chooseStationType.text">
                </Option>
              </Select>
            </FormItem>
            <!-- 单站发送 -->
            <div v-if="Obj.chooseStationType === 'singleStation'">
              <h3>单站发送</h3>
               <!--投注站点号-->
              <FormItem prop="stationIdsArray" label="接收站点">
                <Select
                  ref='selectSta'
                  v-model="Obj.stationIdsArray" multiple filterable remote
                  :remote-method="getStationList"
                  :loading="loadingStation" @change="setStationIds">
                  <Option v-for="(station, index) in stationList"
                          :disabled="station.station_status == 'cancel' "
                          :value="station.station_code"
                          :key="index" :label="station.station_code">
                  </Option>
                </Select>
              </FormItem>
            </div>
            <!-- 区域发送 -->
            <div v-if="Obj.chooseStationType === 'region'">
              <h3>接收区域</h3>
              <!--投注站点号-->
              <FormItem prop="regionCode" label="接收区域">
                <!--所属区域-->
                <AreaCascader ref="as" :stage="1" :select_any_level_flag="true"
                            @areaSelectResult="areaSelectResult" :res="123"></AreaCascader>
              </FormItem>
            </div>
            <!-- 站点区间 -->
            <div v-if="Obj.chooseStationType === 'stationSection'">
              <h3>接收站点区间</h3>
               <!--投注站点号-->
              <FormItem label="接收站点区间" required>
                <Input v-model="Obj.startStation" :maxlength='8' style="width:40%;"/>
                <span class="ml20 mr20">至</span>
                <Input v-model="Obj.endStation" :maxlength='8' style="width:40%;"/>
                <div class="warntxt" v-if="showStationRangeWarnTxt">{{stationRangeWarnTxt}}</div>
              </FormItem>
              <h3>站点年销量区间</h3>
              <!--投注站点号-->
              <FormItem label="站点年销量区间" required class="test">
                <Input v-model="Obj.startStationSale" :maxlength='10' style="width:40%"/>
                <span class="ml20 mr20">至</span>
                <Input v-model="Obj.endStationSale" :maxlength='10' style="width:40%"/>
                <div class="warntxt" v-if="showStationSaleRangeWarnTxt">{{stationSaleRangeWarnTxt}}</div>
              </FormItem>
            </div>
            <h4>消息内容</h4>
            <!-- app内容富文本框 -->
            <!--常识内容-->
            <FormItem prop="msgContent" label="消息内容">
              <Input v-model="Obj.msgContent"/>
            </FormItem>
          </div>
          <!--附件信息-->
          <h3>附件信息</h3>
          <FormItem label="附件信息">
            <ModalUpload @toggleModalFlag="toggleModalFlag" :api="uploadConf" :conf="conf"
                      @uploadResult="uploadResult"></ModalUpload>
          </FormItem>
          <FormItem label="处理意见">
              <Input v-model="Obj.flow.content" type="textarea" :autosize="true" placeholder="" :maxlength='100'/>
          </FormItem>
          <!--保存-->
          <FormItem>
            <Button type="ghost" class="mr20" @click="save('draft')">暂存</Button>
            <Button type="ghost" @click="reset">重置</Button>
          </FormItem>
          <FormItem>
            <Chuli :node-list="nodeList" :flowId="Obj.flowId" :nodeCode="beginNode.code"
                     @chuliConfirm="chuliConfirm" :instanceId="instanceId"
                     @vertify="checkForm" ref="chuliBtn"></Chuli>
          </FormItem>
        </Form>
        <!--选人范围和知会-->
        <Dialog :visible.sync="checkBoxTreeFlag"
               title="选择用户"
               width="568">
          <AreauserSelect ref="chooseUserModal" :checkboxFlag="true"></AreauserSelect>
          <div slot="footer" class="dialog-footer">
            <Button type="text" @click="checkBoxTreeFlag = false">取消</Button>
            <Button type="primary" @click="chooseUserIds">确定</Button>
          </div>
        </Dialog>
    </TabPane>
    <TabPane label="流程图">
      <mySteps :nodeList="nodeList"></mySteps>
    </TabPane>
  </Tabs>
</template>

<script>
import Chuli from '@/components/chuli/Chuli'
export default {
  name: 'messagePublish',
  data() {
    return {
      showStationRangeWarnTxt: false,
      stationRangeWarnTxt: '',
      showStationSaleRangeWarnTxt: false,
      stationSaleRangeWarnTxt: '',
      instanceId: JSON.parse(sessionStorage.getItem('draftFromApply')) ? JSON.parse(sessionStorage.getItem('draftFromApply')).instanceId : '',
      flowCode: '',
      uploadConf: {
        sysModule: 'flow',
        hostBizObj: 'flow_files',
        hostBizId: ''
      },
      ruleInline: {
        title: [
          {required: true, message: '消息标题不能为空', trigger: 'change'}
        ],
        sendToManager: [
          {required: true, message: '请选择是否发送给管理员', trigger: 'blur'}
        ],
        sendMode: [
          {required: true, message: '发布渠道不能为空', trigger: 'change'}
        ],
        msgType: [
          {required: true, message: '消息类型不能为空', trigger: 'change'}
        ],
        userIds: [
          {required: true, message: '接收对象不能为空', trigger: 'change'}
        ],
        msgContent: [
          {required: true, message: '消息内容能为空', trigger: 'change'}
        ],
        stationIdsArray: [
          {required: true, type: 'array', message: '接收站点不能为空', trigger: 'blur'}
        ],
        chooseStationType: [
          {required: true, message: '选择站点方式不能为空', trigger: 'change'}
        ],
        regionCode: [
          {required: true, message: '区域不能为空', trigger: 'blur'}
        ]
      }, // 校验规则
      Obj: {
        stationIdsArray: '',
        flow: {
          content: ''
        }
      },
      // 站点编号集合
      stationList: [],
      tempStationList: [],
      fromNodeCode: '',
      flowId: '',
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
        uploadUrl: ''
      },
      // 内容区域开关
      showContent: false,
      // 第一个步骤，起始节点
      beginNode: '',
      loadingStation: false,
      msgTypeList: [],
      // 选人框
      checkBoxTreeFlag: false,
      config: {
        // 可以在此处定义工具栏的内容
        toolbars: [
          ['fullscreen', 'undo', 'redo'],
          ['bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc']
        ],
        autoHeightEnabled: false,
        autoFloatEnabled: true,
        initialFrameWidth: 900,
        initialFrameHeight: 350,
        BaseUrl: '',
        UEDITOR_HOME_URL: '/static/ueditor/'
      }
    }
  },
  watch: {
    Obj: {
      handler(newVal, oldVal) {
        if (newVal.startStation && newVal.endStation) {
          if (!this.Regexp.isNumber(newVal.startStation * 1) || !this.Regexp.isNumber(newVal.endStation * 1)) {
            this.showStationRangeWarnTxt = true
            this.stationRangeWarnTxt = '请输入正整数'
          } else {
            if (newVal.startStation.length != 8) {
              this.showStationRangeWarnTxt = true
              this.stationRangeWarnTxt = '站点编号长度为8位数'
            } else if (newVal.endStation.length != 8) {
              this.showStationRangeWarnTxt = true
              this.stationRangeWarnTxt = '站点编号长度为8位数'
            } else if (newVal.startStation >= newVal.endStation) {
              this.showStationRangeWarnTxt = true
              this.stationRangeWarnTxt = '区间a-b,b的编号必须大于a'
            } else {
              this.showStationRangeWarnTxt = false
            }
          }
        } else {
          this.showStationRangeWarnTxt = true
        }
        if (newVal.startStationSale && newVal.endStationSale) {
          if (!this.Regexp.isNumber(newVal.startStationSale * 1) || !this.Regexp.isNumber(newVal.endStationSale * 1)) {
            this.showStationSaleRangeWarnTxt = true
            this.stationSaleRangeWarnTxt = '请输入正整数'
          } else if (newVal.startStationSale >= newVal.endStationSale) {
            this.showStationSaleRangeWarnTxt = true
            this.stationSaleRangeWarnTxt = '区间a-b,b必须大于a'
          } else {
            this.showStationSaleRangeWarnTxt = false
          }
        } else {
          this.showStationSaleRangeWarnTxt = true
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
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
      this.modalFlag = val
    },
    // 删除弹窗
    del() {
    },
    // vertify点击提交按钮时验证
    checkForm() {
      this.$refs['Obj'].validate((valid) => {
        console.log(this.Obj.startStation)
        if (valid && !this.showStationRangeWarnTxt && !this.stationSaleRangeWarnTxt && this.Obj.startStation && this.Obj.endStation && this.Obj.startStationSale && this.Obj.endStationSale) {
           this.$refs['chuliBtn'].showSteps()
        } else {
          this.showMsg('请输入正确的必填信息', 'error')
        }
      })
    },
    // 提交到不同业务的按钮点击结果
    chuliConfirm(val) {
      if (val.nextInfo.acceptById) {
        this.Obj.flow.acceptByName = val.nextInfo.acceptByName
        this.Obj.flow.acceptById = val.nextInfo.acceptById
      }
      this.Obj.nodeBo = val.nodeBo
      this.Obj.flow.sendMsg = val.nextInfo.sendMsg
      this.Obj.flow.toNodeCode = val.nextInfo.toNodeCode
      this.Obj.flow.toNodeName = val.nextInfo.toNodeName
      this.Obj.flow.showDetail = val.nextInfo.showDetail
      this.Obj.flow.acceptByName = val.nodeBo.acceptByName
      this.Obj.flow.acceptById = val.nodeBo.acceptById
      this.Obj.flow.acceptByType = val.nodeBo.acceptByType
      // 提交到后台
      this.save()
    },
    // 最底部按钮
    save(draft) {
      if (draft) {
        if (!this.Obj.title) {
          this.showMsg('信息标题为空不能暂存!', 'error')
          return
        }
      }
      this.Obj.flow.bizKey = ''
      this.posFlag = false
      if (this.Obj.sendMode === 'app') {
        if (!this.Obj.msgContent) {
          this.showMsg('请输入消息内容', 'error')
          return
        }
      }
      // 固定写死
      this.Obj.flow.sysModule = 'station'
      this.Obj.flow.processMode = 'web'
      if (this.Obj.chooseStationType === 'singleStation') {
        let arr = this.Obj.stationIdsArray.map(v => {
          return v.split('-')[0]
        })
        this.Obj.stationIds = arr.join(',')
        this.Obj.stationInfos = this.Obj.stationIdsArray.join(',')
      }
      if (draft) {
        this.Obj.flow.draft = true
        this.submit(true)
      } else {
        this.validate().then(res => {
          if (res) {
            this.Obj.flow.draft = false
            this.submit(false)
          }
        })
      }
    },
    submit(draft) {
      this.postJsonWithMask('common', {
        apiCode: 200079,
        content: this.Obj
      }).then(res => {
        if (res.code === '0') {
          this.showMsg(`${draft ? '暂存' : '提交'}成功`)
          this.$router.go(-1)
        }
      })
    },
    init() {
      this.Obj = {}
      if (this.$route.query.from == 'apply') {
        this.showContent = false
        const buz = JSON.parse(sessionStorage.getItem('draftFromApply'))
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
        this.getFlowInfo(flowId)
      } else {
        const buz = JSON.parse(sessionStorage.getItem('messagePublish'))
        const {id, flowName, flowCode} = buz
        this.flowCode = flowCode
        this.Obj.flowId = id
        this.Obj.flow = {}
        this.Obj.flow.bizTitle = flowName
        this.Obj.flow.flowId = id
        this.Obj.flow.agreed = true // 是否同意，默认同意
        this.Obj.flow.flowName = flowName
        this.showContent = true
        // 获取流程图
        this.getFlowInfo(id)
        // 获取通知类型
        this.getMsgTypeList()
      }
    },
    // 重置
    reset() {
      this.init()
    },
    // 校验输入的必填项和规则
    async validate() {
      var check = false
      await this.$refs['Obj'].validate((valid) => {
        if (valid) {
          check = true
        }
      })
      if (this.Obj.chooseStationType === 'stationSection' && this.showStationRangeWarnTxt) {
        this.stationRangeWarnTxt = '接收站点区间不能为空'
        check = false
      }
      if (this.Obj.chooseStationType === 'stationSection' && this.showStationRangeWarnTxt) {
        this.stationSaleRangeWarnTxt = '站点年销量区间不能为空'
        check = false
      }
      if (!check) {
        this.showMsg('请输入正确的必填信息', 'error')
      }
      return check
    },
    // 获取流程图
    getFlowInfo(flowId) {
      this.postJsonWithMask('common', {
        apiCode: 200053,
        content: {
          flowId,
          sysModule: 'station'
        }
      }).then(res => {
        const nodelist = res.content.nodeList
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
        this.uploadConf.hostBizId = `temp$${userId}$${this.flowCode}$${this.fromNodeCode}`
      })
    },
    // 获取站点类型列表
    getStationList(sCode) {
      if (sCode !== '') {
        this.loadingStation = true
        this.postJson('station', {
          apiCode: 300019,
          content: {
            searchKey: sCode
          }
        }).then(res => {
          this.loadingStation = false
          if (res.code === '0') {
            this.stationList = res.content.map(v => {
              v.station_code = `${v.station_code}-${v.status_name}-${v.name_x}`
              return v
            })
          }
        })
      }
    },
    getMsgTypeList() {
      this.msgTypeList = this.$store.state.station_enumDic.msgType
    },
    chooseUserIds() {
      this.Obj.userIds = this.$refs.chooseUserModal.userSelectCheckboxId
      this.Obj.userName = this.$refs.chooseUserModal.userSelectCheckboxName
      this.checkBoxTreeFlag = false
    },
    showCheckBoxTree(item) {
      this.checkBoxTreeFlag = true
    },
    // 选择站点
    setStationIds() {
    },
    areaSelectResult(region) {
      // this.Obj.regionCode = region.regionCode
      this.Obj.regionCode = region.value
    },
    // 获取草稿信息
    getDraftDetail(flowId, bizId, instanceId) {
      this.postJsonWithMask('common', {
        apiCode: 200112,
        content: {flowId, bizId, instanceId, showDetail: false}
      }).then(res => {
        this.Obj = Object.assign({}, this.Obj, res.content.bizObject )
        this.Obj.sendMode = this.Obj.sendMode ? this.Obj.sendMode.value : ''
        this.Obj.sendToManager = this.Obj.sendToManager? String(this.Obj.sendToManager): ''
        this.Obj.userName = this.Obj.userName
        this.Obj.chooseStationType = this.Obj.chooseStationType ? this.Obj.chooseStationType.value : ''
        setTimeout(() => {
          if (this.Obj.stationInfos) {
            let nameArr = this.Obj.stationInfos.split(',')
            this.$set(this.Obj, 'stationIdsArray', nameArr)
            this.stationList = nameArr.map((v, index) => {
              let temp = v.split('-')
              return {station_code: v, name_x: temp[2], status_name: temp[1]}
            })
          }
        }, 200)
        this.showContent = true
      })
    }
  },
  computed: {
    messagePublishList() {
      return this.$store.state['station_enumDic'].CommonEnum$msgPublishSendMode
    },
    chooseStationTypeList() {
      return this.$store.state['station_enumDic'].CommonEnum$chooseStationTypeEnum
    }
  },
  components: {
    Chuli
  },
  mounted() {
    this.init()
  }
}
</script>

<style scoped>

</style>