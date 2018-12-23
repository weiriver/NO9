<template>
  <div class="impower">
    <div class="boxList">
      <div class="boxTop">
        <ButtonGroup>
          <Button type="primary" @click="showList" v-if="Auth(200042)">角色授权</Button>
          <Button type="primary"  @click="showUserTree"  v-if="Auth(200042)">单用户授权</Button>
          <Button type="primary" @click="showSysAdminList">系统管理员授权</Button>
        </ButtonGroup>
      </div>
      <div class="boxMiddle">
        <!--授权对象输入框-->
        <div class="boxM_perline">
          <Input v-model="importObj" disabled><template slot="prepend">授权对象</template></Input>
          <Button type="primary" style="position: absolute;right: -100px;top: 2px;" @click="saveAuth"
                  :disabled="!tabTreeFlag">保存权限
          </Button>
        </div>
        <div class="perTabTree">
          <div class="treeTabBox">
            <Tabs @tab-click="(value) =>tabChange(value.name)" :value="tabsIndex.toString()">
              <TabPane v-for="(item,index) in tabList" :label="item.nameX" :name="index.toString()" :key="index" >
              </TabPane>
            </Tabs>
            <div class="perTab" v-show="treeList.length">
              <div class="tree-box">
                <Tree ref="tree" node-key="id" :props="defaultProps" :default-expand-all = "true" :data="treeList" @check="getCheckNodes" :default-checked-keys="selectedMenu"
                      show-checkbox></Tree>
              </div>
            </div>
          </div>
        </div>
        <!--点击系统管理员授权弹出框-->
        <Dialog :visible="sysAdminFlag"
                title="选择用户"
                width="568"
                @open="sys_ok"
                @close="sys_cancel">
          <TablePage :totalCount="totalCount2" :showPowerSearch="false">
            <div slot="TableSlot">
              <Table stripe :data="tableData2" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
                <TableColumn
                  label="序号"
                  width="50">
                  <template slot-scope="scope">
                    {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
                  </template>
                </TableColumn>
                <TableColumn label="名称">
                  <template slot-scope="scope">
                    <Button type="text" @click="showTabTree(scope.row, 'user')">{{ scope.row.nameX }}</Button>
                  </template>
                </TableColumn>
                <TableColumn label="类型" prop="typeX"></TableColumn>
                <TableColumn label="状态" width="140">
                  <template slot-scope="scope">
                    {{ scope.row.status ? '开启' : '冻结' }}
                  </template>
                </TableColumn>
              </Table>

            </div>
          </TablePage>
        </Dialog>

        <!--点击区域用户授权弹出框-->
        <AreauserSelector :checkboxFlag="false" :showInput="false" ref="ass" @selectResult="showTabTree_user"></AreauserSelector>
        <!--点击 “角色授权” 弹出框-->
        <Dialog :visible="imFlag"
                title="选择角色"
                width="'568'"
                @open="im_ok"
                @close="im_cancel">
          <TablePage :totalCount="totalCount" :showPowerSearch="false">
            <div slot="TableSlot">
              <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
                <TableColumn
                  label="序号"
                  width="50">
                  <template slot-scope="scope">
                    {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
                  </template>
                </TableColumn>
                <TableColumn label="名称">
                  <template slot-scope="scope">
                    <Button type="text" @click="showTabTree(scope.row, 'role')">{{ scope.row.nameX }}</Button>
                  </template>
                </TableColumn>
                <TableColumn label="类型" prop="typeX">
                </TableColumn>
                <TableColumn label="状态" width="140">
                  <template slot-scope="scope">
                    {{ scope.row.status ? '开启' : '冻结' }}
                  </template>
                </TableColumn>
                <!--<TableColumn-->
                <!--label="操作"-->
                <!--width="100">-->
                <!--<template slot-scope="scope">-->
                <!--<Button @click="detailShow(scope.row)" type="text">查看</Button>-->
                <!--</template>-->
                <!--</TableColumn>-->
              </Table>
            </div>
          </TablePage>
        </Dialog>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import AreauserSelector from '../../../../../../components/areauserSelect/AreauserSelect.vue'
  export default {
    props: {},
    components: {
      AreauserSelector
    },
    data() {
      return {
        userTree: false,
        checkedKeys: [],
        importObj: '', // 授权对象输入框绑定
        imFlag: false, // 点击角色授权，弹框与否
        treeFlag: false,
        sysAdminFlag: false, // 点击系统管理员授权，弹框与否
        tableHeight: 450,
        confirmSearch: { // 点击确认搜索时
          page: 1
        },
        defaultProps: {
          label: 'title'
        },
        hasChecked: [[], []], // 角色已拥有的权限
        target: {}, // 当前显示对象
        authType: '', // 当前选择类型
        selectedMenu: [], // 已被选中的菜单
        tableData: [], // element表格数据-角色
        tableData2: [], // element表格数据-系统用户
        totalCount: 0, // 消息总数-角色
        totalCount2: 0, // 消息总数-系统管理员
        tabsIndex: 0, // 角色授权-tab值
        tabTreeFlag: false, // 角色授权-tab整体显示与否
        treeList: [], // 角色授权-tab-信息发布tree
        dataList: [
          {
            title: '选择权限',
            expand: true,
            children: [
              {
                title: '数据统计'
              }
            ]
          }
        ], // 角色授权-tab-资料统计tree
        roleList: [], // 角色授权-弹框-表格内容
        roleListCache: [], // 角色授权-弹框-表格内容
        roleListCache1: [], // 系统管理员授权-弹框-表格内容
        roleDetail: '', // 角色详情
        loading: true, // 表格加载
        ObjSys: {},
        tabList: [], // tab的数组
        allTreeArr: [], // 存放所有的树结构数据
        permissionsArr: [], // 存放即将“保存权限”的对象
        permissionsArr_cache: [], // 缓存“保存权限”的对象
        saveAuthObj: { // “保存权限”的对象
          authType: '',
          authId: '',
          authName: '',
          permissions: ''
        }
      }
    },
    methods: {
      treeBuildEvent(arr) {
        var newArr = []
        if (arr && arr.length) {
          for (var i = 0; i < arr.length; i++) {
            newArr[i] = {}
            newArr[i].expand = true
            // newArr[i].expand = false
            if (arr[i].children !== null && arr[i].children instanceof Array === false) {
              newArr[i].id = arr[i].children.id
              newArr[i].systemId = arr[i].id
            } else {
              newArr[i].id = arr[i].id
            }
            newArr[i].typeX = arr[i].typeX
            newArr[i].seq = arr[i].seq
            newArr[i].remark = arr[i].remark
            newArr[i].code = arr[i].code
            if (arr[i].title) {
              newArr[i].title = arr[i].title
            } else {
              newArr[i].title = arr[i].nameX
            }
            if (arr[i].checked === true) {
              newArr[i].checked = true
              // newArr[i].selected = true
            } else {
              newArr[i].checked = false
            }
            // 禁用状态 disabled: true-不可操作 false-可以操作 把nocheck数据存入树
            if (arr[i].nocheck === true) {
              newArr[i].disabled = true
              newArr[i].nocheck = true
              // newArr[i].selected = true
            }
            if (arr[i].nocheck === false) {
              newArr[i].disabled = false
              newArr[i].nocheck = false
            }
            // 把userOwn 数据存入树
            if (arr[i].userOwn === true) {
              newArr[i].userOwn = true
            }
            if (arr[i].userOwn === false) {
              newArr[i].userOwn = false
            }
            if (arr[i].status === true) {
              newArr[i].status = true
              // newArr[i].selected = true
            } else {
              newArr[i].status = false
            }
            if (arr[i].children && (typeof arr[i].children === 'object') && arr[i].children.children instanceof Array) {
              newArr[i].children = this.treeBuildEvent(arr[i].children.children)
              if (arr[i].children.checked === true) {
                newArr[i].children.checked = true
              } else {
                newArr[i].children.checked = false
              }
            } else {
              newArr[i].children = []
              // this.everyEvent()
            }
            if (arr[i].children && arr[i].children instanceof Array) {
              newArr[i].children = this.treeBuildEvent(arr[i].children)
            }
          }
        }
        // console.log(newArr)
        newArr.forEach((val) => {
          if (val.children.length > 0) {
            val.children.unshift({
              title: 'every',
              disabled: false,
              checked: val.checked,
              children: [],
              style: {
                color: 'red',
                height: '0px',
                overflow: 'hidden'
              }
            })
          }
        })
        // console.log(newArr)
        return newArr
      },
      cancelChecked(obj, index) {
        // 通过index值来确认是属于菜单内的权限还是区域内的权限
        // 将checeked为true的想存进缓存数组
        if (obj.checked === true && obj.code) {
          if (index === 0){
            this.hasChecked[0].push(obj.code)
          } else {
            this.hasChecked[1].push(obj.code)
          }
          // this.hasChecked.push(obj.code)
        }
        if (obj.children.length === 0) {
          return
        }
        if (obj.children.length > 0) {
          this.$set(obj, 'checked', false)
          obj.children.forEach((val) => {
            this.cancelChecked(val, index)
          })
        }
      },
      // 角色授权-弹框-确认
      im_ok() {
        // console.log('角色授权弹出确定')
      },
      // 角色授权-弹框-取消
      im_cancel() {
        this.imFlag = false
        // console.log('角色授权弹出取消')
      },
      sys_ok () {
        // this.sysAdminFlag = true
      },
      sys_cancel() {
        this.sysAdminFlag =false
      },
      getCheckNodes (data, obj) {
        let finalArr = []
        // console.log(data)
        // console.log(obj)
        function getNodeCode(arr) {
          let result = []
          for (let val of arr) {
            result.push(val.code)
          }
          return result
        }
        finalArr = getNodeCode(obj.checkedNodes).concat(getNodeCode(obj.halfCheckedNodes))
        // console.log(finalArr)
        this.permissionsArr[this.tabsIndex] = finalArr
        this.checkedKeys[this.tabsIndex] = obj.checkedKeys
      },
      everyEvent() {
        let fn = () => {
          let arr = document.getElementsByClassName('el-tree-node__label')
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].innerHTML === 'every') {
              arr[i].parentNode.parentNode.style.height = '0px'
              arr[i].parentNode.parentNode.style.overflow = 'hidden'
            }
          }
        }
        setTimeout(fn(), 500)
        let interV = setInterval(() => {
          fn()
        }, 100)
        setTimeout(() => {
          clearInterval(interV)
        }, 2000)
      },
      // "点击角色名称"获取tree数据
      showTabTree(item, authType) {
        this.tabsIndex = 0
        this.checkedKeys = []
        this.hasChecked = [[], []]
        // this.checkFlag = true
        this.target = item
        this.authType = authType
        // console.log(item)
        this.detailShow(item)
        // 确认角色的时候清空已选项，避免造成干扰
        // this.treeFlag = true
        this.selectedMenu = []
        this.loading = true
        this.saveAuthObj.sysModule =  sessionStorage.getItem('sysName')
        this.saveAuthObj.authId = item.id
        this.saveAuthObj.authName = item.nameX
        this.imFlag = false
        this.sysAdminFlag = false
        this.tabTreeFlag = true
        this.importObj = item.nameX
        this.postJson('common', {
          apiCode: 200041,
          content: {
            sysModule: sessionStorage.getItem('sysName'),
            authType: authType,
            authId: item.id,
            authName: item.nameX
          }
        }).then(res => {
          this.loading = false
          if (res.code === '0') {
            this.tabList = res.content
            // console.log('this.tabList', this.tabList)
            let arrr = []
            res.content.forEach((val) => {
              arrr.push(val.children)
            })
            // 获取到了树形空间所需要的所有数据
            this.allTreeArr = this.treeBuildEvent(arrr)
            // console.log(this.allTreeArr)
            // console.log('alltree长度', this.allTreeArr.length)
            this.allTreeArr.forEach((val, index) => {
              this.cancelChecked(val, index)
            })
            // console.log(this.hasChecked)
            this.treeList[0] = this.allTreeArr[0]
            for (var i = 0; i < this.allTreeArr.length; i++) {
              this.permissionsArr_cache[i] = []
              // console.log(this.allTreeArr[i])
              this.initPermissionsArr(this.allTreeArr[i], i)
            }
            this.tabChange(this.tabsIndex)
          }
        })
      },
      // "点击用户名称"获取tree数据
      showTabTree_user() {
        this.tabsIndex = 0
        this.checkedKeys = []
        // console.log('请求200041', this.saveAuthObj.authName)
        this.selectedMenu = []
        this.loading = true
        this.saveAuthObj.sysModule =  sessionStorage.getItem('sysName')
        this.saveAuthObj.authId = this.$refs.ass.userSelectId
        this.saveAuthObj.authName = this.$refs.ass.userSelectName
        this.imFlag = false
        this.tabTreeFlag = true
        this.importObj = this.$refs.ass.userSelectName
        // console.log('this.saveAuthObj.authName', this.saveAuthObj.authName)
        this.postJson('common', {
          apiCode: 200041,
          content: {
            sysModule: sessionStorage.getItem('sysName'),
            authType: 'user',
            authId: this.saveAuthObj.authId,
            authName: this.saveAuthObj.authName
          }
        }).then(res => {
          // console.log(res)
          this.loading = false
          if (res.code === '0') {
            this.tabList = res.content
            let arrr = []
            res.content.forEach((val) => {
              arrr.push(val.children)
            })
            this.allTreeArr = this.treeBuildEvent(arrr)
            this.allTreeArr.forEach((val) => {
              this.cancelChecked(val)
            })
            // 如果不是最后一级，则把checked变成false
            this.treeList[0] = this.allTreeArr[0]
            // console.log(this.allTreeArr)
            // console.log('alltree长度', this.allTreeArr.length)
            for (var i = 0; i < this.allTreeArr.length; i++) {
              this.permissionsArr_cache[i] = []
              this.initPermissionsArr(this.allTreeArr[i], i)
            }
            this.tabChange(this.tabsIndex)
          }
        })
      },
      // 初始化permissionsArr
      initPermissionsArr(obj, index) {
        // if (obj.checked === true && obj.code && obj.children.length === 0) {
        // 因为会把父级别也过滤掉，后面需求是父级也要传
        // console.log(obj)
        if (obj.checked === true && obj.code) {
          this.permissionsArr_cache[index].push(obj)
          this.selectedMenu.push(obj.id)
        }
        if (obj.children instanceof Array) {
          for (var i = 0; i < obj.children.length; i++) {
            this.initPermissionsArr(obj.children[i], index)
          }
        }
        this.selectedMenu = Array.from(new Set(this.selectedMenu))
        // this.$refs.tree.
        // console.log(this.selectedMenu)
      },
      // 点击单用户授权--事件
      showUserTree() {
        this.userTree = true
        this.saveAuthObj.sysModule =  sessionStorage.getItem('sysName')
        this.saveAuthObj.authType = 'user'
        this.importObj = ''
        this.tabTreeFlag = false
        this.$refs.ass.dialogVisible = true
      },
      // 点击 角色授权 -- 获取角色列表 事件
      showList() {
        this.userTree = false
        // 清空详情组件
        this.saveAuthObj.sysModule =  sessionStorage.getItem('sysName')
        this.saveAuthObj.authType = 'role'
        this.imFlag = true
        this.tabTreeFlag = false
        this.importObj = ''
        this.query()
      },
      async query() {
        this.confirmSearch.sysModule = sessionStorage.getItem('sysName')
        var res = await this.postJson('common', {
          apiCode: 200043,
          content: this.confirmSearch
        })
        // console.log(res.content.dataList)
        this.tableData = res.content.dataList
        // console.log('tableData')
        // this.tableData = res.content.dataList
        this.totalCount = res.content.dataPage.totalCount
      },
      // 分页事件
      pageChoice(page) {
        this.confirmSearch.page = page
        this.query()
      },
      // 角色授权-弹框--点击列表中的查看，事件
      detailShow(item) {
        // console.log(item)
        let user = []
        if (item.userList && item.userList.length >= 0) {
          item.userList.forEach((val, index) => {
            let obj = {}
            obj.name = '用户' + (index + 1)
            obj.value = val.name
            user.push(obj)
          })
        }
        // user += val
        this.roleDetail = item
      },
      // 点击系统管理员授权--事件
      showSysAdminList() {
        this.userTree = false
        this.saveAuthObj.sysModule =  sessionStorage.getItem('sysName')
        this.saveAuthObj.authType = 'user'
        this.sysAdminFlag = true
        this.tabTreeFlag = false
        this.importObj = ''
        this.querySys()
      },
      querySys(page) {
        this.ObjSys = { // 系统管理员 请求对象
          apiCode: 200044,
          content: {
            sysModule: sessionStorage.getItem('sysName'),
            page: 1,
            limit: 20
          }
        }
        if (page) this.ObjSys.content.page = 1
        this.loading = true
        this.postJson('common', this.ObjSys).then(res => {
          // console.log(res)
          this.loading = false
          var roleList = res.content.dataList
          this.tableData2 = this.roleListCache1 = roleList
          this.totalCount2 = res.content.dataPage.totalCount
        })
      },
      // 点击保存权限触发方法
      saveAuth() {
        this.saveAuthObj.sysModule =  sessionStorage.getItem('sysName')
        this.saveAuthObj.permissions = ''
        let data1 = this.hasChecked // 原先的权限
        let data2 = this.permissionsArr // 点击的权限
        let authArr = []
        data2.forEach((item, index) => {
          if (item) {
            authArr = authArr.concat(item)
          } else {
            authArr = authArr.concat(data1[index])
          }
        })
        console.log('data1', data1)
        console.log('data2', data2)
        // console.log('authArr', authArr)
        this.saveAuthObj.sysModule =  sessionStorage.getItem('sysName')
        this.saveAuthObj.permissions = authArr.join('@')
        // console.log(this.saveAuthObj.permissions)
        this.postJson('common', {
          apiCode: 200042,
          content: this.saveAuthObj
        }).then(res => {
          if (res.code === '0') {
            // Message.success('[保存权限]成功')
            this.showMsg('[保存权限]成功')
            if (this.userTree) {
              this.showTabTree_user()
            } else {
              this.showTabTree(this.target, this.authType)
            }
          }
        })
      },
      // tabs被点击
      tabChange(index) {
        this.tabsIndex = index
        this.treeList = []
        this.treeList[0] = this.allTreeArr[index]
        if (this.checkedKeys[this.tabsIndex]) {
          this.$refs.tree.setCheckedKeys(this.checkedKeys[this.tabsIndex], true)
        }
        this.everyEvent()
        // console.log(this.treeList[0])
      }
    },
    mounted() {
      // this.showList()
    }
  }
