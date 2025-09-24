<template>
  <view class="container">
    <view class="password-header">
      <view class="header-decoration"></view>
      <text class="header-title">修改密码</text>
    </view>

    <view class="form-container">
      <view class="form-item">
        <text class="form-label">原密码</text>
        <view class="input-wrapper">
          <uni-easyinput
              type="password"
              v-model="passwordGroup.oldPassword"
              placeholder="请输入原密码"
              :focus="false"
          />
        </view>
      </view>

      <view class="form-item">
        <text class="form-label">新密码</text>
        <view class="input-wrapper">
          <uni-easyinput
              type="password"
              v-model="passwordGroup.newPassword"
              placeholder="请输入新密码"
              :focus="false"
          />
        </view>
      </view>

      <view class="form-item">
        <text class="form-label">确认新密码</text>
        <view class="input-wrapper">
          <uni-easyinput
              type="password"
              v-model="passwordGroup.confirmPassword"
              placeholder="请再次输入新密码"
              :focus="false"
          />
        </view>
      </view>

      <view class="password-requirements">
        <text class="requirements-title">密码要求：</text>
        <view class="requirement-item">
          <uni-icons
              :type="passwordValidations.lengthGreaterThan6 ? 'checkmarkempty' : 'closeempty'"
              :color="passwordValidations.lengthGreaterThan6 ? '#52c41a' : '#ff4d4f'"
              size="16"/>
          <text :class="['requirement-text', { valid: passwordValidations.lengthGreaterThan6 }]">长度至少6位</text>
        </view>
        <view class="requirement-item">
          <uni-icons
              :type="passwordValidations.lengthLessThan20 ? 'checkmarkempty' : 'closeempty'"
              :color="passwordValidations.lengthLessThan20 ? '#52c41a' : '#ff4d4f'"
              size="16"/>
          <text :class="['requirement-text', { valid: passwordValidations.lengthLessThan20 }]">长度至多20位</text>
        </view>
      </view>

      <button class="submit-button" @click="resetPassword">
        <text class="button-text">确认修改</text>
      </button>
    </view>

    <view class="tips-container">
      <view class="tip-item">
        <uni-icons type="help" size="16" color="#007AFF"></uni-icons>
        <text class="tip-text">定期更换密码有助于提高账户安全性</text>
      </view>
      <view class="tip-item">
        <uni-icons type="locked" size="16" color="#007AFF"></uni-icons>
        <text class="tip-text">新密码不能与原密码相同</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import {reactive, computed} from 'vue';
import {request} from "@/extensions/request";

const passwordGroup = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordValidations = computed(() => {
  const password = passwordGroup.newPassword
  return {
    lengthGreaterThan6: password.length >= 6,
    lengthLessThan20: password.length <= 20 && password.length > 0
  }
})

const resetPassword = async () => {
  if (!passwordGroup.oldPassword) {
    uni.showToast({
      title: '请输入原密码',
      icon: 'none'
    })
    return
  }

  if (!passwordGroup.newPassword) {
    uni.showToast({
      title: '请输入新密码',
      icon: 'none'
    })
    return
  }

  if (!passwordGroup.confirmPassword) {
    uni.showToast({
      title: '请确认新密码',
      icon: 'none'
    })
    return
  }

  if (!passwordValidations.value.length1 || !passwordValidations.value.length2) {
    uni.showToast({
      title: '新密码不符合要求',
      icon: 'none'
    })
    return
  }

  if (passwordGroup.newPassword !== passwordGroup.confirmPassword) {
    uni.showToast({
      title: '两次输入的密码不一致',
      icon: 'none'
    })
    return
  }

  if (passwordGroup.oldPassword === passwordGroup.newPassword) {
    uni.showToast({
      title: '新密码不能与原密码相同',
      icon: 'none'
    })
    return
  }

  const response = await request.post('/user/password', {
    old_password: passwordGroup.oldPassword,
    new_password: passwordGroup.newPassword,
    confirm_password: passwordGroup.confirmPassword
  })

  if (response.code === 1) {
    uni.showToast({
      title: '密码修改成功',
      icon: 'success'
    })
    Object.assign(passwordGroup, {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  } else {
    uni.showToast({
      title: response.message,
      icon: 'none'
    })
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 0 20rpx;
}

.password-header {
  display: flex;
  align-items: center;
  padding: 30rpx 0;
}

.header-decoration {
  width: 8rpx;
  height: 36rpx;
  background: linear-gradient(to bottom, #007AFF, #00BFFF);
  border-radius: 4rpx;
  margin-right: 20rpx;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.form-container {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.08);
  margin-bottom: 30rpx;
}

.form-item {
  margin-bottom: 40rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
  font-weight: 500;
}

.input-wrapper {
  border: 1rpx solid #e0e0e0;
  border-radius: 12rpx;
  overflow: hidden;
}

.password-requirements {
  background-color: #f9f9f9;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 40rpx;
}

.requirements-title {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 15rpx;
}

.requirement-item {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.requirement-item:last-child {
  margin-bottom: 0;
}

.requirement-text {
  font-size: 24rpx;
  color: #999;
  margin-left: 10rpx;
}

.requirement-text.valid {
  color: #52c41a;
}

.submit-button {
  height: 80rpx;
  background: linear-gradient(90deg, #007AFF, #00BFFF);
  color: #fff;
  font-size: 32rpx;
  border-radius: 40rpx;
  border: none;
  box-shadow: 0 10rpx 20rpx rgba(0, 122, 255, 0.3);

  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 5rpx 15rpx rgba(0, 122, 255, 0.3);
  }
}

.button-text {
  color: #fff;
}

.tips-container {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.08);
}

.tip-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.tip-item:last-child {
  margin-bottom: 0;
}

.tip-text {
  font-size: 24rpx;
  color: #666;
  margin-left: 15rpx;
  line-height: 1.5;
}
</style>