<script setup lang="js">
import {reactive} from 'vue';
import {request} from "@/extensions/request";

const account = reactive({
  email: '',
  password: ''
})

const login = async () => {
  if (!account.email) {
    uni.showToast({
      title: '请输入邮箱',
      icon: 'none'
    })
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(account.email)) {
    uni.showToast({
      title: '邮箱格式不正确',
      icon: 'none'
    })
    return
  }

  if (!account.password) {
    uni.showToast({
      title: '请输入密码',
      icon: 'none'
    })
    return
  }

  const response = await request.post("/user/login", account)
  if (response.code === 1) {
    await uni.setStorage({
      key: 'user',
      data: response.data.user
    })
    await uni.setStorage({
      key: 'token',
      data: response.data.token,
      success: () => {
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        })
        uni.switchTab({
          url: '/pages/leave-record'
        })
      }
    })
  } else {
    uni.showToast({
      title: response.message,
      icon: 'none'
    })
  }
}

const resetAccount = () => {
  account.email = ''
  account.password = ''
}
</script>

<template>
  <view class="login-container">
    <view class="login-header">
      <view class="header-decoration"></view>
      <text class="login-title">欢迎登录</text>
      <text class="login-subtitle">OA管理系统</text>
    </view>

    <view class="login-form">
      <view class="form-card">
        <view class="input-group">
          <view class="input-label">
            <uni-icons type="email" size="20" color="#007AFF"></uni-icons>
            <text class="label-text">邮箱地址</text>
          </view>
          <input
              class="login-input"
              v-model="account.email"
              type="text"
              placeholder="请输入您的邮箱"
              placeholder-class="input-placeholder"/>
        </view>

        <view class="input-group">
          <view class="input-label">
            <uni-icons type="locked" size="20" color="#007AFF"></uni-icons>
            <text class="label-text">登录密码</text>
          </view>
          <input
              class="login-input"
              v-model="account.password"
              type="password"
              placeholder="请输入您的密码"
              placeholder-class="input-placeholder"/>
        </view>

        <view class="form-actions">
          <button class="login-button" @click="login">登录</button>
          <button class="reset-button" @click="resetAccount">重置</button>
        </view>
      </view>
    </view>

    <view class="login-footer">
      <text class="footer-text">© 2025 OA管理系统</text>
      <text class="footer-text">All Rights Reserved</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.login-container {
  padding: 0 40rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.login-header {
  text-align: center;
  padding-top: 120rpx;
  padding-bottom: 80rpx;
}

.header-decoration {
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(45deg, #007AFF, #00BFFF);
  border-radius: 50%;
  margin: 0 auto 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);

  &::after {
    content: "";
    width: 60rpx;
    height: 60rpx;
    background: white;
    border-radius: 50%;
  }
}

.login-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.login-subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 10rpx;
  display: block;
}

.login-form {
  flex: 1;
}

.form-card {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.1);
  margin-bottom: 30rpx;
}

.input-group {
  margin-bottom: 40rpx;
}

.input-label {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.label-text {
  font-size: 28rpx;
  color: #333;
  margin-left: 15rpx;
  font-weight: 500;
}

.login-input {
  height: 80rpx;
  font-size: 30rpx;
  color: #333;
  border-bottom: 1rpx solid #eee;
  padding: 0 10rpx;

  &:focus {
    border-color: #007AFF;
  }
}

.input-placeholder {
  color: #999;
  font-size: 28rpx;
}

.form-actions {
  margin-top: 60rpx;
}

.login-button {
  height: 80rpx;
  line-height: 80rpx;
  background: linear-gradient(90deg, #007AFF, #00BFFF);
  color: #fff;
  font-size: 32rpx;
  border-radius: 40rpx;
  border: none;
  margin-bottom: 20rpx;
  box-shadow: 0 10rpx 20rpx rgba(0, 122, 255, 0.3);

  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 5rpx 15rpx rgba(0, 122, 255, 0.3);
  }
}

.reset-button {
  height: 80rpx;
  line-height: 80rpx;
  background-color: #f5f5f5;
  color: #666;
  font-size: 32rpx;
  border-radius: 40rpx;
  border: 1rpx solid #eee;

  &:active {
    background-color: #e0e0e0;
  }
}

.other-login {
  text-align: center;
  padding: 40rpx 0;
}

.divider {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}

.divider-line {
  flex: 1;
  height: 1rpx;
  background-color: #eee;
}

.divider-text {
  font-size: 24rpx;
  color: #999;
  margin: 0 20rpx;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 60rpx;
}

.social-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.05);

  &:active {
    transform: translateY(2rpx);
  }
}

.login-footer {
  text-align: center;
  padding: 40rpx 0;
}

.footer-text {
  display: block;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
  line-height: 40rpx;
}
</style>