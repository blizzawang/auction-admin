import request from '@/utils/request'

export default {
  getPageList(storeId,page, limit, keyword) {
    return request({
      url: `/admin/getout/list/${storeId}/${page}/${limit}`,
      method: 'get',
      params: { keyword }
    })
  },
  show(id) {
    return request({
      url: `/admin/core/borrower/show/${id}`,
      method: 'get'
    })
  },
  approval(borrowerApproval) {
    return request({
      url: '/admin/core/borrower/approval',
      method: 'post',
      data: borrowerApproval
    })
  }
}
