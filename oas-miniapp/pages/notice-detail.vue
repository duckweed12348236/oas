<template>
  <view class="detail-container">
    <view class="detail-card" v-if="notice">
      <view class="detail-header">
        <text class="detail-title">{{ notice.title }}</text>
        <view class="detail-meta">
          <text class="detail-author">发布人：{{ notice.author.name }}</text>
          <text class="detail-time">{{ formatTime(notice.release_time) }}</text>
        </view>
      </view>

      <view class="detail-content">
        <rich-text :nodes="notice.content"></rich-text>
      </view>
    </view>

    <view class="no-data" v-else>
      <text>加载中...</text>
    </view>
  </view>
</template>

<script setup>
import {onMounted, ref} from 'vue';

const notice = ref(null)

onMounted(() => {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  const options = current.options

  if (options && options.notice) {
    try {
      notice.value = JSON.parse(decodeURIComponent(options.notice));
    } catch (error) {
      uni.showToast({
        title: error.message,
        icon: 'error'
      })
    }
  }
})

const formatTime = (time) => {
  const date = new Date(time)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}
</script>

<style scoped lang="scss">
.detail-container {
  padding: 20rpx;
  background-color: #f5f5f5;
}

.detail-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.detail-header {
  padding-bottom: 30rpx;
  border-bottom: 1rpx solid #eee;
  margin-bottom: 30rpx;
}

.detail-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.detail-meta {
  display: flex;
  justify-content: space-between;
}

.detail-author, .detail-time {
  font-size: 26rpx;
  color: #999;
}

.detail-content {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;

  :deep(p) {
    margin-bottom: 20rpx;
  }

  :deep(img) {
    max-width: 100%;
  }
}

.no-data {
  text-align: center;
  padding: 40rpx;
  color: #999;
}
</style>