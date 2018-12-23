/* =*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*= *
 *                        _ooOoo_                        *
 *                       o8888888o                       *
 *                       88" . "88                       *
 *                       (| -_- |)                       *
 *                       O\  =  /O                       *
 *                    ____/`---'\____                    *
 *                  .'  \\|     |//  `.                  *
 *                 /  \\|||  :  |||//  \                 *
 *                /  _||||| -:- |||||-  \                *
 *                |   | \\\  -  /// |   |                *
 *                | \_|  ''\---/''  |   |                *
 *                \  .-\__  `-`  ___/-. /                *
 *              ___`. .'  /--.--\  `. . __               *
 *           ."" '<  `.___\_<|>_/___.'  >'"".            *
 *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |          *
 *          \  \ `-.   \_ __\ /__ _/   .-` /  /          *
 *     ======`-.____`-.___\_____/___.-`____.-'======     *
 *                        `=---='                        *
 *     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^     *
 *              佛祖保佑           永无BUG                *
 * =*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*= */

// ===========================================================
// ||||||||||||||||||  汉王高拍仪H650/PRO |||||||||||||||||||||
// ===========================-∨-============================

/* eslint-disable */
var iDeviceIndex = 0 // 设备的编号；   0：文档摄像头;1：人像摄像头
var iColorMode = 0 // 设定获取的图像的色彩模式；   0: 彩色，1: 灰度，2: 黑白。
var nDpi = 200 // 设定拍照后图像存档的DPI;
var szPostfix = ".jpg"
var Capture // 必须得获取object对象
var Content
var imgeId = 0
var ResSelect // 必须取得分辨率标签对象
var strMergeSource1 // 合并图像源文件1
var strMergeSource2 // 合并图像源文件2
var strFilePath = "D:\\DocImage\\"
var strFileNames = new Array()
var szTifFileName
var szAddInFileName
var continueNo = 1
var szContinuePath
var bContinueToTiff = 0
var szFileForBase64 = ""
var iDeviceStatus = -1
// var bMultiSource = false;
var iCutPageType = -1
var iWaterMarkType = -1
var iVideoType = 0

// 打开设备
function OpenDevice(value) {
  var iType = parseInt(value)
  iDeviceIndex = iType
  console.log('正在打开（' + iDeviceIndex + '）摄像头。。。')
  Capture.StartPreview(iDeviceIndex)
  console.log(iDeviceIndex + '摄像头打开完成')
}
// 拍摄照片
function CaptureImage(a, b) {
  Capture.CaptureImage(a, b)
}
// 关闭设备
function CloseDeviceEx(index) {
  var iTypes = parseInt(index)
  console.log('正在关闭（' + iTypes + '）摄像头。。。')
  Capture.StopPreview(iTypes)
  console.log(iTypes + '摄像头关闭完成')
}
// ===========================================================
// ||||||||||||||||||||身份证信息收集区|||||||||||||||||||||||
// ===========================-∨-============================
function ReadIDCard() {
  // 读取身份证信息
  return Capture.ReadIDCard()
}
function GetIDName() {
  // 获取姓名
  if (Capture.ReadIDCard()){
    return Capture.GetIDName()
  }
}
function GetIDSex() {
  // 获取性别
  if (Capture.ReadIDCard()){
    return Capture.GetIDSex()
  }
}
function GetIDNation() {
  // 获取民族
  if (Capture.ReadIDCard()){
    return Capture.GetIDNation()
  }
}
function GetIDBirthYear() {
  // 获取出生年
  if (Capture.ReadIDCard()){
    return Capture.GetIDBirthYear()
  }
}
function GetIDBirthMonth() {
  // 获取出生月
  if (Capture.ReadIDCard()){
    return Capture.GetIDBirthMonth()
  }
}
function GetIDBirthDay() {
  // 获取出生日
  if (Capture.ReadIDCard()){
    return Capture.GetIDBirthDay()
  }
}
function GetIDNum() {
  // 获取身份证号码
  if (Capture.ReadIDCard()){
    return Capture.GetIDNum()
  }
}
function GetIDAddress() {
  // 获取住址信息
  if (Capture.ReadIDCard()){
    return Capture.GetIDAddress()
  }
}
function GetIDDepart() {
  // 获取签发机关
  if (Capture.ReadIDCard()){
    return Capture.GetIDDepart()
  }
}
function GetIDTermDay() {
  // 获取有效日期
  if (Capture.ReadIDCard()){
    return Capture.GetIDTermDay()
  }
}
function GetIDHeadImagePath() {
  // 获取头像路径
  if (Capture.ReadIDCard()){
    return Capture.GetIDHeadImagePath()
  }
}
// ===========================-∧-============================
// ||||||||||||||||||||身份证信息收集区|||||||||||||||||||||||
// ===========================================================
//读取分辨率列表
function FillInRes() {
  var iResVecLenth = ResSelect.options.length
  var iResWidth = 0
  var iResHeight = 0
  for (var i = 0; i < iResVecLenth; i++) {
    ResSelect.options.remove(0)	//清除分辨率select选项内容
  }
  iResVecLenth = Capture.GetResCount(iDeviceIndex)
  for (var i = 0; i < iResVecLenth; i++) {
    iResWidth = Capture.GetResWidth(iDeviceIndex, i)
    iResHeight = Capture.GetResHeight(iDeviceIndex, i)
    var strRes = iResWidth.toString() + '*' + iResHeight.toString()
    var resopp = new Option(strRes, i.toString())
    ResSelect.add(resopp)
  }
}
//打开设备属性页对话框
function ShowDevicePage() {
  Capture.ShowVideoPropDlg(iDeviceIndex)
}

