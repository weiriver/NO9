<template>
  <Tabs type="border-card">
    <TabPane label="业务详情">
      <Form ref="Obj" :model="Obj" :rules="ruleInline" label-width="200px">
          <!--基本信息-->
          <div v-if="editableObj">
            <h3>基本信息</h3>
            <!--消息标题-->
            <FormItem prop="title" label="消息标题">
              <Input v-model="Obj.title" :maxlength='10' :disabled="!editableObj.title.editable"/>
            </FormItem>
            <!--发布渠道-->
            <FormItem prop="sendMode" label="发布渠道">
              <Select v-model="Obj.sendMode" :disabled="!editableObj.sendMode.editable">
                <Option v-for="(mode, index) in messagePublishList" :value="mode.value" :key="index">
                  {{mode.text}}
                </Option>
              </Select>
            </FormItem>
            <!--消息类型-->
            <FormItem prop="msgType" label="消息类型">
              <Select v-model="Obj.msgType" :disabled="!editableObj.msgType.editable">
                <Option v-for="(msgType, index) in $store.state.station_enumDic.msgType" :value="msgType.value"
                        :key="index">
                  {{msgType.text}}
                </Option>
              </Select>
            </FormItem>
            <FormItem prop="sendToManager" v-if="Obj.sendMode === 'app'" label="是否发送给管理员">
              <Select v-model="Obj.sendToManager" filterable :disabled="!editableObj.sendToManager.editable">
                <Option value="true">是</Option>
                <Option value="false">否</Option>
              </Select>
            </FormItem>
            <!-- 站内通知 -->
            <div v-if="Obj.sendMode === 'web'">
              <h3>站内通知</h3>
              <FormItem prop="userIds" label="接收用户">
                <Input @focus="showCheckBoxTree()" readonly :autosize="true" v-model="Obj.userName"
                            :maxlength='100'
                            type="textarea" :disabled="!editableObj.userIds.editable"/>
              </FormItem>
              <FormItem prop="msgContent" label="消息内容">
                <Input v-model="Obj.msgContent" :disabled="!editableObj.msgContent.editable" :maxlength="5000"
                            type="textarea" :autosize="true"/>
              </FormItem>
            </div>
            <!-- app通知 -->
            <div v-if="Obj.sendMode === 'app'">
              <h3>APP通知</h3>
              <FormItem prop="chooseStationType" label="站点选择方式">
                <Select v-model="Obj.chooseStationType"
                        :disabled="!editableObj.chooseStationType.editable">
                  <Option v-for="(chooseStationType, index) in chooseStationTypeList"
                          :value="chooseStationType.value" :key="index">{{chooseStationType.text}}
                  </Option>
                </Select>
              </FormItem>
              <!-- 单站发送 -->
              <div v-if="Obj.chooseStationType === 'singleStation'">
                <h3>单站发送</h3>
                <FormItem prop="stationIdsArray" label="接收站点">
                     <Select
                        v-model="Obj.stationIdsArray" multiple filterable remote
                        :remote-method="getStationList"
                        :loading="loadingStation" @on-change="setStationIds"
                        :disabled="!editableObj.stationIds.editable"
                        style="text-indent: 0;">
                        <Option v-for="(station, index) in stationList"
                                :disabled="station.station_status == 'cancel' " :value="station.station_code"
                                :key="index">
                          {{station.station_code}}-{{station.status_name}}-{{station.name_x}}
                        </Option>
                      </Select>
                  </FormItem>
              </div>

              <!-- 区域发送 -->
              <div v-if="Obj.chooseStationType === 'region'">
                <FormItem prop="regionCode" label="接收区域">
                     <AreaCascader ref="as" :stage="1" :isRequired="true" :selectstageFlag="true"
                                      :allFlag="true"
                                      :res="Obj.regionCode"
                                      :addNew="false" @areaSelectResult="areaSelectResult"
                                      :disabled="!editableObj.regionCode.editable"></AreaCascader>
                  </FormItem>
              </div>

              <!-- 站点区间 -->
              <div v-if="Obj.chooseStationType === 'stationSection'">
                <h3>接收站点区间</h3>
                <FormItem label="接收站点区间" required>
                    <Input v-model="Obj.startStation" style="width:40%" :maxlength='10'
                              :disabled="!editableObj.startStation.editable"/>
                    <span style="margin-left:20px">至</span>
                    <Input v-model="Obj.endStation" style="width:40%;margin-left:2px" :maxlength='10'
                            :disabled="!editableObj.endStation.editable"/>
                </FormItem>

                <h3>站点年销量区间</h3>
                <FormItem label="站点年销量区间" required class="test">
                  <Input v-model="Obj.startStationSale" style="width:40%" :maxlength='10'
                              :disabled="!editableObj.startStationSale.editable"/>
                  <span style="margin-left:20px">至</span>
                  <Input v-model="Obj.endStationSale" style="width:40%;margin-left:2px" :maxlength='10'
                          :disabled="!editableObj.endStationSale.editable"/>
                </FormItem>
              </div>
            </div>
            <div v-show="Obj.sendMode === 'app'">
              <h4>消息内容</h4>
              <FormItem prop="msgContent" label="消息内容">
                <Input v-model="Obj.msgContent" :disabled="!editableObj.startStationSale.editable"/>
              </FormItem>
              <!-- app内容富文本框 -->
            </div>
          </div>
          <!--附件信息-->
          <h3>附件信息</h3>
          <FormItem label="附件信息">
            <ModalUpload @toggleModalFlag="toggleModalFlag" :historyFileList="historyFileData" :ajaxConf="uploadConf"
                          @uploadResult="uploadResult" :isQueryHis="true"></ModalUpload>
          </FormItem>
          <!--处理意见-->
          <h3>处理意见</h3>
          <Table stripe :data="historyData" :height="200" border style="width: 100%" ref="history">
            <TableColumn type="expand">
               <template slot-scope="scope">
                 <span class="expand-key">意见: </span>
                 <span class="expand-value">{{scope.row.changeThing? scope.row.changeThing:'--'}}</span>
               </template>
            </TableColumn>
            <TableColumn label="序号" width="50" type="index" align="center"></TableColumn>
            <TableColumn label="步骤名" prop="nodeName" width="130"></TableColumn>
            <TableColumn label="处理人" prop="acceptByName" minWidth="100"></TableColumn>
            <TableColumn label="下一步" prop="toNodeName" width="130"></TableColumn>
            <TableColumn label="处理意见" prop="content" minWidth="200"></TableColumn>
            <TableColumn label="处理时间" prop="finishDate" width="110">
              <template slot-scope="scope">
                {{ scope.row.finishDate | ToDate }}
              </template>
            </TableColumn>
          </Table>
          <FormItem label="意见内容" class="mt10">
             <Input style="height: auto" v-model="Obj.flow.content"
                          type="textarea" :autosize="true" placeholder="" :maxlength='100'/>
          </FormItem>
          <!--保存-->
          <FormItem>
            <Chuli :node-list="nodeList" :flowId="Obj.flowId" :nodeCode="currentNodeCode"
                     @chuliConfirm="chuliConfirm" :instanceId="instanceId"
                     @vertify="checkForm" ref="chuliBtn"></Chuli>
          </FormItem>
        </Form>
    </TabPane>
    <TabPane label="流程图">
      <mySteps :nodeList="nodeList"></mySteps>
    </TabPane>
  </Tabs>
