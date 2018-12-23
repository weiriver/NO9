<template>
  <div>
    <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
    <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
      <TableColumn label="序号" type="index" width="50"></TableColumn>
      <TableColumn label="课程类型" prop="courseTypeName" width="200"></TableColumn>
      <TableColumn label="说明" prop="description"></TableColumn>
    </Table>
  </div>
</template>

<script>
  export default {
    name: 'CourseTypeDetail',
    data() {
      return {
        tableHeight: 0,
        detail: [],
        tableHeader: [],
        tableData: []
      }
    },
    methods: {
      async init() {
        this.Event.$on('pagechange', (val) => {
          console.log(val)
        })
        var res = await this.postJson('train', {
          apiCode: 630008,
          content: {
            id: this.$route.params.id
          }
        })
        console.log('数据返回', res.content)
        this.tableData.push(res.content)
        this.detail = [
          {name: '课程类型 ', value: res.content.courseTypeName},
          {name: '添加分类人员', value: res.content.createByName},
          {name: '更新人员', value: res.content.updateByName},
          {name: '添加时间', value: res.content.createDate},
          {name: '更新时间', value: res.content.lastUpdate},
          {name: '其他信息', value: res.content.extInfo}
        ]
      }
    },
    mounted() {
      this.tableHeight = this.tableHeightCal('el-main', 150)
      this.init()
    }
  }
</script>

<style></style>
