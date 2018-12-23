<template>
  <div>
    <Antecedents :cvData="cvData"></Antecedents>

  </div>
</template>

<script>
  export default {
    name: 'Subindex',
    data: function () {
      return {
        cvData: []
      }
    },
    methods: {
      async getData(id) {
        var res = await this.postJson('ws', {
          apiCode: 501402,
          content: {
            code: id
          }
        })
        console.log('res.content', res.content)
        this.cvData = res.content
      },
    },
    mounted() {
      let id = this.$route.params.id
      this.getData(id)
    }
  }
</script>

<style></style>