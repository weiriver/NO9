<template>
  <div>
    <TablePage :totalCount="totalCount" ref="tabelPage">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <Button v-if="true" type="primary" icon="el-icon-edit"
                @click="save">保存
        </Button>
      </div>
      <!-- 查询部分 -->
      <div class="searchBox" slot="query">
        <Form class="form-inline" label-width="140px" :model="setGroupForm" size="mini" ref="setGroupForm">
          <FormItem label="站点编码">
            <Input v-model="Obj.content.stationCode"/>
          </FormItem>
          <FormItem label="所属区域">
            <AreaCascader ref="as" :stage="3" :selectstageFlag="true" :allFlag="true"
                          :addNew="false" @areaSelectResult="areaSelectResult"></AreaCascader>
          </FormItem>
          <FormItem label="负责人">
            <Input v-model="Obj.content.stationOwner"/>
          </FormItem>
          <FormItem label="经营模式">
            <Select clearable v-model="Obj.content.operateModeId">
              <Option v-for="item in operateModeList" :value="item.value" :key="item.value" :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="站点状态">
            <Select clearable v-model="Obj.content.stationStatus">
              <Option v-for="item in kinds" :value="item.value" :key="item.value" :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="站点星级">
            <Rate class="ml10" v-model="Obj.content.stationStar" show-text :texts="['1星','2星','3星','4星','5星']"></Rate>
          </FormItem>
          <FormItem label="协议时间">
            <DatePicker type="daterange" v-model="xieyiDate" @change="xieyiDateEvent" format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"></DatePicker>
          </FormItem>
          <FormItem label="建站时间">
            <DatePicker type="daterange" v-model="jianzhanDate" @change="jianzhanDateEvent" format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"></DatePicker>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="search()">查询</Button>
            <Button plain @click="reset">重置</Button>
          </FormItem>
        </Form>
      </div>
      <!--表格-->
      <div slot="TableSlot">
        <Table ref="multipleTable" stripe :data="data1" :height="tableHeight" border style="width: 100%"
               v-if="tableHeight"
               @select-all="selectAll"
               @selection-change="onSelectChange"
        >
          <TableColumn width="50" type="selection" align="center"></TableColumn>
          <TableColumn label="序号" width="50" type="index" align="center" :index="indexMethod"></TableColumn>
          <TableColumn label="站点编号" prop="stationCode" sortable></TableColumn>
          <TableColumn label="负责人" prop="nameX" sortable></TableColumn>
          <TableColumn label="经营模式" prop="operateModeName" sortable></TableColumn>
          <TableColumn label="所属区域" prop="regionName" sortable></TableColumn>
        </Table>
      </div>
    </TablePage>
  </div>
</template>

<script>
import AreaCascader from '@/components/areaCascader/AreaCascader'

