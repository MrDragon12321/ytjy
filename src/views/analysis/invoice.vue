<template>
    <div class="container">
        <SearchBars>
            <el-form :model="searchData" :inline="true" ref="searchFrom">
                <el-form-item prop="objectType" label="服务对象:">
                    <el-select v-model="searchData.objectType" filterable placeholder="请选择对象" @change="changeCus">
                        <el-option v-for="item in serviceItemList" :key="item.value" :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="timeType" label="时间类型:">
                    <el-select v-model="searchData.timeType" filterable placeholder="请选择时间类型" @change="handleSearch">
                        <el-option v-for="item in timeItemList" :key="item.value" :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日期:">
                    <el-date-picker v-model="selectDate" type="daterange" range-separator="至" start-placeholder="开始时间"
                        :disabled-date="_disabledDate" end-placeholder="结束时间" value-format="YYYY-MM-DD"
                        :editable="false" :clearable="false" @change="handleDateChange"
                        @calendar-change="handleCalendarChange">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="customerId" label="客户:" v-hasPerm="['com:type:get']">
                    <el-select v-model="custometypeid" filterable placeholder="选择客户类型" clearable @change="ChangeType"
                        :disabled="discus">
                        <el-option v-for="item in custometypeList" :key="item.pvalue" :label="item.content"
                            :value="item.pvalue">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.customerId" filterable placeholder="请选择客户" clearable
                        :disabled="discus" @change="handleSearch">
                        <el-option v-for="item in customerItemList" :key="item.id" :label="item.customName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="providerId" label="供应商:" v-hasPerm="['com:service:get']">
                    <el-select v-model="searchData.providerId" filterable placeholder="请选择供应商" clearable
                        :disabled="disprv" @change="handleSearch">
                        <el-option v-for="item in provierItemList" :key="item.id" :label="item.prvName"
                            :value="item.id">
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
                    <el-button type="primary" @click="exportServices" v-hasPerm="['analysis:invoice:export']">
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
                :cell-style="{ textAlign: 'center', fontSize: '12px', border: '1px #e7e7eb solid' }" show-summary>
                <el-table-column prop="cuName" label="客户名称" />
                <el-table-column prop="prvName" label="供应商名称" />
                <el-table-column prop="cuCaseNum" label="未开票数" />
                <el-table-column prop="cuCaseMoney" label="未开票金额(元)" />
                <el-table-column prop="prvCaseNum" label="未收票数" />
                <el-table-column prop="prvCaseMoney" label="未收票金额(元)" />
                <el-table-column prop="cuCaseInvoiceNum" label="已开票数" />
                <el-table-column prop="cuCaseInvoiceMoney" label="已开票金额(元)" />
                <el-table-column prop="prvCaseInvoiceNum" label="已收票数" />
                <el-table-column prop="prvCaseInvoiceMoney" label="已收票金额(元)" />
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
import { disabledDate, dateFormatter } from "@/utils/date";
import { isArray } from "@/utils/validate";
import { havePerm } from '@/utils/perms'
import type { ElForm } from "element-plus";
import {
    getInvoiceDataList,
    getInvoiceCustomer,
    getInvoiceProvider,
    exportInvoice,
    getInvoiceCustomerType
} from "@/api/analysis";
type FormInstance = InstanceType<typeof ElForm>;
const { proxy } = getCurrentInstance() as any
const searchData = reactive({
    objectType: "1",//服务商
    timeType: "1",//时间类型
    startTime: null as NumOrNull,
    endTime: null as NumOrNull,
    customerId: "",//客户
    providerId: ""//供应商
}),
    // {"objectType": 1,
    // "timeType": 1,
    // "startTime":" 2022-09-01",
    // "endTime": "2022-09-13",
    // "customerId": 26,
    // "providerId":"",
    // "total": 1}
    custometypeid = ref(""),
    searchFrom = ref<FormInstance>(),
    selectDate = ref<string[]>([]),
    serviceItemList = ref<TypeObject>([{ name: "客户", value: "1" }, { name: "供应商", value: "2" }]),
    timeItemList = ref<TypeObject>([{ name: "案件时间", value: "1" }, { name: "开票时间", value: "3" }]),
    custometypeList = shallowRef<TypeObject>([]),
    customerItemList = shallowRef<TypeObject>([]),
    provierItemList = shallowRef<TypeObject>([]),
    discus = ref(false),
    disprv = ref(true),
    pageParams = ref({
        currentPage: 1,
        pageSize: +(localStorage.getItem("pageSize") || 10),
        total: 0
    }),
    tableData = ref([])
const selectedDate = shallowRef(null as Date[] | null); // 已选择时间对象，主要用于二次选择时间时，时间禁用范围的判断

const _disabledDate = disabledDate("day", selectedDate, true, 0)

const getData = () => {
    // const { currentPage, pageSize } = pageParams.value;
    // let datas = {
    //     pageNumber: currentPage,
    //     pageSize: pageSize,
    // };
    let datas = { ...searchData }

    getInvoiceDataList(datas).then((res: any) => {
        tableData.value = res || [];
        // pageParams.value.total = res.total;
    })
        .catch((error) => {
            error && proxy.$message.error(`${error}`);
        });

}
const ChangeType = (e: any) => {
    searchData.customerId = ""
    getCustom(e + "")
    if (!e) {
        getData()
    }
}
// 客户改变
const changeCus = (e: Number) => {


    if (e == 1) {
        timeItemList.value = [{ name: "案件时间", value: "1" }, { name: "开票时间", value: "3" }]
        searchData.providerId = ""
        disprv.value = true
        discus.value = false
    } else {
        timeItemList.value = [{ name: "案件时间", value: "1" }, { name: "收票时间", value: "2" }]
        custometypeid.value = ""
        getCustom()
        searchData.customerId = ""
        disprv.value = false
        discus.value = true
    }
    handleSearch()
}
// const changeTime = () => {
//     pageParams.value.currentPage = 1
//     getData()
// }

// const changeItem = () => {
//     pageParams.value.currentPage = 1
//     getData()

// }

const handleSearch = () => {
    pageParams.value.currentPage = 1;
    getData();
}

const exportServices = () => {
    let datas = { ...searchData }

    exportInvoice(datas).then((res: any) => {

        const link = document.createElement("a");
        const blob = new Blob([res], {
            type: "application/vnd.ms-excel;charset=utf-8",
        });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `财务发票统计分析.xls`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // pageParams.value.total = res.total;
    })
        .catch((error) => {
            error && proxy.$message.error(`${error}`);
        });

}

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

const handleReset = (elForm: FormInstance | undefined) => {
    if (!elForm) return;
    custometypeid.value = ""
    getCustom()
    elForm.resetFields();
    disprv.value = true
    discus.value = false
    handleDateChange("reset");
    // pageParams.value.currentPage = 1;
    handleSearch();
};
const getCustom = (params: any = "") => {
    getInvoiceCustomer({ custometypeid: params })
        .then((res) => customerItemList.value = res)
        .catch((error) => error && proxy.$message.error(`${error}`));
}

onBeforeMount(() => {
    handleDateChange("default");
    if (havePerm(['com:type:get'])) {
        getInvoiceCustomerType()
            .then((res) => custometypeList.value = res)
            .catch((error) => error && proxy.$message.error(`${error}`));
        getCustom()
    }
    if (havePerm(['com:service:get'])) {
        getInvoiceProvider()
            .then((res) => provierItemList.value = res)
            .catch((error) => error && proxy.$message.error(`${error}`));
    }
    if (havePerm(['analysis:service:tab'])) {
        getData()
    }


})
</script>