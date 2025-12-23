// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//   Box, 
//   Typography, 
//   Chip, 
//   Divider, 
//   Grid, 
//   Stack, 
//   IconButton, 
//   CircularProgress,
//   Tab,
//   Tabs,
//   Paper,
//   Avatar,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Button,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails
// } from '@mui/material';
// import { 
//   ArrowBack as ArrowBackIcon,
//   BookmarkAdd as BookmarkAddIcon,
//   BookmarkAdded as BookmarkAddedIcon,
//   Star as StarIcon,
//   CalendarToday as DateIcon,
//   Theaters as TrailerIcon,
//   Link as LinkIcon,
//   Language as LanguageIcon,
//   ExpandMore as ExpandMoreIcon,
//   Tv as TvIcon,
//   Movie as MovieIcon
// } from '@mui/icons-material';
// import { motion } from 'framer-motion';

// import { fetchTVDetails, getImageUrl } from '../services/tmdb';
// import { useAppContext } from '../contexts/AppContext';
// import CastCarousel from '../components/CastCarousel';
// import MediaCarousel from '../components/MediaCarousel';
// import SectionHeader from '../components/SectionHeader';
// import YouTubeEmbed from '../components/YouTubeEmbed';

// const TvDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useAppContext();
//   const [tvShow, setTvShow] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [tabValue, setTabValue] = useState(0);
//   const [expandedSeason, setExpandedSeason] = useState(null);

//   useEffect(() => {
//     const fetchTVShow = async () => {
//       try {
//         setLoading(true);
//         const data = await fetchTVDetails(id);
//         setTvShow(data);
//         if (data.seasons?.length > 0) {
//           setExpandedSeason(data.seasons[0].season_number);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTVShow();
//   }, [id]);

//   const handleWatchlist = () => {
//     const itemToAdd = {
//       id: tvShow.id,
//       title: tvShow.name,
//       poster_path: tvShow.poster_path,
//       media_type: 'tv',
//       release_date: tvShow.first_air_date,
//       vote_average: tvShow.vote_average,
//     };

//     if (isInWatchlist(tvShow.id, 'tv')) {
//       removeFromWatchlist(tvShow.id, 'tv');
//     } else {
//       addToWatchlist(itemToAdd);
//     }
//   };

//   const handleSeasonChange = (seasonNumber) => (event, isExpanded) => {
//     setExpandedSeason(isExpanded ? seasonNumber : null);
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: 3, textAlign: 'center' }}>
//         <Typography color="error">{error}</Typography>
//         <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
//           Go Back
//         </Button>
//       </Box>
//     );
//   }

//   if (!tvShow) {
//     return null;
//   }

//   const trailer = tvShow.videos?.results.find(
//     (video) => video.type === 'Trailer' && video.site === 'YouTube'
//   );

//   return (
//     <Box sx={{ pb: 4 }}>
//       <Box
//         sx={{
//           height: '60vh',
//           position: 'relative',
//           backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url(${getImageUrl(tvShow.backdrop_path, 'original')})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           display: 'flex',
//           alignItems: 'flex-end',
//           p: 4,
//         }}
//       >
//         <IconButton
//           onClick={() => navigate(-1)}
//           sx={{
//             position: 'absolute',
//             top: 16,
//             left: 16,
//             color: 'white',
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           }}
//         >
//           <ArrowBackIcon />
//         </IconButton>

//         <IconButton
//           onClick={handleWatchlist}
//           sx={{
//             position: 'absolute',
//             top: 16,
//             right: 16,
//             color: 'white',
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           }}
//         >
//           {isInWatchlist(tvShow.id, 'tv') ? (
//             <BookmarkAddedIcon color="secondary" />
//           ) : (
//             <BookmarkAddIcon />
//           )}
//         </IconButton>

