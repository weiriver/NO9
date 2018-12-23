<template>
  <div>
    <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
    <div style="width: 150px;height: 150px;margin-top: 50px;margin-left: 165px;">
      <img style="width: 100%;height: 100%;" :src="detailImg"/>
    </div>
    <h3 class="mt10 mb20">
      奖等信息
    </h3>
    <!--表格-->
    <div slot="TableSlot">
      <Table stripe :data="awardList" border style="width: 100%">
        <TableColumn label="奖等" prop="awardLevel"></TableColumn>
        <TableColumn label="奖金" prop="awardAmount"></TableColumn>
      </Table>
    </div>
    <br/>
  </div>
</template>
<script>
  export default {
    name: 'Subindex',
    data: function () {
      return {
        detail: [],
        awardList: [],
        detailImg: ''
      }
    },
    methods: {
    },
    async mounted() {
      let id = this.$route.params.id
      var res = await this.postJson('station', {
        apiCode: 300137,
        content: {
          id
        }
      })
      this.detailImg = res.content.imgUrl
      this.detail = [
        {name: '名称', value: res.content.name},
        {name: '方案代码', value: res.content.code},
        {name: '面值', value: res.content.faceValue},
        {name: '最高奖金', value: res.content.topPrize},
        {name: '是否置顶', value: res.content.top? '是': '否'},
        {name: '是否新品', value: res.content.newProd? '是': '否'},
        {name: '是否热销', value: res.content.sellWell? '是': '否'},
        {name: '单位', value: res.content.unitName},
        {name: '箱本转换', value: res.content.boxToBook},
        {name: '本张转换', value: res.content.bookToSheet},
        {name: '简介', value: res.content.description}
      ]
      if (res.content.award) {
        let awardArray = res.content.award.split(';')
        this.awardList = []
        awardArray.forEach((e) => {
          let aw = e.split(':')
          let awOb = {
            awardLevel: aw[0],
            awardAmount: aw[1],
            awardLevelVa: true,
            awardAmountVa: true
          }
          this.awardList.push(awOb)
        })
      }
    }
  }
</script>