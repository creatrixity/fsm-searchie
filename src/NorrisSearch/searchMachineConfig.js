import { actions } from "xstate";
import { requestSearchResults } from "./utils";

const { assign } = actions;

export const machineActions = {
  updateSearchQuery: assign((ctx, e) => {
    return {
      query: e.value
    };
  })
};

export const guards = {
  isSufficientQueryLength: (ctx, e) => {
    return e.value.length > 2;
  },

  isInsufficientQueryLength: (ctx, e) => {
    return e.value.length < 2;
  }
};

export const searchMachineConfig = {
  actions: machineActions,
  guards,

  services: {
    requestSearchResults
  }
};
