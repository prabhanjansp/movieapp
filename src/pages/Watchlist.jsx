import React from 'react';
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  IconButton,
  Tooltip,
  Paper,
  Container,
  useTheme,
  alpha,
  Button,
  Chip,
  Stack,
  useMediaQuery
} from '@mui/material';
import {
  Movie as MovieIcon,
  Tv as TvIcon,
  Bookmark as BookmarkIcon,
  Delete as DeleteIcon,
  BookmarkBorder as BookmarkEmptyIcon,
  PlaylistAddCheck as PlaylistIcon,
  TrendingUp as TrendingIcon,
  Whatshot as HotIcon,
  LocalMovies as MoviesIcon,
  LiveTv as TvShowIcon,
  Add as AddIcon,
  Explore as ExploreIcon,
  PlayCircleTwoTone
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import MovieCard from '../components/MovieCard';

const Watchlist = () => {
  const { watchlist, removeFromWatchlist } = useAppContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);

  const filters = [
    { id: 'all', label: 'All', icon: <BookmarkIcon />, color: 'primary' },
    { id: 'movie', label: 'Movies', icon: <MoviesIcon />, color: 'success' },
    { id: 'tv', label: 'TV Shows', icon: <TvShowIcon />, color: 'secondary' },
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = watchlist.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.media_type === activeFilter;
  });

  const getFilterCount = (filterId) => {
    if (filterId === 'all') return watchlist.length;
    return watchlist.filter(item => item.media_type === filterId).length;
  };

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 8 },
          borderRadius: 4,
          textAlign: 'center',
          bgcolor: theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.5)
            : alpha(theme.palette.grey[50], 0.8),
          border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
          maxWidth: 800,
          mx: 'auto',
          my: 4,
        }}
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{ marginBottom: 32 }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            <BookmarkEmptyIcon
              sx={{
                fontSize: 60,
                color: theme.palette.primary.main
              }}
            />
          </Box>
        </motion.div>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: 'text.primary',
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
          }}
        >
          Your Watchlist is Empty
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: 4,
            maxWidth: 600,
            mx: 'auto',
            lineHeight: 1.6,
          }}
        >
          Start building your personalized collection! Save movies and TV shows you want to watch later.
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            justifyContent: 'center',
            mt: 4,
            '& .MuiButton-root': {
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
            }
          }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              component={Link}
              to="/"
              variant="contained"
              startIcon={<ExploreIcon />}
              sx={{
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                }
              }}
            >
              Explore Movies
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              component={Link}
              to="/?type=tv"
              variant="outlined"
              startIcon={<TvIcon />}
              sx={{
                borderColor: alpha(theme.palette.primary.main, 0.3),
                color: 'text.primary',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
            >
              Browse TV Shows
            </Button>
          </motion.div>
        </Stack>

        {/* Suggested Categories */}
        <Box sx={{
          mt: 6,
          pt: 4,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          width: '100%'
        }}>
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              color: 'text.primary',
              fontWeight: 600,
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            Popular Categories to Explore
          </Typography>

          <Box sx={{
            display: 'flex',
            justifyContent: { xs: 'center', sm: 'flex-start' },
            flexWrap: 'wrap',
            gap: 2,
            rowGap: 2,
            alignItems: 'center'
          }}>
            {[
              { label: 'Trending', icon: <TrendingIcon />, color: 'error' },
              { label: 'Popular', icon: <HotIcon />, color: 'warning' },
              { label: 'Top Rated', icon: <PlaylistIcon />, color: 'success' },
              { label: 'Upcoming', icon: <AddIcon />, color: 'info' },
              { label: 'Now Playing', icon: <PlayCircleTwoTone />, color: 'primary' },
            ].map((category) => (
              <Chip
                key={category.label}
                icon={category.icon}
                label={category.label}
                onClick={() => navigate(`/movies?filter=${category.label.toLowerCase().replace(' ', '_')}`)}
                sx={{
                  px: { xs: 2, sm: 2.5 },
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                  height: 'auto',
                  minHeight: 40,
                  bgcolor: alpha(theme.palette[category.color].main, 0.1),
                  color: theme.palette[category.color].main,
                  border: `1px solid ${alpha(theme.palette[category.color].main, 0.2)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette[category.color].main, 0.2),
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${alpha(theme.palette[category.color].main, 0.3)}`,
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  cursor: 'pointer',
                  '& .MuiChip-icon': {
                    marginLeft: { xs: '6px', sm: '8px' },
                    fontSize: { xs: 18, sm: 20 },
                  },
                  '& .MuiChip-label': {
                    padding: { xs: '0 8px', sm: '0 12px' },
                  }
                }}
                clickable
              />
            ))}
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
      {/* Header Section */}
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 1,
            color: 'text.primary',
            fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' },
            textAlign: 'center',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(45deg, #90caf9, #ce93d8)'
              : 'linear-gradient(45deg, #1976d2, #9c27b0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          My Watchlist
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            mb: 4,
            maxWidth: 600,
            mx: 'auto',
            fontWeight: 400
          }}
        >
          Your personal collection of movies and TV shows to watch
        </Typography>

        {/* Stats */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.5)
              : alpha(theme.palette.grey[100], 0.8),
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            maxWidth: 600,
            mx: 'auto',
            mb: 4,
          }}
        >
          <Grid container spacing={2} justifyContent="center">
            <Grid >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {watchlist.length}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Total Items
                </Typography>
              </Box>
            </Grid>
            <Grid >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {watchlist.filter(item => item.media_type === 'movie').length}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Movies
                </Typography>
              </Box>
            </Grid>
            <Grid>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                  {watchlist.filter(item => item.media_type === 'tv').length}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  TV Shows
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Filter Tabs */}
      <Box sx={{
        position: 'relative',
        mb: 4,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
        pb: 2,
      }}>
        <Box sx={{
          display: 'flex',
          gap: 1,
          position: 'relative',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          justifyContent: 'center',
        }}>
          {filters.map((filter) => {
            const count = getFilterCount(filter.id);
            const isActive = activeFilter === filter.id;

            return (
              <motion.button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  position: 'relative',
                  background: 'none',
                  border: 'none',
                  padding: '12px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  minWidth: 'fit-content',
                  whiteSpace: 'nowrap',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  color: isActive
                    ? theme.palette[filter.color].main
                    : theme.palette.text.secondary,
                  backgroundColor: isActive
                    ? alpha(theme.palette[filter.color].main, 0.1)
                    : 'transparent',
                }}
              >
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'inherit',
                }}>
                  {React.cloneElement(filter.icon, {
                    sx: {
                      fontSize: 20,
                      color: 'inherit',
                    }
                  })}
                  <Typography
                    variant="button"
                    sx={{
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.875rem',
                      color: 'inherit',
                    }}
                  >
                    {filter.label}
                  </Typography>
                  {count > 0 && (
                    <Box
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        bgcolor: isActive
                          ? theme.palette[filter.color].main
                          : alpha(theme.palette.text.secondary, 0.2),
                        color: isActive ? 'white' : theme.palette.text.secondary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}
                    >
                      {count}
                    </Box>
                  )}
                </Box>
              </motion.button>
            );
          })}
        </Box>
      </Box>

      {/* Content */}
      <AnimatePresence mode="wait">
        {filteredItems.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={isMobile ? 2 : isTablet ? 3 : 4}>
              {filteredItems.map((item, index) => (
                <Grid
                  item
                  xs={6}
                  sm={4}
                  md={3}
                  lg={2.4}
                  key={`${item.id}-${item.media_type}`}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  sx={{ position: 'relative' }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    style={{ height: '100%' }}
                  >
                    <MovieCard item={item} mediaType={item.media_type} />

                    {/* Remove Button with Animation */}
                    <AnimatePresence>
                      {hoveredItem === item.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 10,
                          }}
                        >
                          <Tooltip title="Remove from watchlist" arrow>
                            <IconButton
                              onClick={() => removeFromWatchlist(item.id, item.media_type)}
                              size="small"
                              sx={{
                                bgcolor: alpha(theme.palette.error.main, 0.9),
                                color: 'white',
                                backdropFilter: 'blur(10px)',
                                '&:hover': {
                                  bgcolor: theme.palette.error.main,
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s ease',
                                boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.3)}`,
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Media Type Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        zIndex: 10,
                      }}
                    >
                      <Chip
                        label={item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                        size="small"
                        icon={item.media_type === 'movie' ? <MovieIcon /> : <TvIcon />}
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          height: 24,
                          bgcolor: alpha(
                            item.media_type === 'movie'
                              ? theme.palette.success.main
                              : theme.palette.secondary.main,
                            0.9
                          ),
                          color: 'white',
                          backdropFilter: 'blur(10px)',
                          '& .MuiChip-icon': {
                            color: 'white',
                            fontSize: 14,
                          }
                        }}
                      />
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Summary Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Paper
                elevation={0}
                sx={{
                  mt: 6,
                  p: 3,
                  borderRadius: 3,
                  bgcolor: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.primary.dark, 0.1)
                    : alpha(theme.palette.primary.light, 0.1),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    color: 'text.primary',
                    fontWeight: 600,
                  }}
                >
                  Watchlist Summary
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    mb: 2,
                  }}
                >
                  You have {filteredItems.length} {activeFilter === 'all' ? 'items' : activeFilter + 's'} in your watchlist
                </Typography>

                {/* Progress Bar */}
                <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', mb: 2 }}>
                  <Box sx={{
                    width: '100%',
                    height: 6,
                    bgcolor: alpha(theme.palette.divider, 0.3),
                    borderRadius: 3,
                    overflow: 'hidden'
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      style={{
                        height: '100%',
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        borderRadius: 3,
                      }}
                    />
                  </Box>
                </Box>

                <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  Keep adding more to build your perfect watchlist!
                </Typography>
              </Paper>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      {watchlist.length > 0 && (
        <Box sx={{
          mt: 6,
          pt: 4,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          textAlign: 'center'
        }}>
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              color: 'text.primary',
              fontWeight: 600,
            }}
          >
            Watchlist Insights
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={6} sm={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {watchlist.length}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Total Saved
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.success.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {watchlist.filter(item => item.media_type === 'movie').length}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Movies
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.secondary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                  {watchlist.filter(item => item.media_type === 'tv').length}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  TV Shows
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.warning.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {new Set(watchlist.map(item => item.release_date?.slice(0, 4))).size}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Years Span
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default Watchlist;