<template>
  <div class="device-info-item" :class="{strip: hasStrip}">
    <div class="device-info-left">
      <h3 class="title">{{ data[0].name }}</h3>
      <el-tooltip class="item" effect="dark" :content="data[0].value ? data[0].value : '暂无'" placement="top-start">
        <span class="content">{{ data[0].value ? data[0].value : '暂无' }}</span>
      </el-tooltip>
    </div>
    <div class="device-info-right">
      <h3 class="title">{{ data[1].name }}</h3>
      <el-tooltip class="item" effect="dark" :content="data[1].value ? data[1].value : '暂无'" placement="top-start">
        <span class="content">{{ data[1].value ? data[1].value : '暂无' }}</span>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeviceInfoItem',
  props: ['data', 'hasStrip']
}
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
.device-info-item {
  height: 38px;
  line-height: 38px;
  font-size: 14px;
  border-radius: 6px;

  .device-info-left, .device-info-right {
    width: 50%;
    height: 100%;
    float: left;
  }

  .title, .content {
    float: left;
    font-size: 14px;
    font-weight: normal;
  }
  .title {
    width: 100px;
    text-align: right;
    color: #606266;
  }

  .content {
    color: #333333;
    margin-left: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 50%;
  }
}

.strip {
  background: #f8f8f8;
}
</style>
