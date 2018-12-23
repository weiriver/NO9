<template>
  <div class="msg-div">
    <Popover placement="bottom"
             width="60"
             trigger="hover"
             class="pointer"
             content="">
      <div slot="reference" @click="click_message">
        <!--{{ count }}-->
        <Badge :value="count" class="badge-div">
          <img src="./img/messages.png" class="badge-img"/>
        </Badge>

      </div>
      <div style="text-align: center">
        <div @click="click_message" class="pointer">站内消息</div>
      </div>
    </Popover>
    <!-- 站内消息 -->
    <Dialog :visible.sync="show_message_flag" title="消息管理" width="80%">
      <Tabs @tab-click="close_message_detail" v-model="msgTab">
        <TabPane label="发送消息" name="sendMsg">
          <div v-show="!show_receiver_flag" class="message_container">
            <Form :model="message" ref="message" :rules="message_rule" label-width="120px">
              <FormItem label="标题" class="form_item" prop="title">
                <Input class="form_item_text" v-model="message.title" type="text" style="width:100%;"
                       placeholder="请输入消息标题, 20字以内"></Input>
              </FormItem>
              <FormItem label="收件人" class="form_item" prop="receiveByName">
                <AreauserSelect ref="user" :checkboxFlag="true"></AreauserSelect>
              </FormItem>
              <FormItem label="内容" class="form_item" prop="content">
                <Input v-model="message.content" type="textarea" style="width:100%;" clearable
                       :autosize="{minRows: 5, maxRows: 5}" placeholder="请输入消息内容，不超过200字"></Input>
              </FormItem>
              <FormItem class="form_button">
                <Button type="ghost" @click="reset('message')">重置</Button>
                <Button type="primary" style="margin-left: 10px" @click="send2message('message')">发送</Button>
              </FormItem>
            </Form>
          </div>
        </TabPane>

        <TabPane label="接收消息" name="recMsg">
          <div v-show="show_receive_message_flag" class="message_container">
            <Table stripe :data="receive_message_data" :height="300" border style="width: 100%">
              <TableColumn label="发件人" prop="createByName" width="70"></TableColumn>
              <TableColumn label="主题">
                <template slot-scope="scope">
                  <span :style="{ color: scope.row.readStatus ? 'black' : 'red'}">
                    {{ scope.row.title }}
                  </span>

                </template>
              </TableColumn>
              <TableColumn label="日期" prop="createDate" width="210"></TableColumn>
              <TableColumn
                 label="操作"
                 width="100">
                <template slot-scope="scope">
                  <Button @click="toDetail(scope.row)" type="text">查看</Button>
                  <Button @click="deleteItem(scope.row)" type="text" v-if="Auth(500011)">删除</Button>
                </template>
              </TableColumn>
            </Table>

            <Pagination :pageSize="10" :totalCount="receive_total_count"></Pagination>
          </div>
          <div v-show="show_message_detail_flag" class="message_container">
            <Form :model="message_detail" :ref="message_detail" label-width="120px">
              <FormItem label="标题">
                <Input v-model="message_detail.title" type="text" readonly></Input>
              </FormItem>
              <FormItem label="发件人">
                <Input v-model="message_detail.name" type="text" readonly></Input>
              </FormItem>
              <FormItem label="时间">
                <Input v-model="message_detail.date" type="text" readonly></Input>
              </FormItem>
              <FormItem label="内容">
                <Input v-model="message_detail.content" type="textarea" style="width:100%;" clearable
                       :autosize="{minRows: 5, maxRows: 5}" readonly></Input>
              </FormItem>
            </Form>
          </div>
        </TabPane>

        <TabPane label="已发消息" name="sentMsg">
          <div v-show="show_send_message_flag" class="message_container">
            <Table stripe :data="send_message_data" :height="300" border style="width: 100%">
              <TableColumn label="收件人" prop="receiveByName" width="140"></TableColumn>
              <TableColumn label="主题" prop="title"></TableColumn>
              <TableColumn label="日期" prop="createDate" width="140"></TableColumn>
              <TableColumn
                 label="操作"
                 width="100">
                <template slot-scope="scope">
                  <Button @click="toDetailSend(scope.row)" type="text">查看</Button>
                  <Button @click="deleteItemSend(scope.row)" type="text" v-if="Auth(500011)">删除</Button>
                </template>
              </TableColumn>
            </Table>

            <Pagination :pageSize="10" :totalCount="send_total_count"></Pagination>

          </div>
          <div v-show="show_message_detail_flag" class="message_container">
            <Form :model="message_detail" :ref="message_detail" label-width="120px">
              <FormItem label="标题">
                <Input v-model="message_detail.title" type="text" readonly></Input>
              </FormItem>
              <FormItem label="收件人">
                <Input v-model="message_detail.name" type="text" readonly></Input>
              </FormItem>
              <FormItem label="时间">
                <Input v-model="message_detail.date" type="text" readonly></Input>
              </FormItem>
              <FormItem label="内容">
                <Input v-model="message_detail.content" type="textarea" style="width:100%;" clearable
                       :autosize="{minRows: 5, maxRows: 5}" readonly></Input>
              </FormItem>
            </Form>
          </div>
        </TabPane>
      </Tabs>
    </Dialog>
  </div>
