import request from '@/utils/request'

export default {
  getPageList(storeId,page, limit) {
    return request({
      url: `/admin/shop/list/${storeId}/${page}/${limit}`,
      method: 'get',
    })
  },
  status(shopId) {
    return request({
      url: `login/shop/status/-1/${shopId}`,
      method: 'get',
    })
  },
  
}
