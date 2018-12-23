
<template>
  <div class="situation-div">

    <div class="statistics-div">
      <div class="line">
        <div class="box">
          <div class="title">
            设备总数
          </div>
          <div class="num">
            800
          </div>
        </div>

        <div class="box">
          <div class="title">
            待维修设备
          </div>
          <div class="num">
            800
          </div>
        </div>

        <div class="box">
          <div class="title">
            故障率
          </div>
          <div class="num">
            8%
          </div>
        </div>

        <div class="box">
          <div class="title">
            已处理工单数
          </div>
          <div class="num">
            800
          </div>
        </div>
      </div>
    </div>

    <div class="todo-div">
      <div class="todo-title">
        <span>
          消息及待办事宜
        </span>
        <span>
          more
        </span>
      </div>
      <div class="todo-content">
        xxx 站点发起 xxx 设备维修工单 xxxxx
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'situation',
    data: function () {
      return {
        value4: '1',
        timeOptions: [
          {
            value: '1',
            label: '今日'
          },
          {
            value: '2',
            label: '昨日'
          },
          {
            value: '3',
            label: '近七天'
          },
          {
            value: '4',
            label: '近30天'
          }
        ]
      }
    },
    methods: {
    },
    mounted() {
    }
  }
</script>

<style lang="scss">
  .situation-div {
    padding: 0 20px;
    .statistics-div {
      .line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        .box {
          width: 180px;
          height: 100px;
          text-align: center;
          border: 1px solid $border-color;
          line-height: 40px;
          .title {
            font-size: 12px;
          }
          .num {
            font-size: 40px;
          }
        }
      }
    }
    .todo-div {
      border: 1px solid $border-color;
      height: 300px;
      margin-top: 20px;
      .todo-title {
        border-bottom: 1px solid $border-color;
        padding: 0 20px;
        height: 40px;
        color: #ffffff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: $main-color;
      }
      .todo-content {
        padding: 20px;
      }
    }
  }
</style>