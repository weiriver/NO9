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
    return {
    }
  },
  methods: {
  },
  async mounted() {
  },
  beforeMount() {
  },
  components: {MyHeader, MyFooter}
}
</script>

<style lang="scss">
</style>
