<template>
  <div>
    <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
  </div>
</template>

<script>
  export default {
    name: 'Subindex',
    data: function () {
      return {
        detail: []
      }
    },
    methods: {
    },
    toDownLoad () {
      // window.open(params.row.httpUrl, 'blank')
    },
    async mounted() {
      let id = this.$route.params.id
      var res = await this.postJson('station', {
        apiCode: 300095,
        content: {
          id
        }
      })
      this.detail = [
        {name: '设备型号ID', value: res.content.id},
        {name: '所属设备类型名称', value: res.content.typeName},
        {name: '设备型号名称', value: res.content.deviceModelName},
        {name: '是否内置', value: res.content.isEmbeded?'是':'否'},
        {name: '厂家信息', value: res.content.factoryInfo},
        {name: '停启用状态', value: res.content.status.text},
        {name: '备注', value: res.content.remark},
        {name: '创建人', value: res.content.createByName},
        {name: '创建时间', value: res.content.createDate},
        {name: '修改人', value: res.content.updateByName},
        {name: '修改时间', value: res.content.lastUpdate}
      ]
    }
  }
</script>

<style></style>
