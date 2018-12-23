<template>
  <div class="box_wrapper">
    <!--授权条件-->
    <DetailList :keyName="'name'" :valueName="'value'" :title="'授权条件'" :detailList="detail.conditions"></DetailList>
    <!--权限控制-->
    <DetailList :keyName="'name'" :valueName="'value'" :title="'权限控制'" :detailList="detail.control"></DetailList>
    <!--投注类参数-->
    <DetailList :keyName="'name'" :valueName="'value'" :title="'投注类参数'" :detailList="detail.params"></DetailList>
    <!--注销类参数-->
    <DetailList :keyName="'name'" :valueName="'value'" :title="'注销类参数'" :detailList="detail.cancelParams"></DetailList>
    <!--兑奖类参数-->
    <DetailList :keyName="'name'" :valueName="'value'" :title="'兑奖类参数'" :detailList="detail.rewardParams"></DetailList>
  </div>
</template>

<script>
  export default {
    name: 'dataDicEdit',
    data() {
      return {
        detail: {}
      }
    },
    methods: {
     async getInfo(id, gameId) {
       var res = await this.postJson('station', {
         apiCode: 300501,
         content: {stationId: id, gameId: gameId}
       })
       if (res.code == 0) {
         res = res.content
         this.detail = {
           conditions: [ // 授权条件
              {name: '站点编号', value: res.stationId},
              {name: '游戏名称', value: res.gameName}
           ],
           control: [ // 权限控制
              {name: '投注权限', value: res.wager.text},
              {name: '注销权限', value: res.cancel.text},
              {name: '兑奖权限', value: res.cash.text}
           ],
           params: [ // 投注类参数
              {name: '代销费率', value: res.saleCommission + '%'},
              {name: '省级发行费比率', value: res.stationProvRate},
              {name: '市级发行费比率', value: res.stationCityRate},
              {name: '中彩福利金比率', value: res.stationZCRate},
              {name: '单票最小金额', value: res.minMoneyPerTick + '元'},
              {name: '单票最大金额', value: res.maxMoneyPerTick + '元'},
              {name: '单票保护金额', value: res.protectMoney + '元'}
           ],
           cancelParams: [ // 注销类参数
              {name: '注销时间上限（秒）', value: res.cancelTimeLimit},
              {name: '期注销金额上限', value: res.issueCancelMoney + '元'},
              {name: '期注销次数上限', value: res.issueCancelTimes + '次'}
           ],
           rewardParams: [ // 兑奖类参数
              {name: '兑奖校验模式', value: res.stationCashMode},
              {name: '单票最小兑奖金额', value: res.minCashPerTick + '元'},
              {name: '单票最大兑奖金额', value: res.maxCashPerTick + '元'},
              {name: '代兑费率', value: res.cashCommission},
              {name: '最小兑奖奖等', value: res.minWinLevel},
              {name: '最大兑奖奖等', value: res.maxWinLevel}
           ]
         }
       }
      }
    },
    mounted() {
      // 路由传参
      var {id} = this.$route.params
      var {gameId} = this.$route.query
      this.getInfo(id, gameId)
    }
  }
</script>

<style lang="scss" scoped>
</style>
