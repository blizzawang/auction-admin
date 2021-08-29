<template>
  <div class="app-container">
    <!-- 查询表单 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="手机号">
        <el-input v-model="searchObj.phone" placeholder="手机号" />
      </el-form-item>

      <el-form-item label="用户状态">
        <el-select v-model="searchObj.status" placeholder="请选择" clearable>
          <el-option label="正常" value="1" />
          <el-option label="锁定" value="0" />
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="fetchData()">
        查询
      </el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!-- 列表 -->
    <el-table :data="list" border stripe>
      <el-table-column label="#" width="50">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="storeName" label="店铺名称" />
      <el-table-column prop="name" label="店铺负责人" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="idCard" label="身份证号" />
      <el-table-column prop="score" label="店铺评分" />
      <el-table-column prop="idCard" label="违规记录">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.getOut }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="店铺状态" width="90">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" type="" size="mini">
            未开店
          </el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="info" size="mini">
            未开业
          </el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="success" size="mini">
            营业中
          </el-tag>
          <el-tag v-else-if="scope.row.status === 3" type="danger" size="mini">
            已查封
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="290">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 3 && scope.row.status !== 0"
            type="danger"
            size="mini"
            @click="lockStore(scope.row.id, 1)"
          >
            解封店铺
          </el-button>
          <el-button
            v-if="scope.row.status !== 0 && scope.row.status !== 3"
            type="primary"
            size="mini"
            @click="lockStore(scope.row.id, 3)"
          >
            查封店铺
          </el-button>
          <el-button
            v-if="scope.row.status !== 0"
            type="primary"
            size="mini"
            @click="showShopInfo(scope.row.id)"
          >
            查看店铺
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      @size-change="changePageSize"
      @current-change="changeCurrentPage"
      :current-page="page"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="padding:30px 0;"
    ></el-pagination>

    <!-- 用户登录日志对话框 -->
    <el-dialog title="用户登录日志" :visible.sync="dialogTableVisible">
      <el-table :data="loginRecordList" border stripe>
        <el-table-column type="index" />
        <el-table-column prop="ip" label="IP" />
        <el-table-column prop="createTime" label="登录时间" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import storeApi from '@/api/core/store'

export default {
  data() {
    return {
      list: null, // 数据列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 5, // 每页记录数
      searchObj: {}, // 查询条件
      loginRecordList: [], // 会员登录日志
      dialogTableVisible: false // 日志对话框是否显示
    }
  },
  mounted() {
    // 获取店铺总数据
    this.fetchData()
  },
  methods: {
    // 获取店铺总数据
    fetchData() {
      storeApi
        .getPageList(this.page, this.limit, this.searchObj)
        .then(response => {
          this.list = response.data.pageModel.list
          this.total = response.data.pageModel.total
        })
    },
    // 查封或解封店铺，当解封店铺时，店铺状态将修改为未开业
    lockStore(id, status) {
      storeApi.lockStore(id, status).then(response => {
        // 刷新页面
        this.fetchData()
        this.$message.success(response.message)
      })
    },
    // 查询该店铺下的商品信息
    showShopInfo(storeId) {
      // 跳转至所属拍品页面
      this.$router.push({
        path: 'store-shop',
        query: {
          storeId: storeId
        }
      })
    },
    // 当修改每页显示的记录数时调用此函数
    changePageSize(size) {
      this.limit = size
      // 重新获取一次数据
      this.fetchData()
    },
    // 当点击页码进行页面切换时调用此函数
    changeCurrentPage(page) {
      this.page = page
      // 重新获取一次数据
      this.fetchData()
    }
  }
}
</script>
