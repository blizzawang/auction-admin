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
      <el-form-item label="店铺状态">
        <el-select
          v-model="searchObj.storeStatus"
          placeholder="请选择"
          clearable
        >
          <el-option label="未开店" value="0" />
          <el-option label="未开业" value="1" />
          <el-option label="营业中" value="2" />
          <el-option label="已查封" value="3" />
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

      <el-table-column prop="nickName" label="用户昵称" />
      <el-table-column prop="name" label="用户姓名" />
      <el-table-column prop="sex" label="性别" />
      <el-table-column prop="address" label="用户所在地" width="150" />
      <el-table-column prop="phone" label="手机号" width="110" />
      <el-table-column prop="idCard" label="身份证号" width="150" />
      <el-table-column prop="loginTime" label="最近登录时间" width="160" />
      <el-table-column label="绑定状态" width="90">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bindStatus === 0" type="warning" size="mini">
            未绑定
          </el-tag>
          <el-tag
            v-else-if="scope.row.bindStatus === 1"
            type="success"
            size="mini"
          >
            已绑定
          </el-tag>
          <el-tag v-else type="danger" size="mini">绑定失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="用户状态" width="90">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" type="danger" size="mini">
            锁定
          </el-tag>
          <el-tag v-else type="success" size="mini">
            正常
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="店铺状态" width="90">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.storeStatus === 0" type="" size="mini">
            未开店
          </el-tag>
          <el-tag
            v-else-if="scope.row.storeStatus === 1"
            type="info"
            size="mini"
          >
            未开业
          </el-tag>
          <el-tag
            v-else-if="scope.row.storeStatus === 2"
            type="success"
            size="mini"
          >
            营业中
          </el-tag>
          <el-tag
            v-else-if="scope.row.storeStatus === 3"
            type="danger"
            size="mini"
          >
            已查封
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="290">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 1"
            type="primary"
            size="mini"
            @click="lock(scope.row.id, 0)"
          >
            锁定
          </el-button>
          <el-button
            v-else
            type="danger"
            size="mini"
            @click="lock(scope.row.id, 1)"
          >
            解锁
          </el-button>
          <el-button
            v-if="scope.row.storeStatus === 3 && scope.row.storeStatus !== 0"
            type="danger"
            size="mini"
            @click="lockStore(scope.row.id, 1)"
          >
            解封店铺
          </el-button>
          <el-button
            v-if="scope.row.storeStatus !== 0 && scope.row.storeStatus !== 3"
            type="primary"
            size="mini"
            @click="lockStore(scope.row.id, 3)"
          >
            查封店铺
          </el-button>
          <el-button
            v-if="scope.row.storeStatus !== 0"
            type="primary"
            size="mini"
            @click="showStoreInfo(scope.row.id)"
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
      <el-table :data="storeInfo" border stripe>
        <el-table-column type="index" />
        <el-table-column prop="storeName" label="店铺名称" width="150" />
        <el-table-column prop="principalId" label="负责人" />
        <!-- <el-table-column prop="serviceScore" label="服务态度" /> -->
        <el-table-column prop="qualityScore" label="店铺评分" />
        <!-- <el-table-column prop="logisticsScore" label="物流服务" /> -->
        <el-table-column prop="openingTime" label="开店时长" width="160" />
        <el-table-column prop="getOut" label="违规统计" width="160">
          <el-badge :value="10" class="item">
            <el-button
              size="small"
              type="warning"
              @click="toGetOutView(storeInfo[0].id)"
            >
              查看违规详情
            </el-button>
          </el-badge>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import userInfoApi from '@/api/core/user-info'

export default {
  data() {
    return {
      list: null, // 数据列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 5, // 每页记录数
      searchObj: {}, // 查询条件
      storeInfo: [], // 店铺信息
      dialogTableVisible: false // 店铺信息对话框是否显示
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      userInfoApi
        .getBuyerPageList(this.page, this.limit, this.searchObj, 1)
        .then(response => {
          this.list = response.data.pageModel.list
          this.total = response.data.pageModel.total
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
    },
    // 清空查询条件
    resetData() {
      // 还原查询表单
      this.searchObj = {}
      // 重新获取一次数据
      this.fetchData()
    },
    // 锁定或解锁会员
    lock(id, status) {
      userInfoApi.lock(id, status).then(response => {
        // 刷新页面
        this.fetchData()
        this.$message.success(response.message)
      })
    },
    // 查封或解封店铺，当解封店铺时，店铺状态将修改为未开业
    lockStore(id, status) {
      userInfoApi.lockStore(id, status).then(response => {
        // 刷新页面
        this.fetchData()
        this.$message.success(response.message)
      })
    },
    // 展示店铺信息
    showStoreInfo(id) {
      this.dialogTableVisible = true
      userInfoApi.getUserInfoStore(id).then(response => {
        this.storeInfo = response.data.storeInfo
      })
    },
    // 前往违规详情页
    toGetOutView(id) {
      //指定跳转地址
      this.$router.push({
        path: '/core/get-out/list/',
        query: {
          id: id // 携带店铺id进行跳转
        }
      })
    }
  }
}
</script>
<style scoped>
.item {
  margin-top: 4px;
}
</style>
