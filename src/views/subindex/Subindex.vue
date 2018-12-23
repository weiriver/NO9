<template>
  <div style="background: #ffffff;">
    <!--我的备用页面-->
    <!--<a href="javascript:;" @click="toasta">点击弹出TOAST</a>-->
      <MySteps :nodeList="nodeList" :currentNodeCode="currentNodeCode"></MySteps>
    <!--<Flowchart :nodeList='nodeList' :currentNodeCode="'du_dao_yuan_shen_pi'" @itemClick='itemClick'></Flowchart>-->
  </div>
</template>

<script>
// import syncScript from '../../util/sync_script'

export default {
  name: 'Subindex',
  data: function () {
    return {
      msg: 'Welcome to moor UI!',
      color: 'red',
      // input
      input1: '',
      input2: '这是默认值',
      inputDisabled: true,
      // switch
      lightSwitch: false,
      switchLight: true,
      nodeList: [
        {
          'id': 2895,
          'code': 'station_openclose',
          'nameX': '开始',
          'proTrans': [{
            'id': null,
            'nameX': '',
            'instanceId': null,
            'fromNode': 'station_openclose',
            'toNode': 'station_openclose_begin',
            'finishSeq': null,
            'status': null,
            'extInfo': null,
            'isBack': false
          }]
        },
        {
          'id': 2896,
          'code': 'station_openclose_begin',
          'nameX': '站点停开机申请',
          'proTrans': [{
            'id': null,
            'nameX': '',
            'instanceId': null,
            'fromNode': 'station_openclose_begin',
            'toNode': 'di_shi_shen_he',
            'finishSeq': null,
            'status': null,
            'extInfo': null,
            'isBack': false
          }]
        },
        {
          'id': 2897,
          'code': 'di_shi_shen_he',
          'nameX': '市级审核',
          'proTrans': [
            {
              'id': null,
              'nameX': '',
              'instanceId': null,
              'fromNode': 'di_shi_shen_he',
              'toNode': 'du_dao_yuan_shen_pi',
              'finishSeq': null,
              'status': null,
              'extInfo': null,
              'isBack': false
            },
            {
              'id': null,
              'nameX': '不同意',
              'instanceId': null,
              'fromNode': 'di_shi_shen_he',
              'toNode': 'station_openclose_begin',
              'finishSeq': null,
              'status': null,
              'extInfo': null,
              'isBack': true
            }
          ]
        },
        {
          'id': 2898,
          'code': 'du_dao_yuan_shen_pi',
          'nameX': '省中心电脑部预审',
          'proTrans': [{
            'id': null,
            'nameX': '',
            'instanceId': null,
            'fromNode': 'du_dao_yuan_shen_pi',
            'toNode': 'dian_nao_piao_bu_shen_he',
            'finishSeq': null,
            'status': null,
            'extInfo': null,
            'isBack': false
          }, {
            'id': null,
            'nameX': '不同意',
            'instanceId': null,
            'fromNode': 'du_dao_yuan_shen_pi',
            'toNode': 'station_openclose_begin',
            'finishSeq': null,
            'status': null,
            'extInfo': null,
            'isBack': true
          }]
        },
        {
          'id': 2899,
          'code': 'dian_nao_piao_bu_shen_he',
          'nameX': '电脑票部审核',
          'proTrans': [{
            'id': null,
            'nameX': '',
            'instanceId': null,
            'fromNode': 'dian_nao_piao_bu_shen_he',
            'toNode': 'station_openclose_end',
            'finishSeq': null,
            'status': null,
            'extInfo': null,
            'isBack': false
          }]
        },
        {
          'id': 2900,
          'code': 'station_openclose_end',
          'nameX': '结束',
          'proTrans': []
        }
      ],
      currentNodeCode: 'du_dao_yuan_shen_pi'
    }
  },
  methods: {
    toasta: function () {
      this.$toast.show('你好，toast')
      // this.show()
    },
    itemClick(val) {
      console.log(val)
    }
  },
  // HelloWorld
  watch: {
    lightSwitch: newValue => console.log('开关：', newValue)
  },
  mounted() {
    // const id = 'sync_echarts'
    // const url = 'https://cdn.bootcss.com/echarts/4.0.4/echarts.min.js'
    // syncScript(id, url, fn)
    //
    // function fn() {
    //   // var echarts = require('echarts')
    //   console.log(echarts)
    // }

    // this.show('Hello,Toast')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
