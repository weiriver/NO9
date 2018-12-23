<template>
  <!--<div style="float: left;" class="export-div">-->
  <div class="export-div">
    <Dropdown @command="dropdownEvent"
              placement="bottom-start"
              trigger="click">
      <Button type="primary" :style="btnStyle" icon="el-icon-caret-bottom">
        {{ btnName }}
      </Button>
      <DropdownMenu slot="dropdown" v-if="!isOther">
        <DropdownItem command="0">导出EXCEL(当页数据)</DropdownItem>
        <DropdownItem command="1">导出EXCEL(全部数据)</DropdownItem>
      </DropdownMenu>
      <DropdownMenu slot="dropdown" v-if="isOther">
        <DropdownItem command="1">导出</DropdownItem>
      </DropdownMenu>
    </Dropdown>
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
        <Checkbox v-for="(item, key) in checkboxList" :label="item.text" :key="key"></Checkbox>
      </CheckboxGroup>
      <div slot="footer" style="height: 28px; text-align: right" class="dialog-footer">
        <ButtonGroup>
          <Button type="button" @click="hideModal"><span>取消</span>
          </Button>
          <Button type="primary" @click="export_ok"
                  :disabled="!exportObj.content.colCNNames.length"><span>确定</span>
          </Button>
        </ButtonGroup>
      </div>
    </Dialog>
  </div>


</template>
<script>

var FileSaver = require('file-saver')
export default {
  props: {
    isOther: { // 按钮的位置，通过该属性进行修改
      type: Boolean,
      default: false
    },
    btnName: { // 按钮的位置，通过该属性进行修改
      type: String,
      default: '导出'
    },
    btnStyle: { // 按钮的位置，通过该属性进行修改
      type: String,
      default: ''
    },
    currentPage: {  // 当前页码
      type: [String, Number],
      default: 1
    },
    queryObj: {  // 查询条件
      type: Object,
      default: function () {
        return {}
      }
    },
    checkboxList: { // 弹窗的checkbox的数组
      type: Array,
      default: []
    },
    exportObjOrigin: { // 导出的接口字段
      type: Object,
      default: {
        apiCode: '', // 接口地址
        content: {
          colNames: [], // checkbox的value
          colCNNames: [], // checkbox的显示中文名字
          fileType: 'excel', // 导出的文件格式，此处为excel文件
          fileName: 'myExportFile' // 导出的excel内容的表头
        }
      }
    },
    sysModule: {
      type: String,
      default: 'station'
    },
    fileSaveName: {
      type: String,
      default: '导出的文件名字'
    }
  },
  data() {
    return {
      exportTitle: '导出Excel(当前页数据)',  // 弹窗的标题
      checkAll: false, // 弹框-全选属性
      indeterminate: false, // 弹框-全选属性
      showModal: false, // 显示隐藏弹窗
      checkAllGroup: [],
      exportObj: {
        apiCode: '', // 接口地址
        content: {
          colNames: [], // checkbox的value
          colCNNames: [], // checkbox的显示中文名字
          fileType: 'excel', // 导出的文件格式，此处为excel文件
          fileName: 'myExportFile' // 导出的excel内容的表头
        }
      }
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
      // 重复打开时候把上次选中的清除

      this.exportObj = JSON.parse(JSON.stringify(this.exportObjOrigin))
      // 显示弹出框
      this.showModal = true
      // 弹框-全选属性
      this.indeterminate = false
      this.checkAllGroup = []
      // 重复打开时候把上次选中的清除
      // 判断点的是哪种形式导出，改变头部title
      if (name == 0) {
        // this.exportObj.content.page = this.currentPage // 导出当前页面
        this.exportTitle = '导出EXCEL(当页数据)'
        this.exportObj.content.paginated = true
      } else if (name == 1) {
        this.exportObj.content.paginated = false // 导出所有页面
        this.exportTitle = '导出EXCEL(全部数据)'
      }
    },
    // 去重
    dedupe(array) {
      return Array.from(new Set(array))
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
        this.checkboxList.forEach((val, i) => {
          this.checkAllGroup.push(val.text)
          this.exportObj.content.colCNNames.push(val.text)
          this.exportObj.content.colNames.push(val.value)
        })
        this.exportObj.content.colCNNames = this.dedupe(this.exportObj.content.colCNNames)
        for (var i = this.exportObj.content.colCNNames.length - 1; i >= 0; i--) {
          if (this.exportObj.content.colCNNames[i] === false || this.exportObj.content.colCNNames[i] === true) {
            this.exportObj.content.colCNNames.splice(i, 1)
          }
        }
      } else {
        this.checkAllGroup = []
        this.exportObj.content.colCNNames = []
        this.exportObj.content.colNames = []
      }
    },
    // 导出弹框点击确认
    async export_ok() {
      this.indeterminate = false
      this.checkAll = false
      this.showModal = false
      Object.assign(this.exportObj.content, this.queryObj)
      var res = await this.postJson(this.sysModule, this.exportObj)
      var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'})
      FileSaver.saveAs(blob, this.fileSaveName + '.xlsx')
      this.showModal = false // 关闭弹窗
    },
    // 导出弹框-子选框
    checkAllGroupChange(data) {
      this.exportObj.content.colCNNames = data
      this.exportObj.content.colNames = this.checkboxList.filter((v, i) => {
        if (data.includes(v.text)) {
          return v
        }
      }).map(v => {
        return v.value
      })

      function dedupe(array) {
        return Array.from(new Set(array))
      }

      data = dedupe(data)
      if (data.length === this.checkboxList.length) {
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
  mounted() {
  }
}
</script>

<style lang="scss">
  .export-div {
    display: inline-block;
    .el-dialog__body {
      .el-checkbox__label {
        font-size: 12px;
        line-height: 1.5;
        color: #495060;
      }

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
