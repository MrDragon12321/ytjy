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
          <el-form-item prop="username">
            <el-input v-model="state.formData.username" placeholder="请输入用户名" autocomplete="off" maxlength="20"
              :prefix-icon="Avatar"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">

            <el-input type="password" v-model="state.formData.password" placeholder="请输入密码" autocomplete="off"
              maxlength="20" :prefix-icon="Key" :show-password="true"></el-input>
          </el-form-item>
          <!-- 验证码 -->
          <el-form-item prop="verifyCode" class="login_captcha">
            <el-input placeholder="验证码" :prefix-icon="Edit" v-model="state.formData.verifyCode" maxlength="3">
            </el-input>
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
const [store, router] = [useStore(), useRouter()]
type FormInstance = InstanceType<typeof ElForm>
interface FormDatas {
  username: string,
  password: string,
  verifyCode: string,
  verifyKey: string,
  checked: boolean
}
const loginFrom = ref<FormInstance>()
const componentId = defineAsyncComponent(() => import("./rLogin.vue"));
const state = reactive({
  loading: false,
  loginFrom: null,
  componentId: "rLogin",
  formData: {
    grant_type: "captcha",
    username: "",
    password: "",
    verifyCode: "",
    verifyKey: "",
    checked: false,
  } as any,
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
  getCaptchaCode().then((res: any) => {
    state.formData.verifyKey = res.uuid;
    state.captchaCode = res.img;

  });
};
getCaptcha();

const check = getCookie('checked') || false
if (check) {
  state.formData.username = getCookie('username')
  state.formData.password = getCookie('password')
  state.formData.checked = true
}

const loginSend = (elForm: FormInstance | undefined) => {
  elForm && elForm.validate(async valid => {
    try {
      const { checked, password, username } = state.formData
      if (checked) {
        setAllCookie({ username, password, checked })
      } else {
        clearAllCookie()
      }
      if (valid) {
        // state.loading = true
        // state.loading = false
        var da = state.formData
        const formData = new FormData();
        Object.keys(da).forEach((key) => {
          formData.append(key, da[key]);
        });
        try {
          await store.dispatch("login/login", formData)

          
          const { accessedRoutes, defaultRoute } = await store.dispatch("routes/setAsyncRoutes")
          accessedRoutes.forEach((route: any) => router.addRoute(route));
          let path = defaultRoute ? defaultRoute.path : '/'
          router.replace({ path })
          if (accessedRoutes.length > 0) {
            setTimeout(() => {
              proxy.$notify.success({
                title: `${getHoursTip()}好`,
                message: store.getters['login/userInfo'].username + `, 欢迎登录元通救援平台`
              })
            }, 1000);
          } else {
            store.dispatch('login/logout').then(() => {
              router.push({ path: '/login' })
              proxy.$message.error("当前用户无权访问！！！")
            }).catch((error: any) => {
              error && proxy.$message.error(`${error}`)
            })
          }
        } catch (error) {
          getCaptcha();
          state.formData.verifyCode = ''
        }

      }

    } catch (error) {
      console.log(error);

    }
  })
};
</script>
