<template>
  <div class="developAnalysis wrapper">
    <div>
      <Form :inline="true" class="form-inline" label-width="140px">
        <FormItem label="对比区域" prop="hallCode">
          <Select
                  v-model="selectCity"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择">
            <Option
                    v-for="item in cityList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="compare">对比</Button>
        </FormItem>
      </Form>
    </div>
    <div id="analyser">
      <div class="content-title">省最高、最低对比</div>
      <Chart :id="'analyserChart'" :option="analyserOption" ref="analyserChart"></Chart>
    </div>
    <div class="analysisCompareTable">
      <Table stripe :data="data1" border style="width: 100%">
        <TableColumn label="序号" type="index" width="60"></TableColumn>
        <TableColumn label="区域" prop="regionName"></TableColumn>
        <TableColumn label="总销量(万元)" prop="totalMoney">
          <template slot-scope="scope">
            <div>{{(parseInt(scope.row.totalMoney) / 10000).toFixed(2)}}</div>
          </template>
        </TableColumn>
        <TableColumn label="电脑销量(万元)" prop="dnSale">
          <template slot-scope="scope">
            <div>{{(parseInt(scope.row.dnSale) / 10000).toFixed(2)}}</div>
          </template>
        </TableColumn>
        <TableColumn label="即开销量(万元)" prop="jkSale">
          <template slot-scope="scope">
            <div>{{(parseInt(scope.row.jkSale) / 10000).toFixed(2)}}</div>
          </template>
        </TableColumn>
        <TableColumn label="中福销量(万元)" prop="zfSale">
          <template slot-scope="scope">
            <div>{{(parseInt(scope.row.zfSale) / 10000).toFixed(2)}}</div>
          </template>
        </TableColumn>
        <TableColumn label="人均销量(元)" prop="singleSale"></TableColumn>
        <TableColumn label="电脑人均销量(元)" prop="singleDnSale"></TableColumn>
        <TableColumn label="即开人均销量(元)" prop="singleJkSale"></TableColumn>
        <TableColumn label="中福人均销量(元)" prop="singleZfSale"></TableColumn>
        <TableColumn label="彩票发展指数" prop="genlotIndex"></TableColumn>
        <TableColumn label="彩票消费指数" prop="consumeIndex"></TableColumn>
        <TableColumn label="区域发展指数" prop="acreaIndex"></TableColumn>
        <TableColumn label="单站服务面积(m²)" prop="singleAcrea"></TableColumn>
        <TableColumn label="单站服务人数(人/站)" prop="singlePopulation"></TableColumn>
      </Table>
    </div>
  </div>
</template>

<script>
  import Chart from '@/components/chart/Chart'
