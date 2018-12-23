<template>
  <div>
    <Popover placement="bottom"
             width="60"
             trigger="hover"
             class="pointer"
             content="">
      <div slot="reference" class="set">
        <img src="./img/set.png" class="set-img"/>
      </div>
      <div style="text-align: center">
        <div class="popover-line pointer"  @click="$router.push('/sysSetup/systemManage/decksubsys')">系统设置</div>
      </div>
    </Popover>
  </div>
</template>
<script>

export default {
  name: 'systemset'
}
</script>

<style lang="scss" scoped>
  .popover-line {
    line-height: 15px;
    &:hover {
      background: $table-bg-color;
    }
  }
  .user_item{
    margin-right: 12px;
  }
  .set>.set-img{
      width: 40px;
      height: 40px;
  }
</style>


