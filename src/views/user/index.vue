<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="50" type="index" />

      <el-table-column align="left" :show-overflow-tooltip="true" label="软件名称" prop="softName" />
      <el-table-column align="center" width="160" :show-overflow-tooltip="true" label="所属类别" prop="groupName">
        <template slot-scope="scope">
          <span v-if="scope.row.groupName">{{ scope.row.groupName }}</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="160" :show-overflow-tooltip="true" label="类型" prop="groupName">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.softType === 1" type="primary">应用软件</el-tag>
          <el-tag v-else-if="scope.row.softType === 2" type="warning">系统组件</el-tag>
          <span v-else>其他</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200" :show-overflow-tooltip="true" label="适配情况">
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
          &nbsp;<span class="spacer" />
          <el-switch
            v-if="scope.row.softType == 1"
            v-model="scope.row.adapted"
            @change="updateAdapted(scope.row)"
          />
          <el-switch v-else v-model="scope.row.adapted" disabled @change="updateAdapted(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="运行环境" width="160">
        <template slot-scope="scope">
          <span v-if="scope.row.architecture == 0">X86</span>
          <span v-if="scope.row.architecture == 1">龙芯3A3000/4000</span>
          <span v-if="scope.row.architecture == 2">龙芯3A5000</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="160"
        label="管控开关"
      >
        <template slot-scope="scope">
          关
          &nbsp;
          <el-switch
            v-if="scope.row.softType != 1"
            v-model="scope.row.globalControl"
            active-color="#13ce66"
            inactive-color="#ff4949"
            disabled
          />
          <el-switch
            v-else-if="scope.row.architecture === 0"
            v-model="scope.row.globalControl"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="updateGlobalControl(scope.row)"
          />
          <el-switch
            v-else
            disabled
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="updateGlobalControl(scope.row)"
          />
          &nbsp;
          开
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" width="200" prop="createAt" />
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-link :underline="false" type="primary" @click="handleEdit(scope.row.softId)">编辑</el-link>
          &nbsp;
          &nbsp;
          &nbsp;
          &nbsp;
          <el-link :underline="false" type="danger">删除</el-link>
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
    <el-dialog title="修改软件信息" :visible="editDialogVisible" @close="editDialogVisible = false">
      <SoftwareEdit
        v-if="editDialogVisible"
        :software-id="editSoftwareId"
        @cancel="editDialogVisible = false"
        @complete="editDialogVisible=false;getList()"
      />
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, updateUser } from '@/api/user'
import Pagination from '@/components/Pagination'
import SoftwareEdit from './components/SoftwareEdit'

export default {
  name: 'UserList',
  components: { Pagination, SoftwareEdit },
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
      editDialogVisible: false,
      editSoftwareId: null,
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
    handleEdit(softId) {
      this.editSoftwareId = softId
      this.editDialogVisible = true
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
    updateAdapted(software) {
      updateSoftware({
        softId: software.softId,
        adapted: software.adapted
      }).then(response => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      })
    },
    updateGlobalControl(software) {
      updateSoftware({
        softId: software.softId,
        globalControl: software.globalControl
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
</style>
