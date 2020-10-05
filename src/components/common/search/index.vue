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
    <search-history v-else />
  </div>
</template>

<script>
import SearchHistory from "./Search-history";
import SearchResult from "./Search-result";
import SearchSuggestion from "./Search-suggestion";
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
    };
  },
  methods: {
    //   search组件的search事件会回调自动带有输入文本
    onSearch(value) {
      this.searchText = value;
      this.isResultShow = true;
    },
    onCancel() {
      this.$router.back();
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