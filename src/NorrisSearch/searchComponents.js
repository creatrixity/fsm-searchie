import React from "react";
import { theme, Box, Flex, Image, Text } from "@chakra-ui/core";
import { options } from "./utils";

export const AwaitingResultsMessage = () => {
  return (
    <>
      <Text
        fontWeight="bold"
        px={4}
        textAlign="center"
        fontSize="sm"
        letterSpacing="wide"
        color="gray.400"
      >
        {options.awaitingResultsText}
      </Text>
    </>
  );
};

export const EntryDetectedMessage = () => {
  return (
    <>
      <Text
        fontWeight="bold"
        px={4}
        textAlign="center"
        fontSize="sm"
        letterSpacing="wide"
        color="gray.400"
      >
        {options.entryDetectedText}
      </Text>
    </>
  );
};

export const UnavailableResultsMessage = () => {
  return (
    <>
      <Text
        fontWeight="bold"
        px={4}
        textAlign="center"
        fontSize="sm"
        letterSpacing="wide"
        color="gray.400"
      >
        {options.unavailableResultsText}
      </Text>
    </>
  );
};

export const SearchResults = ({ query, results }) => {
  return (
    <>
      <Text
        fontWeight="bold"
        px={4}
        textTransform="uppercase"
        fontSize="sm"
        letterSpacing="wide"
        color="teal.600"
      >
        Chuck Norris jokes on "{query}"
      </Text>

      {results.length ? (
        results.map((result, key) => (
          <Box
            px={4}
            display={{ md: "flex" }}
            key={key}
            data-testid="search-result"
          >
            <Box flexShrink="0">
              <Image
                rounded="lg"
                width={{ md: 20 }}
                src={result.icon_url}
                alt="Chuck Norris Icon"
              />
            </Box>
            <Box mt={{ base: 4, md: 0 }} ml={{ md: 6 }}>
              <Text mt={2} color="gray.500">
                {result.value}
              </Text>
            </Box>
          </Box>
        ))
      ) : (
        <UnavailableResultsMessage />
      )}
    </>
  );
};

export const SearchResultsWrapper = ({ children }) => {
  return (
    <Flex
      bg="#fff"
      flexDirection="column"
      borderRadius="0.5em"
      boxShadow="md"
      overflow="auto"
      width={["90%", "60%", "50%"]}
    >
      {children}
    </Flex>
  );
};

export const SearchWrapper = ({ children, isActive }) => {
  return (
    <Flex
      width="100%"
      flexDirection="column"
      alignItems="center"
      transition="transform 0.5s ease, width 0.5s ease"
      transform={!isActive ? "translateY(40%)" : "translateY(0)"}
      zIndex={theme.zIndices.modal}
    >
      {children}
    </Flex>
  );
};
