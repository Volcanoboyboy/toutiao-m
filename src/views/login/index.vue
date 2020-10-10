<template>
  <div class="login">
    <!-- 导航 -->
    <van-nav-bar class="page_nav_bar" title="登录">
      <template #left>
        <van-icon name="cross" @click="$router.back()" />
      </template>
    </van-nav-bar>
    <!-- 登录表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        ref=""
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        :maxlength="11"
      >
        <template #left-icon>
          <i class="iconfont icon-shouji"></i>
        </template>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        :maxlength="6"
      >
        <template #left-icon>
          <i class="iconfont icon-yanzhengma"></i>
        </template>

        <template #button v-if="isCountDownShow">
          <van-count-down
            :time="5 * 1000"
            format="ss s"
            @finish="isCountDownShow = false"
          />
        </template>
        <template #button v-else>
          <van-button
            @click="onSendMsm"
            class="send_msm_btn"
            type="default"
            round
            size="mini"
            native-type="button"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login_container">
        <van-button class="login_btn" block type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
// 这种解构如果多起来也可以挂原型
import { login, getSmsCode } from "@/server/user.js";
export default {
  name: "login",
  data() {
    return {
      user: {
        mobile: "",
        code: "",
      },
      // 表单验证规则
      userFormRules: {
        mobile: [
          {
            required: true,
            message: "手机号不能为空",
          },
          {
            pattern: /^1[3|5|7|8|9]\d{9}$/,
            message: "手机号格式错误",
          },
        ],
        code: [
          {
            required: true,
            message: "验证码不能为空",
          },
          {
            pattern: /^\d{6}$/,
            message: "验证码格式错误",
          },
        ],
      },
      // 计时器是否显示
      isCountDownShow: false,
    };
  },
  methods: {
    async onSubmit() {
      //  全局导入$toast自动注册到vue原型上了,可以直接使用
      //  toast默认为单例模式
      this.$toast.loading({
        duration: 0, // 渲染时间为0,就是不停的转
        message: "加载中...",
        forbidClick: true,
      });
      try {
        const { data: res } = await login(this.user);
        //  这里要储存token
        this.$store.commit("setUser", res.data);
        this.$toast.success("登录成功");
        this.$router.back();
      } catch (err) {
        if (err.response.status == 400) {
          this.$toast.fail("登录失败,手机号或验证码错误");
        }
      }
    },
    //  发送验证码事件
    //  这里涉及一个发送成功要显示一个倒计时的组件
    async onSendMsm() {
      try {
        await this.$refs.loginForm.validate("mobile");
      } catch (err) {
        return console.log("验证失败", err);
      }
      // 验证通过就可以显示记时了
      this.isCountDownShow = true;
      //开始发送验证请求
      try {
        await getSmsCode(this.user.mobile);
      } catch (err) {
        // 发送失败关闭计时
        this.isCountDownShow = false;
        if (err.response.status === 429) {
          this.$toast("发送太频繁,请稍后重式");
        } else {
          this.$toast("发送失败,请稍后重试");
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  .iconfont {
    font-size: 37px;
  }
  .login_container {
    margin: 50px 16px 0 16px;
    .login_btn {
      background-color: #6db4fb;
      border-radius: 10px;
      border: none;
      font-size: 32px;
    }
  }
  .send_msm_btn {
    background-color: #ededed;
    color: #666;
    font-size: 12px;
  }
}
</style>