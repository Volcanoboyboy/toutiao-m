<template>
  <div class="postComment_container">
    <van-field
      class="post_field"
      v-model.trim="comment"
      rows="2"
      type="textarea"
      maxlength="50"
      show-word-limit
      placeholder="请输入留言"
    ></van-field>
    <van-button class="post" @click="onPost" :disabled="!comment"
      >发布</van-button
    >
  </div>
</template>

<script>
import { addComment } from "@/server/comment";
export default {
  name: "commentpost",
  // 这里inject和props总共传入了两个id,其实是因为后台对文章和评论的评论就是一个接口,target是为了区分是对文章的评论还是对评论的回复,所以需要两个id
  // 注入成功
  inject: {
    //  文章id
    articleId: {
      type: Number | String | Object,
      default: null,
    },
  },
  props: {
    // 评论的目标id
    target: {
      type: Number | String | Object,
      required: true,
    },
  },
  data() {
    return {
      // 文本域输入的内容
      comment: "",
      //  发送状态
    };
  },
  methods: {
    async onPost() {
      // 这里设置duration持续展示是因为vant中toast默认是单例
      this.$toast.loading({
        message: "发布中...",
        forbidClick: true,
        duration: 0,
      });
      try {
        const { data: res } = await addComment({
          target: this.target,
          content: this.comment,
          // 在文章评论时是不需要这个id的,这里是为了测试provide和inject的数据传递
          art_id: this.articleId,
        });
        this.comment = "";
        // 这里需要触发事件让父组件关闭文本域,并且将评论内容添加到评论顶部
        this.$emit("post-comment", res.data);
        this.$toast.success("发布成功");
      } catch (err) {
        this.$toast.fail("发布失败");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.postComment_container {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post_field {
    background-color: #f5f7f9;
  }
  .post {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>