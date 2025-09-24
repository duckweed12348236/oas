<template>
  <view class="container">
    <view class="profile-card">
      <view class="user-avatar">
        <uni-icons type="person" size="40" color="#fff"></uni-icons>
      </view>
      <view class="user-info">
        <text class="user-name">{{ user.name }}</text>
        <text class="user-email">{{ user.email }}</text>
        <view class="user-department">
          <uni-icons type="location" size="14" color="#999"></uni-icons>
          <text class="department-text">{{ user.department.name }}</text>
        </view>
      </view>
    </view>

    <view class="menu-container">
      <view class="menu-item" @click="goToChangePassword">
        <view class="menu-icon">
          <uni-icons type="locked" size="24" color="#007AFF"></uni-icons>
        </view>
        <view class="menu-content">
          <text class="menu-title">修改密码</text>
          <text class="menu-desc">定期修改密码提高账户安全性</text>
        </view>
        <view class="menu-arrow">
          <uni-icons type="arrowright" size="20" color="#ccc"></uni-icons>
        </view>
      </view>

      <view class="menu-item logout-item" @click="logout">
        <view class="menu-icon">
          <uni-icons type="undo" size="24" color="#ff4d4f"></uni-icons>
        </view>
        <view class="menu-content">
          <text class="menu-title logout-title">退出登录</text>
          <text class="menu-desc">退出当前账户</text>
        </view>
        <view class="menu-arrow">
          <uni-icons type="arrowright" size="20" color="#ccc"></uni-icons>
        </view>
      </view>
    </view>

    <view class="version-info">
      <text class="version-text">OA管理系统 v1.0.0</text>
    </view>
  </view>
</template>

<script setup>
import {reactive} from 'vue';

const user = reactive(uni.getStorageSync('user'))

const goToChangePassword = () => {
  uni.navigateTo({
    url: '/pages/password'
  })
}

const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: function (res) {
      if (res.confirm) {
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        })

        uni.removeStorageSync("user")
        uni.removeStorageSync("token")
        uni.navigateTo({
          url: '/pages/login'
        })
      }
    }
  })
}
</script>

<style scoped lang="scss">
.container {
  padding: 0 20rpx;
}

.profile-card {
  background: linear-gradient(90deg, #007AFF, #00BFFF);
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 10rpx 30rpx rgba(0, 122, 255, 0.2);
  margin-bottom: 30rpx;
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 30rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  display: block;
  margin-bottom: 10rpx;
}

.user-email {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  display: block;
  margin-bottom: 20rpx;
}

.user-department {
  display: flex;
  align-items: center;
}

.department-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-left: 10rpx;
}

.menu-container {
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.08);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.menu-item:last-child {
  border-bottom: none;
}

.logout-item {
  margin-top: 20rpx;
}

.menu-icon {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  background-color: #f0f8ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.menu-content {
  flex: 1;
}

.menu-title {
  font-size: 30rpx;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.logout-title {
  color: #ff4d4f;
}

.menu-desc {
  font-size: 24rpx;
  color: #999;
}

.menu-arrow {
  margin-left: 20rpx;
}

.version-info {
  text-align: center;
  margin-top: 20rpx;
}

.version-text {
  font-size: 24rpx;
  color: #999;
}
</style>