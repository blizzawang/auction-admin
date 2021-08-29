import request from '@/utils/request'

export default {
  getPageList(page, limit) {
    return request({
      url: `/admin/store/list/${page}/${limit}`,
      method: 'get',
    })
  },
  lockStore(id,status) {
    return request({
      url: `/admin/store/status/${id}/${status}`,
      method: 'get',
    })
  },
}