//打开条码识别
function SetBarcode() {
  Capture.ReadBarcode(iDeviceIndex)
}

//启动裁切
function SetCutPageType(value) {
  // 0-拖动裁切 1-画框裁切 2-启动扫描尺寸
  var iType = parseInt(value)
  Capture.SetMouseMode(iDeviceIndex, iType)
}

//设置颜色模式
function SetColorMode(value) {
  // 0-彩色 1-灰度 2-黑白
  var iType = parseInt(value)
  Capture.SetColorMode(iDeviceIndex, iType)
}

//设置分辨率
function SetResIndex(value) {
  var iIndex = parseInt(value)
  Capture.SetCamResIndex(iDeviceIndex, iIndex)
}

//设置拍照存档的DPI
function SetDPI(iDPIValue) {
  if (iDPIValue == "") {
    alert("DPI值都不能为空！")
    return
  }
  if (isDigit(iDPIValue)) {
    iDpi = parseInt(iDPIValue)
    Capture.SetDPI(iDeviceIndex ,iDpi)
  }
  else {
    alert("含有非法字符，请重新输入数字！")
  }
}

//获取base64字符串
function GetBase64string(idx) {
  return Capture.CaptureBase64(idx)//获取图像Base64(接口);
}

//摄像左右旋转
function SetDeviceRotation(rotation) {
  if(rotation == 'left'){
    Capture.RotateLeft(iDeviceIndex)
  }else{
    Capture.RotateRight(iDeviceIndex)
  }
}

//设置曝光度
function SetExposure(check,iExposureVal) {
  // check-是否自动曝光 iExposureVal-曝光值
  if(check){
    Capture.SetExposure(iDeviceIndex, true)
  }else{
    Capture.SetExposure(iDeviceIndex, false, iExposureVal)
  }
}

//设置jpg图片质量，压缩率
function SetJPGQuality(iQuality) {
  // 1-100之间
  if(isDigit(iQuality)){
    Capture.SetJpgQuality(iDeviceIndex ,parseInt(iQuality))
  }else{
    alert('请输入数字')
  }
}

//合并图像
function SetMergePageType(iValue) {
  // 0-正常拍照 1-合成拍照（拍摄两次，中间提示间隔，实现合成）
  var iMergePageType = parseInt(iValue)
  // 合并的目标文件名
  Capture.SetCaptureMode(iDeviceIndex, iMergePageType)
}

//正则判断文本框中的内容是否为数字
function isDigit(iVal) {
  var patrn = /^-?\d+(\.\d+)?$/
  if (!patrn.exec(iVal)) {
    return false
  }
  return true
}

function ShowFolderFileList(folderspec) {
  var fso, f, fc
  fso = new ActiveXObject("Scripting.FileSystemObject")
  f = fso.GetFolder(folderspec)
  fc = new Enumerator(f.files)
  var s = new Array()
  for (; !fc.atEnd(); fc.moveNext()) {
    var File = fc.item()
    var tmpStr = File.Path.substring(File.Path.lastIndexOf(".") + 1)
    if (tmpStr == "jpg" || tmpStr == "bmp" || tmpStr == "png" || tmpStr == "tif") {
      s.push(File.Path)
    }
  }
  return s
}

function SetWaterMark(value) {
  iWaterMarkType = parseInt(value)
}

function ShowWaterMark() {
  if (checkShowWaterMark.checked) {
    if (Capture.ShowWaterMark(0) == 0) {
      WriteInfomation("开启水印预览成功")
    }
    else {
      WriteInfomation("开启水印预览失败")
    }
  } else {
    if (Capture.ShowWaterMark(1) == 0) {
      WriteInfomation("取消水印预览成功")
    }
    else {
      WriteInfomation("取消水印预览失败")
    }
  }
}

