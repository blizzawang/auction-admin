import request from '@/utils/request'

export default {
  show(id) {
    return request({
      url: `/admin/sellerAudit/show/${id}`,
      method: 'get'
    })
  },
  approval(borrowerApproval) {
    return request({
      url: '/admin/sellerAudit/detail/approval',
      method: 'post',
      data: borrowerApproval
    })
  }
}
