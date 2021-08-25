<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true">
      <el-form-item label="关键字">
        <el-input v-model="keyword" placeholder="商品名称/商品备注" />
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
      <el-table-column prop="shopName" label="商品名称" />
      <el-table-column prop="shopPrice" label="商品价格" />
      <el-table-column prop="score" label="商品评分" />
      <el-table-column prop="storeStatus" label="店铺状态" />
      <el-table-column prop="memo" label="商品备注" />
      <el-table-column prop="createTime" label="操作时间" />
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
import borrowerApi from '@/api/core/borrower'

export default {
  data() {
    return {
      list: null, // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      keyword: '', // 查询表单对象
      storeId: 0 // 店铺id
    }
  },

  // 生命周期函数：内存准备完毕，页面尚未渲染
  created() {
    this.fetchData()
  },

  methods: {
    // 加载banner列表数据
    fetchData() {
      // 获取上一个页面传递过来的店铺id
      this.storeId = this.$route.query.id
      borrowerApi
        .getPageList(this.storeId, this.page, this.limit, this.keyword)
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
