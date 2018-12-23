<template>
  <Tabs class="_blue-header" type="border-card" v-if="showContent">
    <TabPane label="业务详情">
      <Form :model="Obj" :rules="ruleInline" ref="Obj" label-width="200px" class="Obj ruleForm">
        <h3>
          {{Obj.title?Obj.title:'站点基本信息'}}
        </h3>

        <FormItem label="站点编号" prop="stationInfosArr">
          <Select reserve-keyword
                  v-model="Obj.stationInfosArr"
                  multiple
                  filterable
                  remote
                  :remote-method="remoteMethod"
                  :loading="loading">
            <Option v-for="(option, index) in options1"
                    :disabled="option.status == 'cancel'"
                    :key="index"
                    :value="option.value"
                    :label="option.label">
            </Option>
          </Select>
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
  name: 'ClearProof',
  components: {
    ModalUpload,
    Chuli,
    Mysteps
  },
  data() {
    return {
      instanceId: JSON.parse(sessionStorage.getItem('draftFromApply')) ? JSON.parse(sessionStorage.getItem('draftFromApply')).instanceId : '',
      flowCode: '',
      uploadConf: {
        sysModule: 'flow',
        hostBizObj: 'flow_files',
        hostBizId: ''
      },
      ruleInline: {
        stationInfosArr: [
          {required: true, type: 'array', message: '站点编号不能为空', trigger: 'blur'}
        ]
      }, // 校验规则
      Obj: {
        stationInfosArr: [],
        flow: {
          content: ''
        }
      },
      resetObj: {},
      // 流程图跳线
      nodeList: [],
      // 加载状态
      loading1: false,
      options1: [
        {
          label: '',
          value: '',
          status: ''
        }
      ],
      // 表格加载
      loading: false,
      // 上传附件基本配置
      conf: {
        // tooltips: [1, 2],
        uploadUrl: ''
      },
      // 第一个步骤，起始节点
      beginNode: '',
      showContent: false
    }
  },
  methods: {
    // 站点编号后台请求
    remoteMethod(query) {
      if (query !== '') {
        this.loading1 = true
        this.postJson('station', {
          apiCode: 300019,
          content: {
            searchKey: query
          }
        }).then(res => {
          if (res.code == 0) {
            this.loading1 = false
            this.options1 = res.content.map(v => {
              return {
                label: `${v.station_code}-${v.status_name}-${v.name_x}`,
                value: `${v.station_code}-${v.status_name}-${v.name_x}`,
                status: v.station_status
              }
            })
          }
        })
      } else {
        this.options1 = []
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
      this.Obj.stationCodesArr = []
      this.Obj.stationInfosArr.map(item => {
        this.Obj.stationCodesArr.push(item.slice(0, 8))
      })
      console.log(this.Obj.stationCodesArr)
      if (this.Obj.stationCodesArr && this.Obj.stationCodesArr.length > 0) {
        this.Obj.flow.bizKey = this.Obj.stationCodesArr.join(',')
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
      } else {
        this.showMsg('请检查/输入正确的站点编号', 'warning')
      }
    },
    submit(draft) {
      let obj = JSON.parse(JSON.stringify(this.Obj))
      obj.stationCodes = obj.stationCodesArr.join(',')
      obj.stationInfos = obj.stationInfosArr.join(',')
      delete obj.stationCodesArr
      delete obj.stationInfosArr
      this.postJsonWithMask('common', {
        apiCode: 200079,
        content: obj
      }).then(res => {
        if (res.code == 0) {
          this.showMsg(`${draft ? '暂存' : '提交'}成功`)
          this.$router.go(-1)
        }
      })
    },
    init() {
      this.showContent = false
      this.Obj = {flow: {content: ''}, stationInfosArr: []}
      if (this.$route.query.from == 'apply') {
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
        const buz = JSON.parse(sessionStorage.getItem('clearProof'))
        const {id, flowName, flowCode} = buz
        this.flowCode = flowCode
        this.Obj.flowId = id
        this.Obj.title = flowName
        this.Obj.flow = {}
        this.Obj.flow.bizTitle = flowName
        this.Obj.flow.flowId = id
        this.Obj.flow.agreed = true // 是否同意，默认同意
        this.Obj.flow.flowName = flowName
        console.log(buz)
        this.showContent = true
        // 获取流程图
        this.getFlowInfo(id)
      }
    },
    // 重置
    resetForm(formName) {
      this[formName] = {flow: {content: ''}, stationInfosArr: []}
      this.init()
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
        console.log(nodelist)
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
        this.resetObj = JSON.parse(JSON.stringify(this.Obj))
        const userId = JSON.parse(sessionStorage.getItem('login')).uid
        this.uploadConf.hostBizId = `temp$${userId}$${this.flowCode}$${this.Obj.flow.fromNodeCode}`
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
        this.Obj = Object.assign({}, this.Obj, res.content.bizObject)
        this.Obj.stationCodesArr = this.Obj.stationCodes.split(',')
        this.Obj.stationInfosArr = this.Obj.stationInfos.split(',')
        this.options1 = this.Obj.stationInfosArr.map(v => {
          return {
            label: v,
            value: v
          }
        })
        console.log(this.Obj)
        this.showContent = true
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