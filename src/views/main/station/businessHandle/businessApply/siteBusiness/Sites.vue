<template>
  <div class="busHandle">
    <div class="busAutoLayout">
      <div class="flowItem"
           v-for="(item,index) in list"
           :key="item.id"
           v-if="item.flowName!='豫彩通变更申请' && item.flowName!='测试流程'">
        <img :src="item.imgUrl" alt="" @click="goto(item)"><br>
        <!-- {{item.flowName}} -->
      </div>
    </div>

  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {},
  data() {
    return {
      list: []
    }
  },
  methods: {
    // 跳转到相关业务
    goto(item) {
      console.log(item)
      const target = item.flowCode
      if (target == 'station_add') {
        sessionStorage.setItem('sitesAdd', JSON.stringify(item))
        this.$router.push('/businessHandle/sitesAdd')
      } else if (target == 'station_openclose') { // 站点停开机申请
        sessionStorage.setItem('sitesStopBoot', JSON.stringify(item))
        this.$router.push('/businessHandle/sitesStopBoot')
      } else if (target == 'station_restore') { // 恢复撤站状态申请
        sessionStorage.setItem('resumeSiteStatus', JSON.stringify(item))
        this.$router.push('/businessHandle/resumeSiteStatus')
      } else if (target == 'station_move') { // 迁址申请
        sessionStorage.setItem('sitesMove', JSON.stringify(item))
        this.$router.push('/businessHandle/sitesMove')
      } else if (target == 'station_recovercert') { // 站点清标申请
        sessionStorage.setItem('clearProof', JSON.stringify(item))
        this.$router.push('/businessHandle/clearProof')
      } else if (target == 'station_saleright') { // 快三销售权限管理申请
        sessionStorage.setItem('k3sale', JSON.stringify(item))
        this.$router.push('/businessHandle/k3sale')
      } else if (target == 'station_relexsale') { // '固定销售限额申请'
        sessionStorage.setItem('stationRelexSaleApply', JSON.stringify(item))
        this.$router.push('/businessHandle/stationRelexSaleApply')
      } else if (target == 'station_templimit') { // 临时销售限额申请
        sessionStorage.setItem('tempRelexSaleApply', JSON.stringify(item))
        this.$router.push('/businessHandle/tempRelexSaleApply')
      } else if (target == 'station_cancelticket') { // 站点注销票申请
        sessionStorage.setItem('stationCancelticket', JSON.stringify(item))
        this.$router.push('/businessHandle/stationCancelticket')
      } else if (target == 'station_change') { // 站点变更申请
        sessionStorage.setItem('stationChange', JSON.stringify(item))
        this.$router.push('/businessHandle/stationChange')
      } else if (target == 'message_publish') { // 消息发布
        sessionStorage.setItem('messagePublish', JSON.stringify(item))
        this.$router.push('/businessHandle/messagePublish')
      } else if (target == 'station_responsor_change') { // 站主信息变更
        sessionStorage.setItem('stationResponsorChange', JSON.stringify(item))
        this.$router.push('/businessHandle/stationResponsorChange')
      } else if (target == 'station_basic_change') { // 基本资料变更申请
        sessionStorage.setItem('sitesInfoChange', JSON.stringify(item))
        this.$router.push('/businessHandle/sitesInfoChange')
      } else if (target == 'station_repeal') { // 站点撤销申请
        sessionStorage.setItem('stationCancel', JSON.stringify(item))
        this.$router.push('/businessHandle/stationCancel')
      }
    },
    // 获取业务列表
    getList() {
      if (sessionStorage.getItem('bizList')) {
        this.list = JSON.parse(sessionStorage.getItem('bizList'))
      } else {
        this.postJson('common', {
          apiCode: 200127,
          content: {
            sysModule: 'station',
            paginated: false
          }
        }).then(res => {
          if (res.code === '0') {
            this.list = res.content.dataList
            sessionStorage.setItem('bizList', JSON.stringify(this.list))
          }
        })
      }
    }
  },
  mounted() {
    this.getList()
  }
}
</script>
<style lang="scss">
  .busHandle {
    overflow: auto;
  }

  .busAutoLayout {
    width: 100%;
    min-width: 800px;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    margin-top: 20px;
    .flowItem {
      flex: 1;
      /*height: 140px;*/
      min-width: 10%;
      max-width: 150px;
      margin: 2%;
      text-align: center;
      font-size: 13px;
      img {
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
    }
  }

</style>
