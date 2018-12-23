<template>
  <Tabs class="_blue-header" type="border-card" v-if="showContent">
    <TabPane label="业务详情">
      <Form :model="Obj" :rules="ruleInline" ref="Obj" label-width="200px" class="Obj ruleForm">
        <h3>
          申请人信息
        </h3>
        <FormItem label="申请人姓名">
          <Input v-model="Obj.principal" disabled/>
        </FormItem>
        <FormItem label="移动电话">
          <Input v-model="Obj.mobile" disabled/>
        </FormItem>
        <FormItem label="身份证号码">
          <Input v-model="Obj.idCard" disabled/>
        </FormItem>
        <h3>
          站点基本信息
        </h3>
        <FormItem label="投注站点号" prop="stationCode">
          <Select v-model="Obj.stationCode" filterable remote :remote-method="getStationList"
                  :loading="loadingStation" @change="queryStationInfo" clearable>
            <Option v-for="(station, index) in stationList"
                    :disabled="station.station_status == 'cancel'"
                    :key="index"
                    :value="station.station_code"
                    :label="`${station.station_code}-${station.status_name}-${station.name_x}`">
            </Option>
          </Select>
        </FormItem>
        <FormItem label="原销售限额">
          <Input v-model="Obj.oldAccountLimit" disabled/>
        </FormItem>
        <FormItem label="投注站地址">
          <Input v-model="Obj.address" disabled/>
        </FormItem>
        <FormItem label="申请销售限额" prop="newAccountLimit">
          <Input v-model="Obj.newAccountLimit" :maxlength='10'/>
        </FormItem>
        <!-- 处理和附件 -->
        <FormItem label="处理意见">
          <Input type="textarea" :autosize="true" v-model="Obj.flow.content" :maxlength='100'/>
        </FormItem>
        <FormItem label="附件信息">
          <ModalUpload class="" :api="uploadConf" :isMultiple="true">
            <div slot="warnTxt">只能上传jpg/png文件，且不超过500kb</div>
          </ModalUpload>
        </FormItem>
        <FormItem>
          <Button type="primary" class="mr20 mt12" @click="save('draft')">暂存</Button>
          <Button @click="resetForm('Obj')" class="mr20 mt12">重置</Button>
          <Chuli :node-list="nodeList" :flowId="Obj.flowId" :nodeCode="beginNode.code"
                 @chuliConfirm="chuliConfirm" :instanceId="instanceId"
                 @vertify="checkForm" ref="chuliBtn"></Chuli>
        </FormItem>
      </Form>
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

