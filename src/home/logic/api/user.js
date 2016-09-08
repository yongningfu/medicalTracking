'use strict';
/**
 * logic
 * @param  {} []
 * @return {}     []
 */
export default class extends think.logic.base {

  getAction() {

  }

  postAction(self) {

    console.log(self.post());
    this.rules = {
      name: "required|minLength:5|maxLength:25",
      password: "required|minLength:6",
      confirmPassword:"equals:password",
      "email": "required|email",
      "phone": "required|mobile"
    }
  }
}