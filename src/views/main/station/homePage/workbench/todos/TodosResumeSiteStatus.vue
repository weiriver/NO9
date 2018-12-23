<template>
  <div>
    <!--<keep-alive>-->
    <Tabs class="_blue-header" type="border-card">
      <TabPane label="业务详情">
        <div>
          <h5>[{{Obj.stationCode}}]恢复撤站状态申请</h5>
          <Form ref="Obj" :model="Obj" label-width="200px" :rules="rules" class="Obj ruleForm">
            <div style="position: relative;">
              <FormItem label="站点编号" prop="stationCode">
                <span v-show="$route.params.id">{{Obj.stationCode}}</span>
                <!--远程搜索-->
                <Select v-show="!$route.params.id" v-model="Obj.stationCode" filterable disabled
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
              <FormItem label="业主姓名">
                <Input v-model="Obj.principal" disabled></Input>
              </FormItem>
              <FormItem label="身份证号">
                <Input v-model="Obj.idCard" disabled></Input>
              </FormItem>
              <FormItem label="手机号码">
                <Input v-model="Obj.mobile" disabled></Input>
              </FormItem>
              <FormItem label="站点地址">
                <Input v-model="Obj.address" disabled></Input>
              </FormItem>
              <FormItem label="账户余额">
                <Input v-model="Obj.account" disabled></Input>
              </FormItem>
              <FormItem label="业务标题">
                <Input v-model="Obj.title" disabled></Input>
              </FormItem>
              <div>
                <Button type="primary" @click="pingzhang" v-if="currentNodeCode=='restore_shenpi' && isShowpingzhang">平账</Button><span class="warning-text ml10">(<span>*</span>注意:只有热线账户余额为零才能打印撤机退款单!)</span>
              </div>
              <!--<Button class="btn-repos" type="primary" :disabled="!Obj.stationCode" @click=""-->
                      <!--@click="showDetail(Obj.stationCode)">站点信息</Button>-->
            </div>
            <h5>附件信息</h5>
            <!--<FormItem label="附件信息" prop="postcode">-->
              <ModalUpload class="" :api="uploadConf" :isMultiple="true">
                <div slot="warnTxt">只能上传jpg/png文件，且不超过500kb</div>
              </ModalUpload>
            <!--</FormItem>-->
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
            <FormItem label="意见内容" prop="content">
              <Input v-model="Obj.flow.content"></Input>
            </FormItem>
            <!--按钮区域-->
            <FormItem>
              <Chuli :node-list="nodeList" :flowId="Obj.flowId" :nodeCode="currentNodeCode"
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
        isShowpingzhang: true,
        detail: [],
        uploadConf: {
          sysModule: 'flow',
          hostBizObj: 'flow_files',
          hostBizId: ''
        },
        flowCode: '',
        rules: {
          stationCode: [
            {required: true, message: '站点编号不能为空', trigger: 'change'},
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
        currentNodeCode: '',
        Obj: {
          stationCode: '',
          flow: {
            content: ''
          }
        },
        options1: [],
        historyData: [],
        loading1: false,
        ruleInline: {}
      }
    },
    methods: {
      // 校验余额是否在范围内（0-2元）
      pingzhang() {
        this.postJsonWithMask('biz', {
          apiCode: 200019,
          content: {
            bizId: this.Obj.flow.bizId
          }
        }).then(res => {
          if (res.code == 0) {
            this.isShowpingzhang = false // 隐藏平账按钮
            this.showMsg('平账成功')
          }
        })
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
      getStationDetail(value) {
        this.postJson('station', {
          apiCode: 300018,
          content: {
            stationCode: value
          }
        }).then(res => {
          if (res.code === '0') {
            console.log(res.content)
            // const obj = res.content
            this.detail = res.content
          }
        })
      },
      getHotlineYuE(stationCode) {
        this.postJson('biz', {
          apiCode: 200006,
          content: {stationCode}
        }).then(res => {
          if (res.code == 0) {
            this.Obj.account = res.content
          }
        })
      },
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
            for (let key in obj) {
              if (obj[key] != null) {
                this.Obj[key] = obj[key]
              }
            }
            this.getStationDetail(this.Obj.stationCode)
            // 获取热线余额
            this.getHotlineYuE(this.Obj.stationCode)
            console.log(this.Obj)
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
      }
    },
    mounted() {
      setTimeout(() => {
        this.showContent = true
      }, 100)
      const buz = JSON.parse(sessionStorage.getItem('todosResumeSiteStatus'))
      console.log(buz)
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
    }
  }
</script>

<style lang="scss" scoped>
  .warning-text{
    font-size: 14px;
    span{
      color: red;
    }
  }
</style>