//         <Grid container spacing={4} alignItems="flex-end">
//           <Grid >
//             <Paper
//               elevation={6}
//               component={motion.div}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               sx={{
//                 borderRadius: 2,
//                 overflow: 'hidden',
//                 width: '100%',
//                 aspectRatio: '2/3',
//               }}
//             >
//               <img
//                 src={
//                   tvShow.poster_path
//                     ? getImageUrl(tvShow.poster_path, 'w500')
//                     : '/no-image.jpg'
//                 }
//                 alt={tvShow.name}
//                 style={{
//                   width: '100%',
//                   height: '100%',
//                   objectFit: 'cover',
//                 }}
//               />
//             </Paper>
//           </Grid>

//           <Grid>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.2, duration: 0.5 }}
//             >
//               <Typography variant="h3" component="h1" color="white">
//                 {tvShow.name}
//               </Typography>
//               <Typography variant="h5" color="rgba(255, 255, 255, 0.8)" gutterBottom>
//                 {tvShow.tagline}
//               </Typography>

//               <Stack direction="row" spacing={1} sx={{ my: 2 }}>
//                 {tvShow.genres?.map((genre) => (
//                   <Chip
//                     key={genre.id}
//                     label={genre.name}
//                     color="primary"
//                     size="small"
//                   />
//                 ))}
//               </Stack>

//               <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                   <StarIcon color="secondary" sx={{ mr: 0.5 }} />
//                   <Typography color="white">
//                     {tvShow.vote_average.toFixed(1)} ({tvShow.vote_count} votes)
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                   <DateIcon sx={{ mr: 0.5, color: 'white' }} />
//                   <Typography color="white">
//                     {new Date(tvShow.first_air_date).toLocaleDateString()}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                   <TvIcon sx={{ mr: 0.5, color: 'white' }} />
//                   <Typography color="white">
//                     {tvShow.number_of_seasons} season{tvShow.number_of_seasons !== 1 ? 's' : ''}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                   <MovieIcon sx={{ mr: 0.5, color: 'white' }} />
//                   <Typography color="white">
//                     {tvShow.number_of_episodes} episode{tvShow.number_of_episodes !== 1 ? 's' : ''}
//                   </Typography>
//                 </Box>
//               </Stack>
//             </motion.div>
//           </Grid>
//         </Grid>
//       </Box>

//       <Box sx={{ p: 3 }}>
//         <Tabs
//           value={tabValue}
//           onChange={(e, newValue) => setTabValue(newValue)}
//           centered
//           sx={{ mb: 3 }}
//         >
//           <Tab label="Overview" />
//           <Tab label="Seasons" />
//           <Tab label="Cast & Crew" />
//           <Tab label="Media" />
//           {trailer && <Tab label="Trailer" icon={<TrailerIcon />} />}
//         </Tabs>

//         {tabValue === 0 && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             <Typography variant="body1" paragraph>
//               {tvShow.overview}
//             </Typography>

//             <Divider sx={{ my: 3 }} />

//             <Grid container spacing={3}>
//               <Grid>
//                 <SectionHeader title="Details" />
//                 <List dense>
//                   <ListItem>
//                     <ListItemAvatar>
//                       <Avatar>
//                         <LanguageIcon />
//                       </Avatar>
//                     </ListItemAvatar>
//                     <ListItemText
//                       primary="Original Language"
//                       secondary={tvShow.original_language.toUpperCase()}
//                     />
//                   </ListItem>
//                   <ListItem>
//                     <ListItemAvatar>
//                       <Avatar>
//                         <DateIcon />
//                       </Avatar>
//                     </ListItemAvatar>
//                     <ListItemText
//                       primary="First Air Date"
//                       secondary={new Date(tvShow.first_air_date).toLocaleDateString()}
//                     />
//                   </ListItem>
//                   <ListItem>
//                     <ListItemAvatar>
//                       <Avatar>
//                         <LinkIcon />
//                       </Avatar>
//                     </ListItemAvatar>
//                     <ListItemText
//                       primary="Status"
//                       secondary={tvShow.status}
//                     />
//                   </ListItem>
//                   <ListItem>
//                     <ListItemAvatar>
//                       <Avatar>
//                         <TvIcon />
//                       </Avatar>
//                     </ListItemAvatar>
//                     <ListItemText
//                       primary="Type"
//                       secondary={tvShow.type}
//                     />
//                   </ListItem>
//                   <ListItem>
//                     <ListItemAvatar>
//                       <Avatar>
//                         <StarIcon />
//                       </Avatar>
//                     </ListItemAvatar>
//                     <ListItemText
//                       primary="Last Episode"
//                       secondary={
//                         tvShow.last_episode_to_air
//                           ? `S${tvShow.last_episode_to_air.season_number}E${tvShow.last_episode_to_air.episode_number}: ${tvShow.last_episode_to_air.name}`
//                           : 'N/A'
//                       }
//                     />
//                   </ListItem>
//                 </List>
//               </Grid>

