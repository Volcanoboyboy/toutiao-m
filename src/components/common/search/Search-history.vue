<template>
  <div class="history_container">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <van-button type="warning" size="mini" @click="clearAll"
          >全部删除</van-button
        >
        <van-button type="info" size="mini" @click="isDeleteShow = false"
          >完成</van-button
        >
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow = true"></van-icon>
    </van-cell>
    <van-cell
      v-for="(item, index) in searchHistories"
      :key="index"
      :title="item"
      @click="onSearchItemClick(item, index)"
    >
      <van-icon v-show="isDeleteShow" name="close"></van-icon>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: "searchHistory",
  props: {
    searchHistories: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isDeleteShow: false,
    };
  },
  methods: {
    onSearchItemClick(item, index) {
      if (this.isDeleteShow) {
        // 这个地方那个例子写的直接修改数组,好像有点问题
        this.$emit("deleteItem", index);
      }
    },
    clearAll() {
      this.isDeleteShow = false;
      this.$emit("clear-all");
    },
  },
};
</script>

<style lang="less" scoped>
</style>