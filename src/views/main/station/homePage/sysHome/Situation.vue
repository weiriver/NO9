<template>
  <div class="index">
    <div class="indexInner">
      <div class="indexInnerTop">
        <div class="top2">
          <div class="top2Div">
            <!--<div class="labelDiv">-->
            <!--<img src="../../../../../assets/img/imfor/临时.png"/>-->
            <!--</div>-->
            <div class="content-title mt10">个人信息</div>
            <!--<p class="p">暂无发布区域为全省的图片广告</p>-->
            <div class="middle" v-if="isLeftNone">
              暂无权限
            </div>
            <div v-if="!isLeftNone">
              <ul>
                <li v-if="nums.finishCount != -1">
                  <router-link to="/index/done">
                    (1) 您有{{ nums.finishCount }}项
                    <span>
                    已办
                  </span>
                    任务
                  </router-link>
                </li>
                <li v-if="nums.waitCount != -1">
                  <router-link to="/index/todos">
                    (2) 您还需要处理{{ nums.waitCount }}项
                    <span>
                    待办
                  </span>
                    任务
                  </router-link>
                </li>
                <li v-if="nums.applyCount != -1">
                  <router-link to="/index/apply">
                    (3) 您有{{ nums.applyCount }}项正在
                    <span>
                    申请
                  </span>
                    中任务
                  </router-link>
                </li>
                <li v-if="nums.archiveCount != -1">
                  <router-link to="/index/file">
                    (4) 您参与的{{ nums.archiveCount }}项
                    <span>
                    已归档
                  </span>
                    流程
                  </router-link>
                </li>
              </ul>
              <div class="bottom">
                <span>还可管理流程、安排日程、发送消息及个性化设置等</span>
              </div>
            </div>

          </div>
          <div class="top2Div">
            <div class="content-title mt10">站点管理</div>
            <div class="middle" v-if="isLightNone">
              暂无权限
            </div>
            <div v-if="!isLightNone">
              <ul>
                <li v-if="nums.regionCount != -1">
                  <router-link to="/manage/sitesList">
                    (1) 在您能查看的{{ nums.regionCount }}个
                    <span>
                    区域
                  </span>
                    内，共{{ nums.stationCountRegions }}个站点
                  </router-link>
                </li>
                <li v-if="nums.stationCountProvince != -1">
                  <router-link to="/manage/sitesList">
                    (2) 您所在的全省，已开通{{ nums.stationCountProvince }}个
                    <span>
                    站点
                  </span>
                  </router-link>
                </li>
                <li v-if="nums.rewardCount != -1 || nums.punishCount != -1" style="border-bottom: 1px dashed #EAEAEA">
                  <router-link to="/manage/jiangCheng">
                    (3) 您管辖范围内有{{ jiangchengNum }}个站点收到奖惩
                    <span>
                    奖惩消息
                  </span>
                    {{ jiangchengDetail }}
                  </router-link>
                </li>
              </ul>
              <div class="bottom">
                <span>还可查看站点信息、站点业务、区域分析等</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Situation',
  data() {
    return {
      msg: '',
      Obj: {
        apiCode: 200003,
        sysModule: 'station'
      },
      nums: []
    }
  },
  computed: {
    jiangchengNum: function () {
      if (this.nums.rewardCount == -1 && this.nums.punishCount != -1) {
        return this.nums.punishCount
      } else if (this.nums.punishCount == -1 && this.nums.rewardCount != -1) {
        return this.nums.rewardCount
      } else if (this.nums.punishCount != -1 && this.nums.rewardCount != -1) {
        return this.nums.rewardCount + this.nums.punishCount
      } else {
        return 0
      }
    },
    jiangchengDetail: function () {
      if (this.nums.rewardCount == -1 && this.nums.punishCount != -1) {
        return `（${this.nums.punishCount}个受处罚）`
      } else if (this.nums.punishCount == -1 && this.nums.rewardCount != -1) {
        return `（${this.nums.rewardCount}条嘉奖）`
      } else if (this.nums.punishCount != -1 && this.nums.rewardCount != -1) {
        return `（${this.nums.rewardCount}条嘉奖,${this.nums.punishCount}个受处罚）`
      } else {
        return `（0条嘉奖，0个受处罚）`
      }
    },
    isLeftNone: function () {
      return this.nums.finishCount === -1 && this.nums.waitCount === -1 && this.nums.applyCount === -1 && this.nums.archiveCount === -1
    },
    isLightNone: function () {
      return this.nums.regionCount === -1 && this.nums.stationCountProvince === -1 && this.nums.rewardCount === -1 && this.nums.punishCount === -1
    }
  },
  methods: {
    // 查询
    query() {
      this.postJson('common', this.Obj).then(res => {
        console.log('res', res.content)
        this.nums = res.content
      })
    }
  },
  mounted() {
    this.query()
  }
}
</script>

