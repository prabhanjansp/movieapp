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
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  BookmarkAdd as BookmarkAddIcon,
  BookmarkAdded as BookmarkAddedIcon,
  Star as StarIcon,
  CalendarToday as DateIcon,
  Theaters as TrailerIcon,
  Link as LinkIcon,
  Language as LanguageIcon,
  ExpandMore as ExpandMoreIcon,
  Tv as TvIcon,
  Movie as MovieIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import { fetchTVDetails, getImageUrl } from '../services/tmdb';
import { useAppContext } from '../contexts/AppContext';
import CastCarousel from '../components/CastCarousel';
import MediaCarousel from '../components/MediaCarousel';
import SectionHeader from '../components/SectionHeader';
import YouTubeEmbed from '../components/YouTubeEmbed';

const TvDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useAppContext();
  const [tvShow, setTvShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [expandedSeason, setExpandedSeason] = useState(null);

  useEffect(() => {
    const fetchTVShow = async () => {
      try {
        setLoading(true);
        const data = await fetchTVDetails(id);
        setTvShow(data);
        if (data.seasons?.length > 0) {
          setExpandedSeason(data.seasons[0].season_number);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTVShow();
  }, [id]);

  const handleWatchlist = () => {
    const itemToAdd = {
      id: tvShow.id,
      title: tvShow.name,
      poster_path: tvShow.poster_path,
      media_type: 'tv',
      release_date: tvShow.first_air_date,
      vote_average: tvShow.vote_average,
    };

    if (isInWatchlist(tvShow.id, 'tv')) {
      removeFromWatchlist(tvShow.id, 'tv');
    } else {
      addToWatchlist(itemToAdd);
    }
  };

  const handleSeasonChange = (seasonNumber) => (event, isExpanded) => {
    setExpandedSeason(isExpanded ? seasonNumber : null);
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

  if (!tvShow) {
    return null;
  }

  const trailer = tvShow.videos?.results.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  return (
    <Box sx={{ pb: 4 }}>
      <Box
        sx={{
          height: '60vh',
          position: 'relative',
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url(${getImageUrl(tvShow.backdrop_path, 'original')})`,
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
          {isInWatchlist(tvShow.id, 'tv') ? (
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
                  tvShow.poster_path
                    ? getImageUrl(tvShow.poster_path, 'w500')
                    : '/no-image.jpg'
                }
                alt={tvShow.name}
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
                {tvShow.name}
              </Typography>
              <Typography variant="h5" color="rgba(255, 255, 255, 0.8)" gutterBottom>
                {tvShow.tagline}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ my: 2 }}>
                {tvShow.genres?.map((genre) => (
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
                    {tvShow.vote_average.toFixed(1)} ({tvShow.vote_count} votes)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DateIcon sx={{ mr: 0.5, color: 'white' }} />
                  <Typography color="white">
                    {new Date(tvShow.first_air_date).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TvIcon sx={{ mr: 0.5, color: 'white' }} />
                  <Typography color="white">
                    {tvShow.number_of_seasons} season{tvShow.number_of_seasons !== 1 ? 's' : ''}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MovieIcon sx={{ mr: 0.5, color: 'white' }} />
                  <Typography color="white">
                    {tvShow.number_of_episodes} episode{tvShow.number_of_episodes !== 1 ? 's' : ''}
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
          <Tab label="Seasons" />
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
              {tvShow.overview}
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
                      secondary={tvShow.original_language.toUpperCase()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <DateIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="First Air Date"
                      secondary={new Date(tvShow.first_air_date).toLocaleDateString()}
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
                      secondary={tvShow.status}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <TvIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Type"
                      secondary={tvShow.type}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <StarIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Last Episode"
                      secondary={
                        tvShow.last_episode_to_air
                          ? `S${tvShow.last_episode_to_air.season_number}E${tvShow.last_episode_to_air.episode_number}: ${tvShow.last_episode_to_air.name}`
                          : 'N/A'
                      }
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <SectionHeader title="Production Companies" />
                <Grid container spacing={2}>
                  {tvShow.production_companies?.map((company) => (
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
            <SectionHeader title="Seasons" />
            {tvShow.seasons?.map((season) => (
              <Accordion
                key={season.id}
                expanded={expandedSeason === season.season_number}
                onChange={handleSeasonChange(season.season_number)}
                sx={{ mb: 2 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {season.poster_path && (
                      <img
                        src={getImageUrl(season.poster_path, 'w92')}
                        alt={season.name}
                        style={{ height: 70, marginRight: 16, borderRadius: 4 }}
                      />
                    )}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">{season.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {season.air_date && new Date(season.air_date).getFullYear()} • {season.episode_count} episodes
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" paragraph>
                    {season.overview || 'No overview available.'}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </motion.div>
        )}

        {tabValue === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader title="Cast" />
            <CastCarousel cast={tvShow.credits?.cast} />

            <SectionHeader title="Crew" sx={{ mt: 4 }} />
            <Grid container spacing={2}>
              {tvShow.credits?.crew
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

        {tabValue === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader title="Similar TV Shows" />
            <MediaCarousel items={tvShow.similar?.results} mediaType="tv" />

            <SectionHeader title="Images" sx={{ mt: 4 }} />
            <Grid container spacing={2}>
              {tvShow.images?.backdrops?.slice(0, 6).map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <img
                    src={getImageUrl(image.file_path, 'w500')}
                    alt={`TV Show backdrop ${index + 1}`}
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {tabValue === 4 && trailer && (
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

export default TvDetails;