//               <Grid>
//                 <SectionHeader title="Production Companies" />
//                 <Grid container spacing={2}>
//                   {tvShow.production_companies?.map((company) => (
//                     <Grid key={company.id}>
//                       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                         {company.logo_path ? (
//                           <img
//                             src={getImageUrl(company.logo_path, 'w200')}
//                             alt={company.name}
//                             style={{ height: 50, objectFit: 'contain' }}
//                           />
//                         ) : (
//                           <Typography variant="body2">{company.name}</Typography>
//                         )}
//                       </Box>
//                     </Grid>
//                   ))}
//                 </Grid>
//               </Grid>
//             </Grid>
//           </motion.div>
//         )}

//         {tabValue === 1 && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             <SectionHeader title="Seasons" />
//             {tvShow.seasons?.map((season) => (
//               <Accordion
//                 key={season.id}
//                 expanded={expandedSeason === season.season_number}
//                 onChange={handleSeasonChange(season.season_number)}
//                 sx={{ mb: 2 }}
//               >
//                 <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//                     {season.poster_path && (
//                       <img
//                         src={getImageUrl(season.poster_path, 'w92')}
//                         alt={season.name}
//                         style={{ height: 70, marginRight: 16, borderRadius: 4 }}
//                       />
//                     )}
//                     <Box sx={{ flexGrow: 1 }}>
//                       <Typography variant="h6">{season.name}</Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {season.air_date && new Date(season.air_date).getFullYear()} • {season.episode_count} episodes
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   <Typography variant="body2" paragraph>
//                     {season.overview || 'No overview available.'}
//                   </Typography>
//                 </AccordionDetails>
//               </Accordion>
//             ))}
//           </motion.div>
//         )}

//         {tabValue === 2 && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             <SectionHeader title="Cast" />
//             <CastCarousel cast={tvShow.credits?.cast} />

//             <SectionHeader title="Crew" sx={{ mt: 4 }} />
//             <Grid container spacing={2}>
//               {tvShow.credits?.crew
//                 ?.filter((person) => person.profile_path)
//                 .slice(0, 12)
//                 .map((person) => (
//                   <Grid  key={person.credit_id}>
//                     <Box sx={{ textAlign: 'center' }}>
//                       <Avatar
//                         alt={person.name}
//                         src={getImageUrl(person.profile_path, 'w185')}
//                         sx={{ width: 100, height: 100, mx: 'auto' }}
//                       />
//                       <Typography variant="subtitle2" sx={{ mt: 1 }}>
//                         {person.name}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {person.job}
//                       </Typography>
//                     </Box>
//                   </Grid>
//                 ))}
//             </Grid>
//           </motion.div>
//         )}

//         {tabValue === 3 && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             <SectionHeader title="Similar TV Shows" />
//             <MediaCarousel items={tvShow.similar?.results} mediaType="tv" />

//             <SectionHeader title="Images" sx={{ mt: 4 }} />
//             <Grid container spacing={2}>
//               {tvShow.images?.backdrops?.slice(0, 6).map((image, index) => (
//                 <Grid item xs={12} sm={6} md={4} key={index}>
//                   <img
//                     src={getImageUrl(image.file_path, 'w500')}
//                     alt={`TV Show backdrop ${index + 1}`}
//                     style={{ width: '100%', borderRadius: 8 }}
//                   />
//                 </Grid>
//               ))}
//             </Grid>
//           </motion.div>
//         )}

