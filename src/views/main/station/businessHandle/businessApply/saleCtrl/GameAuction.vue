<template>
  <div>我是第{{msg}}页面</div>
</template>

<script>
export default {
  name: 'a',
  data() {
    return {
      msg: parseInt(Math.random() * 10000)
    }
  }
}
</script>

<style scoped>

</style>