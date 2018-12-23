<template>
  <div class="protectRadius">

    <TablePage :totalCount="totalCount" :showPowerSearch="false">

      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button v-if="true" type="primary" icon="el-icon-edit"
                @click="$router.push('/dataMaintain/protectRadiusAdd')">新增
        </Button>
        <!--</ButtonGroup>-->
      </div>


      <!--表格-->
      <div slot="TableSlot">
        <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
          <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
            <TableColumn
               label="序号"
               width="50">
              <template slot-scope="scope">
                {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
              </template>
            </TableColumn>
            <TableColumn label="站点区域等级" prop="stationAreaLevelName"></TableColumn>
            <TableColumn label="保护区域半径(米)" prop="limitRadius">
              <template slot-scope="scope">
                <span v-if="!scope.row.inputStatus">{{ scope.row.limitRadius }}</span>
                <FormItem prop="limitRadius" v-else>
                  <Input v-model="ruleForm.limitRadius" style="width:100px;"></Input>
                </FormItem>
              </template>
            </TableColumn>
            <TableColumn
               label="操作"
               width="170">
              <template slot-scope="scope">
                <Button @click="editItem(scope.$index)" type="text" typeOptions v-if="!scope.row.inputStatus">修改
                </Button>
                <Button @click="modify(ruleForm.limitRadius, scope.row.id)" type="text" typeOptions v-else>保存</Button>
                <Button @click="$router.push('/dataMaintain/protectRadiusChangeRecord/' + scope.row.id)" type="text"
                        typeOptions v-if="true">查看变更记录
                </Button>
                <Button @click="deleteFile(scope.row.id)" type="text" typeOptions v-if="true">删除</Button>
              </template>
            </TableColumn>
          </Table>
        </Form>

      </div>

    </TablePage>

  </div>
</template>

<script>
export default {
  name: 'protectRadius',
  data: function () {
    var limitRadius = (rule, value, callback) => {
      // var r = /^\+?[1-9][0-9]*$/ //正整数
      // console.log(r.test(value))
      if (!isNaN(value)) {
        if (value > 0 && value <= 500) {
          callback()
        } else {
          callback(new Error('保护半径取值1-500米!'))
        }
      } else {
        callback(new Error('保护区域半径只能为数值!'))
      }
    }
    return {
      ruleForm: {
        limitRadius: ''
      },
      rules: {
        limitRadius: [
          {required: true, message: '请输入保护区域半径'},
          {validator: limitRadius, trigger: 'blur'}
        ]
      },
      deleteId: '', // 删除的id
      dialogVisible: false, // 删除弹窗flag
      totalCount: 20,
      tableHeight: 0,
      tableData: [],
      confirmSearch: {
        page: 1
      },
      searchForm: {
        status: '',
        page: 1
      }
    }
  },
  methods: {
    // 点击修改
    editItem(index) {
      // 其他初始化为false
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].inputStatus = false
      }
      this.tableData[index].inputStatus = true
      this.$set(this.tableData, index, this.tableData[index])
      this.ruleForm.limitRadius = this.tableData[index].limitRadius
    },
    // 点击保存
    async modify(val, id) {
      var res = await this.postJsonWithMask('station', {
        apiCode: 300124,
        content: {
          id: id,
          limitRadius: val
        }
      })
      if (res.code === '0') {
        this.showMsg(res.msg)
        this.init()
      }
    },
    // 点击删除
    async deleteFile(id) {
      const flag = await this.$confirm(`确定移除?`)
      if (flag == 'confirm') {
        const res = await this.postJson('station', {
          apiCode: 300125,
          content: {id}
        })
        if (res.code == 0) {
          this.tableData = this.tableData.filter(file => {
            return file.id != id
          })
          this.showMsg('删除成功')
        }
      }
    },
    async init() {
      this.Event.$on('pagechange', (val) => {
        this.confirmSearch.page = val
        this.searchForm.page = val
        this.query()
      })
      this.search()
    },
    search() {
      this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
      this.Event.$emit('pageInit', 1)
      this.query()
    },
    async query() {
      var res = await this.postJson('station', {
        apiCode: 300121
      })
      this.tableData = res.content.dataList
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].inputStatus = false
      }
      this.totalCount = res.content.dataPage.totalCount
    },
    resetForm(formName) {
      this[formName] = {
        status: '',
        page: 1
      }
      this.$refs.as.clear()
    }
  },
  mounted() {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init()
  }
}
</script>

<style lang="scss">
  .protectRadius {
    // 设列表中保护区域半径，输入框靠左对齐
    .el-table__row {
      .el-form-item {
        .el-form-item__content {
          margin-left: 0 !important;
        }
      }
    }
  }
</style>