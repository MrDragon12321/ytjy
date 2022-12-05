<template>
    <div class="container">
        <SearchBars>
            <el-form :model="searchData" :inline="true" ref="searchFrom">
                <el-form-item prop="province" label="省份:" v-hasPerm="['drivers:driver:city']">
                    <el-select v-model="searchData.province" filterable placeholder="请选择省份" clearable
                        @change="changeProvince">
                        <el-option v-for="item in provinceItemList" :key="item.id" :label="item.name"
                            :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="city" label="城市:" v-hasPerm="['drivers:driver:city']">
                    <el-select v-model="searchData.city" filterable placeholder="请选择城市" clearable
                        @change="handleSearch">
                        <el-option v-for="item in cityItemList" :key="item.id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="facId" label="服务商:" v-hasPerm="['drivers:driver:service']">
                    <el-select v-model="searchData.facId" filterable placeholder="请选择服务商" clearable
                        @change="handleSearch">
                        <el-option v-for="item in serviceItemList" :key="item.prvFid" :label="item.prvName"
                            :value="item.prvFid">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="searchValue" label="其他:">
                    <el-input v-model="searchData.searchValue" placeholder="手机/车牌/技师姓名" clearable @input="handleSearch">
                    </el-input>
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
                    <el-button type="primary" @click="handleMenuExec(null, 'add')" v-hasPerm="['drivers:driver:add']">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        <span>新增</span>
                    </el-button>

                    <el-upload action="" class="yt_upload el-button" :auto-upload="false" :on-change="impService"
                        v-hasPerm="['drivers:driver:export']">
                        <el-button type="primary">
                            <el-icon>
                                <Upload />
                            </el-icon>
                            <span>导入</span>
                        </el-button>
                    </el-upload>
                    <el-icon @click="drawer = true" v-if="showicon"
                        style="margin-left: 8px;color:orange;font-size:15px">
                        <Tickets />
                    </el-icon>

                </el-form-item>
            </el-form>
        </SearchBars>
        <Lists>
            <el-table :data="tableData" border header-row-class-name="header-style"
                :header-cell-style="{ background: '#eef1f6', textAlign: 'center', 'fontSize': '8px', border: '1px #e7e7eb solid' }"
                :cell-style="{ textAlign: 'center', fontSize: '12px', border: '1px #e7e7eb solid' }"
                table-layout="auto">
                <el-table-column prop="providerName" label="服务商" />
                <el-table-column prop="driverName" label="技师姓名" />
                <el-table-column prop="phone" label="手机号" />
                <el-table-column prop="carNumber" label="车牌号" />
                <el-table-column prop="province" label="省份" />
                <el-table-column prop="city" label="城市" />
                <el-table-column prop="address" label="定位点" />
                <el-table-column prop="content" label="状态" />
                <el-table-column label="操作" v-hasPerm="['drivers:driver:edit']">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" circle @click="handleMenuExec(row, 'edit')">
                            <el-icon :size="15">
                                <edit />
                            </el-icon>
                        </el-button>
                        <!-- <el-button type="danger" size="small" circle @click="handleMenuExec(row, 'delete')">
                            <el-icon :size="15">
                                <delete />
                            </el-icon>
                        </el-button> -->
                    </template>
                </el-table-column>


            </el-table>
        </Lists>
        <Bottoms>
            <Pagination :pageParams="pageParams" @change="getData"> </Pagination>
        </Bottoms>
        <driver-dialog v-model:options="dialogOptions" @update="handleSearch"></driver-dialog>
        <el-drawer v-model="drawer" title="导入表格后反馈信息" size="15%">
            <div class="imp_single">
                <div class="imp_name">导入成功:</div>
                <div class="imp_num">
                    <!-- <font color="green" size="5">{{suc}}</font>条 -->
                    <span class="imp_d" style="color: green;font-size: 18px;font-weight: 500;margin-right: 5px;">{{ suc
                    }}</span>条
                </div>
            </div>
            <div class="imp_single">
                <div class="imp_name">导入失败:</div>
                <div class="imp_num">
                    <!-- <font color="red" size="5">{{fal}}</font>条 -->
                    <span class="imp_d" style="color: red;font-size: 18px;font-weight: 500;margin-right: 5px;">{{ fal
                    }}</span>条

                </div>
            </div>
            <div class="imp_single" style="align-items: flex-start;">
                <div class="imp_name">失败明细:</div>
                <div class="imp_num">
                    <div class="imp_li" v-for="(item, index) in failist" :key="index">{{ item }}</div>
                </div>
            </div>

        </el-drawer>

    </div>

</template>

<script setup lang="ts">

