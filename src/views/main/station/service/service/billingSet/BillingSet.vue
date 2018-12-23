<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <!--<div slot="btn_groups">-->
      <!--</div>-->

      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="dataForm" size="mini"
              ref="dataForm">
          <FormItem label="名称">
            <Input v-model="dataForm.name"></Input>
          </FormItem>
          <FormItem label="所属区域">
            <AreaCascader :ruturnAllLevelResultFlag="true" @areaSelectResult="areaSelectResult" ref="as" :stage="1"></AreaCascader>
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
          <TableColumn label="即开票名称" prop="name"></TableColumn>
          <TableColumn label="所属区域" prop="regionName"></TableColumn>
          <TableColumn label="面值" prop="faceValue"></TableColumn>
          <TableColumn label="最高奖金" prop="topPrize"></TableColumn>
          <TableColumn label="可否预定">
            <template slot-scope="scope">
              <RadioGroup v-model="scope.row.state" typeOptions @change="(value) =>statusChange(value, scope.row.id)">
                <RadioButton label="true">是</RadioButton>
                <RadioButton label="false">否</RadioButton>
              </RadioGroup>
            </template>
          </TableColumn>
        </Table>
      </div>

    </TablePage>
    <!--点击“批量处理”弹出框-->
    <Dialog
            title="批量处理"
            :visible.sync="batchFlag"
            width="30%">
      <div>
        <p>确定要处理所选数据吗？</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <Button type="primary" size="large" long @click="batchDealComfirm()">确定</Button>
      </span>
    </Dialog>
  </div>
</template>

<script>
  export default {
    name: 'Subindex',
    data: function () {
      return {
        // 查询列表信息(暂不用)
        Obj: {
          apiCode: 300142,
          content: {
            page: 1
          }
        },
        // 表单提交数据绑定model
        dataForm: {
        },
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
      // 选择区域
      areaSelectResult (result) {
        if (result.length > 0) {
          this.searchForm.regionCode = result[result.length - 1].value
          this.searchForm.regionName = result[result.length - 1].label
        } else {
          this.searchForm.regionCode = ''
          this.searchForm.regionName = ''
        }
      },
      // 修改状态操作
      async statusChange (value, id) {
        var apiCode = 300143
        var res = await this.postJson('station', {
          apiCode,
          content: {
            id: id,
            state: value
          }
        })
        if (res.code == 0) {
          this.showMsg('即开票预设状态更新成功', 'success')
          this.query()
        }
      },
      // 初始化查询内容
      initAboutTypeX () {
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
      search () {
        this.initAboutTypeX()
        this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
        console.log('this.confirmSearch', this.confirmSearch)
        this.Event.$emit('pageInit', 1)
        this.query()
      },
      async query() {
        var apiCode = 300142
        var res = await this.postJson('station', {
          apiCode,
          content: this.confirmSearch
        })
        if (res.code == 0) {
          this.tableDataFacilities =  res.content.dataList
          this.totalCount = res.content.dataPage.totalCount
        }
      },
      resetForm(formName) {
        this[formName] = {
        }
        this.searchForm = {}
        this.$refs.as.clear()
      }
    },
    mounted() {
      this.tableHeight = this.tableHeightCal('el-main', 150)
      this.init()
    }
  }
</script>

<style></style>
