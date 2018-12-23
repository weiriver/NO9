<template>
  <div>
    <!--<keep-alive>-->
    <Tabs class="_blue-header" type="border-card">
      <TabPane label="业务详情">
        <div>
          <div style="font-size: 15px">迁址申请</div>
          <Form ref="Obj" :model="Obj" label-width="200px" :rules="rules" class="Obj ruleForm">
            <div style="position: relative;">
              <FormItem label="站点编号" prop="stationCode">
                <span v-show="$route.params.id">{{Obj.stationCode}}</span>
                <!--远程搜索-->
                <Select v-show="!$route.params.id" v-model="Obj.stationCode" filterable disabled
                        remote
                        :remote-method="remoteMethod1"
                        @change="handleSelect"
                        placeholder="编号最少8个字"
                        :loading="loading1">
                  <Option v-for="(option, index) in options1" :value="option.value" :key="index"
                          :disabled="option.status != 'stop' " :label="option.label">
                  </Option>
                </Select>
              </FormItem>
              <!--业主姓名-->
              <FormItem label="业主姓名" prop="principal">
                <Input v-model="Obj.principal" disabled></Input>
              </FormItem>
              <!--身份证号-->
              <FormItem label="身份证号" prop="idCard">
                <Input v-model="Obj.idCard" disabled></Input>
              </FormItem>
              <!--手机号码-->
              <FormItem label="手机号码" prop="mobile">
                <Input v-model="Obj.mobile" disabled></Input>
              </FormItem>
              <!--原区域-->
              <FormItem label="原区域" prop="oldRegionCode">
                <Input v-model="Obj.oldRegionCode" disabled></Input>
              </FormItem>
              <!--原区域名称-->
              <FormItem label="原区域名称" prop="oldRegionName">
                <Input v-model="Obj.oldRegionName" disabled></Input>
              </FormItem>
              <!--原站点地址-->
              <FormItem label="原站点地址" prop="oldAddres">
                <Input v-model="Obj.oldAddres" rows="1" :maxlength='100' type="textarea" disabled></Input>
              </FormItem>
              <!--所属区域-->
              <FormItem label="新区域" prop="newRegionCode">
                <AreaCascader ref="as" :stage="3" :select_any_level_flag="false" :show_all_levels="true"
                              :res="Obj.newRegionCode" :ruturnAllLevelResultFlag="true"
                              @sendToAreaSelect="areaSelectResult" @areaSelectAllResult="areaSelectResult_todo" v-model="Obj.newRegionCode"></AreaCascader>
              </FormItem>
              <!--现站点地址-->
              <FormItem label="现站点地址" prop="newAddress">
                <Input v-model="Obj.newAddress" type="textarea" rows="1" :maxlength='100' disabled></Input>
              </FormItem>
              <!--打印票地址-->
              <FormItem label="打印票地址" prop="printAddr">
                <Input v-model="Obj.printAddr" type="textarea" rows="1" :maxlength='100' disabled></Input>
              </FormItem>
              <!--迁址原因-->
              <FormItem label="迁址原因" prop="reason">
                <Input v-model="Obj.reason" type="textarea" rows="1" :maxlength='100' disabled></Input>
              </FormItem>
            </div>
            <h5>附件信息</h5>
            <FormItem label="附件信息" prop="postcode">
              <ModalUpload class="" :api="uploadConf" :isMultiple="true">
                <div slot="warnTxt">只能上传jpg/png文件，且不超过500kb</div>
              </ModalUpload>
            </FormItem>
            <h5>处理意见</h5>
            <div class="mb20">
              <Table :data="historyData" border height="200">
                <TableColumn label="序号" type="index" width="50"></TableColumn>
                <TableColumn label="步骤名" prop="nodeName" ></TableColumn>
                <TableColumn label="处理人" prop="acceptByName" ></TableColumn>
                <TableColumn label="下一步" prop="toNodeName" ></TableColumn>
                <TableColumn label="处理意见" prop="content" ></TableColumn>
                <TableColumn label="处理时间">
                  <template slot-scope="scope">
                    {{ToDate(scope.row.finishDate)}}
                  </template>
                </TableColumn>
              </Table>
            </div>
            <!--按钮区域-->
            <FormItem>
              <!--<Button type="primary" class="mr20 mt12" @click="save('draft')">暂存</Button>-->
              <!--<Button @click="reset" class="mr20 mt12">重置</Button>-->
              <Chuli :node-list="nodeList" :flowId="Obj.flowId" :nodeCode="currentNodeCode"
                     @chuliConfirm="chuliConfirm" :instanceId="instanceId"
                     @vertify="checkForm" ref="chuliBtn"></Chuli>
            </FormItem>
          </Form>
        </div>
      </TabPane>
      <TabPane label="流程图">
        <mySteps :nodeList="nodeList" :currentNodeCode="currentNodeCode"></mySteps>
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
        // 先判断，是否符合规则
        if (this.newFirstLevelCode !== this.firstParentCode) {
          callback(new Error(`不能跨一级区域`))
        } else {
          callback()
        }

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
        // 上传附件基本配置
        conf: {
          // tooltips: [1, 2],
          uploadUrl: ''
        },
        // 可编辑对象
        editableObj: null,
        firstParentCode: '', // 一级区域编码
        newFirstLevelCode: '', // 新一级区域编码
        resetObj: {},
        showContent: false,
        modalFlag: false,
        ModalFlag:false,
        beginNode: '',
        currentNodeCode: '',
        Obj: {
          stationCode: '',
          flow: {
            content: ''
          }
        },
        historyData: [],
        options1: [],
        loading1: false,
        rules: {
          stationCode: [
            {required: true, message: '站点编号不能为空', trigger: 'blur'}
            // {validator: validator0, required: true, trigger: 'change'}
          ],
          newRegionCode: [
            {validator: validator, required: true, trigger: 'change'}
          ],
          newAddress: [
            {required: true, message: '现站点地址不能为空', trigger: 'blur'}
          ],
          printAddr: [
            {required: true, message: '站票面地址不能为空', trigger: 'blur'}
          ],
          reason: [
            {required: true, message: '迁移原因不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 所属区域结果
      areaSelectResult(val) {
        this.newFirstLevelCode = val[0].regionCode
        if (val[2]) {
          this.Obj.newRegionCode = val[2].regionCode
          this.Obj.newRegionName = val[2].regionName
        }
      },
      areaSelectResult_todo (val) {
        this.newFirstLevelCode = val[0].value
        if (val[2]) {
          this.Obj.newRegionCode = val[2].value
          this.Obj.newRegionName = val[2].label
        }
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
      handleSelect () {
        this.postJson('station', {
          apiCode: 300018,
          content: {
            stationCode: this.Obj.stationCode
          }
        }).then(res => {
          if (res.code === '0') {
            const obj = res.content
            if (obj.stationMaster) {
              this.$set(this.Obj, 'principal', obj.stationMaster.nameX)
              this.$set(this.Obj, 'idCard', obj.stationMaster.idCard)
              this.$set(this.Obj, 'mobile', obj.stationMaster.mobile)
            }
            this.$set(this.Obj, 'oldRegionCode', obj.regionCode)
            this.$set(this.Obj, 'oldRegionName', obj.regionName)
            this.$set(this.Obj, 'oldAddres', obj.stationAddr)
            this.$set(this.Obj, 'bail', obj.bail)
            // 获取一级区域编码
            this.getFirstLevelRegionCode(obj.regionCode)
          }
        })
      },
      // 上传结果
      uploadResult(file) {
        console.log('我是上传结果', file)
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
        // console.log(this.Obj)
        this.save()
      },
      // 重置
      // reset() {
      //   // this.Obj.stationCode = ''
      //   this.init()
      // },
      // 最底部按钮
      save(draft) {
        this.Obj.flow.bizKey = this.Obj.stationCode
        // 固定写死
        this.Obj.flow.sysModule = 'station'
        this.Obj.flow.processMode = 'web'
        if (draft) {
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
      // vertify点击提交按钮时验证
      checkForm() {
        console.log(this.Obj)
        this.$refs['Obj'].validate((valid) => {
          if (valid) {
            this.$refs['chuliBtn'].showSteps()
          } else {
            this.showMsg('请输入正确的必填信息', 'error')
          }
        })
      },
      submit(draft) {
        this.postJsonWithMask('common', {
          apiCode: 200111,
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
      // 获取流程图
      getFlowInfo(flowId) {
        this.postJson('common', {
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
          this.resetObj = JSON.parse(JSON.stringify(this.Obj))
          const userId = JSON.parse(sessionStorage.getItem('login')).uid
          // this.uploadConf.hostBizId = `temp$${userId}$${this.flowCode}$${this.fromNodeCode}`
          if (this.$route.query.from == 'apply') { // 如果是从我的申请过来的修改，则存在实例ID
            this.uploadConf.hostBizId = `${intanceId}$${this.flowCode}$${this.fromNodeCode}`
          } else {
            this.uploadConf.hostBizId = `temp$${userId}$${this.flowCode}$${this.fromNodeCode}`
          }
        })
      },
      // 获取一级区域编码
      getFirstLevelRegionCode(regionCode) {
        this.postJson('account', {
          apiCode: 100030,
          content: {
            regionCode
          }
        }).then(res => {
          this.firstParentCode = res.content.firstParentCode
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
                this.$set(this.Obj, key, obj[key])
                // this.Obj[key] = obj[key]
              }
            }
            this.getStationDetail(this.Obj.stationCode)
            this.showContent = true
          }
        })
      },
      getStationDetail(value) {
        this.postJson('station', {
          apiCode: 300018,
          content: {
            stationCode: value
          }
        }).then(res => {
          if (res.code === '0') {
            const obj = res.content
            if (obj.stationMaster) {
              this.Obj.principal = obj.stationMaster.nameX
              this.Obj.idCard = obj.stationMaster.idCard
              this.Obj.mobile = obj.stationMaster.mobile
            }
            this.Obj.oldRegionCode = obj.regionCode
            this.Obj.oldRegionName = obj.regionName
            this.Obj.oldAddres = obj.stationAddr
            // 获取一级区域编码
            this.getFirstLevelRegionCode(obj.regionCode)
          } else {
          }
        })
      },
      setNodeList(res) {
        const nodelist = res.content.flowDiagram.nodeList
        this.nodeList = nodelist
        const currentNodeInfo = nodelist.filter(v => {
          return v.code == this.currentNodeCode
        })[0]
        // this.Obj.flow.acceptByName = currentNodeInfo.acceptByName
        // this.Obj.flow.acceptById = currentNodeInfo.acceptById
        // this.Obj.flow.acceptByType = currentNodeInfo.acceptByType.value
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
      }
    },
    mounted() {
      const buz = JSON.parse(sessionStorage.getItem('todosSitesMove'))
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
      // this.init(false)
    }
  }
</script>

<style scoped>
</style>
