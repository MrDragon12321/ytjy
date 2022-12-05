<template>
    <div class="container">
        <SearchBars>
            <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                <el-form-item prop="name" label="关键字">
                    <el-input v-model="queryParams.keywords" placeholder="角色名称" clearable @input="handleQuery" />
                </el-form-item>

                <el-form-item>
                    <!-- <el-button type="primary" @click="handleRole">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        <span>新增</span>
                    </el-button> -->
                    <!-- <el-button type="danger" @click="deleteRole">
                        <el-icon>
                            <Delete />
                        </el-icon>
                        <span>删除</span>
                    </el-button> -->
                </el-form-item>
            </el-form>
        </SearchBars>
        <Lists>
            <el-table ref="dataTableRef" :data="roleList" @selection-change="handleSelectionChange"
                @row-click="handleRowClick" highlight-current-row border header-row-class-name="header-style"
                :header-cell-style="{ background: '#eef1f6', textAlign: 'center', 'fontSize': '8px', border: '1px #e7e7eb solid' }"
                :cell-style="{ textAlign: 'center', fontSize: '12px', border: '1px #e7e7eb solid' }" row-key="id">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="角色名称" prop="name" />
                <el-table-column label="角色编码" prop="code" />
                <el-table-column label="操作" align="left" v-hasPerm="['system:role:updatetree']">
                    <template #default="scope">
                        <el-button type="success" link @click.stop="showRoleMenuDialog(scope.row)" >
                            资源分配
                        </el-button>

                        <!-- <el-button type="primary" link @click.stop="handleUpdate(scope.row.roleid)">
                            编辑
                        </el-button> -->
                    </template>
                </el-table-column>
            </el-table>
        </Lists>
        <Bottoms>
            <Pagination :pageParams="pageParams" @change="getData"> </Pagination>
        </Bottoms>
        <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" destroy-on-close @close="closeDialog">
            <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入角色名称" />
                </el-form-item>

                <el-form-item label="角色编码" prop="code">
                    <el-input v-model="formData.code" placeholder="请输入角色编码" />
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="formData.description" placeholder="角色描述" />
                </el-form-item>


            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitFormData">确 定</el-button>
                    <el-button @click="dialog.visible = false">取 消</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- assign permission dialog -->
        <el-dialog :title="'【' + checkedRole.name + '】资源分配'" v-model="menuDialogVisible" width="800px">
            <el-scrollbar max-height="600px">
                <el-tree ref="resourceRef" node-key="value" show-checkbox :data="resourceOptions"
                    :default-expand-all="true">
                    <template #default="{ data }">
                        {{ data.label }}
                    </template>
                </el-tree>
            </el-scrollbar>

            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="handleRoleResourceSubmit">确 定</el-button>
                    <el-button @click=" menuDialogVisible = false">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, onBeforeMount, reactive, toRefs, nextTick } from "vue";
import { ElForm, ElMessage, ElMessageBox, ElTree } from 'element-plus';
import {
    getRoleList,
    updateRole,
    detailRole,
    getSources,
    getRoles,
    addRole,
    getRoleMenus,
    roleSources
} from "@/api/system/role";
import { Role, RoleForm, RoleQuery } from '@/types/role';
import { havePerm } from "@/utils/perms";
const dataFormRef = ref(ElForm);
const resourceRef = ref(ElTree);
const state = reactive({
    loading: true,
    // 选中ID
    ids: [] as number[],
    queryParams: {
        keywords: ""
    } as RoleQuery,
    roleList: [] as Role[],
    total: 0,
    dialog: {
        title: '',
        visible: false
    },
    formData: {
        name: "",
        code: "",
        description: ""
    } as RoleForm,
    rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
        description: [{ required: true, message: '请描述', trigger: 'blur' }]
    },
    menuDialogVisible: false,
    resourceOptions: [],
    btnPerms: {} as any,
    // 勾选的菜单ID
    checkedMenuIds: new Set([]),
    allPermIds: [] as string[],
    // 选中的角色
    checkedRole: {
        id: '',
        name: ''
    }
});
const pageParams = ref({
    currentPage: 1,
    pageSize: +(localStorage.getItem("pageSize") || 10),
    total: 0,
});
const {
    ids,
    loading,
    queryParams,
    roleList,
    total,
    dialog,
    formData,
    rules,
    menuDialogVisible,
    checkedRole,
    resourceOptions
} = toRefs(state);

const handleRole = () => {
    dialog.value = {
        title: '添加角色',
        visible: true
    };
}
const handleQuery = () => {
    pageParams.value.currentPage = 1
    getData()
}

const handleSelectionChange = () => {

}
const showRoleMenuDialog = async (row: any) => {
    menuDialogVisible.value = true;
    const roleId: any = row.roleid;
    checkedRole.value = {
        id: roleId,
        name: row.name
    };
    resourceOptions.value = await getSources() as any
    getRoleMenus(roleId).then((res: any) => {
        // 勾选回显
        const checkedMenuIds = res;
        checkedMenuIds.forEach((menuId: any) =>
            resourceRef.value.setChecked(menuId, true)
        );

        loading.value = false;
    });
}

const handleUpdate = (val: any) => {
    dialog.value = {
        title: '修改角色',
        visible: true
    };
    detailRole(val).then((res: any) => {
        nextTick().then(res2 => {
            state.formData = res || []
            // console.log(state.formData, 'zzl');
        })

    })
}

const getData = () => {

    const data = { ...queryParams.value, ...{ pageSize: pageParams.value.pageSize, pageNum: pageParams.value.currentPage } }
    // var data = new FormData()
    // data.append("keywords", queryParams.value.keywords||'')
    // data.append("pageSize", pageParams.value.pageSize+"")
    // data.append("pageNum", pageParams.value.currentPage+"")
    getRoleList(data).then((res: any) => {
        state.roleList = res.records || [];
        pageParams.value.total = res.total;
    })


}
const submitFormData = () => {
    dataFormRef.value.validate((valid: any) => {
        if (valid) {
            if (formData.value.roleid) {
                const data = { ...formData.value }
                updateRole(formData.value.roleid, data)
            } else {
                addRole(state.formData).then(() => {
                    closeDialog();
                    ElMessage.success('新增角色成功');
                    handleQuery();
                    loading.value = false;
                });
            }

        }

    })
}
const closeDialog = () => {


    dialog.value.visible = false;
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();
    state.formData.roleid = ""
    // console.log(state.formData, '12312');
}
const handleRowClick = () => {

}
const handleRoleResourceSubmit = () => {
    const checkedMenuIds: number[] = resourceRef.value
        .getCheckedNodes(false, true)
        .map((node: any) => node.value);
  
    roleSources(checkedRole.value.id, checkedMenuIds).then(res => {
        ElMessage.success('分配权限成功');
        getData()
    });
    menuDialogVisible.value=false
}


onBeforeMount(() => {
if(havePerm(['system:role:tab'])){
    getData()
}

});

</script>
  
<style lang="scss">

</style>
  