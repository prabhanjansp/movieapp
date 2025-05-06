import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Chip, 
  Divider, 
  Grid, 
  Stack, 
  IconButton, 
  CircularProgress,
  Tab,
  Tabs,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  BookmarkAdd as BookmarkAddIcon,
  BookmarkAdded as BookmarkAddedIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  CalendarToday as DateIcon,
  Theaters as TrailerIcon,
  Link as LinkIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import { fetchMovieDetails ,getImageUrl} from '../services/tmdb';
import { useAppContext } from '../contexts/AppContext';
import CastCarousel from '../components/CastCarousel';
import MediaCarousel from '../components/MediaCarousel';
import SectionHeader from '../components/SectionHeader';
import YouTubeEmbed from '../components/YouTubeEmbed';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useAppContext();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const data = await fetchMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleWatchlist = () => {
    const itemToAdd = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      media_type: 'movie',
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    };

    if (isInWatchlist(movie.id, 'movie')) {
      removeFromWatchlist(movie.id, 'movie');
    } else {
      addToWatchlist(itemToAdd);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  if (!movie) {
    return null;
  }

  const trailer = movie.videos?.results.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  return (
    <Box sx={{ pb: 4 }}>
      <Box
        sx={{
          height: '60vh',
          position: 'relative',
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url(${getImageUrl(movie.backdrop_path, 'original')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          p: 4,
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <IconButton
          onClick={handleWatchlist}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          {isInWatchlist(movie.id, 'movie') ? (
            <BookmarkAddedIcon color="secondary" />
          ) : (
            <BookmarkAddIcon />
          )}
        </IconButton>

        <Grid container spacing={4} alignItems="flex-end">
          <Grid item xs={12} md={3}>
            <Paper
              elevation={6}
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                width: '100%',
                aspectRatio: '2/3',
              }}
            >
              <img
                src={
                  movie.poster_path
                    ? getImageUrl(movie.poster_path, 'w500')
                    : '/no-image.jpg'
                }
                alt={movie.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Typography variant="h3" component="h1" color="white">
                {movie.title}
              </Typography>
              <Typography variant="h5" color="rgba(255, 255, 255, 0.8)" gutterBottom>
                {movie.tagline}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ my: 2 }}>
                {movie.genres?.map((genre) => (
                  <Chip
                    key={genre.id}
                    label={genre.name}
                    color="primary"
                    size="small"
                  />
                ))}
              </Stack>

              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StarIcon color="secondary" sx={{ mr: 0.5 }} />
                  <Typography color="white">
                    {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimeIcon sx={{ mr: 0.5, color: 'white' }} />
                  <Typography color="white">
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DateIcon sx={{ mr: 0.5, color: 'white' }} />
                  <Typography color="white">
                    {new Date(movie.release_date).toLocaleDateString()}
                  </Typography>
                </Box>
              </Stack>
            </motion.div>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ p: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Overview" />
          <Tab label="Cast & Crew" />
          <Tab label="Media" />
          {trailer && <Tab label="Trailer" icon={<TrailerIcon />} />}
        </Tabs>

        {tabValue === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="body1" paragraph>
              {movie.overview}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <SectionHeader title="Details" />
                <List dense>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <LanguageIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Original Language"
                      secondary={movie.original_language.toUpperCase()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <DateIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Release Date"
                      secondary={new Date(movie.release_date).toLocaleDateString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <LinkIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Status"
                      secondary={movie.status}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <StarIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Budget"
                      secondary={movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <StarIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Revenue"
                      secondary={movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A'}
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <SectionHeader title="Production Companies" />
                <Grid container spacing={2}>
                  {movie.production_companies?.map((company) => (
                    <Grid item xs={6} sm={4} key={company.id}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {company.logo_path ? (
                          <img
                            src={getImageUrl(company.logo_path, 'w200')}
                            alt={company.name}
                            style={{ height: 50, objectFit: 'contain' }}
                          />
                        ) : (
                          <Typography variant="body2">{company.name}</Typography>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {tabValue === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader title="Cast" />
            <CastCarousel cast={movie.credits?.cast} />

            <SectionHeader title="Crew" sx={{ mt: 4 }} />
            <Grid container spacing={2}>
              {movie.credits?.crew
                ?.filter((person) => person.profile_path)
                .slice(0, 12)
                .map((person) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={person.credit_id}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar
                        alt={person.name}
                        src={getImageUrl(person.profile_path, 'w185')}
                        sx={{ width: 100, height: 100, mx: 'auto' }}
                      />
                      <Typography variant="subtitle2" sx={{ mt: 1 }}>
                        {person.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {person.job}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
            </Grid>
          </motion.div>
        )}

        {tabValue === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader title="Similar Movies" />
            <MediaCarousel items={movie.similar?.results} mediaType="movie" />

            <SectionHeader title="Images" sx={{ mt: 4 }} />
            <Grid container spacing={2}>
              {movie.images?.backdrops?.slice(0, 6).map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <img
                    src={getImageUrl(image.file_path, 'w500')}
                    alt={`Movie backdrop ${index + 1}`}
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {tabValue === 3 && trailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <YouTubeEmbed videoId={trailer.key} />
          </motion.div>
        )}
      </Box>
    </Box>
  );
};

export default MovieDetails;