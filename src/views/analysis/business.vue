<template>
    <div class="container">
        <SearchBars>
            <el-form :model="searchData" :inline="true" ref="searchFrom">

                <el-form-item label="日期:">
                    <el-date-picker v-model="selectDate" type="daterange" range-separator="至" start-placeholder="开始时间"
                        :disabled-date="_disabledDate" end-placeholder="结束时间" value-format="YYYY-MM-DD"
                        :editable="false" @change="handleDateChange" @calendar-change="handleCalendarChange"
                        :clearable="false">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="provinces" label="省份:" v-hasPerm="['com:province:get']">
                    <el-select v-model="searchData.provinces" filterable placeholder="请选择省份" clearable
                        @change="handleChange">
                        <el-option v-for="item in provinceItemList" :key="item.name" :label="item.name"
                            :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="customerType" label="客户:" v-hasPerm="['com:type:get']">
                    <el-select v-model="searchData.customerType" filterable placeholder="选择客户类型" clearable
                        @change="ChangeType">
                        <el-option v-for="item in custometypeList" :key="item.pvalue" :label="item.content"
                            :value="item.pvalue">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.customerId" filterable placeholder="请选择客户" clearable
                        @change="handleChange">
                        <el-option v-for="item in customerItemList" :key="item.id" :label="item.customName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="providerId" label="服务商:" v-hasPerm="['com:service:get']">
                    <el-select v-model="searchData.providerId" filterable placeholder="请选择服务商" clearable
                        @change="handleChange">
                        <el-option v-for="item in providerItemList" :key="item.id" :label="item.prvName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="serviceItems" label="服务项目:" v-hasPerm="['analysis:business:serviceitem']">
                    <el-select v-model="searchData.serviceItems" filterable placeholder="所有服务项目" multiple
                        :collapse-tags="true" :collapse-tags-tooltip="true" @change="handleChange">
                        <el-option v-for="item in serviceProItemList" :key="item.id" :label="item.content"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="status" label="状态:">
                    <el-select v-model="searchData.status" filterable placeholder="请选择状态" clearable
                        @change="handleChange">
                        <el-option v-for="item in statuItemList" :key="item.value" :label="item.name"
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
                    <el-button type="primary" @click="exportServices" v-hasPerm="['analysis:business:export']">
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
                <el-table-column prop="prvName" label="服务商" />
                <el-table-column prop="serviceItem" label="服务项目" />
                <el-table-column prop="caseNum" label="案件量" />
                <el-table-column prop="cuSettMoney" label="客户结算金额" />
                <el-table-column prop="fiCreditMoney" label="服务商挂账金额" />
                <el-table-column prop="paygMoney" label="收现金额" />
                <el-table-column prop="tolls" label="过路费" />
                <el-table-column prop="expectProfitLoss" label="预计盈亏" />
                <el-table-column prop="cashReceived" label="已收现金额" />
                <el-table-column prop="uncollectedCashAmount" label="未收现金额" />
            </el-table>
        </Lists>
        <Bottoms>
            <Pagination :pageParams="pageParams" @change="getData"> </Pagination>
        </Bottoms>
    </div>

</template>

<script setup lang="ts">
import { ref, reactive, shallowRef, onBeforeMount, getCurrentInstance } from 'vue'
import { TypeObject, NumOrNull } from "@/types/global";
import type { ElForm } from "element-plus";
import { disabledDate, dateFormatter } from "@/utils/date";
import { isArray } from "@/utils/validate";
import { havePerm } from '@/utils/perms'
import {
    getBusinessDataList,
    getBusinessCustomerType,
    getBusinessProvince,
    getBusinessCustomer,
    getBusinessProvider,
    exportBusiness,
    ServiceBusiness
} from "@/api/analysis";
type FormInstance = InstanceType<typeof ElForm>;
const { proxy } = getCurrentInstance() as any
const searchData = reactive({
    provinces: "",
    startTime: null as NumOrNull,
    endTime: null as NumOrNull,
    customerType: "",
    customerId: "",//客户
    providerId: "",//供应商，
    serviceItem: "",
    serviceItems: [],
    status: "",//状态
    objectType: "",
}),

    searchFrom = ref<FormInstance>(),
    selectDate = ref<string[]>([]),
    providerItemList = shallowRef<TypeObject>([]),
    customerItemList = ref<TypeObject>([]),
    provinceItemList = shallowRef<TypeObject>([]),
    serviceProItemList = shallowRef<TypeObject>([]),
    custometypeList = shallowRef<TypeObject>([]),
    statuItemList = shallowRef<TypeObject>([{ name: "已完成", value: "5" }, { name: "已空驶", value: "12" }])
