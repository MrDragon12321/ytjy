import request from '@/utils/request'
import type { ApiParams } from '@/types/api'

// ------------------------------------服务商时效报表---------------------------------------
// 获取省份
export function getProvince() {
    const res = request.post('/plat/getProvinces')
    return res
}

// 供应商
export function getProvider() {
    const res = request.post('/plat/getProviders')
    return res
}
// 客户
export function getCustomers() {
    const res = request.post('/plat/getCustomers')
    return res
}
// 服务项目
export function getService() {
    const res = request.post('/plat/getServiceItems')
    return res
}
// 服务商时效报表数据
export function getDataList(params: ApiParams) {
    const res = request.post('/plat/getProEffic', params)
    return res
}
// 服务商时效报表导出
export function exportService(params: ApiParams) {
    const res = request.post('/plat/exportData',params,{
        responseType: 'blob'
    })
    return res
}
// -------------------------------------------------财务发票------------------------------
// 财务发票报表数据
export function getInvoiceDataList(params: ApiParams) {
    const res = request.post('/report/fnReport/getFnInvoiceReport', params)
    return res
}
export function getInvoiceCustomerType() {
    const res = request.post('/report/baseSel/getPlatCustomerTypeList')
    return res
}
// 获取客户
export function getInvoiceCustomer(params:ApiParams) {
    const res = request.post('/report/baseSel/getPlatCustomerList',params)
    return res
}
// 获取供应商
export function getInvoiceProvider() {
    const res = request.post('/report/baseSel/getProviderList')
    return res
}
// 发票导出
export function exportInvoice(params: ApiParams) {
    const res = request.post('/report/fnReport/exportFnInvoiceReportInfo',params,{
        responseType: 'blob'
    })
    return res
}



// --------------------------------------------------财务业务---------------------------------
// 财务业务报表数据
export function getBusinessDataList(params: ApiParams) {
    const res = request.post('/report/fnReport/getFnBusinessReport', params)
    return res
}
// 获取省份
export function getBusinessProvince() {
    const res = request.post('/base/getProvinces')
    return res
}
// 获取客户
export function getBusinessCustomerType() {
    const res = request.post('/report/baseSel/getPlatCustomerTypeList')
    return res
}
// 获取客户
export function getBusinessCustomer(params:ApiParams) {
    const res = request.post('/report/baseSel/getPlatCustomerList',params)
    return res
}
// 获取供应商
export function getBusinessProvider() {
    const res = request.post('/report/baseSel/getProviderList')
    return res
}
//服务项目接口
export function ServiceBusiness() {
    const res = request.post('/report/baseSel/getAllPServiceType')
    return res
}
// 业务导出
export function exportBusiness(params: ApiParams) {
    const res = request.post('/report/fnReport/exportFnBusinessReportInfo',params,{
        responseType: 'blob'
    })
    return res
}
// ----------------------------------------------------平安聚合----------------------------------------------
//平安服务项目接口
export function ServiceSafety() {
    const res = request.post('/report/baseSel/getAllPServiceType')
    return res
}
//平安客户接口
export function CustomerSafety() {
    const res = request.post('/report/baseSel/getPingAnCustomerList')
    return res
}
//平安服务商接口
export function ProviderSafety() {
    const res = request.post('/report/baseSel/getProviderList')
    return res
}
//平安表格接口
export function getSafetyList(params: ApiParams) {
    const res = request.post('/report/pingAnReport/getPingAnJuheReport', params)
    return res
}
//平安导出接口
export function exportSafety(params: ApiParams) {
    const res = request.post('/report/pingAnReport/exportReportInfo', params, {
        responseType: 'blob'
    })
    return res
}

// --------------------------GPS--------------------------------------

//gps列表
export function GpsList(params: ApiParams) {
    const res = request.post('/report/getDriverGpsOnlineList', params)
    return res
}
//gps获取供应商
export function GpsProvider() {
    const res = request.post('/report/baseSel/getProviderList')
    return res
}
//gps获取省份
export function GpsProvince() {
    const res = request.post('/base/getProvinces')
    return res
}
//gps获取车牌
export function GpsPlateNumber(params: ApiParams) {
    const res = request.post('/report/getDriverGpsOnlineDetailList',params)
    return res
}


// ------------------------------平台专项数据统计-----------------------------

export function SafeTabList(params: ApiParams) {
    const res = request.post('/report/pingAnReport/getJuheUpReport', params)
    return res
}
//导出
export function ExportSafeTab(params: ApiParams) {
    const res = request.post('/report/pingAnReport/exportJuheUpReportInfo',params,{
        responseType: 'blob'
    })
    return res
}