//添加水印
function AddWaterMark() {
  switch (iWaterMarkType) {
    case -1://不添加水印
      Capture.WaterMark("", -1, 0, 0, 0, 0)//参数设置为-1则不添加水印
      break
    case 0://文字水印
      Capture.WaterMark(WaterContent.value, 0, parseInt(WaterTran.value), parseInt(sWaterMarkPos.value),
        parseInt(WaterFontSize.value), parseInt(WaterColor.value))//设置空字符串，并且水印类型设置为0，则会添加时间水印：格式为年月日
      break
    case 1://图片水印
      Capture.WaterMark(WaterContent.value, 1, parseInt(WaterTran.value), parseInt(sWaterMarkPos.value),
        parseInt(WaterFontSize.value), parseInt(WaterColor.value))
      break
    case 2://日期水印
      Capture.WaterMark(WaterContent.value, 2, parseInt(WaterTran.value), parseInt(sWaterMarkPos.value),
        parseInt(WaterFontSize.value), parseInt(WaterColor.value))
      break
    default:
      break
  }
}

// 录制/停止录制视频
function SetVideoType(value) {
  iVideoType = parseInt(value)
}

function StartRecordingVideo() {
  if (Capture.StartRecordingVideo("D:\\Test.asf") == 0) {
    WriteInfomation("开始录制视频, 视频保存在D:\\Test.asf")
  }
  else {
    WriteInfomation("启动录制视频失败")
  }
}

function StopRecordingVideo() {
  if (Capture.StopRecordingVideo() == 0) {
    WriteInfomation("录制视频完成")
  }
  else {
    WriteInfomation("停止录制视频失败")
  }
}

// 更改存储目录
// function ChangePath_onClick(){
// strFilePath = FilePath.value;
// }

// 去除阴影
function SetResuceShadow() {
  //var i = checkReduceShadow
  if (checkReduceShadow.checked) {
    if (Capture.ReduceShadow(0) == 0) {
      WriteInfomation("开启去除阴影功能成功")
    }
    else {
      WriteInfomation("开启去除阴影功能失败")
    }
  }
  else {
    if (Capture.ReduceShadow(1) == 0) {
      WriteInfomation("关闭去除阴影功能成功")
    }
    else {
      WriteInfomation("关闭去除阴影功能失败")
    }
  }
}

// 去除阴影
function SetRepairDistortion() {
  //var i = checkReduceShadow
  if (checkRepairDistortion.checked) {
    if (Capture.RepairDistortion(0) == 0) {
      WriteInfomation("开启文档形变修补功能成功")
    }
    else {
      WriteInfomation("开启文档形变修补功能失败")
    }
  }
  else {
    if (Capture.RepairDistortion(1) == 0) {
      WriteInfomation("关闭文档形变修补功能成功")
    }
    else {
      WriteInfomation("关闭文档形变修补功能失败")
    }
  }
}

function StartContinuous() {
  Capture.StartContinuous("D:\\DocImage", 0)
}

function SetVideoPara() {
  WriteInfomation(Capture.SetVideoPara(100, 20))
}

function GetVideoPara() {
  WriteInfomation(Capture.GetVideoPara(100, 0))
}

function ZoomVideo(value) {
  var iZoomType = parseInt(value)
  Capture.ZoomInOut(iZoomType)
}

function OpenDesFile() {
  var file = document.getElementById("OpenDesFile")
  var ext = file.value.substring(file.value.lastIndexOf(".") + 1).toLowerCase()
  if (ext != 'tif' && ext != 'jpg' && ext != 'bmp' && ext != 'png') {
    alert("请选择图片文件用于追加！")
    return
  }
  else {
    szTifFileName = file.value
    WriteInfomation("以下图片文件设为待追加状态：" + szTifFileName)
  }
}

function OpenImageFile() {
  var file = document.getElementById("OpenImageFile")
  var ext = file.value.substring(file.value.lastIndexOf(".") + 1).toLowerCase()
  if (ext != 'jpg' && ext != 'bmp' && ext != 'png') {
    alert("请选择用于追加的图片(*.jpg;*.bmp;*.png)！")
    return
  }
  else {
    szAddInFileName = file.value
    WriteInfomation("以下图片被设为追加源：" + szAddInFileName)
  }
}

