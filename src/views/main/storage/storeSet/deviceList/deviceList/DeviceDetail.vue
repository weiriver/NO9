<template>
  <div>
    <div v-if="typeX === 'model'">
      <DetailList :keyName="'name'" :valueName="'value'" :detailList="detailModel1"></DetailList>
      <DetailList :title="'库存信息'" :keyName="'name'" :valueName="'value'" :detailList="detailModel2"></DetailList>
      <DetailList :title="'其他'" :keyName="'name'" :valueName="'value'" :detailList="detailModel3"></DetailList>
      <h3 class="mt10 mb20">
        图片
      </h3>
      <div>
        <img class="preview_img" :src="item.showUrl"  v-for="item in picList"  :key="item.id">
      </div>
    </div>
    <div v-if="typeX === 'detail'">
      <DetailList :keyName="'name'" :valueName="'value'" :detailList="detailDetail1"></DetailList>
      <DetailList :title="'其他'" :keyName="'name'" :valueName="'value'" :detailList="detailDetail2"></DetailList>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Subindex',
    data: function () {
      return {
        typeX: 'model',
        detailModel1: [],
        detailModel2: [],
        detailModel3: [],
        detailDetail1: [],
        detailDetail2: [],
        uploadConf: {
          sysModule: 'storage',
          hostBizObj: 'st_device_version',
          hostBizId: ''
        },
        picList: []
      }
    },
    methods: {
      async getHistory() {
        const res = await this.postJson('common', {apiCode: 200005, content: this.uploadConf})
        console.log('图片信息', res.content.dataList)
        this.picList = res.content.dataList
      },
    },
    async mounted() {
      if(location.hash.includes('?')) {
        this.typeX = location.hash.split('?')[1].split('=')[1]
      }
      let id = this.$route.params.id
      console.log('id', id)
      if (id) {
        var apiCode = 501306
        if (this.typeX === 'model') {
          apiCode = 501306
          this.uploadConf.hostBizId = id
          this.getHistory()
          // this.getDeviceType()
          // this.getSupplierList()
          // this.getUnitList()
        }
        if (this.typeX === 'detail') {
          apiCode = 501105
          // this.getDeviceType()
          // this.getStoreList()
        }
        var res = await this.postJson('ws', {
          apiCode,
          content: {
            id
          }
        })
        if (res.code == 0) {
          var data = res.content
          if (this.typeX === 'model') {
            this.detailModel1 = [
              {name: '设备类型', value: data.deviceTypeName},
              {name: '型号名称', value: data.nameX},
              {name: '供应商', value: data.supplierName},
              {name: '设备状态', value: data.status ? '启用' : '停用'},
              {name: '设备单价', value: data.price},
              {name: '设备单位', value: data.unit},
              {name: '是否内置', value: this.GetTxt(data.isBuildIn)}
            ]
            this.detailModel2 = [
              {name: '预警上限', value: data.warnUpperLimit},
              {name: '预警下限', value: data.warnUpperLimit}
            ]
            this.detailModel3 = [
              {name: '厂家信息', value: data.manufacturerInformation},
              {name: '备注', value: data.remark}
            ]
          }
          if (this.typeX === 'detail') {
            this.detailDetail1 = [
              {name: '设备类型', value: data.deviceTypeName},
              {name: '型号名称', value: data.deviceVersionName},
              {name: '设备序列号', value: data.code},
              // {name: '供应商', value: data.supplierId},
              {name: '设备状态', value: data.isGood ? '正常' : '故障'},
              {name: '运行状态', value: this.GetTxt(data.runningState)},
              {name: '存放位置', value: data.warehouseName},
              {name: '设备单位', value: data.unit},
              {name: '是否内置', value: this.GetTxt(data.isBuildIn)},
              {name: '投入使用日期', value: data.useDate},
              {name: '到期日期', value: data.expireDate},
              {name: '所属区域', value: data.regionName}
            ]
            this.detailDetail2 = [
              {name: '备注', value: data.remark}
            ]
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  .preview_img {
    width: 180px;
    height: 128px;
    margin-left: 10px;
  }
</style>
