import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CircularProgress } from '@mui/material';
import {  useAppContext } from "./contexts/AppContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { HelmetProvider } from 'react-helmet-async';
const Home = lazy(() => import("./pages/Home"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));
const TvDetails = lazy(() => import("./pages/TvDetails"));
const ActorDetails = lazy(() => import("./pages/ActorDetails "));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Watchlist = lazy(() => import("./pages/Watchlist"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  const { theme } = useAppContext();

  const muiTheme = createTheme({
    palette: {
      mode: theme,
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#9c27b0",
      },
    },
  });


  return (
    <HelmetProvider>
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route 
            path="/" 
            element={
              <Suspense fallback={<CircularProgress />}>
                <Home />
              </Suspense>
            } 
          />
          <Route 
            path="/movie/:id" 
            element={
              <Suspense fallback={<CircularProgress />}>
                <MovieDetails />
              </Suspense>
            } 
          />
          <Route 
            path="/tv/:id" 
            element={
              <Suspense fallback={<CircularProgress />}>
                <TvDetails />
              </Suspense>
            } 
          />
          <Route 
            path="/person/:id" 
            element={
              <Suspense fallback={<CircularProgress />}>
                <ActorDetails />
              </Suspense>
            } 
          />
          <Route 
            path="/search" 
            element={
              <Suspense fallback={<CircularProgress />}>
                <SearchResults />
              </Suspense>
            } 
          />
          <Route 
            path="/watchlist" 
            element={
              <Suspense fallback={<CircularProgress />}>
                <Watchlist />
              </Suspense>
            } 
          />
          <Route 
            path="*" 
            element={
              <Suspense fallback={<CircularProgress />}>
                <NotFound />
              </Suspense>
            } 
          />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  </HelmetProvider>
  );
};

export default App;
