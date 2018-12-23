<template>
  <div>
    <Form :model="ruleForm" :rules="rules" ref="formRef" label-width="110px">
      <FormItem label="站点编号">
        <Input v-model="ruleForm.stationCode" disabled></Input>
      </FormItem>
      <FormItem label="状态">
        <Input v-model="ruleForm.stationStatus.text" disabled></Input>
      </FormItem>
      <FormItem label="所属区域">
        <Input v-model="ruleForm.regionName" disabled></Input>
      </FormItem>
      <FormItem label="站点经度" v-if="ruleForm.stationMap">
        <Input v-model="ruleForm.stationMap.stationLng" disabled></Input>
      </FormItem>
      <FormItem label="站点纬度" v-if="ruleForm.stationMap">
        <Input v-model="ruleForm.stationMap.stationLng"></Input>
        <Button type="primary" style="position: absolute; top: 0px;right: -90px;" @click="showPositionMap">坐标标注
        </Button>
      </FormItem>
      <FormItem label="站点地址">
        <Input v-model="ruleForm.stationAddr" ></Input>
      </FormItem>
      <FormItem label="邮政编码">
        <Input v-model="ruleForm.stationPostcode"></Input>
      </FormItem>
      <FormItem label="设立区域">
        <Select clearable v-model="ruleForm.stationCityTownId">
          <Option v-for="(item, index) in cityTownList" :value="item.value" :key="index" :label="item.text"></Option>
        </Select>
      </FormItem>
      <FormItem label="房屋属性">
        <RadioGroup v-model="ruleForm.houseType">
          <Radio label='owner'>自有</Radio>
          <Radio label='rent'>租用</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="经营面积m²">
        <Input v-model="ruleForm.stationAcreage"></Input>
      </FormItem>
      <FormItem label="年租金">
        <Input v-model="ruleForm.rental"></Input>
      </FormItem>
      <FormItem label="渠道类型">
        <Select clearable v-model="ruleForm.stationChannelTypeId"  @on-change='selectChange'>
          <Option v-for="(item, index) in channelTypeList" :value="item.value" :key="index" :label="item.text"></Option>
        </Select>
      </FormItem>
      <FormItem label="经营种类">
        <RadioGroup v-model="ruleForm.operateTypes">
          <Radio label='computer'>电脑彩票</Radio>
          <Radio label='fastopen'>即开彩票</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="站点电话">
        <Input v-model="ruleForm.stationPhone"></Input>
      </FormItem>
      <h3>业主信息</h3>
      <FormItem label="业主姓名">
        <Input v-model="ruleForm.stationMaster.nameX" disabled></Input>
      </FormItem>
      <FormItem label="业主电话">
        <Input v-model="ruleForm.stationMaster.mobile" disabled></Input>
      </FormItem>
      <FormItem label="身份证号">
        <Input v-model="ruleForm.stationMaster.idCard" disabled></Input>
      </FormItem>
      <FormItem label="联系人">
        <Input v-model="ruleForm.stationMaster.linkMan" disabled></Input>
      </FormItem>
      <FormItem label="性别">
        <RadioGroup v-model="ruleForm.stationMaster.sex">
          <Radio label='male'>男</Radio>
          <Radio label='female'>女</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="户籍地址">
        <Input v-model="ruleForm.stationMaster.hkAddress"></Input>
      </FormItem>
      <FormItem label="文化程度">
        <Select clearable v-model="ruleForm.stationMaster.cultureDegree">
          <Option v-for="(item, index) in eduList" :value="item.value" :key="index" :label="item.text"></Option>
        </Select>
      </FormItem>
      <h3>热线站点资料</h3>
      <FormItem label="代理商">
        <Input v-model="ruleForm.stationHotline.agentName" disabled></Input>
      </FormItem>
      <FormItem label="站点类型">
        <Input v-model="ruleForm.stationHotline.stationType" disabled></Input>
      </FormItem>
      <FormItem label="账户控制类型">
        <Input v-model="ruleForm.stationHotline.accountType" disabled></Input>
      </FormItem>
      <FormItem label="可用余额下限">
        <Input v-model="ruleForm.stationHotline.accountLimit" disabled></Input>
      </FormItem>
      <FormItem label="票打印地址">
        <Input v-model="ruleForm.stationHotline.printAddr" disabled></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="submitForm('formRef')">保存</Button>
        <Button @click="resetForm('formRef')">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  // import syncScript from '../../../../../../util/sync_script'
  // import img from '@/assets/img/station/sitelogo/ticai.png'
