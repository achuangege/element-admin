<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="50" type="index" />

      <el-table-column align="left" label="设备编号" width="180" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <svg-icon v-if="scope.row.adaptProgress <= 50" icon-class="device-blue" style="font-size: 16px;" />
          <svg-icon v-else icon-class="device-red" style="font-size: 16px;" />
          <span class="spacer" />
          <span>{{ scope.row.deviceIdentifier }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="left" label="资产权属单位" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.department }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="left" label="使用部门" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.branch }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="120" label="适配进度">
        <template slot-scope="scope">
          <el-progress :percentage="parseInt(scope.row.adaptProgress)" :color="progressColor" />
          <!--          外设：<el-progress :percentage="parseInt(scope.row.externalAdaptProgress)" :color="progressColor" />-->
        </template>
      </el-table-column>
      <el-table-column min-width="80" align="center" label="软件数量">
        <template slot-scope="scope">
          <span>{{ scope.row.softwareNums }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80" align="center" label="外设数量">
        <template slot-scope="scope">
          <span>{{ scope.row.externalsNums }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备状态">
        <template slot-scope="scope">
          <span v-if="mod2IsZero(scope.row.softwareNums)">
            <svg-icon icon-class="icon-watching" /> 正常
          </span>
          <span v-else>
            <svg-icon icon-class="icon-alert" /> 脱机
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="140" label="最近上线时间">
        <template>
          <span>{{ new Date().getTime() | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column width="100px" label="Importance">
              <template slot-scope="scope">
                <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
              </template>
            </el-table-column>-->
      <el-table-column align="center" label="操作" width="80" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleControlPanel(scope.row.id)">控制面板</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <el-dialog
      width="70%"
      :lock-scroll="true"
      custom-class="device-dialog"
      :close-on-click-modal="false"
      :fullscreen="controlPanelFullScreen"
      :visible.sync="controlPanelVisible"
      :show-close="false"
    >
      <div slot="title" class="title-container ">
        <h3>控制面板</h3>
        <div class="operations fr">
          <svg-icon icon-class="icon-control-min" @click.native="controlPanelVisible=false" />
          <svg-icon
            icon-class="icon-control-fullscreen"
            @click.native="controlPanelFullScreen=!controlPanelFullScreen"
          />
          <svg-icon icon-class="icon-control-close" @click.native="controlPanelVisible=false" />
        </div>
      </div>
      <div class="device-info-container static-info">
        <div class="device-info-header clearfix">
          <h3>设备信息</h3>
        </div>
        <div class="device-info-body">
          <device-info-item
            :has-strip="true"
            :data="[{name: '设备编号', value: device.deviceIdentifier}, {name: '主板型号', value: device.devBiosModel}, ]"
          />
          <device-info-item
            :data="[{name: '处理器', value: device.devProcessor}, {name: '内存', value: `${(device.memorySize / (1024 * 1024)).toFixed(2)}G`}, ]"
          />
          <device-info-item
            :has-strip="true"
            :data="[{name: '显卡', value: device.devGraphicsCard}, {name: '适配度', value: `${device.adaptProgress}%`}, ]"
          />
          <device-info-item
            :data="[{name: '存储信息', value: formatStorage(device.driveInfos)}, {name: '操作系统', value: device.devOperatingSystem}, ]"
          />
          <device-info-item
            :has-strip="true"
            :data="[{name: '设备类型', value: device.devType}, {name: '使用方式', value: device.devUseWay}, ]"
          />
          <device-info-item
            :data="[{name: '权属单位', value: device.department}, {name: '使用部门', value: device.branch}, ]"
          />
          <device-info-item
            :has-strip="true"
            :data="[{name: '联系方式', value: device.phone}, {name: '运行状态', value: '正常'}, ]"
          />

        </div>
      </div>
      <div class="device-adapt-container clearfix">
        <div class="device-info-container software">
          <div class="device-info-header clearfix">
            <h3 class="fl">软件列表</h3>
            <span class="tip-name">已安装软件：</span>
            <span class="tip-value">{{ device.softwares.length }}</span>
            <span class="tip-name">已适配软件：</span>
            <span class="tip-value">3</span>
          </div>
          <div class="device-info-body">
            <el-table
              stripe
              :border="false"
              :data="device.softwares"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                width="100"
                align="center"
                label="序号"
              />
              <el-table-column
                prop="softName"
                label="软件名称"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="类型"
                align="center"
                width="80"
              >
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.softType === 1" type="primary">应用软件</el-tag>
                  <el-tag v-else-if="scope.row.softType === 2" type="warning">系统组件</el-tag>
                  <span v-else>其他</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="适配情况"
                width="100"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.softType == 2">
                    无需适配
                  </span>
                  <span v-else-if="scope.row.adapted">
                    <svg-icon icon-class="icon-ok" />
                    已适配
                  </span>
                  <span v-else>
                    <svg-icon icon-class="icon-error" />
                    未适配
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                width="120"
                label="管控开关"
              >
                <template slot-scope="scope">
                  关
                  &nbsp;
                  <el-switch
                    v-if="scope.row.softType != 1"
                    v-model="scope.row.control"
                    disabled
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  />
                  <el-switch
                    v-else-if="scope.row.globalControl"
                    v-model="scope.row.globalControl"
                    disabled
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  />
                  <el-switch
                    v-else
                    v-model="scope.row.control"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="updateControl(scope.row)"
                  />
                  &nbsp;
                  开
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="device-info-container external">
          <div class="device-info-header">
            <h3>外设列表</h3>
            <span class="tip-name">连接外设：</span>
            <span class="tip-value">{{ device.externals.length }}</span>
          </div>
          <div class="device-info-body">
            <el-table
              stripe
              :data="device.externals"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                width="100"
                align="center"
                label="序号"
              />
              <el-table-column
                prop="externalName"
                label="外设名称"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                align="center"
                width="160"
                label="适配情况"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.adapted">
                    <svg-icon icon-class="icon-ok" />
                    已适配
                  </span>
                  <span v-else>
                    <svg-icon icon-class="icon-error" />
                    未适配
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" />
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchDevice } from '@/api/device'
import Pagination from '@/components/Pagination'
import DeviceInfoItem from '@/views/device/components/DeviceInfoItem'
import { updateDeviceSoftware } from '@/api/device-software'
// Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  components: { DeviceInfoItem, Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      controlPanelVisible: false,
      controlPanelFullScreen: false,
      customColors: [
        { color: '#1989fa', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#f56c6c', percentage: 60 },
        { color: '#5cb87a', percentage: 100 }
      ],
      device: {
        devBiosModel: null,
        adaptProgress: null,
        department: null,
        branch: null,
        devComputerModel: null,
        devExternalInterface: null,
        devGraphicsCard: null,
        devNetworkAdapter: null,
        devOperatingSystem: null,
        devProcessor: null,
        devType: null,
        devUseWay: null,
        deviceId: null,
        deviceIdentifier: null,
        driveInfos: null,
        ipAddresses: null,
        memorySize: null,
        phone: null,
        devTyppe: null,
        softwares: [],
        externals: []
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    formatStorage(driveInfo) {
      const drives = driveInfo && driveInfo.split(';')
      if (!drives) {
        return null
      }
      let result = ''
      for (let i = 0; i < drives.length; i++) {
        if (!drives[i]) {
          continue
        }
        const reg = /([A-Z]):\\\(([0-9]+),([0-9]+),([0-9]+)\)/
        const matched = reg.exec(drives[i])
        const used = ((matched[3] / (1024 * 1024 * 1024))).toFixed(2)
        const total = ((matched[2] / (1024 * 1024 * 1024))).toFixed(0)
        result += `${matched[1]}盘:(${used}GB/${total}GB)`
        result += ' '
      }
      return result
    },
    handleControlPanel(deviceId) {
      this.controlPanelVisible = true
      fetchDevice(deviceId).then(response => {
        this.device = {
          ...response.data
        }
      })
    },
    mod2IsZero(num) {
      return num % 2 === 0
    },
    progressColor(percentage) {
      if (percentage <= 20) {
        return '#1989ff'
      } else if (percentage <= 40) {
        return '#2fa0e2'
      } else if (percentage <= 60) {
        return '#45b1c7'
      } else if (percentage <= 80) {
        return '#5bc2aa'
      } else {
        return '#71d48c'
      }
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    updateControl(software) {
      updateDeviceSoftware({
        softId: software.softId,
        deviceId: this.device.deviceId,
        control: software.control
      }).then(response => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      })
    }
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  font-weight: normal;
}

.el-dialog.device-dialog {
  .el-table th.is-leaf, .el-table td {
    border: none;
  }

  .el-table tr {
    border-radius: 6px;
  }

  .el-table::before {
    height: 0;
  }

  .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0 30px 36px;
    margin: 0;
  }
}
</style>

<style lang="scss" scoped>
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}

.el-dialog.device-dialog {
  .el-dialog__header {
    padding: 0;
  }

  .title-container {
    padding: 10px 18px;
    height: 40px;
    background-color: #ffffff;
    box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.08);

    h3 {
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 20px;
      color: #606266;
      margin: 0;
      float: left;
    }

    .operations {
      .svg-icon {
        margin-left: 12px;
        font-size: 12px;
        cursor: pointer;
      }
    }
  }

  .device-info-container {
    &.static-info {
      border-bottom: 1px solid #dfe6ec;
    }

    &.software {
      width: 50%;
      float: left;
      padding-right: 10px;
      border-right: solid 1px #dfe6ec;
    }

    &.external {
      width: 49%;
      float: right;
    }

    padding-bottom: 30px;
    padding-top: 36px;

    .device-info-header {
      h3 {
        margin: 0 0 0 30px;
        font-size: 18px;
        color: #333333;
        padding: 0;
        float: left;
      }

      .tip-name, .tip-value {
        font-size: 12px;
        line-height: 20px;
      }

      .tip-name {
        color: #999999;
        margin-left: 40px;
      }

      .tip-value {
        color: #333333;
      }
    }

    .device-info-body {
      margin-top: 25px;
    }
  }
}

.device-adapt-container {
}

</style>
