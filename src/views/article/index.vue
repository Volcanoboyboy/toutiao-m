<template>
  <div class="article_container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page_nav_bar"
      left-arrow
      title="华逸头条"
      @click-left="$router.back()"
    ></van-nav-bar>

    <!-- 详情展示区 -->
    <div class="main_wrap">
      <!-- 加载组件 -->
      <div v-if="isLoading" class="loading_wrap">
        <van-loading color="#1989fa" vertical>加载中</van-loading>
      </div>

      <div v-else-if="article.title" class="article_detail">
        <!-- 文章标题 -->
        <h1 class="article_title">{{ article.title }}</h1>

        <!-- 用户信息 -->
        <van-cell class="user_info" center :border="false">
          <template #icon>
            <van-image
              class="avatar"
              round
              fit="cover"
              :src="article.aut_photo"
            />
          </template>
          <template #title>
            <div class="user_name">
              {{ article.aut_name }}
            </div>
          </template>
          <template #label>
            <div class="publish_date">
              {{ article.pubdate | relativeTime }}
            </div>
          </template>
          <!-- 关注按钮 -->
          <!-- 已关注 -->
          <van-button
            v-if="article.is_followed"
            class="follow_btn"
            round
            size="small"
            :loading="followLoading"
            @click="onFollow"
            >已关注</van-button
          >
          <!-- 未关注 -->
          <van-button
            v-else
            class="follow_btn"
            type="info"
            round
            icon="plus"
            size="small"
            :loading="followLoading"
            @click="onFollow"
            >关注</van-button
          >
        </van-cell>
        <!-- 文章内容, 这里的引用是为了获取所有文章内的图片dom做图片预览处理的,然后要加上markdown-body这个类名 -->
        <div
          class="article_content markdown-body"
          v-html="article.content"
          ref="article_content"
        ></div>
        <!-- 分割线组件 -->
        <van-divider>正文结束</van-divider>

        <!-- 文章评论列表,封装成一个组件 -->
        <comment-list
          :source="article.art_id"
          :list="commentList"
          @load-comment-success="commentNums = $event.total_count"
          @reply-comment="onReplyComment"
        />

        <!-- 底部区域,发表评论、点赞、收藏、分享这里暂时不做,没有第三方接口 -->
        <div class="article_bottom">
          <!-- 写评论 -->
          <van-button
            class="comment_btn"
            type="default"
            round
            size="small"
            @click="isCommentPopShow = true"
            >写评论</van-button
          >
          <!-- 评论数量展示, 这里的数据要从评论列表组件获取数据后传过来修改一下commentNums就可以了 -->
          <van-icon
            class="comment_nums"
            name="comment-o"
            :badge="commentNums"
          ></van-icon>

          <!-- 收藏和点赞操作都带有异步操作和状态的变更,所以封装成组件会方便一些 -->
          <!-- 收藏按钮 -->
          <collect-article
            class="action_btn"
            :article-id="article.art_id"
            v-model="article.is_collected"
          />
          <!-- 点赞按钮 -->
          <like-article
            class="action_btn"
            :article-id="article.art_id"
            v-model="article.attitude"
          />
          <!-- 分享按钮,这个功能先不做 -->
          <van-icon name="share" color="#999999"></van-icon>
        </div>
        <van-popup v-model="isCommentPopShow" position="bottom">
          <comment-post
            @post-comment="commentSuccess"
            :target="article.art_id"
          />
        </van-popup>
      </div>

      <!-- 由于404错误提示文章被删除或者不存在 -->
      <div v-else-if="errStatus === 404" class="error_tips">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除!</p>
      </div>
      <!-- 如果是其他错误就给按钮点击重新加载 -->
      <div v-else class="error_tips">
        <van-icon name="failure" />
        <p class="text">内容加载失败</p>
        <van-button class="retry" @click="loadArticle">点击重试</van-button>
      </div>
    </div>
    <!-- 回复评论先不做,看不到效果,有点搞不清楚 -->
    <van-popup v-model="isReplyShow"></van-popup>
  </div>
</template>

