<template>
  <div class="inline-block">
    <div v-if="currentNode" class="inline-block">
      <div v-for="(item,index) in currentNode.jumpNodes" class="inline-block">
        <Button type="warning" @click="checkForm(item, 1)" v-if="item.isBack"
                class="mr10 mb10"
                :key="index">
          退回->{{item.toNodeName}}
        </Button>
        <Button type="primary" @click="checkForm(item, 2)" v-if="!item.isBack"
                class="mr10 mb10"
                :key="index">
          提交->{{item.toNodeName}}
        </Button>
      </div>
    </div>

    <Dialog class="upload-modal" :title="'提交到 [' + detailTitle + '] 步骤信息'" :visible.sync="stepsFlag" width="800px">
      <Form ref="Obj" :model="Obj" :inline="true" label-width="140px">
        <div v-if="detailTitle!='结束'" class="autoLayout_modify" style="width: 60%">
          <!--任务类型-->
          <FormItem label="任务类型">
            <div v-if="Obj.taskType">
              {{Obj.taskType.text}}
            </div>
          </FormItem>

          <!--处理人类型-->
          <FormItem label="处理人类型" prop="acceptByType">{{Obj.acceptByType | getTxt}}</FormItem>

          <FormItem label="区域选择" prop="acceptByName" v-if="Obj.acceptByType == 'regionLeader'">
            <AreaCascader ref="as" :stage="1" :selectstageFlag="true" :allFlag="true"
                          :disabled="true"
                          @areaSelectAllResult="areaSelectResult"></AreaCascader>
          </FormItem>

          <!--处理人-->
          <FormItem label="处理人" prop="acceptByName" v-if="Obj.acceptByType">

            <AreauserSelect
               ref="chuliren"
               :placeholder="'点击选择处理人'"
               :disabled="Obj.acceptByType.value!='userDefined'"
               :checkboxFlag="Obj.chooseType.value ==='checkbox'"
               v-if="Obj.chooseType"
               v-model="Obj.acceptByName"
               @selectResult="chulirenSelectResult"
            ></AreauserSelect>

          </FormItem>


          <!--知会-->
          <FormItem label="知会" prop="ccByName">

            <AreauserSelect
               ref="zhihuiren"
               :placeholder="'点击选择知会人'"
               v-if="Obj.chooseType"
               v-model="Obj.ccByName"
               @selectResult="zhihuirenSelectResult"
               :checkboxFlag="true"
            ></AreauserSelect>

          </FormItem>


          <!--处理时限类型-->
          <FormItem label="处理时限类型" prop="ccByName" v-if="Obj.timeLimitType">
            <Select clearable v-model="Obj.timeLimitType">
              <Option label="绝对时间" value="absoluteTime"></Option>
              <Option label="相对时间" value="relativeTime"></Option>
            </Select>
          </FormItem>


          <!--处理时限(天)-->
          <FormItem label="处理时限" prop="ccByName" v-if="Obj.timeLimitType">
            <Input
               v-model="Obj.timeLimit"
               v-if="Obj.timeLimitType === 'relativeTime' "
               placeholder="请输入天数"
            ></Input>
            <DatePicker
               style="width: 300px"
               type="date"
               v-model="Obj.timeLimit"
               placeholder="选择日期"
               @change="selDateEvent"
               value-format="yyyy-MM-dd"
               v-if="Obj.timeLimitType === 'absoluteTime'"
            ></DatePicker>
          </FormItem>


          <div class="mt12 none" style="color: #ed3f14">
            请确定[ <strong>{{detailTitle}}</strong> ]设置信息是否正确，提交后将不能修改
          </div>
        </div>
        <div v-if="detailTitle=='结束'" class="autoLayout_modify" style="width: 60%">
          <!--档案分发人-->
          <FormItem label="档案分发人" prop="acceptByName">

            <AreauserSelect
               ref="danganfenfaren"
               :placeholder="'点击选择档案分发人'"
               v-if="Obj.chooseType"
               @selectResult="danganfenfarenSelectResult"
               v-model="Obj.acceptByName"
               :checkboxFlag="Obj.chooseType.value ==='checkbox'"
            ></AreauserSelect>
          </FormItem>
          <!--查看处理情况-->
          <FormItem label="查看处理情况" prop="showDetail">
            <Select clearable v-model="Obj.showDetail">
              <Option label="是" value="true"></Option>
              <Option label="否" value="false"></Option>
            </Select>
          </FormItem>

          <!--消息提醒-->
          <FormItem label="消息提醒" prop="sendMsg">
            <Select clearable v-model="Obj.sendMsg">
              <Option label="是" value="true"></Option>
              <Option label="否" value="false"></Option>
            </Select>
          </FormItem>

        </div>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="cancelSteps">取消</Button>
        <Button type="primary" @click="confirmSubmit">确认</Button>
      </div>
    </Dialog>


  </div>
