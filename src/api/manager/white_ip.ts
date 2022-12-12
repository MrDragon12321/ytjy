import request from '@/utils/request'
import type { ApiParams } from '@/types/api'



// 获取限制分页列表数据
export function getCarAstrict(params: ApiParams) {
    return request.get('/plat/carAstrict/pages', { params })
}
// 删除
export function delCarAstrict(params: any) {
    return request.delete('/plat/carAstrict/' + params)
}
// 新增
export function addCarAstrict(params: ApiParams) {
    return request.post('/plat/carAstrict', params)
}


