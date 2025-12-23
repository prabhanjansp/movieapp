import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Divider, 
  Grid, 
  Stack, 
  IconButton, 
  CircularProgress,
  Paper,
  Avatar,
  Button,
  Chip,
  Container,
  useTheme,
  alpha,
  useMediaQuery,
  Fab,
  LinearProgress
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Cake as BirthdayIcon,
  Star as StarIcon,
  Link as LinkIcon,
  Theaters as MovieIcon,
  Tv as TvIcon,
  Info as InfoIcon,
  PhotoLibrary as GalleryIcon,
  TrendingUp as TrendingIcon,
  Biotech as BioIcon,
  OpenInNew as OpenIcon,
  LocationOn as LocationIcon,
  School as DepartmentIcon,
  ExpandMore as ExpandIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchPersonDetails, getImageUrl } from '../services/tmdb';
import MediaCarousel from '../components/MediaCarousel';
import SectionHeader from '../components/SectionHeader';

const ActorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('biography');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);

  const sections = [
    { id: 'biography', label: 'Biography', icon: <BioIcon /> },
    { id: 'knownFor', label: 'Known For', icon: <TrendingIcon /> },
    { id: 'gallery', label: 'Gallery', icon: <GalleryIcon /> },
    { id: 'filmography', label: 'Filmography', icon: <MovieIcon /> },
  ];

  const filters = [
    { id: 'all', label: 'All', icon: <StarIcon /> },
    { id: 'movie', label: 'Movies', icon: <MovieIcon /> },
    { id: 'tv', label: 'TV Shows', icon: <TvIcon /> },
  ];

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getAge = (birthDate, deathDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    let age = end.getFullYear() - birth.getFullYear();
    const m = end.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const knownFor = [...(person?.combined_credits?.cast || [])]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 12);

  const filteredCredits = person?.combined_credits?.cast?.filter(credit => {
    if (activeFilter === 'all') return true;
    return credit.media_type === activeFilter;
  }) || [];

  const formatBiography = (bio) => {
    if (!bio) return 'No biography available.';
    if (bio.length <= 500 || showFullBio) return bio;
    return bio.substring(0, 500) + '...';
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'biography':
        return (
          <motion.div
            key="biography"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <InfoIcon color="primary" />
                Biography
              </Typography>
              
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.background.paper, 0.5),
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  mb: 3,
                }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontSize: '1.1rem', 
                    lineHeight: 1.8,
                    color: 'text.primary',
                    mb: 3
                  }}
                >
                  {formatBiography(person.biography)}
                </Typography>
                
                {person.biography && person.biography.length > 500 && (
                  <Button
                    onClick={() => setShowFullBio(!showFullBio)}
                    variant="text"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      }
                    }}
                  >
                    {showFullBio ? 'Show Less' : 'Read More'}
                    <ExpandIcon sx={{ 
                      transform: showFullBio ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }} />
                  </Button>
                )}
              </Paper>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Grid container spacing={4}>
              <Grid >
                <SectionHeader 
                  title="Personal Info" 
                  icon={<PersonIcon />}
                  sx={{ mb: 3 }}
                />
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  }}
                >
                  <Stack spacing={2}>
                    {person.birthday && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                          <BirthdayIcon color="primary" />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Birthday
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(person.birthday).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Typography>
                            {getAge(person.birthday, person.deathday) && (
                              <Chip
                                label={`${getAge(person.birthday, person.deathday)} years old`}
                                size="small"
                                sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    )}

                    {person.place_of_birth && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                          <LocationIcon color="success" />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Place of Birth
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {person.place_of_birth}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {person.known_for_department && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1) }}>
                          <DepartmentIcon color="secondary" />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Known For
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {person.known_for_department}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {person.popularity && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1) }}>
                          <TrendingIcon color="warning" />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Popularity Score
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min(person.popularity, 100)}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  bgcolor: alpha(theme.palette.divider, 0.3),
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: theme.palette.warning.main,
                                    borderRadius: 4,
                                  }
                                }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {person.popularity.toFixed(1)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              </Grid>

              <Grid >
                <SectionHeader 
                  title="External Links" 
                  icon={<LinkIcon />}
                  sx={{ mb: 3 }}
                />
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  }}
                >
                  <Stack spacing={2}>
                    {person.homepage && (
                      <Button
                        href={person.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        startIcon={<OpenIcon />}
                        fullWidth
                        sx={{
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          py: 1.5,
                          borderRadius: 2,
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          color: 'text.primary',
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                          }
                        }}
                      >
                        Official Website
                      </Button>
                    )}

                    {person.imdb_id && (
                      <Button
                        href={`https://www.imdb.com/name/${person.imdb_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        startIcon={<OpenIcon />}
                        fullWidth
                        sx={{
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          py: 1.5,
                          borderRadius: 2,
                          borderColor: alpha(theme.palette.warning.main, 0.3),
                          color: 'text.primary',
                          '&:hover': {
                            borderColor: theme.palette.warning.main,
                            bgcolor: alpha(theme.palette.warning.main, 0.05),
                          }
                        }}
                      >
                        IMDb Profile
                      </Button>
                    )}

                    {/* TMDB Profile */}
                    <Button
                      href={`https://www.themoviedb.org/person/${person.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      startIcon={<OpenIcon />}
                      fullWidth
                      sx={{
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        py: 1.5,
                        borderRadius: 2,
                        borderColor: alpha(theme.palette.info.main, 0.3),
                        color: 'text.primary',
                        '&:hover': {
                          borderColor: theme.palette.info.main,
                          bgcolor: alpha(theme.palette.info.main, 0.05),
                        }
                      }}
                    >
                      TMDB Profile
                    </Button>
                  </Stack>
                </Paper>

                {person.also_known_as?.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <SectionHeader 
                      title="Also Known As" 
                      icon={<PersonIcon />}
                      sx={{ mb: 3 }}
                    />
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                      }}
                    >
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        {person.also_known_as.slice(0, 8).map((name) => (
                          <Chip
                            key={name}
                            label={name}
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              fontWeight: 500,
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.2),
                              }
                            }}
                          />
                        ))}
                      </Stack>
                    </Paper>
                  </Box>
                )}
              </Grid>
            </Grid>
          </motion.div>
        );

      case 'knownFor':
        return (
          <motion.div
            key="knownFor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <TrendingIcon color="primary" />
                Known For
              </Typography>
              <MediaCarousel 
                items={knownFor} 
                mediaType="combined" 
                showMediaType 
              />
            </Box>
          </motion.div>
        );

      case 'gallery':
        return (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <GalleryIcon color="primary" />
              Photo Gallery
            </Typography>
            
            {person.images?.profiles && person.images.profiles.length > 0 ? (
              <Grid container spacing={2}>
                {person.images.profiles.slice(0, isMobile ? 4 : 12).map((image, index) => (
                  <Grid key={index}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                          cursor: 'pointer',
                        }}
                      >
                        <img
                          src={getImageUrl(image.file_path, 'w500')}
                          alt={`${person.name} ${index + 1}`}
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
                <GalleryIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Photos Available
                </Typography>
                <Typography color="text.secondary">
                  There are no photos available for {person.name} at this time.
                </Typography>
              </Paper>
            )}
          </motion.div>
        );

      case 'filmography':
        return (
          <motion.div
            key="filmography"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <MovieIcon color="primary" />
                Filmography
                <Chip 
                  label={`${filteredCredits.length} credits`}
                  size="small"
                  sx={{ ml: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                />
              </Typography>

              {/* Filter Tabs */}
              <Box sx={{ 
                display: 'flex',
                gap: 1,
                mb: 4,
                overflowX: 'auto',
                pb: 1,
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}>
                {filters.map((filter) => {
                  const count = person?.combined_credits?.cast?.filter(credit => {
                    if (filter.id === 'all') return true;
                    return credit.media_type === filter.id;
                  }).length || 0;
                  const isActive = activeFilter === filter.id;
                  
                  return (
                    <motion.button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
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
                        padding: '10px 20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        minWidth: 'fit-content',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        color: isActive ? 'white' : theme.palette.text.primary
                      }}>
                        {filter.icon}
                        <Typography
                          variant="button"
                          sx={{
                            fontWeight: isActive ? 600 : 500,
                            fontSize: '0.875rem',
                            color: isActive ? 'white' : 'inherit',
                          }}
                        >
                          {filter.label}
                        </Typography>
                        <Box
                          sx={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            bgcolor: isActive 
                              ? 'rgba(255,255,255,0.2)'
                              : alpha(theme.palette.text.secondary, 0.1),
                            color: isActive ? 'white' : theme.palette.text.secondary,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                          }}
                        >
                          {count}
                        </Box>
                      </Box>
                    </motion.button>
                  );
                })}
              </Box>

              {/* Credits Grid */}
              <Grid container spacing={isMobile ? 2 : 3}>
                {filteredCredits.slice(0, isMobile ? 6 : 12).map((credit, index) => (
                  <Grid  key={credit.credit_id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ y: -4 }}
                    >
                      <Paper
                        elevation={0}
                        component={RouterLink}
                        to={`/${credit.media_type === 'tv' ? 'tv' : 'movie'}/${credit.id}`}
                        sx={{
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                          textDecoration: 'none',
                          color: 'inherit',
                          display: 'block',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: alpha(theme.palette.primary.main, 0.3),
                            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
                            transform: 'translateY(-4px)',
                          }
                        }}
                      >
                        {credit.poster_path ? (
                          <img
                            src={getImageUrl(credit.poster_path, 'w500')}
                            alt={credit.title || credit.name}
                            style={{
                              width: '100%',
                              height: 200,
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: '100%',
                              height: 200,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {credit.media_type === 'tv' ? (
                              <TvIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                            ) : (
                              <MovieIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                            )}
                          </Box>
                        )}
                        
                        <Box sx={{ p: 2 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              lineHeight: 1.3,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              mb: 0.5,
                            }}
                          >
                            {credit.title || credit.name}
                          </Typography>
                          
                          {credit.character && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                fontStyle: 'italic',
                                display: 'block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              as {credit.character}
                            </Typography>
                          )}
                          
                          <Box sx={{ mt: 0.5 }}>
                            {(credit.release_date || credit.first_air_date) && (
                              <Typography variant="caption" color="text.secondary">
                                {credit.release_date && new Date(credit.release_date).getFullYear()}
                                {credit.first_air_date && new Date(credit.first_air_date).getFullYear()}
                              </Typography>
                            )}
                            {credit.vote_average && (
                              <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 1 }}>
                                <StarIcon sx={{ fontSize: 12, color: 'gold', mr: 0.25 }} />
                                <Typography variant="caption" color="text.secondary">
                                  {credit.vote_average.toFixed(1)}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>
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
            Error Loading Actor Details
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

  if (!person) {
    return null;
  }

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: { xs: 'auto', md: '65vh' },
          position: 'relative',
          backgroundImage: person.profile_path
            ? `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(${getImageUrl(person.profile_path, 'original')})`
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
          minHeight: { xs: 400, md: '65vh' },
        }}
      >
        {/* Navigation Button */}
        <Box sx={{ 
          position: 'absolute', 
          top: 16, 
          left: 16,
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
        </Box>

        {/* Hero Content */}
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, pb: 4 }}>
          <Grid container spacing={4} alignItems="flex-end">
            {/* Profile Image */}
            <Grid >
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
                        bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.light',
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 100, color: 'white' }} />
                    </Box>
                  )}
                </Paper>
              </motion.div>
            </Grid>

            {/* Actor Info */}
            <Grid >
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
                  {person.name}
                </Typography>

                {/* Quick Stats */}
                <Box sx={{ mt: 3, mb: 2 }}>
                  <Grid container spacing={3}>
                    {person.birthday && (
                      <Grid >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <BirthdayIcon sx={{ fontSize: 24, color: 'white' }} />
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                              <Typography variant="body1" color="white" sx={{ fontWeight: 500 }}>
                                {new Date(person.birthday).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </Typography>
                              {getAge(person.birthday, person.deathday) && (
                                <Typography variant="caption" color="rgba(255,255,255,0.7)">
                                  • {getAge(person.birthday, person.deathday)} years
                                  {person.deathday && ' • Deceased'}
                                </Typography>
                              )}
                            </Box>
                            <Typography variant="caption" color="rgba(255,255,255,0.7)">
                              Birthday
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}

                    {person.place_of_birth && (
                      <Grid >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <LocationIcon sx={{ fontSize: 24, color: 'white' }} />
                          <Box>
                            <Typography variant="body1" color="white" sx={{ fontWeight: 500 }}>
                              {person.place_of_birth.split(',')[0]}
                            </Typography>
                            <Typography variant="caption" color="rgba(255,255,255,0.7)">
                              Birth Place
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}

                    {person.popularity && (
                      <Grid >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <TrendingIcon sx={{ fontSize: 24, color: 'gold' }} />
                          <Box>
                            <Typography variant="body1" color="white" sx={{ fontWeight: 500 }}>
                              {person.popularity.toFixed(1)}
                            </Typography>
                            <Typography variant="caption" color="rgba(255,255,255,0.7)">
                              Popularity Score
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>

                {/* Known For Department */}
                {person.known_for_department && (
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      icon={<DepartmentIcon />}
                      label={person.known_for_department}
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.9),
                        color: 'white',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                        '& .MuiChip-icon': {
                          color: 'white',
                        }
                      }}
                    />
                  </Box>
                )}
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
                
                return (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
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
          <ExpandIcon />
        </Fab>
      )}
    </Box>
  );
};

export default ActorDetails;