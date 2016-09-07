'use strict';
/**
 * rest controller
 * @type {Class}
 */
export default class extends think.controller.rest {
  /**
   * init
   * @param  {Object} http []
   * @return {}      []
   */
  init(http){
    super.init(http);
  }
  /**
   * before magic method
   * @return {Promise} []
   */
  async __before(){
    //根据accessToken 找到用户的id 并用id进行后续的操作  accessToken都统一用参数传递
    let accessToken = this.get('accessToken') || this.post('accessToken');
    let user = await this.model('user').where({accessToken: accessToken}).find();
    if (think.isEmpty(user)) {
      this.http.user = null;
    } else {
      this.http.user = user;
    }

    //某些数据不返回---这个貌似一定要放在最后
    this.modelInstance.fieldReverse("password, retrieve_key, retrieve_time");
  }
}