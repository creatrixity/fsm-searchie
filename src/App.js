import React from "react";
import { Search } from "./NorrisSearch";
import { ThemeProvider, Flex } from "@chakra-ui/core";

const SearchContainer = ({ children }) => {
  return (
    <Flex height="100%" width="100%">
      <Flex width="100%">{children}</Flex>
    </Flex>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <SearchContainer>
        <Search />
      </SearchContainer>
    </ThemeProvider>
  );
}
