<template>
  <!-- vue命名的路由示例,这和van-cell组件的to属性是一样的用法 -->
  <!-- <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link> -->
  <van-cell
    class="article_item"
    :to="{
      name: 'article',
      params: {
        articleId: article.art_id,
      },
    }"
  >
    <template #title>
      <!-- 这里的多文本省略是用的vant的内置样式--style -->
      <span class="title van-multi-ellipsis--l2">{{ article.title }}</span>
    </template>
    <!-- 这里的图片封面是有数量区别的,如果是三张就放在详细信息之前,如果只有一张就把封面图片放在默认插槽中,详细信息始终是放在label插槽中 -->
    <template #label>
      <div v-if="article.cover.type === 3" class="cover_wrap">
        <div
          class="cover-item"
          v-for="(img, index) in article.cover.images"
          :key="index"
        >
          <van-image class="cover_item_img" fit="cover" :src="img" />
        </div>
      </div>
      <div class="label_info">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </template>
    <template #default v-if="article.cover.type === 1">
      <van-image
        class="right_cover"
        fit="cover"
        :src="article.cover.images[0]"
      ></van-image>
    </template>
  </van-cell>
</template>

<script>
export default {
  name: "articleItem",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="less" scoped>
.article_item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }

  .van-cell__title {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }

  .right_cover {
    width: 100%;
    height: 146px;
  }

  .label_info span {
    font-size: 22px;
    color: #b4b4b4;
    margin-right: 25px;
  }

  .cover_wrap {
    display: flex;
    padding: 30px 0;
    .cover-item {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        padding-right: 4px;
      }
    }
  }
}
</style>