<script>
import { getArticleById } from "@/server/article";
import { addFollow, unFollow } from "@/server/user";
import { ImagePreview } from "vant";
import CommentList from "@/components/common/comment/CommentList";
import CollectArticle from "@/components/common/article/CollectArticle";
import LikeArticle from "@/components/common/article/LikeArticle";
import CommentPost from "@/components/common/article/CommentPost";
export default {
  name: "articleInfo",
  // 提供给其他组件使用
  provide: function () {
    return {
      articleId: this.articleId,
    };
  },
  props: {
    //  这个属性是路由映射过来的属性,这样更灵活
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  components: {
    CollectArticle,
    LikeArticle,
    CommentPost,
    CommentList,
  },
  data() {
    return {
      // 文章详情
      article: {},
      // 加载状态
      isLoading: false,
      // 文章返回错误状态,  0 为其他错误,建议重新加载,404为文章不存在错误,提示文章被删除
      errStatus: 0,
      // 关注按钮加载状态
      followLoading: false,
      // 评论pop是否显示,默认不显示
      isCommentPopShow: false,
      // 文章评论数量
      commentNums: 0,
      // 评论列表,这里只是存新增的评论,然后传给评论组件,在评论组件里面请求该文章的所有评论,然后组合这个新增的平路列表
      commentList: [],
      // 当前回复的评论,作为属性传给回复评论组件
      currentComment: [],
      // 回复评论弹窗是否显示
      isReplyShow: false,
    };
  },
  created() {
    //  初始化加载文章详情
    this.loadArticle();
  },
  methods: {
    async loadArticle() {
      this.isLoading = true;
      try {
        const { data: res } = await getArticleById(this.articleId);
        this.article = res.data;

        // 异步处理图片预览,要等文章内容dom都加载完了才能获取到所有的图片元素
        setTimeout(() => {
          this.previewImage();
        }, 0);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404;
        }
      }
      this.isLoading = false;
    },
    // 文章中图片预览
    previewImage() {
      // 获取文章dom
      const contentDom = this.$refs["article_content"];
      const imgs = contentDom.querySelectorAll("img");

      // 利用ImagePreview这个组件需要传入预览图片的地址数组,还可以控制起始图片位置
      const images = [];
      imgs.forEach((img, index) => {
        images.push(img.src);

        // 给每张图片绑定点击事件,并指定从当前图片开始
        img.onclick = () => {
          // ImagePreview是一个函数,调用函数后会直接在页面展示预览界面
          ImagePreview({
            images,
            startPosition: index,
          });
        };
      });
    },
    //  评论发送成功后的回调,关闭评论窗口,展示新评论
    commentSuccess(comment_data) {
      this.isCommentPopShow = false;
      // new_obj就是评论数据
      // console.log(comment_data.new_obj);
      // 将新评论添加到新评论列表的顶端
      this.commentList.unshift(comment_data.new_obj);
      this.commentNums++;
    },
    //  关注按钮点击事件
    async onFollow() {
      this.followLoading = true;
      try {
        if (this.article.is_followed) {
          await unFollow(this.article.aut_id);
        } else {
          await addFollow(this.article.aut_id);
        }
        this.article.is_followed = !this.article.is_followed;
      } catch (err) {
        let msg = "操作失败,请重试!";
        if (err.response && err.response.status === 400) {
          msg = "你不能关注你自己!";
        }
        this.$toast(msg);
      }
      this.followLoading = false;
    },
    onReplyComment(comment) {
      this.currentComment = comment;
      this.isReplyShow = true;
    },
  },
};
</script>

<style lang="less" scoped>
// 按markdown格式格式化文本
@import "../../assets/styles/github-markdown.css";
.article_container {
  .main_wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
  }
  .loading_wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .article_detail {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
    .article_title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user_info {
      padding: 0 32px;
      .avatar {
        width: 90px;
        height: 90px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user_name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish_date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow_btn {
        width: 170px;
        height: 58px;
      }
    }
    .article_content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }

    .article_bottom {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-sizing: border-box;
      height: 88px;
      border-top: 1px solid #d8d8d8;
      background-color: #fff;
      .comment_btn {
        width: 282px;
        height: 46px;
        border: 2px solid #eeeeee;
        font-size: 30px;
        line-height: 46px;
        color: #a7a7a7;
      }
      /deep/ .van-icon {
        font-size: 40px;
      }
      .comment_nums {
        top: 2px;
        color: #777;
        .van-info {
          font-size: 16px;
          background-color: #e22829;
        }
      }
      .action_btn {
        border: none;
        padding: 0;
        height: 40px;
        line-height: 40px;
        color: #777777;
      }
      .collect-btn--collected {
        color: #ffa500;
      }
      .like-btn--liked {
        color: #e5645f;
      }
    }
  }

  .error_tips {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }
}
</style>