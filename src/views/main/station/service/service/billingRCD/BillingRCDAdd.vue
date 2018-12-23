<template>
  <div>
    <div class="content_title">
      基本信息
    </div>
    <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
      <FormItem label="名称" prop="name">
        <Input v-model="ruleForm.name"></Input>
      </FormItem>
      <FormItem label="方案代码" prop="code">
        <Input v-model="ruleForm.code"></Input>
      </FormItem>
      <FormItem label="面值" prop="faceValue">
        <Input v-model="ruleForm.faceValue"></Input>
      </FormItem>
      <FormItem label="最高奖金" prop="topPrize">
        <Input v-model="ruleForm.topPrize"></Input>
      </FormItem>
      <FormItem label="是否置顶" prop="top">
        <Radio border v-model="ruleForm.top" label="true">是</Radio>
        <Radio border v-model="ruleForm.top" label="false">否</Radio>
      </FormItem>
      <FormItem label="是否新品" prop="newProd">
        <Radio border v-model="ruleForm.newProd" label="true">是</Radio>
        <Radio border v-model="ruleForm.newProd" label="false">否</Radio>
      </FormItem>
      <FormItem label="是否热销" prop="sellWell">
        <Radio border v-model="ruleForm.sellWell" label="true">是</Radio>
        <Radio border v-model="ruleForm.sellWell" label="false">否</Radio>
      </FormItem>
      <FormItem label="启停状态" prop="state">
        <Radio border v-model="ruleForm.state" label="true">启用</Radio>
        <Radio border v-model="ruleForm.state" label="false">停用</Radio>
      </FormItem>
      <FormItem label="箱本转换" prop="boxToBook">
        <Input v-model="ruleForm.boxToBook"></Input>
      </FormItem>
      <FormItem label="本张转换" prop="bookToSheet">
        <Input v-model="ruleForm.bookToSheet"></Input>
      </FormItem>
      <FormItem label="logo图片" prop="imgUrl">
        <img style="width: 100%;height: 100%;" :src="ruleForm.imgUrl" v-if="imgFlag"/>
        <ModalUpload class="mb20" :isMultiple="true">
          <div slot="warnTxt">选择上传图片文件</div>
        </ModalUpload>
      </FormItem>
      <FormItem label="简介" prop="description">
        <Input type="textarea" autosize v-model="ruleForm.description"></Input>
      </FormItem>
      <div class="content_title">
        奖等信息
      </div>
      <Table stripe :data="tableData" border style="width: 100%" class="add-minus">
        <TableColumn fixed label="序号" width="50" align="center" type="index"></TableColumn>
        <TableColumn label="奖等">
          <template slot-scope="scope">
            <Input v-model="scope.row.awardLevel" :class="{'_is-error':scope.row.goodsIdRequired}"
                   @focus="showGoodsList(scope)"></Input>
            <div :class="{'_is-error':scope.row.goodsIdRequired}" v-if="scope.row.goodsIdRequired">请输入</div>
          </template>
        </TableColumn>
        <TableColumn label="奖金">
          <template slot-scope="scope">
            <Input v-model="scope.row.awardAmount" :class="{'_is-error':scope.row.goodsIdRequired}"
                   @focus="showGoodsList(scope)"></Input>
            <div :class="{'_is-error':scope.row.goodsIdRequired}" v-if="scope.row.goodsIdRequired">请输入</div>
          </template>
        </TableColumn>
      </Table>

      <div class="mt10 mb20">
        <Button type="primary" @click="addLine">增行</Button>
        <Button @click="minusLine" :disabled="tableData.length == 1">减行</Button>
      </div>
      <FormItem>
        <Button type="primary" @click="submitForm">保存</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imgFlag: true,
      uploadConfFacilities: '',
      ObjInit: {// 编辑初始化数据
        apiCode: 300137,
        content: {
          id: ''
        }
      },
      ruleForm: {
        top: 'false'
      },
      sortList: [],
      rules: {
        name: [
          {required: true, message: '名称不能为空', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '方案代码不能为空', trigger: 'blur'}
        ],
        faceValue: [
          {required: true, message: '面值不能为空', trigger: 'blur'}
        ],
        topPrize: [
          {required: true, message: '最高奖金不能为空', trigger: 'blur'}
        ],
        boxToBook: [
          {required: true, message: '箱本转换不能为空', trigger: 'blur'}
        ],
        bookToSheet: [
          {required: true, message: '本张转换不能为空', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '简介不能为空', trigger: 'blur'}
        ]
      },
      eqpTypeList: [], // 设备类型
      tableData: [
        {
          awardLevel: '',
          awardLevelVa: true,
          awardAmount: '',
          awardAmountVa: true
        }
      ]
    }
  },
  methods: {
    initStore(id) {
      this.ObjInit.content.id = id
      this.postJson('station', this.ObjInit).then(res => {
        this.ruleForm = res.content
        console.log(this.ruleForm)
        if (res.content.award) {
          let awardArray = res.content.award.split(';')
          this.tableData = []
          awardArray.forEach((e) => {
            let aw = e.split(':')
            let awOb = {
              awardLevel: aw[0],
              awardAmount: aw[1],
              awardLevelVa: true,
              awardAmountVa: true
            }
            this.tableData.push(awOb)
          })
        }
        var {id, code, name, faceValue, topPrize, boxToBook, bookToSheet, state, award, top, newProd, sellWell, description, imgUrl} = res.content
        this.ruleForm = {
          id,
          code,
          name,
          faceValue: faceValue + '',
          topPrize: topPrize + '',
          boxToBook: boxToBook + '',
          bookToSheet: bookToSheet + '',
          state: state + '',
          award,
          top: top + '',
          newProd: newProd + '',
          sellWell: sellWell + '',
          description,
          imgUrl
        }
        console.log(this.ruleForm)
        this.imgFlag = false
        setTimeout(() => {
          this.imgFlag = true
        }, 50)
      })
    },
    submitForm() {
      let award = ''
      this.tableData.forEach((e) => {
        award = award + e.awardLevel + ':' + e.awardAmount + ';'
      })
      this.ruleForm.award = award.substr(0, award.length - 1)
      this.$refs['ruleForm'].validate().then(res => {
        if (res) {
          if (this.$route.params.id) { // 修改
            this.modify()
          } else { // 新增
            this.add()
          }
        }
      })
    },
    async modify() {
      this.postJson('station', {
        apiCode: 300139,
        content: this.ruleForm
      }).then(res => {
        if (res.code === '0') {
          this.showMsg('保存成功')
          this.goback()
        }
      })
    },
    async add() {
      this.postJson('station', {
        apiCode: 300138,
        content: this.ruleForm
      }).then(res => {
        if (res.code === '0') {
          this.showMsg('新增成功')
          this.goback()
        }
      })
    },
    // 返回一步
    goback() {
      setTimeout(() => {
        this.$router.back(-1)
      }, 1000)
    },
    // 减行
    minusLine() {
      var len = this.tableData.length
      if (len > 1) {
        this.tableData.splice(len - 1, 1)
      }
    },
    // 增行
    addLine() {
      this.tableData.push({
        awardLevel: '',
        awardLevelVa: true,
        awardAmount: '',
        awardAmountVa: true
      })
    }
  },
  watch: {},
  mounted: async function () {
    let id = this.$route.params.id
    if (id) {
      this.initStore(id)
    } else {
      this.ruleForm = {}
      this.$set(this.ruleForm,'state','true')
      this.$set(this.ruleForm,'top','false')
      this.$set(this.ruleForm,'newProd','false')
      this.$set(this.ruleForm,'sellWell','false')
    }
  }
}
</script>