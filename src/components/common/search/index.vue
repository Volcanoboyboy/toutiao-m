<template>
  <div class="search_container">
    <!-- 套form是可以显示ios键盘的搜索键 -->
    <form class="search_form" action="/">
      <van-search
        v-model="searchText"
        shape="round"
        show-action
        background="#3296fa"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>

    <!-- 搜索结果 -->
    <search-result :searchText="searchText" v-if="isResultShow" />

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      @search="onSearch"
      :searchText="searchText"
    />

    <!-- 搜索历史记录 -->
    <search-history
      v-else
      :searchHistories="searchHistories"
      @deleteItem="deleteClickItem"
      @clear-all="searchHistories = []"
    />
  </div>
</template>

<script>
import SearchHistory from "./Search-history";
import SearchResult from "./Search-result";
import SearchSuggestion from "./Search-suggestion";
import { setItem, getItem } from "@/utils/storeage";
export default {
  name: "search",
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion,
  },
  data() {
    return {
      searchText: "",
      isResultShow: false,
      // 这里的历史记录都是保存在本地
      searchHistories: getItem("toutiao_search_histories") || [],
    };
  },
  methods: {
    //   search组件的search事件会回调自动带有输入文本
    onSearch(value) {
      this.searchText = value;
      // 这里的操作是后搜索的都要加入到数组的最前端,但是数组中已经有的就要先删除数组中的,然后再加入到数组前端
      if (this.searchHistories.indexOf(value) !== -1) {
        this.searchHistories.splice(index, 1);
      }
      // 最后都加入到数组的最前端
      this.searchHistories.unshift(value);
      this.isResultShow = true;
    },
    onCancel() {
      this.$router.back();
    },
    deleteClickItem(index) {
      this.searchHistories.splice(index, 1);
    },
  },
  // 利用帧听器帧听历史搜索的数组,一旦变化就重新储存到本地,其他就不管了
  watch: {
    searchHistories(value) {
      setItem("toutiao_search_histories", value);
    },
  },
};
</script>

<style lang="less" scoped>
.search_container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search_form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>