</template>

<script>
import Chuli from '@/components/chuli/Chuli'
export default {
  name: 'todosMessagePublish',
  data() {
    return {
      instanceId: JSON.parse(sessionStorage.getItem('todosMessagePublish')) ? JSON.parse(sessionStorage.getItem('todosMessagePublish')).instanceId : '',
      spinShow: false,
      // 第一个步骤，起始节点
      currentNodeCode: '',
      uploadConf: {
        sysModule: 'flow',
        hostBizObj: 'flow_files',
        hostBizId: ''
      },
      // 是否禁用图片修改
      isDisabled: true,
      historyFileData: [],
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
          {required: true, message: '接收对象能为空', trigger: 'change'}
        ],
        msgContent: [
          {required: true, message: '消息内容能为空', trigger: 'change'}
        ],
        stationIdsArray: [
          {required: true, type: 'array', message: '接收站点不能为空', trigger: 'change'}
        ],
        chooseStationType: [
          {required: true, message: '选择站点方式不能为空', trigger: 'change'}
        ],
        regionCode: [
          {required: true, message: '区域不能为空', trigger: 'change'}
        ]
      }, // 校验规则
      Obj: {},
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
      // 第一个步骤，起始节点
      beginNode: '',
      loadingStation: false,
      msgTypeList: [],
      // 选人框
      checkBoxTreeFlag: false,
      config: {
        // 可以在此处定义工具栏的内容
        toolbars: [
          ['fullscreen', 'source', 'undo', 'redo', 'insertimage', 'formatmatch', 'edittable', 'inserttable', 'insertrow', 'insertcol', 'mergeright', 'mergedown', 'deleterow', 'deletecol', 'splittorows', 'splittocols', 'splittocells', 'deletecaption', 'inserttitle', 'mergecells', 'deletetable', 'insertparagraphbeforetable'],
          ['bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc']
        ],
        autoHeightEnabled: false,
        autoFloatEnabled: true,
        initialFrameWidth: 900,
        initialFrameHeight: 350,
        BaseUrl: '',
        UEDITOR_HOME_URL: '/static/ueditor/'
      },
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
          key: 'nodeName'
        },
        {
          title: '处理人',
          key: 'acceptByName'
        },
        {
          title: '下一步',
          key: 'toNodeName'
        },
        {
          title: '处理意见',
          key: 'content'
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
  methods: {
    // 高拍仪获取到的 “票面图片” base64字符串
    personalImg(val) {
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
      console.log(this.Obj)
      // 提交到后台
      this.save()
    },
    // 最底部按钮
    save(draft) {
      this.Obj.flow.bizKey = ''
      this.posFlag = false
      if (this.Obj.sendMode === 'app') {
        // ben注释
        // let ueContent = this.$refs.ueditor.getContent()
        // if (!ueContent) {
        //   this.showMsg('请输入消息内容', 'error')
        //   return
        // }
        if (!this.Obj.msgContent) {
          this.showMsg('请输入消息内容', 'error')
          return
        }
        // this.Obj.msgContent = ueContent
      }
      this.validate().then(res => {
        if (res) {
          // 设置alreadyRead的值boolean
          this.Obj.alreadyRead = this.Obj.alreadyRead === 'true'

          this.Obj.flow.draft = draft ? 'true' : 'false'
          // 固定写死
          this.Obj.flow.sysModule = 'station'
          this.Obj.flow.processMode = 'web'
          this.spinShow = true
          this.postJson('common', {
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
        } else {
          this.showMsg('请输入正确的必填信息', 'error')
          check = false
        }
      })
      return check
    },
    // 获取站点类型列表
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
        if (this.editableObj.msgContent) {
          this.config.readonly = true
        }
        console.log(this.editableObj)
      })
    },
    getMsgTypeList() {
      // this.postJson({
      //   apiCode: 200031,
      //   content: {
      //     sysModule: 'station',
      //     nameX: '',
      //     typeX: 'msgType', // 消息类型
      //     paginated: false
      //   }
      // }).then(res => {
      //   this.msgTypeList = res.content.dataList
      // })
      this.msgTypeList = this.$store.state.station_enumDic.msgType
    },
    chooseUserIds() {
      this.Obj.userIds = this.$refs.duoxuan.userSelectCheckboxId
      this.Obj.userName = this.$refs.duoxuan.userSelectCheckboxName
      console.log(this.Obj.userIds)
      console.log(this.Obj.userName)
    },
    showCheckBoxTree(item) {
      this.$refs.duoxuan.setDataCheckBox(this.Obj.userIds)
      this.checkBoxTreeFlag = true
    },
    // 选择站点
    setStationIds() {
      // this.Obj.stationIds = this.Obj.stationIdsArray.join()
    },
    areaSelectResult(region) {
      this.Obj.regionCode = region.regionCode
    },
    // 改变处理状态，并获取相关业务信息
    getFlowDetail(flowId, bizId, waitTaskId, instanceId) {
      this.spinShow = true
      this.postJson('common', {
        apiCode: 200110,
        content: {flowId, bizId, waitTaskId, instanceId}
      }).then(res => {
        this.spinShow = false
        if (res.code == 0) {
          // this.showMsg('数据加载成功')
          console.log('我是该流程的相关信息')
          console.log(res)
          this.historyData = res.content.finishList
          this.setNodeList(res)
          this.setFlowFile(res.content.filesList)
          let obj = res.content.bizObject
          console.log(obj)
          // 设置sendMode 必选项
          this.Obj.sendMode = obj['sendMode'].value
          let selectKey = ['chooseStationType', 'sendMode']
          for (let key in obj) {
            if (obj[key] != null) {
              if (selectKey.indexOf(key) != -1) {
                this.Obj[key] = obj[key].value
              } else if (key === 'stationIds') {
                // let chooseArray = obj[key].split(',')
                // this.stationList.push({station_code: chooseArray[0], name_x: '夏侯贵'})
                // this.stationList.push({station_code: chooseArray[1], name_x: '夏侯贵'})
                // this.stationList.push({station_code: chooseArray[2], name_x: '夏侯贵'})
                // this.stationList.push({station_code: chooseArray[3], name_x: '夏侯贵'})
                // this.Obj['stationIdsArray'] = chooseArray
                setTimeout(() => {
                  let nameArr = obj.stationInfos.split(',')
                  this.$set(this.Obj, 'stationIdsArray', nameArr)
                  this.stationList = nameArr.map((v, index) => {
                    let temp = v.split('-')
                    return {station_code: v, name_x: temp[2], status_name: temp[1]}
                  })
                }, 200)
                // this.Obj['stationIds'] = obj[key]
                // if (this.Obj.stationIdsArray.length > 0) {
                // this.getStationList(this.Obj.stationIdsArray[0].slice(0, 2))
                // }
              } else if (key === 'msgContent' && this.Obj.sendMode === 'app') {
                // 设置ue内容
                // ben注释
                // let _this = this
                // setTimeout(() => {
                //   _this.$refs.ueditor.setContentWhenReady(obj[key])
                // }, 2000)
                // _this.$refs.ueditor.setContentWhenReady(obj[key])
                // setTimeout(function () {
                //   let ue = _this.$refs.ueditor
                //   console.log(ue)
                //   ue.setContent(obj[key])
                // }, 1000)
                this.Obj.msgContent = obj.msgContent
              } else {
                this.Obj[key] = (obj[key] + '')
              }
            }
          }
          this.$refs.duoxuan.setDataCheckBox(this.Obj.userIds)
          this.Obj.userName = this.$refs.duoxuan.userSelectCheckboxName
        }
      })
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
      this.uploadConf.hostBizId = `${currentNodeInfo.instanceId}$${this.flowCode}$${this.currentNodeCode}`
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
  mounted: function () {
    setTimeout(() => {
      this.showContent = true
    }, 100)
    const buz = JSON.parse(sessionStorage.getItem('todosMessagePublish'))
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
    // 获取通知类型
    this.getMsgTypeList()
  }
}
</script>

<style scoped>

</style>