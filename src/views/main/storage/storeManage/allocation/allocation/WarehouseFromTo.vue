<template>
  <Cascader
     separator=" 出库到 "
     :options="options"
     v-model="fromTo"
     :clearable="true"
     @active-item-change="handleItemChange"
     :props="props"
  ></Cascader>
</template>

<script>
export default {
  data() {
    return {
      fromTo: [],
      currentRegionCode: '',
      fromWareHouseList: [],
      toWareHouseList: [],
      options: [],
      props: {
        label: 'label',
        value: 'value',
        children: 'cities'
      }
    }
  },
  props: {
    value: {
      type: Array,
      default: []
    }
  },
  watch: {
    fromTo(val) {
      if (val) {
        this.$emit('fromTo', val)
        this.$emit('input', val)
      }
    }
  },
  methods: {
    async handleItemChange(val) {
      let toWarehouseList = await this.matchWarehouseList(val)
      this.$set(this.options[toWarehouseList.index], 'cities', toWarehouseList.toArr)
    },
    matchWarehouseList(arr) {
      let from = arr[0] ? arr[0] : ''
      return new Promise(resolve => {
        if (from) {
          let index = 0
          let firstLevelType = 'center'
          // 判断当前点击的是第几个
          let firstWarehouse = this.fromWareHouseList.find((v, i) => {
            if (v.id == from) {
              console.log('一级仓库', v)
              index = i
              firstLevelType = v.typeX.value
              return v
            }
          })
          // 过滤
          let toArr = this.toWareHouseList.filter(v => {
            /**
             *  中心   中心--地市   地市--地市
             *  地市   地市--地市   地市--片区  片区--片区
             */
            if (v.id != firstWarehouse.id) { // 排除掉已经选择的仓库
              if (firstLevelType == 'center') {
                return v.typeX.value == 'city'
              }
              if (firstLevelType == 'city') {
                // 第一级所选中的对象的所属区域，如果不是当前用户的区域，则第二级必须为当前用户区域的仓库
                let firstLevelRegionCode = this.fromWareHouseList[index].regionCode
                if (firstLevelRegionCode != this.currentRegionCode) {
                  return (v.typeX.value == 'city' || v.typeX.value == 'zone') && v.regionCode == this.currentRegionCode
                } else {
                  return v.typeX.value == 'city' || v.typeX.value == 'zone'
                }
              }
              if (firstLevelType == 'zone') {
                return v.typeX.value == 'zone'
              }
            }
          }).map(v => {
            console.log('二级仓库', v)
            return {
              label: `(${v.typeX.value == 'center' ? '中心' : v.typeX.value == 'city' ? '地市' : '片区'})${v.nameX}`,
              value: v.id
            }
          })
          resolve({index, toArr})
        }
      })
    },
    clear() {
      this.fromTo = []
    }
  },
  async beforeMount() {
    const res = await this.postJson('ws', {apiCode: 500009, content: {typeX: 'center'}})
    if (res.code == 0) {
      const content = res.content
      console.log(content)
      this.currentRegionCode = content.regionCode
      this.fromWareHouseList = content.from
      this.toWareHouseList = content.to
      this.options = this.fromWareHouseList.map(v => {
        return {
          label: `(${v.typeX.value == 'center' ? '中心' : v.typeX.value == 'city' ? '地市' : '片区'})${v.nameX}`,
          value: v.id,
          cities: []
        }
      })
    }
  }
}
</script>
<style></style>
