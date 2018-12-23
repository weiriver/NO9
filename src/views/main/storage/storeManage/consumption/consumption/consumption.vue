<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <!--<div slot="btn_groups">-->
        <!--<Select clearable  class="search-select" size="mini" v-model="searchForm.status">-->
          <!--<Option label="全部" value=""></Option>-->
          <!--<Option label="已完成" value="true"></Option>-->
          <!--<Option label="待处理" value="false"></Option>-->
        <!--</Select>-->
      <!--</div>-->

      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="单据编号" prop="bizId">
            <Input v-model="searchForm.bizId"></Input>
          </FormItem>
          <FormItem label="单据主题" prop="title">
            <Input v-model="searchForm.title"></Input>
          </FormItem>
          <FormItem label="申请时间" prop="name">
            <DatePicker type="daterange" placeholder="选择日期" v-model="searchForm.date1" value-format="yyyy-MM-dd"
            ></DatePicker>
          </FormItem>
          <FormItem label="状态" prop="title">
            <Select clearable  class="search-select" size="mini" v-model="searchForm.status">
            <Option label="全部" value=""></Option>
            <Option label="已完成" value="available"></Option>
            <Option label="申请中" value="audit"></Option>
            </Select>
          </FormItem>

          <FormItem class="full-line">
            <Button type="primary" @click="search()">查询</Button>
            <Button @click="resetForm('searchForm')">重置</Button>
          </FormItem>
        </Form>
      </div>

      <!--表格-->
      <div slot="TableSlot">
        <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight">

          <TableColumn fixed label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
            </template>
          </TableColumn>
          <TableColumn label="单据编号" prop="id"></TableColumn>
          <TableColumn label="单据主题" prop="nameX"></TableColumn>
          <TableColumn
            label="状态"
            width="100">
            <template slot-scope="scope">
              {{ scope.row.status | getTxt }}
            </template>
          </TableColumn>
          <TableColumn
            label="申请时间"
            width="100">
            <template slot-scope="scope">
              {{ scope.row.createDate | getTxt }}
            </template>
          </TableColumn>
          <TableColumn label="申请人员" prop="createName"></TableColumn>
          <TableColumn label="备注" prop="remark"></TableColumn>
          <TableColumn
            label="操作"
            width="140">
            <template slot-scope="scope">
              <Button  @click="editItem(scope.row.id)" type="text" size="small">查看详情</Button>
            </template>
          </TableColumn>
        </Table>
      </div>

    </TablePage>
  </div>
</template>

<script>
  export default {
    name: 'Subindex',
    data: function () {
      return {
        confirmSearch: {
          page: 1
        },
        searchForm: {
          page: 1,
          status: ''
        },
        totalCount: 20,
        tableHeight: 0,
        msg: '',
        tableData: []
      }
    },
    methods: {
      editItem (id) {
        this.$router.push('/store/consumptionDetail/' + id)
      },
      async init() {
        this.Event.$on('pagechange', (val) => {
          this.confirmSearch.page = val
          this.query()
        })
        this.search()
      },
      search () {
        if (this.searchForm.date1) {
          this.searchForm.startCreateTime = this.searchForm.date1[0]
          this.searchForm.endCreateTime = this.searchForm.date1[1]
        }
        this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
        this.Event.$emit('pageInit', 1)
        this.query()
      },
      async query() {
        var res = await this.postJson('ws', {
          apiCode: 501501,
          content: this.confirmSearch
        })
        this.tableData = res.content.dataList
        this.totalCount = res.content.dataPage.totalCount
      },
      resetForm(formName) {
        this[formName] = {
          page: 1
        }
      }
    },
    mounted() {
      this.tableHeight = this.tableHeightCal('el-main', 150)
      this.init()
    }
  }
</script>

<style lang="scss">
  .el-date-editor{
    width: 100% !important;
  }
</style>
