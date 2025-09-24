<template>
  <view class="container">
    <view class="form-container">
      <view class="form-header">
        <text class="form-title">申请休假</text>
      </view>

      <view class="form-content">
        <view class="form-item">
          <text class="form-label">休假类型</text>
          <picker mode="selector" :range="leaveRecordTypes" range-key="name" @change="chooseType">
            <view class="picker">
              {{ selectedLeaveRecordTypeName || '请选择休假类型' }}
              <text class="arrow-icon">▼</text>
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="form-label">休假时长</text>
          <uni-datetime-picker type="daterange" v-model="leaveRecord.range">
            <view class="picker">
              {{
                leaveRecord.range.length !== 0 ? `${leaveRecord.range[0]} 至 ${leaveRecord.range[1]}` : '请选择休假时长'
              }}
              <text class="arrow-icon">▼</text>
            </view>
          </uni-datetime-picker>
        </view>

        <view class="form-item">
          <text class="form-label">休假事由</text>
          <textarea
              v-model="leaveRecord.reason"
              placeholder="请输入休假事由"
              class="reason-textarea"/>
        </view>

        <button class="submit-button" @click="createLeaveRecord">提交申请</button>
      </view>
    </view>

    <view class="record-container">
      <view class="record-header">
        <text class="record-title">休假记录</text>
      </view>

      <view v-if="leaveRecords.length === 0" class="empty-record">
        <text class="empty-icon">ℹ</text>
        <text class="empty-text">暂无休假记录</text>
      </view>

      <view v-else class="record-list">
        <view
            v-for="(record, index) in leaveRecords"
            :key="index"
            class="record-item">
          <view class="record-header-info">
            <view class="record-type">{{ record.type.name }}</view>
            <view :class="['record-status', statusTags[record.status].style]">
              {{ statusTags[record.status].label }}
            </view>
          </view>

          <view class="record-content">
            <view class="record-reason">
              <text class="label">事由：</text>
              <text>{{ record.reason }}</text>
            </view>

            <view class="record-time">
              <text class="label">时间：</text>
              <text>{{ record.begin }} 至 {{ record.end }}</text>
            </view>

            <view class="record-initiation">
              <text class="label">申请时间：</text>
              <text>
                {{
                  record.initiation_time === ''
                      ? ''
                      : record.initiation_time.replace('T', ' ').substring(0, 16)
                }}
              </text>
            </view>

            <view v-if="record.approver" class="record-approver">
              <text class="label">审批人：</text>
              <text>{{ record.approver.name }}</text>
            </view>

            <view v-if="record.reply" class="record-reply">
              <text class="label">回复：</text>
              <text>{{ record.reply }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import {reactive, ref, onMounted} from 'vue';
import {request} from "@/extensions/request";

const leaveRecord = reactive({
  reason: '',
  type_id: null,
  range: []
})

const leaveRecords = ref([])

const leaveRecordTypes = ref([])

const selectedLeaveRecordTypeName = ref('')

const fetchLeaveRecords = async () => {
  const response = await request.get('/user/leave-record')
  if (response.code === 1) {
    leaveRecords.value = response.data
  } else {
    uni.showToast({
      title: response.message
    })
  }
}

const fetchLeaveRecordTypes = async () => {
  const response = await request.get('/user/leave-record-type')
  if (response.code === 1) {
    leaveRecordTypes.value = response.data
  } else {
    uni.showToast({
      title: response.message
    })
  }
}

const createLeaveRecord = async () => {
  if (!leaveRecord.type_id) {
    uni.showToast({
      title: '请选择休假类型',
      icon: 'none'
    })
    return
  }

  if (leaveRecord.range.length === 0) {
    uni.showToast({
      title: '请选择开始时间',
      icon: 'none'
    })
    return
  }

  if (!leaveRecord.reason) {
    uni.showToast({
      title: '请输入休假事由',
      icon: 'none'
    })
    return
  }

  const response = await request.post('/user/leave-record', {
    type_id: leaveRecord.type_id,
    reason: leaveRecord.reason,
    begin: leaveRecord.range[0],
    end: leaveRecord.range[1]
  })

  if (response.code === 1) {
    uni.showToast({
      title: '提交成功',
      icon: 'success'
    })

    selectedLeaveRecordTypeName.value = ''
    leaveRecord.reason = ''
    leaveRecord.type_id = null
    leaveRecord.range = []
    leaveRecords.value.push(response.data)
  } else {
    uni.showToast({
      title: response.message
    })
  }
}

const chooseType = (e) => {
  leaveRecord.type_id = leaveRecordTypes.value[e.detail.value].id
  selectedLeaveRecordTypeName.value = leaveRecordTypes.value[e.detail.value].name
}

const statusTags = {
  0: {
    label: '审批中',
    style: 'status-pending'
  },
  1: {
    label: '已通过',
    style: 'status-approved'
  },
  2: {
    label: '已拒绝',
    style: 'status-rejected'
  }
}

const formatDateTime = (datetime) => {
  if (!datetime) return ''
  return datetime
}

onMounted(async () => {
  await fetchLeaveRecordTypes()
  await fetchLeaveRecords()
})
</script>

<style scoped lang="scss">
.container {
  padding: 20rpx;
  background-color: #f5f5f5;
}

.form-container {
  background-color: #fff;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.form-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.form-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.form-content {
  padding: 30rpx;
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

.picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  padding: 0 20rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 10rpx;
  color: #666;
}

.arrow-icon {
  color: #999;
  font-size: 20rpx;
}

.reason-textarea {
  width: 100%;
  height: 200rpx;
  padding: 20rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 10rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
}

.submit-button {
  height: 80rpx;
  line-height: 80rpx;
  background: linear-gradient(90deg, #007AFF, #00BFFF);
  color: #fff;
  font-size: 32rpx;
  border-radius: 40rpx;
  border: none;
  margin-top: 20rpx;
  box-shadow: 0 10rpx 20rpx rgba(0, 122, 255, 0.3);

  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 5rpx 15rpx rgba(0, 122, 255, 0.3);
  }
}

.record-container {
  background-color: #fff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.record-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.record-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.empty-record {
  padding: 100rpx 0;
  text-align: center;
}

.empty-icon {
  font-size: 40rpx;
  color: #ccc;
}

.empty-text {
  display: block;
  margin-top: 20rpx;
  color: #999;
  font-size: 28rpx;
}

.record-list {
  padding: 20rpx;
}

.record-item {
  border: 1rpx solid #f0f0f0;
  border-radius: 15rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.record-header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background-color: #f9f9f9;
}

.record-type {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}

.record-status {
  font-size: 24rpx;
  padding: 8rpx 20rpx;
  border-radius: 30rpx;
}

.status-pending {
  background-color: #fff7e6;
  color: #fa8c16;
}

.status-approved {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-rejected {
  background-color: #fff1f0;
  color: #f5222d;
}

.record-content {
  padding: 20rpx;
}

.record-reason,
.record-time,
.record-initiation,
.record-approver,
.record-reply {
  margin-bottom: 15rpx;
  font-size: 26rpx;
  color: #666;
  display: flex;
}

.record-reason .label,
.record-time .label,
.record-initiation .label,
.record-approver .label,
.record-reply .label {
  font-weight: 500;
  color: #333;
  min-width: 120rpx;
}
</style>