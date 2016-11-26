'use strict';
/**
 * rest controller
 * @type {Class}
 */

import Base from './base'
export default class extends Base {

    /**
     * 查找有用户资料
     * */
        async getAction() {
        var data;
        //资源id存在的时候
        if (this.id) {
            let userInfo = await this.modelInstance.where({accessToken: this.id}).find();
            if (think.isEmpty(userInfo)) {
                return this.fail(300, "user does not exist");
            } else {
                return this.success(userInfo);
            }

        } else {
            return this.fail(301, "You are not logged in");
        }
    }

    /**
     * 添加用户
     * */
    async postAction() {
        //查询用户名 邮箱 电话号码不重复
        let postData = this.post();
        let [name, email, phone] = await Promise.all([
            this.modelInstance.where({name: postData["name"]}).find(),
                this.modelInstance.where({email: postData["email"]}).find(),
                    this.modelInstance.where({phone: postData["phone"]}).find()]);

        if (think.isEmpty(name) && think.isEmpty(email) && think.isEmpty(phone)) {
            postData.accessToken = think.uuid();
            postData.retrieve_key = think.uuid();
            postData.create_time = think.datetime();
            let insertId = await this.modelInstance.add(postData);
            return this.success({"accessToken": postData.accessToken});
        } else {
            return this.fail(302, "name or email or phone exist");
        }
    }
}




















