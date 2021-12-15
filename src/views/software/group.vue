<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="50" type="index" />

      <el-table-column align="center" label="类别名称" prop="groupName" />
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
import { fetchList } from '@/api/software-group'
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