export default {
  name: 'setGroup',
  props: {
    groupId: {
      type: Number,
      default: 0
    }
  },
  watch: {
    middleVal(val) {
      this.Obj.content.groupId = val
      this.query()
    }
  },
  data() {
    return {
      otherArr: [], // 改列表页之外的勾选项
      totalCount: 0,
      tableHeight: 0,
      data1: [],// 表格内容信息
      dataCache: [], // 存放请求到的原始数据
      filterStr: '', // 过滤的输入字符
      Obj: {
        apiCode: 300048,
        content: {
          groupId: this.groupId,
          page: 1
        }
      },
      setGroupForm: {
        page: 1
      },
      operateModeList: [], // 经营模式
      xieyiDate: '',
      jianzhanDate: '',
      groupList: ''
    }
  },
  computed: {
    middleVal() {
      return this.groupId
    },
    kinds() {
      return this.$store.state.station_enumDic.StationEnum$statusEnum
    }
  },
  components: {
    AreaCascader
  },
  methods: {
    indexMethod(index) {
      return index + 1 + (this.Obj.content.page - 1) * 20
    },
    // 重置
    reset() {
      this.xieyiDate = ''
      this.jianzhanDate = ''
      this.$refs.as.clear()
      this.Obj = {
        apiCode: 300048,
        content: {
          page: 1,
          groupId: this.groupId
        }
      }
    },
    // 所属区域结果
    areaSelectResult(val) {
      this.Obj.content.regionCode = val
    },
    getOperateModeList() {
      // 获取数字字典（经营模式）
      this.operateModeList = this.$store.state.station_enumDic.operateMode
    },
    // 协议日期
    xieyiDateEvent(date) {
      this.Obj.content.contractSignBeginTime = date[0]
      this.Obj.content.contractSignEndTime = date[1]
    },
    // 建站日期
    jianzhanDateEvent(date) {
      this.Obj.content.signUpBeginTime = date[0]
      this.Obj.content.signUpEndTime = date[1]
    },
    selectAll(val) {
      // console.log(val)
    },
    // 多选变化的时候，触发
    onSelectChange(val) {
      this.groupList = val.map(v => {
        return v.stationCode
      }).join(';')
    },
    async save() {
      let arr = []
      this.otherArr.forEach((val) => {
        arr.push(val.stationCode)
      })
      if (arr.length > 0 || this.groupList) {
        let str = arr.join(';')
        var res = await this.postJson('station', {
          apiCode: 300047,
          content: {
            groupId: this.groupId,
            stationCode: [this.groupList, str].join(';')
          }
        })
        if (res.code == 0) {
          this.showMsg('划分站点成功')
        }
      } else {
        this.showMsg('请选择要划分的站点', 'warning')
      }
    },
    async init() {
      this.Event.$on('pagechange', (val) => {
        this.Obj.content.page = val
        this.query()
      })
      if (location.hash.includes('?')) {
        this.state = location.hash.split('?')[1].split('=')[1]
      }
      this.search()
    },
    search() {
      this.Event.$emit('pageInit', 1)
      this.query()
    },
    // 过滤
    arrFilter() {
      if (this.filterStr) {
        this.data1 = this.ArrFilter(this.filterStr, this.dataCache)
      } else {
        this.query()
      }
    },
    // 查询
    async query(page) {
      if (page) this.Obj.content.page = 1
      this.loading = true
      //处理评分传0
      if (this.Obj.content.stationStar == 0) delete  this.Obj.content.stationStar
      var res = await this.postJson('station', {
        apiCode: 300048,
        content: this.Obj.content
      })
      this.loading = false
      if (res.code == 0) {
        var dataList = res.content.dataList
        this.data1 = this.dataCache = dataList
        this.totalCount = res.content.dataPage.totalCount
        if (this.Obj.content.groupId) {
          var secRes = await this.postJson('station', {
            apiCode: 300045,
            content: {id: this.Obj.content.groupId}
          })
          if (secRes.code == 0) {
            this.otherArr = []
            let arr = []
            secRes.content.stationGroups.forEach((val) => {
              let have = false
              this.data1.forEach((val1) => {
                if (val.stationCode === val1.stationCode) {
                  this.$refs.multipleTable.toggleRowSelection(val1)
                  arr.push(val.stationCode)
                  have = true
                }
              })
              if (have === false) {
                this.otherArr.push(val)
              }
            })
            this.groupList = arr.join(';')
            var result = []
            var obj = {}
            for (var i = 0; i < this.otherArr.length; i++) {
              if (!obj[this.otherArr[i].stationCode]) {
                result.push(this.otherArr[i])
                obj[this.otherArr[i].stationCode] = true
              }
            }
            result.forEach((val, key) => {
              if (val.stationCode === '') {
                result.splice(key, 1)
              }
            })
            this.otherArr = result
          }
        }
      }
    }
  },
  mounted() {
    this.init()
    this.tableHeight = 200
    this.getOperateModeList()
  }
}
</script>

<style scoped>

</style>