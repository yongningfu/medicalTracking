'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
    //auto render template file index_index.html
    return this.display();
  }

  /**
   * post Login
   * */
  async dologinAction() {
    let data = this.post();
    //加密？

    let userRecord  = await this.model("user").where({name: data.name}).find();
    if (data.password === userRecord.password) {
      await this.session("userInfo", userRecord);
      //把用户的id存入cookie accessToken也存入
      this.cookie("id", userRecord.id);
      this.cookie("accessToken", userRecord.accessToken);
      return this.success({accessToken: userRecord.accessToken, id: userRecord.id});
    } else {
      return this.fail(-1, "用户名或者密码错误");
    }
  }
}