<template>
  <div class="suggestion_container">
    <van-cell
      icon="search"
      v-for="(item, index) in suggestions"
      :key="index"
      @click="$emit('search', item)"
    >
      <template #title>
        <span v-html="highLight(item)"></span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { debounce } from "lodash";
import { getSearchSuggestions } from "@/server/search.js";
export default {
  name: "searchSug",
  data() {
    return {
      suggestions: [],
    };
  },
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  watch: {
    // 这个帧听器操作要注意一下
    // 顺便再看一下lodash的节流函数和防抖函数,熟悉一下
    searchText: {
      //如果配置的不是函数,那处理函数handler就是默认的处理函数
      // value就是新值
      handler: debounce(function (value) {
        this.loadSuggestions(value);
      }, 200),
      immediate: true,
    },
  },
  methods: {
    async loadSuggestions(query) {
      try {
        const { data: res } = await getSearchSuggestions(query);
        this.suggestions = res.data.options;
      } catch (err) {
        this.$toast("数据获取失败,请稍后重试");
      }
    },
    highLight(text) {
      // 用html 高亮字符串替换联想字符串中的关键字,以提示用户
      const highlighStr = `<span class='active'>${this.searchText}</span>`;

      const reg = new RegExp(this.searchText, "gi");
      return text.replace(reg, highlighStr);
    },
  },
  // 利用帧听器帧听输入的字符串变化然后在防抖的前提下做异步请求
  //  这里防抖可以用lodash的debounce函数,vue文档中也用这个函数做例子
};
</script>

<style lang="less" scoped>
.suggestion_container {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>