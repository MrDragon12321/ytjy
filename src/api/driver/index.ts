import request from '@/utils/request'
import type { ApiParams } from '@/types/api'


// 虚拟司机报表数据
export function getDriverDataList(params: ApiParams) {
    const res = request.post('/case/carVirtualGps/getCarVirtualGpsList', params)
    return res
}

// 编辑司机数据
export function updateDriver(params: ApiParams) {
    const res = request.post('/case/carVirtualGps/updateCarVirtualGps', params)
    return res
}
// 新增司机数据
export function addDriver(params: ApiParams) {
    const res = request.post('/case/carVirtualGps/insertCarVirtualGps', params)
    return res
}
// 删除司机数据
export function delDriver(params: ApiParams) {
    const res = request.post('/case/carVirtualGps/deleteCarVirtualGps', params)
    return res
}

//省市接口
export function ProvinceCity(params: ApiParams) {
    const res = request.post('/base/getAddress', params)
    return res
}
//服务商接口
export function ServiceDriver() {
    const res = request.post('/plat/provider/getProviderList')
    return res
}
//导入导出接口
export function ImportDriver(params: ApiParams) {
    const res = request.post('/case/carVirtualGps/readExcel', params)
    return res
}





