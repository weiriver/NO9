<template>
  <Tabs type="border-card" v-if="showContent">
    <TabPane label="业务详情">
      <Form ref="Obj" :model="Obj" :rules="ruleInline" label-width="200px">
          <!--站点基本信息-->
          <div v-if="editableObj && Obj.stationCode">
            <h3 class="h3">{{Obj.title?Obj.title:'站点基本信息'}}</h3>
            <!--站点编号-->
            <FormItem prop="stationCode" label="站点编号">
              <span v-show="$route.params.id">{{Obj.stationCode}}</span>
              <Select style="width: 69%;" v-show="!$route.params.id" v-model="Obj.stationCode" filterable
                      :disabled="!editableObj.stationCode.editable"
                      remote
                      :remote-method="remoteMethod1"
                      placeholder="编号最少8个字"
                      :loading="loading1">
                <Option v-for="(option, index) in options1" :value="option.value" :key="index"
                        :disabled="option.status == 'cancel'" :label="option.label">
                </Option>
              </Select>
              <Button style="width: 29%;vertical-align: top;margin-left:1%;" :disabled="!Obj.stationCode" type="primary"
                      @click="showDetail(Obj.stationCode)">站点信息
              </Button>
            </FormItem>
            <!--站点状态-->
            <FormItem label="站点状态">
              <Input :value="Obj.type == null ? '' : (Obj.type=='boot'?'开机':'停机')" disabled/>
            </FormItem>
            <FormItem label="申请类型">
              <Input :value="Obj.type == null ? '' : (Obj.type=='stop'?'开机':'停机')" disabled/>
            </FormItem>
            <!--申请原因-->
            <FormItem label="申请原因">
              <Input v-model="Obj.reason" :maxlength='10' :disabled="!editableObj.reason.editable"/>
            </FormItem>
            <!--站点地址-->
            <FormItem label="站点地址">
              <Input v-model="Obj.address" :maxlength='20' :disabled="!editableObj.address.editable"/>
            </FormItem>
            <!--创建人-->
            <FormItem label="创建人">
              <Input v-model="Obj.createByName" :maxlength='10'
                          :disabled="!editableObj.createByName.editable"/>
            </FormItem>
            <!--身份证号-->
            <FormItem label="身份证号">
              <Input v-model="Obj.idCard" :maxlength='18' :disabled="!editableObj.idCard.editable"/>
            </FormItem>
            <!--手机号码-->
            <FormItem label="手机号码">
              <Input v-model="Obj.mobile" :maxlength='11' :disabled="!editableObj.mobile.editable"/>
            </FormItem>
            <!--业务标题-->
            <FormItem label="业务标题">
              <Input v-model="Obj.title" :maxlength='10' :disabled="!editableObj.title.editable"/>
            </FormItem>
            <!--业主姓名-->
            <FormItem label="业主姓名">
              <Input v-model="Obj.principal" :maxlength='10'
                          :disabled="!editableObj.principal.editable"/>
            </FormItem>
          </div>
          <!--附件信息-->
          <FormItem label="附件信息">
            <ModalUpload @toggleModalFlag="toggleModalFlag" :historyFileList="historyFileData" :api="uploadConf"
                          @uploadResult="uploadResult" :type="uploadType" :isMultiple="true">
              <div slot="warnTxt">类型：可用文件格式 txt、doc、xls、jpg、bmp、png、rar、zip、office2007 其中的一种</div>              
            </ModalUpload>
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
              <Input style="height: auto" v-model="Obj.flow.content" type="textarea" :autosize="true" placeholder="" :maxlength='100'/>
          </FormItem>
          <!--保存-->
          <FormItem>
            <Chuli :node-list="nodeList" :flowId="Obj.flowId" :nodeCode="currentNodeCode"
                    @chuliConfirm="chuliConfirm" :instanceId="instanceId"
                    @vertify="checkForm" ref="chuliBtn"></Chuli>
          </FormItem>
        </Form>
        <!--点击“站点信息”弹出框-->
        <Dialog :visible.sync="ModalFlag" title="站点基本信息" width="900" class="xiaoliang">
           <!--站点基本信息-->
          <Form ref="detail" :model="detail" :rules="ruleInline" label-width="200px">
            <FormItem label="站点编号">
                {{detail.stationCode}}
            </FormItem>
            <FormItem label="站点开机状态" v-if="detail.stationStatus">
                {{detail.stationStatus.text}}
            </FormItem>
            <FormItem label="区域编码">
                {{detail.regionCode}}
            </FormItem>
            <FormItem label="区域名称">
                {{detail.regionName}}
            </FormItem>
            <FormItem label="负责人" v-if="detail.stationMaster">
                {{detail.stationMaster.nameX}}
            </FormItem>
            <FormItem label="站点电话">
                {{detail.stationPhone}}
            </FormItem>
            <FormItem label="经营模式名">
                {{detail.operateModeName}}
            </FormItem>
            <FormItem label="建站时间">
                {{detail.setUpTime | ToTime}}
            </FormItem>
            <FormItem label="站点地址">
                {{detail.stationAddr}}
            </FormItem>
          </Form>
        </Dialog>
    </TabPane>
    <TabPane label="流程图">
      <mySteps :nodeList="nodeList" :currentNodeCode="currentNodeCode"></mySteps>
    </TabPane>
  </Tabs>
