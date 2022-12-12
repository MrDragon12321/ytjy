<template>
    <div class="container">
        <SearchBars>
            <el-form :model="searchData" :inline="true">
                <el-form-item prop="type" label="状态:">
                    <el-select v-model="searchData.type" filterable placeholder="请选择状态" clearable
                        @change="handleChange">
                        <el-option v-for="item in statuList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="keywords" label="关键字">
                    <el-input v-model="searchData.keywords" placeholder="关键字" clearable @input="handleChange" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="dialog.visible = true" v-hasPerm="['manager:ip:add']">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        <span>新增</span>
                    </el-button>
                </el-form-item>
            </el-form>
        </SearchBars>
        <Lists>
            <el-row :gutter="20">
                <el-col :xl="4" :lg="6" :md="6" :sm="8" :xs="12" v-for="item in plateNumbers" :key="item.id"
                    class="single_card">
                    <el-card shadow="always" :body-style="{ padding: '10px' }"
                        :style="{ background: item.type == 'WHITE_LIST' ? '#fff' : '#000', color: item.type == 'WHITE_LIST' ? '#000' : '#fff' }">
                        <div class="font_number">
                            <span>{{ item.abbreviation }}{{ item.plateNumber }}</span>
                            <el-button type="danger" @click="delCar(item.id)" circle v-hasPerm="['manager:ip:del']">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                            </el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <!-- <div class="card_container">
               
            </div> -->

        </Lists>
        <Bottoms>
            <Pagination :pageParams="pageParams" @change="getData"> </Pagination>
        </Bottoms>

        <el-dialog :title="dialog.title" v-model="dialog.visible" width="20%" append-to-body @close="closeDialog">
            <el-form :model="formData" ref="dialogRef" :rules="rules">
                <el-form-item prop="plateNumber" label="车牌">
                    <el-input v-model="formData.plateNumber" placeholder="请输入车牌号" class="input-with-select">
                        <template #prepend>
                            <el-select filterable v-model="formData.abbreviation" placeholder="Select">
                                <el-option v-for="item in province" :key="item" :label="item" :value="item" />
                            </el-select>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="类别" prop="type">
                    <el-radio-group v-model="formData.type">
                        <el-radio label="1">白名单</el-radio>
                        <el-radio label="2">黑名单</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>


            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="closeDialog">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, reactive, shallowRef, onBeforeMount } from "vue";
import { ElForm, ElMessage, ElMessageBox } from "element-plus";
import { havePerm } from '@/utils/perms'
import {
    getCarAstrict,
    addCarAstrict,
    delCarAstrict
} from "@/api/manager/white_ip";
const dialogRef = ref(ElForm);
const searchData = reactive({
    type: "",
    keywords: ""
}),
    statuList = shallowRef([{ label: "白名单", value: "1" }, { label: "黑名单", value: "2" }]),
    dialog = reactive({
        visible: false,
        title: "新增车牌"
    }),
    province = shallowRef(["京", "沪", "津", "渝", "冀", "豫", "云", "辽", "黑", "湘", "鲁", "新", "苏", "浙", "赣", "鄂", "桂", "甘", "晋", "蒙", "陕", "吉", "闽", "贵", "粤", "川", "青", "藏", "琼", "宁"]),
    formData = reactive({
        type: "1",
        abbreviation: "京",
        plateNumber: ""
    }),
    rules = ref({
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        plateNumber: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
    }),
    pageParams = ref({
        currentPage: 1,
        pageSize: +(localStorage.getItem("pageSize") || 10),
        total: 0,
    }),
    plateNumbers = shallowRef([]) as any

const handleChange = () => {
    pageParams.value.currentPage = 1
    getData()
}

const handleCar = () => {

}

const getData = () => {
    const { currentPage, pageSize } = pageParams.value;
    const datas = {
        pageNum: currentPage,
        pageSize
    }
    const data = { ...datas, ...searchData }
    getCarAstrict(data).then(res => {
        const result = res.data
        plateNumbers.value = result.list
        pageParams.value.total = result.total
    })

}

const delCar =  (id: string) => {
    ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(() => {
             delCarAstrict(id).then(()=>{
                 ElMessage.success("删除成功")
                 getData()
             })
        })
        .catch(() => ElMessage.info('已取消删除'));

}
const submitForm = () => {
    dialogRef.value.validate(async (isVaild: Boolean) => {
        if (isVaild) {
            const data = { ...formData }
            await addCarAstrict(data)
            closeDialog()
            getData()
        }
    })
}

const closeDialog = () => {
    dialogRef.value.resetFields();
    formData.abbreviation = '京'
    dialog.visible = false
}

onBeforeMount(() => {
    if(havePerm(['manager:ip:tab'])){
        getData()
    }
})
</script>
  
<style lang="scss" scope>
/*里面的代码可以根据自己需求去进行更改*/
/* 设置滚动条的样式 */
::-webkit-scrollbar {
    width: 5px;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
    border-radius: 10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
}

.el-row {
    height: auto;
    max-height: 100%;
    width: 100%;
    overflow: auto;
}

.single_card {
    margin: 5px 0;

    .font_number {
        font-size: 18px;
        font-weight: 550;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}

.el-input-group__prepend {
    width: 15%;
}
</style>
  