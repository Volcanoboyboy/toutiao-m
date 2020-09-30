<template>
  <div class="article_list">
    <van-pull-refresh
      :success-text="successText"
      v-model="isreFreshLoading"
      :success-duration="1000"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        error-text="请求失败,点击重新加载"
        @load="onLoad"
      >
        <!-- 这里展示的组件还是太简单了,想个性化展示还是需要封装一个articleItem组件,后面写 -->
        <!-- 这个组件要在后面做好各个子路由以后才好写 -->
        <van-cell
          v-for="(artcile, index) in list"
          :key="index"
          :title="artcile.title"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from "@/server/article.js";
export default {
  name: "articleList",
  data() {
    return {
      list: [],

      // list组件配置
      //   单次加载完成就要设为false,在触发load的时候会自动改为true
      loading: false,
      //   全部数据加载完成或者加载出错的时候设为false
      finished: false,
      //  请求下一页数据的时间戳
      timestamp: null,

      // 下拉刷新组件配置
      isreFreshLoading: false,
      // 刷新成功或者失败的文本,因为组件只有一个文字展示配置
      successText: "刷新成功",
    };
  },
  props: {
    channel: {
      //  虽然传id就可以了,但是方便查看数据,可以传整个对象
      type: Object,
      required: true,
    },
  },
  methods: {
    //  list组件第一次加载触发一次,然后列表底部到可视区距离小雨offset会触发
    //  进入页面第一次请求时要包含置顶文章,是否包含置顶文章是分别两个不同的接口
    async onLoad() {
      try {
        const res = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now(),
          with_top: 1,
        });
        console.log(res, "文章列表数据");
        this.list.push(...res.data.data.results);
        this.loading = false;
        const { results } = res.data.data;
        if (results.length) {
          this.timestamp = res.data.data.pre_timestamp;
        } else {
          this.finished = true;
        }
      } catch (err) {
        this.loading = false;
        this.error = true;
      }
    },
    // 下拉组件下拉触发的事件
    async onRefresh() {
      try {
        const res = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(),
          with_top: 1,
        });

        const { results } = res.data.data;
        this.list.unshift(...results);
        this.isreFreshLoading = false;
        this.successText = `刷新成功,更新了${results.length}条数据`;
      } catch (err) {
        this.successText = "刷新失败";
        this.isreFreshLoading = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.article_list {
  position: fixed;
  top: 180px;
  bottom: 100px;
  overflow-y: auto;
  right: 0;
  left: 0;
}
</style>