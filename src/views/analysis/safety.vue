<template>
    <div class="container">
        <SearchBars>
            <el-form :model="searchData" :inline="true" ref="searchFrom">
                <el-form-item prop="objectType" label="对象:">
                    <el-select v-model="searchData.objectType" filterable placeholder="" @change="changes">
                        <el-option v-for="item in objectTypeItemList" :key="item.value" :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="customerId" label="客户:">
                    <el-select v-model="searchData.customerId" filterable placeholder="所有客户" clearable
                        @change="changes">
                        <el-option v-for="item in customerItemList" :key="item.id" :label="item.customName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="providerId" label="服务商:">
                    <el-select v-model="searchData.providerId" filterable placeholder="所有服务商" clearable
                        @change="changes">
                        <el-option v-for="item in serviceItemList" :key="item.id" :label="item.prvName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="serviceItem" label="服务项目:">
                    <el-select v-model="searchData.serviceItem" filterable placeholder="所有服务项目" clearable  @change="changes">
                        <el-option v-for="item in serviceProItemList" :key="item.value" :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="status" label="案件状态:">
                    <el-select v-model="searchData.status" filterable placeholder="所有状态" clearable @change="changes">
                        <el-option v-for="item in statuItemList" :key="item.value" :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日期:">
                    <el-date-picker v-model="selectDate" type="daterange" range-separator="至" start-placeholder="开始时间"
                        :disabled-date="_disabledDate" end-placeholder="结束时间" value-format="YYYY-MM-DD"
                        :editable="false" @change="handleDateChange" @calendar-change="handleCalendarChange"
                        :clearable="false">
                    </el-date-picker>
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
            <el-table :data="tableData" border height="auto" show-summary :summary-method="getSummaries"
                header-row-class-name="header-style"
                :header-cell-style="{ background: '#eef1f6', textAlign: 'center', 'fontSize': '8px',border:'1px #e7e7eb solid' }"
                :cell-style="{ textAlign: 'center', fontSize: '12px',border:'1px #e7e7eb solid' }" table-layout="auto">
                <el-table-column prop="customName" label="客户" />
                <el-table-column prop="prvName" label="服务商" />
                <el-table-column prop="caseNum" label="案件量" sortable />
                <el-table-column prop="juheNum" label="聚合量" sortable />
                <el-table-column prop="juhelv" label="聚合率" sortable :sort-method="jhl" />
                <el-table-column prop="juheSuccessNum" label="聚合成功量" sortable />
                <el-table-column prop="juheSuccesslv" label="聚合成功率" sortable :sort-method="jhsl"/>
            </el-table>
        </Lists>
        <!-- <Bottoms>
            <Pagination :pageParams="pageParams" @change="getData"> </Pagination>
        </Bottoms> -->
    </div>

</template>

<script setup lang="ts">
import { ref, reactive, shallowRef, onBeforeMount, getCurrentInstance } from 'vue'
import { TypeObject, NumOrNull } from "@/types/global";
import qs from "qs";
import type { ElForm } from "element-plus";
import { disabledDate, dateFormatter } from "@/utils/date";
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import { isArray } from "@/utils/validate";

import {
    ProviderSafety,
    CustomerSafety,
    ServiceSafety,
    getSafetyList,
    exportSafety
} from "@/api/analysis";
type FormInstance = InstanceType<typeof ElForm>;
const { env, baseUrl } = require("@/config/index.js");
const { proxy } = getCurrentInstance() as any;
const searchData = reactive({
    providerId: "",//对象
    status: "",//案件状态
    startTime: null as NumOrNull,
    endTime: null as NumOrNull,
    customerId: "",//客户
    serviceItem: "",
    objectType: "1"
}),
    searchFrom = ref<FormInstance>(),
    selectDate = ref<string[]>([]),
    serviceItemList = shallowRef<TypeObject>([]),
    objectTypeItemList = shallowRef<TypeObject>([{ name: "客户", value: "1" }, { name: "服务商", value: "2" }]),
    caseItemList = shallowRef<TypeObject>([]),
    customerItemList = shallowRef<TypeObject>([]),
    serviceProItemList = shallowRef<TypeObject>([{ name: "小修类", value: "1" }, { name: "其他", value: "2" }]),
    statuItemList = shallowRef<TypeObject>([{ name: "已完结", value: "1" }])
// const pageParams = ref({
//     currentPage: 1,
//     pageSize: +(localStorage.getItem("pageSize") || 10),
//     total: 0
// })
const tableData = ref([])
const changes = () => {
    
    getData()
}
// 聚合率排序
const jhl = (a: any, b: any) => {
    return  Number(a.juhelv.substring(0, a.juhelv.length-1)) - Number(b.juhelv.substring(0, b.juhelv.length-1))
}
// 聚合率排序
const jhsl = (a: any, b: any) => {
    return  Number(a.juheSuccesslv.substring(0, a.juheSuccesslv.length-1)) - Number(b.juheSuccesslv.substring(0, b.juheSuccesslv.length-1))
}
// 聚合率排序

