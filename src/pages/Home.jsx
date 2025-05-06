
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Tabs, Tab, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";

import { MovieCardSkeleton } from "../components/SkeletonLoader";
import { fetchTrending, fetchPopular, fetchUpcomingMovies, fetchNowPlayingMovies } from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import SectionHeader from "../components/SectionHeader";

const Home = () => {
  const [searchParams] = useSearchParams();
  const mediaType = searchParams.get("type") || "movie";
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [trendingData, popularData] = await Promise.all([
          fetchTrending(mediaType),
          fetchPopular(mediaType)
        ]);

        setTrending(trendingData);
        setPopular(popularData);

        if (mediaType === "movie") {
          const [upcomingData, nowPlayingData] = await Promise.all([
            fetchUpcomingMovies(),
            fetchNowPlayingMovies()
          ]);
          setUpcoming(upcomingData);
          setNowPlaying(nowPlayingData);
        } else {
          setUpcoming([]);
          setNowPlaying([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mediaType]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderGrid = (items) => (
    <Grid container spacing={2} justifyContent="center">
      {items.length > 0 ? (
        items.map((item) => (
          <Grid 
            item 
            xs={6} 
            sm={4} 
            md={3} 
            lg={2.4} 
            xl={2} 
            key={item.id}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <MovieCard item={item} mediaType={mediaType} />
          </Grid>
        ))
      ) : (
        <Typography variant="body1" textAlign="center" sx={{ my: 4, width: '100%' }}>
          No items found
        </Typography>
      )}
    </Grid>
  );

  if (loading) {
    return (
      <Box sx={{ p: 2, maxWidth: '1600px', mx: 'auto' }}>
        <Grid container spacing={2} justifyContent="center">
          {[...Array(20)].map((_, index) => (
            <Grid 
              item 
              xs={6} 
              sm={4} 
              md={3} 
              lg={2.4} 
              xl={2} 
              key={index}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <MovieCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <>
   
      <Box sx={{ 
        p: 2,
        maxWidth: '1600px',
        mx: 'auto',
        width: '100%'
      }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ mb: 3 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Trending" />
          <Tab label="Popular" />
          {mediaType === "movie" && <Tab label="Upcoming" />}
          {mediaType === "movie" && <Tab label="Now Playing" />}
        </Tabs>

        {tabValue === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader
              title={`Trending ${mediaType === "movie" ? "Movies" : "TV Shows"}`}
            />
            {renderGrid(trending)}
          </motion.div>
        )}

        {tabValue === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader
              title={`Popular ${mediaType === "movie" ? "Movies" : "TV Shows"}`}
            />
            {renderGrid(popular)}
          </motion.div>
        )}

        {mediaType === "movie" && tabValue === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader title="Upcoming Movies" />
            {renderGrid(upcoming)}
          </motion.div>
        )}

        {mediaType === "movie" && tabValue === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader title="Now Playing Movies" />
            {renderGrid(nowPlaying)}
          </motion.div>
        )}
      </Box>
    </>
  );
};

export default Home;