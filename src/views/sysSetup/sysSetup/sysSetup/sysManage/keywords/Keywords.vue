<template>
  <div class="keywords-div">
    <div class="mb10">
      <Button type="primary" @click="isCollapse=!isCollapse" icon="el-icon-search">
        查询
      </Button>
    </div>

    <div>
      <Card class="mb12" v-show="isCollapse" shadow="never">
        <div class="content_title">
          <span >查询条件</span>
        </div>

        <div >
          <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
          <Form :inline="true" class="form-inline" label-width="140px" size="mini" :model="searchForm" ref="searchForm">
            <FormItem label="业务类型" prop="flowId">
              <Select v-model="searchForm.flowId" placeholder="请选择业务类型" >
                <Option v-for="item in list" :key="item.id"
                        :label="item.flowName" :value="item.id"></Option>
              </Select>
            </FormItem>
            <FormItem class="full-line">
              <Button type="primary" @click="query()">查询</Button>
              <Button @click="resetForm('searchForm')">重置</Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
    <!--所有选择框-->
    <div v-loading="loading" class="mb20">
      <div v-for="(item,index) in data" :key="item.id">
        <h3 class="h3">{{item.nodeName}}</h3>
        <div @click="lineBoxClicked(index)">
          <Checkbox :indeterminate="indeterminate[index]"
                    v-model="checkAll[index]"
                    :disabled="!Auth('station:200118')"
                    @click.prevent.native="handleCheckAll">全选
            <!--:disabled="disabledF"-->
          </Checkbox>
          <CheckboxGroup v-model="checkAllGroup[index]" @change="checkAllGroupChange">
              <span @click="checkBoxClicked(subItem)" v-for="subItem in item.fieldDetails" :key="subItem.id">
                <Checkbox v-if="subItem.name" :label="subItem.code" style="width: 180px;"
                          :disabled="!Auth('station:200118')">
                  {{subItem.name}}
                </Checkbox>
              </span>
          </CheckboxGroup>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Subindex',
    data: function () {
      return {
        once: true,
        loading: false,
        isCollapse: true,
        list: [],
        searchForm: {
        },
        data: [],
        indeterminate: [],
        checkAll: [],
        checkAllGroup: [],
        index: -1,
        setObj: {
          apiCode: 200117,
          content: {}
        },
        batchSetObj: {
          apiCode: 200118,
          content: {
            fieldDetails: []
          }
        },
      }
    },
    methods: {
      checkBoxClicked(val) {
        setTimeout(() => {
          let isEdiable = val.editable
          this.setObj.content.editable = !isEdiable
          this.setObj.content.fieldCode = val.code
          this.setObj.content.fieldName = val.name
          if (this.once) {
            this.once = false
            this.loading = true
            this.postJson('common', this.setObj).then(res => {
              this.once = true
              if (res.code === '0') {
                this.showMsg('该流程字段设置成功')
                // this.query() // 再次请求页面
                this.loading = false
              } else {
                this.loading = false
                this.checkAllGroup[this.index].filter((v, i) => {
                  if (v == val.code) {
                    this.checkAllGroup[this.index].splice(i, 1)
                  }
                })
              }
            })
          }
        }, 100)
      },
      lineBoxClicked(index) {
        this.index = index
        const {nodeCode, nodeName} = this.data[index]
        this.setObj.content = Object.assign(this.setObj.content, {nodeCode, nodeName})
      },
      handleCheckAll() {
        setTimeout(() => {
          if (this.indeterminate[this.index]) {
            this.checkAll[this.index] = false
          } else {
            this.checkAll[this.index] = !this.checkAll[this.index]
          }
          this.indeterminate[this.index] = false
          if (this.checkAll[this.index]) {
            const obj = this.data[this.index].fieldDetails
            const temp = []
            Object.keys(obj).some(function (key) {
              if (obj[key].name) {
                temp.push(obj[key].code)
              }
            })
            this.$set(this.checkAllGroup, this.index, temp)
            this.batchPost(true)
          } else {
            this.$set(this.checkAllGroup, this.index, [])
            this.batchPost(false)
          }
        }, 100)
      },
      batchPost(isTrue) {
        const obj = this.data[this.index].fieldDetails
        this.batchSetObj.content.fieldDetails = []
        const {
          flowCode,
          flowId,
          flowName,
          nodeCode,
          nodeName
        } = this.setObj.content
        for (let key in obj) {
          if (obj[key].name) {
            this.batchSetObj.content.fieldDetails.push({
              id: obj[key].id,
              fieldCode: obj[key].code,
              fieldName: obj[key].name,
              editable: isTrue,
              flowCode,
              flowId,
              flowName,
              nodeCode,
              nodeName
            })
          }
        }
        this.loading = true
        this.postJson('common', this.batchSetObj).then(res => {
          this.loading = false
          if (res.code === '0') {
            this.showMsg('批量提交成功')
          }
        })
      },
      checkAllGroupChange(data) {
        const obj = this.data[this.index].fieldDetails
        var length = 0
        Object.keys(obj).some(function (key) {
          if (obj[key].name) {
            length++
          }
        })
        if (data.length === length) {
          this.indeterminate[this.index] = false
          this.checkAll[this.index] = true
        } else if (data.length > 0) {
          this.indeterminate[this.index] = true
          this.checkAll[this.index] = false
        } else {
          this.indeterminate[this.index] = false
          this.checkAll[this.index] = false
        }
      },
      async query() {
        this.loading = true
        var {id, flowCode, flowName} = this.list.filter(v => {
          return v.id === this.searchForm.flowId
        })[0]
        this.setObj.content = Object.assign(this.setObj.content, {flowCode, flowName})
        this.setObj.content.flowId = id
        var res = await this.postJson('common', {
          apiCode: 200116,
          content: this.searchForm
        })
        this.data = res.content
        this.data.forEach((node, index) => {
          this.checkAllGroup[index] = []
          this.checkAll[index] = false
          this.indeterminate[index] = true
          for (let key in node.fieldDetails) {
            if (node.fieldDetails[key].editable && node.fieldDetails[key].name) {
              this.checkAllGroup[index].push(node.fieldDetails[key].code)
            }
          }
        })
        this.loading = false
      },
      resetForm(formName) {
        this.$set(this[formName], 'flowId', 1)
      }
    },
    mounted() {
    },
    async beforeMount() {
      // this.tableHeight = this.TableHeightCal('makeMiddle', 80)
      // 获取业务列表
      var res = await this.postJson('common', {
        apiCode: 200051,
        content: {
          sysModule: 'station',
          paginated: false
        }
      })
      if (res.code === '0') {
        this.list = res.content.dataList
        this.$set(this.searchForm, 'flowId', 1)
        this.query()
      }
    }
  }
</script>

<style lang="scss">
</style>
