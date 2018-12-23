<template>
  <div>
    <!--维修工单走势-->
    <div class="echart-body mt12">
      <!--<div class="search-select echart-query">-->
        <!--<AreaCascader :stage="1" ref="area"></AreaCascader>-->
      <!--</div>-->
      <Select clearable  v-model="value1" placeholder="请选择" class="search-select echart-query">
        <Option v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
        </Option>
      </Select>
      <v-chart :options="wei_xiu_gong_dan_options"/>
    </div>
    <!--维修工单销量分析-->
    <div class="echart-body mt12">
      <Select clearable  v-model="value2" placeholder="请选择" class="search-select echart-query">
        <Option v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value">
        </Option>
      </Select>
      <Select clearable  v-model="value3" placeholder="请选择" class="search-select echart-query">
        <Option v-for="item in options3"
                :key="item.value"
                :label="item.label"
                :value="item.value">
        </Option>
      </Select>
      <Select clearable  v-model="value4" placeholder="请选择" class="search-select echart-query">
        <Option v-for="item in options4"
                :key="item.value"
                :label="item.label"
                :value="item.value">
        </Option>
      </Select>
      <v-chart :options="wei_xiu_gong_dan_xiao_lv_options"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'distribute',
  data() {
    let data = []

    for (let i = 0; i <= 360; i++) {
      let t = i / 180 * Math.PI
      let r = Math.sin(2 * t) * Math.cos(2 * t)
      data.push([r, i])
    }
    return {
      wei_xiu_gong_dan_options: {
        title: {
          text: '维修工单走势'
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
        }]
      },
      wei_xiu_gong_dan_xiao_lv_options: {
        title: {
          text: '维修工单销量分析'
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
        }]
      },
      options1: [
        {
          value: '1',
          label: '年'
        },
        {
          value: '2',
          label: '月'
        },
        {
          value: '3',
          label: '日'
        }
      ],
      options2: [
        {
          value: '1',
          label: '投注单'
        },
        {
          value: '2',
          label: '预制票据'
        },
        {
          value: '3',
          label: '......'
        }
      ],
      options3: [
        {
          value: '1',
          label: 'f110'
        },
        {
          value: '2',
          label: 'f111'
        }
      ],
      options4: [
        {
          value: '1',
          label: '故障类型'
        },
        {
          value: '2',
          label: 'xxx'
        },
        {
          value: '3',
          label: '......'
        }
      ],
      value1: '1',
      value2: '1',
      value3: '1',
      value4: '1'
    }
  }
}
</script>

<style lang="scss">
  @import url('../../../../../../assets/css/echarts-report.scss');
</style>