export default {
  name: 'a',
  data() {
    return {
      ModalFlag: false,
      ruleForm:{},
      rules: {}
    }
  },
  computed: {
    cityTownList() {
      return this.$store.state['station_enumDic'].stationCityTown
    },
    channelTypeList() {
      return this.$store.state['station_enumDic'].stationChannelType
    },
    // List-文化程度、学历
    eduList() {
      return this.$store.state['station_enumDic'].CommonEnum$eduEnum
    }
  },
  methods: {
    submitForm () {},
    selectChange() {},
    showPositionMap() {
      this.ModalFlag = true
      const that = this
      setTimeout(function () {
        // 创建地图
        const id = 'sync_amap'
        const url = 'http://webapi.amap.com/maps?v=1.4.4&key=4199fe377dd77297c6e4cee01bd0b266&plugin=AMap.MarkerClusterer,AMap.Riding'
        syncScript(id, url, fn)

        function fn() {
          // var AMap = require('AMap')
          that.AMap = AMap
          that.mapHeight = that.TableHeightCal('makeMiddle', 52)
          that.createAmap()
        }
      }, 200)
    },
    resetForm(name) {
      this.$refs[name].resetFields()
      this.ruleForm = {}
    },
    submitForm() {
      // console.log(this.Obj)
      // console.log(this.refreshObj(this.Obj))
      this.postJson('station', {
        apiCode: 300003,
        content: this.refreshObj(this.ruleForm)
      }).then(res => {
        if (res.code === '0') {
          this.showMsg('保存成功')
          // setTimeout(() => {
          //   this.getInfo(this.$route.params.id)
          // }, 3000)
          this.$router.go(-1)
        }
      })
      this.ModalFlag = false
    },
    // 按照后端要求重新设置Obj
    refreshObj(obj) {
      var stationInfo = [
        'stationCode',
        'stationCityTownId',
        'stationCityTownName',
        'houseType',
        'stationAcreage',
        // 'yearRental',
        'rental',
        'stationType',
        'stationChannelTypeId',
        'stationChannelTypeName',
        'stationPostcode',
        'operateTypes',
        'stationPhone',
        'updateBy',
        'updateByName'
      ]
      var stationMaster = [
        'id',
        'mobile',
        'sex',
        'hkAddress',
        'cultureDegree',
        'linkMan'
      ]
      // var stationMap = [
      //   'id',
      //   'stationLng',
      //   'stationLat'
      // ]
      var newObj = {stationMaster: {}, stationMap: {}}
      stationInfo.forEach((val, key) => {
        newObj[val] = obj[val]
      })
      stationMaster.forEach((val, key) => {
        if (obj.stationMaster) {
          newObj.stationMaster[val] = obj.stationMaster[val]
        }
      })
      // stationMap.forEach((val, key) => {
      //   if (obj.stationMap) {
      //     newObj.stationMap[val] = obj.stationMap[val]
      //   }
      // })
      return newObj
    },
    // 获取信息
    getInfo(id) {
      this.postJson('station', {
        apiCode: 300004,
        sysModule: 'station',
        content: {
          id: id
        }
      }).then(res => {
        var content = res.content
        for (var key in content) {
          this.$set(this.ruleForm, key, content[key])
          // this.ruleForm[key] = content[key]
        }
        console.log(this.ruleForm)
        // 显示坐标标注的时候采取获取 mapId
        // if (this.Obj.stationMap) {
        //   this.getMapId(this.Obj.stationCode)
        // }
        // this.ruleForm.stationStatus = this.ruleForm.stationStatus.text
        this.ruleForm.stationCityTownId += ''
        this.ruleForm.stationCityTownId = this.ruleForm.stationCityTownId === 'null' ? '' : this.ruleForm.stationCityTownId
        this.ruleForm.stationHotline ? (this.ruleForm.stationHotline.accountType ? (this.ruleForm.stationHotline.accountType += '') : '') : ''
        this.ruleForm.stationHotline ? (this.ruleForm.stationHotline.stationType ? (this.ruleForm.stationHotline.stationType += '') : '') : ''
        this.ruleForm.houseType = this.ruleForm.houseType ? this.ruleForm.houseType.value : ''
        this.ruleForm.operateTypes = this.ruleForm.operateTypes ? this.ruleForm.operateTypes.value : ''
        this.ruleForm.stationMaster.cultureDegree = this.ruleForm.stationMaster.cultureDegree ? this.ruleForm.stationMaster.cultureDegree.value : ''
        this.ruleForm.stationMaster.sex = this.ruleForm.stationMaster.sex ? this.ruleForm.stationMaster.sex.value : ''
        console.log('执行完毕')
      })
    },
  },
  mounted () {
    var {id} = this.$route.params
    this.getInfo(id)
  }
}
</script>

<style scoped>

</style>
