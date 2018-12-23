<template>
  <div>
    <DetailList :title="'销量基本信息'" :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
  </div>
</template>

<script>
  export default {
    name: 'HardwareDetail',
    data() {
      return {
        detail: []
      }
    },
    async mounted() {
      let id = this.$route.params.id
      console.log(this.$route.params)
      var {termType} = this.$route.query
      var res = await this.postJson('station', {
        apiCode: 300258,
        content: {
          stationID: id,
          termType
        }
      })
      this.detail = [
        {name: '投注站号', value: res.content.stationID},
        {name: '投注机型号', value: res.content.termType},
        {name: '主板型号', value: res.content.mainBoardType},
        {name: '打印机主板型号', value: res.content.printerType},
        {name: '阅读器型号', value: res.content.readerType},
        {name: 'LCD型号', value: res.content.lcdType},
        {name: 'Modem型号', value: res.content.modemType},
        {name: '显卡型号', value: res.content.dispCardType},
        {name: '视频型号', value: res.content.stbType},
        {name: '电源型号', value: res.content.powerType},
        {name: '键盘型号', value: res.content.keyBoardType},
        {name: '扫描枪型号', value: res.content.scannerType},
        {name: 'DOM盘总大小（MB）', value: res.content.domSize},
        {name: '客显屏', value: res.content.guestScreen},
        {name: '户外LED屏', value: res.content.ledScreen},
        {name: '磁卡/IC卡', value: res.content.icCard},
        {name: '串口转接卡', value: res.content.transCard},
        {name: '条码登记方式', value: res.content.recordType},
        {name: '终端整机条码', value: res.content.terminalCode},
        {name: 'BIOS版本号', value: res.content.biosVersion},
        {name: 'CPU主频', value: res.content.cpuFreq},
        {name: '内存大小（KB）', value: res.content.memorySize},
        {name: '打印机固件版本', value: res.content.printerVer},
        {name: '打印机机头型号', value: res.content.printerHead},
        {name: '阅读器固件版本', value: res.content.readerStub},
        {name: '/dev/hda1总大小（KB）', value: res.content.hda1Size},
        {name: '/dev/hda1可用空间（KB）', value: res.content.hda1Free},
        {name: '/dev/hda2总大小（KB）', value: res.content.hda2Size},
        {name: '/dev/hda2可用空间（KB）', value: res.content.hda2Free},
        {name: '/dev/hda3总大小（KB）', value: res.content.hda3Size},
        {name: '/dev/hda3可用空间（KB）', value: res.content.hda3Free},
        {name: 'hda1可用空间比例', value: res.content.hda1Size !== '0' ? res.content.hda1Free/res.content.hda1Size + '%' : '0' + '%'},
        {name: 'hda2可用空间比例', value: res.content.hda2Size !== '0' ? res.content.hda2Free/res.content.hda2Size + '%' : '0' + '%'},
        {name: 'hda3可用空间比例', value: res.content.hda3Size !== '0' ? res.content.hda3Free/res.content.hda3Size + '%' : '0' + '%'},
        {name: '上报时间', value: res.content.reportTime}
      ]
      console.log('res.content', res.content)
    }
  }
</script>

<style scoped>

</style>