<template>
  <div class="detail-list-component">
    <h3 class="mt10 mb20" v-if="isShowTitle">
       {{ title }}
    </h3>
    <div class="detail-list mt20 mb20">
      <div class="detail-line" v-for="(item, index) in detailList" v-if="index % 2 === 0">
        <div class="detail-left">
          <div class="keyName">
            {{ item[keyName] }}
          </div>
          <div class="valueName">
            {{ item[valueName] }}
          </div>
        </div>
        <div class="detail-left" v-if="detailList[index + 1]">
          <div class="keyName">
            {{ detailList[index + 1][keyName] }}
          </div>
          <div class="valueName">
            {{ detailList[index + 1][valueName] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DetailList',
    props: {
      detailList: { //
        type: Array,
        default: function () {
          return []
        }
      },
      // 标题
      title: { // 名称
        type: String,
        default: '基本信息'
      },
      // 标题显示与隐藏--By:严凤
      isShowTitle: {
        type: Boolean,
        default: true
      },
      // 名称的keyName
      keyName: { // 名称
        type: String,
        default: 'name'
      },
      // 内容的 Key
      valueName: { // 内容
        type: String,
        default: 'value'
      }
    },
    watch: {
      detailList(val) {
        console.log(val)
        // console.log('detailList变化', this.detailList, val)
      }
    },
    data() {
      return {}
    },
    methods: {
      formatList () {
      }
    },
    mounted() {
      // console.log('this.detailList', this.detailList)
    }
  }

</script>

<style lang="scss">
  .detail-list-component {
    .detail-list{
      font-size: 14px;
      color: #606266;
      .detail-line {
        display: flex;
        justify-content: space-between;
        min-height: 20px;
        .detail-left {
          display: flex;
          justify-content: center;
          width: 48%;
          .keyName {
            min-width: 140px;
            background-color: $list-title-bg-color;
            min-height: 20px;
            border: 1px solid $border-color;
            padding: 10px;
            text-align: right;
          }
          .valueName {
            min-width: 200px;
            border: 1px solid $border-color;
            min-height: 20px;
            flex: 1;
            padding: 10px;
            text-align: left;
            border-left: none ;
            word-break: break-all;
          }
        }
      }
      .detail-line + .detail-line {
        .keyName {
          border-top: none;
        }
        .valueName {
          border-top: none;
        }
      }
    }
  }
</style>