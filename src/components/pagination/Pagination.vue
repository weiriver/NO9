<template>
  <div class="pagination">
    <EPagination
       @current-change="handleCurrentChange"
       :current-page.sync="currentPage"
       :page-size="pageSize"
       background
       layout="total, prev, pager, next, jumper"
       :total="totalCount">
    </EPagination>
  </div>
</template>
<script>
// import {mapMutations, mapState} from 'vuex'

export default {
  props: {
    totalCount: {
      type: Number,
      default: 20
    },
    pageSize: {
      type: Number,
      default: 20
    }
  },
  methods: {
    async init() {
      this.Event.$on('pageInit', (val) => {
        console.log('分页初始化', val)
        this.currentPage = val
      })
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      // this.setCurrentPage(val)
      this.Event.$emit('pagechange', val)
    }
    // ...mapMutations({
    //   setCurrentPage: 'SET_CURRENTPAGE'
    // })
  },
  beforeDestroy() {
    this.Event.$off('pageInit')
    this.Event.$off('pagechange')
  },
  data() {
    return {
      currentPage: 1
    }
  },
  mounted() {
    this.init()
  }
  // computed: {
  //   ...mapState([
  //     // 当前页码
  //     'currentPage'
  //   ])
  // }
}
</script>
<style lang="scss">
  .pagination {
    text-align: right;
    padding: 10px 0;
  }

  /* 重置样式，尽量和iview_ui样式靠拢 */
  .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li {
    background-color: #fff;
    color: #606266;
    border-radius: 4px;
    border: 1px solid #f1f1f1;
    font-weight: normal;
  }
</style>
