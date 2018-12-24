<template>
  <Container>
    <Header>
      <MyHeader></MyHeader>
    </Header>
    <Main>
      <router-view class="HMF-main-view"></router-view>
    </Main>
    <Footer>
      <MyFooter></MyFooter>
    </Footer>
  </Container>


</template>

<script>
import MyHeader from '@/components/header/Header'
import MyFooter from '@/components/footer/Footer'

export default {
  name: 'Subindex',
  data: function () {
    return {}
  },
  methods: {},
  async mounted() {
  },
  beforeMount() {
  },
  components: {MyHeader, MyFooter}
}
</script>

<style lang="scss">
  .el-container {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
    min-height: calc(100% - 60px);;
  }
</style>
