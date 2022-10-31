<template>
  <div class="container">
    <SearchBars>
      <el-form :model="searchData" :inline="true" ref="searchFrom">
        <el-form-item prop="customerNames" label="客户:">
          <el-select v-model="searchData.customerNames" filterable placeholder="请选择客户" clearable @change="handleChange"
            multiple :collapse-tags="true" :collapse-tags-tooltip="true">
            <el-option v-for="item in customerItemList" :key="item.id" :label="item.customName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="prvProvince" label="服务商省份:">
          <el-select v-model="searchData.prvProvince" filterable placeholder="请选择服务商省份" clearable
            @change="handleChange">
            <el-option v-for="item in provinceList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item prop="prvNAMEs" label="服务商:">
          <el-select v-model="searchData.prvNAMEs" filterable placeholder="请选择服务商" clearable @change="handleChange"
            multiple :collapse-tags="true" :collapse-tags-tooltip="true">
            <el-option v-for="item in providerList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="isInterface" label="接口类型:">
          <el-select v-model="searchData.isInterface" filterable placeholder="请选择服务商" clearable @change="handleChange">
            <el-option v-for="item in InterfaceList" :key="item" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="isAppointMent" label="预约类型:">
          <el-select v-model="searchData.isAppointMent" filterable placeholder="请选择服务商" clearable
            @change="handleChange">
            <el-option v-for="item in AppointMentList" :key="item" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="serviceNames" label="服务项目:">
          <el-select v-model="searchData.serviceNames" filterable placeholder="请选择服务项目" clearable @change="handleChange"
            multiple :collapse-tags="true" :collapse-tags-tooltip="true">
            <el-option v-for="item in serviceItemList" :key="item[0]" :label="item[1]" :value="item[0]">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期:">
          <el-date-picker v-model="selectDate" type="daterange" range-separator="至" start-placeholder="开始时间"
            :disabled-date="_disabledDate" end-placeholder="结束时间" value-format="YYYY-MM-DD" :editable="false"
            @change="handleDateChange" @calendar-change="handleCalendarChange" :clearable="false">
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
      <el-table :data="tableData" border height="auto" :header-cell-style="{
        background: '#eef1f6',
        textAlign: 'center',
        fontSize: '8px',
        border: '1px #e7e7eb solid'
      }" :cell-style="{ textAlign: 'center', fontSize: '12px', border: '1px #e7e7eb solid' }">
        <el-table-column prop="customName" label="客户" width="150" />
        <el-table-column prop="prvProvince" label="服务商省份" width="100" />
        <el-table-column prop="prvNAME" label="服务商" width="150" />
        <el-table-column prop="fyyCount" label="案件量" width="150" />
        <el-table-column prop="yyCount" label="预约量" width="150" />
        <el-table-column prop="serviceName" label="服务项目" width="150" />
        <el-table-column prop="platAvg" label="平台调度时间(平均M)" width="220" />
        <el-table-column prop="saasAvg" label="SAAS调度时间(平均M)" width="220" />
        <el-table-column prop="driverAcceptTimeAvg" label="技师接受时间(平均M)" width="220" />
        <el-table-column prop="driverArriveTimeAvg" label="技师抵达时间(平均M)" width="220" />
        <el-table-column prop="driverFinishTimeAvg" label="技师完工时间(平均M)" width="220" />
      </el-table>
    </Lists>
    <Bottoms>
      <Pagination :pageParams="pageParams" @change="getData"> </Pagination>
    </Bottoms>
  </div>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance, shallowRef, onBeforeMount } from "vue";