</script>
<style lang="scss" scoped>
  .impower {
    height: 100%;
    display: flex;
    flex-direction: column;
    .boxList {
      flex: 1;
      padding-top: 12px;
      display: flex;
      flex-direction: column;
      .boxTop {
        height: 32px;
        margin-bottom: 12px;
      }
      .boxMiddle {
        flex: 1;
        padding: 0 5px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        min-height: 100px;
        .boxM_perline {
          width: 50%;
          height: 32px;
          margin-top: 12px;
          position: relative;
        }
        .perTabTree {
          flex: 1;
          margin-top: 1px;
          display: flex;
          flex-direction: column;
          .imBtnBox {
            .ivu-btn {
              margin-top: 12px;
            }
          }
          .treeTabBox {
            flex: 1;
            display: flex;
            flex-direction: column;
            margin-top: 12px;
            padding: 8px 0px 15px 0px;
            min-height: 400px;
            border: 1px solid #dddee1;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
            overflow-y: auto;
            position: relative;
            .tabsTop {
              height: 40px;
              line-height: 40px;
              background: #5f9fcf;
              border-top-left-radius: 4px;
              border-top-right-radius: 4px;
              margin-bottom: 12px;
              ul {
                li {
                  float: left;
                  padding: 0 16px;
                  font-size: 14px;
                  color: #fff;
                  cursor: pointer;
                }
                li.active {
                  color: #000;
                  background: #fff;
                }
              }

            }
            .perTab {
              flex: 1;
              display: flex;
              /*padding-top: 12px;*/
              padding-left: 10px;
              overflow-y: auto;
              .tree-box{
                overflow-y: auto;
                margin-right: 10px;
                .menu-title{
                  line-height: 28px;
                  font-weight: 700;
                  border-bottom: 1px dashed #dddee1;
                  font-size: 14px;
                  margin: 10px 0px 20px 0;
                }
                /*&>div:nth-child(1){*/
                /*border-bottom: 1px dashed #dddee1;*/
                /*margin: 10px 0px 20px 0;*/
                /*}*/
                /*.active{*/
                /*line-height: 28px;*/
                /*font-weight: 700;*/
                /*!*border-bottom: 1px dashed #dddee1;*!*/
                /*font-size: 15px;*/
                /*cursor: pointer;*/
                /*}*/
                /*.active:hover{*/
                /*color: #fc5f43;*/
                /*}*/
                /*.noactive{*/
                /*line-height: 28px;*/
                /*-webkit-text-size-adjust: none;*/
                /*font-size: 6px;*/
                /*cursor: pointer;*/
                /*}*/
                /*.noactive:hover{*/
                /*color: #fc5f43;*/
                /*}*/
              }
            }
          }
        }
      }
    }
  }
  .makeLookBox {
    padding: 0px 10px 20px 10px;
    border: 1px solid #dddee1;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    position: relative;
    h3 {
      line-height: 38px;
      font-size: 14px;
      padding-top: 12px;
      border-bottom: 1px dashed #eaebed;
    }
    .makeLook_tableBox {
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      table {
        width: 49%;
        tr {
          display: flex;
          margin-bottom: 10px;
          td {
            border: 1px solid #e9eaec;
            height: 40px;
            line-height: 40px;
          }
          td:nth-of-type(1) {
            width: 100px;
            padding-right: 22px;
            text-align: right;
            background: #f8f8f9;
            font-weight: 900;
          }
          td:nth-of-type(2) {
            padding-left: 18px;
            border-left: none;
            min-width: 151px;
            flex: 1
          }
        }
        tr:nth-child(2){
          margin-bottom: 0;
        }
      }
      &.users > table {
        width: 100%;
      }
    }
  }
</style>