//形成预览图
function Preview(iValue) {
  var iPreViewType = parseInt(iValue)
  if (strFileNames.length > 3) {
    var pic1 = document.getElementById("preview1")
    var pic2 = document.getElementById("preview2")
    var pic3 = document.getElementById("preview3")
    pic1.style.filter = pic2.style.filter
    pic1.src = pic2.src
    pic2.style.filter = pic3.style.filter
    pic2.src = pic3.src
//		for(var i=0;i<3;i++)
//		{
    if (iPreViewType == 0) {
      ShowPreview(strFileNames[strFileNames.length - 1], 3)
    }
    else {
      ShowPreviewBase64(strFileNames[strFileNames.length - 1], 3)
    }
//		}
  }
  else {
//		for(var i=0;i<strFileNames.length;i++)
//		{
    if (iPreViewType == 0) {
      ShowPreview(strFileNames[strFileNames.length - 1], strFileNames.length)
    }
    else {
      ShowPreviewBase64(strFileNames[strFileNames.length - 1], strFileNames.length)
    }
//		}
  }
}

function ShowPreviewBase64(strFileName, PreviewWinsowsNo) {
  var pic = document.getElementById("preview" + PreviewWinsowsNo)
  pic.src = 'data:image/gif;base64,' + strFileName
}

function ShowPreview(strFileName, PreviewWinsowsNo) {
  var pic = document.getElementById("preview" + PreviewWinsowsNo)
  //var file = document.getElementById("f");
  var ext = strFileName.substring(strFileName.lastIndexOf(".") + 1).toLowerCase()
  // gif在IE浏览器暂时无法显示
  if (ext != 'png' && ext != 'jpg' && ext != 'bmp' && ext != 'tif') {
    alert("文件必须为图片！")
    return
  }
  // IE浏览器
  if (document.all) {
    //pic.src=strFileName;
    //pic.select();
    var reallocalpath = strFileName
    var ie6 = /msie 6/i.test(navigator.userAgent)
    //IE6浏览器设置img的src为本地路径可以直接显示图片
    if (ie6) {
      pic.src = reallocalpath
    }
    else {
      // 非IE6版本的IE由于安全问题直接设置img的src无法显示本地图片，但是可以通过滤镜来实现
      pic.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src=\"" + reallocalpath + "\")"
      // 设置img的src为base64编码的透明图片 取消显示浏览器默认图片
      pic.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
    }
  }
  // else
  // {
  // html5Reader(file);
  // }
}

//获取设备硬件码
function BtnHID() {
  var strHID = Capture.GetDeviceVidPid(0)
  WriteInfomation("设备硬件码为" + strHID)
}

//把相关信息写入操作记录编辑框中
function WriteInfomation(strInfo) {
  Content.value += ("\r\n" + strInfo)
}

function CatchContinuousEvent(szFileName) {
  WriteInfomation("连续采集图像存放在：" + szFileName)
}

// 设置改变Object对象
function init(val) {
  console.log(val)
  Capture = val
  return true
}

const GPY = {
  iDeviceIndex,
  iColorMode,
  nDpi,
  szPostfix,
  imgeId,
  strFilePath,
  strFileNames,
  continueNo,
  bContinueToTiff,
  szFileForBase64,
  iDeviceStatus,
  iCutPageType,
  iWaterMarkType,
  iVideoType,
  OpenDevice,
  FillInRes,
  CloseDeviceEx,
  ShowDevicePage,
  //GetOcxVersion,
  //GetDeviceState,
  SetBarcode,
  SetCutPageType,
  SetColorMode,
  //SetFileType,
  SetResIndex,
  SetDPI,
  //CaptureToFile,
  GetBase64string,
  //OpenDesFileForBase64,
  SetDeviceRotation,
  SetExposure,
  SetJPGQuality,
  SetMergePageType,
  isDigit,
  //TriggerAutoFocuse,
  //BtnCreateMultiPageFile,
  ShowFolderFileList,
  SetWaterMark,
  ShowWaterMark,
  AddWaterMark,
  SetVideoType,
  StartRecordingVideo,
  StopRecordingVideo,
  SetResuceShadow,
  SetRepairDistortion,
  StartContinuous,
  SetVideoPara,
  GetVideoPara,
  ZoomVideo,
  OpenDesFile,
  OpenImageFile,
  Preview,
  ShowPreviewBase64,
  ShowPreview,
  BtnHID,
  WriteInfomation,
  CatchContinuousEvent,
  init,
  CaptureImage,
  ReadIDCard,
  GetIDName,
  GetIDSex,
  GetIDNation,
  GetIDBirthYear,
  GetIDBirthMonth,
  GetIDBirthDay,
  GetIDNum,
  GetIDAddress,
  GetIDDepart,
  GetIDTermDay,
  GetIDHeadImagePath
}

module.exports = GPY
