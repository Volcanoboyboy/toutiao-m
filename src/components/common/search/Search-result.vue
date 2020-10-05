<template>
  <div class="result_container">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="加载失败,点击重试"
      @load="onLoad"
    >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from "@/server/search";
export default {
  name: "searchResult",
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false,
      page: 1,
      perPage: 20,
    };
  },
  props: {
    //  搜索栏传来的搜索的关键字
    searchText: {
      type: String,
      required: true,
    },
  },
  methods: {
    // list组件向下滚动触发的事件,会在首次加载的时候触发一次
    async onLoad() {
      try {
        const { data: res } = await getSearchResult({
          page: this.page,
          per_page: this.perPage,
          q: this.searchText,
        });
        this.list.push(...res.data.results);
        this.loading = false;
        if (res.data.results.length < this.perPage) {
          this.finished = true;
        } else {
          //  list在上拉的时候会自动触发
          this.page++;
        }
      } catch (err) {
        this.error = true;
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>