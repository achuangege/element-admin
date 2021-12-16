<template>
  <div>
    <el-form :model="softwareForm" label-width="100px">
      <el-form-item label="软件名称">
        <el-input v-model="softwareForm.softName" />
      </el-form-item>
      <el-form-item label="进程标识">
        <el-input v-model="softwareForm.processName" />
      </el-form-item>
      <el-form-item label="软件类型">
        <el-select v-model="softwareForm.softType" placeholder="请选择软件类型">
          <el-option label="应用软件" :value="1" />
          <el-option label="系统组件" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="软件类型">
        <el-select v-model="softwareForm.softType" placeholder="请选择软件类型">
          <el-option label="应用软件" :value="1" />
          <el-option label="系统组件" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="软件分类">
        <el-select v-model="softwareForm.groupId" placeholder="请选择软件分类">
          <el-option
            v-for="group in softwareGroups"
            :key="group.groupId"
            :label="group.groupName"
            :value="group.groupId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="软件运行架构">
        <el-select v-model="softwareForm.architecture" placeholder="请选运行架构">
          <el-option label="X86" :value="0" />
          <el-option label="龙芯3A3000/4000" :value="1" />
          <el-option label="龙芯3A5000" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="适配情况">
        <el-radio-group v-model="softwareForm.adapted">
          <el-radio-button :label="true" value="true">已适配</el-radio-button>
          <el-radio-button :label="false" value="false">未适配</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="管控开关">
        <el-radio-group v-model="softwareForm.globalControl">
          <el-radio-button :label="true" value="true">开</el-radio-button>
          <el-radio-button :label="false" value="false">关</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div style="text-align: right">
      <span class="dialog-footer">
        <el-button @click="$emit('cancel')">取 消</el-button>
        <el-button type="primary" @click="doUpdateSoftware()">修 改</el-button>
      </span>
    </div>
  </div>
</template>

<script>
import { fetchSoftware, updateSoftware } from '@/api/software'
import { fetchList } from '@/api/group'

export default {
  name: 'SoftwareEdit',
  props: {
    softwareId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      softwareForm: {},
      softwareGroups: []
    }
  },
  mounted() {
    fetchList().then(response => {
      this.softwareGroups = response.data
    })
    fetchSoftware(this.softwareId).then(response => {
      console.log(response)
      this.softwareForm = {
        ...response.data
      }
    })
  },
  methods: {
    doUpdateSoftware() {
      updateSoftware({
        ...this.softwareForm
      }).then(response => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.$emit('complete')
      })
    }
  }
}
</script>

<style scoped>

</style>
