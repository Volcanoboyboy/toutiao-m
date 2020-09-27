<template>
  <div class="home">
    <van-nav-bar class="page_nav_bar">
      <template #title>
        <van-button
          round
          class="search_btn"
          size="samll"
          type="info"
          icon="search"
          >搜索</van-button
        >
      </template>
    </van-nav-bar>
    <!-- 频道列表 -->
    <van-tabs class="channel_tabs" v-model="active" swipeable line-height="1px">
      <van-tab title="标签 1">内容 1</van-tab>
      <van-tab title="标签 2">内容 2</van-tab>
      <van-tab title="标签 3">内容 3</van-tab>
      <van-tab title="标签 4">内容 4</van-tab>
      <van-tab title="标签 4">内容 4</van-tab>
      <van-tab title="标签 4">内容 4</van-tab>
      <template #nav-right>
        <div class="placehoder"></div>
        <div class="more_btn">
          <i class="iconfont icon-gengduo"></i>
        </div>
      </template>
    </van-tabs>
  </div>
</template>

<script>
import { getUserChannels } from "@/server/user.js";
export default {
  name: "home",
  data() {
    return {
      active: 0,
      //  频道数据
      channels: [],
    };
  },
  created() {
    this.loadChannels();
  },
  methods: {
    async loadChannels() {
      try {
        const res = await getUserChannels();
        console.log(res, "频道列表");
      } catch (err) {}
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  // vantcss类重写只能作用于根元素,deep可以穿透
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search_btn {
    width: 555px;
    height: 64px;
    border: none;
    background-color: #5babfb;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }

  /deep/ .channel_tabs {
    .van-tab {
      border-right: 1px solid #edeff3;
      font-size: 30px;
      min-width: 200px;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      bottom: 8px;
      width: 50px !important;
      height: 6px;
      background-color: #3296fa;
    }

    .placehoder {
      width: 66px;
      height: 82px;
      flex-shrink: 0;
    }

    .more_btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: rgba(255, 255, 255, 0.902);
      i.iconfont {
        font-size: 33px;
      }
      &::before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 58px;
        background-size: contain;
        background-image: url(~@/assets/images/gradient-gray-line.png);
      }
    }
  }
}
</style>