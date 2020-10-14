<template>
  <div class="user_profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page_nav_bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 这里要利用一个input框上传我们的头像图片,但是我们又不想看到这个框,因为太丑了,我们要点击自己设计的图片编辑栏拉起这个input -->
    <input type="file" hidden ref="file" @change="onFileChange" />

    <!-- 个人信息条目 -->
    <van-cell
      class="photo_cell"
      title="头像"
      is-link
      @click="$refs.file.click()"
    >
      <van-image class="avatar" fit="cover" round :src="user.photo" />
    </van-cell>
    <!-- 昵称 -->
    <van-cell title="昵称" is-link value="内容"></van-cell>
    <!-- 性别 -->
    <van-cell title="性别" is-link value="内容"></van-cell>
    <!-- 生日 -->
    <van-cell title="生日" is-link value="内容"></van-cell>

    <!-- 拉起的对应弹窗 -->
    <!-- 编辑用户头像窗口 -->
    <van-popup
      v-model="isChangeAvatarPopShow"
      position="bottom"
      style="height: 100%"
      closeable
    >
      <update-photo
        v-if="isChangeAvatarPopShow"
        :img="img"
        @close="isChangeAvatarPopShow = false"
        @update-photo="user.photo = $event"
      />
    </van-popup>
    <!-- /编辑用户头像窗口 -->
  </div>
</template>

<script>
import UpdatePhoto from "./components/UpdatePhoto";
import { getUserProfile } from "@/server/user";
export default {
  name: "userProfile",
  components: {
    UpdatePhoto,
  },
  created() {
    this.loadUserProfile();
  },
  data() {
    return {
      isChangeAvatarPopShow: false,
      // 用户信息
      user: {},
      // 图片blob
      img: null,
    };
  },
  methods: {
    async loadUserProfile() {
      try {
        const { data: res } = await getUserProfile();
        this.user = res.data;
      } catch (err) {
        this.$toast("数据获取失败");
      }
    },
    // input发生change事件,在选择完文件之后就会触发change事件
    // 有个特例就是选择同一个文件是不会再触发change事件,这时候在获取到img后可以重置表单
    onFileChange() {
      const file = this.$refs.file.files[0];
      // URL.createObjectURL() 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL
      this.img = window.URL.createObjectURL(file);
      this.isChangeAvatarPopShow = true;

      // 这里要注意,如果不清空,两次选择同一个文件的时候是不会触发change事件的
      this.$refs.file.value = "";
    },
  },
};
</script>

<style lang="less" scoped>
.user_profile {
  .avatar {
    width: 60px;
    height: 60px;
  }

  .van-popup {
    background-color: #f5f7f9;
  }

  .photo_cell {
    .van-cell__value {
      display: flex;
      flex-direction: row-reverse;
    }
  }
}
</style>