import { ref, reactive, shallowRef, onBeforeMount, getCurrentInstance } from 'vue'
import xlsx from 'xlsx'
import {
    getDriverDataList,
    delDriver,
    ProvinceCity,
    ServiceDriver,
    ImportDriver
} from "@/api/driver";
import AMapLoader from '@amap/amap-jsapi-loader';
import { Tickets } from '@element-plus/icons-vue' // 常用icon
import type { DialogOptions, NumOrNull, DialogHandle, TypeObject } from '@/types/global'
import type { ElForm } from "element-plus";
import DriverDialog from './driver-dialog.vue'
import { havePerm } from '@/utils/perms'
type FormInstance = InstanceType<typeof ElForm>;
const { proxy } = getCurrentInstance() as any;

const searchData = reactive({
    serviceName: "",//服务商
    province: "",//省份
    city: "",//城市,
    facId: "",//服务商id,
    searchValue: ""
}),

    searchFrom = ref<FormInstance>(),
    cityItemList = ref<TypeObject>([]),
    serviceItemList = shallowRef<TypeObject>([]),
    provinceItemList = shallowRef<TypeObject>([]),
    pageParams = ref({
        currentPage: 1,
        pageSize: +(localStorage.getItem("pageSize") || 10),
        total: 0
    }),
    tableData = ref([]),
    drawer = ref(false),
    showicon = ref(false),
    suc = ref(0),
    fal = ref(0),
    failist = ref<String[]>([]),
    dialogOptions = ref<DialogOptions>({ visible: false }) // 资料对话框参数,

let currRow: TypeObject | null

// 获取表格数据
const getData = () => {
    const { currentPage, pageSize } = pageParams.value;
    let datas = {
        page: currentPage,
        size: pageSize,
    };
    datas = { ...datas, ...searchData }

    getDriverDataList(datas).then((res: any) => {
        tableData.value = res.records || [];
        pageParams.value.total = res.total;
    })
        .catch((error) => {
            error && proxy.$message.error(`${error}`);
        });
}


// const handleChange = () => {
//     getData()
// }
// 点击搜索
const handleSearch = () => {
    pageParams.value.currentPage = 1;
    getData();
}

const readFile = (file: any) => {


    return new Promise(resolve => {
        let reader = new FileReader()
        reader.readAsBinaryString(file)
        reader.onload = ev => {
            resolve(ev.target?.result)
        }
    })
}

// 点击导入excel， 获取excel的表（sheet ）
// const readExportExcelFile =async (file:any)=>{
//     let dataBinary = await readFile(file.raw)
//       let workBook = xlsx.read(dataBinary, {type: 'binary', cellDates: true})
//       let workSheet = workBook.Sheets[workBook.SheetNames[0]]
//       const data = xlsx.utils.sheet_to_json(workSheet)
//       console.log(data)
// }