export default {
  name: 'StationRelexSaleApply',
  components: {
    ModalUpload,
    Chuli,
    Mysteps
  },
  data() {
    const isMPNumber = (rule, value, callback, source, options) => {
      if (value == '-') {
        this.Obj.newAccountLimit = 0
        callback()
      } else if (this.Regexp.isMPNumber(value)) {
        this.Obj.newAccountLimit = -Math.abs(value)
        callback()
      } else {
        callback(new Error('只支持数字'))
      }
    }
    return {
      instanceId: JSON.parse(sessionStorage.getItem('draftFromApply')) ? JSON.parse(sessionStorage.getItem('draftFromApply')).instanceId : '',
      draft: false,
      flowCode: '',
      uploadConf: {
        sysModule: 'flow',
        hostBizObj: 'flow_files',
        hostBizId: ''
      },
      ruleInline: {
        stationCode: [
          {required: true, message: '站点编号不能为空', trigger: 'change'},
          {min: 8, message: '编号长度为8位', trigger: 'blur'}
        ],
        newAccountLimit: [
          {validator: isMPNumber, required: true, message: '销售限额只能输入数字', trigger: 'blur'}
        ]
      }, // 校验规则
      Obj: {flow: {content: ''}},
      // 站点编号集合
      stationList: [],
      // 流程图跳线
      nodeList: [],
      // 显示/隐藏 坐标标注200005
      posFlag: false,
      // 表格加载
      loading: false,
      // 上传附件基本配置
      conf: {
        // tooltips: [1, 2],
        uploadUrl: ''
      },
      // 内容区域开关
      showContent: false,
      // 显示隐藏的查询框
      searchBox_flag: false,
      // 第一个步骤，起始节点
      beginNode: '',
      loadingStation: false
    }
  },
  methods: {
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
    // 最底部按钮
    save(draft) {
      this.Obj.flow.bizKey = this.Obj.stationCode
      this.posFlag = false
      // 固定写死
      this.Obj.flow.sysModule = 'station'
      this.Obj.flow.processMode = 'web'
      if (draft) {
        this.Obj.flow.draft = true
        this.submit(true)
      } else {
        this.Obj.flow.draft = false
        this.submit(false)
      }
    },
    submit(draft) {
      this.postJsonWithMask('common', {
        apiCode: 200079,
        content: this.Obj
      }).then(res => {
        if (res.code === '0') {
          this.showMsg(`${draft ? '暂存' : '提交'}成功`)
          // this.Obj = {}
          // this.Obj.flow = {}
          this.$router.go(-1)
        }
      })
    },
    // 重置
    resetForm(formName) {
      this[formName] = {flow: {content: ''}}
      this.init()
    },
    init() {
      this.showContent = false
      if (this.$route.query.from == 'apply') {
        this.draft = true
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
        this.getFlowInfo(flowId)
      } else {
        this.draft = false
        this.Obj = {}
        const buz = JSON.parse(sessionStorage.getItem('stationRelexSaleApply'))
        const {id, flowName, flowCode} = buz
        this.flowCode = flowCode
        this.Obj.flowId = id
        this.Obj.title = flowName
        // this.$set(this.Obj.flow, 'content', '')
        this.Obj.flow = {}
        this.Obj.flow.bizTitle = flowName
        this.Obj.flow.flowId = id
        this.Obj.flow.agreed = true // 是否同意，默认同意
        this.Obj.flow.flowName = flowName
        this.showContent = true
        // 获取流程图
        this.getFlowInfo(id)
      }
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
        this.Obj.flow.fromNodeCode = nodelist[1].code
        this.Obj.flow.fromNodeName = nodelist[1].nameX
        this.Obj.flow.toNodeCode = nodelist[2].code
        this.Obj.flow.toNodeName = nodelist[2].nameX
        this.Obj.flow.acceptByName = nodelist[2].acceptByName
        this.Obj.flow.acceptById = nodelist[2].acceptById
        this.Obj.flow.acceptByType = nodelist[2].acceptByType.value
        const userId = JSON.parse(sessionStorage.getItem('login')).uid
        this.uploadConf.hostBizId = `temp$${userId}$${this.flowCode}$${this.Obj.flow.fromNodeCode}`
      })
    },
    // 获取站点类型列表
    getStationList(sCode) {
      this.postJson('station', {
        apiCode: 300019,
        content: {
          searchKey: sCode
        }
      }).then(res => {
        if (res.code == 0) {
          this.stationList = res.content
        } else {
          this.showMsg('请输入站点号', 'warning')
        }
      })
    },
    queryStationInfo() {
      if (!this.Obj.stationCode) {
        // return
        for (let key in this.Obj) {
          if (key !== 'stationCode') {
            this.$set(this.Obj, key, '')
          }
        }
      } else {
        this.Obj.oldAccountLimit = ''
        this.Obj.principal = ''
        this.Obj.mobile = ''
        this.Obj.idCard = ''
        this.Obj.address = ''
        this.postJson('station', {
          apiCode: 300118,
          content: {
            stationCode: this.Obj.stationCode
          }
        }).then(res => {
          if (res.code == 0) {
            let response = res.content
            console.log(response)
            // 申请人信息
            this.$set(this.Obj, 'principal', response.stationMaster ? response.stationMaster.nameX : '')
            this.$set(this.Obj, 'mobile', response.stationMaster ? response.stationMaster.mobile : '')
            this.$set(this.Obj, 'idCard', response.stationMaster ? response.stationMaster.idCard : '')
            // 站点基本信息
            this.$set(this.Obj, 'oldAccountLimit', response.stationHotline ? response.stationHotline.accountLimit : '')
            this.$set(this.Obj, 'address', response.stationAddr)
            this.$forceUpdate()
          }
        })
      }
    },
    // 获取草稿信息
    getDraftDetail(flowId, bizId, instanceId) {
      this.postJsonWithMask('common', {
        apiCode: 200112,
        content: {flowId, bizId, instanceId, showDetail: false}
      }).then(res => {
        console.log(res)
        // var merge = require('object-merge')
        this.Obj = Object.assign({}, this.Obj, res.content.bizObject)
        this.Obj.newAccountLimit = this.Obj.newAccountLimit ? this.Obj.newAccountLimit + '' : ''
        this.showContent = true
        console.log(this.Obj)
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style scoped>

</style>