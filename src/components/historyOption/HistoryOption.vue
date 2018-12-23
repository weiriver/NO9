<template>
  <Table :data="historyData" border stripe height="200" style="width: 100%">
    <TableColumn type="expand">
      <template slot-scope="props">
        <Form label-position="left" inline class="demo-table-expand">
          <FormItem label="意见">
            <span>{{ props.row.changeThing }}</span>
          </FormItem>
        </Form>
      </template>
    </TableColumn>
    <TableColumn label="序号" type="index" width="50"></TableColumn>
    <TableColumn label="步骤名" prop="nodeName"></TableColumn>
    <TableColumn label="处理人" prop="acceptByName"></TableColumn>
    <TableColumn label="下一步" prop="toNodeName"></TableColumn>
    <TableColumn label="处理意见" prop="content"></TableColumn>
    <TableColumn label="处理时间" prop="finishDate"></TableColumn>
  </Table>
</template>

<script>
export default {
  name: 'HistoryOption',
  data() {
    return {
      tableData: [
        {
          id: '12987122',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        },
        {
          id: '12987123',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        },
        {
          id: '12987125',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        },
        {
          id: '12987126',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }
      ]
    }
  },
  props: {
    historyData: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>