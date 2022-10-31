<template>
    <div class="container">
        <SearchBars>
            <el-form :model="searchData" :inline="true" ref="searchFrom">
                <el-form-item prop="prvProvince" label="省份:">
                    <el-select v-model="searchData.prvProvince" filterable placeholder="请选择省份" clearable
                        @change="handleChange">
                        <el-option v-for="item in provinceList" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="prvNAME" label="服务商:">
                    <el-select v-model="searchData.prvNAME" filterable placeholder="请选择服务商" clearable
                        @change="handleChange">
                        <el-option v-model="searchData.prvNAME" v-for="item in providerList" :key="item" :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="serviceNames" label="服务项目:">
                    <el-select v-model="searchData.serviceNames" filterable placeholder="请选择服务项目" clearable
                        @change="handleChange" multiple :collapse-tags="true" :collapse-tags-tooltip="true">
                        <el-option v-for="item in serviceItemList" :key="item[0]" :label="item[1]" :value="item[0]">
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
            <el-table :data="tableData" border height="auto" :header-cell-style="{
              background: '#eef1f6',
              textAlign: 'center',
              fontSize: '8px',
            }" :cell-style="{ textAlign: 'center', fontSize: '12px' }">
                <el-table-column prop="prvProvince" label="省份" width="100" />
                <el-table-column prop="prvNAME" label="服务商" width="150" />
                <el-table-column prop="fyyCount" label="案件量" width="150" />
                <el-table-column prop="yycount" label="预约量" width="150" />
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
  
  } from "@/api/analysis";
  import { isArray } from "@/utils/validate";
  import { disabledDate, dateFormatter } from "@/utils/date";
  import type { ElForm } from "element-plus";
  import { TypeObject, NumOrNull } from "@/types/global";
  type FormInstance = InstanceType<typeof ElForm>;
  const { proxy } = getCurrentInstance() as any;
  const searchData = ref({
    prvProvince: "",
    prvNAME: "",
    serviceNames: [],
    serviceName: "",
    beginTime: null as NumOrNull,
    endTime: null as NumOrNull,
    // is_search: true        // 是否处于搜索,防抖
  }),
    selectDate = ref<string[]>([]), // 时间 [start, end]
    provinceList = shallowRef<TypeObject>([]), //省份
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
    };
    searchData.value.serviceName = searchData.value.serviceNames.toString() || ""
    datas = { ...datas, ...searchData.value };
  };
  const getData = () => {
    const { currentPage, pageSize } = pageParams.value;
    let datas = {
        pageNumber: currentPage,
        pageSize: pageSize,
    };
    searchData.value.serviceName = searchData.value.serviceNames.toString() || ""
    datas = { ...datas, ...searchData.value };
    // getDataList(datas)
    //     .then((res: any) => {
  
    //         tableData.value = res.records || [];
    //         pageParams.value.total = res.total;
    //     })
    //     .catch((error) => {
    //         error && proxy.$message.error(`${error}`);
    //     });
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
    handleDateChange("default")
    getData()
  });
  </script>
  
  <style lang="scss">
  
  </style>
  