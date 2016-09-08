'use strict';
/**
 * logic
 * @param  {} []
 * @return {}     []
 */
export default class extends think.logic.base {
  /**
   * index action logic
   * @return {} []
   */
  async indexAction(){
     let userInfo = await this.session("userInfo");
      //加入登录验证
     if (!userInfo) {
       return this.redirect('/login');
     }
  }
}