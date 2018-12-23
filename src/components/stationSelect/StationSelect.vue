<template>
  <div class="area-user-select">
    <Input @focus="openDialog" readonly
           :autosize="true" v-model="stations"
           type="textarea" ></Input>
    <Dialog title="选择用户" :visible.sync="dialogVisible" width="568px" :append-to-body="true">
      <div class="stationSelect">
        <div class="tree">
          <div class="tree_left">
            <div class="leftTreeBox">
              <Tree ref="areaTree"
                    :data="areaList"
                    @check="checkChange"
                    :props="defaultProps"
                    node-key="id"
                    show-checkbox
              ></Tree>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" >
        <Button @click="dialogVisible = false">取 消</Button>
        <Button type="primary" @click="ok">确 定</Button>
      </span>
    </Dialog>

  </div>

</template>

<script>

  export default {
    name: 'stationSelect',
    data() {
      return {
        stations: '',
        dialogVisible: false,
        areaList: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
      }
    },
    props: {
    },
    methods: {
      checkChange() {},
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

      // 请求数据
      async getData() {
        var res = await this.postJson('account', {
          apiCode: 100027,
          content: {
            showLevel: 'third',
            status: 'on'
          }
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
      width: 520px;
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
    .el-tree {
      background: #f8f8f9;
    }
  }

</style>
