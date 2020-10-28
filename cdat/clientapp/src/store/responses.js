import { firestoreAction } from "vuexfire";
import db from "@/db";
import firebase from "@/firebase";

const state = {
  responses: [],
  currentResponse: {
    assessment: null,
    owner: null,
    responses: [],
  },
  status: null,
};

const actions = {
  loadResponses: firestoreAction(({ bindFirestoreRef }) => {
    return bindFirestoreRef("responses", db.collection("responses"), {
      maxRefDepth: 1,
    });
  }),
  createResponse: ({ commit }, assessment) => {
    let uid =
      firebase.auth().currentUser == undefined
        ? null
        : firebase.auth().currentUser.uid;
    commit("CREATE_RESPONSE", assessment);
    commit("SET_USER", uid);
  },
  saveResponse: async ({ commit, state }) => {
    let responseItem = {
      assessment: db.doc(`assessments/${state.currentResponse.assessment}`),
      owner: db.doc(`/users/${state.currentResponse.owner}`),
      responses: state.currentResponse.responses,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("responses").add(responseItem);
    commit("SET_STATUS", "Saved");
  },
  emptyResponse: ({ commit }) => {
    commit("EMPTY_RESPONSE");
  },
};

const mutations = {
  SET_ANSWER(state, answer) {
    let formatQuestion = db.doc(`/questions/${answer.question}`);
    let item = state.currentResponse.responses.find(
      (x) => x.question.id == formatQuestion.id
    );
    if (item == undefined) {
      let respObejct = {
        question: formatQuestion,
      };
      if (answer.answer) respObejct = { ...respObejct, answer: answer.answer };
      if (answer.image) respObejct = { ...respObejct, image: answer.image };
      if (answer.independent)
        respObejct = { ...respObejct, independent: answer.independent };
      if (answer.text) respObejct = { ...respObejct, text: answer.text };

      state.currentResponse.responses.push(respObejct);
    } else {
      if (answer.answer) item.answer = answer.answer;
      if (answer.image) item.image = answer.image;
      if (answer.independent) item.independent = answer.independent;
      if (answer.text) item.text = answer.text;
    }
  },
  CREATE_RESPONSE(state, assessment) {
    state.currentResponse.assessment = assessment;
  },
  SET_USER(state, user) {
    state.currentResponse.owner = user;
  },
  SET_STATUS(state, response) {
    state.status = response;
  },
  EMPTY_RESPONSE(state) {
    state.currentResponse.responses = [];
  },
};

const getters = {
  responses: (state) => state.responses,
  currentResponse: (state) => state.currentResponse,
  status: (state) => state.status,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
