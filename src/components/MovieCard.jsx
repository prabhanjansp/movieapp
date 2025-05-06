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
  Rating
} from '@mui/material';
import { 
  BookmarkAdd as BookmarkAddIcon, 
  BookmarkAdded as BookmarkAddedIcon,
  Movie as MovieIcon,
  Tv as TvIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAppContext } from '../contexts/AppContext';
import { getImageUrl } from '../services/tmdb';

const MovieCard = ({ item, mediaType }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useAppContext();
  const [isHovered, setIsHovered] = useState(false);
  const type = mediaType || item.media_type;

  const handleWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const itemToAdd = {
      id: item.id,
      title: item.title || item.name,
      poster_path: item.poster_path,
      media_type: type,
      release_date: item.release_date || item.first_air_date,
      vote_average: item.vote_average,
    };

    if (isInWatchlist(item.id, type)) {
      removeFromWatchlist(item.id, type);
    } else {
      addToWatchlist(itemToAdd);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link 
        to={`/${type === 'tv' ? 'tv' : 'movie'}/${item.id}`} 
        style={{ textDecoration: 'none' }}
      >
        <Card sx={{ height: '100%', position: 'relative' }}>
          <CardMedia
            component="img"
            height="300"
            image={
              item.poster_path 
                ? getImageUrl(item.poster_path, 'w500') 
                : '/no-image.jpg'
            }
            alt={item.title || item.name}
            sx={{ objectFit: 'cover' }}
          />
          
          <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
            <Chip 
              label={type === 'tv' ? 'TV' : 'Movie'} 
              size="small" 
              color="primary" 
              icon={type === 'tv' ? <TvIcon fontSize="small" /> : <MovieIcon fontSize="small" />}
            />
          </Box>
          
          <Tooltip title={isInWatchlist(item.id, type) ? 'Remove from watchlist' : 'Add to watchlist'}>
            <IconButton
              onClick={handleWatchlist}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: isInWatchlist(item.id, type) ? 'secondary.main' : 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                },
              }}
            >
              {isInWatchlist(item.id, type) ? <BookmarkAddedIcon /> : <BookmarkAddIcon />}
            </IconButton>
          </Tooltip>
          
          {(isHovered || !item.poster_path) && (
            <CardContent sx={{ 
              position: item.poster_path ? 'absolute' : 'relative',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              p: 1,
            }}>
              <Typography variant="subtitle1" noWrap>
                {item.title || item.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Rating
                  value={(item.vote_average / 2)}
                  precision={0.5}
                  readOnly
                  size="small"
                />
                <Typography variant="caption" sx={{ ml: 1 }}>
                  {item.vote_average.toFixed(1)}
                </Typography>
              </Box>
              <Typography variant="caption">
                {item.release_date || item.first_air_date}
              </Typography>
            </CardContent>
          )}
        </Card>
      </Link>
    </motion.div>
  );
};

export default MovieCard;