<template>
  <div class="container">
    <SearchBars>
      <el-form :model="searchData" :inline="true" ref="searchFrom">
        <el-form-item prop="prvProvince" label="省份:">
          <el-select v-model="searchData.prvProvince" filterable placeholder="请选择省份" clearable @change="handleChange">
            <el-option v-for="item in provinceList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="prvNAME" label="服务商:">
          <el-select v-model="searchData.prvNAME" filterable placeholder="请选择服务商" clearable @change="handleChange">
            <el-option v-model="searchData.prvNAME" v-for="item in providerList" :key="item" :label="item"
              :value="item">
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
      <el-table :data="tableData" border height="auto" stripe :header-cell-style="{
        background: '#eef1f6',
        textAlign: 'center',
        fontSize: '8px',
      }" :cell-style="{ textAlign: 'center', fontSize: '12px' }" id="t_box" v-show="false">
        <el-table-column prop="a" label="省份" />
        <el-table-column prop="b" label="城市" />
        <el-table-column prop="c" label="服务商名" />
        <el-table-column label="GPS上线">
          <el-table-column prop="e" label="小修" />
          <el-table-column prop="f" label="拖车" />
          <el-table-column prop="g" label="合计" />
        </el-table-column>
        <el-table-column prop="h" label="订单量" />
        <el-table-column label="聚合量">
          <el-table-column prop="i" label="小修" />
          <el-table-column prop="j" label="拖车" />
          <el-table-column prop="k" label="合计" />
        </el-table-column>
        <el-table-column prop="l" label="聚合率" />
        <el-table-column label="聚合成功">
          <el-table-column prop="m" label="小修" />
          <el-table-column prop="n" label="拖车" />
          <el-table-column prop="o" label="合计" />
        </el-table-column>
        <el-table-column label="聚合成功率">
          <el-table-column prop="p" label="小修" />
          <el-table-column prop="q" label="拖车" />
          <el-table-column prop="r" label="合计" />
        </el-table-column>
        <el-table-column prop="s" label="平台调度(<=2分钟)" />
        <el-table-column prop="t" label="sass派遣" />
        <el-table-column prop="u" label="技师接受" />
        <el-table-column prop="v" label="技师到堪" />
      </el-table>
    </Lists>
    <Bottoms>
      <Pagination :pageParams="pageParams" @change="getData"> </Pagination>
    </Bottoms>
  </div>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance, shallowRef, onBeforeMount ,onMounted} from "vue";
import {

} from "@/api/analysis";
import { isArray } from "@/utils/validate";
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
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
  tableData = ref([{
    a: "浙江",
    b: "杭州",
    c: "元通救援",
    d: 12,
    e: 24,
    f: 36,
    g: 17,
    h: 7,
    i: 5,
    j: 2,
    k: "71%",
    l: 7,
    m: 5,
    n: 12,
    o: 12,
    p: 34,
    q: 46,
    r: 0.04,
    s: 0.47,
    t: 4.73,
    u: 88,
    v: 10
  }]);
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

  let wb = XLSX.utils.table_to_book(
    document.querySelector("#t_box"),
    { raw: true }
  );

      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
            //Blob 对象表示一个不可变、原始数据的类文件对象。
            //Blob 表示的不一定是JavaScript原生格式的数据。
            //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
            //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
            new Blob([wbout], { type: "application/octet-stream" }),
            //设置导出文件名称
            "平安聚合提升.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;

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
