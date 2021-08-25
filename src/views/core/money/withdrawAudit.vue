<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true">
      <el-form-item label="关键字">
        <el-input v-model="keyword" placeholder="姓名/手机/身份证" />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="fetchData()">
        查询
      </el-button>
      <el-button type="default" @click="resetData()">
        清空
      </el-button>
    </el-form>

    <!-- 列表 -->
    <el-table :data="list" stripe>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="userName" label="姓名" />
      <el-table-column prop="phone" label="手机号" width="120" />
      <el-table-column prop="idCard" label="身份证号" width="200" />
      <el-table-column prop="sex" label="性别" />
      <el-table-column prop="withdrawAmount" label="提现金额" />
      <el-table-column prop="poundage" label="手续费" />

      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="warning" size="mini">
            审核中
          </el-tag>
          <el-tag v-if="scope.row.status === 2" type="success" size="mini">
            审核通过
          </el-tag>
          <el-tag v-if="scope.row.status === -1" type="danger" size="mini">
            审核不通过
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="申请时间" width="160" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="auditAgree(scope.row.id)"
            v-if="list != null && scope.row.status === 1"
          >
            同意
          </el-button>
          <el-button
            v-if="list != null && scope.row.status === 1"
            type="warning"
            size="mini"
            @click="auditDisAgree(scope.row.id)"
          >
            拒绝
          </el-button>
          <el-button
            v-if="list != null && scope.row.status !== 1"
            type="info"
            size="mini"
          >
            审核完成
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[2, 10, 20]"
      style="padding: 30px 0; "
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="changePageSize"
      @current-change="changeCurrentPage"
    />
  </div>
</template>

<script>
import withdrawAuditApi from '@/api/core/withdraw-audit'

export default {
  data() {
    return {
      list: null, // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 2, // 每页记录数
      keyword: '' // 查询表单对象
    }
  },

  // 生命周期函数：内存准备完毕，页面尚未渲染
  created() {
    this.fetchData()
  },

  methods: {
    // 同意提现
    auditAgree(id) {
      withdrawAuditApi.changeAuditStatus(id, 2).then(response => {
        // 刷新页面
        this.fetchData()
        this.$message.success(response.message)
      })
    },
    // 不同意提现
    auditDisAgree(id) {
      withdrawAuditApi.changeAuditStatus(id, -1).then(response => {
        // 刷新页面
        this.fetchData()
        this.$message.success(response.message)
      })
    },
    // 加载banner列表数据
    fetchData() {
      withdrawAuditApi
        .getPageList(this.page, this.limit, this.keyword)
        .then(response => {
          this.list = response.data.pageModel.list
          this.total = response.data.pageModel.total
        })
    },

    // 每页记录数改变，size：回调参数，表示当前选中的“每页条数”
    changePageSize(size) {
      this.limit = size
      this.fetchData()
    },

    // 改变页码，page：回调参数，表示当前选中的“页码”
    changeCurrentPage(page) {
      this.page = page
      this.fetchData()
    },

    // 重置表单
    resetData() {
      this.keyword = ''
      this.fetchData()
    }
  }
}
</script>
