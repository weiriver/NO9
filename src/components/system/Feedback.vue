<template>
  <div>
    <Popover placement="bottom"
             width="60"
             trigger="hover"
             class="pointer"
             content="">
      <div slot="reference"><img src="./img/questions.png"/></div>
      <div style="text-align: center">
        <div @click="showFeedbackDialog" class="pointer">意见反馈</div>
      </div>
    </Popover>

    <!--意见反馈--弹窗-->
    <Dialog title="意见反馈" :visible.sync="feedbackDialogVisible"
            width="50%" style="text-align: left">
      <!-- 表单提交 -->
      <Form :model="questions" ref="questions" :rules="question_rule" :label-width="'120px'">
        <FormItem label="选择系统" class="form_item" prop="systemId">
          <Select class="form_item_select" v-model="questions.systemId" style="width:100%;"
                  :label-in-value="true" clearable @change="show_menus">
            <Option v-for="item in data_list" :key="item.id"
                    :value="item.id" :label="item.name">
            </Option>
          </Select>
        </FormItem>
        <FormItem v-if="show_menus_flag" label="选择菜单" class="form_item" prop="funcId">
          <Cascader transfer :options="data" :change-on-select="true" @change="choose_menus"
                    v-model="questions.funcId"></Cascader>
        </FormItem>
        <FormItem label="反馈内容" class="form_item" prop="commits">
          <Input v-model="questions.commits" type="textarea" style="width:100%;" clearable
                 :autosize="{minRows: 5, maxRows: 5}" placeholder="请输入反馈意见，不超过200字"/>
        </FormItem>
      </Form>
      <div>感谢您反馈的宝贵意见和建议，我们将在试运行结束后，统一对所有问题进行回访，谢谢！</div>
      <div slot="footer" class="dialog-footer">
        <Button @click="feedbackDialogVisible = false">取 消</Button>
        <Button type="primary" @click="sumbit('questions')">确 定</Button>
      </div>
    </Dialog>
  </div>
</template>
<script>
import {Popover, Dialog, Form, FormItem, Input, Select, Option, Button, Cascader, Message} from 'element-ui'

export default {
  name: 'feedback',
  components: {Popover, Dialog, Form, FormItem, Input, Select, Option, Button, Cascader, Message},
  data() {
    return {
      feedbackDialogVisible: false,
      show_menus_flag: false,
      data_map: new Map(),
      data_list: [],
      data: [],
      questions: {
        systemId: '',
        systemName: '',
        funcId: [],
        funcName: '',
        commits: ''
      },
      question_rule: {
        systemId: [
          {required: true, message: '请选择系统', trigger: 'blur'},
          {message: '请选择系统', trigger: 'change'}
        ],
        funcId: [
          {required: true, type: 'array', message: '请选择菜单', trigger: 'blur'},
          {type: 'array', message: '请选择菜单', trigger: 'change'}
        ],
        commits: [
          {required: true, message: '请输入反馈内容', trigger: 'blur'},
          {message: '请输入反馈内容', trigger: 'change'},
          {max: 200, message: '200字符以内', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 显示弹窗
    showFeedbackDialog() {
      this.feedbackDialogVisible = true
      if (this.feedbackDialogVisible) {
        this.get_function_list()
      }
    },
    // 获取功能列表
    get_function_list() {
      let param = {
        apiCode: 200133,
        content: {}
      }
      this.postJson('common', param).then(res => {
        if (res.code === '0') {
          this.data_list = []
          let list = res.content.systems
          console.log('get_function_list', list)
          this.data_list = list
          // list.forEach(item => {
          //   let node = {
          //     id: '',
          //     name: ''
          //   }
          //   node.id = item.id
          //   node.name = item.name
          //   let children = item.children
          //   if (children === null) {
          //     children = []
          //   } else {
          //     children = this.parseCascaderNode(children)
          //     this.data_list.push(node) // 过滤空的选择对象
          //   }
          //   // this.data_map.set(item.id, [item.name, children])
          // })
          console.log(this.data_list)
        }
      })
    },
    parseCascaderNode(list) {
      let nodes = []
      list.forEach(item => {
        let node = {
          value: '',
          label: '',
          children: []
        }
        node.value = item.id
        node.label = item.name
        if (item.children !== null) {
          node.children = this.parseCascaderNode(item.children)
        } else {
          node.children = []
        }
        nodes.push(node)
      })
      return nodes
    },
    show_menus(selected) {
      console.log('show_menus', selected)
      let sysArr = this.data_list.find(v => v.id == selected).children
      sysArr = sysArr.map(v => {
        v.id = parseInt(Math.random() * 10)
        return v
      })
      this.data = this.rebuildData(sysArr)
      // console.log('data_map', this.data_map)
      // console.log(this.data_map.get(selected)['1'])
      if (selected != undefined) {
        // this.data = this.data_map.get(selected)
        // console.log('this.data', this.data)
        // this.data = this.rebuildData(this.data_map.get(selected)['1'])
        // console.log(this.data)
        // this.questions.systemName = this.data_map.get(selected)['0']
        // console.log('this.data[0]', this.data_map.get(selected)['0'])
        // console.log('this.data[1]', this.data)
        this.show_menus_flag = true
      }
    },
    rebuildData(arr) {
      if (arr && arr.length) {
        return arr.map(v => {
          if (v.children && v.children.length) {
            return {
              label: v.name,
              value: v.id,
              children: this.rebuildData(v.children)
            }
          } else {
            return {
              label: v.name,
              value: v.id
            }
          }
        })

      }
    },
    choose_menus(select) {
      console.log('choose_menus', select)
      // if (select.length > 0) {
      //   this.questions.funcName = ''
      //   select.forEach(item => {
      //     this.questions.funcName += item.label + '-'
      //   })
      // }
      // this.questions.funcName = this.questions.funcName.substring(0, this.questions.funcName.length - 1)
    },
    // 提交
    sumbit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let question = this.$refs[name].model
          console.log(JSON.stringify(question))
          // 保存对象
          let param = {
            apiCode: 200134,
            content: {
              systemId: question.systemId,
              systemName: question.systemName,
              funcName: question.funcName,
              commits: question.commits
            }
          }
          this.postJson('common', param).then(res => {
            if (res.code === '0') {
              Message.success('保存成功!')
              this.reset(name) // 重置数据
              this.feedbackDialogVisible = false
            } else {
              Message.error('保存失败!')
            }
          })
        }
      })
    },
    cancel(name) {
      this.feedbackDialogVisible = false
      this.reset(name)
    },
    reset(name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>

<style lang="scss">

</style>
