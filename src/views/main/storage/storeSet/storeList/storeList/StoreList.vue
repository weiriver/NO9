<!--分页设置-->
<template>
  <div>

    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button v-if="Auth(500001)" type="primary" icon="el-icon-edit" @click="$router.push('/storeSet/storeAdd')">新增
        </Button>
        <!--</ButtonGroup>-->
        <!--<ImportFile :btnStyle="'border-radius: 0 4px 4px 0;'">-->
        <!--<div slot="warnTxt">只能上传jpg/png文件，且不超过500kb</div>-->
        <!--</ImportFile>-->
      </div>


      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">

          <FormItem label="仓库名称" prop="name">
            <Input v-model="searchForm.nameX	"></Input>
          </FormItem>

          <FormItem label="仓库状态" prop="region">
            <Select clearable v-model="searchForm.status">
              <Option label="全部" value=""></Option>
              <Option label="启用" value="true"></Option>
              <Option label="停用" value="false"></Option>
            </Select>
          </FormItem>
          <FormItem label="仓库管理员" prop="name">
            <Input v-model="searchForm.adminName"></Input>
          </FormItem>
          <FormItem label="所属区域" prop="name">
            <AreaCascader :ruturnAllLevelResultFlag="true" @areaSelectResult="areaSelectResult" ref="as"
                          :stage="2"></AreaCascader>
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
          <TableColumn
             label="序号"
             width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
            </template>
          </TableColumn>
          <TableColumn label="仓库名称" prop="nameX"></TableColumn>
          <TableColumn
             label="仓库状态"
             width="140">
            <template slot-scope="scope">
              <RadioGroup v-model="scope.row.status" @change="(value) =>statusChange(value, scope.row.id)">
                <RadioButton label="true">启用</RadioButton>
                <RadioButton label="false">停用</RadioButton>
              </RadioGroup>
            </template>
          </TableColumn>
          <TableColumn label="所属地区" prop="regionName"></TableColumn>
          <TableColumn
             label="仓库类型"
             width="100">
            <template slot-scope="scope">
              {{ scope.row.typeX | getTxt }}
            </template>
          </TableColumn>
          <TableColumn label="仓库管理员" prop="adminName"></TableColumn>
          <TableColumn label="备注" prop="extInfo"></TableColumn>
          <TableColumn
             label="操作"
             width="70">
            <template slot-scope="scope">
              <Button :disabled="scope.row.status" @click="editItem(scope.row.id)" type="text" typeOptions
                      v-if="Auth(500002)">修改
              </Button>
            </template>
          </TableColumn>
        </Table>
      </div>

    </TablePage>
  </div>
</template>

<script>
export default {
  name: 'StoreList',
  data: function () {
    return {
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
    areaSelectResult(result) {
      if (result.length > 0) {
        this.searchForm.regionCode = result[result.length - 1].value
        this.searchForm.regionName = result[result.length - 1].label
      } else {
        this.searchForm.regionCode = ''
        this.searchForm.regionName = ''
      }
      console.log('areaSelectResult', result)
      // 第一次加载会触发但是 result是空

      // console.log('this.ruleForm.regionCode', this.ruleForm.regionCode)
      // console.log('this.regionCode', this.regionCode)
    },
    async statusChange(value, id) {
      console.log('新状态的值', value, id)
      var res = await this.postJson('ws', {
        apiCode: 500006,
        content: {
          id: id,
          status: value
        }
      })
      console.log('数据返回', res.content)
      if (res.content.updated == 1) {
        this.showMsg('状态修改成功', 'success')
        this.init()
      }
    },
    editItem(id) {
      this.$router.push(`/storeSet/storeAdd/${id}`)
    },
    async init() {
      this.Event.$on('pagechange', (val) => {
        this.confirmSearch.page = val
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
      var res = await this.postJson('ws', {
        apiCode: 500004,
        content: this.confirmSearch
      })
      this.tableData = res.content.dataList
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

<style></style>
