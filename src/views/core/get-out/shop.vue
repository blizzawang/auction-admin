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
    <el-table :data="shopList">
      <el-table-column label="拍品" width="300" align="center">
        <template slot-scope="scope">
          <div>
            <img style="float:left" :src="scope.row.shopIndexImage" />
            <p
              style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
            >
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.shopName"
                placement="top"
              >
                <label>{{ scope.row.shopName }}</label>
              </el-tooltip>
            </p>
            <br />
            <br />
            <br />
            <el-link type="danger">热榜</el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="storeName"
        label="所属店铺"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="shopStartPrice"
        label="起拍价"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="shopCurrentPrice"
        label="当前价"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="shopEarnestPrice"
        label="保证金"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="shopRetainPrice"
        label="保留价"
        align="center"
      ></el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="warning" size="mini">
            拍卖中
          </el-tag>
          <el-tag v-if="scope.row.status === 2" type="success" size="mini">
            已成交
          </el-tag>
          <el-tag v-if="scope.row.status === -1" type="danger" size="mini">
            撤拍
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="开拍时间"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="endTime"
        label="结束时间"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 1"
            type="primary"
            size="mini"
            @click="chepai(scope.row.id)"
          >
            撤拍
          </el-button>
          <el-button type="info" size="mini">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[2, 5, 10]"
      style="padding: 30px 0; "
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="changePageSize"
      @current-change="changeCurrentPage"
    />
  </div>
</template>

<script>
import shopApi from '@/api/core/shop'

export default {
  data() {
    return {
      userId: 0, //用户id
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 2, // 每页记录数
      shopList: []
    }
  },
  created() {
    // 获取商品列表
    this.fetchData()
  },
  methods: {
    // 获取商品列表
    fetchData() {
      shopApi.getPageList(this.page, this.limit).then(response => {
        this.shopList = response.data.pageModel.list
        this.total = response.data.pageModel.total
      })
    },
    // 点击撤拍按钮，将商品状态改为撤拍
    chepai(shopId) {
      shopApi.status(shopId).then(response => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        // 刷新数据
        this.fetchData()
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
    }
  }
}
</script>
