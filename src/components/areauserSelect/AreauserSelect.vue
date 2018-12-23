<template>
  <div class="area-user-select">
    <Input @focus="openDialog" readonly
           :disabled="disabled"
           :placeholder="placeholder"
           :autosize="true" v-model="names"
           type="textarea" v-if="showInput"></Input>
    <Dialog title="选择用户" :visible.sync="dialogVisible" width="568px" :append-to-body="true">
      <div class="areauserSelect">
        <div class="tree">
          <div class="tree_left">
            <div class="leftTreeBox">
              <Tree ref="areaTree"
                    :data="areaList"
                    default-expand-all
                    @check="checkChange"
                    :props="defaultProps"
                    node-key="id"
                    show-checkbox
              ></Tree>
            </div>
          </div>
          <div class="tree_right">
            <div class="rightTreeBox">
              <!--单选-->
              <Tree ref="userListTreeRadio"
                    :data="userListRadio"
                    v-if="!checkboxFlag"
                    :props="defaultProps"
                    node-key="id"
                    @node-click="handleNodeClick"
                    :check-strictly="true"
                    :default-expanded-keys="defaultExpandedRadio"
              ></Tree>
              <!--多选-->
              <Tree ref="userListTree"
                    :data="userListCheckbox"
                    v-if="checkboxFlag"
                    @check-change="getUsersCheckedNodes"
                    :props="defaultProps"
                    node-key="id"
                    show-checkbox
                    :default-expanded-keys="defaultExpanded"
              ></Tree>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" v-if="checkboxFlag">
        <Button @click="dialogVisible = false">取 消</Button>
        <Button type="primary" @click="ok">确 定</Button>
      </span>
    </Dialog>

  </div>

</template>

<script>

