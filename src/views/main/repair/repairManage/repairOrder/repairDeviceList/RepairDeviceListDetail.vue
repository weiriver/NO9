<template>
  <div>

    <div>
      <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
      <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail1"></DetailList>

    </div>


  </div>
</template>

<script>
  export default {
    name: 'Subindex',
    data: function () {
      return {
        msg: '',
        detail: [],
        detail1: []
      }
    },
    methods: {

      async getData(id) {
        var res = await this.postJson('ws', {
          apiCode: 501105,
          content: {
            id
          }
        })
        console.log('res.content', res.content)
        var data = res.content
        this.detail = [
          {name: '设备类型', value: data.deviceTypeName},
          {name: '型号名称', value: data.deviceVersionName},
          {name: '设备序列号', value: data.code},
          // {name: '供应商', value: data.supplierId},
          {name: '设备状态', value: this.GetTxt(data.status)},
          {name: '运行状态', value: this.GetTxt(data.runningState)},
          {name: '存放位置', value: data.warehouseName},
          {name: '设备单位', value: data.unit},
          {name: '是否内置', value: this.GetTxt(data.isBuildIn)},
          {name: '投入使用日期', value: this.ToDate(data.useDate)},
          {name: '到期日期', value: this.ToDate(data.expireDate)},
          {name: '所属区域', value: data.regionName}
        ]
        this.detail1 = [
          {name: '备注', value: data.remark}
        ]
      },
    },
    mounted() {
      let id = this.$route.params.id
      this.getData(id)
    }
  }
</script>

<style></style>