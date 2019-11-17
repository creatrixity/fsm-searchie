import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { searchMachine } from "./searchMachine";
import { createModel } from "@xstate/test";
import { Search } from "./";
import { options } from "./utils";

const testModel = createModel(searchMachine).withEvents({
  QUERY_FOCUS({ getByPlaceholderText }) {
    fireEvent.focus(getByPlaceholderText(options.inputPlaceholderText));
  },

  QUERY_BLUR({ getByPlaceholderText }) {
    fireEvent.blur(getByPlaceholderText(options.inputPlaceholderText));
  },

  QUERY_CHANGE: {
    async exec({ getByPlaceholderText }, event) {
      fireEvent.change(getByPlaceholderText(options.inputPlaceholderText), {
        target: event.value
      });
    },
    cases: [{ value: "stand" }]
  },

  "done.invoke.requestSearchResults": () => {},

  "error.platform.requestSearchResults": evt => {}
});

const testPlans = testModel.getShortestPathPlans();

testPlans.forEach(plan => {
  describe(plan.description, () => {
    afterEach(cleanup);

    plan.paths.forEach(path => {
      test(path.description, async () => {
        await path.test(render(<Search />));
      });
    });
  });
});
