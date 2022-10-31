<template>
    <div class="pagination">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageParams.currentPage"
            :page-sizes="[10, 25, 100, 500]"
            :page-size="pageParams.pageSize"
            :hide-on-single-page="false"
            :pager-count="7"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageParams.total">
        </el-pagination>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'Pagination'
})
</script>
<script lang="ts" setup>
import { shallowReactive, withDefaults } from 'vue'
interface PageParams<T extends number = number> {
    currentPage: T,
    pageSize: T,
    readonly total: T
}
interface Props {
    pageParams: PageParams
}
type Handle = (prop: number) => void
const props = withDefaults(defineProps<Props>(), {
    pageParams: () => ({
        currentPage: 1,
        pageSize:10,
        total: 0
    })
})
const emit = defineEmits(['change'])
const pageParams = shallowReactive<PageParams>(props.pageParams)
pageParams.pageSize = pageParams.pageSize || 10
const handleSizeChange: Handle = pageSize => {
    /**
     * 当选择 N条/页 时，如果 页数 * N < 总数，则调整选中页数，
     * 以防止 el-pagination 组件发起2次请求
     */
    if ((pageParams.currentPage * pageSize) > pageParams.total) {
        pageParams.currentPage = Math.ceil(pageParams.total / pageSize) || 1
    }
    pageParams.pageSize = pageSize
    localStorage.setItem("pageSize", pageSize.toString())
    emit('change')
}

const handleCurrentChange: Handle = currentPage => {
    pageParams.currentPage = currentPage
    emit('change')
}
</script>