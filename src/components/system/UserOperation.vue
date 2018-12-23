<template>
  <div class="user_container">
    <SystemSet class="user_item" />
    <SiteMessages :module="'storage'" class="user_item"/>
    <Feedback class="user_item"/>
    <SystemOperations class="user_item" />
  </div>
</template>

<script>
import SystemOperations from './SystemOperations'
import Feedback from './Feedback'
import SiteMessages from './SiteMessages'
import SystemSet from './SystemSet'
// import {Message} from 'iview'
export default {
  components: {SystemOperations, Feedback, SiteMessages, SystemSet},
  props: {
    module: {
      type: String,
      default: 'account'
    }
  },
  created: function () {
    // let modules = ['account', 'station', 'inspect', 'ids']
    // if (this.module !== '' && modules.indexOf(this.module) === -1) {
    //   Message.error('子系统类型：[' + this.module + ']不存在,请确认(\'account\', \'station\', \'inspect\', \'ids\')')
    // }
  }
}
</script>

<style>
  .user_container {
    float: right;
  }

  .user_item {
    color: white;
    display: inline-block;
    margin-right: 20px;
    height: 50px;
    line-height: 50px;
    vertical-align: top;
  }
  .user_item:last-of-type {
    margin-right: 0;
  }

  .user_item img {
    height: 36px;
    width: 36px;
    vertical-align: middle;
  }

  .el-popover{
    min-width: auto;
  }
</style>