export default {
  name: 'developAnalysis',
  components: {
    Chart
  },
  data() {
    return {
      cityList: [],
      selectCity: [],
      data1: [],
      totalArea: ['max', 'min', 'average'],
      captialCode: '410100000000',
      // echart图配置项
      analyserOption: {
        title: {
          text: ''
        },
        tooltip: {
          backgroundColor: '#0d8ecf',
          position: function (pos, params, el, elRect, size) {
            var obj = {
              top: 10
            }
            obj[['left', 'right'][+(pos[0] > size.viewSize[0] / 2)]] = 10
            return obj
          },
          extraCssText: 'width: 170px'
        },
        legend: {
          type: 'scroll',
          x: 'center',
          bottom: '50',
          data: []
        },
        radar: [
          {
            indicator: [
              {
                name: '总销量',
                max: 20000
              },
              {
                name: '人均销量',
                max: 20000
              },
              {
                name: '彩票发展指数',
                max: 40000
              },
              {
                name: '彩票消费指数',
                max: 40000
              },
              {
                name: '区域发展指数',
                max: 60000
              },
              {
                name: '单站服务面积',
                max: 60000
              },
              {
                name: '单站服务人数',
                max: 30000
              }],
            center: ['32%', '35%'],
            radius: 70
          },
          {
            indicator: [
              {
                name: '电脑票销量',
                max: 20000
              },
              {
                name: '即开票销量',
                max: 40000
              },
              {
                name: '中福票销量',
                max: 40000
              },
              {
                name: '电脑票人均销量',
                max: 60000
              },
              {
                name: '即开票人均销量',
                max: 30000
              },
              {
                name: '中福票人均销量',
                max: 60000
              }],
            center: ['70%', '35%'],
            radius: 70
          }],
        series: [
          {
            type: 'radar',
            name: '',
            areaStyle: {
              normal: {}
            },
            data: []
          },
          {
            type: 'radar',
            name: '',
            radarIndex: 1,
            areaStyle: {
              normal: {}
            },
            data: []
          }]
      }
    }
  },
  methods: {
    async getData() {
      let res = await this.postJsonWithMask('station', {apiCode: 300175})
      this.dataList = res.content
      this.setMaxValue(this.dataList)
      this.getSelectList(this.dataList)
      this.cityList = []
      this.dataList.filter(data => this.totalArea.indexOf(data.regionCode) < 0).forEach(data => {
        if (this.captialCode == data.regionCode) {
          this.cityList.splice(0, 0, {value: data.regionCode, label: data.regionName})
          this.selectCity = [data.regionCode]
        } else {
          this.cityList.push({value: data.regionCode, label: data.regionName})
        }
      })
    },
    setMaxValue(list) {
      if (!list) {
        return
      }
      let maxData = list.filter(data => data.regionCode === 'max')[0]
      if (maxData) {
        this.analyserOption.radar[0].indicator[0].max = maxData.totalMoney
        this.analyserOption.radar[0].indicator[1].max = maxData.singleSale
        this.analyserOption.radar[0].indicator[2].max = maxData.genlotIndex
        this.analyserOption.radar[0].indicator[3].max = maxData.consumeIndex
        this.analyserOption.radar[0].indicator[4].max = maxData.acreaIndex
        this.analyserOption.radar[0].indicator[5].max = maxData.singleAcrea
        this.analyserOption.radar[0].indicator[6].max = maxData.singlePopulation

        this.analyserOption.radar[1].indicator[0].max = maxData.dnSale
        this.analyserOption.radar[1].indicator[1].max = maxData.jkSale
        this.analyserOption.radar[1].indicator[2].max = maxData.zfSale
        this.analyserOption.radar[1].indicator[3].max = maxData.singleDnSale
        this.analyserOption.radar[1].indicator[4].max = maxData.singleJkSale
        this.analyserOption.radar[1].indicator[5].max = maxData.singleZfSale
      }
    },
    getSelectList(list) {
      let init = this.totalArea.concat([this.captialCode])
      let datas = list.filter(data => init.indexOf(data.regionCode) >= 0)
      this.renderEchart(datas)
    },
    renderEchart(datas) {
      // 先清空数据
      this.analyserOption.legend.data = []
      this.analyserOption.series[0].data = []
      this.analyserOption.series[1].data = []
      this.data1 = datas
      datas.forEach(data => {
        this.analyserOption.legend.data.push(data.regionName)
        let leftArray = [data.totalMoney, data.singleSale, data.genlotIndex, data.consumeIndex, data.acreaIndex, data.singleAcrea, data.singlePopulation]
        let rightArray = [data.dnSale, data.jkSale, data.zfSale, data.singleDnSale, data.singleJkSale, data.singleZfSale]
        this.analyserOption.series[0].data.push({value: leftArray, name: data.regionName})
        this.analyserOption.series[1].data.push({value: rightArray, name: data.regionName})
      })
    },
    // 对比
    compare() {
      var selectArea = this.selectCity.concat(this.totalArea)
      let datas = this.dataList.filter(data => selectArea.indexOf(data.regionCode) >= 0)
      setTimeout(() => {
        this.renderEchart(datas)
      }, 500)
    }
  },
  mounted() {
    this.getData()
  }
}
</script>

<style lang="scss">
  @import "../../../../../../assets/css/station/zoneAnalysis";
  .developAnalysis{
    overflow-y: auto;
    #analyser {
      width: 100%;
      height: 300px;
      /*border-bottom: 10px solid #EEF3F6;*/
      .content-title{
        text-align: left;
        text-indent: 16px;
        border-left: 3px solid #f5a624;
        color: #1c2438;
        font-size: 14px;
        line-height: 25px;
        font-weight: 900;
        margin: 14px 0;
      }
    }
    .analysisCompareTable {
      box-sizing: border-box;
      padding: 12px 8px;
    }
  }
</style>