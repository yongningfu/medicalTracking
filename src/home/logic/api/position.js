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
    this.rules = {
      accessToken: "required",
      longitude: "required|float",
      latitude:"required|float"
    }
  }
}