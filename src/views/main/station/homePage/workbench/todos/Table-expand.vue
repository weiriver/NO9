<template>
  <div>
    <Row class="expand-row">
      <myCol span="24">
        <span class="expand-key">意见: </span>
        <span class="expand-value">{{ row.changeThing?row.changeThing:'--' }}</span>
      </myCol>
    </Row>
  </div>
</template>
<script>

  export default {
    props: {
      row: Object
    },
    components: {
      'myCol': Col,
      Row
    }
  }
</script>
<style scoped>
  .expand-row {
    margin-bottom: 16px;
  }
</style>
