<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button v-if="true" type="primary" icon="el-icon-edit" @click="toAdd">新增</Button>
        <!--</ButtonGroup>-->
      </div>

      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="dataForm" size="mini"
              ref="dataForm">
          <FormItem label="名称">
            <Input v-model="dataForm.name"></Input>
          </FormItem>
          <FormItem label="方案代码">
            <Input v-model="dataForm.code"></Input>
          </FormItem>
          <FormItem label="面值">
            <Input v-model="dataForm.faceValue"></Input>
          </FormItem>
          <FormItem label="是否置顶">
            <Select v-model="dataForm.top" clearable>
              <Option value="true" label="是"></Option>
              <Option value="false" label="否"></Option>
            </Select>
          </FormItem>
          <FormItem label="是否热销">
            <Select v-model="dataForm.sellWell" clearable>
              <Option value="true" label="是"></Option>
              <Option value="false" label="否"></Option>
            </Select>
          </FormItem>
          <FormItem label="是否新品">
            <Select v-model="dataForm.newProd" clearable>
              <Option value="true" label="是"></Option>
              <Option value="false" label="否"></Option>
            </Select>
          </FormItem>
          <FormItem class="full-line">
            <Button type="primary" @click="search()">查询</Button>
            <Button @click="resetForm('dataForm')">重置</Button>
          </FormItem>
        </Form>
      </div>

      <!--表格-->
      <div slot="TableSlot">
        <Table stripe :data="tableDataFacilities" :height="tableHeight" border style="width: 100%" v-if="tableHeight">

          <TableColumn fixed label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
            </template>
          </TableColumn>
          <TableColumn label="名称" prop="name" width="100"></TableColumn>
          <TableColumn label="方案代码" prop="code"></TableColumn>
          <TableColumn label="面值" prop="faceValue" width="50"></TableColumn>
          <TableColumn label="最高奖金" prop="topPrize"></TableColumn>
          <TableColumn label="状态" width="140">
            <template slot-scope="scope">
              <RadioGroup v-model="scope.row.state" typeOptions @change="(value) =>statusChange(value, scope.row.id)">
                <RadioButton label="true">启用</RadioButton>
                <RadioButton label="false">停用</RadioButton>
              </RadioGroup>
            </template>
          </TableColumn>
          <TableColumn label="置顶" width="50">
            <template slot-scope="scope">
              <span>{{scope.row.top ? '是': '否'}}</span>
            </template>
          </TableColumn>
          <TableColumn label="热销" width="50">
            <template slot-scope="scope">
              <span>{{scope.row.sellWell ? '是': '否'}}</span>
            </template>
          </TableColumn>
          <TableColumn label="新品" width="50">
            <template slot-scope="scope">
              <span>{{scope.row.newProd ? '是': '否'}}</span>
            </template>
          </TableColumn>
          <TableColumn label="操作">
            <template slot-scope="scope">
              <Button @click="toDetail(scope.row.id)" type="text" typeOptions>查看</Button>
              <Button @click="editItem(scope.row.id)" type="text" typeOptions>修改</Button>
            </template>
          </TableColumn>
        </Table>
      </div>

    </TablePage>
    <Dialog
       title="提示"
       :visible.sync="dialogVisible"
       width="30%">
      <div>
        此操作将永久删除该记录, 是否继续?
      </div>
      <span slot="footer" class="dialog-footer">
      <Button @click="dialogVisible = false">取 消</Button>
      <Button type="primary" @click="deleteItem">确 定</Button></span>
    </Dialog>
  </div>
</template>

<script>
export default {
  name: 'Subindex',
  data: function () {
    return {
      // 删除modal框
      dialogVisible: false,
      // 查询列表信息(暂不用)
      Obj: {
        apiCode: 300281,
        content: {
          page: 1
        }
      },
      // 删除
      ObjDelete: {
        apiCode: 300284,
        content: {
          id: ''
        }
      },
      // 表单提交数据绑定model
      dataForm: {},
      confirmSearch: {
        page: 1
      },
      searchForm: {
        page: 1
      },
      totalCount: 0,
      tableHeight: 0,
      msg: '',
      tableDataFacilities: []
    }
  },
  computed: {
    runningstateList() {
      return JSON.parse(sessionStorage.getItem('all_enumDic')).StorageEnum$runningstateEnum
      // return this.$store.state['all_enumDic'].StorageEnum$runningstateEnum
    }
  },
  watch: {
    typeX(val) {
      console.log('val', val)
      this.search()
    }
  },
  methods: {
    toAdd() {
      this.$router.push(`/service/billingRCDAdd`)
    },
    toDetail(id) {
      this.$router.push(`/service/billingRCDDetail/` + id)
    },
    editItem(id) {
      this.$router.push(`/service/billingRCDAdd/` + id)
    },
    opendelete(id) {
      this.dialogVisible = true
      // 删除操作
      this.ObjDelete.content.id = id
    },
    async deleteItem() {
      this.postJson('station', this.ObjDelete).then(res => {
        if (res.code === '0') {
          this.showMsg('删除成功')
          this.dialogVisible = false
          this.query()
        }
      })
    },
    // 修改状态操作
    async statusChange(value, id) {
      var apiCode = 300141
      var res = await this.postJson('station', {
        apiCode,
        content: {
          id: id,
          state: value
        }
      })
      if (res.code == 0) {
        this.showMsg('状态修改成功', 'success')
        this.init()
      }
    },
    // 初始化查询内容
    initAboutTypeX() {
      this.searchForm = this['dataForm']
      this.searchForm.page = 1
    },
    async init() {
      this.Event.$on('pagechange', (val) => {
        this.confirmSearch.page = val
        this.query()
      })
      this.search()
    },
    search() {
      this.initAboutTypeX()
      this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
      console.log('this.confirmSearch', this.confirmSearch)
      this.Event.$emit('pageInit', 1)
      this.query()
    },
    async query() {
      var apiCode = 300140
      var res = await this.postJson('station', {
        apiCode,
        content: this.confirmSearch
      })
      if (res.code == 0) {
        this.tableDataFacilities = res.content.dataList
        this.totalCount = res.content.dataPage.totalCount
      }
    },
    resetForm(formName) {
      this[formName] = {}
      this.searchForm = {}
    }
  },
  mounted() {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init()
  }
}
</script>

<style></style>
