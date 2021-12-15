<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="50" type="index" />

      <el-table-column align="left" width="300" :show-overflow-tooltip="true" label="软件名称" prop="softName" />
      <el-table-column align="left" width="300" :show-overflow-tooltip="true" label="所属类别" prop="groupName" />
      <el-table-column align="left" width="300" :show-overflow-tooltip="true" label="所属包" prop="packageName" />
      <el-table-column align="left" width="300" :show-overflow-tooltip="true" label="软件名称" prop="softName" />
      <el-table-column align="center" label="运行架构" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.architecture == 0">X86</el-tag>
          <el-tag v-if="scope.row.architecture == 1">MIPS</el-tag>
          <el-tag v-if="scope.row.architecture == 2">LoongArch</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="160"
        label="管控开关"
      >
        <template slot-scope="scope">
          <el-switch
            v-if="scope.row.architecture === 0"
            v-model="scope.row.adapted"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" width="180" prop="createAt" />
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { fetchList } from '@/api/external'
import Pagination from '@/components/Pagination'

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
