import request from '@/utils/request'

export default {
  getBuyerPageList(page, limit, searchObj,userType) {
    return request({
      url: `/admin/userInfo/list/buyer/${userType}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },

  lock(id, status) {
    return request({
      url: `/admin/userInfo/lock/${id}/${status}`,
      method: 'put'
    })
  },

  lockStore(id, status) {
    return request({
      url: `/admin/userInfo/lockStore/${id}/${status}`,
      method: 'put'
    })
  },


  getUserInfoStore(userId) {
    return request({
      url: `/admin/store/getStoreInfo/${userId}`,
      method: 'get'
    })
  }
}
