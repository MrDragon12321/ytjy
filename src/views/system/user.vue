<template>
    <div class="container">
        <SearchBars>
            <el-form ref="queryFormRef" :model="state.queryParams" :inline="true">
                <el-form-item prop="name" label="关键字">
                    <el-input v-model="state.queryParams.keywords" placeholder="关键字" clearable @input="handleQuery" />
                </el-form-item>

                <el-form-item label="状态" prop="status">
                    <el-select v-model="state.queryParams.status" placeholder="状态" clearable @change="handleQuery">
                        <el-option label="在职" value="1" />
                        <el-option label="离职" value="0" />
                    </el-select>
                </el-form-item>
            </el-form>
        </SearchBars>
        <Lists>
            <el-table :data="state.userList" highlight-current-row border header-row-class-name="header-style"
                :header-cell-style="{ background: '#eef1f6', 'fontSize': '8px', border: '1px #e7e7eb solid' }"
                :cell-style="{ fontSize: '12px', border: '1px #e7e7eb solid' }" row-key="id">
                <el-table-column key="id" label="编号" align="center" prop="id" />
                <el-table-column label="用户名" width="120" align="center" prop="nickname" />
                <el-table-column label="登录名" align="center" prop="username" />
                <el-table-column label="手机号码" align="center" prop="phone" />
                <el-table-column label="用户角色" align="center" prop="roleNames">
                    <template #default="scope">
                        <el-tooltip class="box-item" effect="dark" :content="scope.row.roleNames.join(',')"
                            placement="top" v-if="scope.row.roleNames.length > 1">
                            <span>{{ scope.row.roleNames.length != 0 ? scope.row.roleNames[0] : "" }}{{
                                    scope.row.roleNames.length > 1 ? '......' : ''
                            }}</span>
                        </el-tooltip>
                        <span v-else>{{ scope.row.roleNames[0] ? scope.row.roleNames[0] : "" }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center" prop="status">
                    <template #default="scope">
                        <div :style="{ 'color': scope.row.status == 1 ? 'green' : 'red' }">{{ scope.row.status == 1 ?
                                "在职"
                                : "离职"
                        }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>

                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <el-button type="success" link @click="resetPassword(scope.row)"
                            v-hasPerm="['system:user:reset']">重置密码</el-button>
                        <el-button type="primary" link @click="handleUpdate(scope.row)"
                            v-hasPerm="['system:user:edit']">编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </Lists>
        <Bottoms>
            <Pagination :pageParams="pageParams" @change="getData"> </Pagination>
        </Bottoms>

        <el-dialog :title="state.dialog.title" v-model="state.dialog.visible" width="30%" append-to-body
            @close="closeDialog">
            <el-form ref="dataFormRef" :rules="state.rules" :model="state.formData" label-width="80px">
                <el-form-item label="角色" prop="roleIds">
                    <el-select-v2 v-model="state.formData.roleIds" :options="state.roleOptions" multiple filterable
                        placeholder="请选择" style="width:90%">
                        <!-- <el-option v-for="item in state.roleOptions" :key="item.value" :label="item.label"
                            :value="item.value" /> -->
                    </el-select-v2>
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
import { ref, onBeforeMount, reactive, nextTick } from "vue";
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import {
    getUser,
    updateUserPassword,
    getRoles,
    updateUser,
    getUserForm
} from "@/api/system/user";
import { havePerm } from "@/utils/perms";
const dataFormRef = ref(ElForm); // 用户表单
const state = reactive({
    queryParams: {
        keywords: "",
        status: ""
    },
    userList: [],
    id: "",
    dialog: {
        visible: false,
        title: "修改用户角色"
    },
    formData: {
        roleIds: [] as number[],
        id: ""
    },
    roleOptions: [] as any,
    rules: {
        roleIds: [{ required: true, message: '用户角色不能为空', trigger: 'blur' }]
    },
});
const pageParams = ref({
    currentPage: 1,
    pageSize: +(localStorage.getItem("pageSize") || 10),
    total: 0,
});


const handleQuery = () => {
    pageParams.value.currentPage = 1
    getData()
}

const getData = () => {
    const data = { ...state.queryParams, ...{ pageSize: pageParams.value.pageSize, pageNum: pageParams.value.currentPage } }
    getUser(data).then((res: any) => {

        state.userList = res.data.list || [];
        pageParams.value.total = res.data.total;
    })

}

const resetPassword = (row: { [key: string]: any }) => {
    ElMessageBox.prompt(
        '请输入用户「' + row.username + '」的新密码',
        '重置密码',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    )
        .then(({ value }) => {
            if (!value) {
                ElMessage.warning('请输入新密码');
                return false;
            }
            updateUserPassword(row.id, { 'password': value }).then(() => {
                ElMessage.success('密码重置成功，新密码是：' + value);
            });
        })
        .catch(() => { });
}



const handleUpdate = async (row: { [key: string]: any }) => {
    state.dialog = {
        title: '修改用户角色',
        visible: true
    };
    const role = await getRoles(row.id) as any




    var user_role = {
        id: "",
        roleIds: [],
        levels: []
    } as any
    // state.roleOptions
    await getUserForm(row.id).then((res: any) => {
        if (res.length != 0) {
            res.forEach((v: any) => {
                user_role["id"] = v.userid
                user_role['roleIds'].push(v.roleid)
                user_role['levels'].push({ level: v.level, roleName: v.roleName })
            })
        }
        nextTick(() => {
            state.formData = user_role;
        })
    });

    const flag = user_role['levels'].find((f: any) => {
        return f.level == 1
    })
    state.roleOptions = role.map((v: any) => {
        return { 'label': v.label, 'value': v.value, 'disabled': v.label == flag?.roleName }
    })
    // state.roleOptions = role.filter((v: any) => {
    //     return v.label!='超级管理员'
    // })

}

const submitForm = () => {
    dataFormRef.value.validate((valid: any) => {
        if (valid) {
            const userId = state.formData.id;
            if (userId) {
                updateUser(userId, state.formData).then(() => {
                    ElMessage.success('修改用户成功');
                    closeDialog();
                    handleQuery();
                });
            }
        }
    });
}


const closeDialog = () => {
    state.dialog.visible = false;
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();
}

onBeforeMount(() => {
if(havePerm(['system:user:tab'])){
    getData()
}

});

</script>
  
<style lang="scss">

</style>
  