</template>

<script>


export default {
  name: 'processSet',
  props: {
    nodeCode: {
      type: String,
      default: ''
    },
    nodeList: {
      type: Array,
      default: []
    },
    flowId: {
      type: [String, Number],
      default: ''
    },
    instanceId: {
      type: [String, Number],
      default: ''
    }
  },
  computed: {
    currentNode() {
      const obj = this.nodeList.filter(v => {
        return v.code === this.nodeCode
      })[0]
      return obj
    }
  },
  data() {
    const validator = (rule, value, callback, source, options) => {
    }
    return {
      stepsFlag: false,
      // 标题
      detailTitle: '123123',
      Obj: {
        flowId: this.$route.params.id,
        modifyType: 'xml',
        syncAll: 'true',
        nodeList: [
          {
            code: '',
            sendMsg: 'true',
            chooseType: 'checkbox',
            acceptById: '', // 处理人id
            acceptByName: '', // 处理人名称name
            userScope: '', // 选人范围id
            userScopeName: '', // 选人范围名称name
            ccBy: '', // 抄送人ID
            ccByName: '', // 抄送人姓名name
            timeLimitType: 'relativeTime', // 处理时限类型
            timeLimit: '', // 处理时限
            taskType: 'manyOne' // 任务类型
          }
        ]
      },
      // 根据点击的按钮不同，动态更改目标节点的信息
      toNodeInfo: '',
      // 最后会传递到父组件的对象，用来保留改变过的信息
      emitObj: {},
      // 禁止选用处理人
      disableChuliren: false
    }
  },
  methods: {
    // 档案分发人
    danganfenfarenSelectResult(val) {
      this.emitObj.acceptByName = this.Obj.acceptByName = val.name
      this.emitObj.acceptById = this.Obj.acceptById = val.id
      this.emitObj.sendMsg = this.Obj.sendMsg
      this.emitObj.showDetail = this.Obj.showDetail
    },
    // 处理人
    chulirenSelectResult(val) {
      this.emitObj.acceptByName = this.Obj.acceptByName = val.name
      this.emitObj.acceptById = this.Obj.acceptById = val.id
    },
    zhihuirenSelectResult(val) {
      this.emitObj.ccByName = this.Obj.ccByName = val.name
      this.emitObj.ccBy = this.Obj.ccBy = val.id
    },
    // 所属区域结果
    areaSelectResult(val) {
      if (val[0]) {
        this.Obj.acceptById = val[0].value
        this.Obj.acceptByName = val[0].label
      }
    },
    // 申请日期
    selDateEvent(date) {
      this.Obj.timeLimit = date
      // 准备暴露给父组件的信息
      this.emitObj.timeLimit = date
    },
    // 检查提交表单内的内容是否符合要求
    checkForm(item, isBack) {
      this.nowItem = item
      this.nowIsBack = isBack
      this.$emit('vertify')
    },
    // 根据点击的按钮不同，动态更改目标节点的信息
    showSteps() {
      let item = this.nowItem
      let isBack = this.nowIsBack
      console.log(item)
      this.toNodeInfo = item
      this.detailTitle = item.toNodeName
      // 加载下一步步骤信息
      this.getNextStepInfo(item.toNodeCode, isBack)
    },
    // 获取下一步的信息
    getNextStepInfo(toNodeCode, isBack) {
      let isBackFlag = false
      if (isBack === 1) {
        isBackFlag = true
      } else {
        isBackFlag = false
      }
      console.log(this.flowId)
      this.postJson('common', {
        apiCode: 200114,
        content: {
          flowId: this.flowId,
          toNodeCode: toNodeCode,
          instanceId: this.instanceId,
          isBack: isBackFlag
          // flowId: 13,
          // instanceId: 30092,
          // isBack: false,
          // toNodeCode: 'du_dao_yuan_shen_pi'
        }
      }).then(res => {
        if (res.code === '0') {
          this.stepsFlag = true
          this.Obj = res.content
          this.Obj.timeLimitType = this.Obj.timeLimitType.value
          this.Obj.sendMsg = this.Obj.sendMsg + ''
          this.Obj.showDetail = this.Obj.showDetail + ''
          this.showOldFlowInfo()
          console.log(this.Obj)
        }
      })
    },
    showOldFlowInfo() {
      setTimeout(() => {
        if (this.$refs.chuliren) {
          console.log('初始化显示处理人')
          this.$refs.chuliren.setDataCheckBox(this.Obj.acceptById, this.Obj.acceptByName)
        }
        if (this.$refs.zhihuiren) {
          console.log('初始化显示知会人')
          this.$refs.zhihuiren.setDataCheckBox(this.Obj.ccBy, this.Obj.ccByName)
        }
        if (this.$refs.danganfenfaren) {
          console.log('初始化显示档案分发人')
          this.$refs.danganfenfaren.setDataCheckBox(this.Obj.acceptById, this.Obj.acceptByName)
        }
      }, 100)
    },
    // 最后提交
    confirmSubmit() {
      // this.Obj.acceptById = this.$refs.chuliren.userSelectCheckboxId
      // this.Obj.acceptByName = this.$refs.chuliren.userSelectCheckboxName
      if (this.Obj.acceptById || this.detailTitle == '结束') {
        this.stepsFlag = false
        // const merge = require('object-merge')
        let finalObj = Object.assign(this.toNodeInfo, this.emitObj)
        if (this.Obj.sendMsg) finalObj.sendMsg = this.Obj.sendMsg
        if (this.Obj.showDetail) finalObj.showDetail = this.Obj.showDetail
        var {
          code, nameX, chooseType, acceptByType, acceptById, acceptByName, sendMsg, showDetail, status, taskType, timeLimitType, timeLimit, ccBy, ccByName
        } = this.Obj
        var nodeBo = {
          code,
          nameX,
          chooseType: chooseType.value,
          acceptByType: acceptByType.value,
          acceptById,
          acceptByName,
          sendMsg,
          showDetail,
          status,
          taskType: taskType.value,
          timeLimitType,
          timeLimit,
          ccBy,
          ccByName
        }
        this.$emit('chuliConfirm', {
          nextInfo: finalObj,
          nodeBo
        })
      } else {
        if (this.Obj.acceptByType == 'regionLeader') {
          this.showMsg(`请到流程模板对该处理人进行设置`, 'warning')
        } else {
          const txt = this.detailTitle != '结束' ? '处理人' : '档案分发人'
          this.showMsg(`请选择${txt}`, 'warning')
        }
      }
    },
    // 取消提交
    cancelSteps() {
      this.stepsFlag = false
    }
  },
  watch: {},
  mounted() {
  },
  components: {},
  activated() {
  }
}
</script>

<style></style>