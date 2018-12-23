

<template>
  <div>

    <Tabs class="_blue-header" type="border-card" v-model="typeX" @tab-click="tabClick">

      <TabPane label="入库业务信息" name="detail">
        <DetailList :title="'业务信息'" :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
      </TabPane>
      <TabPane label="流程图预览" name="flow">
          <MySteps :nodeList="nodeList" :currentNodeCode="currentNodeCode"></MySteps>
      </TabPane>
    </Tabs>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        typeX: 'detail',
        detail: [],
        nodeList: [],
        currentNodeCode: ''
      }
    },
    computed: {
    },
    methods: {
      async getFlow(id) {
        if(!id){
          return;
        }
        var res = await this.postJson('', {
          apiCode: 200126,
          content: {
            instanceId: id
          }
        })
        if (res.code == 0) {
          this.nodeList = res.content.flowDiagram.nodeList
          this.currentNodeCode = this.nodeList[this.nodeList.length-1].code
        }
      },

      async init(id) {
        var res = await this.postJson('ws', {
          apiCode: 501406,
          content: {
            id
          }
        })
        if (res.code == 0) {
          console.log('数据返回', res.content)
          var data = res.content.stInventoryBiz.content
          this.detail = [
            {
              name: '业务标题', value: data.title
            },
            {
              name: '入库仓库', value: data.toWarehouseName
            },
            {
              name: '申请内容', value: data.remark
            },
          ]
          this.getFlow(data.flowId)
        }
      },
      tabClick(tab, event) {
      }
    },
    watch: {
    },
    mounted: async function () {
      this.typeX = 'detail'
      let id = this.$route.params.id
      this.init(id)

    }
  }
</script>

<style></style>
