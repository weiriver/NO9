<template>
  <div>
    <Tree
       ref="tree"
       accordion
       :data="data2"
       show-checkbox
       node-key="id"
       :default-expanded-keys="[2, 3]"
       :default-checked-keys="[5]"
       :props="defaultProps"
       @check="handleCheck"
       @check-change="handleCheckChange">
    </Tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data2: [],
      data3: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                },
                {
                  id: 10,
                  label: '三级 2-1-1'
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      props: {
        label: 'name',
        children: 'zones'
      },
      count: 1,
      // 存在选择到的那些名字集合 []
      names: [],
      // 存放选择到的那些ID集合 []
      ids: [],
      // 存放选择到的所有对象： [{id:xx, name:yyy}]
      data_choosed: []
    }
  },
  props: {
    api: {
      type: Object,
      default: () => {
        return {
          apiCode: 100027,
          content: {
            showLevel: 3,
            status: 'on'
          }
        }
      }
    }
  },
  methods: {
    getCheckedNodes() {
      console.log(this.$refs.tree.getCheckedNodes())
    },
    getNames(arr) {
      arr.forEach(v => {
        if (v.children) {
          this.getNames(v.children)
        } else {
          let nameExit = this.names.find(name => name === v.label)
          let idExit = this.ids.find(id => id === v.id)
          if (!nameExit && !idExit) {
            this.names.push(v.label)
            this.ids.push(v.id)
            this.data_choosed.push(v)
          }
        }
      })
    },
    handleCheck(data, checked) {
      // console.log(data, checked)
      // console.log(checked.checkedNodes)
      // let arrChecked = checked.checkedNodes
    },
    handleCheckChange(data, checked, indeterminate) {
      // console.log(data, checked, indeterminate)
      let arrChecked = this.$refs.tree.getCheckedNodes()
      this.names = []
      this.ids = []
      this.data_choosed = []
      this.getNames(arrChecked)
      console.log(this.names)
      console.log(this.ids)
      console.log(this.data_choosed)
    },
    handleNodeClick(data) {
      console.log(data)
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([
          {name: 'region1'},
          {name: 'region2'}
        ])
      }
      if (node.level > 3) return resolve([])

      var hasChild
      if (node.data.name === 'region1') {
        hasChild = true
      } else if (node.data.name === 'region2') {
        hasChild = false
      } else {
        hasChild = Math.random() > 0.5
      }

      setTimeout(() => {
        var data
        if (hasChild) {
          data = [
            {
              name: 'zone' + this.count++
            },
            {
              name: 'zone' + this.count++
            }
          ]
        } else {
          data = []
        }

        resolve(data)
      }, 500)
    },
    async init_area_data() {
      const res = await this.postJson('account', this.api)
      if (res.code === '0') {
        var list = res.content.regionTree.children
        // list[0].children = this.data3
        // console.log(list)
        // 转换列表为区域数组对象
        this.data2 = this.rebuildData(list)
        // this.$set(this.data2[0], 'children', this.data3)
      }
    },
    rebuildData(arr) {
      return arr.map(v => {
        if (v.children) {
          return {
            id: v.id,
            label: v.name,
            children: this.rebuildData(v.children)
          }
        } else {
          return {
            id: v.id,
            label: v.name
          }
        }
      })
    }
  },
  beforeMount() {
    // 获取Tree数据
    this.init_area_data()
  }
}
</script>