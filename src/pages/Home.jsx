
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Grid, Typography, Paper, useTheme, useMediaQuery } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import UpcomingIcon from "@mui/icons-material/Upcoming";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

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
  const [activeTab, setActiveTab] = useState("trending");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

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

  const tabConfig = [
    {
      id: "trending",
      label: "Trending",
      icon: <TrendingUpIcon sx={{ fontSize: isMobile ? 20 : 24 }} />,
      data: trending,
      title: `Trending ${mediaType === "movie" ? "Movies" : "TV Shows"}`
    },
    {
      id: "popular",
      label: "Popular",
      icon: <LocalFireDepartmentIcon sx={{ fontSize: isMobile ? 20 : 24 }} />,
      data: popular,
      title: `Popular ${mediaType === "movie" ? "Movies" : "TV Shows"}`
    },
    ...(mediaType === "movie" ? [
      {
        id: "upcoming",
        label: "Upcoming",
        icon: <UpcomingIcon sx={{ fontSize: isMobile ? 20 : 24 }} />,
        data: upcoming,
        title: "Upcoming Movies"
      },
      {
        id: "nowPlaying",
        label: "Now Playing",
        icon: <PlayCircleOutlineIcon sx={{ fontSize: isMobile ? 20 : 24 }} />,
        data: nowPlaying,
        title: "Now Playing Movies"
      }
    ] : [])
  ];

  const renderGrid = (items) => (
    <Grid container spacing={isMobile ? 1.5 : isTablet ? 2 : 3} justifyContent="center">
      {items.length > 0 ? (
        items.map((item, index) => (
          <Grid
            key={item.id}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              style={{ width: '100%' }}
            >
              <MovieCard item={item} mediaType={mediaType} />
            </motion.div>
          </Grid>
        ))
      ) : (
        <Grid>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={4}
              sx={{
                p: 6,
                textAlign: 'center',
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                borderRadius: 4,
                border: `1px dashed ${theme.palette.divider}`
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                No items found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try switching to a different category
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
      )}
    </Grid>
  );

  if (loading) {
    return (
      <Box sx={{
        p: { xs: 1, sm: 2, md: 3 },
        maxWidth: '1600px',
        mx: 'auto',
        width: '100%'
      }}>
        <Grid container spacing={isMobile ? 1.5 : isTablet ? 2 : 3} justifyContent="center">
          {[...Array(20)].map((_, index) => (
            <Grid

              key={index}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.03 }}
                style={{ width: '100%' }}
              >
                <MovieCardSkeleton />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{
      p: { xs: 1, sm: 2, md: 3 },
      maxWidth: '1600px',
      mx: 'auto',
      width: '100%',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(45deg, #2196F3, #21CBF3)'
              : 'linear-gradient(45deg, #1976D2, #2196F3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' }
          }}
        >
          {mediaType === "movie" ? "Movies" : "TV Shows"}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: 'center', mb: 4, maxWidth: 600, mx: 'auto' }}
        >
          Discover the most popular, trending, and upcoming content
        </Typography>
      </motion.div>

      {/* Enhanced Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center',
          justifyContent: 'center',
          gap: isMobile ? 1 : 2,
          mb: 6,
          position: 'relative'
        }}>
          <Box sx={{
            display: 'flex',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            gap: 1,
            justifyContent: 'center',
            width: '100%',
            maxWidth: 'fit-content',
            mx: 'auto'
          }}>
            {tabConfig.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id
                    ? theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #1976D2, #2196F3)'
                      : 'linear-gradient(135deg, #2196F3, #1976D2)'
                    : theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.04)',
                  border: 'none',
                  borderRadius: 12,
                  padding: isMobile ? '10px 16px' : '12px 24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  minWidth: isMobile ? 'calc(50% - 8px)' : 'auto',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  flex: isMobile ? '1 0 auto' : '0 0 auto'
                }}
              >
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: activeTab === tab.id ? 'white' : theme.palette.text.primary
                }}>
                  {tab.icon}
                  <Typography
                    variant="button"
                    sx={{
                      fontWeight: 600,
                      fontSize: isMobile ? '0.8rem' : '0.875rem',
                      color: activeTab === tab.id ? 'white' : 'inherit',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {tab.label}
                  </Typography>
                </Box>
              </motion.button>
            ))}
          </Box>
        </Box>
      </motion.div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Box sx={{
            bgcolor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.03)'
              : 'rgba(0, 0, 0, 0.02)',
            borderRadius: 4,
            p: { xs: 2, sm: 3, md: 4 },
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0, 0, 0, 0.3)'
              : '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            {tabConfig.map((tab) => (
              activeTab === tab.id && (
                <Box key={tab.id}>
                  <SectionHeader
                    title={tab.title}
                    subtitle={tab.data.length > 0 ? `${tab.data.length} items` : undefined}
                    sx={{ mb: 4 }}
                  />
                  {renderGrid(tab.data)}
                </Box>
              )
            ))}
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Stats Footer */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Box sx={{
            mt: 6,
            pt: 3,
            borderTop: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 4
          }}>
            {tabConfig.map((tab) => (
              <Box
                key={tab.id}
                sx={{
                  textAlign: 'center',
                  opacity: activeTab === tab.id ? 1 : 0.7,
                  transition: 'opacity 0.3s'
                }}
              >
                <Typography variant="h5" fontWeight={700}>
                  {tab.data.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tab.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </motion.div>
      )}
    </Box>
  );
};

export default Home;