import {
  getProvince,
  getProvider,
  getCustomers,
  getService,
  getDataList,
} from "@/api/analysis";
// import { exportService } from "@/api/export";
import qs from "qs";
import { disabledDate, dateFormatter } from "@/utils/date";
import type { ElForm } from "element-plus";
import { TypeObject, NumOrNull } from "@/types/global";
import { isArray } from "@/utils/validate";
import { keyOf } from "element-plus/es/utils/props";
type FormInstance = InstanceType<typeof ElForm>;
const { proxy } = getCurrentInstance() as any;
const { env, baseUrl } = require("@/config/index.js");
const searchData = ref({
  prvProvince: "",
  prvNAMEs: [],
  isInterface: "",
  isAppointMent: "",
  customerNames: [],
  serviceNames: [],
  beginTime: null as NumOrNull,
  endTime: null as NumOrNull,
  // is_search: true        // 是否处于搜索,防抖
}),
  selectDate = ref<string[]>([]), // 时间 [start, end]
  provinceList = shallowRef<TypeObject>([]), //省份
  InterfaceList = shallowRef<TypeObject>([{ name: "接口案件", value: "1" }, { name: "非接口案件", value: "2" }]), //接口
  AppointMentList = shallowRef<TypeObject>([{ name: "预约案件", value: "1" }, { name: "非预约案件", value: "2" }]), //预约
  customerItemList = shallowRef<TypeObject>([]), //客户
  providerList = shallowRef<TypeObject>([]), //服务商
  serviceItemList = shallowRef<TypeObject>([]), //服务项目
  searchFrom = ref<FormInstance>(),
  tableData = ref([]);
const pageParams = ref({
  currentPage: 1,
  pageSize: +(localStorage.getItem("pageSize") || 10),
  total: 0,
});
const selectedDate = shallowRef(null as Date[] | null); // 已选择时间对象，主要用于二次选择时间时，时间禁用范围的判断

const handleReset = (elForm: FormInstance | undefined) => {
  if (!elForm) return;
  elForm.resetFields();
  handleDateChange("reset");
  handleChange();
};
const exportServices = () => {
  const { currentPage, pageSize } = pageParams.value;
  let datas = {
    pageNumber: currentPage,
    pageSize: pageSize,
    prvNAME: searchData.value.prvNAMEs.toString() || "",
    serviceName: searchData.value.serviceNames.toString() || "",
    customIds: searchData.value.customerNames.toString() || "",
  };

  datas = { ...datas, ...searchData.value };
  // var temp = document.createElement("form");
  // temp.action = `${baseUrl[env]}/plat/exportData?${qs.stringify(datas)}`;
  // temp.method = "post";
  // temp.style.display = "none";
  // document.body.appendChild(temp);
  // temp.submit();
  window.open(`${baseUrl[env]}/plat/exportData?${qs.stringify(datas)}`)
};
const getData = () => {
  const { currentPage, pageSize } = pageParams.value;
  let datas = {
    pageNumber: currentPage,
    pageSize: pageSize,
    prvNAME: searchData.value.prvNAMEs.toString() || "",
    serviceName: searchData.value.serviceNames.toString() || "",
    customIds: searchData.value.customerNames.toString() || "",
  };
  datas = { ...datas, ...searchData.value };
  getDataList(datas)
    .then((res: any) => {
      // if (searchData.value.serviceName.length == 0) {
      //   res.records.forEach((v: any) => {
      //     v.serviceName = ""
      //   })
      // }
      tableData.value = res.records || [];
      pageParams.value.total = res.total;
    })
    .catch((error) => {
      error && proxy.$message.error(`${error}`);
    });
};
const handleChange = () => {
  pageParams.value.currentPage = 1;
  getData()
}
const handleCalendarChange = (val: Date[]) => {
  selectedDate.value = val;
};

const _disabledDate = disabledDate("day", selectedDate, true, 0);


const handleDateChange = (val: any) => {
  if (isArray(val)) {
    searchData.value.beginTime = val[0];
    searchData.value.endTime = val[1];
    handleChange()
  } else {
    var defaultTime = dateFormatter(
      "YYYY-MM-DD",
      new Date().getTime() - 86400000
    );
    selectDate.value = [defaultTime, defaultTime];
    searchData.value.beginTime = defaultTime;
    searchData.value.endTime = defaultTime;
  }
};

onBeforeMount(() => {
  getProvince()
    .then((res) => (provinceList.value = res))
    .catch((error) => error && proxy.$message.error(`${error}`));

  getProvider()
    .then((res) => (providerList.value = res))
    .catch((error) => error && proxy.$message.error(`${error}`));

  getCustomers()
    .then((res) => (customerItemList.value = res))
    .catch((error) => error && proxy.$message.error(`${error}`));

  getService()
    .then((res) => (serviceItemList.value = Object.entries(res)))
    .catch((error) => error && proxy.$message.error(`${error}`));
  handleDateChange("default")
  getData()
});
</script>

<style lang="scss">

</style>
