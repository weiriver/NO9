<template>
  <div class="mysteps">
    <div class="left">
      <div class="top">
        <Tag type="success">
          已处理
        </Tag>
        <Tag type="danger">
          待处理
        </Tag>
        <Tag type="info">
          未处理
        </Tag>
      </div>
      <Flowchart :nodeList='nodeList' :currentNodeCode="currentNodeCode" @itemClick='itemClick'></Flowchart>
    </div>

    <div class="right">
      <div v-show="!applyDetail">
        <h3>{{detailTitle}}</h3>
        <div class="flow-list">

          <!--处理人-->
          <div class="flow-line" v-if="!isLastNode">
            <div class="flow-name">
              <span>{{isLastNode?'档案分发人':'处理人'}}</span>
            </div>
            <div class="flow-value">
              <div v-if="Obj.acceptByType">
                {{Obj.acceptByName}}
                <!--<Input readonly :autosize="true" type="textarea" v-model="Obj.acceptByName"></Input>-->
              </div>

            </div>
          </div>
          <!--处理人类型-->
          <div class="flow-line" v-if="!isLastNode">
            <div class="flow-name">
              处理人类型
            </div>
            <div class="flow-value">
              {{Obj.acceptByType | getTxt}}
            </div>
          </div>
          <!--知会-->
          <div class="flow-line" v-if="!isLastNode">
            <div class="flow-name">
              知会
            </div>
            <div class="flow-value">
              {{Obj.ccByName}}
            </div>
          </div>
          <!--处理时限类型-->
          <div class="flow-line" v-if="!isLastNode">
            <div class="flow-name">
              处理时限类型
            </div>
            <div class="flow-value">
              {{Obj.timeLimitType |getTxt }}
            </div>
          </div>
          <!--处理时限-->
          <div class="flow-line" v-if="!isLastNode">
            <div class="flow-name">
              处理时限<em style="color: #495060"
                      v-if="Obj.timeLimitType && Obj.timeLimitType.value === 'relativeTime' ">(天)</em>
            </div>
            <div class="flow-value">
              {{Obj.timeLimit}}
            </div>
          </div>
          <!--任务类型-->
          <div class="flow-line" v-if="!isLastNode">
            <div class="flow-name">
              任务类型
            </div>
            <div class="flow-value">
              {{Obj.taskType | getTxt}}
            </div>
          </div>
          <!--查看处理情况-->
          <div class="flow-line" v-if="isLastNode">
            <div class="flow-name">
              查看处理情况
            </div>
            <div class="flow-value">
              {{Obj.showDetail?'是':'否'}}
            </div>
          </div>
          <!--消息提醒：是-->
          <div class="flow-line">
            <div class="flow-name">
              消息提醒
            </div>
            <div class="flow-value">
              {{Obj.sendMsg?'是':'否'}}
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'mysteps',
  props: {
    currentNodeCode: { // 按钮的位置，通过该属性进行修改
      type: String,
      default: ''
    },
    nodeList: { // 弹窗的checkbox的数组
      type: Array,
      default: []
    }
  },
  data: function () {
    return {
      applyDetail: true, // 默认显示‘申请’详情
      Obj: {}, // 详情
      detailTitle: '申请', // 默认显示‘申请’详情
      isLastNode: false // 是否是最后一个节点，默认否
    }
  },
  methods: {
    itemClick(val) {
      console.log(val)
      var index = val.index
      if (index == this.nodeList.length - 1) {
        this.isLastNode = true
      } else {
        this.isLastNode = false
      }
      this.Obj = val.item
      console.log(this.Obj)
      this.detailTitle = val.item.nameX
      if (index === 0 || index === 1) {
        this.applyDetail = true
      } else {
        this.applyDetail = false
      }
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
  .mysteps {
    line-height: 20px;
    display: flex;
    justify-content: flex-start;
    align-content: center;
    .left {
      width: 350px;
      .top {
        width: 250px;
        display: flex;
        justify-content: space-around;
        align-content: center;
        margin: 20px auto;
      }
    }
    .right {
      flex: 1;
      .flow-list {
        font-size: 14px;
        color: #606266;
        width: 80%;
        .flow-line {
          display: flex;
          margin-top: 12px;
          .flow-name {
            min-width: 100px;
            background-color: $list-title-bg-color;
            min-height: 20px;
            border: 1px solid $border-color;
            border-radius: 4px 0 0 4px;
            padding: 4px;
            text-align: right;
          }
          .flow-value {
            min-width: 200px;
            border: 1px solid $border-color;
            min-height: 20px;
            flex: 1;
            padding: 4px;
            text-align: left;
            border-left: none;
            border-radius: 0 4px 4px 0;
          }
        }
      }

    }
  }
</style>
