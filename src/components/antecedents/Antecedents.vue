<!--履历-->

<template>
  <div>
    <div class="timeline-block mb20" v-if="cvData.length > 0">
      <ul  class="lvliTimeline ivu-timeline">
        <li class="lvliTimelineItem ivu-timeline-item" v-for="(item, index) in cvData" :key = "item.id">
          <div class="ivu-timeline-item-tail"></div>
          <div class="ivu-timeline-item-head ivu-timeline-item-head-blue"></div>
          <div class="ivu-timeline-item-content">
            <div class="time">
              <section class="dateTop">{{ item.createDate.split(' ')[0] }}</section>
              <section class="timeBottom">{{ item.createDate.split(' ')[1] }}</section>
            </div>
            <div class="timeLineContent">
            <div class="ivu-alert ivu-alert-info ivu-alert-with-desc">
            <div class="ivu-alert-message">
              {{ index + 1 }}.由【{{ item.createByName }}】发起【{{ item.title }}】- 【{{ item.typeX | getTxt }}】操作
            </div>
              <div class="ivu-alert-desc">

                <div v-if="item.fromWarehouseName">
                  【{{ item.fromWarehouseName }}】出库
                </div>
                <div v-if="item.toWarehouseName">
                  【{{ item.toWarehouseName }}】入库
                </div>

            </div>
            </div>
            </div>
          </div>
        </li>
        <li></li>
      </ul>
    </div>
    <div v-if="cvData.length === 0">
      无记录
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DetailList',
    props: {
      cvData: { //
        type: Array,
        default: function () {
          return []
        }
      }
    },
    watch: {
    },
    data() {
      return {}
    },
    methods: {
    },
    mounted() {
    }
  }

</script>

<style lang="scss">
  .timeline-block {
    padding: 16px;
    border: 1px solid #e9eaec;
    border-radius: 4px;
  }
  .lvliTimeline.ivu-timeline {
    margin-left: 150px;
    position: relative;
    .ivu-timeline-item {
      min-height: 90px;
      .time {
        position: absolute;
        left: -120px;
        text-align: right;
        .dateTop {
          color: #3594cb;
          font-size: 18px;
        }
        .timeBottom {
          color: #80848f;
        }
      }

      .timeLineContent {
        position: relative;
        margin-left: 15px;
        &:before {
          width: 0;
          height: 0;
          content: '';
          display: block;
          position: absolute;
          left: -20px;
          top: 6px;
          border: 10px solid transparent;
        }
      }
      &:nth-child(odd){
        .timeLineContent{
          &:before {
            border-right-color: #d8eafc;
          }
        }
      }
      &:nth-child(even){
        .timeLineContent{
          &:before {
            border-right-color: #d5f3e3;
          }
        }
      }
    }
  }

  .lvliTimelineItem > .ivu-timeline-item-content {
    font-size: 14px !important;
    top: -5px !important;
  }

  .lvliTimeline > .ivu-timeline-item .ivu-timeline-item-head {
    width: 20px;
    height: 20px;
    margin-left: -4px;
  }


  .ivu-timeline{list-style:none;margin:0;padding:0}
  .ivu-timeline-item{margin:0!important;padding:0 0 12px 0;list-style:none;position:relative}
  .ivu-timeline-item-tail{height:100%;border-left:1px solid #e9eaec;position:absolute;left:6px;top:0}
  .ivu-timeline-item-head{width:13px;height:13px;background-color:#fff;border-radius:50%;border:1px solid transparent;position:absolute}
  .ivu-timeline-item-head-blue{border-color:#2d8cf0;color:#2d8cf0}
  .ivu-timeline-item-content{padding:1px 1px 10px 24px;font-size:12px;position:relative;top:-3px}
  .ivu-timeline-item:last-child .ivu-timeline-item-tail{display:none}

  .ivu-alert{position:relative;padding:8px 48px 8px 16px;border-radius:6px;color:#495060;font-size:12px;line-height:16px;margin-bottom:10px}
  .ivu-alert-desc{font-size:12px;color:#495060;line-height:21px;display:none;text-align:justify}.ivu-alert-success{border:1px solid #d1f2e1;background-color:#e8f9f0}
  .ivu-alert-info{border:1px solid #d5e8fc;background-color:#eaf4fe}
  .ivu-alert-with-desc .ivu-alert-desc{display:block}
  .ivu-alert-with-desc .ivu-alert-message{font-size:14px;color:#1c2438;display:block}

  .showDetailBtn {
    color: #2d8cf0;
    cursor: pointer;
  }
</style>