//         {tabValue === 4 && trailer && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             <YouTubeEmbed videoId={trailer.key} />
//           </motion.div>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default TvDetails;
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
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Container,
  useTheme,
  alpha,
  useMediaQuery,
  Badge,
  Tooltip,
  Fab,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  BookmarkAddOutlined as BookmarkAddIcon,
  BookmarkAdded as BookmarkAddedIcon,
  Star as StarIcon,
  CalendarToday as DateIcon,
  Theaters as TrailerIcon,
  Language as LanguageIcon,
  ExpandMore as ExpandMoreIcon,
  Tv as TvIcon,
  Movie as MovieIcon,
  Info as InfoIcon,
  Groups as CastIcon,
  MovieFilter as MediaIcon,
  LocalMovies as SeasonsIcon,
  Link as LinkIcon,
  PlayCircle as PlayIcon,
  CheckCircle as StatusIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

import { fetchTVDetails, getImageUrl } from '../services/tmdb';
import { useAppContext } from '../contexts/AppContext';
import CastCarousel from '../components/CastCarousel';
import MediaCarousel from '../components/MediaCarousel';
import SectionHeader from '../components/SectionHeader';
import YouTubeEmbed from '../components/YouTubeEmbed';

const TvDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useAppContext();
  const [tvShow, setTvShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedSeason, setExpandedSeason] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const sections = [
    { id: 'overview', label: 'Overview', icon: <InfoIcon /> },
    { id: 'seasons', label: 'Seasons', icon: <SeasonsIcon /> },
    { id: 'cast', label: 'Cast & Crew', icon: <CastIcon /> },
    { id: 'media', label: 'Media', icon: <MediaIcon /> },
    { id: 'trailer', label: 'Trailer', icon: <TrailerIcon /> },
  ];

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const formatSeasonEpisode = (seasonNumber, episodeNumber) => {
    return `S${seasonNumber.toString().padStart(2, '0')}E${episodeNumber.toString().padStart(2, '0')}`;
  };

  const trailer = tvShow?.videos?.results.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 2
                }}
              >
                Synopsis
              </Typography>
              <Typography 
                variant="body1" 
                paragraph 
                sx={{ 
                  fontSize: '1.1rem', 
                  lineHeight: 1.8,
                  color: 'text.primary',
                  mb: 3
                }}
              >
                {tvShow.overview}
              </Typography>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <SectionHeader 
                  title="TV Show Details" 
                  icon={<InfoIcon />}
                  sx={{ mb: 3 }}
                />
                <List disablePadding>
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemAvatar sx={{ minWidth: 48 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                        <LanguageIcon color="primary" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Original Language"
                      secondary={
                        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                          {tvShow.original_language?.toUpperCase() || 'N/A'}
                        </Typography>
                      }
                    />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemAvatar sx={{ minWidth: 48 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                        <DateIcon color="success" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="First Air Date"
                      secondary={
                        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                          {tvShow.first_air_date 
                            ? new Date(tvShow.first_air_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : 'TBA'
                          }
                        </Typography>
                      }
                    />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemAvatar sx={{ minWidth: 48 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1) }}>
                        <StatusIcon color="warning" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Status"
                      secondary={
                        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                          {tvShow.status || 'N/A'}
                        </Typography>
                      }
                    />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemAvatar sx={{ minWidth: 48 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1) }}>
                        <TvIcon color="secondary" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Type"
                      secondary={
                        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                          {tvShow.type || 'TV Series'}
                        </Typography>
                      }
                    />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemAvatar sx={{ minWidth: 48 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }}>
                        <PlayIcon color="info" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Last Episode"
                      secondary={
                        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                          {tvShow.last_episode_to_air
                            ? `${formatSeasonEpisode(
                                tvShow.last_episode_to_air.season_number,
                                tvShow.last_episode_to_air.episode_number
                              )}: ${tvShow.last_episode_to_air.name}`
                            : 'N/A'
                          }
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <SectionHeader 
                  title="Production Companies" 
                  icon={<TrendingIcon />}
                  sx={{ mb: 3 }}
                />
                <Grid container spacing={2}>
                  {tvShow.production_companies?.map((company) => (
                    <Grid item xs={6} sm={4} key={company.id}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          textAlign: 'center',
                          bgcolor: alpha(theme.palette.background.paper, 0.5),
                          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: 100,
                        }}
                      >
                        {company.logo_path ? (
                          <img
                            src={getImageUrl(company.logo_path, 'w200')}
                            alt={company.name}
                            style={{ 
                              height: 40, 
                              width: '100%',
                              objectFit: 'contain',
                              marginBottom: 8 
                            }}
                          />
                        ) : (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontWeight: 500,
                              color: 'text.secondary',
                              textAlign: 'center'
                            }}
                          >
                            {company.name}
                          </Typography>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                {tvShow.networks && tvShow.networks.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <SectionHeader 
                      title="Networks" 
                      icon={<LinkIcon />}
                      sx={{ mb: 3 }}
                    />
                    <Grid container spacing={2}>
                      {tvShow.networks.map((network) => (
                        <Grid item xs={6} sm={4} key={network.id}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              textAlign: 'center',
                              bgcolor: alpha(theme.palette.background.paper, 0.5),
                              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                            }}
                          >
                            {network.logo_path && (
                              <img
                                src={getImageUrl(network.logo_path, 'w200')}
                                alt={network.name}
                                style={{ 
                                  height: 40, 
                                  width: '100%',
                                  objectFit: 'contain'
                                }}
                              />
                            )}
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Grid>
            </Grid>
          </motion.div>
        );

      case 'seasons':
        return (
          <motion.div
            key="seasons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 3
              }}
            >
              Seasons ({tvShow.number_of_seasons})
            </Typography>
            
            {tvShow.seasons?.map((season) => (
              <Accordion
                key={season.id}
                expanded={expandedSeason === season.season_number}
                onChange={handleSeasonChange(season.season_number)}
                sx={{ 
                  mb: 2,
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-expanded': {
                      minHeight: 48,
                    },
                    '& .MuiAccordionSummary-content': {
                      alignItems: 'center',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                    {season.poster_path ? (
                      <img
                        src={getImageUrl(season.poster_path, 'w92')}
                        alt={season.name}
                        style={{ 
                          height: 80, 
                          width: 60,
                          borderRadius: 4,
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 60,
                          height: 80,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        }}
                      >
                        <TvIcon color="primary" />
                      </Avatar>
                    )}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {season.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {season.air_date && new Date(season.air_date).getFullYear()} • {season.episode_count} episodes
                      </Typography>
                    </Box>
                    <Chip
                      label={`Season ${season.season_number}`}
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                  <Typography variant="body2" paragraph sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {season.overview || 'No overview available for this season.'}
                  </Typography>
                  {season.air_date && (
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      Aired on {new Date(season.air_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </motion.div>
        );

      case 'cast':
        return (
          <motion.div
            key="cast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 3
                }}
              >
                Main Cast
              </Typography>
              <CastCarousel cast={tvShow.credits?.cast} />
            </Box>
            
            <Box sx={{ mt: 6 }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 3
                }}
              >
                Crew Members
              </Typography>
              <Grid container spacing={2}>
                {tvShow.credits?.crew
                  ?.filter((person) => person.profile_path)
                  .slice(0, isMobile ? 4 : 12)
                  .map((person) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={person.credit_id}>
                      <motion.div whileHover={{ y: -4 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            textAlign: 'center',
                            bgcolor: alpha(theme.palette.background.paper, 0.5),
                            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          <Avatar
                            alt={person.name}
                            src={getImageUrl(person.profile_path, 'w185')}
                            sx={{ 
                              width: 80, 
                              height: 80, 
                              mx: 'auto',
                              mb: 1.5
                            }}
                          />
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 600,
                              textAlign: 'center',
                              mb: 0.5
                            }}
                          >
                            {person.name}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'primary.main',
                              fontWeight: 500,
                              textAlign: 'center',
                              display: 'block'
                            }}
                          >
                            {person.job}
                          </Typography>
                        </Paper>
                      </motion.div>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </motion.div>
        );

      case 'media':
        return (
          <motion.div
            key="media"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 3
              }}
            >
              TV Show Images
            </Typography>
            <Grid container spacing={2}>
              {tvShow.images?.backdrops?.slice(0, isMobile ? 2 : 6).map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                      }}
                    >
                      <img
                        src={getImageUrl(image.file_path, 'w500')}
                        alt={`${tvShow.name} backdrop ${index + 1}`}
                        style={{ 
                          width: '100%', 
                          height: 200,
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 6 }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 3
                }}
              >
                Similar TV Shows
              </Typography>
              <MediaCarousel items={tvShow.similar?.results} mediaType="tv" />
            </Box>
          </motion.div>
        );

      case 'trailer':
        return trailer ? (
          <motion.div
            key="trailer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 3
              }}
            >
              Official Trailer
            </Typography>
            <Box sx={{ 
              borderRadius: 2, 
              overflow: 'hidden',
              mb: 4
            }}>
              <YouTubeEmbed videoId={trailer.key} />
            </Box>
            
            {tvShow.videos?.results.length > 1 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  More Videos
                </Typography>
                <Grid container spacing={2}>
                  {tvShow.videos.results.slice(1, 4).map((video) => (
                    <Grid item xs={12} sm={6} md={4} key={video.id}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.background.paper, 0.5),
                          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                          }
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <PlayIcon color="primary" />
                          <Box>
                            <Typography variant="subtitle2">
                              {video.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {video.type}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </motion.div>
        ) : (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              bgcolor: alpha(theme.palette.background.paper, 0.5),
              border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`
            }}
          >
            <TrailerIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Trailer Available
            </Typography>
            <Typography color="text.secondary">
              The trailer for this TV show is not available at the moment.
            </Typography>
          </Paper>
        );

      default:
        return null;
    }
  };

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

  if (error) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Paper
          sx={{
            p: 6,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.error.main, 0.05),
            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Error Loading TV Show
          </Typography>
          <Typography color="text.secondary" paragraph>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!tvShow) {
    return null;
  }

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: { xs: '50vh', md: '65vh' },
          position: 'relative',
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8)), url(${getImageUrl(tvShow.backdrop_path, 'original')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
        }}
      >
        {/* Navigation Buttons */}
        <Box sx={{ 
          position: 'absolute', 
          top: 16, 
          left: 16, 
          right: 16,
          display: 'flex',
          justifyContent: 'space-between',
          zIndex: 10
        }}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                color: 'white',
                bgcolor: alpha(theme.palette.common.black, 0.6),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                '&:hover': {
                  bgcolor: alpha(theme.palette.common.black, 0.8),
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Tooltip 
              title={isInWatchlist(tvShow.id, 'tv') ? "Remove from Watchlist" : "Add to Watchlist"}
              arrow
            >
              <IconButton
                onClick={handleWatchlist}
                sx={{
                  color: isInWatchlist(tvShow.id, 'tv') ? theme.palette.secondary.main : 'white',
                  bgcolor: alpha(theme.palette.common.black, 0.6),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.common.black, 0.8),
                  }
                }}
              >
                {isInWatchlist(tvShow.id, 'tv') ? (
                  <BookmarkAddedIcon />
                ) : (
                  <BookmarkAddIcon />
                )}
              </IconButton>
            </Tooltip>
          </motion.div>
        </Box>

        {/* Hero Content */}
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, pb: 4 }}>
          <Grid container spacing={4} alignItems="flex-end">
            {/* Poster Column */}
            <Grid item xs={12} md={3} lg={2.5}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%' }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    width: '100%',
                    maxWidth: { xs: 280, sm: 320, md: '100%' },
                    margin: '0 auto',
                    aspectRatio: '2/3',
                    border: `4px solid ${alpha(theme.palette.common.white, 0.1)}`,
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
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
              </motion.div>
            </Grid>

            {/* Info Column */}
            <Grid item xs={12} md={9} lg={9.5}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Typography 
                  variant={isMobile ? 'h4' : 'h2'} 
                  component="h1" 
                  color="white"
                  sx={{ 
                    fontWeight: 700,
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    mb: 1,
                    lineHeight: 1.2
                  }}
                >
                  {tvShow.name}
                </Typography>
                
                {tvShow.tagline && (
                  <Typography 
                    variant={isMobile ? 'h6' : 'h5'} 
                    color="rgba(255, 255, 255, 0.9)" 
                    gutterBottom
                    sx={{ 
                      fontStyle: 'italic',
                      fontWeight: 300,
                      mb: 3
                    }}
                  >
                    "{tvShow.tagline}"
                  </Typography>
                )}

                {/* Genres */}
                <Stack 
                  direction="row" 
                  spacing={1} 
                  sx={{ my: 2, flexWrap: 'wrap', gap: 1 }}
                >
                  {tvShow.genres?.map((genre) => (
                    <Chip
                      key={genre.id}
                      label={genre.name}
                      size="medium"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.9),
                        color: 'white',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                      }}
                    />
                  ))}
                </Stack>

                {/* Stats */}
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      
                        <StarIcon sx={{ fontSize: 32, color: 'gold', mr: 1 }} />
                   
                      <Box>
                        <Typography variant="body1" color="white" sx={{ fontWeight: 500 }}>
                          {tvShow.vote_average.toFixed(1)} / 10
                        </Typography>
                        <Typography variant="caption" color="rgba(255,255,255,0.7)">
                          {tvShow.vote_count.toLocaleString()} votes
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DateIcon sx={{ fontSize: 32, color: 'white', mr: 2 }} />
                      <Box>
                        <Typography variant="body1" color="white" sx={{ fontWeight: 500 }}>
                          {tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : 'TBA'}
                        </Typography>
                        <Typography variant="caption" color="rgba(255,255,255,0.7)">
                          First Aired
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TvIcon sx={{ fontSize: 32, color: 'white', mr: 2 }} />
                      <Box>
                        <Typography variant="body1" color="white" sx={{ fontWeight: 500 }}>
                          {tvShow.number_of_seasons} Season{tvShow.number_of_seasons !== 1 ? 's' : ''}
                        </Typography>
                        <Typography variant="caption" color="rgba(255,255,255,0.7)">
                          {tvShow.number_of_episodes} Episodes
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Content Area */}
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Paper
          elevation={isScrolled ? 4 : 0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            transition: 'all 0.3s ease',
          }}
        >
          {/* Section Navigation */}
          <Box sx={{ 
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            bgcolor: theme.palette.background.paper,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            backdropFilter: 'blur(10px)',
          }}>
            <Box sx={{ 
              display: 'flex', 
              overflowX: 'auto',
              px: { xs: 2, md: 3 },
              py: 2,
              gap: 1,
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}>
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                const disabled = section.id === 'trailer' && !trailer;
                
                if (disabled) return null;

                return (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    disabled={disabled}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                        : theme.palette.mode === 'dark'
                          ? alpha(theme.palette.background.paper, 0.5)
                          : alpha(theme.palette.grey[100], 0.8),
                      border: 'none',
                      borderRadius: 12,
                      padding: '12px 20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      minWidth: 'fit-content',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.3s ease',
                      opacity: disabled ? 0.5 : 1,
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      color: isActive ? 'white' : theme.palette.text.primary
                    }}>
                      {section.icon}
                      <Typography
                        variant="button"
                        sx={{
                          fontWeight: isActive ? 700 : 600,
                          fontSize: '0.875rem',
                          color: isActive ? 'white' : 'inherit',
                        }}
                      >
                        {section.label}
                      </Typography>
                    </Box>
                  </motion.button>
                );
              })}
            </Box>
          </Box>

          {/* Content Section */}
          <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }} id="content-section">
            <AnimatePresence mode="wait">
              {renderSection()}
            </AnimatePresence>
          </Box>
        </Paper>
      </Container>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
          onClick={() => {
            const element = document.getElementById('content-section');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <ExpandMoreIcon />
        </Fab>
      )}
    </Box>
  );
};

export default TvDetails;