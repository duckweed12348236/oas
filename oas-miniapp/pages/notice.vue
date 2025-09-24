<template>
  <view class="notice-container">
    <uni-list>
      <uni-list-item
          v-for="(notice, index) in notices"
          :key="index"
          :title="notice.title"
          :note="`发布人：${notice.author.name}`"
          :rightText="notice.release_time.split('T')[0]"
          clickable
          @click="() => viewNoticeDetail(notice)"
          class="notice-item"/>
    </uni-list>

    <view class="no-data" v-if="notices.length === 0">
      <text>暂无通知</text>
    </view>
  </view>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {request} from '@/extensions/request';

const notices = ref([])

const fetchNoticeList = async () => {
  const response = await request.get('/user/notice')

  if (response.code === 1) {
    notices.value = response.data
  } else {
    uni.showToast({
      title: response.message
    })
  }
}

const viewNoticeDetail = (notice) => {
  uni.navigateTo({
    url: `/pages/notice-detail?notice=${encodeURIComponent(JSON.stringify(notice))}`
  })
}

onMounted(async () => {
  await fetchNoticeList()
})
</script>

<style scoped lang="scss">
.notice-container {
  padding: 20rpx;
  background-color: #f5f5f5;
}

.notice-item {
  margin-bottom: 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.no-data {
  text-align: center;
  padding: 40rpx;
  color: #999;
}
</style>