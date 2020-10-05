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
          to="/search"
          >搜索</van-button
        >
      </template>
    </van-nav-bar>
    <!-- 频道列表 -->
    <van-tabs class="channel_tabs" v-model="active" swipeable line-height="1px">
      <van-tab
        v-for="channel in channels"
        :title="channel.name"
        :key="channel.id"
      >
        <article-list :channel="channel"></article-list>
      </van-tab>
      <template #nav-right>
        <div class="placehoder"></div>
        <div class="more_btn" @click="isChannelEditShow = true">
          <i class="iconfont icon-gengduo"></i>
        </div>
      </template>
    </van-tabs>

    <!-- 弹出层 -->
    <!-- 这是利用弹出层然后包住频道列表组件 -->
    <van-popup
      v-model="isChannelEditShow"
      round
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '95%' }"
    >
      <!-- 这中间显示频道编辑组件 -->
      <channel-edit
        :userChannels="channels"
        :active-index.sync="active"
        @close-popup="isChannelEditShow = false"
        :active="active"
      ></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import ChannelEdit from "@/components/content/ChannelEdit.vue";
import { getUserChannels } from "@/server/user.js";
import ArticleList from "@/components/content/ArticleList.vue";
export default {
  name: "home",
  components: {
    ArticleList,
    ChannelEdit,
  },
  data() {
    return {
      active: 0,
      //  频道数据
      //  这里为了减少请求对文章列表可以封装一个组件出来,实现懒加载,将channels传过去就可以了,在文章列表内部
      channels: [],

      // 编辑频道显示
      isChannelEditShow: false,
    };
  },
  created() {
    this.loadChannels();
  },
  methods: {
    async loadChannels() {
      try {
        // 后期在这里还要处理一下,在编辑频道的时候要将频道数组存到本地,以便下次访问的时候可以快速渲染频道减少ajax
        // 等到写编辑频道的时候再来改这里
        const res = await getUserChannels();
        console.log(res);
        this.channels = res.data.data.channels;
      } catch (err) {
        this.$toast("获取频道列表失败");
      }
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