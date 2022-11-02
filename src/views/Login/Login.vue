<!--
 * @Author: your name
 * @Date: 2022-02-09 14:40:34
 * @LastEditTime: 2022-02-22 14:33:37
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \ytjy\src\views\Login\Login.vue
-->

<template>
  <component :is="componentId">
    <template #default>
      <div class="login_box">
        <h1>登录/Login</h1>
        <el-form :model="state.formData" class="login_box_form" :rules="state.rules"
          @submit.prevent="loginSend(loginFrom)" ref="loginFrom">
          <!-- 用户名 -->
          <el-form-item prop="name">
            <el-input v-model="state.formData.name" placeholder="请输入用户名" autocomplete="off" maxlength="20" readonly
              :prefix-icon="Avatar"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            
            <el-input type="password" v-model="state.formData.password" placeholder="请输入密码" autocomplete="off" 
              maxlength="20" :prefix-icon="Key" :show-password="true"></el-input>
          </el-form-item>
          <!-- 验证码 -->
          <el-form-item prop="captcha" class="login_captcha">
            <el-input placeholder="验证码" :prefix-icon="Edit" v-model="state.formData.captcha" maxlength="3"></el-input>
            <el-image :src="state.captchaCode" @click="getCaptcha" title="点击刷新">
              <template #error>
                <el-icon :size="20">
                  <Loading />
                </el-icon>
              </template>
            </el-image>
          </el-form-item>
          <!-- 登录 -->
          <el-form-item class="login_btn">
            <el-button type="primary" :loading="state.loading" native-type="submit">{{ state.loading ? '登陆中' : '登录' }} 
            </el-button>
          </el-form-item> 
          <el-form-item prop="checked">
            <el-checkbox v-model="state.formData.checked">记住密码</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </component>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Login",
});
</script>
<script lang='ts' setup>
import { key } from '@/store'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { defineAsyncComponent, reactive, ref, getCurrentInstance } from "vue";
import { getCookie, setAllCookie, clearAllCookie } from "@/utils/cookie";
import { Avatar, Key, Edit, Loading } from "@element-plus/icons-vue";
import { getCaptchaCode } from "@/api/login";
import { getHoursTip } from '@/utils/date'
import type { ElForm } from 'element-plus'
const { proxy } = getCurrentInstance() as any

type FormInstance = InstanceType<typeof ElForm>
interface FormDatas {
  name: string,
  password: string,
  captcha: string,
  code_key: string,
  checked: boolean
}
const loginFrom = ref<FormInstance>()
const componentId = defineAsyncComponent(() => import("./rLogin.vue"));
const state = reactive({
  loading: false,
  loginFrom: null,
  componentId: "rLogin",
  formData: {
    name: "admin",
    password: "Aa123456!",
    captcha: "",
    code_key: "",
    checked: false,
  } as FormDatas,
  rules: {
    name: [
      { required: true, message: "请输入用户名或手机号", trigger: "change" },
    ],
    password: [
      { required: true, message: "请输入登录密码", trigger: "change" },
    ],
    captcha: [{ required: true, message: "请输入验证码", trigger: "change" }],
  },
  captchaCode: "",
});

const getCaptcha = () => {
  getCaptchaCode().then((res) => {
    state.formData.code_key = res.data.code_key;
    state.captchaCode = res.data.img;
  });
};
// getCaptcha();
const [store, router] = [useStore(), useRouter()]
const check = getCookie('checked') || false
if (check) {
  state.formData.name = getCookie('name')
  state.formData.password = getCookie('password')
  state.formData.checked = true
}

const loginSend = (elForm: FormInstance | undefined) => {
  elForm && elForm.validate(async valid => {
    try {
      const { checked, password, name } = state.formData
      if (checked) {
        setAllCookie({ name, password, checked })
      } else {
        clearAllCookie()
      }
      if (valid) {
        // state.loading = true
        // state.loading = false

        await store.dispatch("login/login", state.formData)

        const { accessedRoutes, defaultRoute } = await store.dispatch("routes/setAsyncRoutes")
        accessedRoutes.forEach((route: any) => router.addRoute(route));
        let path = defaultRoute ? defaultRoute.path : '/'
        router.replace({ path })
        setTimeout(() => {
          proxy.$notify.success({
            title: `${getHoursTip()}好`,
            message: store.getters['login/userInfo'].name + `, 欢迎登录`
          })
        }, 1000);
      }

    } catch (error) {
      console.log(error);

    }
  })
};
</script>
