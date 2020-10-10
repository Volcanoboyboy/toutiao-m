<template>
  <van-button
    :icon="value ? 'star' : 'star-o'"
    @click="onCollect"
    :class="{ collected: value }"
    :loading="loading"
  ></van-button>
</template>

<script>
import { addCollect, deleteCollect } from "@/server/article";
export default {
  name: "collectArticle",
  data() {
    return {
      // 按钮加载状态,可以不用也没关系,这个按钮很小
      loading: false,
    };
  },
  props: {
    // v-model绑定的值固定可以用value属性接收,v-model实现原理也就是这样的
    value: {
      type: Boolean,
      required: true,
    },
    // 收藏的文章Id
    articleId: {
      type: Number | String | Object,
      required: true,
    },
  },
  methods: {
    //  收藏按钮点击事件
    async onCollect() {
      this.loading = true;
      // 有两种情况,未收藏即为收藏,如果已经收藏则取消收藏
      try {
        if (this.value) {
          await deleteCollect(this.articleId);
        } else {
          await addCollect(this.articleId);
          //   这里收藏成功以后要触发一下input事件修改收藏状态
          // 这里很关键,v-model绑定数据就包含一input事件
        }
        this.$emit("input", !this.value);
        this.$toast.success(!this.value ? "收藏成功" : "取消收藏");
      } catch (err) {
        this.$toast.fail("操作失败,请重试!");
      }
      this.loading = false;
    },
  },
};
</script>

<style lang="less" scoped>
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>