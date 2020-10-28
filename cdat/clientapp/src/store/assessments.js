import { firestoreAction } from "vuexfire";
import db from "@/db";

const state = {
  assessments: [],
  assessmentNames: [],
  currentAssessmentID: null,
};

const actions = {
  loadAssessments: firestoreAction(({ bindFirestoreRef }) => {
    return bindFirestoreRef(
      "assessments",
      db.collection("assessments").orderBy("order"),
      {
        maxRefDepth: 4,
      }
    );
  }),
  setAssessment: ({ commit }, assessmentID) => {
    commit("SET_ASSESSMENT", assessmentID);
  },

  loadAssessmentNames: firestoreAction(({ bindFirestoreRef }) => {
    return bindFirestoreRef(
      "assessmentNames",
      db.collection("assessments").orderBy("order"),
      {
        maxRefDepth: 1,
      }
    );
  }),
};

const mutations = {
  SET_ASSESSMENT: (state, assessmentID) => {
    state.currentAssessmentID = assessmentID;
  },
};

const getters = {
  currentAssessment: (state) => {
    return state.currentAssessmentID
      ? state.assessments.find((x) => x.id == state.currentAssessmentID)
      : null;
  },
  currentQuestions: (state) => {
    return state.currentAssessmentID
      ? state.assessments.find((x) => x.id == state.currentAssessmentID)
          .questions
      : null;
  },
  assessments: (state) => state.assessments,
  assessmentNames: (state) => state.assessmentNames,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
