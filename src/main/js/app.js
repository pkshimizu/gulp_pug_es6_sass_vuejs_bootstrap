import Vue from "vue"
import message from "./hello.vue"

module.exports = new Vue({
  el: '#app',
  render: h => h(message)
});
