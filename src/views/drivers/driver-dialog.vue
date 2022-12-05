<template>
    <el-dialog destroy-on-close append-to-body v-model="dialogOptions.visible" :title="dialogOptions.title" width="30%"
        draggable>
        <el-form class="form-wrap" :model="formData" label-width="90px" ref="elFormRef" :rules="rules">
            <el-form-item prop="facid" label="服务商">
                <el-select v-model="formData.facid" filterable placeholder="请选择服务商" clearable>
                    <el-option v-for="item in serviceItemList" :key="item.prvFid" :label="item.prvName"
                        :value="item.prvFid">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="driverName" label="技师姓名">
                <el-input v-model="formData.driverName" placeholder="请输入姓名" clearable>
                </el-input>
            </el-form-item>
            <el-form-item prop="phone" label="手机号">
                <el-input v-model="formData.phone" placeholder="输入11位手机号" maxlength="11" clearable>
                </el-input>
            </el-form-item>
            <el-form-item prop="carNumber" label="车牌号">
                <el-input v-model="formData.carNumber" placeholder="请输入车牌号" clearable>
                </el-input>
            </el-form-item>

            <el-form-item prop="address" label="地址">
                <el-input v-model="formData.address" ref="inputRef" id="yt_input" placeholder="输入地址" clearable>
                </el-input>
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" plain @click="handleClose(true, elFormRef)">取消</el-button>
                <el-button type="primary" @click="handleSubmit(elFormRef)">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import AMapLoader from '@amap/amap-jsapi-loader';
import { watch, ref, getCurrentInstance, onBeforeMount, shallowRef, onMounted, nextTick } from 'vue'
import type { TypeObject, TypeFunc, DialogOptions, ElFormRules } from '@/types/global'
import type { ApiParams } from '@/types/api'
import { validatePhone } from '@/utils/form'
import { deepAssign, getArea } from '@/utils/util'
import { havePerm } from '@/utils/perms'
import type { ElForm } from 'element-plus'
import {
    ServiceDriver,
    updateDriver,
    addDriver
} from "@/api/driver";
type FormInstance = InstanceType<typeof ElForm>

interface Props { options: DialogOptions }
const props = defineProps<Props>()
const emit = defineEmits(['reset', 'update'])
const { proxy } = getCurrentInstance() as any
const elFormRef = ref<FormInstance>(),
    dialogOptions = ref<DialogOptions>({ visible: false, title: '', type: '' }),
    formData = ref<TypeObject>({
        facid: "",
        province: "",
        city: "",
        longitude: "",
        latitude: "",
        phone: "",
        carNumber: "",
        driverName: "",
        address: ""
    }),
    serviceItemList = shallowRef<TypeObject>([]),
    provinceItemList = shallowRef<TypeObject>([]),
    cityItemList = shallowRef<TypeObject>([])
const inputRef = ref()

const aMap = shallowRef(null)

var province = "", city = "", country = "", lng = "", lat = "", address = ""
const initMap = () => {
    AMapLoader.load({
        key: "96782a5928bf2f159f3c789d4707d5d7",             // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "1.4.15",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        // plugins: ['AMap.Autocomplete'],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    }).then((AMap) => {
        aMap.value = AMap
        AMap.plugin(['AMap.Autocomplete', 'AMap.Geocoder'], function () {
            // 实例化Autocomplete
            var autoOptions = {
                //city 限定城市，默认全国
                city: '全国',
                input: document.getElementById('yt_input')
            }
            var geocoder = new AMap.Geocoder({
                city: "010", //城市设为北京，默认：“全国”
                radius: 1000 //范围，默认：500
            });
            var auto = new AMap.Autocomplete(autoOptions);
            AMap.event.addListener(auto, "select", function (e: any) {
                lng = e.poi.location.lng
                lat = e.poi.location.lat
                formData.value.address = e.poi.name 
                geocoder.getAddress([lng, lat], function (status: any, result: any) {
                    if (status === 'complete' && result.regeocode) {
                        var res = result.regeocode.addressComponent
                        province = res.province
                        city = res.city
                        country = res.district
                    } else {
                        console.error('根据经纬度查询地址失败')
                    }
                });

            });
        })


    }).catch(e => {
        console.log(e);
    })
}
const rules = ref<ElFormRules>({
    "facid": [
        { required: true, message: '服务商不能为空', trigger: 'change' }
    ],
    "driverName": [
        { required: true, message: '技师姓名不能为空', trigger: 'blur' }
    ],
    "phone": [
        { required: true, message: '手机号不能为空', trigger: 'blur' },
        { validator: validatePhone, trigger: 'blur' }
    ],
    "carNumber": [
        { required: true, message: '车牌号不能为空', trigger: 'blur' }
    ],
    "address": [
        { required: true, message: '详细地址不能为空', trigger: 'blur' }
    ]
})
watch(
    () => props.options,
    val => {
        dialogOptions.value.visible = val.visible
        dialogOptions.value.type = val.type
        dialogOptions.value.title = val.row ? '编辑虚拟司机' : '新增虚拟司机'
        formData.value = deepAssign({}, val.row ?? {})
        province = formData.value.province ? formData.value.province : ""
        city = formData.value.city ? formData.value.city : ""
        lng = formData.value.longitude ? formData.value.longitude : ""
        lat = formData.value.latitude ? formData.value.latitude : ""
        initMap()



    }
)

const handleSubmit = (elForm: FormInstance | undefined) => {


    // const { Province, City, Country } = add
    if (!elForm) return
    elForm.validate(valid => {
        if (!valid) return
        if (formData.value['id']) { // 编辑
            const newFormData = {
                id: formData.value.id,
                facid: formData.value.facid,
                province: province,
                city: city,
                longitude: lng,
                latitude: lat,
                phone: formData.value.phone,
                carNumber: formData.value.carNumber,
                driverName: formData.value.driverName,
                address: formData.value.address

            } as ApiParams
            updateDriver(newFormData).then(() => {
                proxy.$message.success("虚拟司机编辑成功")
                emit('update')
                handleClose(false)
            }).catch(error => {
                error && proxy.$message.error(`${error}`)
            })
        } else { // 新增
            const newFormData = {
                facid: formData.value.facid,
                province: province,
                city: city,
                longitude: lng,
                latitude: lat,
                phone: formData.value.phone,
                carNumber: formData.value.carNumber,
                driverName: formData.value.driverName,
                address: formData.value.address

            } as ApiParams
            addDriver(newFormData).then(() => {
                proxy.$message.success("虚拟司机添加成功")
                emit("update")
                handleClose(true, elForm)
            }).catch(error => {
                error && proxy.$message.error(`${error}`)
            })
        }
    })
}



const handleClose = function (reset = true, elForm?: FormInstance | undefined) {
    reset && elForm!.resetFields()
    emit('reset')
    dialogOptions.value.visible = false
}
const getService = () => {
    ServiceDriver().then(res => {
        serviceItemList.value = res

    })
}

onBeforeMount(() => {
    if(havePerm(['drivers:driver:service'])){
        getService()
    }
})

</script>
<style>
.amap-sug-result {
    z-index: 100000 !important;
}
</style>