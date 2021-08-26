<template>
  <div class="app-container">
    <el-form label-width="100px" class="form-table">
      <el-row>
        <el-col :span="6">
          <el-form-item label="创建时间">
            {{ seller.createTime }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="姓名">
            {{ seller.name }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="店铺名">
            {{ seller.storeName }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="地址">
            {{ seller.address }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="性别">
            {{ seller.sex }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号">
            {{ seller.phone }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="身份证号">
            {{ seller.idCard }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="联系人姓名">
            {{ seller.contactsName }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系人手机号">
            {{ seller.contactsMobile }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系人关系">
            {{ seller.contactsRelation }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="身份证正面">
            <span v-for="item in seller.sellerAttachVOList" :key="item.id">
              <el-image
                v-if="item.imageType == 'idCard1'"
                style="width: 150px;"
                :src="item.imageUrl"
                :preview-src-list="[item.imageUrl]"
              />
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="身份证反面">
            <span v-for="item in seller.sellerAttachVOList" :key="item.id">
              <el-image
                v-if="item.imageType == 'idCard2'"
                style="width: 150px;"
                :src="item.imageUrl"
                :preview-src-list="[item.imageUrl]"
              />
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="手持身份证照">
            <span v-for="item in seller.sellerAttachVOList" :key="item.id">
              <el-image
                v-if="item.imageType == 'idCard3'"
                style="width: 150px;"
                :src="item.imageUrl"
                :preview-src-list="[item.imageUrl]"
              />
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="text-align:center">
        <el-button @click="back">
          返回
        </el-button>
      </el-row>
    </el-form>

    <el-form label-width="170px">
      <el-form-item label="是否通过">
        <el-radio-group v-model="approvalForm.status">
          <el-radio :label="2">
            通过
          </el-radio>
          <el-radio :label="-1">
            不通过
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="基本信息是否正确">
        <el-radio-group v-model="approvalForm.isBaiscInfoOk">
          <el-radio :label="true">
            是
          </el-radio>
          <el-radio :label="false">
            否
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="身份证照是否正确">
        <el-radio-group v-model="approvalForm.isCardImageOk">
          <el-radio :label="true">
            是
          </el-radio>
          <el-radio :label="false">
            否
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="联系人是否合法">
        <el-radio-group v-model="approvalForm.isContactsOk">
          <el-radio :label="true">
            是
          </el-radio>
          <el-radio :label="false">
            否
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="approvalForm.momo" style="width: 300px;" />
      </el-form-item>

      <el-row style="text-align:center">
        <el-button type="primary" @click="approvalSubmit()">
          确定
        </el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
// 引入组件
import sellerApi from '@/api/core/seller'

export default {
  data() {
    return {
      seller: {}, //借款人信息
      saveBtnDisabled: false, //防止重复提交
      approvalForm: {
        //审批表单
        sellerId: 0,
        status: 2,
        momo: '',
        isBaiscInfoOk: true,
        isCardImageOk: true,
        isContactsOk: true
      }
    }
  },
  watch: {
    // 监听 `基本信息是否正确` 按钮的变化
    'approvalForm.isBaiscInfoOk'(val) {
      if (!val) {
        // 若选中false，则该项申请不允许通过
        this.approvalForm.status = -1
        // 在备注上注明不通过的原因
        this.approvalForm.momo = '基本信息核查有误，请重新申请!'
      }
    },
    // 监听 `身份证照是否正确` 按钮的变化
    'approvalForm.isCardImageOk'(val) {
      if (!val) {
        // 若选中false，则该项申请不允许通过
        this.approvalForm.status = -1
        // 在备注上注明不通过的原因
        this.approvalForm.momo = '身份证照核查有误，请重新申请!'
      }
    },
    // 监听 `联系人是否合法` 按钮的变化
    'approvalForm.isContactsOk'(val) {
      if (!val) {
        // 若选中false，则该项申请不允许通过
        this.approvalForm.status = -1
        // 在备注上注明不通过的原因
        this.approvalForm.momo = '联系人核查有误，请重新申请!'
      }
    }
  },
  created() {
    if (this.$route.params.id) {
      this.fetchDataById()
    }
  },

  methods: {
    fetchDataById() {
      sellerApi.show(this.$route.params.id).then(response => {
        this.seller = response.data.sellerDetailVO
      })
    },

    back() {
      // this.$router.push({path: '/core/seller/list'})
      this.$router.push('/core/seller/list')
    },

    approvalSubmit() {
      this.saveBtnDisabled = true
      this.approvalForm.sellerId = this.$route.params.id
      sellerApi.approval(this.approvalForm).then(response => {
        this.$message.success(response.message)
        this.$router.push('/core/seller/list')
      })
    }
  }
}
</script>
