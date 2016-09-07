'use strict';
/**
 * rest controller
 * @type {Class}
 */
import Base from './base'
export default class extends Base {

    async getAction() {
        if (this.http.user !== null) {
            let data =  await this.modelInstance.where({launcher_id: this.http.user.id}).select();
            return this.success(data);
        } else {
            return this.fail(301, "You are not logged in");
        }
    }

    async postAction() {
        if (this.http.user !== null) {
            let data = this.post();
            data.launcher_id = this.http.user.id;
            data.create_time = think.datetime();
            let insertId =  await this.modelInstance.add(data);
            return this.success({id: insertId});
        } else {
            return this.fail(301, "You are not logged in");
        }
    }
}