// 获取表格数据
const getData = () => {
    // const { currentPage, pageSize } = pageParams.value;
    // let datas = {
    //     serviceItem: searchData.serviceItems.toString() || ""
    // };
   
    let datas = { ...searchData }

    getSafetyList(datas).then((res: any) => {
        if (res.length != 0) {
            res.forEach((v: any) => {
                v.caseNum = Number(v.caseNum)
                v.juheNum = Number(v.juheNum)
                v.juheSuccessNum = Number(v.juheSuccessNum)
                if (searchData.objectType == "1" && searchData.customerId == "" && searchData.providerId == "") {
                    v.prvName = ""
                } else if (searchData.objectType == "2" && searchData.providerId == "" && searchData.customerId == "") {
                    v.customName = ""
                }
                v.juhelv = isNaN(Number(v.juheNum) / Number(v.caseNum)) ? "0%" : ((Number(v.juheNum) / Number(v.caseNum)) * 100).toFixed(0) + "%"
                v.juheSuccesslv = isNaN(Number(v.juheSuccessNum) / Number(v.juheNum)) ? "0%" : ((Number(v.juheSuccessNum) / Number(v.juheNum)) * 100).toFixed(0) + "%"

            })
        }


        tableData.value = res || [];
        // pageParams.value.total = res.total;
    })
        .catch((error) => {
            error && proxy.$message.error(`${error}`);
        });
}
const selectedDate = shallowRef(null as Date[] | null); // 已选择时间对象，主要用于二次选择时间时，时间禁用范围的判断

const _disabledDate = disabledDate("day", selectedDate, true, 0)
const handleCalendarChange = (val: Date[]) => {
    selectedDate.value = val;
};
const handleDateChange = (val: any) => {
    if (isArray(val)) {
        searchData.startTime = val[0];
        searchData.endTime = val[1];
        getData()

    } else {
        var defaultTime = dateFormatter(
            "YYYY-MM-DD",
            new Date().getTime() - 86400000
        );
        selectDate.value = [defaultTime, defaultTime];
        searchData.startTime = defaultTime;
        searchData.endTime = defaultTime;
    }

};
interface Product {
    customName: string
    prvName: string
    caseNum: string
    juheNum: string
    juhelv: string
    juheSuccessNum: string
    juheSuccesslv: string
}
interface SummaryMethodProps<T = Product> {
    columns: TableColumnCtx<T>[]
    data: T[]
}
const getSummaries: any = (param: any) => {
    const { columns, data } = param


    const sums: string[] = []
    columns.forEach((column: any, index: any) => {
        if (index === 0) {
            sums[index] = '合计'
            return
        }
        const values = data.map((item: any) => Number(item[column.property]))

        if (!values.every((value: any) => Number.isNaN(value))) {
            sums[index] = `${values.reduce((prev: any, curr: any) => {
                const value = Number(curr)
                if (!Number.isNaN(value)) {
                    return prev + curr
                } else {
                    return prev
                }
            }, 0)}`
        } else {
            sums[index] = 'N/A'
        }
    })


    const sum: any[] = ["合计", "", sums[2], sums[3], isNaN(Number(sums[3]) / Number(sums[2])) ? 0 : ((Number(sums[3]) / Number(sums[2])) * 100).toFixed(0) + "%", sums[5], isNaN(Number(sums[5]) / Number(sums[3])) ? 0 : ((Number(sums[5]) / Number(sums[3])) * 100).toFixed(0) + "%"]


    return sum
}

const handleSearch = () => {
    // pageParams.value.currentPage = 1;
    getData()
}

const exportServices = () => {
    

    
    let datas = { ...searchData }
    // var temp = document.createElement("form");
    // temp.action = `${baseUrl[env]}/report/pingAnReport/exportReportInfo?${qs.stringify(datas)}`;
    // temp.method = "post";
    // temp.style.display = "none";
    // document.body.appendChild(temp);
    // temp.submit();
    exportSafety(datas).then((res: any) => {
        const link = document.createElement("a");
        const blob = new Blob([res], {
            type: "application/vnd.ms-excel;charset=utf-8",
        });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `平安聚合统计分析.xls`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    })
}
const handleReset = (elForm: FormInstance | undefined) => {
    if (!elForm) return;
    elForm.resetFields();
    handleDateChange("reset");
    // pageParams.value.currentPage = 1;
    getData();
};


onBeforeMount(() => {
    ProviderSafety()
        .then((res) => (serviceItemList.value = res))
        .catch((error) => error && proxy.$message.error(`${error}`));

    CustomerSafety()
        .then((res) => (customerItemList.value = res))
        .catch((error) => error && proxy.$message.error(`${error}`));

    // ServiceSafety()
    //     .then((res) => {
    //         serviceProItemList.value = res
    //     })
    //     .catch((error) => error && proxy.$message.error(`${error}`));

    handleDateChange("default");
    getData()

})
</script>