// 导入模板
const impService = async (file: any) => {
    let count = 0//定义计数器，以便判断异步获取坐标全部完成
    let dataBinary = await readFile(file.raw)
    let workBook = xlsx.read(dataBinary, { type: 'binary', cellDates: true })
    let workSheet = workBook.Sheets[workBook.SheetNames[0]]
    const data = xlsx.utils.sheet_to_json(workSheet) as Object[]

    if (!Object.prototype.hasOwnProperty.call(data[0], '详细地址')) {
        proxy.$message.error('请确保含有"详细地址"一列,以便转化经纬度')
        return
    }




    var formData = new FormData();
    formData.append("file", file.raw);
    if (Object.prototype.hasOwnProperty.call(data[0], '经度') && Object.prototype.hasOwnProperty.call(data[0], '纬度')) {
        ImportDriver(formData).then((res: any) => {
            suc.value = res.successNum
            fal.value = res.failNum
            failist.value = res.failDetail || []
            drawer.value = true
            showicon.value = failist.value.length == 0 ? false : true
            getData()
        })
        return
    }



    var addr = [] as any[];
    const newdata: any = data.filter((nd: any) => {
        return nd["详细地址"]
    })
    //在控制台打印出来表格中的数据
    newdata.forEach((v: any) => {
        addr.push((v["省份"] || "") + (v["城市"] || "") + v['详细地址'])
    })


    AMapLoader.load({
        key: "96782a5928bf2f159f3c789d4707d5d7",             // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "1.4.15",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        // plugins: ['AMap.Autocomplete'],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    }).then((AMap) => {

        AMap.plugin(['AMap.Autocomplete', 'AMap.Geocoder'], function () {

            var autoComplete = new AMap.Autocomplete({
                //city 限定城市，默认全国
                city: '',

            });

            var geocoder = new AMap.Geocoder({
                city: "010", //城市设为北京，默认：“全国”
                radius: 1000 //范围，默认：500
            });

            addr.forEach((keywords, i) => {

                autoComplete.search(keywords, function (status: any, result: any) {
                    var arr = result.tips?.filter((z: any) => {
                        return z.district
                    }) || []
                    var res = arr[0]
                    // console.log(res, keywords, i);

                    var lng = res?.location.lng || ""
                    var lat = res?.location.lat || ""
                    newdata[i]['经度'] = lng
                    newdata[i]['纬度'] = lat
                    newdata[i]['详细地址'] = res?.name || ""
                    geocoder.getAddress([lng, lat], function (status: any, results: any) {
                        count++
                        if (status === 'complete' && results.regeocode) {
                            var reses = results.regeocode.addressComponent
                            newdata[i]['省份'] = reses.province
                            newdata[i]['城市'] = reses.city
                        } else {
                            newdata[i]['省份'] = ""
                            newdata[i]['城市'] = ""
                        }
                        if (count == addr.length) {
                            // const sortData = [] as Object[]
                            // newdata.forEach((v: any) => {
                            //     sortData.push({
                            //         '服务商': v['服务商'],
                            //         '技师姓名': v['技师姓名'],
                            //         '手机号': v['手机号'],
                            //         '车牌号': v['车牌号'],
                            //         '省份': v['省份'],
                            //         '城市': v['城市'],
                            //         '详细地址': v['详细地址'],
                            //         '经度': v['经度'],
                            //         '纬度': v['纬度'],
                            //     })
                            // })

                            // console.log(sortData);

                            const workbook = xlsx.utils.book_new();
                            // 创建一个新的工作表
                            const worksheet = xlsx.utils.json_to_sheet(newdata);
                            // 将工作表附加到工作簿，并将工作表命名为students
                            xlsx.utils.book_append_sheet(workbook, worksheet, "module");
                            proxy.$message({
                                message: "请将'再生成'文件按平台表格字段顺序排序后进行导入",
                                type: "warning",
                                duration: 5000
                            })
                            xlsx.writeFile(workbook, "再生成.xlsx");
                        }
                    });

                })
            })

        })
    })
}

// const handleUpdateRow = () => {
//     getData()
// }
// 点击重置
const handleReset = (elForm: FormInstance | undefined) => {
    if (!elForm) return;
    elForm.resetFields();
    handleSearch()
}

// 点击新增
const changeProvince = (e: any) => {

    var arr = provinceItemList.value.filter((v: any) => {
        return v.name == e
    })


    var data = { "regionType": "2", "parentId": arr.length != 0 ? arr[0].id : "" }
    ProvinceCity(data).then((res) => {
        cityItemList.value = res
    })
    handleSearch()
}

const handleMenuExec: DialogHandle = (row = null, type = '') => {
    if (type == "edit") {
        dialogOptions.value = { type, visible: true, row }
        currRow = row
    } else if (type == "delete") {
        proxy.$confirm(`确定删除该虚拟司机吗?`, '温馨提示', {
            type: 'warning'
        }).then(() => {
            var formData = new FormData();
            formData.append("id", row.id)
            delDriver(formData).then(() => {
                proxy.$message.success('删除成功')
                getData()
            })
        }).catch(() => {
        })
    } else if (type == "add") {
        dialogOptions.value = { type, visible: true, row }
    }
}
const getProvinces = () => {
    var data = { "regionType": 1, "parentId": "" }
    ProvinceCity(data).then((res) => {


        provinceItemList.value = res
    })
}

const getCitys = () => {
    var data = { "regionType": 2, "parentId": "" }
    ProvinceCity(data).then((res) => {
        cityItemList.value = res
    })
}

const getService = () => {
    ServiceDriver().then(res => {
        serviceItemList.value = res
    })
}

onBeforeMount(() => {
    if (havePerm(['drivers:driver:city'])) {
        getProvinces()
        getCitys()
    }
    if (havePerm(['drivers:driver:service'])) {
        getService()
    }
    if (havePerm(['drivers:driver:tab'])) {
        getData()
    }
})
</script>

<style lang="scss" scoped>
.yt_upload {
    ::v-deep() {
        width: 74px;
        height: 30px;
        margin-left: 8px;

        .el-upload-list {
            margin: 0;
            padding: 0;
            list-style: none;
            display: none;
        }
    }

}

.imp_single {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0;

    .imp_name {
        flex: 1;
        font-size: 16px;
    }

    .imp_num {
        flex: 1;

        .imp_li {
            font-size: 16px;
            margin-bottom: 10px;
        }
    }
}
</style>