import request from '@/utils/request'

export default {
  getPageList(page, limit, keyword) {
    return request({
      url: `/admin/sellerAudit/list/${page}/${limit}`,
      method: 'get',  
      params: { keyword }
    })
  },
  changeAuditStatus(id, status) {
    return request({
      url: `/abc/withdraw/change/status/${id}/${status}`,
      method:'get'
    })
  }
}
