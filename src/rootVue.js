import Vue from 'vue';
import events from './events';
import consts from './constants';

import vueMoment from 'vue-moment';
Vue.use(vueMoment);

export default {
  init() {
    var vue = new Vue({
      el: 'body',
      data: {
        showUI: true
      }
    });

    events.on(consts.events.FULLSCREEN_WINDOW_OPEN, () => vue.showUI = false);
    events.on(consts.events.FULLSCREEN_WINDOW_CLOSE, () => vue.showUI = true);
  }
};