</template>
<script>

export default {
  name: 'system',
  data() {
    return {
      msgTab: 'recMsg',
      count: 0, // 未读消息数量
      tabname: 'recMsg', // 默认在‘接收消息’
      loading: true,
      show_message_flag: false,
      show_receiver_flag: false,
      show_send_message_flag: true, // 发件箱
      show_receive_message_flag: true, // 收件箱
      show_message_detail_flag: false, // 消息详情页
      show_flow_detail_flag: false, // 流程情页
      message: {
        title: '',
        receiveBy: '',
        receiveByName: '',
        content: ''
      },
      message_rule: {
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'},
          {message: '请输入标题', trigger: 'change'},
          {max: 20, message: '20字符以内', trigger: 'blur'},
          {max: 20, message: '20字符以内', trigger: 'blur'}
        ],
        receiveByName: [
          {required: true, message: '请选择收件人', trigger: 'blur'},
          {message: '请选择收件人', trigger: 'change'}
        ],
        content: [
          {required: true, message: '请输入消息内容', trigger: 'blur'},
          {message: '请输入消息内容', trigger: 'change'},
          {max: 200, message: '200字符以内', trigger: 'blur'}
        ]
      },
      receive_message_data: [],
      receive_total_count: 0,
      send_message_data: [],
      send_total_count: 0,
      message_detail: {
        id: '',
        title: '',
        name: '',
        content: '',
        date: '',
        flow: ''
      }
    }
  },
  props: {
    module: {
      type: String,
      default: 'account'
    }
  },
  methods: {
    toDetailSend(item) {
      this.message_view(2, item.id)
    },
    deleteItemSend(item) {
      this.message_delete(2, item.id)
    },
    toDetail(item) {
      item.readStatus = true
      this.message_view(1, item.id)
      this.count--
    },
    deleteItem(item) {
      this.message_delete(1, item.id)
    },
    click_message() {
      this.show_message_flag = !this.show_message_flag
      if (this.show_message_flag) {
        this.query_receive_messages(1)
        this.query_send_messages(1)
      }
    },
    reset(name) {
      this.$refs[name].resetFields()
      this.$refs.user.clear()
    },
    send2message(name) {
      this[name].receiveByName = this.$refs.user.userSelectCheckboxName
      this[name].receiveBy = this.$refs.user.userSelectCheckboxId
      console.log('this.$refs.user.userSelectCheckboxId', this.$refs.user.userSelectCheckboxId)
      console.log('this.$refs.user.userSelectCheckboxName', this.$refs.user.userSelectCheckboxName)
      this.$refs[name].validate((valid) => {
        if (valid) {
          let message = this.$refs[name].model
          let param = {
            apiCode: 200096,
            content: {
              title: message.title,
              content: message.content,
              receiveBy: message.receiveBy,
              receiveByName: message.receiveByName,
              sysModule: this.module
            }
          }
          this.postJson('common', param).then(res => {
            if (res.code === '0') {
              this.showMsg('发送成功!', 'success')
              this.reset(name) // 重置数据
              this.show_message_flag = false
            } else {
              this.showMsg('发送失败!', 'waring')
            }
          })
        }
      })
    },
    // 收件箱
    query_receive_messages(index) {
      let param = {
        apiCode: 200090,
        content: {
          page: index,
          limit: 10
        }
      }
      this.loading = true
      this.postJson('common', param).then(res => {
        if (res.code === '0') {
          console.log(res)
          this.receive_message_data = res.content.dataList
          this.receive_total_count = res.content.dataPage.totalCount
        }
        this.loading = false
      })
    },
    // 发件箱
    query_send_messages(index) {
      let param = {
        apiCode: 200097,
        content: {
          page: index,
          limit: 10
        }
      }
      this.loading = true
      this.postJson('common', param).then(res => {
        if (res.code === '0') {
          this.send_message_data = res.content.dataList
          this.send_total_count = res.content.dataPage.totalCount
        }
        this.loading = false
      })
    },
    close_message_detail() {
      this.show_message_detail_flag = false
      if (this.msgTab == 'recMsg') {
        this.show_receive_message_flag = true
      } else {
        this.show_send_message_flag = true
      }
    },
    message_view(type, id) {
      this.show_message_detail_flag = true
      if (type == 1) { // 收件箱
        this.show_receive_message_flag = false
        this.show_send_message_flag = true
        // 渲染消息内容
        let param = {
          apiCode: 200091,
          content: {
            id: id
          }
        }
        this.postJson('common', param).then(res => {
          if (res.code === '0') {
            this.message_detail.id = res.content.id
            this.message_detail.name = res.content.createByName
            this.message_detail.title = res.content.title
            this.message_detail.content = res.content.content
            this.message_detail.date = res.content.createDate
            let flow = res.content.bizInfo
            if (flow !== null || flow !== '') {
              this.message_detail.flow = flow.split(':')[1]
            }
          }
        })
      } else { // 发件箱
        this.show_send_message_flag = false
        this.show_receive_message_flag = true
        // 渲染消息内容
        let param = {
          apiCode: 200098,
          content: {
            id: id
          }
        }
        this.postJson('common', param).then(res => {
          if (res.code === '0') {
            this.message_detail.id = res.content.id
            this.message_detail.name = res.content.receiveByName
            this.message_detail.title = res.content.title
            this.message_detail.content = res.content.content
            this.message_detail.date = res.content.createDate
          }
        })
      }
    },
    message_delete(type, id) {
      if (type === 1) {
        let param = {
          apiCode: 200093,
          content: {
            id: id
          }
        }
        this.postJson('common', param).then(res => {
          if (res.code === '0') {
            this.query_receive_messages(1)
          }
        })
      } else {
        let param = {
          apiCode: 200099,
          content: {
            id: id
          }
        }
        this.postJson('common', param).then(res => {
          if (res.code === '0') {
            this.query_send_messages(1)
          }
        })
      }
    },
    // 定时获取未读消息
    interval_get_unread_msg() {
      setInterval(() => {
        this.get_unread_msg()
      }, 5 * 60 * 1000)
    },
    // 获取未读信息的数量
    get_unread_msg() {
      this.postJson('', {
        apiCode: 200007
      }).then(res => {
        if (res.code == 0) {
          this.count = res.content.count
        }
      })
    }
  },
  mounted() {
    // 获取未读信息的数量
    this.get_unread_msg()
    // 开启定时器获取未读信息
    this.interval_get_unread_msg()
    this.Event.$on('pagechange', (val) => {
      if (this.msgTab == 'recMsg') {
        this.query_receive_messages(val)
      } else if (this.msgTab == 'sentMsg') {
        this.query_send_messages(val)
      }
    })
  }
}
</script>

<style lang="scss">
  .msg-div {
    text-align: left;
    .badge-div {
      .el-badge__content.is-fixed {
        top: 17px;
        background-color: #FC5823;
      }
    }
    .el-form-item__content {
      width: 70%;
    }
    .el-table thead {
      line-height: 12px;
    }
  }
</style>


