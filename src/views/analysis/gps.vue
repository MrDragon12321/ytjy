<template>
    <div class="container">
        <SearchBars>
            <el-form :model="searchData" :inline="true" ref="searchFrom">
                <el-form-item prop="objectType" label="类型:">
                    <el-select v-model="searchData.objectType" filterable placeholder="选择平台类型" @change="handleChange">
                        <el-option v-for="item in typeItemList" :key="item.value" :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="providerId" label="服务商:" v-hasPerm="['com:service:get']">
                    <el-select v-model="searchData.providerId" filterable placeholder="请选择供应商" clearable
                        @change="handleChange">
                        <el-option v-for="item in providerItemList" :key="item.id" :label="item.prvName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="provinces" label="省份:" v-hasPerm="['com:province:get']">
                    <el-select v-model="searchData.provinces" filterable placeholder="请选择省份" clearable
                        @change="handleChange">
                        <el-option v-for="item in provinceItemList" :key="item.name" :label="item.name"
                            :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="serviceItem" label="服务项目:">
                    <el-select v-model="searchData.serviceItem" filterable placeholder="选择服务项目" @change="handleChange"
                        clearable>
                        <el-option v-for="item in serviceItemList" :key="item.value" :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <!-- <el-button type="primary" @click="handleSearch">
                        <el-icon>
                            <Search />
                        </el-icon>
                        <span>搜索</span>
                    </el-button> -->
                    <el-button type="primary" @click="handleReset(searchFrom)">
                        <el-icon>
                            <RefreshLeft />
                        </el-icon>
                        <span>重置</span>
                    </el-button>
                    <el-button type="primary" @click="exportServices">
                        <el-icon>
                            <Download />
                        </el-icon>
                        <span>导出</span>
                    </el-button>
                </el-form-item>
            </el-form>
        </SearchBars>
        <Lists>
            <el-table :data="tableData" border header-row-class-name="header-style"
                :header-cell-style="{ background: '#eef1f6', textAlign: 'center', 'fontSize': '8px', border: '1px #e7e7eb solid' }"
                :cell-style="{ textAlign: 'center', fontSize: '12px', border: '1px #e7e7eb solid' }" show-summary
                id="gps_tab">
                <el-table-column prop="provinceName" label="省份"
                    v-if="searchData.objectType == '1' || searchData.objectType == '2'" />
                <el-table-column prop="providerName" label="供应商"
                    v-if="searchData.objectType == '1' || searchData.objectType == '2'" />
                <el-table-column prop="carCount" label="总车辆数" v-if="searchData.objectType == '1'" />
                <el-table-column prop="gpsOnlineCount" label="GPS在线数"
                    v-if="searchData.objectType == '1' || searchData.objectType == '2'">
                    <template #default="scope">
                        <div :style="{ textDecoration: (scope.row.gpsOnlineCount == '0' || searchData.objectType == '2' ? 'none' : 'underline'), color: (scope.row.gpsOnlineCount == '0' || searchData.objectType == '2' ? '' : 'red') }"
                            @click="handleRow(scope.row)">
                            {{ scope.row.gpsOnlineCount }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="lv" label="GPS在线率" v-if="searchData.objectType == '1'" />
            </el-table>
        </Lists>
        <!-- <Bottoms>
            <Pagination :pageParams="pageParams" @change="getData"> </Pagination>
        </Bottoms> -->
        <el-dialog v-model="dialogVisible" title="GPS在线数" width="30%" draggable v-hasPerm="['analysis:gps:carnum']">
            <el-table :data="GPSData" border header-row-class-name="header-style"
                :header-cell-style="{ background: '#eef1f6', textAlign: 'center', 'fontSize': '8px', border: '1px #e7e7eb solid' }"
                :cell-style="{ textAlign: 'center', fontSize: '12px', border: '1px #e7e7eb solid' }">
                <el-table-column label="GPS类型">
                    <template #default="scope">
                        {{ scope.row.gpsType == 1 ? "移动端GPS" : "车载GPS" }}
                    </template>
                </el-table-column>
                <el-table-column prop="carNumber" label="车牌" />
            </el-table>
        </el-dialog>
    </div>

</template>

<script setup lang="ts">
import { ref, reactive, shallowRef, onBeforeMount, getCurrentInstance } from 'vue'
import { TypeObject } from "@/types/global";
import type { ElForm } from "element-plus";
import {
    GpsList,
    GpsProvider,
    GpsProvince,
    GpsPlateNumber
} from "@/api/analysis";
import { exportTab } from '@/utils/export'
import { havePerm } from '@/utils/perms'
type FormInstance = InstanceType<typeof ElForm>;
const { proxy } = getCurrentInstance() as any


const searchData = reactive({
    objectType: "1",
    providerId: "",
    provinces: "",
    serviceItem: ""
}),
    searchFrom = ref<FormInstance>(),
    dialogVisible = ref(false),
    providerItemList = shallowRef<TypeObject>([]),
    provinceItemList = shallowRef<TypeObject>([]),
    serviceItemList = shallowRef<TypeObject>([{ name: "小修类", value: "1" }, { name: "其他", value: "2" }]),
    typeItemList = shallowRef<TypeObject>([{ name: "元通救援", value: "1" }, { name: "接口平台", value: "2" }])
// const pageParams = ref({
//     currentPage: 1,
//     pageSize: +(localStorage.getItem("pageSize") || 10),
//     total: 0
// })
const tableData = ref([])
const GPSData = ref([])
const getData = () => {
    let datas = { ...searchData }
    GpsList(datas)
        .then((res: any) => {
            res.forEach((v: any) => {
                if (v.carCount == 0) {
                    v.lv = "0%"
                } else {
                    v.lv = ((v.gpsOnlineCount / v.carCount) * 100).toFixed(0) + "%"
                }
            })
            tableData.value = res || [];
        })
        .catch((error) => error && proxy.$message.error(`${error}`));
}

const exportServices = () => {
    exportTab("#gps_tab", "平安GPS上报统计")
}

const handleRow = (row: any) => {
    if (row.gpsOnlineCount == 0 || searchData.objectType == '2') return
    dialogVisible.value = true
    let params = {
        providerId: row.providerId,
        provinces: row.provinceName,
        serviceItem: searchData.serviceItem
    }

    GpsPlateNumber(params)
        .then((res: any) => GPSData.value = res || [])
        .catch((error) => error && proxy.$message.error(`${error}`));

}
const handleChange = () => {
    getData()
}


const handleReset = (elForm: FormInstance | undefined) => {
    if (!elForm) return;
    elForm.resetFields();
    getData();
};

onBeforeMount(() => {
    if (havePerm(['com:service:get'])) {
        GpsProvider()
            .then((res) => providerItemList.value = res)
            .catch((error) => error && proxy.$message.error(`${error}`));
    }
    if (havePerm(['com:province:get'])) {
        GpsProvince()
            .then((res) => provinceItemList.value = res)
            .catch((error) => error && proxy.$message.error(`${error}`));
    }
    if (havePerm(['analysis:gps:tab'])) {
        getData()
    }
})
</script>
<style lang="scss" scoped>
.el-dialog {
    .el-table {
        max-height: 50rem !important;
    }
}
</style>