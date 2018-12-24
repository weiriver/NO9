<template>
  <Container>
    <Header>
      <MyHeader></MyHeader>
    </Header>
    <Container>
      <Aside width="120px">Aside</Aside>
      <Main>
        <router-view class="HMF-main-view"></router-view>
      </Main>
    </Container>
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
</style>
