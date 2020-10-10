<template>
  <van-cell class="comment_item">
    <template #icon>
      <van-image class="avatar" round fit="cover" :src="comment.aut_photo" />
    </template>
    <template #title>
      <div class="title_wrap">
        <span class="user_name">{{ comment.aut_name }}</span>
        <van-button
          class="like_btn"
          :class="{
            liked: comment.is_liking,
          }"
          :icon="comment.is_liking ? 'like' : 'like-o'"
          :loading="likeLoading"
          @click="onCommentLike"
          >{{ comment.like_count || "赞" }}</van-button
        >
      </div>
    </template>
    <template #label>
      <p class="comment_content">{{ comment.content }}</p>
      <div class="comment_info">
        <span class="comment_pubdate">{{
          comment.pubdate | relativeTime
        }}</span>
        <!-- 这里回复按钮触发的事件要在父组件回复,因为被评论对象数据是父组件传过来的,子组件不能直接操作属性值 -->
        <van-button
          class="reply_btn"
          round
          @click="$emit('reply-comment', comment)"
          >回复 {{ comment.reply_count }}</van-button
        >
      </div>
    </template>
  </van-cell>
</template>

<script>
import { addCommentLike, deleteCommentLike } from "@/server/comment";
export default {
  name: "commentItem",
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      // 点赞按钮加载
      likeLoading: false,
    };
  },
  methods: {
    // 这个组件只需要处理评论点赞就可以了,回复评论要在原始数据组件处理,传会被评论的comment对象就可以了
    // 有两种情况,comment.is_liking有true和false两种模式,分为已点赞和未点赞
    async onCommentLike() {
      this.likeLoading = true;
      try {
        let nums = 1;
        // 已点赞,则该次点击行为就取消点赞
        if (this.comment.is_liking) {
          await deleteCommentLike(this.comment.com_id);
          // 这里请求成功以后服务器的点赞数量应该已经改好了,但是我们之前请求的数据里面的点赞数还是原来的值,要通知 原始数据组件修改该评论的点赞数
          // 点赞数减1
          nums = -1;
        } else {
          await addCommentLike({
            target: this.comment.com_id,
          });
          // 点赞数加1
        }
        this.$emit("change-like", {
          id: this.comment.com_id,
          nums,
        });
      } catch (err) {
        this.$toast("操作失败,请重试");
      }
      this.likeLoading = false;
    },
  },
};
</script>

<style lang="less" scoped>
.comment_item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title_wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user_name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment_content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment_pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom_info {
    display: flex;
    align-items: center;
  }
  .reply_btn {
    // width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like_btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
    &.liked {
      color: #e5645f;
    }
  }
}
</style>