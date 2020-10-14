<template>
  <div class="update_photo">
    <img :src="img" class="img" ref="img" />
    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
// cropper是需要同时导入js和样式
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { updateUserPhoto } from "@/server/user";
export default {
  name: "updatePhoto",
  props: {
    img: {
      type: String | Object,
      required: true,
    },
  },
  data() {
    return {
      //  cropper对象,在mounted中就可以获取了
      cropper: null,
    };
  },
  mounted() {
    const image = this.$refs.img;
    this.cropper = new Cropper(image, {
      // 这里的配置可以查看git文档 https://github.com/fengyuanchen/cropperjs#options
      viewMode: 1,
      dragMode: "move",
      aspectRatio: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
    });
  },
  methods: {
    onConfirm() {
      // 获取裁剪区域的图片对象的api参考示例
      // https://github.com/fengyuanchen/cropperjs#methods
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        this.updateImage(blob);
      });
    },
    // 上传头像
    async updateImage(blob) {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true,
        duration: 0, // 默认2000,0为持续显示
      });
      try {
        // 更新头像接口要求的Content-Type是multipart/form-data,这个时候就要求传输formData对象格式的数据
        // 如果Content-Type是application/json,这个时候就传输普通对象格式数据
        // 这里要记住FomrData的实例添加数据的方法,很重要
        const formData = new FormData();
        //  这里名字要和接口参数一致才可以
        formData.append("photo", blob);

        const { data: res } = await updateUserPhoto(formData);
        console.log(res);

        // 这里点击完成的时候也要触发close事件,让父组件关闭弹窗
        this.$emit("close");
        // 同时还要让父组件更新头像,因为虽然请求成功,但是页面没有刷新,这次的视图更新需要我们手动更改
        this.$emit("update-photo", res.data.photo);
        this.$toast("更新成功");
      } catch (err) {
        this.$toast("更新失败");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.update_photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
  .img {
    display: block;
    max-width: 100%;
  }
}
</style>