<template>
  <div>
    <div class="content_title">
      创建/修改课程类型
    </div>
    <Form :model="ruleForm" :rules="rules" ref="formRef" label-width="100px">
      <FormItem label="培训主题" prop="title">
        <Input v-model="ruleForm.title" placeholder="请输入"/>
      </FormItem>
      <FormItem label="培训对象" prop="trainObjectArr">
        <Select v-model="ruleForm.trainObjectArr" multiple placeholder="请选择" >
          <Option v-for="item in TrainObjectList" :value="item.id" :key="item.id" :label="item.name"></Option>
        </Select>
      </FormItem>
      <FormItem label="培训类型" prop="trainObjectType">
        <Select v-model="ruleForm.trainObjectType" placeholder="请选择" @change="trainObjectTypeChange">
          <Option v-for="item in TrainObjectTypeList" :value="item.value" :key="item.value" :label="item.text"></Option>
        </Select>
      </FormItem>
      <FormItem label="发布类型" prop="publishType">
        <Select v-model="ruleForm.publishType" placeholder="请选择" :disabled="trainObjectTypeSelected">
          <Option v-for="item in PublishTypeList" :value="item.value" :key="item.value" :label="item.text" :disabled="item.flag"></Option>
        </Select>
      </FormItem>
      <FormItem label="培训时间" prop="trainTime">
        <DatePicker type="datetime" placeholder="选择日期" v-model="ruleForm.trainTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    ></DatePicker>
      </FormItem>
      <FormItem label="培训地点" prop="trainAddress">
        <Input v-model="ruleForm.trainAddress" placeholder="请输入"/>
      </FormItem>
      <FormItem label="培训说明" prop="description">
        <Input type="textarea" :autosize="{ minRows:3, maxRows: 10 }"
               v-model="ruleForm.description" placeholder="请输入课程类型说明"/>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="submitForm('formRef')">提交</Button>
        <Button @click="resetForm('formRef')">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'CourseTypeAdd',
    data() {
      return {
        TrainObjectList: [],
        trainObjectTypeSelected: true,
        ruleForm: {
          trainObjectArr: []
        },
        rules: {
          title: [
            { required: true, message: "培训主题不能为空", trigger: ['change','blur'] }
          ],
          trainObjectArr: [
            { required: true, message: "培训对象不能为空", type: 'array', trigger: ['change'] }
          ],
          trainObjectType: [
            { required: true, message: "培训类型不能为空", trigger: ['change','blur'] }
          ],
          publishType: [
            { required: true, message: "发布类型不能为空", trigger: ['change','blur'] }
          ],
          trainTime: [
            { required: true, message: "培训时间不能为空", trigger: ['change','blur'] }
          ],
          trainAddress: [
            { required: true, message: "培训地点不能为空", trigger: ['change','blur'] }
          ]
        }
      }
    },
    computed: {
      ...mapState({
        TrainObjectTypeList: state => state['all_enumDic']['TrainEnum$TrainObjectTypeEnum'],
        PublishTypeList: state => state['all_enumDic']['TrainEnum$PublishTypeEnum']
      })
    },
    methods: {
      async getTrainObjectList() {
        var res = await this.postJson('train', {
          apiCode: 660005,
          content: {
            paginated: false
          }
        })
        if (res.code == 0) {
          this.TrainObjectList = res.content.dataList
        }
      },
      trainObjectTypeChange(val) {
        console.log('val', val)
        this.$set(this.ruleForm, 'publishType', '')
        this.trainObjectTypeSelected = true
        this.initPublishTypeList()
        if (this.ruleForm.trainObjectType === 'station') {
          this.PublishTypeList.forEach((item) => {
            if (item.value === 'station' || item.value === 'region') {
              item.flag = false
            }
          })
        }
        if (this.ruleForm.trainObjectType === 'inspector') {
          this.PublishTypeList.forEach((item) => {
            if (item.value === 'inspector' || item.value === 'region') {
              item.flag = false
            }
          })
        }
        if (this.ruleForm.trainObjectType === 'sales') {
          this.PublishTypeList.forEach((item) => {
            if (item.value === 'sales' || item.value === 'region') {
              item.flag = false
            }
          })
        }
        this.trainObjectTypeSelected = false
      },
      // 提交表单
      submitForm(formRef) {
        this.ruleForm.trainObject = this.ruleForm.trainObjectArr.join(',')
        console.log('ruleForm.trainObject', this.ruleForm.trainObject)
        this.$refs[formRef].validate(async (valid) => {
          if (valid) { // 验证通过
            var res = await this.postJson('train', {
              apiCode: 660001,
              content: this.ruleForm
            })
            if (res.code == 0) {
              this.showMsg('新增成功', 'success')
              this.$router.go(-1)
            }
          } else { // 验证失败
            console.log('error submit!!')
            return false;
          }
        });
      },
      initPublishTypeList () {
        this.PublishTypeList.forEach((item) => {
          item.flag = true
        })
      },
      // 重置表单
      resetForm(formRef) {
        this.$refs[formRef].resetFields()
        this.ruleForm = {
          trainObjectArr: []
        }
        this.$set(this.ruleForm, 'publishType', '')
        this.trainObjectTypeSelected = true
      }
    },
    beforeMount() {
      this.getTrainObjectList()
    },
    mounted() {
      this.initPublishTypeList()
    }
  }
</script>
