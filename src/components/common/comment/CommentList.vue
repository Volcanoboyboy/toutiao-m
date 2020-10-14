<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="已显示全部评论"
    :error="error"
    error-text="加载失败,请点击重试"
    @load="onLoad"
    :immediate-check="false"
  >
    <comment-item
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      @reply-comment="$emit('reply-comment', $event)"
      @change-like="changeCommentLikes"
    />
  </van-list>
</template>

<script>
import CommentItem from "./CommentItem";
import { getComments } from "@/server/comment";
export default {
  name: "commentList",
  components: {
    CommentItem,
  },
  data() {
    return {
      // list加载状态
      loading: false,
      finished: false,
      error: false,

      // 获取评论偏移值参数,不传默认从1开始
      offset: null,
      // 获取数量
      limit: 10,
    };
  },
  props: {
    source: {
      type: String | Number | Object,
      required: true,
    },
    // 这是父组件传过来的评论,我们获取的评论直接组合到这上面一起展示就可以了
    list: {
      type: Array,
      default: () => [], // 这里要注意,如果默认值是引用类型就需要用函数返回,以备组件复用
    },
    type: {
      type: String,
      // 这里还需要自定义验证规则,例如这个例子中我们不仅要求type是字符串而且只能是'a'或'c'
      // a指对文章的评论,c指对评论的回复
      validator: function (value) {
        return ["a", "c"].indexOf !== -1;
      },
      default: "a",
    },
  },
  created() {
    this.loading = true;
    this.onLoad();
  },
  methods: {
    // 如果需要在点进这个文章就展示第一页评论,就将自动展示取消,然后在created里面手动获取一次
    async onLoad() {
      try {
        const { data: res } = await getComments({
          type: this.type,
          source: this.source.toString(),
          offset: this.offset,
          limit: this.limit,
        });
        this.$emit("load-comment-success", res.data);
        if (res.data.results.length) {
          this.list.push(...res.data.results);
          this.offset = res.data.last_id; // 这是记录下次请求的起点,除第一次是null
        } else {
          this.finished = true;
        }
      } catch (err) {
        this.error = true;
      }
      this.loading = false;
    },
    changeCommentLikes(data) {
      this.list.forEach((item) => {
        if (item.com_id === data.id) {
          item.like_count += data.nums;
          item.is_liking = !item.is_liking;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>