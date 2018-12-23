<template>
  <div>
    <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
    <DetailList :title="'库存信息'" :keyName="'name'" :valueName="'value'" :detailList="detail1"></DetailList>
    <DetailList :title="'其他'" :keyName="'name'" :valueName="'value'" :detailList="detail2"></DetailList>
  </div>
</template>

<script>
  export default {
    name: 'Subindex',
    data: function () {
      return {
        detail: [
          {name: '设施名称', value: 'stationCode'},
          {name: '设施编号', value: 'modifyCheck'},
          {name: '设施型号', value: 'oldRegionCode'},
          {name: '设施型号图片', value: 'regionCode'},
          {name: '设施单价（元）', value: 'oldRegionName'},
          {name: '设施单位', value: 'regionName'},
          {name: '供应商', value: 'oldAddress'}
        ],
        detail1: [
          {name: '预警上限', value: '信息'},
          {name: '预警下限', value: 'modifyCheck'}
        ],
        detail2: [
          {name: '厂家信息', value: 'stationCode'},
          {name: '备注', value: '名称\n' +
            'stationCode\n' +
            '设施编号\n' +
            'modifyCheck\n' +
            '设施型号\n' +
            'oldRegionCode\n' +
            '设施型号图片\n' +
            'regionCode\n' +
            '设施单价（元）\n' +
            'oldRegionName\n' +
            '设施单位\n' +
            'regionName\n' +
            '供应商\n' +
            'oldAddress\n'}
        ],
      }
    },
    methods: {
    },
    mounted() {
    }
  }
</script>

<style></style>
