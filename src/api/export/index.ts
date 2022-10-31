import request from '@/utils/request'
import type { ApiParams } from '@/types/api'

/* 时效表导出功能 */
export function exportService(params: ApiParams) {
    const res = request.post('/plat/exportData', params)
    return res
}