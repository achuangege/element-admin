<template>
  <div class="device-info-item" :class="{strip: hasStrip}">
    <div class="device-info-left">
      <h3 class="title">{{ data[0].name }}</h3>
      <span class="content">{{ data[0].value }}</span>
    </div>
    <div class="device-info-right">
      <h3 class="title">{{ data[1].name }}</h3>
      <span class="content">{{ data[1].value }}</span>
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
  }
}

.strip {
  background: #f8f8f8;
}
</style>
