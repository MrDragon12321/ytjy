<template>
    <div class="container">
        <SearchBars>
            <el-form :inline="true">
                <el-form-item prop="keywords" label="关键字:">
                    <el-input v-model="searchData.keywords" placeholder="关键字" clearable @input="handleSearch">
                    </el-input>
                </el-form-item>
                <el-form-item prop="status" label="状态:">
                    <el-select v-model="searchData.status" filterable placeholder="请选择状态" clearable
                        @change="handleSearch">
                        <el-option v-for="item in statusItemList" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleMenu('add')" v-hasPerm="['system:menu:add']">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        <span>新增</span>
                    </el-button>
                    <el-button type="danger" @click="handleMenu('del')" v-hasPerm="['system:menu:del']">
                        <el-icon>
                            <Delete />
                        </el-icon>
                        <span>批量删除</span>
                    </el-button>
                </el-form-item>
            </el-form>
        </SearchBars>
        <!-- default-expand-all -->
        <Lists> 
            <el-table :data="tableData" border header-row-class-name="header-style"
                :header-cell-style="{ background: '#eef1f6', 'fontSize': '8px', border: '1px #e7e7eb solid' }"
                :cell-style="{ fontSize: '12px', border: '1px #e7e7eb solid' }" row-key="id" :indent=30
                @selection-change="handleSelectionChange" @select="selectChange"
                @select-all="selectAllChange" ref="multiTable"  default-expand-all>
                <el-table-column type="selection" width="55" />
                <el-table-column label="菜单名称" prop="name" width="250" align="left"></el-table-column>
                <el-table-column label="菜单类型" align="center" width="150">
                    <template #default="scope">
                        <el-tag v-if="scope.row.type === 'CATALOG'" type="warning">目录</el-tag>
                        <el-tag v-if="scope.row.type === 'MENU'" type="success">菜单</el-tag>
                        <el-tag v-if="scope.row.type === 'BUTTON'" type="danger">事件</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="权限标识" align="center" prop="perm" />

                <el-table-column label="状态" align="center" width="150">
                    <template #default="scope">
                        <el-tag v-if="scope.row.visible === 1" type="success">显示</el-tag>
                        <el-tag v-else type="info">隐藏</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="排序" align="center" prop="sort" width="150" />
                <el-table-column label="后端API" align="center" prop="apiPath" width="400" />



                <el-table-column label="操作" align="center" width="200">
                    <template #default="scope">
                        <el-button type="success" link @click.stop="handleMenu('add', scope.row.id)"
                            v-if="scope.row.type == 'CATALOG' || scope.row.type == 'MENU'" v-hasPerm="['system:menu:add']">
                            新增
                        </el-button>

                        <el-button type="primary" link @click.stop="handleMenu('edit', scope.row.id)" v-hasPerm="['system:menu:update']">
                            编辑
                        </el-button>
                        <el-button type="danger" link @click.stop="handleMenu('del', scope.row.id)" v-hasPerm="['system:menu:del']">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </Lists>
        <el-dialog :title="dialog.title" v-model="dialog.visible" @close="cancel" width="30%" :destroy-on-close="true">
            <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
                <el-form-item label="菜单类型" prop="type">
                    <el-radio-group v-model="formData.type" @change="handleMenuTypeChange">
                        <el-radio label="CATALOG">目录</el-radio>
                        <el-radio label="MENU">菜单</el-radio>
                        <el-radio label="BUTTON">事件</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="父级菜单" prop="parentId">
                    <el-tree-select v-model="formData.parentId" placeholder="选择上级菜单" :data="menuOptions" filterable
                        check-strictly :render-after-expand="false" />
                </el-form-item>
                <el-form-item :label="formData.type == 'BUTTON' ? '事件名称' : '菜单名称'" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入名称(至多9个字)" maxlength="9" />
                </el-form-item>

                <el-form-item label="菜单简称" prop="abbreviation" v-if="formData.type == 'MENU'">
                    <el-input v-model="formData.abbreviation" placeholder="请输入简称(至多5个字)" maxlength="5" />
                </el-form-item>

                <el-form-item label="路由路径" prop="path" v-if="formData.type == 'CATALOG' || formData.type == 'MENU'">
                    <el-input v-if="formData.type == 'CATALOG'" v-model="formData.path"
                        placeholder="/system  (目录以/开头)" />
                    <el-input v-else v-model="formData.path" placeholder="user" />
                </el-form-item>

                <!-- 组件页面完整路径 -->
                <el-form-item v-if="formData.type == 'MENU'" label="页面路径" prop="component">
                    <el-input v-model="formData.component" placeholder="system/user/index">
                        <template v-if="formData.parentId != '0'" #prepend>src/views</template>
                        <template v-if="formData.parentId != '0'" #append>.vue</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="跳转路由" v-if="formData.type == 'CATALOG'">
                    <el-input v-model="formData.redirect" placeholder="跳转路由" />
                </el-form-item>


                <!-- 权限标识 -->
                <el-form-item v-if="formData.type == 'BUTTON'" label="权限标识" prop="perm">
                    <el-input v-model="formData.perm" placeholder="sys:user:add" />
                </el-form-item>

                <el-form-item label="图标" prop="icon" v-if="formData.type !== 'BUTTON'">
                    <el-select v-model="formData.icon" placeholder="请选择图标" filterable>
                        <el-option v-for="item in icons" :key="item" :label="item" :value="item">
                            <component :is="item" style="width:20px;height:20px;margin-right: 10px;"></component>
                            <span>{{ item }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>



                <el-form-item label="状态" v-if="formData.type !== 'BUTTON'">
                    <el-radio-group v-model="formData.visible">
                        <el-radio :label="1">显示</el-radio>
                        <el-radio :label="0">隐藏</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="后端API" v-if="formData.type == 'BUTTON'" prop="apiPath">

                    <el-input v-model="formData.apiPath" placeholder="/api/v/1">
                        <template #prepend>
                            <el-select v-model="formData.select" placeholder="请求方式" style="width: 115px">
                                <el-option label="POST" value="POST" />
                                <el-option label="GET" value="GET" />
                                <el-option label="PUT" value="PUT" />
                                <el-option label="DELETE" value="DELETE" />
                                <el-option label="UPDATE" value="UPDATE" />
                                <el-option label="PATCH" value="PATCH" />
                            </el-select>
                        </template>
                    </el-input>
                </el-form-item>


                <el-form-item label="排序" prop="sort">
                    <el-input-number v-model="formData.sort" style="width: 100px" controls-position="right" :min="0" />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, onBeforeMount, reactive, toRefs, nextTick } from "vue";
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { havePerm } from '@/utils/perms'
import {
    getOptions,
    getMenuList,
    getMenuItem,
    deleteMenuItem,
    updateMenuItem,
    addMenuItem
} from "@/api/system/menu";
import { MenuForm, DialogType } from '@/types/menu'
import { ElForm, ElMessageBox, ElMessage } from "element-plus";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { RouteRecord } from 'vue-router'
const [$store, $router] = [useStore(), useRouter()]
const icons = ref([...Object.keys(ElementPlusIconsVue)])
const dataFormRef = ref(ElForm);
const state = reactive({
    searchData: {
        keywords: "",
        status: ""
    },

    // 选中ID数组
    ids: [],
    // 非单个禁用
    single: true,
    // 非多个禁用
    multiple: true,
    dialog: { visible: false } as DialogType,
    formData: {
        select: "",
        parentId: '',
        apiPath: '',
        name: '',
        visible: 1,
        sort: 1,
        abbreviation: "",
        component: undefined,
        type: 'MENU',
        perm: "",
        redirect: ""
    } as MenuForm,
    statusItemList: [{
        label: "显示",
        value: "1"
    }, {
        label: "隐藏",
        value: "0"
    }],
    rules: {
        parentId: [{ required: true, message: '请选择顶级菜单', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        abbreviation: [{ required: true, message: '请输入简称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
        path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
        select: [{ required: true, message: '请选择', trigger: 'blur' }],
        apiPath: [{ required: true, message: '请输入后端api', trigger: 'blur' }],
        component: [
            { required: true, message: '请输入组件完整路径', trigger: 'blur' }
        ]
    },
    tableData: [],
    menuOptions: [] as any,
    currentRow: undefined,
    multipleStr: "",
    type: "" as String,
    id: '' as String
});

var {
    searchData,
    dialog,
    formData,
    rules,
    menuOptions,
    tableData,
    statusItemList,
    multipleStr,
} = toRefs(state);

const getDataId = (data: any) => {
    return data['id']
}

const multiTable = ref<any>(null);
const selectChange = (selection: any, row: any) => {
    // 如果selection中存在row代表是选中，否则是取消选中
    if (selection.find((val: any) => { return getDataId(val) === getDataId(row) })) {
        if (row.children) {//注意这里的children是后台返回数据的children字段
            row.children.forEach((val: any) => {
                multiTable.value.toggleRowSelection(val, true)
                selection.push(val)
                if (val.children) {
                    selectChange(selection, val)
                }
            })
        }
    } else {
        toggleRowSelection(selection, row)
    }
}

const toggleRowSelection = (selection: any, data: any) => {
    if (data.children) {//注意这里的children也是后台返回数据的children字段
        data.children.forEach((val: any) => {
            multiTable.value.toggleRowSelection(val, false)
            if (val.children) {
                toggleRowSelection(selection, val)
            }
        })
    }
}

const selectAllChange = (selection: any) => {
    // 如果选中的数目与请求到的数目相同就选中子节点，否则就清空选中
    if (selection && selection.length === tableData.value.length) {
        selection.forEach((val: any) => {
            selectChange(selection, val)
        })
    } else {
        multiTable.value.clearSelection()
    }
}

const handleSelectionChange = (val: any) => {
    var select = [] as string[]
    val.forEach((v: any) => {
        select.push(v.id)
    })
    multipleStr.value = select.join(',')


}

const handleMenuTypeChange = () => {

}

const handleSearch = () => {
    getData()
}

const cancel = () => {

    dataFormRef.value.resetFields();
    formData.value.select = ""
    state.dialog.visible = false;
}

const reload =async () => {
    const { accessedRoutes, defaultRoute } = await $store.dispatch("routes/setAsyncRoutes")
    accessedRoutes.forEach((route: any) => $router.addRoute(route));
    $store.dispatch("routes/setIsShow", false)
    nextTick(()=>{
        $store.dispatch("routes/setIsShow", true)
    })
}

const submitForm = () => {
    dataFormRef.value.validate(async (isVaild: Boolean) => {
        if (isVaild) {
            if (formData.value.apiPath) {
                if (!formData.value.select) {
                    ElMessage.error('请选择请求方式！！！');
                    return
                }
            }
            formData.value.apiPath = formData.value.apiPath ? `${formData.value.select}:${formData.value.apiPath}` : ""

            var data = { ...formData.value }
            var t = state.type
            try {
                if (t == 'add') {
                    await addMenuItem(data)
                } else if (t == 'edit') {
                    await updateMenuItem(state.id, data)
                }
            } finally {
                cancel()
                getData()
                reload()




                // console.log(accessedRoutes, defaultRoute,'sdfsdfsdfs?????>>>>>>>>>>>>');

                // let path = defaultRoute ? defaultRoute.path : '/'
                // $router.replace({ path })
                // $router.go(0)
            }
            state.id = ""
        }
    })



}

const getData = () => {
    const data = { ...searchData.value }
    // var formdata = new FormData()
    // formdata.append('keywords', da.keywords)
    // formdata.append('status', da.status)
    getMenuList(data).then((res: any) => {
        tableData.value = res || []
    })

};


/**
 * 加载菜单下拉树
 */
async function loadMenuData() {

    const menuOptions: any[] = [];
    await getOptions().then((data) => {
        const menuOption = { value: 0, label: '顶级菜单', children: data };
        menuOptions.push(menuOption);
        state.menuOptions = menuOptions;
    });
}



const handleMenu = async (type: String, value?: any) => {

    state.id = value || ""
    // var formdata = new FormData()
    // formdata.append('id', value)
    state.type = type
    formData.value = {
        select: "",
        parentId: value || "",
        apiPath: '',
        name: '',
        visible: 1,
        sort: 1,
        abbreviation: "",
        component: "",
        type: 'MENU',
        perm: "",
        redirect: ""
    } as MenuForm
    switch (type) {
        case 'add':
            await loadMenuData();
            dialog.value = { visible: true, title: "新增" }
            break;
        case 'edit':
            await loadMenuData();
            dialog.value = { visible: true, title: "编辑" }
            getMenuItem(value).then((res: any) => {

                if (res.apiPath) {
                    const path = res.apiPath.split(':')
                    res.select = path[0]
                    res.apiPath = path[1]
                } else {
                    res.select = ''
                    res.apiPath = ''
                }
                nextTick().then(res2 => {
                    formData.value = res;
                })
            })
            break;
        case 'del':
            if (value || multipleStr.value) {
                ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        value = value || multipleStr.value
                        deleteMenuItem(value).then(() => {
                            ElMessage.success('删除成功');
                            getData()
                            reload()
                        });
                    })
                    .catch(() => ElMessage.info('已取消删除'));

            } else {
                ElMessage.error('请选择至少一项！！！');
            }
            break
        default:
            return

    }

}


onBeforeMount(() => {
    if(havePerm(['system:menu:tab'])){
        getData()
    }
});
</script>
  
<style lang="scss">

</style>
  