<template>
  <div>
    <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
    <DetailList :title="'库存信息'" :keyName="'name'" :valueName="'value'" :detailList="detail1"></DetailList>
    <DetailList :title="'其他'" :keyName="'name'" :valueName="'value'" :detailList="detail2"></DetailList>
    <h3 class="mt10 mb20">
      图片
    </h3>
    <div>
      <img class="preview_img" :src="item.showUrl"  v-for="item in picList"  :key="item.id">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Subindex',
    data: function () {
      return {
        uploadConf: {},
        picList: [],
        uploadConfFacilities: {
          sysModule: 'storage',
          hostBizObj: 'st_facilities',
          hostBizId: ''
        },
        uploadConfConsumables: {
          sysModule: 'storage',
          hostBizObj: 'st_goods_type',
          hostBizId: ''
        },
        supplierList: [],
        detail: [
          {name: '耗材名称', value: 'stationCode'},
          {name: '耗材编号', value: 'modifyCheck'},
          {name: '耗材型号', value: 'oldRegionCode'},
          {name: '耗材型号图片', value: 'regionCode'},
          {name: '耗材单价（元）', value: 'oldRegionName'},
          {name: '耗材单位', value: 'regionName'},
          {name: '供应商', value: 'oldAddress'}
        ],
        detail1: [
          {name: '预警上限', value: 'stationCode'},
          {name: '预警下限', value: 'modifyCheck'}
        ],
        detail2: [
          {name: '厂家信息', value: 'stationCode'},
          {name: '备注', value: '名称\n' +
            'stationCode\n' +
            '耗材编号\n' +
            'modifyCheck\n' +
            '耗材型号\n' +
            'oldRegionCode\n' +
            '耗材型号图片\n' +
            'regionCode\n' +
            '耗材单价（元）\n' +
            'oldRegionName\n' +
            '耗材单位\n' +
            'regionName\n' +
            '供应商\n' +
            'oldAddress\n'}
        ],
      }
    },
    methods: {
      getSupplierValue(id) {
        for(var i = 0; i < this.supplierList.length; i++) {
          var item = this.supplierList[i]
          if (item.id == id) {
            return item.supplierName
          }
        }
        return ''
      },
      async getSupplierList() {
        var res = await this.postJson('ws', {
          apiCode: 500013,
          content: {
            paginated: false
          }
        })
        if (res.code == 0) {
          this.supplierList = res.content.dataList
        }
      },
      async getHistory() {
        const res = await this.postJson('common', {apiCode: 200005, content: this.uploadConf})
        console.log('图片信息', res.content.dataList)
        this.picList = res.content.dataList
      },
      async initDevice() {
        await this.getSupplierList()
        console.log('initDevice init', this.supplierList)
        let id = this.$route.params.id
        var apiCode = 501005
        var res = await this.postJson('ws', {
          apiCode,
          content: {
            id
          }
        })
        if (res.code == 0) {
          var data = this.BooleanToString(res.content)
          console.log('data', data)
          if (this.typeX === 'consumables') {
            // 耗材
            this.detail = [
              {name: '耗材名称', value: data.nameX},
              {name: '耗材编号', value: data.code},
              {name: '耗材型号', value: data.extInfo},
              // {name: '耗材型号图片', value: data.nameX},
              {name: '耗材单价（元）', value: data.price},
              {name: '耗材大单位', value: data.maxUnit},
              {name: '耗材小单位', value: data.minUnit},
              {name: '大小单位转化值', value: data.unitValue},
              {name: '供应商', value: this.getSupplierValue(data.supplierId)}
            ]
            this.detail1 = [
              {name: '预警上限', value: data.warnUpperLimit},
              {name: '预警下限', value: data.warnLowerLimit}
            ]
            this.detail2 = [
              {name: '厂家信息', value: data.manufacturerInformation},
              {name: '备注', value: data.remark}
            ]
            this.uploadConfConsumables.hostBizId = id
            this.uploadConf = this.uploadConfConsumables
            this.getHistory()
          }
          if (this.typeX === 'facilities') {
            this.detail = [
              {name: '设施名称', value: data.nameX},
              {name: '设施编号', value: data.code},
              // {name: '设施型号', value: data.nameX},
              // {name: '设施型号图片', value: data.nameX},
              {name: '设施单价（元）', value: data.price},
              {name: '设施大单位', value: data.maxUnit},
              {name: '设施小单位', value: data.minUnit},
              {name: '大小单位转化值', value: data.unitValue},
              {name: '供应商', value: this.getSupplierValue(data.supplierId)}
            ]
            this.detail1 = [
              {name: '预警上限', value: data.warnUpperLimit},
              {name: '预警下限', value: data.warnLowerLimit}
            ]
            this.detail2 = [
              {name: '厂家信息', value: data.manufacturerInformation},
              {name: '备注', value: data.remark}
            ]
            this.uploadConfFacilities.hostBizId = id
            this.uploadConf = this.uploadConfFacilities
            this.getHistory()
            // 设施
          }
        }
      }
    },
    mounted() {
      this.typeX = location.hash.split('?')[1].split('=')[1]
      this.initDevice()
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
