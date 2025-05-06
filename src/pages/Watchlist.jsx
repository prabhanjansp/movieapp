import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Tabs, 
  Tab, 
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Movie as MovieIcon,
  Tv as TvIcon,
  Bookmark as BookmarkIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAppContext } from '../contexts/AppContext';
import MovieCard from '../components/MovieCard';



const Watchlist = () => {
  const { watchlist, removeFromWatchlist } = useAppContext();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  // Simulate loading (in a real app, you might fetch additional details here)
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [watchlist]);

  const filteredItems = watchlist.filter((item) => {
    if (tabValue === 0) return true;
    if (tabValue === 1) return item.media_type === 'movie';
    if (tabValue === 2) return item.media_type === 'tv';
    return true;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        My Watchlist
      </Typography>

      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        centered
        sx={{ mb: 3 }}
      >
        <Tab label="All" icon={<BookmarkIcon />} />
        <Tab label="Movies" icon={<MovieIcon />} />
        <Tab label="TV Shows" icon={<TvIcon />} />
      </Tabs>

      {filteredItems.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
          {tabValue === 0
            ? 'Your watchlist is empty. Add some movies or TV shows!'
            : tabValue === 1
            ? 'No movies in your watchlist.'
            : 'No TV shows in your watchlist.'}
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {filteredItems.map((item) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={`${item.id}-${item.media_type}`}>
              <Box sx={{ position: 'relative' }}>
                <MovieCard item={item} mediaType={item.media_type} />
                <Tooltip title="Remove from watchlist">
                  <IconButton
                    onClick={() => removeFromWatchlist(item.id, item.media_type)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 0, 0, 0.7)',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Watchlist;