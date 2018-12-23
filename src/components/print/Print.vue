<template>
  <!--<div style="float: left;" class="print-div">-->
  <div class="print-div">
    <!--<Dropdown @command="dropdownEvent" placement="bottom-start" trigger="click">-->
    <!--<Button type="primary" :style="btnStyle" icon="el-icon-caret-bottom" @click="dropdownEvent">-->
    <Button type="primary" :style="btnStyle" icon="el-icon-printer" @click="dropdownEvent">
      <!--<Button type="primary" :style="btnStyle" @click="dropdownEvent">-->
      打印
    </Button>
    <!--<DropdownMenu slot="dropdown">-->
    <!--<DropdownItem command="0">打印当前页</DropdownItem>-->
    <!--</DropdownMenu>-->
    <!--</Dropdown>-->

    <Dialog :visible.sync="showModal" :title="exportTitle" width="800" :before-close="hideModal">
      <p slot="close" style="text-align:center; margin-top: 10px;">
        <Icon type="close" color="#999"></Icon>
      </p>
      <Checkbox class="select-all-box"
                v-model="checkAll"
                :indeterminate="indeterminate"
                @click.prevent.native="handleCheckAll">全选
      </Checkbox>
      <CheckboxGroup v-model="checkAllGroup" @change="checkAllGroupChange">

        <Checkbox v-for="(item, key) in tableHeader" :label="key" :key="key">{{ item.text }}</Checkbox>
      </CheckboxGroup>
      <div slot="footer" style="height: 28px;">
        <ButtonGroup>
          <Button type="Button" @click="hideModal"><span>取消</span>
          </Button>
          <Button type="Button" @click="export_ok"
                  :disabled="!checkAllGroup.length"><span>确定</span>
          </Button>
        </ButtonGroup>
      </div>
    </Dialog>
  </div>


</template>
<script>

export default {
  props: {
    btnStyle: { // 按钮的位置，通过该属性进行修改
      type: String,
      default: ''
    },
    tableHeader: { // 弹窗的checkbox的数组
      type: Array,
      default: []
    },
    printTitle: {
      type: String,
      default: '打印标题'
    },
    tableData: { // table数据
      type: Array,
      default: []
    }
  },
  data() {
    return {
      exportTitle: '打印当前页',  // 弹窗的标题
      checkAll: false, // 弹框-全选属性
      indeterminate: false, // 弹框-全选属性
      showModal: false, // 显示隐藏弹窗
      checkAllGroup: []
    }
  },
  methods: {
    // 隐藏弹窗
    hideModal() {
      this.showModal = false
      this.checkAll = false
      this.indeterminate = false
    },
    // 导出-点击导出事件
    dropdownEvent(name) {
      // 弹框-全选属性
      this.indeterminate = false
      this.checkAllGroup = []
      // 显示弹出框
      this.showModal = true
    },
    // 导出弹框-全选框
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false
      if (this.checkAll) {
        this.checkAllGroup = []
        this.tableHeader.forEach((item, index) => {
          this.checkAllGroup.push(index)
        })
      } else {
        this.checkAllGroup = []
      }
    },
    // 导出弹框点击确认
    export_ok() {
      this.indeterminate = false
      this.checkAll = false
      this.showModal = false
      var selectedHeader = []
      this.checkAllGroup.forEach((num) => {
        selectedHeader.push(this.tableHeader[num])
      })
      let obj = {
        header: selectedHeader,
        data: this.tableData,
        printTitle: this.printTitle
      }
      // 数据存储到sessionstorage
      console.log('this.obj', obj)
      sessionStorage.setItem('printObj', JSON.stringify(obj))
      // this.$store.commit('SET_PRINTOBJ', obj)
      window.open('./#/printPage')
    },
    // 导出弹框-子选框
    checkAllGroupChange(data) {
      console.log('checkAllGroup', this.checkAllGroup)

      function dedupe(array) {
        return Array.from(new Set(array))
      }

      data = dedupe(data)
      if (data.length === this.tableHeader.length) {
        this.indeterminate = false
        this.checkAll = true
      } else if (data.length > 0) {
        // this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }
    }
  },
  watch: {},
  mounted() {
  },
  beforeMount() {
  }
}
</script>

<style lang="scss">
  .print-div {
    display: inline-block;
    .el-dialog__header {
      border-bottom: 1px solid #e9eaec;
      .el-dialog__title {
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        color: #1c2438;
        font-weight: 700;
      }
    }
    .el-dialog__body {
      .el-checkbox__label {
        font-size: 12px;
        line-height: 1.5;
        color: #495060;
      }

    }

    .el-dialog__footer {
      border-top: 1px solid #e9eaec;
    }
    .el-checkbox {
      margin-left: 30px;
    }
    .select-all-box {
      margin-left: 0;
      margin-bottom: 8px;
    }
  }

</style>
