<template>
  <div class="table-page">

    <!--按钮组-->
    <div class="btn-groups">

      <!--外部按钮组-->
      <div class="btn-groups-left">
        <ButtonGroup>
          <Button type="primary" @click="isCollapse=!isCollapse" v-if="showPowerSearch" icon="el-icon-search"
                  id="query">
            <span v-if="!showStatBtn">查询</span>
            <span v-if="showStatBtn">统计条件</span>
          </Button>
          <slot name="btn_groups"></slot>
        </ButtonGroup>
      </div>

      <!--高级搜索 或 统计条件-->
      <div class="btn-groups-right" v-if="showPowerSearch">
        <!--<Button type="primary" @click="isCollapse=!isCollapse">-->
        <!--<span v-if="!showStatBtn">高级搜索</span>-->
        <!--<span v-if="showStatBtn">统计条件</span>-->
        <!--</Button>-->
      </div>

    </div>

    <!--高级搜索内容 或 统计条件内容-->
    <div>
      <Card class="mb12" v-show="isCollapse" shadow="never">
        <div class="content_title">
          <span v-if="!showStatTitle">查询条件</span>
          <span v-if="showStatTitle">统计汇总条件</span>
        </div>

        <slot name="query"></slot>
      </Card>
    </div>

    <!--表格-->
    <div>
      <slot name="TableSlot"></slot>
    </div>

    <!-- 报表 -->
    <div>
      <slot name="Report"></slot>
    </div>


    <!--分页-->
    <div>
      <Pagination :totalCount="totalCount*1" v-if="showPagination"></Pagination>
    </div>


  </div>
</template>

<script>


export default {
  data() {
    return {
      isCollapse: false
    }
  },
  props: {
    firstIsCollapse: {
      type: Boolean,
      default: false
    },
    showPowerSearch: {
      type: Boolean,
      default: true
    },
    totalCount: {
      type: [Number, String],
      default: 20
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    showStatBtn: {
      type: Boolean,
      default: false
    },
    showStatTitle: {
      type: Boolean,
      default: false
    }
  },
  components: {
    // Pagination
  },
  methods: {},
  mounted() {
    // 第一次渲染，假如搜索宽初始化为展开状态的话
    if (this.firstIsCollapse) {
      this.isCollapse = true
    }
  }
}
</script>

<style lang="scss">
  /*列表页样式*/
  .table-page {
    text-align: left;
    /* 顶部按钮组 */
    .btn-groups {
      display: flex;
      margin-bottom: 12px;
      /*左侧按钮组*/
      .btn-groups-left {
        flex: 1;
        .el-button-group {
          width: 100%;
          button:only-of-type {
            /*border-color: transparent;*/
          }
        }
        #query + div {
          display: inline-block;
          button:nth-of-type(1) {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        }
      }
      /*高级搜索*/
      .btn-groups-right {
        width: 120px;
        text-align: right;
      }
    }
  }
</style>
