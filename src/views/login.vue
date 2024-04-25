<template>
  <div class="common-layout" v-if="Data.isShow">
    <div class="content">
      <div class="top">
        <div class="header">
          <img src="@/assets/img/logo.png" class="logo" alt="" />
        </div>
      </div>
      <div class="login">
        <el-form ref="loginForm" :model="Data.ruleForm" :rules="Data.rules" label-width="120px" class="demo-ruleForm" :size="'default'">
          <el-form-item label="用户名：" prop="username">
            <el-input placeholder="请输入用户名" v-model="Data.ruleForm.username" />
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input placeholder="请输入密码" v-model="Data.ruleForm.password" type="password" />
          </el-form-item>
          <el-form-item>
            <el-button :loading="Data.loading" type="primary" style="width: 100%" @click="submitForm(ruleForm)" @keydown.enter="enter_up()">{{ btnText }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores';
import { login } from '@/api/login';
const api = window.$api;
const userStore = useUserStore();
const router = useRouter();
const Data = reactive({
  isShow: true,
  ruleForm: {
    username: '',
    password: '',
  },
  rules: {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  },
  loading: false,
});

const loginForm = ref(null);

const btnText = computed(() => {
  return Data.loading ? '登录中' : '登录';
});

const submitForm = () => {
  Data.loading = true;
  loginForm.value.validate(async (valid) => {
    if (valid) {
      let data = {
        access_token:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX25hbWUiOiJsaXdnIiwiaXAiOiIxOTIuMTY4LjE1NS4xMTIiLCJpc3MiOiJQSVNYIiwiZXhwIjoxNzA3MTIwNDg1LCJpYXQiOjE3MDY1MTU2ODUsInRpbWVzdGFtcCI6ODZ9.zbeKlVrGYhtBkAXEmmq_c16TT7dXE4NnthbrrNhS4Sw',
        expires_in: '604800',
        userInfo: {
          thirdPartUser: 'project_user',
          realName: '李文广',
          roles: [
            {
              roleId: '1',
              userId: '939875554873769984',
              status: '0',
              groupId: null,
              groupName: null,
              roleName: '管理员',
              roleCode: '1',
            },
            {
              roleId: '882260153294729216',
              userId: '939875554873769984',
              status: '0',
              groupId: null,
              groupName: null,
              roleName: '项目经理',
              roleCode: 'ProjectManager',
            },
            {
              roleId: '929345846555398144',
              userId: '939875554873769984',
              status: '0',
              groupId: null,
              groupName: null,
              roleName: 'PMO团队',
              roleCode: 'ProjectManagementOffice',
            },
          ],
          language: 'zh_CN',
          id: '939875554873769984',
          isAdmin: true,
          username: 'liwg',
        },
      };
      setUserInfo(data);
      // router.push({ name: 'projectList' });
      router.push({ name: 'homePage' });
      // return;
      // await login(Data.ruleForm)
      //   .then((loginRes) => {
      //     if (loginRes.code === 200) {
      //       setUserInfo(loginRes.data);
      //       window.$message.success({
      //         message: '登录成功',
      //         duration: 1000,
      //       });
      //       _findMenuByUser(Data.ruleForm.username);
      Data.loading = false;
      // } else {
      //   window.$message.error(loginRes.message || loginRes.msg);
      // }
      //       Data.loading = false;
      //     })
      //     .catch((e) => {
      //       Data.loading = false;
      //       window.$message.error(e);
      //     });
    } else {
      Data.loading = false;
    }
  });
};

// 获取菜单权限
const _findMenuByUser = async (params) => {
  // 获取菜单权限
  await api.loginApi.findMenuByUser({ userName: params }).then((res) => {
    if (res.success) {
      console.log(res.data, 131);
      localStorage.setItem('menList', JSON.stringify(res.data));
    } else {
      window.$message.error(res.message);
    }
  });
  // 获取按钮权限
  await api.loginApi.findButtonByUser({ userName: params }).then((res) => {
    if (res.data.length) {
      let arr = [];
      arr = res.data.map((item) => {
        return item.path;
      });
      localStorage.setItem('buttonList', JSON.stringify(arr));
    } else {
      localStorage.setItem('buttonList', JSON.stringify(['a:a:a']));
    }
  });
  localStorage.setItem('singleProjectRole', JSON.stringify(['a:a:a']));
};

// 键盘事件
const enter_up = (e) => {
  if (e.keyCode == 13 && !Data.loading) {
    submitForm();
  }
};

onMounted(() => {
  //绑定监听事件
  window.addEventListener('keydown', enter_up);
});
onUnmounted(() => {
  //销毁事件
  window.removeEventListener('keydown', enter_up, false);
});

const setUserInfo = (data) => {
  window.$Cookies.set('authorToken', data.access_token);
  window.$Cookies.set('Admin-Token', data.access_token);
  userStore.login(data.userInfo);
};
</script>

<style lang="scss" scoped>
.common-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  background-color: #eee;
  background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg');
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: 110px;
  background-size: 100%;
  .content {
    padding: 32px 0;
    flex: 1;
    @media (min-width: 768px) {
      padding: 112px 0 24px;
    }

    .top {
      text-align: center;
      .header {
        height: 44px;
        line-height: 44px;
        a {
          text-decoration: none;
        }
        .logo {
          height: 44px;
          vertical-align: top;
        }
        .title {
          font-size: 33px;
          color: #000;
          font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }
      .desc {
        font-size: 14px;
        color: #000;
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }
    .login {
      width: 368px;
      margin: 20px auto;
      @media screen and (max-width: 576px) {
        width: 95%;
      }
      @media screen and (max-width: 320px) {
        .captcha-button {
          font-size: 14px;
        }
      }
      .icon {
        font-size: 24px;
        color: #000;
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #eee;
        }
      }
    }
  }
}
</style>
