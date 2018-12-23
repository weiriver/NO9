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
        tableHeight: '200',
        confirmSearch: {
          page: 1
        },
        detail: [],
        detail1: []
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
        apiCode: 300075,
        content: {
          id
        }
      })
      this.detail = [
        {name: '设备编号', value: res.content.deviceCode},
        {name: '所属站点编号', value: res.content.stationCode},
        {name: '设备名称', value: res.content.nameX},
        {name: '所属类型名称', value: res.content.typeX},
        {name: '所属型号名称', value: res.content.modelName},
        {name: '区域名称', value: res.content.regionName},
        {name: '设备存放位置', value: res.content.deviceLocation ? res.content.deviceLocation.text : ''},
        {name: '设备状态', value: res.content.deviceStatus ? res.content.deviceStatus.text : ''},
        {name: '设备运行状态', value: res.content.deviceRunStatus ? res.content.deviceRunStatus.text : ''},
        {name: '价格', value: res.content.price},
        {name: '押金', value: res.content.deviceBail},
        {name: '扩展信息', value: res.content.extInfo},
        {name: '创建人', value: res.content.createByName},
        {name: '创建时间', value: res.content.createDate},
        {name: '修改人', value: res.content.updateByName},
        {name: '修改时间', value: res.content.lastUpdate}
      ]
    }
  }
</script>

<style></style>
