<!--入库开单-->
<template>
  <div>
    <h3 class="mt10 mb20">
      基本信息
    </h3>
    <!--采购入库-中心管理员-->
    <Form :inline="true" class="form-inline" label-width="100px" :model="ruleForm" size="mini"
          ref="ruleForm">

      <FormItem label="单据编号" prop="name">
        <Input v-model="ruleForm.nameX	"></Input>
      </FormItem>
      <FormItem label="单据主题" prop="name">
        <Input v-model="ruleForm.nameX	"></Input>
      </FormItem>
      <FormItem label="业主名称" prop="name">
        <Input v-model="ruleForm.nameX	"></Input>
      </FormItem>
      <FormItem label="出库人员" prop="name">
        <Input v-model="ruleForm.nameX	"></Input>
      </FormItem>
      <FormItem label="来源单据" prop="name">
        <Input v-model="ruleForm.nameX	"></Input>
      </FormItem>
      <FormItem label="备注" prop="name">
        <Input type="textarea" v-model="ruleForm.nameX	"></Input>
      </FormItem>
    </Form>

    <!--领用入库-地市管理员-->
    <h3 class="mt10 mb20">
      置换出库明细
    </h3>
    <div>
      <div class="mt10 mb20">
        <Button type="primary" @click="addLine">增行</Button>
        <Button @click="minusLine" :disabled="tableData.length == 1">减行</Button>
      </div>

      <Table stripe :data="tableData" border style="width: 100%" >

        <TableColumn fixed label="序号" width="50" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
          </template>
        </TableColumn>
        <TableColumn
          label="设备名称"
          >
          <template slot-scope="scope">
            <Button @click="getNO(scope)" type="text" typeOptions>
              <div v-if="scope.row.getNOFlag">
                {{ scope.row.no }}
              </div>
              <div v-if="!scope.row.getNOFlag">
                点击选设备名称
              </div>

            </Button>

          </template>
        </TableColumn>
        <TableColumn
          label="设备型号"
        >
          <template slot-scope="scope">
            <Input v-model="scope.row.name"></Input>
          </template>
        </TableColumn>
        <TableColumn
          label="单位"
          width="100">
          <template slot-scope="scope">
            <Input v-model="scope.row.unit"></Input>
          </template>
        </TableColumn>

        <TableColumn
          label="出库数量"
          width="100">
          <template slot-scope="scope">
            <Input v-model="scope.row.num"></Input>
          </template>
        </TableColumn>
        <TableColumn
          label="单价"
          width="100">
          <template slot-scope="scope">
            <Input v-model="scope.row.price"></Input>
          </template>
        </TableColumn>
      </Table>
      <div class="mt25 mb20 tc">
        <Button type="primary" @click="submit">置换出库</Button>
      </div>
    </div>
    <Dialog
      title="选择设备名称"
      :visible.sync="dialogVisible"
      width="30%">
      <span>设备1</span>
      <span slot="footer" class="dialog-footer">
    <Button @click="dialogVisible = false">取 消</Button>
    <Button type="primary" @click="chooseNo">确 定</Button>
  </span>
    </Dialog>
  </div>
</template>

<script>
  export default {
    name: 'Subindex',
    data: function () {
      return {
        isCenter: false,
        activeIndex: 0,
        dialogVisible: false,
        res: '',
        Obj: {},
        msg: '',
        tableData: [
          {
            name: '名称'
          }
        ],
        ruleForm: {
          status: ''
        }
      }
    },
    methods: {
      chooseNo (item) {
        console.log('item', this.activeIndex, item.index)
        this.$set(this.tableData[this.activeIndex], 'getNOFlag', true)
        this.$set(this.tableData[this.activeIndex], 'no', '设备1')
        this.dialogVisible = false
      },
      minusLine () {
        var len = this.tableData.length
        if (len > 1) {
          this.tableData.splice(len - 1, 1)
        }
      },
      addLine () {
        this.tableData.push({})
      },
      getNO (item) {
        console.log('获取编号item', item, item.$index)
        this.activeIndex = item.$index
        this.dialogVisible = true
      },
      submit () {
       console.log('this.tableData', this.tableData)
      }
    },
    mounted() {
    }
  }
</script>

<style></style>
