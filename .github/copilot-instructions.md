# 🧑‍💻 Copilot/AI Agent Instructions for MidiFlix

## Project Overview
- **MidiFlix** is a React + Vite web app for browsing movies, series, and anime using the TMDB API.
- The UI is built with React functional components, Tailwind CSS, and Lucide icons.
- Data is fetched from TMDB via custom API helpers in `src/api/tmdbclient.js`.
- The app supports infinite scrolling, genre/category filtering, and rich hover-card interactions.

## Architecture & Data Flow
- **Entry Point:** `src/main.jsx` renders `App` inside a `BrowserRouter`.
- **Routing:** All navigation is handled by React Router (`react-router-dom`).
- **Pages:**
  - `Home` (landing, with carousels)
  - `Movies` (filterable, infinite scroll grid)
  - `AllDetails` (detailed view for movie/series by type/id)
- **Components:**
  - `Navbar`, `Footer` (global)
  - `Home/Section1`, `Home/Section2` (hero and carousels)
  - `Home/MovieCard`, `Home/MovieHoverdDetails` (hover logic)
- **API Layer:**
  - All TMDB requests go through `src/api/tmdbclient.js`.
  - Use `getTMDBData`, `getMovieDetails`, `getAllGenres` for all data fetching.
  - API key is loaded from `VITE_TMDB_API_KEY` in environment.

## Key Patterns & Conventions
- **Genre Merging:** Always merge movie and TV genres using the `reduce` pattern (see `GENRE_MERGE_EXPLANATION.md`).
- **Hover Card Logic:**
  - Hover cards use delayed appearance (2s), fade/scale animation, and boundary checks (see `HOVER_LOGIC_GUIDE.md`).
  - Use `useRef` for timer management (`hideTimeoutRef`).
- **Infinite Scroll:**
  - `Movies.jsx` uses an `IntersectionObserver` on a ref to trigger page increments.
- **Component Structure:**
  - Prefer splitting UI into small, focused components under `src/components/`.
  - Use Tailwind utility classes for all styling.
- **API Data:**
  - List endpoints return `genre_ids` (array of IDs); details endpoints return `genres` (array of objects).
  - Always map genre IDs to names using the merged genre list.

## Developer Workflows
- **Start Dev Server:** `npm run dev`
- **Build:** `npm run build`
- **Preview:** `npm run preview`
- **Lint:** `npm run lint`
- **No built-in tests** (add if needed).

## Integration & External Dependencies
- **TMDB API:** All data comes from TMDB; API key must be set in environment.
- **Tailwind CSS:** Used for all styling; see `index.css` and `vite.config.js`.
- **Lucide-react:** Used for icons.

## References & Further Docs
- See `HOVER_GUIDE_SIMPLE.md`, `HOVER_LOGIC_GUIDE.md`, `GENRE_MERGE_EXPLANATION.md`, `ALL_DETAILS_LOGIC.md`, and `HOW_TO_ADD_GENRES.md` for deep dives on key logic.
- For new features, follow the patterns in `src/components/Home/` and `src/pages/`.

---

**Example: Merging Genres**
```js
const all = [...movieGenres, ...tvGenres];
const merged = Object.values(
  all.reduce((acc, genre) => {
    acc[genre.id] = genre;
    return acc;
  }, {})
);
```

**Example: Hover Card Timer**
```js
const hideTimeoutRef = useRef(null);
// ...
hideTimeoutRef.current = setTimeout(() => { ... }, 300);
// ...
if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
```

---

**If anything is unclear or missing, please ask for clarification or check the referenced markdown guides.**
