export const options = {
  inputPlaceholderText: "Find a Chuck Norris joke...",
  awaitingResultsText: "We are currently contacting the API....",
  entryDetectedText: "We can see that you are typing....",
  unavailableResultsText:
    "The results met a Chuck Norris roundhouse kick and got vaporized."
};

export const requestSearchResults = debounce(({ query }) => {
  const url = `https://api.chucknorris.io/jokes/search?query=${query}`;

  return fetch(url)
    .then(response => response.json())
    .then(json => {
      console.log({ json });
      return json;
    });
}, 500);

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(inner, ms = 0) {
  let timer = null;
  let resolves = [];

  return function(...args) {
    // Run the function after a certain amount of time
    clearTimeout(timer);
    timer = setTimeout(() => {
      // Get the result of the inner function, then apply it to the resolve function of
      // each promise that has been created since the last time the inner function was run
      let result = inner(...args);
      resolves.forEach(r => r(result));
      resolves = [];
    }, ms);

    return new Promise(r => resolves.push(r));
  };
}
