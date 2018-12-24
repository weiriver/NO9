const HMF = () => import('@/layout/HMF/Index')
const HLRF = () => import('@/layout/HLRF/Index')

const Main = () => import('@/views/main/Index')
const Desktop = () => import('@/views/desktop/Index')
const Login = () => import('@/views/login/Index')
const Subindex = () => import('@/views/subindex/Subindex')
const Refresh = () => import('@/views/subindex/Refresh')
const PrintPage = () => import('@/views/subindex/PrintPage')
const SysSetup = () => import('@/views/sysSetup/Index')

export {Main, Desktop, Login, Subindex, Refresh, PrintPage, SysSetup, HMF, HLRF}
