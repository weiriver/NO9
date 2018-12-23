<template>
  <Tabs class="_blue-header" type="border-card" @tab-click="tabClick">
    <TabPane label="业务详情">
      <!--基本信息-->
      <div>
        <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
      </div>

      <!--明细-->
      <div>
        <div class="content_title mt20">设备申领明细</div>
        <Table :data="detailList" border stripe height="200" style="width: 100%">
          <TableColumn label="序号" type="index" width="50"></TableColumn>
          <TableColumn label="内容">
            <template slot-scope="scope">
            <span v-if="scope.row.dversionName">
              {{scope.row.dversionName}}
            </span>
              <span v-if="scope.row.goodsName">
              {{scope.row.goodsName}}
            </span>
            </template>
          </TableColumn>
          <TableColumn label="类型">
            <template slot-scope="scope">
              {{ scope.row.goodsType | getTxt }}
            </template>
          </TableColumn>
          <TableColumn label="数量">
            <template slot-scope="scope">
              <span v-if="scope.row.amountMax">{{scope.row.amountMax+scope.row.maxUnit}}</span>
              <span v-if="scope.row.amountMin">{{scope.row.amountMin+scope.row.minUnit}}</span>
            </template>
          </TableColumn>
          <TableColumn label="单价" prop="price"></TableColumn>
          <TableColumn label="总价">
            <template slot-scope="scope">
              {{ (
              scope.row.amountMax + ( scope.row.unitValue==0 ? 0:(scope.row.amountMin / scope.row.unitValue) )
              * scope.row.price ).toFixed(2)}}
            </template>
          </TableColumn>
          <TableColumn label="备注" prop="remark"></TableColumn>
        </Table>
      </div>


      <!--处理意见-->
      <div v-if="showChuliBtns">
        <div class="content_title mt20">附件上传</div>
        <ModalUpload
           :api="uploadConf"
           :type="['jpg', 'bmp', 'png']"
        ></ModalUpload>
      </div>

      <!--处理意见-->
      <div v-if="showChuliBtns">
        <div class="content_title mt20">处理意见</div>
        <HistoryOption :historyData="historyData"></HistoryOption>
        <!--审核内容-->
        <Form :inline="true" class="mt20" label-width="140px" :model="Obj" size="mini" v-if="showChuliBtns"
              ref="Obj">
          <FormItem label="处理意见">
            <RadioGroup v-model="yijian.agreed">
              <Radio label="true">同意</Radio>
              <Radio label="false">不同意</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="意见内容">
            <Input v-model="yijian.content"></Input>
          </FormItem>
        </Form>
      </div>
      <!--处理按钮-->
      <Chuli v-if="showChuliBtns" class="mb25" :node-list="nodeList" :flowId="Obj.flowId" :nodeCode="currentNodeCode"
             @chuliConfirm="chuliConfirm" :instanceId="instanceId"></Chuli>

    </TabPane>
    <TabPane label="流程图">
      <Mysteps :nodeList='nodeList' :currentNodeCode="currentNodeCode"></Mysteps>
    </TabPane>
  </Tabs>
</template>

<script>
import HistoryOption from '@/components/historyOption/HistoryOption'
import Chuli from '@/components/chuli/Chuli'
import Mysteps from '../../../../../../components/mysteps/MySteps'

