<template>
  <div class="sitesGroupsAdd">
    <h3>新增/修改站点分组</h3>
    <Form ref="formRef"  :model="ruleForm" :label-position="labelPosition" label-width="100px" :rules="rules">
      <FormItem label="组名称" prop="nameX">
        <Input v-model="ruleForm.nameX" />
      </FormItem>
      <FormItem label="是否公告组" prop="isPublic">
        <Select v-model="ruleForm.isPublic" clearable>
          <Option
            v-for="item in isPublicList"
            :value="item.label"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="分组描述" prop="groupDesc">
        <Input v-model="ruleForm.groupDesc" type="textarea" :autosize="true"/>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="submitForm('formRef')">保存</Button>
        <Button v-if="id" plain @click="reset">重置</Button>
        <Button v-else plain @click="empty('formRef')">清空</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: "SitesGroupAdd",
  data() {
    return {
      id: '',
      labelPosition: "right",
      ruleForm: {
        nameX: "",
        isPublic: "",
        groupDesc: ""
      },
      isPublicList: [
        { value: "true", label: "是" },
        { value: "false", label: "否" }
      ],
      rules: {
        nameX: [
          { required: true, message: "分组名称不能为空", trigger: "blur" },
          { type: 'string', max: 10, message: '分组名称最大10个字', trigger: 'change' }
        ],
        isPublic: [
          { required: true, message: "是否公共组不能为空", trigger: "blur" }
        ],
        groupDesc: [
          { type: 'string', max: 120, message: '分组描述最大120个字', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    async getInfo(groupId) {
      var res = await this.postJson('station', {
        apiCode: 300045,
        content: { id: groupId }
      })
      if (res.code == 0) {
        const { id, nameX, isPublic, groupDesc } = res.content
        this.ruleForm = {
          id,
          nameX,
          isPublic: isPublic? '是':'否',
          groupDesc
        }
      } else {
        this.showMsg(res.msg, 'warning')
      }
    },
    // 保存按钮-- 提交表单
    submitForm(formRef) {
      this.$refs[formRef].validate(async (valid) =>{
        if (valid) { // 验证通过
          if (this.$route.params.id) { // 修改
            var res = await this.postJson('station', {
              apiCode: 300043,
              content: this.ruleForm
            })
            if (res.code === '0') {
              this.showMsg('修改成功','success')
              this.$router.go(-1)
            }
          } else { // 新增
            var res = await this.postJson('station', {
              apiCode: 300042,
              content: this.ruleForm
            })
            if (res.code === '0') {
              this.showMsg('新增成功')
              this.$router.go(-1)
            }
          }
        } else { // 验证失败
          this.showMsg('请输入必要信息', 'error')
          return false
        }
      })
    },
    //重置
    reset() {
      this.getInfo(this.$route.params.id)
    },
    // 清空
    empty(formRef) {
      this.$refs[formRef].resetFields()
      this.ruleForm = {}
    }
  },
  mounted() {
    // 路由传参
    var { id } = this.$route.params;
    this.id = this.$route.params.id;
    if (id) {
      // 当前为修改站定绑定
      this.getInfo(id);
    } else {
      // 当前为新增站定绑定
      this.ruleForm = {};
    }
  }
};
</script>

<style scoped>
</style>