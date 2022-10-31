<template>
    <div class="container">
        <SearchBars>
            <el-form :model="searchData" :inline="true" ref="searchFrom">
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
            <el-table :data="tableData" border height="auto" stripe :header-cell-style="{
              background: '#eef1f6',
              textAlign: 'center',
              fontSize: '8px',
              border:'1px #e7e7eb solid'
            }" :cell-style="{ textAlign: 'center', fontSize: '12px',border:'1px #e7e7eb solid' }" id="t_box">
                <el-table-column prop="province" label="省份" />
                <el-table-column prop="city" label="城市" />
                <el-table-column prop="customName" label="客户名" />
                <el-table-column prop="prvName" label="服务商名" />
                <el-table-column label="GPS上线">
                    <el-table-column prop="gpsOnlineCountXX" label="小修" />
                    <el-table-column prop="gpsOnlineCountTC" label="拖车" />
                    <el-table-column prop="gpsOnlineCount" label="合计" />
                </el-table-column>
                <el-table-column prop="caseNum" label="订单量" />
                <el-table-column label="聚合量">
                    <el-table-column prop="juheNumXX" label="小修" />
                    <el-table-column prop="juheNumTC" label="拖车" />
                    <el-table-column prop="juheNum" label="合计" />
                </el-table-column>
                <el-table-column prop="juhelv" label="聚合率" />
                <el-table-column label="聚合成功">
                    <el-table-column prop="juheSuccessNumXX" label="小修" />
                    <el-table-column prop="juheSuccessNumTC" label="拖车" />
                    <el-table-column prop="juheSuccessNum" label="合计" />
                </el-table-column>
                <el-table-column label="聚合成功率">
                    <el-table-column prop="juheSuccessNumXXlv" label="小修" />
                    <el-table-column prop="juheSuccessNumTClv" label="拖车" />
                    <el-table-column prop="juheSuccessNumlv" label="合计" />
                </el-table-column>
                <el-table-column prop="platAvg" label="平台调度" />
                <el-table-column prop="saasAvg" label="sass派遣" />
                <el-table-column prop="driverAcceptTimeAvg" label="技师接受" />
                <el-table-column prop="driverArriveTimeAvg" label="技师抵达" />
                <el-table-column prop="driverFinishTimeAvg" label="技师完工" />
            </el-table>
        </Lists>
        <!-- <Bottoms>
            <Pagination :pageParams="pageParams" @change="getData"> </Pagination>
        </Bottoms> -->
    </div>
</template>
  
<script lang="ts" setup>
import { ref, getCurrentInstance, shallowRef, onBeforeMount, reactive } from "vue";
import {
    ProviderSafety,
    CustomerSafety,
    SafeTabList,
    ExportSafeTab,
} from "@/api/analysis";
import { isArray } from "@/utils/validate";
import { disabledDate, dateFormatter } from "@/utils/date";
import type { ElForm } from "element-plus";
import { TypeObject, NumOrNull } from "@/types/global";
import { exportTab } from '@/utils/export'
type FormInstance = InstanceType<typeof ElForm>;
const { proxy } = getCurrentInstance() as any;
const searchData = reactive({
    customerId: "",
    providerId: "",
    startTime: null as NumOrNull,
    endTime: null as NumOrNull,
    // is_search: true        // 是否处于搜索,防抖
}),
    selectDate = ref<string[]>([]), // 时间 [start, end]
    customerItemList = shallowRef<TypeObject>([]), //省份
    serviceItemList = shallowRef<TypeObject>([]), //服务项目
    searchFrom = ref<FormInstance>(),
    tableData = ref([]);

const selectedDate = shallowRef(null as Date[] | null); // 已选择时间对象，主要用于二次选择时间时，时间禁用范围的判断
const changes = () => {
    getData()
}
const handleReset = (elForm: FormInstance | undefined) => {
    if (!elForm) return;
    elForm.resetFields();
    handleDateChange("reset");
    handleChange();
};
const exportServices = () => {
    // exportTab("#t_box", "平安数据专项统计.xlsx")
    var datas = { ...searchData }
    ExportSafeTab(datas).then((res: any) => {
        const link = document.createElement("a");
        const blob = new Blob([res], {
            type: "application/vnd.ms-excel;charset=utf-8",
        });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `平安专项数据统计.xls`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // pageParams.value.total = res.total;
    })
        .catch((error) => {
            error && proxy.$message.error(`${error}`);
        });

};
const getData = () => {
    var datas = { ...searchData }
    SafeTabList(datas)
        .then((res: any) => {
            if (res.length !== 0) {
                res.forEach((v: any) => {
                    v.juhelv = v.caseNum == 0 ? '0%' : ((v.juheNum / v.caseNum) * 100).toFixed(0) + '%'
                    v.juheSuccessNumXXlv = v.juheNumXX == 0 ? '0%' : ((v.juheSuccessNumXX / v.juheNumXX) * 100).toFixed(0) + '%'
                    v.juheSuccessNumTClv = v.juheNumTC == 0 ? '0%' : ((v.juheSuccessNumTC / v.juheNumTC) * 100).toFixed(0) + '%'
                    v.juheSuccessNumlv = v.juheNum == 0 ? '0%' : ((v.juheSuccessNum / v.juheNum) * 100).toFixed(0) + '%'
                })
            }
            tableData.value = res || [];
        })
        .catch((error) => {
            error && proxy.$message.error(`${error}`);
        });
};
const handleChange = () => {

    getData()
}
const handleCalendarChange = (val: Date[]) => {
    selectedDate.value = val;
};

const _disabledDate = disabledDate("day", selectedDate, true, 0);


const handleDateChange = (val: any) => {
    if (isArray(val)) {
        searchData.startTime = val[0];
        searchData.endTime = val[1];
        handleChange()
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

onBeforeMount(() => {
    ProviderSafety()
        .then((res) => (serviceItemList.value = res))
        .catch((error) => error && proxy.$message.error(`${error}`));

    CustomerSafety()
        .then((res) => (customerItemList.value = res))
        .catch((error) => error && proxy.$message.error(`${error}`));
    handleDateChange("default")
    getData()
});
</script>
  
<style lang="scss">
test{
    background-color: #e7e7eb;
}
</style>
  