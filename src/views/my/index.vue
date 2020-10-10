<template>
  <div class="my_container">
    <!-- 登录头部视图 -->
    <div v-if="user" class="header user_info">
      <div class="base_info">
        <div class="left">
          <van-image
            round
            class="avatar"
            src="https://img.yzcdn.cn/vant/cat.jpeg"
            fit="cover"
          />
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button size="mini" to="/user/profile">编辑用户资料</van-button>
        </div>
      </div>

      <!-- 用户数据展示 -->
      <div class="data_stats">
        <div class="data_item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data_item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data_item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data_item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>

    <!-- 未登录头部视图 -->
    <div v-else class="header not_login">
      <div class="login_btn">
        <img
          class="mobile_img"
          src="~@/assets/images/mobile.png"
          @click="$router.push('/login')"
        />
        <span class="text">登录 / 注册</span>
      </div>
    </div>

    <!-- 栅格导航 -->
    <div class="nav_grid">
      <van-grid :column-num="2" :clickable="true">
        <van-grid-item>
          <template #icon>
            <i class="iconfont icon-shoucang"></i>
          </template>
          <template #text>
            <span class="text">收藏</span>
          </template>
        </van-grid-item>
        <van-grid-item>
          <template #icon>
            <i class="iconfont icon-lishi"></i>
          </template>
          <template #text>
            <span class="text">历史</span>
          </template>
        </van-grid-item>
      </van-grid>
    </div>

    <!-- cell导航和退出登录 -->
    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" is-link />
    <van-cell
      v-if="user"
      class="logout_cell"
      @click="onLogout"
      clickable
      title="退出登录"
    />
  </div>
</template>
<script>
import { getUserInfo } from "@/server/user";
import { mapState } from "vuex";
export default {
  name: "mypage",
  data() {
    return {
      // 用户信息
      userInfo: {},
    };
  },
  created() {
    this.loadUserInfo();
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    //  退出登录
    onLogout() {
      this.$dialog
        .confirm({
          title: "退出登录提示",
          message: "确认退出登录吗?",
        })
        .then(() => {
          // 退出登录要清空token
          this.$store.commit("setUser", null);
        })
        .catch(() => {
          // on cancel
        });
    },
    async loadUserInfo() {
      try {
        const res = await getUserInfo();
        // console.log(res, "我自己的信息");
        this.userInfo = res.data.data;
      } catch (err) {
        this.$toast("获取用户信息失败,请稍后重试");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.my_container {
  .header {
    height: 361px;
    background: url("~@/assets/images/banner.png") no-repeat;
    background-size: cover;
  }
  .not_login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login_btn {
      flex-direction: column;
      display: flex;
      justify-content: center;
      align-items: center;
      .mobile_img {
        widows: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }

  .user_info {
    .base_info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          border: 4px solid #fff;
          margin-right: 23px;
        }
        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data_stats {
      display: flex;
      .data_item {
        display: flex;
        height: 130px;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }

  .nav_grid {
    .van-grid-item {
      height: 141px;
      i.iconfont {
        font-size: 45px;
      }
      .icon-shoucang {
        color: #eb5253;
      }
      .icon-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
    margin-bottom: 9px;
  }
  .logout_cell {
    margin-top: 9px;
    text-align: center;
    color: #d86262;
  }
}
</style>