<template>
  <Cascader :options="options" :change-on-select="select_any_level_flag" clearable
            v-model="result"
            @active-item-change="activeItemChange"
            :show-all-levels="show_all_levels" :disabled="disabled" @change="valueChange"
            :placeholder="placeholder"></Cascader>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    // 根据父组件的结果，展示对应的内容
    res: '',
    // 是否可以选择任何一级(默认false,只能选择最后一级,如果是true的话，stage可以不填)
    select_any_level_flag: {
      type: Boolean,
      default: false
    },
    // 数据展示到第几级， 1代表第一级，2代表第二级， 3代表第三级，最高到第三级(默认3级)
    stage: {
      type: Number,
      default: 3
    },
    // 是否显示完整的路径，将其赋值为false则仅显示最后一级
    show_all_levels: true,
    // 是否禁用
    disabled: {
      type: [Boolean, String],
      default: false
    },
    // 是否把所有级别的选择结果全部返回,默认只返回最后一级的regionCode
    ruturnAllLevelResultFlag: {
      type: Boolean,
      default: false
    },
    apiCode: {
      type: Number,
      default: 100027
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data() {
    return {
      // element组件展示使用
      result: [],
      // 传给父组件的数据，数据结构[ {label,value} ]
      resArr: [],
      options: []
    }
  },
  watch: {
    result(val) {
    },
    res(val) {
      // let interval = setInterval(() => {
      if (val && this.options && this.options.length) {
        console.log(0)
        this.showResult(val)
        // window.clearInterval(interval)
      }
      // }, 100)
    },
    options(value) {
      if (this.options && this.options.length && this.res) {
        console.log(11)
        this.showResult()
        // window.clearInterval(interval)
      }
      // let interval = setInterval(() => {
      //   if (this.options && this.options.length && this.res) {
      //     this.showResult()
      //     window.clearInterval(interval)
      //   }
      // }, 100)
    }
  },
  methods: {
    // 初始化数据
    async init() {
      const res = await this.postJson('account', {
        apiCode: this.apiCode,
        content: {
          showLevel: 'third',
          status: 'on'
        }
      })
      let data = res.content.regionTree.children
      this.options = []
      let tempArr = []
      this.rebuildData(data, tempArr)
      if (this.stage == 1) {
        for (let i = 0; i < tempArr.length; i++) {
          tempArr[i].children = ''
        }
        this.options = tempArr
      } else if (this.stage === 2) {
        for (let i = 0; i < tempArr.length; i++) {
          if (tempArr[i].children) {
            for (let j = 0; j < tempArr[i].children.length; j++) {
              tempArr[i].children[j].children = ''
            }
          }
        }
        this.options = tempArr
      } else {
        this.options = tempArr
      }
    },
    // 把数据处理成渲染的数据
    rebuildData(data, arr) {
      data.forEach((val, i) => {
        arr.push({
          value: val.id,
          label: val.name
        })
        if (val.children !== null) {
          arr[i].children = []
          this.rebuildData(val.children, arr[i].children)
        }
      })
    },
    // 根据父组件传过来的数值，展示区域名称
    showResult1() {
      // console.log(this.options)
      // console.log('我是', this.select_any_level_flag)
      if (this.stage == 1 && this.select_any_level_flag == false) {
        this.options.filter(val => {
          if (val.value == this.res) {
            this.$set(this.result, 0, val.value)
            this.$emit('areaSelectResult', [
              {value: val.value, label: val.label}
            ])
          }
        })
      } else if (this.stage == 2 && this.select_any_level_flag == false) {
        this.options.filter(val => {
          if (val.children) {
            val.children.find(val2 => {
              if (val2.value == this.res) {
                this.$set(this.result, 0, val.value)
                this.$set(this.result, 1, val2.value)
                this.$emit('areaSelectResult', [
                  {value: val.value, label: val.label},
                  {value: val2.value, label: val2.label}
                ])
              }
            })
          }
        })
      } else if (this.stage == 3 || this.select_any_level_flag) {
        this.options.filter(val => {
          if (val.children) {
            val.children.find(val2 => {
              if (val2.children) {
                val2.children.find(val3 => {
                  if (val3.value == this.res) {
                    this.$set(this.result, 0, val.value)
                    this.$set(this.result, 1, val2.value)
                    this.$set(this.result, 2, val3.value)
                    this.$emit('areaSelectResult', [
                      {value: val.value, label: val.label},
                      {value: val2.value, label: val2.label},
                      {value: val3.value, label: val3.label}
                    ])
                  }
                })
              }
            })
          }
        })
      }
    },
    showResult() {
      console.log(this.options)
      let findInLevel1 = this.options.find(v => {
        if (v.value == this.res) {
          console.log(101)
          this.$set(this.result, 0, v.value)
          this.$emit('areaSelectAllResult', [
            {value: v.value, label: v.label}
          ])
          return v
        }
      })
      console.log(findInLevel1)
      if (!findInLevel1) {
        let findInLevel2 = this.options.find(v => {
          if (v.children) {
            return v.children.find(v2 => {
              if (v2.value == this.res) {
                this.$set(this.result, 0, v.value)
                this.$set(this.result, 1, v2.value)
                this.$emit('areaSelectAllResult', [
                  {value: v.value, label: v.label},
                  {value: v2.value, label: v2.label}
                ])
                return v2
              }
            })
          }
        })
        console.log(findInLevel2)
        if (!findInLevel2) {
          this.options.find(v => {
            if (v.children) {
              return v.children.find(v2 => {
                if (v2.children) {
                  return v2.children.find(v3 => {
                    if (v3.value == this.res) {
                      this.$set(this.result, 0, v.value)
                      this.$set(this.result, 1, v2.value)
                      this.$set(this.result, 2, v3.value)
                      this.$emit('areaSelectAllResult', [
                        {value: v.value, label: v.label},
                        {value: v2.value, label: v2.label},
                        {value: v3.value, label: v3.label}
                      ])
                      return v3
                    }
                  })
                }
              })
            }
          })
        }
      }
    },
    // 清除功能
    clear() {
      this.result = []
      this.$emit('areaSelectResult', [])
    },
    valueChange(val) {
      console.log(val)
      let resArr = this.resArr = [] // 存放最终选择的结果
      let tmp = JSON.parse(JSON.stringify(this.options)) // 用来过滤的数据源
      let i = 0
      let filterEvent = (arr, index) => {
        arr = arr.filter(v => {
          return v.value == val[index]
        })
        if (arr && arr.length > 0) {
          resArr[index] = {label: arr[0].label, value: arr[0].value}
          tmp = arr[0].children
        } else {
          return
        }
      }
      while (i < this.stage) {
        filterEvent(tmp, i)
        i++
      }
      if (this.ruturnAllLevelResultFlag) {
        this.$emit('areaSelectResult', resArr)
        this.$emit('sendToAreaSelect', resArr.map(v => {
          return {
            regionCode: v.value,
            regionName: v.label
          }
        })) // 兼容河南版本
      } else {
        this.$emit('areaSelectResult', resArr[this.stage - 1])
        console.log(resArr)
        this.$emit('sendToAreaSelect', resArr.map(v => {
          return {
            regionCode: v.value,
            regionName: v.label
          }
        })[this.stage - 1]) // 兼容河南版本
      }
    },
    activeItemChange(val) {
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style lang="scss">
  .el-cascader {
    width: 100%
  }
</style>
