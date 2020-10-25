import firebase from "@/firebase";

const state = {
  user: null,
  isLoggedIn: false,
};

const actions = {
  async login() {
    var provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(provider);
  },
  async logout() {
    await firebase.auth().signOut();
  },
};

const mutations = {
  setUser(state, user) {
    if (user == null) {
      (state.user = null), (state.isLoggedIn = false);
    } else {
      state.user = user;
      state.isLoggedIn = true;
    }
  },
};
const getters = {
  user: (state) => state.user,
  isLoggedIn: (state) => state.isLoggedIn,
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};