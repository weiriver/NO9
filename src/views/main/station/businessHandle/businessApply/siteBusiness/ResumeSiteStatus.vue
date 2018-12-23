<template>
  <div>
    <!--<keep-alive>-->
      <Tabs class="_blue-header" type="border-card">
        <TabPane label="业务详情">
          <div>
            <div>恢复撤站状态申请</div>
            <Form ref="Obj" :model="Obj" label-width="200px" :rules="rules" class="Obj ruleForm">
              <div style="position: relative;">
                <FormItem label="站点编号" prop="stationCode">
                  <Input style="width: 69%;" v-show="$route.query.from === 'apply'" v-model="Obj.stationCode" disabled></Input>
                  <!--<span v-show="$route.query.from === 'apply'">{{Obj.stationCode}}</span>-->
                  <!--远程搜索-->
                  <Select style="width: 69%;" v-show="$route.query.from !== 'apply'" v-model="Obj.stationCode" filterable
                          remote
                          :remote-method="remoteMethod1"
                          @select="handleSelect"
                          placeholder="编号最少8个字"
                          :loading="loading1">
                    <Option v-for="(option, index) in options1" :value="option.value" :key="index"
                            :disabled="option.status != 'stop' " :label="option.label">
                    </Option>
                  </Select>
                </FormItem>
                <Button class="btn-repos" type="primary" :disabled="!Obj.stationCode" @click=""
                        @click="showDetail(Obj.stationCode)">站点信息</Button>
              </div>
              <FormItem label="附件信息" prop="postcode">
                <ModalUpload class="" :api="uploadConf" :isMultiple="true">
                  <div slot="warnTxt">只能上传jpg/png文件，且不超过500kb</div>
                </ModalUpload>
              </FormItem>
              <!--按钮区域-->
              <FormItem>
                <div class="mb10">
                  <Button type="primary" class="mr10 mt12" @click="save('draft')">暂存</Button>
                  <Button @click="reset" class="mr10 mt12">重置</Button>
                </div>
                <Chuli :node-list="nodeList" :flowId="Obj.flowId" :nodeCode="beginNode.code"
                       @chuliConfirm="chuliConfirm" :instanceId="instanceId"
                       @vertify="checkForm" ref="chuliBtn"></Chuli>
              </FormItem>
            </Form>
          </div>
          <div v-if="ModalFlag">
            <DetailList :title="'站点基本信息'" :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
          </div>

          <!--<Dialog :visible="ModalFlag" title="站点基本信息" :width="'60%'" class="xiaoliang" @close="closeDialog">-->
            <!--&lt;!&ndash;站点基本信息&ndash;&gt;-->
            <!--<DetailList :title="'站点基本信息'" :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>-->
            <!--&lt;!&ndash;销量概况&ndash;&gt;-->
          <!--</Dialog>-->
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
export default {
  name: 'a',
  components: {
    Mysteps, Chuli
  },
  data() {
    const validator = (rule, value, callback) => {
      if (!value) return
      console.log('vertify zhong')
      this.postJson('station', {
        apiCode: 300018,
        content: {
          stationCode: value
        }
      }).then(res => {
        if (res.code === '0') {
          let data = res.content
          this.detail = [
            {name: '站点编号', value: data.stationCode},
            {name: '站点开机状态', value: data.stationStatus.text},
            {name: '区域编码', value: data.regionCode},
            {name: '区域名称', value: data.regionName},
            {name: '负责人', value: data.stationMaster.nameX},
            {name: '站点电话', value: data.stationPhone},
            {name: '经营模式名', value: data.operateModeName},
            {name: '建站时间', value: this.ToTime(data.setUpTime)},
            {name: '站点地址', value: data.stationAddr}
          ]
          console.log(this.detail)
          callback()
        } else {
          this.Obj.type = ''
          callback(new Error(`站点信息加载出错,请联系技术人员`))
        }
      })
    }
    return {
      instanceId: JSON.parse(sessionStorage.getItem('draftFromApply')) ? JSON.parse(sessionStorage.getItem('draftFromApply')).instanceId : '',
      // 流程图跳线
      nodeList: [],
      detail: [],
      uploadConf: {
        sysModule: 'flow',
        hostBizObj: 'flow_files',
        hostBizId: ''
      },
      flowCode: '',
      rules: {
        stationCode: [
          {required: true, message: '站点编号不能为空', trigger: 'blur'},
          {min: 8, message: '编号长度为8位', trigger: 'blur'},
          {validator: validator, required: true, trigger: 'change'}
        ]
      }, // 校验规则
      // 上传附件基本配置
      conf: {
        // tooltips: [1, 2],
        uploadUrl: ''
      },
      modalFlag: false,
      ModalFlag:false,
      beginNode: '',
      Obj: {
        stationCode: '',
        flow: {
          content: ''
        }
      },
      options1: [],
      loading1: false,
      ruleInline: {}
    }
  },
  methods: {
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
    handleSelect (val) {
      console.log(val)
      console.log(this.Obj.stationCode)
    },
    showDetail () {
      this.ModalFlag = true
    },
    // 显示‘上传附件’弹窗
    showModal() {
      this.modalFlag = true
    },
    // 组件关闭modal的广波
    toggleModalFlag(val) {
      console.log(val)
      this.modalFlag = val
    },
    // 上传结果
    uploadResult(file) {
      console.log('我是上传结果', file)
    },
    // 提交到不同业务的按钮点击结果
    chuliConfirm(val) {
      console.log('chiliConfirm')
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
    // 重置
    reset() {
      // this.Obj.stationCode = ''
      this.init()
      this.detail = []
      this.ModalFlag = false
    },
    // 最底部按钮
    save(draft) {
      console.log('saving')
      this.Obj.flow.bizKey = this.Obj.stationCode
      // 固定写死
      this.Obj.flow.sysModule = 'station'
      this.Obj.flow.processMode = 'web'
      if (draft) {
        console.log('saving-draft-true')
        this.Obj.flow.draft = true
        this.submit(true)
      } else {
        // console.log('saing-draft-false')
        // this.validate().then(res => {
        //   console.log('saving-draft-validate')
        //   console.log(res)
        //   if (res) {
        this.Obj.flow.draft = false
        this.submit(false)
        //   }
        // })
      }
    },
    submit(draft) {
      console.log('submit')
      console.log(this.Obj)
      this.postJsonWithMask('common', {
        apiCode: 200079,
        content: this.Obj
      }).then(res => {
        if (res.code === '0') {
          this.showMsg(`${draft ? '暂存' : '提交'}成功`)
          this.Obj = {}
          this.Obj.flow = {}
          this.$router.go(-1)
        }
      })
    },
    // vertify点击提交按钮时验证
    checkForm() {
      console.log('form vertify')
      this.$refs['Obj'].validate((valid) => {
        if (valid) {
          this.$refs['chuliBtn'].showSteps()
        } else {
          this.showMsg('请输入正确的必填信息', 'error')
        }
      })
    },
    // 获取流程图
    getFlowInfo(flowId, intanceId) {
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
        // this.uploadConf.hostBizId = `temp$${userId}$${this.flowCode}$${this.fromNodeCode}`
        if (this.$route.query.from == 'apply') { // 如果是从我的申请过来的修改，则存在实例ID
          this.uploadConf.hostBizId = `${intanceId}$${this.flowCode}$${this.fromNodeCode}`
        } else {
          this.uploadConf.hostBizId = `temp$${userId}$${this.flowCode}$${this.fromNodeCode}`
        }
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
    // 获取草稿信息
    getDraftDetail(flowId, bizId, instanceId) {
      this.postJsonWithMask('common', {
        apiCode: 200112,
        content: {flowId, bizId, instanceId, showDetail: false}
      }).then(res => {
        console.log(res)
        // var merge = require('object-merge')
        this.$nextTick(() => {
          this.Obj = Object.assign(this.Obj, res.content.bizObject)
          console.log(this.Obj.stationCode)
        })
        this.$set(this.Obj, 'stationCode', res.content.bizObject.stationCode)
        // this.Obj.stationCode = res.content.bizObject.stationCode
        console.log(this.Obj)
        console.log(this.Obj.stationCode)
        this.showContent = true
      })
    },
    init() {
      this.Obj = {}
      if (this.$route.query.from == 'apply') {
        this.showContent = false
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
        this.getFlowInfo(flowId, id)
      } else {
        const buz = JSON.parse(sessionStorage.getItem('resumeSiteStatus'))
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
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style scoped>
.btn-repos{
  position: absolute;
  top: 0;
  right: 35%;
}
</style>
