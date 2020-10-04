<template>
  <div class="channel_edit">
    <!-- 我的频道 -->
    <van-cell class="title_text" title="我的频道">
      <van-button
        class="edit_btn"
        type="danger"
        plain
        round
        size="mini"
        @click="isEditShow = !isEditShow"
        >{{ isEditShow ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        v-for="(item, index) in userChannels"
        :key="index"
        @click="onUserChannelClick(item, index)"
      >
        <template #icon>
          <van-icon
            v-show="isEditShow && item.name !== '推荐'"
            class="clear_icon"
            name="clear"
          ></van-icon>
        </template>
        <template #text>
          <span class="text" :class="{ active: index == active }">{{
            item.name
          }}</span>
        </template>
      </van-grid-item>
    </van-grid>

    <!-- 推荐频道 -->
    <van-cell title="推荐频道"> </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        v-for="(item, index) in recomChannels"
        :key="index"
        @click="onAddChannel(item)"
      >
        <template #text>
          <span class="text">{{ item.name }}</span>
        </template>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel,
} from "@/server/article.js";
import { mapState } from "vuex";
import { setItem } from "@/utils/storeage.js";
/**
 * 这里还要实现一个就是保存用户收藏的频道,无论是否登录,登录就保存在线上,未登录就保存在本地储存上面,以便下次不登录也可以访问自己收藏的频道,增加用户的体验
 */
export default {
  name: "ChannelEdit",
  data() {
    return {
      //  所有频道
      allChannels: [],
      //   控制编辑状态
      isEditShow: false,
    };
  },
  props: {
    //  用户收藏的频道
    userChannels: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  created() {
    this.loadAllChannles();
  },
  methods: {
    /**
     * 因为下面频道列表做了持久化处理,那么如果本地有的话可以从本地获取频道减少请求
     * 但是这个除了登录页面,都需要token,所以这里理论上就算设置了本地储存也没有其效果
     * 如果设置了首页可以在不登录的情况下访问,本地储存的频道才有效果
     */
    async loadAllChannles() {
      //   try {
      //     let channels = [];
      //     if (this.user) {
      //       // 已登录，请求获取线上的频道数据
      //       const { data } = await getChannels();
      //       channels = data.data.channels;
      //     } else {
      //       // 未登录
      //       const localChannels = getItem("channels");
      //       if (localChannels) {
      //         // 有本地频道数据，则使用
      //         channels = localChannels;
      //       } else {
      //         // 没有本地频道数据，则请求获取默认推荐的频道列表
      //         const { data } = await getChannels();
      //         channels = data.data.channels;
      //       }
      //     }

      //     // 将数据更新到组件中
      //     this.channels = channels;
      //   } catch (err) {
      //     console.log(err);
      //     this.$toast("数据获取失败");
      //   }
      try {
        const { data: res } = await getAllChannels();
        this.allChannels = res.data.channels;
      } catch (err) {
        this.$toast("获取频道失败");
      }
    },
    // 从推荐频道添加到我的频道
    async onAddChannel(channel) {
      //  如果登录了就将频道保存到线上,做持久化保存
      try {
        this.userChannels.push(channel);
        if (this.user) {
          await addUserChannel({
            id: channel.id,
            seq: this.userChannels.length,
          });
        } else {
          // 如果没有登录就做本地保存
          setItem("toutiao_channels", this.userChannels);
        }
      } catch (err) {
        this.$toast("保存频道失败,请稍后重试");
      }
    },
    // 用户频道点击
    // 有两种情况,处于完成状态就是切换频道,处于编辑状态就是删除该频道
    onUserChannelClick(channel, index) {
      if (this.isEditShow) {
        if (channel.name === "推荐") {
          return;
        }
        if (index <= this.active) {
          //  如果删除的是激活前一个或者激活本身就需要将前一个激活
          this.$emit("update:active-index", this.active - 1);
        }
        this.userChannels.splice(index, 1);
        this.deleteChannel(channel);
      } else {
        //  触发两个事件让父组件处理切换频道和关闭编辑频道组件
        //  触发事件并更新数据的固定写法
        this.$emit("update:active-index", index);
        //  让父组件关闭编辑窗口
        this.$emit("close-popup");
      }
    },

    //  删除频道
    async deleteChannel(channel) {
      try {
        //  如果登录
        if (this.user) {
          await deleteUserChannel(channel.id);
        } else {
          setItem("toutiao_channels", this.userChannels);
        }
      } catch (err) {
        this.$toast("删除频道失败,请稍后重试");
      }
    },
  },
  computed: {
    ...mapState(["user"]),
    //  利用计算属性将剩下的频道作为推荐频道,给用户自己选择
    recomChannels() {
      return this.allChannels.filter((item) => {
        return !this.userChannels.find((item2) => {
          return item.id === item2.id;
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.channel_edit {
  padding: 85px 0;

  .title_text {
    font-size: 32px;
    color: #333333;
  }

  .edit_btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  .van-grid-item {
    height: 86px;
    /deep/.van-grid-item__content {
      white-space: nowrap;
      background-color: #f5f5f6;
      .van-grid-item__text,
      .text {
        color: #222;
        font-size: 28px;
      }
    }
  }
  .van-icon-clear {
    position: absolute;
    right: -75px;
    top: -20px;
    font-size: 30px;
    color: #cacaca;
    z-index: 2;
  }
  .active {
    color: red !important;
  }
}
</style>