export default {
  name: 'areauserSelect',
  data() {
    return {
      defaultExpandedRadio: [],
      defaultExpanded: [40, 43],
      dialogVisible: false,
      msg: '我是区域用户选择数据',
      checkL: '',
      userSelectId: '', // 单选框选中的id
      userSelectName: '', // 单选框选中的name
      userSelectCheckboxId: '', // 多选框选中的id
      userSelectCheckboxName: '', // 多选框选中的name
      userSelectCheckboxIdArr: [], // 多选框选中的id
      userSelectCheckboxNameArr: [], // 多选框选中的name
      areaList: [],
      userListRadio: [],
      userListCheckbox: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      names: '', // 组件 input 显示的名字
      ids: '', // 用户列表是多选的时候的初始化
      id: '' // 用户列表是单选的时候的初始化值
    }
  },
  props: {
    showInput: { // 是否有输入框
      type: Boolean,
      default: true
    },
    checkboxFlag: { // 右边是单选还是多选，true为多选
      type: Boolean,
      default: true
    },
    disabled: { // 默认不禁止
      type: Boolean,
      default: false
    },
    placeholder: { // 提示语
      type: String,
      default: ''
    },
    regionCode: { // 指定区域
      type: String,
      default: ''
    },
  },
  methods: {
    // 设置区域不可选
    setDisabled() {
      this.areaList[0].disabled = true
      this.areaList[0].children.forEach((item) => {
        item.disabled = true
      })
    },
    openDialog() {
      this.dialogVisible = true
      if (this.ids) {
        this.$nextTick(() => {
          let idsArr = this.ids.split(',').map((item) => {
            return Number(item)
          })
          this.$refs.userListTree.setCheckedKeys(idsArr)
          this.defaultExpanded = idsArr
        })
      }
      if (this.id) {
        this.$nextTick(() => {
          console.log('$nextTick', this.$refs)
          console.log('this.$refs.userListTreeRadio.store', this.$refs.userListTreeRadio.store.nodesMap[this.id].expanded, this.id)
          // this.$refs.userListTreeRadio.store.nodesMap[this.id].expanded = true
          this.defaultExpandedRadio = [this.id]
        })
      }
      if (this.regionCode) {
        this.getRegionUser(this.regionCode)
        this.setDisabled()
      }
    },
    ok() {
      this.names = this.userSelectCheckboxName
      this.ids = this.userSelectCheckboxId
      this.dialogVisible = false
      if (this.checkboxFlag) {
        // 多选
        this.$emit('selectResult', {
          id: this.userSelectCheckboxId,
          name: this.userSelectCheckboxName,
          id_arr: this.userSelectCheckboxIdArr,
          name_arr: this.userSelectCheckboxNameArr
        })
      } else {
        // 单选
        this.$emit('selectResult', {
          id: this.userSelectId,
          name: this.userSelectName
        })
      }
    },
    handleNodeClick(data) {
      if (!data.pid) {
        return
      }
      if (data.pid && data.pid[0] === 'd' && data.id[0] != 'd') {
        this.userSelectId = data.id
        this.id = data.id
        this.userSelectName = data.name
        this.names = this.userSelectName
        this.dialogVisible = false
        // 单选
        this.$emit('selectResult', {
          id: this.userSelectId,
          name: this.userSelectName
        })
      }
    },
    getUsersCheckedNodes() {
      var data = this.$refs.userListTree.getCheckedNodes()
      let idArr = []
      let nameArr = []
      data.forEach((val, i) => {
        // 以前用的是!val.children作为最后一级的判断，先用d_3，第一个为判断
        if (val.id !== '' && val.id != 0 && val.id[0] !== 'd') {
          idArr.push(val.id)
          nameArr.push(val.name)
        }
      })
      this.userSelectCheckboxIdArr = idArr
      this.userSelectCheckboxNameArr = nameArr
      this.userSelectCheckboxId = idArr.join(',')
      this.userSelectCheckboxName = nameArr.join(',')
    },
    async checkChange() {
      let ids = ''
      let idsArr = []
      let data = this.$refs.areaTree.getCheckedNodes()
      data.forEach((val, i) => {
        idsArr.push(val.id)
      })
      ids = idsArr.join(',')
      this.getRegionUser(ids)
    },
    async getRegionUser(ids) {
      var res = await this.postJson('account', {
        apiCode: 100026,
        content: {
          regionCodes: ids
        }
      })
      if (res.code === '0') {
        // 清空children
        this.userListRadio = [res.content.departmentTree]
        this.userListCheckbox = [res.content.departmentTree]
      }
    },
    // 初始化赋值，初始勾选--复选框
    setDataCheckBox(ids, names) {
      // 把所有checked 变成false
      // 把所有的勾选去掉
      // this.$refs.userListTree.setCheckedKeys(ids.split(','));
      this.ids = ids
      this.names = names
    },
    // 初始化赋值，初始勾选--单选框
    setDataRadio(id, name) {

      console.log('id', id, this.checkboxFlag, this.$refs)
      this.id = Number(id)
      // this.$refs.userListTreeRadio.setCheckedKeys([id]);
      this.names = name
    },
    // 子组件方法 重置
    clear() {
      this.getData()
      this.userSelectId = ''
      this.userSelectName = ''
      this.userSelectCheckboxId = ''
      this.userSelectCheckboxName = ''
      this.names = ''
      // 左边区域勾选清除
      this.areaList[0].checked = false
    },
    // 修改页面初始化userSelectId， userSelectName
    resetE(id, name) {
      this.userSelectId = id
      this.userSelectName = name
    },
    // 请求数据
    async getData() {
      var res = await this.postJson('account', {
        apiCode: 100026,
        content: {}
      })
      if (res.code === '0') {
        // 清空children
        this.areaList = [res.content.regionTree]
        this.userListRadio = [res.content.departmentTree]
        this.userListCheckbox = [res.content.departmentTree]
      }
    }
  },
  beforeMount() {
    this.getData()
  },
  mounted() {
  }
}
</script>

<style lang="scss">
  .area-user-select {
  }

  .tree {
    display: flex;
    width: 100%;
    height: 100%;
    margin-bottom: 10px;
    .tree_left {
      width: 260px;
      margin-right: 16px;
      .leftTreeBox {
        height: 280px;
        background: #f8f8f9;
        border: 1px solid #dddee1;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        margin-top: 12px;
        padding-top: 10px;
        padding-left: 24px;
        overflow-x: hidden;
        overflow-y: auto;
      }
    }
    .tree_right {
      width: 260px;
      .rightTreeBox {
        height: 280px;
        background: #f8f8f9;
        border: 1px solid #dddee1;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        margin-top: 12px;
        padding-top: 10px;
        padding-left: 24px;
        overflow-y: auto;
      }
    }
    .el-tree {
      background: #f8f8f9;
    }
  }

</style>
