import request from '@/utils/request'

export default {
  getPageList(page, limit, keyword) {
    return request({
      url: `/admin/withdraw/list/${page}/${limit}`,
      method: 'get',  
      params: { keyword }
    })
  },
  changeAuditStatus(id, status) {
    return request({
      url: `/admin/withdraw/change/status/${id}/${status}`,
      method:'get'
    })
  }
}
