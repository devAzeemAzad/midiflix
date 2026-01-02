# Why Use `reduce` to Merge Genres

When fetching genres from TMDB for both movies and TV series, you get two arrays. Some genres exist in both, and some only in one. To display all unique genres, you need to merge these arrays and remove duplicates.

## The Problem
- Movie genres and TV genres are fetched separately.
- Some genres have the same `id` and `name` in both lists.
- If you simply concatenate the arrays, you get duplicates.

## The Solution: Using `reduce`

```js
const all = [...movieGenres, ...tvGenres];
const merged = Object.values(
  all.reduce((acc, genre) => {
    acc[genre.id] = genre;
    return acc;
  }, {})
);
```

### Step-by-step:
1. **Concatenate** both arrays: `[...movieGenres, ...tvGenres]`.
2. **Reduce** the array into an object, using `genre.id` as the key. This ensures only one genre per ID.
3. **Convert** the object back to an array with `Object.values(...)`.

## Result
- `merged` contains all unique genres from both movies and TV series.
- No duplicates, even if a genre appears in both lists.

## Why not use `Set`?
- `Set` only works for primitive values, not objects. We need to deduplicate by `id`, not by object reference.

## Summary
Using `reduce` with an object accumulator is a common and efficient way to merge arrays of objects and remove duplicates by a specific property (like `id`).