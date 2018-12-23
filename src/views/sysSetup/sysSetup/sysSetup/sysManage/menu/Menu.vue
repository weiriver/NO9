<template>
  <div class="container">
    <Tabs @tab-click="(value) =>tabChange(value.name)" :value="tabsIndex.toString()">
      <TabPane v-for="(item,index) in allTreeArr" :label="item.title" :name="index.toString()" :key="index" >
      </TabPane>
    </Tabs>
    <div class="wrapper">
      <div class="page-left">
        <!--<div class="color-state">-->
        <!--<p><span></span>已启用<span></span>已停用</p>-->
        <!--</div>-->
        <Tree
          :data="imforList"
          :expand-on-click-node="clickFlag"
          :default-expand-all = "true"
          :props="defaultProps"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }" :name="data.code">
            <span @click="getMenuInfo(data, node)">{{ node.label }}</span>
            <span v-if="data.id !== 0" >
              <Button
                type="text"
                size="mini"
                v-if="Auth(200048)"
                @click="() => modifyMenu(data, node)">
                修改
              </Button>
              <Button
                type="text"
                size="mini"
                v-if="Auth(200049)"
                @click="() => delele(data, node)">
                删除
              </Button>
            </span>
            <span v-if="data.id === 0 && Auth(200047)" >
              <Button
                type="text"
                size="mini"
                @click="() => addMenu()">
                新增
              </Button>
            </span>
          </span>
        </Tree>
      </div>
      <div class="page-right">
        <div>
          <Form ref="Obj" :model="Obj" label-width="200px" :rules="ruleInline" inline>
            <FormItem label="父级" prop="">
              <Input v-model="father" disabled></Input>
            </FormItem>
            <FormItem label="名称" prop="nameX">
              <Input v-model="Obj.nameX" :disabled="disabled"></Input>
            </FormItem>
            <FormItem label="类型" prop="typeX">
              <Select v-model="Obj.typeX" :disabled="disabled">
                <Option v-for="item in typeXList" :value="item.value" :key="item.value" :label="item.label"></Option>
              </Select>
            </FormItem>
            <FormItem label="代码" prop="code">
              <Input v-model="Obj.code	" :disabled="disabled"></Input>
            </FormItem>
            <FormItem label="状态" prop="status">
              <RadioGroup v-model="Obj.status" :disabled="disabled">
                <Radio :disabled="disabled" label="true">启用</Radio>
                <Radio :disabled="disabled" label="false">停用</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="排序" prop="seq">
              <Input v-model="Obj.seq" :disabled="disabled"></Input>
            </FormItem>
            <FormItem label="菜单图片样式" prop="typeX">
              <Input v-model="Obj.typeX"></Input>
            </FormItem>
            <FormItem label="前端跳转路由" v-if="Obj.typeX =='menu'">
              <Input v-model="Obj.link	" :disabled="disabled"></Input>
            </FormItem>
            <FormItem label="桌面菜单名称" prop="nameEn">
              <Input v-model="Obj.nameEn	" :disabled="disabled"></Input>
            </FormItem>
            <FormItem label="详细描述" prop="remark">
              <Input v-model="Obj.remark" :disabled="disabled" type="textarea" placeholder="名称:/a/b/匹配/a/b/:id 路由，名称:/a/b 匹配/a/b 路由"
                     :autosize="autoSize"></Input>
            </FormItem>
          </Form>
          <div class="btn-box">
            <Button type="primary" :loading="saveFlag"  @click="save">保存</Button>
            <Button @click="reset">清空</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'menuList',
    data () {
      var obj = { // 后台校验属性可使用性
        apiCode: 200050,
        content: {
          sysModule: sessionStorage.getItem('sysName')
        }
      }
      const validator = (rule, value, callback, source, options) => {
        obj.content = Object.assign(obj.content, source, {id: this.Obj.id})
        this.postJson('common',obj).then(res => {
          // this.spinShow = false
          if (res.code === '0') {
            callback()
            return true
          } else {
            callback(new Error('菜单编码已经存在'))
            for (var key in source) {
              if (key === 'code') {
                callback(new Error('菜单编码已经存在'))
              } else {
                callback()
              }
            }
          }
        })
      }
      let validateSeq = (rule, value, callback) => {
        if (value) {
          let regExp = /^[1-9]\d*$/
          if (!regExp.test(value)) {
            callback(new Error('请输入非0的数字'))
          }
        }
        callback()
      }
      return {
        tabsIndex: 0,
        title: '',
        father: '', // 父节点名称
        disabled: true,
        clickFlag: false,
        saveFlag: false, // 保存控制
        showBtn: false, // 显示按钮
        allTreeArr: [], // 全部菜单树结构
        fatherFlag: true, // 父级提示信息
        autoSize: {
          minRows: 2, maxRows: 4
        },
        defaultProps: {
          label: 'title'
        },
        imforList: [],
        typeXList: [
          {
            value: 'menu',
            label: '菜单'
          },
          {
            value: 'func',
            label: '功能'
          }
        ], // 类型数组
        buttonProps: {
          type: 'info',
          size: 'small'
        },
        ruleInline: {
          nameX: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
            {type: 'string', min: 2, message: '不能少于2个字', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '代码不能为空', trigger: 'blur'},
            {type: 'string', min: 6, message: '不能少于6个字', trigger: 'blur'},
            {validator: validator, required: true, trigger: 'blur'}
          ],
          seq: [
            { validator: validateSeq, trigger: 'blur'}
          ]
        },
        Obj: { // 修改的对象
          id: '',
          sysModule: sessionStorage.getItem('sysName'),
          nameX: '',
          code: '',
          status: 'false',
          parentId: '',
          systemId: '',
          typeX: '',
          seq: '',
          remark: ''
        }
      }
    },
    methods: {
      tabChange(index) {
        this.tabsIndex = index
        this.imforList = []
        var obj = this.allTreeArr[index]
        this.$set(this.imforList, 0, obj)
      },
      // 点击左侧树结构，获取菜单信息
      getMenuInfo(data, node) {
        this.showBtn = false
        this.father = data.title
        this.Obj.parentId = data.id
        // 当前节点类型
        this.Obj.typeX = 'menu'
        // 所属子系统ID
        this.Obj.systemId = this.imforList[0].systemId
      },
      // 修改菜单
      modifyMenu(data, node) {
        this.showBtn = true
        this.disabled = false
        this.modifyOrAdd = 'modify'
        this.title = '修改'
        // 所属子系统ID
        this.Obj.systemId = this.imforList[0].systemId
        // 父级菜单子系统ID
        // this.Obj.parentId = root[node.parent].node.id
        this.Obj.parentId = node.parent.data.id
        // 父级菜单名字
        this.father = node.parent.label
        // 当前节点ID
        this.getDetail(data.id)
      },
      // 新增菜单
      addMenu() {
        this.showBtn = true
        this.disabled = false
        this.modifyOrAdd = 'add'
        this.title = '新增'
        this.father = '根目录'
        this.Obj = { // 新增的对象
          id: '',
          sysModule: sessionStorage.getItem('sysName'),
          nameX: '',
          code: '',
          status: 'true',
          parentId: '',
          systemId: '',
          typeX: 'menu',
          seq: '',
          remark: ''
        }
      },
      // 删除
      delele(data, node) {
        this.postJson('common',{apiCode: 200049, content: {id: data.id}}).then(res => {
          if (res.code == 0) {
            this.showMsg('删除成功')
            this.query()
          }
        })
      },
      getDetail(id) {
        // this.spinShow = true
        this.postJson('common',{
          apiCode: 200046,
          content: {
            id
          }
        }).then(res => {
          const {id, seq, code, title, link, typeX, remark, status, icon, nameEn} = res.content
          Object.assign(this.Obj, {
            id, seq, code, nameX: title, link, typeX: typeX.value, remark, status: status + '', icon, nameEn
          })
        })
      },
      // 点击保存
      save() {
        // this.spinShow = true
        this.saveFlag = true
        this.$refs['Obj'].validate((res) => {
          if (res) {
            if (this.modifyOrAdd === 'add') {  // 新增
              delete this.Obj.id
              this.postJson('common',{
                apiCode: 200047,
                content: this.Obj
              }).then(res => {
                // this.spinShow = false
                if (res.code === '0') {
                  // Message.success('[新增菜单]成功')
                  this.showMsg('[新增菜单]成功')
                  this.Obj = { // 新增的对象
                    id: '',
                    sysModule: sessionStorage.getItem('sysName'),
                    nameX: '',
                    code: '',
                    status: 'true',
                    parentId: '',
                    systemId: '',
                    typeX: '',
                    seq: '',
                    remark: ''
                  }
                  this.query()
                  this.saveFlag = false
                }
              })
            } else { // 修改
              this.postJson('common',{
                apiCode: 200048,
                content: this.Obj
              }).then(res => {
                if (res.code === '0' && res.content.updated > 0) {
                  this.showMsg('[菜单修改]成功')
                  this.reset()
                  this.query()
                  this.saveFlag = false
                } else {
                  this.saveFlag = false
                }
              })
            }
          }
        })
      },
      // 获取菜单
      query(page) {
        if (page) this.Obj.content.page = 1
        this.postJson('common',{
          apiCode: 200045,
          content: {
            sysModule: sessionStorage.getItem('sysName')
          }
        }).then(res => {
          if (res.code === '0') {
            this.allTreeArr = this.TreeArrRebuild(res.content)
            // 新增
            var obj = this.TreeArrRebuild(res.content)[this.tabsIndex]
            // obj.render = this.addRender
            // this.$set(obj, 'render', this.addRender)
            // this.imforList[0] = obj
            this.imforList = []
            this.$set(this.imforList, 0, obj)
          }
        })
      },
      // 清空
      reset() {
        this.Obj = { // 新增的对象
          id: '',
          sysModule: sessionStorage.getItem('sysName'),
          nameX: '',
          code: '',
          status: 'true',
          parentId: '',
          systemId: '',
          typeX: '',
          seq: '',
          remark: ''
        }
      },
    },
    beforeMount() {
      this.query()
    }
  }
</script>

<style lang="scss">
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .container{
    height: 100%;
  }
  .wrapper{
    display: flex;
    font-size: 14px;
    padding: 10px 20px 0 20px;
    /*height: 510px;*/
    /*height: 100%;*/
    .page-left{
      overflow-y: auto;
      width: 280px;
      height: 530px;
      border: 1px solid #dddee1;
      border-radius: 10px;
      padding-top: 10px;
      /*padding: 10px;*/
      margin-right: 20px;
    }
    .page-right{
      flex: 1;
      height: 510px;
      border: 1px solid #dddee1;
      border-radius: 10px;
      padding: 15px;
      overflow: auto;
      /*border-left: 1px solid #dddee1;*/
      &>div{
        width: 560px;
        height: 100%;
      }
      .btn-box {
        text-align: center;
        margin-left: 80px;
      }
    }
  }
</style>