export default {
  name: 'Subindex',
  data: function () {
    return {
      yijian: {
        agreed: 'true'
      },
      historyData: [],
      detailList: [],
      nodeList: [],
      fromNodeCode: '',
      currentNodeCode: '',
      instanceId: '',
      detail: [],
      detail1: [],
      Obj: {
        flow: {
          agreed: true
        }
      },
      uploadConf: {
        sysModule: 'flow',
        hostBizObj: 'flow_files',
        hostBizId: ''
      }
    }
  },
  props: {
    showChuliBtns: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    tabClick(tab, event) {
      console.log(tab)
    },
    // 改变处理状态，并获取相关业务信息
    async getFlowDetail(flowId, bizId, waitTaskId, instanceId) {
      const res = await this.postJson('common', {
        apiCode: 200110,
        content: {flowId, bizId, waitTaskId, instanceId}
      })
      if (res.code == 0) {
        this.showMsg('数据加载成功')
        console.log('我是该流程的相关信息')
        console.log(res)
        // 构造基本详情信息
        this.buildDetailData(res.content.bizObject)
        this.historyData = res.content.finishList
        this.detailList = res.content.bizObject.detailList.map(v => {
          v.amountMax = v.amountMax ? v.amountMax : 0
          v.amountMin = v.amountMin ? v.amountMin : 0
          v.unitValue = v.unitValue ? v.unitValue : 0
          return v
        })
        console.log(this.detailList)
        this.setNodeList(res)
        this.Obj.id = res.content.bizObject.id
      }
    },
    buildDetailData(v) {
      console.log(this.flowCode)
      console.log(v)
      if (this.flowCode == 'recipients_flow') { // 领用入库申请
        this.detail = [
          {name: '业务名称', value: v.title},
          {name: '业务状态', value: v.status.text},
          {name: '创建人', value: v.createByName},
          {name: '调出仓库', value: v.fromWarehouseName},
          {name: '调入仓库', value: v.toWarehouseName},
          {name: '备注', value: v.remark}
        ]
      } else if (this.flowCode == 'loss_flow') { // 损耗申请
        this.detail = [
          {name: '业务名称', value: v.nameX},
          {name: '业务状态', value: v.status.text},
          {name: '创建人', value: v.createName},
          {name: '仓库', value: v.warehouseName},
          {name: '创建日期', value: v.createDate},
          {name: '备注', value: v.remark}
        ]
      } else if (this.flowCode == 'dispatch_flow') { // 调拨
        this.detail = [
          {name: '业务名称', value: v.title},
          {name: '业务状态', value: v.status.text},
          {name: '创建人', value: v.createByName},
          {name: '调出仓库', value: v.fromWarehouseName},
          {name: '调入仓库', value: v.toWarehouseName},
          {name: '备注', value: v.remark}
        ]
      }

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
    // 提交到不同业务的按钮点击结果
    chuliConfirm(val) {
      console.log(val)
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
    save() {
      this.Obj.flow.bizKey = this.Obj.stationCode
      this.Obj.flow.draft = 'false'
      // 固定写死
      this.Obj.flow.sysModule = 'storage'
      this.Obj.flow.processMode = 'web'
      this.Obj.flow.agreed = this.yijian.agreed
      this.Obj.flow.content = this.yijian.content
      this.postJson('common', {
        apiCode: 200111,
        content: this.Obj
      }).then(res => {
        if (res.code === '0') {
          this.showMsg('提交成功')
          this.Obj = {}
          this.Obj.flow = {}
          this.$router.go(-1)
        }
      })
    }
  },
  mounted() {
    const buz = JSON.parse(sessionStorage.getItem('todosDetail'))
    // 当前节点
    const {flowId, flowName, flowCode, bizId, instanceId, id, nodeCode, nodeName} = buz
    this.flowCode = flowCode
    this.Obj.flowId = flowId
    this.Obj.title = flowName
    this.currentNodeCode = nodeCode
    this.Obj.flow = {}
    this.Obj.flow.instanceId = instanceId
    this.Obj.nodeBo = {}
    this.Obj.nodeBo.instanceId = instanceId
    this.Obj.flow.bizId = bizId
    this.Obj.flow.waitTaskId = id
    this.Obj.flow.fromNodeCode = nodeCode
    this.Obj.flow.fromNodeName = nodeName
    this.Obj.flow.bizTitle = flowName
    this.Obj.flow.flowId = flowId
    this.Obj.flow.agreed = this.yijian.agreed = 'true'  // 是否同意，默认同意
    this.Obj.flow.flowName = flowName
    // 获取业务的内容信息（以前填写的表单）
    this.getFlowDetail(flowId, bizId, id, instanceId)
  },
  components: {Mysteps, HistoryOption, Chuli}
}
</script>

<style></style>