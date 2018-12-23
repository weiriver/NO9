<template>
  <div class="bread-crumb-div  border-bottom">
    <Breadcrumb separator="/" class="breadcrumb">
      <BreadcrumbItem v-for="(item) in breadcrumbItemList" :key="item.id" :to="{ path: item.to }">{{item.name}}
      </BreadcrumbItem>
    </Breadcrumb>
    <div class="bread-crumb-div-backBtn">
      <!--<Button type="ghost" @click="backClick">返回</Button>-->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    name: 'manage',
    data() {
      return {
      }
    },
    props: {
      // 列表数组暂不从父组件传进来，如以后有需要再开放该功能
      breadcrumbItemList: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    methods: {
      backClick() {
        this.$router.go(-1)
      }
    },
    computed: {
    },
    beforeCreate() {
    },
    mounted() {
    },
    updated() {
    },
    created() {
    },
    watch: {
    }
  }
</script>

<style scoped>
  .bread-crumb-div {
    display: flex;
    justify-content: space-between;
    align-content: center;
    margin: 6px 0 10px;
  }
  .breadcrumb {
    height: 34px;
    line-height: 34px;

  }
  .bread-crumb-div-backBtn {

  }
</style>
