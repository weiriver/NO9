<template>
    <div>
        <!--耗材区域分布情况-->
        <div class="echart-body">
            <div class="echart-query">

            </div>
            <v-chart :options="storeNumsOptions"/>
        </div>
        <!--耗材区域分布趋势-->
        <div class="echart-body mt12">
            <div class="echart-query">
                <!-- 年份选择 -->
                <Select clearable v-model="yearValue" placeholder="年份" class="search-select"
                        @change="changeYear">
                    <Option v-for="item in yearOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </Option>
                </Select>
            </div>
            <!-- 耗材区域分布走势图 -->
            <v-chart :options="attritionNumsOptions"/>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'distribute',
    data() {
      return {
        storeNumsOptions: {
          title: {
            text: '仓库盘点物品统计',
            subtext: ''
          },
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: [],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              name: '箱',
              type: 'value'
            }
          ],
          series: [
            {
              name: '库存数量',
              type: 'bar',
              barWidth: '60%',
              data: []
            }
          ]
        },
        attritionNumsOptions: {
          title: {
            text: '物品损耗走势',
            subtext: ''
          },
          xAxis: {
            name: '月',
            type: 'category',
            data: []
          },
          yAxis: {
            name: '箱',
            type: 'value'
          },
          series: [{
            data: [],
            type: 'line'
          }]
        },
        // 年份下拉框选项
        yearOptions: [
          {
            value: '2018',
            label: '2018'
          }, {
            value: '2017',
            label: '2017'
          }, {
            value: '2016',
            label: '2016'
          }],
        yearValue: '2018',
        goodsId: '',
        dversionId: ''
      }
    },
    methods: {
      async initAttritionNums(goodsId, dversionId) {
        var res = await this.postJson('ws', {
          apiCode: 501012,
          content: {
            goodsId,
            dversionId,
            year: this.yearValue
            // permissionRegionCodeList: ['650100000000']
          }
        })
        if (res.code == 0) {
          this.attritionNumsOptions.xAxis = [
            {
              type: 'category',
              data: res.content.nameList,
              axisTick: {
                alignWithLabel: true
              }
            }
          ]

          this.attritionNumsOptions.series =
            [
              {
                name: '损耗数量',
                type: 'bar',
                barWidth: '60%',
                data: res.content.countList
              }
            ]

        }
      },
      async initStoreNums(goodsId, dversionId) {
        var res = await this.postJson('ws', {
          apiCode: 501011,
          content: {
            goodsId: Number(goodsId),
            dversionId: Number(dversionId)
            // permissionRegionCodeList: ['650100000000']
          }
        })
        if (res.code == 0) {
          this.storeNumsOptions.xAxis = [
            {
              type: 'category',
              data: res.content.nameList,
              axisTick: {
                alignWithLabel: true
              }
            }
          ]

          this.storeNumsOptions.series = [
            {
              name: '库存数量',
              type: 'bar',
              barWidth: '60%',
              data: res.content.countList
            }
          ]
        }
      },
      // 改变年份，触发改变区域分布走势
      changeYear() {
        if (this.yearValue) {
          this.initAttritionNums(this.goodsId, this.dversionId)
        }
      }
    },
    mounted() {
      var queryArray = location.hash.split('?')[1].split('&')
      this.goodsId = queryArray[0].split('=')[1]
      this.dversionId = queryArray[1].split('=')[1]
      this.initStoreNums(this.goodsId, this.dversionId)
      this.initAttritionNums(this.goodsId, this.dversionId)
    }
  }
</script>

<style lang="scss">
    @import url('../../../../../../assets/css/echarts-report.scss');
</style>