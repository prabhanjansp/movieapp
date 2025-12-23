// 
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  IconButton, 
  Tooltip,
  Rating,
  Paper,
  useTheme,
  alpha,
  Stack
} from '@mui/material';
import { 
  BookmarkAddOutlined as BookmarkAddIcon, 
  BookmarkAdded as BookmarkAddedIcon,
  Movie as MovieIcon,
  Tv as TvIcon,
  PlayCircleOutline as PlayIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAppContext } from '../contexts/AppContext';
import { getImageUrl } from '../services/tmdb';

const MovieCard = ({ item, mediaType, elevation = 0 }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useAppContext();
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  
  const type = mediaType || item.media_type;
  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
  const imageUrl = item.poster_path ? getImageUrl(item.poster_path, 'w500') : '/no-image.jpg';

  const handleWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const itemToAdd = {
      id: item.id,
      title: title,
      poster_path: item.poster_path,
      media_type: type,
      release_date: releaseDate,
      vote_average: item.vote_average,
    };

    if (isInWatchlist(item.id, type)) {
      removeFromWatchlist(item.id, type);
    } else {
      addToWatchlist(itemToAdd);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.getFullYear();
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ height: '100%' }}
    >
      <Link 
        to={`/${type === 'tv' ? 'tv' : 'movie'}/${item.id}`} 
        style={{ textDecoration: 'none', display: 'block', height: '100%' }}
      >
        <Paper
          elevation={isHovered ? 6 : elevation}
          sx={{
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            bgcolor: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.background.paper, 0.9)
              : 'white',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
        >
          {/* Image Container */}
          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <CardMedia
              component="img"
              height="340"
              image={imageUrl}
              alt={title}
              sx={{
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                filter: isHovered ? 'brightness(0.8)' : 'brightness(1)',
              }}
            />
            
            {/* Gradient Overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '60%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                opacity: isHovered ? 0 : 0.5,
                transition: 'opacity 0.3s ease',
              }}
            />
            
            {/* Top Badges */}
            <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 1 }}>
              <Chip 
                label={type === 'tv' ? 'TV' : 'Movie'} 
                size="small" 
                color="primary"
                icon={type === 'tv' ? 
                  <TvIcon sx={{ fontSize: 14 }} /> : 
                  <MovieIcon sx={{ fontSize: 14 }} />
                }
                sx={{
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 24,
                  backdropFilter: 'blur(10px)',
                  bgcolor: alpha(theme.palette.primary.main, 0.9),
                  color: 'white',
                }}
              />
            </Box>

            {/* Watchlist Button */}
            <Tooltip 
              title={isInWatchlist(item.id, type) ? 'Remove from Watchlist' : 'Add to Watchlist'}
              arrow
              placement="top"
            >
              <IconButton
                onClick={handleWatchlist}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  color: isInWatchlist(item.id, type) ? theme.palette.secondary.main : theme.palette.text.secondary,
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.background.paper, 1),
                    color: isInWatchlist(item.id, type) ? theme.palette.secondary.dark : theme.palette.primary.main,
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                  boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.2)}`,
                }}
              >
                {isInWatchlist(item.id, type) ? 
                  <BookmarkAddedIcon fontSize="small" /> : 
                  <BookmarkAddIcon fontSize="small" />
                }
              </IconButton>
            </Tooltip>

            {/* Play Button Overlay on Hover */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.common.white, 0.95),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.3)}`,
                    color: theme.palette.primary.main,
                  }}
                >
                  <PlayIcon sx={{ fontSize: 32 }} />
                </Box>
              </motion.div>
            )}
          </Box>

          {/* Content Area */}
          <CardContent sx={{ p: 2.5 }}>
            <Stack spacing={1.5}>
              {/* Title */}
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.3,
                  height: 40,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  color: 'text.primary',
                  fontSize: '0.9375rem',
                }}
              >
                {title}
              </Typography>

              {/* Rating and Date Row */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <StarIcon sx={{ 
                    fontSize: 16, 
                    color: theme.palette.warning.main 
                  }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {rating}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
                    /10
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarIcon sx={{ 
                    fontSize: 14, 
                    color: 'text.secondary' 
                  }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {formatDate(releaseDate)}
                  </Typography>
                </Box>
              </Box>

              {/* Rating Bar */}
              <Box sx={{ width: '100%' }}>
                <Box sx={{ 
                  width: '100%', 
                  height: 4, 
                  bgcolor: alpha(theme.palette.divider, 0.3),
                  borderRadius: 2,
                  overflow: 'hidden'
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.vote_average / 10) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, ${theme.palette.warning.light}, ${theme.palette.warning.main})`,
                      borderRadius: 2,
                    }}
                  />
                </Box>
              </Box>

              {/* Genres/Additional Info (Optional - if available in props) */}
              {item.genre_ids && item.genre_ids.length > 0 && (
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {item.genre_ids.slice(0, 2).map((genreId) => (
                    <Chip
                      key={genreId}
                      label={genreId}
                      size="small"
                      sx={{
                        fontSize: '0.65rem',
                        height: 20,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontWeight: 500,
                      }}
                    />
                  ))}
                  {item.genre_ids.length > 2 && (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      +{item.genre_ids.length - 2}
                    </Typography>
                  )}
                </Box>
              )}
            </Stack>
          </CardContent>

          {/* Hover Overlay Info */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(to bottom, ${alpha(theme.palette.primary.dark, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.7)} 100%)`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1.5rem',
                textAlign: 'center',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  mb: 2,
                  fontSize: '1.1rem',
                }}
              >
                {title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <StarIcon sx={{ color: 'warning.light', fontSize: 20 }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                    {rating}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {formatDate(releaseDate)}
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  lineHeight: 1.6,
                  fontSize: '0.875rem',
                  maxHeight: 80,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {item.overview || `A ${type === 'tv' ? 'TV Show' : 'Movie'} worth watching.`}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Chip
                  label="View Details"
                  sx={{
                    bgcolor: 'white',
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    px: 2,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                />
              </Box>
            </motion.div>
          )}
        </Paper>
      </Link>
    </motion.div>
  );
};

export default MovieCard;