# Logic for Fetching All Details by ID

This document explains the logic used to fetch details for both movies and TV series using a single ID in the AllDetails page.

## Problem
- The TMDB API uses different endpoints for movies and TV series:
  - Movie: `/movie/{id}`
  - TV: `/tv/{id}`
- You may not know in advance whether the ID refers to a movie or a TV show.

## Solution
1. **Try to fetch as a movie first:**
   - Call the movie endpoint with the ID.
   - If successful, display the movie details.
2. **If movie fetch fails, try as TV:**
   - Call the TV endpoint with the same ID.
   - If successful, display the TV details.
3. **If both fail, show an error or fallback UI.**

## Example Code
```js
const fetchData = async () => {
  try {
    let response = await getMovieDetails('movie', id);
    setdetails(response);
  } catch (movieError) {
    try {
      let response = await getMovieDetails('tv', id);
      setdetails(response);
    } catch (tvError) {
      setdetails(null);
    }
  }
};
```
- `getMovieDetails(type, id)` is a function that calls the correct TMDB endpoint based on the type.
- The logic ensures you always get details for the correct type, using only the ID.

## Benefits
- Handles both movies and TV series with one logic block.
- No need to know the type in advance.
- User always sees the correct details for the selected item.

## Summary
This approach makes your AllDetails page flexible and robust, supporting both movies and TV series with a single ID and unified logic.