const pageParams = ref({
    currentPage: 1,
    pageSize: +(localStorage.getItem("pageSize") || 10),
    total: 0
})
const tableData = ref([])
const getData = () => {
    const { currentPage, pageSize } = pageParams.value;
    let datas = {
        pageNumber: currentPage,
        pageSize: pageSize,
    };
    searchData.objectType = searchData.customerId == "ytjy" ? "1" : ""
    if (!searchData.objectType) {
        searchData.objectType = searchData.providerId == "ytjy" ? "2" : ""
    }
    let dataes = {}

    if (searchData.objectType == "1") {
        dataes = { customerId: "" }
    } else if (searchData.objectType == "2") {
        dataes = { providerId: "" }
    }

    searchData.serviceItem = searchData.serviceItems.toString() || ""
    datas = { ...datas, ...searchData, ...dataes }
    getBusinessDataList(datas).then((res: any) => {
        // if (res.records.length != 0) {
        //     res.records.forEach((v: any) => {
        //         v.cuName = searchData.customerId ? v.cuName : ""
        //         v.prvName = searchData.providerId ? v.prvName : ""
        //     })
        // }
        tableData.value = res.records || [];
        pageParams.value.total = res.total;

    })
        .catch((error) => error && proxy.$message.error(`${error}`));
}
const ChangeType = (e: any) => {
    searchData.customerId = ""
    getCustom(e + "")
    handleChange()
}
const handleChange = () => {
    if (searchData.customerId == 'ytjy') {
        if (providerItemList.value[0].prvName === "全部服务商") {
            providerItemList.value.shift()
        }
    } else {
        if (providerItemList.value[0].prvName !== "全部服务商") {
            providerItemList.value.unshift({ id: "ytjy", prvName: "全部服务商" })
        }
    }
    if (searchData.providerId == 'ytjy') {
        if (customerItemList.value[0].customName === "全部客户") {
            customerItemList.value.shift()
        }
    } else {
        if (customerItemList.value[0].customName !== "全部客户") {
            customerItemList.value.unshift({ id: "ytjy", customName: "全部客户" })
        }
    }

    pageParams.value.currentPage = 1
    getData()
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



const exportServices = () => {
    const { currentPage, pageSize } = pageParams.value;
    let datas = {
        pageNumber: currentPage,
        pageSize: pageSize,
    };
    searchData.objectType = searchData.customerId == "ytjy" ? "1" : ""
    if (!searchData.objectType) {
        searchData.objectType = searchData.providerId == "ytjy" ? "2" : ""
    }
    let dataes = {}

    if (searchData.objectType == "1") {
        dataes = { customerId: "" }                                             
    } else if (searchData.objectType == "2") {
        dataes = { providerId: "" }
    }

    searchData.serviceItem = searchData.serviceItems.toString() || ""
    datas = { ...datas, ...searchData, ...dataes }
    exportBusiness(datas).then((res: any) => {
        const link = document.createElement("a");
        const blob = new Blob([res], {
            type: "application/vnd.ms-excel;charset=utf-8",
        });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `财务业务统计分析.xls`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // pageParams.value.total = res.total;
    })
        .catch((error) => {
            error && proxy.$message.error(`${error}`);
        });
}
const handleReset = (elForm: FormInstance | undefined) => {
    if (!elForm) return;
    // custometypeid.value = ""
    getCustom()
    elForm.resetFields();
    handleDateChange("reset");
    pageParams.value.currentPage = 1;
    getData();
};
const getCustom = (params: any = "") => {
    getBusinessCustomer({ custometypeid: params })
        .then((res: any) => {
            res.unshift({ id: "ytjy", customName: "全部客户" })
            customerItemList.value = res
        })
        .catch((error) => error && proxy.$message.error(`${error}`));
}

onBeforeMount(() => {
    handleDateChange("default");
    if(havePerm(['com:province:get'])){
        getBusinessProvince()
        .then((res) => provinceItemList.value = res)
        .catch((error) => error && proxy.$message.error(`${error}`));
    }
    if(havePerm(['com:type:get'])){
        getBusinessCustomerType()
        .then((res) => custometypeList.value = res)
        .catch((error) => error && proxy.$message.error(`${error}`));
    getCustom()
    }
    if(havePerm(['com:service:get'])){
        getBusinessProvider()
        .then((res: any) => {
            res.unshift({ id: "ytjy", prvName: "全部服务商" })
            providerItemList.value = res
        })
        .catch((error) => error && proxy.$message.error(`${error}`));
    }
    if(havePerm(['analysis:business:serviceitem'])){
        ServiceBusiness()
        .then((res: any) => {
            res.unshift({ id: "ytjy", content: "全部服务项目" })
            serviceProItemList.value = res
        })
        .catch((error) => error && proxy.$message.error(`${error}`));
    }
    if(havePerm(['analysis:business:tab'])){
        getData()
    }
   
   
   
   
   
})
</script>