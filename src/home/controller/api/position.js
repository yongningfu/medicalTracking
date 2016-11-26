'use strict';
/**
 * rest controller
 * @type {Class}
 */
import Base from './base'
export default class extends Base {

    async getAction() {
        if (this.http.user !== null) {

            //如果为管理员 返回全部
            if (this.http.user.name == "admin") {
                let data =  await this.modelInstance.select();
                return this.success(data);
            }

            //加入时间限制 limit=endTime 1h、3h、12h、1d、3d、1w
            var time = this.http.get("limitTime");

            console.log(time);

            if (time != null && ["1h", "3h", "12h", "1d", "1w"].indexOf(time) >= 0) {
                var limitDate = Date.now()
                switch (time) {
                    case "1h":
                        limitDate -= 1000 * 60 * 60;
                        break;
                    case "3h":
                        limitDate -= 1000 * 60 * 60 * 3;
                        break;
                    case "12h":
                        limitDate -= 1000 * 60 * 60 * 12;
                        break;
                    case "1d":
                        limitDate -= 1000 * 60 * 60 * 24;
                        break;
                    case "1w":
                        limitDate -= 1000 * 60 * 60 * 24 * 7;
                        break;
                }

                limitDate = new Date(limitDate);
                console.log(think.datetime(limitDate));
                var endTime = think.datetime(limitDate);
                var endTimeString = endTime.toString();

                let data =  await this.modelInstance.where({launcher_id: this.http.user.id})
                    .where(`create_time >  '${endTimeString}'`)
                    .select();
                return this.success(data);
            }

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

    async deleteAction() {
        if (this.http.user !== null) {
            let affectedRows = await this.modelInstance.where({launcher_id: this.http.user.id}).delete();
            return this.success();
        } else {
            return this.fail(301, "You are not logged in");
        }
    }
}