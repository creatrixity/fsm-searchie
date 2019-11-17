import React, { useEffect } from "react";
import { useMachine } from "@xstate/react";
import {
  Flex,
  Input,
  InputGroup,
  ModalOverlay as Overlay
} from "@chakra-ui/core";

import { searchMachine } from "./searchMachine";
import { searchMachineConfig } from "./searchMachineConfig";
import {
  AwaitingResultsMessage,
  EntryDetectedMessage,
  SearchResults,
  SearchResultsWrapper,
  SearchWrapper,
  UnavailableResultsMessage
} from "./searchComponents";
import { options } from "./utils";

export function Search() {
  const [machineState, send] = useMachine(searchMachine, searchMachineConfig);
  const isActive = machineState.matches("active");
  const {
    context: { query, results }
  } = machineState;
  // console.log(machineState)

  useEffect(() => {
    const handleEsc = e => {
      if (e.key.endsWith("Escape")) send("QUERY_BLUR");
    };

    document.addEventListener("keydown", handleEsc, false);

    return () => {
      document.removeEventListener("keydown", handleEsc, false);
    };
  }, [send]);

  return (
    <>
      {isActive && <Overlay data-testid="search-overlay" />}

      <SearchWrapper isActive={isActive}>
        <Flex as="form" role="search" mb={2} width={["90%", "60%", "50%"]}>
          <InputGroup size="lg" width="100%">
            <Input
              size="lg"
              type="search"
              boxShadow="md"
              value={query}
              data-value={query}
              variant={!isActive ? "filled" : null}
              placeholder={options.inputPlaceholderText}
              onFocus={() => send("QUERY_FOCUS")}
              onBlur={() => send("QUERY_BLUR")}
              onChange={e => send("QUERY_CHANGE", { value: e.target.value })}
            />
          </InputGroup>
        </Flex>
        <SearchResultsWrapper>
          {machineState.matches({ active: "entryDetected" }) ? (
            <EntryDetectedMessage />
          ) : machineState.matches({ active: "awaitingResults" }) ? (
            <AwaitingResultsMessage />
          ) : machineState.matches({ active: "resultsAvailable" }) ? (
            <SearchResults query={query} results={results} />
          ) : machineState.matches({ active: "resultsUnavailable" }) ? (
            <UnavailableResultsMessage />
          ) : null}
        </SearchResultsWrapper>
      </SearchWrapper>
    </>
  );
}
