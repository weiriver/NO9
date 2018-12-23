<template>
  <div id="print">
    <h2 class="printTop">
      {{printTitle}}
    </h2>
    <Table stripe :data="tableData"  border style="width: 100%">
      <TableColumn type="index" label="序号"></TableColumn>
      <TableColumn :label="item.text" v-for="(item, key) in tableHeader" :key="key">
        <template slot-scope="scope">
          {{ dealData(scope.row[item.value]) }}
        </template>
      </TableColumn>
    </Table>
    <div class="printBottom" style="padding-top: 12px;">
      <!--<span>打印人：{{printMan}}</span>-->
      <span style="float: right;">打印日期：{{printDate}}</span>
    </div>
  </div>


</template>

<script>
  export default {
    name: 'print',
    data() {
      return {
        printTitle: '日志列表',
        // printMan: '系统',
        printDate: '2018-7-20',
        tableHeader: [], // 列表头
        tableData: [], // 列表数据
        count: ''
      }
    },
    methods: {
      // 处理数据
      dealData(item) {
        if (item) { // 有数据
          if (item.text) { // 有数据--带text的对象
            return item.text
          } else {
            if (item * 1 > 500000000000 && item * 1 < 3000000000000) {
              return this.ToTime(item)
            } else if (typeof item === 'boolean') {
              return '是'
            } else {
              return item
            }
          }
        } else { // 数据为空
          if (typeof item === 'boolean') {
            return '否'
          }
          return item
        }
      },
      // 登录成功，把登录状态保存到sessionstorage
      saveSession() {
        sessionStorage.setItem('login', 'login保存的')
        console.log(sessionStorage.getItem('login'))
        if (sessionStorage.getItem('login')) {
          location.href = './index.html'
        }
      }
    },
    computed: {},
    mounted() {
    },
    beforeMount() {
      let printObj = JSON.parse(sessionStorage.getItem('printObj'))
      console.log('printObj', printObj)

      // let printObj = this.$store.state.pringObj
      // this.printMan = JSON.parse(sessionStorage.getItem('login')).nameX
      this.printDate = this.ToDate(new Date())
      this.tableHeader = printObj.header
      this.tableData = printObj.data
      this.printTitle = printObj.printTitle
    }
  }
</script>

<style lang="scss">
  body {
    background: #fff !important;
  }

  #print {
    width: 95%;
    position: absolute;
    top: 0px;
    left: 0;
    right: 0;
    margin: auto;
    padding: 0 0;
    .printTop {
      text-align: center;
      font-size: 30px;
      line-height: 40px;
      padding: 10px 0;
      img {
        height: auto;
        max-width: 100%;
        vertical-align: middle;
        border: 0;
      }
    }
  }
</style>