</template>

<script>
import Chuli from '@/components/chuli/Chuli'
import ModalUpload from '@/components/upload/modalUpload/ModalUpload'
export default {
  name: 'todosSitesStopBoot',
  data() {
    const validator = (rule, value, callback) => {
      this.postJson('station', {
        apiCode: 300018,
        content: {
          stationCode: value
        }
      }).then(res => {
        if (res.code === '0') {
          this.detail = res.content
          this.Obj.type = res.content.stationStatus.value
          console.log(this.Obj)
          callback()
        } else {
          this.Obj.type = ''
          callback(new Error(`站点信息加载出错,请联系技术人员`))
        }
      })
    }
    return {
      uploadType: ['txt', 'doc', 'xls', 'jpg', 'bmp', 'png', 'rar', 'zip', 'office2007'],
      instanceId: JSON.parse(sessionStorage.getItem('todosSitesStopBoot')) ? JSON.parse(sessionStorage.getItem('todosSitesStopBoot')).instanceId : '',
      spinShow: false,
      uploadConf: {
        sysModule: 'flow',
        hostBizObj: 'flow_files',
        hostBizId: ''
      },
      // 是否禁用图片修改
      isDisabled: true,
      historyFileData: [],
      // 第二个表格（可以折叠）内容信息
      stationTypeList: [], // 站点类型列表
      ruleInline: {
        stationCode: [
          {required: true, message: '站点编号不能为空', trigger: 'change'},
          {validator: validator, required: true, trigger: 'change'},
          {min: 8, message: '编号长度为8位', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '申请类型不能为空,请先选择站点编号', trigger: 'change'}
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
          {required: true, message: '是否经营快三能为空', trigger: 'change'}
        ],
        operateLuckyLottery: [
          {required: true, message: '是否经营幸运彩不能为空', trigger: 'change'}
        ],
        commissionType: [
          {required: true, message: '代销费类型不能为空', trigger: 'change'}
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
        signDate: [
          {required: true, type: 'date', message: '签约日期不能为空', trigger: 'change'}
        ],
        limitDate: [
          {required: true, type: 'date', message: '协议时限不能为空', trigger: 'change'}
        ],
        contractSn: [
          {required: true, message: '协议编号不能为空', trigger: 'blur'}
        ],
        reused: [
          {required: true, message: '是否为撤站复用不能为空', trigger: 'change'}
        ]
      }, // 校验规则
      Obj: {
        regionCode: '',
        stationCode: '',
        flow: {
          content: ''
        }
      },
      // 流程图跳线
      nodeList: [],
      // 显示/隐藏 坐标标注200005
      posFlag: false,
      // 加载状态
      loading1: false,
      options1: [],
      // 表格加载
      loading: false,
      // 显示/隐藏 上传弹窗
      modalFlag: false,
      // 上传附件基本配置
      conf: {
        uploadUrl: ''
      },
      // 空站号列表显示/隐藏
      useableStationCodeFlag: false,
      // 内容区域开关
      showContent: false,
      // 表格内容信息
      data1: [],
      // 代销费类型
      commissionType: [],
      // 编号开头，必须以该数组的其中之一为开头
      stationCodeBeginRule: [],
      // 第一个步骤，起始节点
      beginNode: '',
      ModalFlag: false,
      detail: '',
      currentNodeCode: '',
      // 可编辑对象
      editableObj: null,
      historyData: []
    }
  },
  watch: {
    Obj: {
      handler(newName, oldName) {
        console.log(newName.stationCode)
        console.log(oldName)
        // stationCodeBegin = newName.stationCode
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 点击显示站点信息详情
    showDetail(stationCode) {
      this.ModalFlag = true
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
    // 坐标标注获取结果
    posResult(result) {
      console.log(result)
      this.posFlag = false
    },
    // 显示‘上传附件’弹窗
    showModal() {
      this.modalFlag = true
    },
    // 上传结果
    uploadResult(file) {
      console.log('我是上传结果', file)
    },
    // 组件关闭modal的广波
    toggleModalFlag(val) {
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
        this.useableStationCodeFlag = false
      } else {
        this.useableStationCodeFlag = true
      }
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
       this.Obj.flow.draft = draft ? 'true' : 'false'
      // 固定写死
      this.Obj.flow.sysModule = 'station'
      this.Obj.flow.processMode = 'web'
      this.spinShow = true
      this.postJsonWithMask('common', {
        apiCode: 200111,
        content: this.Obj
      }).then(res => {
        this.spinShow = false
        if (res.code === '0') {
          this.showMsg(`${draft ? '暂存' : '提交'}成功`)
          this.$router.go(-1)
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
    // 保存
    saveBtn() {
    },
    getStationDetail(value) {
      this.postJson('station', {
        apiCode: 300018,
        content: {
          stationCode: value
        }
      }).then(res => {
        if (res.code === '0') {
          this.detail = res.content
          this.Obj.type = res.content.stationStatus.value
        } else {
          this.Obj.type = ''
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
        const list = res.content
        this.editableObj = list.filter(v => {
          return v.nodeCode == this.currentNodeCode
        })[0].fieldDetails
      })
    },
    setNodeList(res) {
      const nodelist = res.content.flowDiagram.nodeList
      this.nodeList = nodelist
      const currentNodeInfo = nodelist.filter(v => {
        return v.code == this.currentNodeCode
      })[0]
      this.fromNodeCode = nodelist[1].code
      this.uploadConf.hostBizId = `${currentNodeInfo.instanceId}$${this.flowCode}$${this.currentNodeCode}`
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
    // 改变处理状态，并获取相关业务信息
    getFlowDetail(flowId, bizId, waitTaskId, instanceId) {
      this.spinShow = true
      this.postJson('common', {
        apiCode: 200110,
        content: {flowId, bizId, waitTaskId, instanceId}
      }).then(res => {
        this.spinShow = false
        if (res.code == 0) {
          this.historyData = res.content.finishList
          this.setNodeList(res)
          this.setFlowFile(res.content.filesList)
          let obj = res.content.bizObject
          for (let key in obj) {
            if (obj[key] != null) {
              this.Obj[key] = obj[key]
              this.$set(this.Obj, key, obj[key])
            }
          }
          this.getStationDetail(this.Obj.stationCode)
        }
      })
    }
  },
  components: {
    ModalUpload,
    Chuli
  },
  mounted: function () {
    setTimeout(() => {
      this.showContent = true
    }, 100)
    const buz = JSON.parse(sessionStorage.getItem('todosSitesStopBoot'))
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
    this.Obj.stationCode = '12356789'
    // 获取可编辑字段
    this.getEdiableList(flowId)
    // 改变处理状态，并获取相关业务信息
    this.getFlowDetail(flowId, bizId, id, instanceId)
  }
}
</script>

<style scoped>

</style>