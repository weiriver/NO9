<template>
  <div>
    <div class="content_title">
      视频信息
    </div>
    <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
      <FormItem label="设备编号" prop="deviceCode">
        <Input v-model="ruleForm.deviceCode"></Input>
      </FormItem>
      <FormItem label="站点编号" prop="stationCode">
        <Input v-model="ruleForm.stationCode"></Input>
      </FormItem>
      <FormItem label="设备类型" prop="deviceTypeId">
        <Select clearable  v-model="ruleForm.deviceTypeId" @change="getValue($event, 'typeX', 'eqpTypeList')" ref="type">
          <Option v-for="item in eqpTypeList" :key="item.id" :value="item.id" :label="item.deviceTypeName"></Option>
        </Select>
      </FormItem>
      <FormItem label="设备型号" prop="modelId">
        <Select clearable  v-model="ruleForm.modelId" @change="getValue($event, 'modelName', 'modelList')">
          <Option v-for="item in modelList" :key="item.id" :value="item.id" :label="item.deviceModelName"></Option>
        </Select>
      </FormItem>
      <FormItem label="设备状态" prop="deviceStatus">
        <Select clearable  v-model="ruleForm.deviceStatus">
          <Option v-for="item in deviceStatusList" :key="item.value" :value="item.value" :label="item.text"></Option>
        </Select>
      </FormItem>
      <FormItem label="运行状态" prop="deviceRunStatus">
        <Select clearable  v-model="ruleForm.deviceRunStatus">
          <Option v-for="item in deviceRunStatusList" :key="item.value" :value="item.value" :label="item.text"></Option>
        </Select>
      </FormItem>
      <FormItem label="存放位置" prop="deviceLocation">
        <Select clearable  v-model="ruleForm.deviceLocation">
          <Option v-for="item in deviceLocationList" :key="item.value" :value="item.value" :label="item.text"></Option>
        </Select>
      </FormItem>
      <FormItem label="设备名称" prop="nameX">
        <Input v-model="ruleForm.nameX"></Input>
      </FormItem>
      <FormItem label="所属区域" prop="regionName">
        <AreaCascader :ruturnAllLevelResultFlag="true" @areaSelectResult="areaSelectResult" ref="as" :stage="3" :res="ruleForm.regionCode" v-model="ruleForm.regionCode"></AreaCascader>
      </FormItem>
      <FormItem label="价格" prop="price">
        <Input v-model="ruleForm.price"></Input>
      </FormItem>
      <FormItem label="押金" prop="deviceBail">
        <Input v-model="ruleForm.deviceBail"></Input>
      </FormItem>
      <FormItem label="扩展信息" prop="extInfo">
        <Input v-model="ruleForm.extInfo"></Input>
      </FormItem>
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
        uploadConfFacilities: '',
        isAdd: true,// 上传者名称
        ObjInit: {// 编辑初始化数据
          apiCode: 300075,
          content: {
            id: ''
          }
        },
        sortObj: {// 获取类型类别
          apiCode: 300281,
          content: {}
        },
        ruleForm: {},
        sortList: [],
        rules: {
          videoTitle: [
            {required: true, message: '视频标题不能为空', trigger: 'blur'}
          ],
          videoInSortId: [
            {required: true, message: '请选择视频类别'}
          ],
          videoStatus: [
            {required: true, message: '请选择视频状态'}
          ]
        },
        deviceStatusList: [], // 设备状态
        deviceRunStatusList: [], //运行状态
        deviceLocationList: [], // 存放位置
        eqpTypeList: [], // 设备类型
        modelList: [] //设备型号
      }
    },
    methods: {
      // 所属区域结果
      areaSelectResult(val) {
        this.ruleForm.regionCode = val[val.length - 1].value
        this.ruleForm.regionName = val[val.length - 1].label
      },
      initStore (id) {
        this.ObjInit.content.id = id
        this.postJson('station', this.ObjInit).then(res => {
          // let {id, deviceCode, stationCode, nameX, deviceBail, price, extInfo, regionCode} = res.content
          this.ruleForm = res.content
          this.ruleForm.deviceTypeId = res.content.typeX
          this.ruleForm.deviceStatus = res.content.deviceStatus.value
          this.ruleForm.deviceRunStatus = res.content.deviceRunStatus.value
          this.ruleForm.deviceLocation = res.content.deviceLocation.value
        })
      },
      submitForm() {
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
          apiCode: 300073,
          content: this.ruleForm
        }).then(res => {
          if (res.code === '0') {
            this.showMsg('保存成功')
            this.goback()
          }
        })
      },
      // 获取下拉列表label值
      getValue(event, key, name) {
        if (name === 'eqpTypeList') {
          var objR = 'deviceTypeName'
        } else {
          var objR = 'deviceModelName'
        }
        let obj = {}
        obj = this[name].find((item)=>{
          // 筛选出匹配数据
          return item.id === event
        });
        this.ruleForm[key] = obj[objR]
      },
      async add() {
        this.postJson('station', {
          apiCode: 300072,
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
      }
    },
    watch: {},
    mounted: async function () {
      let id = this.$route.params.id
      if (id) {
        this.isAdd = false
        this.initStore(id)
      } else {
        this.isAdd = true
        this.ruleForm = {}
      }
      // 获取数字字典（设备状态）
      this.deviceStatusList = this.$store.state.station_enumDic.StationEnum$deviceStatusEnum
      // 获取数字字典（运行状态）
      this.deviceRunStatusList = this.$store.state.station_enumDic.StationEnum$deviceRunStatusEnum
      // 获取数字字典（存放位置）
      this.deviceLocationList = this.$store.state.station_enumDic.StationEnum$deviceLocationEnum
      // 获取设备型号列表
      this.postJson('station', {
        apiCode: 300091,
        content: {
          paginated: false
        }
      }).then(res => {
        this.modelList = res.content.dataList
      })
      // 获取设备类型列表
      this.postJson('station', {
        apiCode: 300081,
        content: {
          paginated: false
        }
      }).then(res => {
        this.eqpTypeList = res.content.dataList
      })
    }
  }
</script>