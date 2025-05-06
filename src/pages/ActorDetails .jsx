import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
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
  Chip,
  Link
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Cake as BirthdayIcon,
  Public as PlaceIcon,
  Star as StarIcon,
  Link as LinkIcon,
  Theaters as MovieIcon,
  Tv as TvIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { fetchPersonDetails,getImageUrl } from '../services/tmdb';
import MediaCarousel from '../components/MediaCarousel';
import SectionHeader from '../components/SectionHeader';


const ActorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        setLoading(true);
        const data = await fetchPersonDetails(id);
        setPerson(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonData();
  }, [id]);

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

  if (!person) {
    return null;
  }

  const knownFor = [...(person.combined_credits?.cast || [])]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10);

  return (
    <Box sx={{ pb: 4 }}>
      <Box
        sx={{
          height: { xs: 'auto', md: '50vh' },
          position: 'relative',
          backgroundImage: person.profile_path
            ? `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), url(${getImageUrl(person.profile_path, 'original')})`
            : 'none',
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
              {person.profile_path ? (
                <img
                  src={getImageUrl(person.profile_path, 'w500')}
                  alt={person.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.paper',
                  }}
                >
                  <PersonIcon sx={{ fontSize: 100, color: 'text.disabled' }} />
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Typography variant="h3" component="h1" color="white">
                {person.name}
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                {person.birthday && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BirthdayIcon sx={{ mr: 0.5, color: 'white' }} />
                    <Typography color="white">
                      {new Date(person.birthday).toLocaleDateString()}
                      {person.deathday && ` - ${new Date(person.deathday).toLocaleDateString()}`}
                    </Typography>
                  </Box>
                )}
                {person.place_of_birth && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PlaceIcon sx={{ mr: 0.5, color: 'white' }} />
                    <Typography color="white">
                      {person.place_of_birth}
                    </Typography>
                  </Box>
                )}
              </Stack>

              {person.also_known_as?.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.8)">
                    Also known as:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                    {person.also_known_as.map((name) => (
                      <Chip
                        key={name}
                        label={name}
                        size="small"
                        sx={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
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
          <Tab label="Biography" />
          <Tab label="Known For" />
          <Tab label="Gallery" />
        </Tabs>

        {tabValue === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="body1" paragraph>
              {person.biography || 'No biography available.'}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <SectionHeader title="Personal Info" />
                <List dense>
                  {person.birthday && (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <BirthdayIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Birthday"
                        secondary={new Date(person.birthday).toLocaleDateString()}
                      />
                    </ListItem>
                  )}
                  {person.deathday && (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <BirthdayIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Deathday"
                        secondary={new Date(person.deathday).toLocaleDateString()}
                      />
                    </ListItem>
                  )}
                  {person.place_of_birth && (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <PlaceIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Place of Birth"
                        secondary={person.place_of_birth}
                      />
                    </ListItem>
                  )}
                  {person.known_for_department && (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <StarIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Known For"
                        secondary={person.known_for_department}
                      />
                    </ListItem>
                  )}
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <SectionHeader title="External Links" />
                <List dense>
                  {person.homepage && (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <LinkIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Official Website"
                        secondary={
                          <Link href={person.homepage} target="_blank" rel="noopener">
                            {person.homepage}
                          </Link>
                        }
                      />
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <LinkIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="IMDb"
                      secondary={
                        <Link href={`https://www.imdb.com/name/${person.imdb_id}`} target="_blank" rel="noopener">
                          IMDb Profile
                        </Link>
                      }
                    />
                  </ListItem>
                </List>
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
            <SectionHeader title="Known For" />
            <MediaCarousel 
              items={knownFor} 
              mediaType="combined" 
              showMediaType 
            />

            <SectionHeader title="Filmography" sx={{ mt: 4 }} />
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 2 }}
            >
              <Tab label="All" icon={<StarIcon />} />
              <Tab label="Movies" icon={<MovieIcon />} />
              <Tab label="TV Shows" icon={<TvIcon />} />
            </Tabs>

            <Grid container spacing={2}>
              {person.combined_credits?.cast
                ?.filter((credit) => credit.poster_path)
                .slice(0, 12)
                .map((credit) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={credit.credit_id}>
                    <Box sx={{ textAlign: 'center' }}>
                      <img
                        src={getImageUrl(credit.poster_path, 'w185')}
                        alt={credit.title || credit.name}
                        style={{
                          width: '100%',
                          borderRadius: 8,
                          aspectRatio: '2/3',
                          objectFit: 'cover',
                        }}
                      />
                      <Typography variant="subtitle2" sx={{ mt: 1 }}>
                        {credit.title || credit.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {credit.character}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {credit.release_date && new Date(credit.release_date).getFullYear()}
                        {credit.first_air_date && new Date(credit.first_air_date).getFullYear()}
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
            <SectionHeader title="Images" />
            <Grid container spacing={2}>
              {person.images?.profiles?.slice(0, 12).map((image, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <img
                    src={getImageUrl(image.file_path, 'w500')}
                    alt={`${person.name} ${index + 1}`}
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}
      </Box>
    </Box>
  );
};

export default ActorDetails;