<style lang="scss" scoped>

  .indexInner {
    box-sizing: border-box;
    width: 100%;
    /*padding: 10px 10px 0;*/
    height: 100%;
    background: #EEF3F6;
    .indexInnerTop {
      .top2 {
        min-height: 212px;
        min-width: 710px;
        display: flex;
        .top2Div {
          background: white;
          flex: 1;
          /*height: 95px;*/
          min-height: 212px;
          min-width: 345px;
          margin-right: 10px;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          border: 1px solid #ecedef;
          text-align: center;
          position: relative;
          .middle {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
          .bottom {
            height: 40px;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            border-top: 1px solid #e6e7e9;
            text-align: left;
            margin: 0 16px;
            color: #36474F;
            span {
              line-height: 40px;
              font-size: 14px;
              font-weight: 600;
              &:first-child {
                padding-left: 14px;
              }
              a {
                float: right;
                margin-right: 20px;
              }
            }

          }
          .labelDiv {
            width: 75px;
            height: 75px;
            position: absolute;
            left: 14px;
            top: -30px;
            background: #012139;
            border-radius: 5px;
            img {
              width: 35px;
              height: 35px;
              margin: 20px auto;
            }
          }
          .titleDiv {
            margin-top: 10px;
            height: 25px;
            text-align: left;
            text-indent: 16px;
            border-left: 3px solid #F5A624;
            p {
              font-size: 10px;
              line-height: 20px;
              color: #80848f;
              white-space: nowrap;
            }
            h3 {
              color: #1c2438;
              font-size: 14px;
              line-height: 25px;
              font-weight: 900;
            }
          }
          .p {
            position: absolute;
            left: 50%;
            top: 50%;
            -webkit-transform: translate(-50%);
            -moz-transform: translate(-50%);
            -ms-transform: translate(-50%);
            -o-transform: translate(-50%);
            transform: translate(-50%);
            white-space: nowrap;
            color: #ff9900;
            font-size: 12px;
          }
          ul {
            margin: 10px 16px 0 16px;
            text-align: left;
            border-top: 1px solid #EAEAEA;
            /*border-bottom: 1px solid #EAEAEA;*/
            li {
              height: 29px;
              line-height: 29px;
              border-bottom: 1px dashed #e6e7e9;
              padding-left: 14px;
              padding-right: 40px;
              color: #6d7380;
              i {
                font-style: normal;
                padding-right: 25px;
              }
              a {
                color: #6d7380;
                font-size: 12px;
                span {
                  color: red;
                }
              }
            }
            li:nth-last-of-type(1) {
              border-bottom: 0;
            }
            li:hover {
              background: #ebf7ff;
              i {
                color: #2d8cf0;
              }
              a {
                text-decoration: underline;
                color: #2d8cf0;
              }
            }
          }
        }
        // 设置阴影hover
        .top2Div:hover {
          box-shadow: 0px 0px 5px 2px rgba(153, 153, 153, 0.2);
        }
        div:nth-last-of-type(1) {
          margin-right: 0;
        }
      }
    }
  }
</style>
