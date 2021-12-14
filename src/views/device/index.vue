<template>
  <div class="app-container">
    <el-dialog
      custom-class="device-dialog"
      :close-on-click-modal="false"
      :fullscreen="controlPanelFullScreen"
      :visible.sync="controlPanelVisible"
      :show-close="false"
    >
      <div slot="title" class="title-container">
        <h3>控制面板</h3>
        <div class="operations fr">
          <svg-icon icon-class="icon-control-min" @click.native="controlPanelVisible=false" />
          <svg-icon icon-class="icon-control-fullscreen" @click.native="controlPanelFullScreen=!controlPanelFullScreen" />
          <svg-icon icon-class="icon-control-close" @click.native="controlPanelVisible=false" />
        </div>
      </div>
      <div class="device-info-container">
        <div class="device-info-header">
          <h3 class="fl">设备信息</h3>
        </div>

      </div>
      <span slot="footer" class="dialog-footer" />
    </el-dialog>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="50" type="index" />

      <el-table-column align="left" label="设备编号" width="180">
        <template slot-scope="scope">
          <!--          <svg-icon icon-class="computer-normal" style="font-size: 20px;" />-->
          <svg-icon icon-class="computer-warning" style="font-size: 16px;" />
          &nbsp;
          <span>{{ scope.row.deviceIdentifier }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="left" label="资产权属单位" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.department }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="120" label="适配进度">
        <template slot-scope="scope">
          <el-progress :percentage="scope.row.adaptProgress" :color="progressColor" />
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
      <el-table-column min-width="100" align="center" label="待处理事件">
        <template slot-scope="scope">
          <el-badge :value="scope.row.id % 30" class="item" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备状态">
        <template slot-scope="scope">
          <el-tag v-if="mod2IsZero(scope.row.softwareNums)" type="success">正常</el-tag>
          <el-tag v-else type="danger">脱机</el-tag>
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/device'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  components: { Pagination },
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
    handleControlPanel(deviceId) {
      this.controlPanelVisible = true
    },
    mod2IsZero(num) {
      return num % 2 === 0
    },
    progressColor(percentage) {
      if (percentage <= 50) {
        return '#1989fa'
      } else if (percentage < 90) {
        return '#f56c6c'
      } else {
        return '#5cb87a'
      }
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    }
  }
}
</script>

<style lang="scss">
.el-dialog.device-dialog {
  .el-dialog__header {
    padding: 0;
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
    box-shadow: 0px 3px 6px 0px
    rgba(0, 0, 0, 0.08);
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
}

</style>
