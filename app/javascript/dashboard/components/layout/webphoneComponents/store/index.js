// src/store.js

import { createStore } from 'vuex';

const store = createStore({
  state: {
    message: 'Hello, World!',
  },
  mutations: {
    setMessage(state, payload) {
      state.message = payload;
    },
  },
  actions: {
    updateMessage({ commit }, newMessage) {
      commit('setMessage', newMessage);
    },
  },
  getters: {
    getMessage: state => state.message,
  },
});

export default store;
