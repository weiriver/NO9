<template>
  <Cascader
     separator=" 的 "
     :options="options"
     v-model="selectRes"
     :clearable="true"
     @active-item-change="handleItemChange"
     :props="props"
  ></Cascader>
</template>

<script>
export default {
  data() {
    return {
      selectRes: [],
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
      default: () => {
        return []
      }
    }
  },
  watch: {
    selectRes(val) {
      if (val) {
        this.$emit('selectRes', val)
        this.$emit('input', val)
      }
    }
  },
  methods: {
    async handleItemChange(val) {
      let toWarehouseList = await this.query_warehouse(val[0])
      this.$set(this.options[toWarehouseList.index], 'cities', toWarehouseList.arr)
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
      this.selectRes = []
    },
    // 请求区域树
    async query_region() {
      var res = await this.postJson('account', {
        apiCode: 100027,
        content: {
          showLevel: 'second'
        }
      })
      console.log('res.content.regionTree', res.content.regionTree.children)
      let regions = res.content.regionTree.children
      let temp = []
      regions.forEach(obj => {
        temp.push({
          value: obj.id,
          label: obj.name,
          cities: []
        })
      })
      this.options = temp
      // console.log('regionOptions', this.regionOptions)
    },
    // 请求仓库
    async query_warehouse(val) {
      let index = this.options.findIndex(v => v.value == val)
      var res = await this.postJson('ws', {
        apiCode: 500008,
        content: {
          regionCode: val
        }
      })
      console.log('res.content(warehouse)', res.content)
      return {
        index,
        arr: res.content.map(v => {
          return {
            value: v.id,
            label: v.nameX
          }
        })
      }

      // this.warehouseOptions =
      // console.log('warehouseOptions', this.warehouseOptions)
    }
  },
  async beforeMount() {
    this.query_region()
    // const res = await this.postJson('ws', {apiCode: 500009, content: {typeX: 'center'}})
    // if (res.code == 0) {
    //   const content = res.content
    //   console.log(content)
    //   this.currentRegionCode = content.regionCode
    //   this.fromWareHouseList = content.from
    //   this.toWareHouseList = content.to
    //   this.options = this.fromWareHouseList.map(v => {
    //     return {
    //       label: `(${v.typeX.value == 'center' ? '中心' : v.typeX.value == 'city' ? '地市' : '片区'})${v.nameX}`,
    //       value: v.id,
    //       cities: []
    //     }
    //   })
    // }
  }
}
</script>
<style></style>
