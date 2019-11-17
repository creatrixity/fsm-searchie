import { Machine, assign } from "xstate";
import { options } from "./utils";

import { guards, machineActions } from "./searchMachineConfig";

export const searchMachine = Machine({
  id: "search",
  initial: "idle",
  context: {
    query: "",
    results: null
  },
  states: {
    idle: {
      on: {
        QUERY_FOCUS: "active",
        QUERY_CHANGE: [
          {
            actions: machineActions.updateSearchQuery,
            cond: (_, e) => e.value.length === 1,
            target: "."
          }
        ]
      },
      meta: {
        test({ getByPlaceholderText, queryByTestId }) {
          expect(
            getByPlaceholderText(options.inputPlaceholderText)
          ).toBeTruthy();
          expect(queryByTestId("search-overlay")).toBeNull();
        }
      }
    },

    active: {
      initial: "awaitingEntry",

      states: {
        awaitingEntry: {
          on: {
            QUERY_BLUR: "#search.idle",
            QUERY_CHANGE: [
              {
                actions: machineActions.updateSearchQuery,
                cond: (_, e) => e.value.length >= 1,
                target: "entryDetected"
              },
              {
                actions: machineActions.updateSearchQuery,
                cond: (_, e) => e.value.length === 0,
                target: "#search.idle"
              },
              {
                actions: machineActions.updateSearchQuery
              }
            ]
          },

          meta: {
            test({ getByPlaceholderText, getByTestId }) {
              expect(
                getByPlaceholderText(options.inputPlaceholderText).value
              ).toBe("stand");
              expect(getByTestId("search-overlay"));
            }
          }
        },

        entryDetected: {
          on: {
            QUERY_CHANGE: [
              {
                cond: guards.isSufficientQueryLength,
                actions: machineActions.updateSearchQuery,
                target: "awaitingResults"
              },
              {
                actions: machineActions.updateSearchQuery,
                cond: guards.isInsufficientQueryLength,
                target: "awaitingEntry"
              },
              {
                actions: machineActions.updateSearchQuery,
                target: "entryDetected"
              }
            ]
          },

          meta: {
            async test({ getByText, getByTestId }) {
              getByText(options.entryDetectedText);
              expect(getByTestId("search-overlay"));
            }
          }
        },

        awaitingResults: {
          on: {
            QUERY_CHANGE: [
              {
                cond: guards.isSufficientQueryLength,
                actions: machineActions.updateSearchQuery,
                target: "awaitingResults"
              },
              {
                cond: guards.isInsufficientQueryLength,
                actions: machineActions.updateSearchQuery,
                target: "awaitingEntry"
              },
              {
                actions: machineActions.updateSearchQuery,
                target: "awaitingResults"
              }
            ]
          },

          invoke: {
            src: "requestSearchResults",
            onDone: {
              target: "resultsAvailable",
              actions: assign({
                results: (ctx, { data }) => {
                  return data.length ? data : [];
                }
              })
            },
            onError: "resultsUnavailable"
          },

          meta: {
            async test({ getByText, getByTestId }) {
              getByText(options.awaitingResultsText);
              expect(getByTestId("search-overlay"));
            }
          }
        },

        resultsAvailable: {
          on: {
            QUERY_CHANGE: [
              {
                actions: machineActions.updateSearchQuery,
                cond: guards.isInsufficientQueryLength,
                target: "awaitingEntry"
              },
              {
                actions: machineActions.updateSearchQuery,
                target: "awaitingResults"
              }
            ]
          },
          meta: {
            test({ getByPlaceholderText, getByTestId, queryByTestId }) {
              const input = getByPlaceholderText(options.inputPlaceholderText);

              expect(input.value).toBe("stand");
              expect(getByTestId("search-overlay"));
              expect(queryByTestId("search-result")).toBeTruthy();
            }
          }
        },

        resultsUnavailable: {
          on: {
            QUERY_CHANGE: [
              {
                actions: machineActions.updateSearchQuery,
                cond: guards.isInsufficientQueryLength,
                target: "awaitingEntry"
              },
              {
                actions: machineActions.updateSearchQuery,
                target: "awaitingResults"
              }
            ]
          },

          meta: {
            async test({ getByText, getByTestId }) {
              getByText(options.unavailableResultsText);
              expect(getByTestId("search-overlay"));
            }
          }
        }
      }
    }
  }
});
