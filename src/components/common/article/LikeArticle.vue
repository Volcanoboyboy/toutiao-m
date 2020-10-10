<template>
  <van-button
    :icon="value === 1 ? 'good-job' : 'good-job-o'"
    :class="{
      liked: value === 1,
    }"
    :loading="loading"
    @click="onLike"
  >
  </van-button>
</template>

<script>
import { addLike, deleteLike } from "@/server/article";
export default {
  name: "likearticle",
  props: {
    // 是否点赞的数据,点赞为1,没点赞为-1
    value: {
      type: Number,
      required: true,
    },
    // 正在操作的文章id
    articleId: {
      type: Number | String | Object,
      required: true,
    },
  },
  data() {
    return {
      // 给一个按钮的加载状态
      loading: false,
    };
  },
  methods: {
    async onLike() {
      this.loading = true;
      // 这里这个状态是1(点赞) 和 -1(未点赞),再给一个变量存这个状态传值
      try {
        if (this.value === 1) {
          await deleteLike(this.articleId);
        } else {
          await addLike(this.articleId);
        }
        this.$toast.success(this.value === -1 ? "点赞成功" : "取消点赞");
      } catch (err) {
        this.$toast.fail("操作失败,请重试!");
      }
      this.$emit("input", this.value === 1 ? -1 : 1);
      this.loading = false;
    },
  },
};
</script>

<style lang="less" scoped>
.liked {
  .van-icon {
    color: #e5645f;
  }
}
</style>