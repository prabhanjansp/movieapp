import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Avatar, 
  Paper, 
  useTheme, 
  alpha, 
  IconButton, 
  useMediaQuery,
  Chip,
  CircularProgress,
  Tooltip,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { 
  ArrowForwardIos, 
  ArrowBackIos, 
  Person as PersonIcon,
  TrendingUp as TrendingIcon,
  Female as FemaleIcon,
  Male as MaleIcon,
  Explore as ExploreIcon
} from '@mui/icons-material';
import { getImageUrl } from '../services/tmdb';

const CastCarousel = ({ cast, title = "Cast", loading = false, movieId }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [isHovering, setIsHovering] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  // Responsive configuration - Fixed for mobile scrolling
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1800 },
      items: 7,
      slidesToSlide: 7,
    },
    desktop: {
      breakpoint: { max: 1800, min: 1200 },
      items: 6,
      slidesToSlide: 6,
    },
    smallDesktop: {
      breakpoint: { max: 1200, min: 900 },
      items: 5,
      slidesToSlide: 5,
    },
    tablet: {
      breakpoint: { max: 900, min: 600 },
      items: 4,
      slidesToSlide: 4,
    },
    smallTablet: {
      breakpoint: { max: 600, min: 464 },
      items: 3,
      slidesToSlide: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
      slidesToSlide: 2,
      partialVisibilityGutter: 30,
    },
  };

  const handleImageError = (personId) => {
    setImageErrors(prev => ({ ...prev, [personId]: true }));
  };

  const CustomArrow = ({ onClick, direction = 'left', disabled }) => {
    if (isMobile) return null;
    
    return (
      <IconButton
        onClick={onClick}
        disabled={disabled}
        aria-label={direction === 'left' ? 'Previous cast member' : 'Next cast member'}
        sx={{
          position: 'absolute',
          [direction === 'left' ? 'left' : 'right']: -20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          bgcolor: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          color: theme.palette.text.primary,
          width: 40,
          height: 40,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.15)}`,
          '&:hover': {
            bgcolor: alpha(theme.palette.background.paper, 1),
            transform: 'translateY(-50%) scale(1.1)',
          },
          transition: 'all 0.3s ease',
          '&.Mui-disabled': {
            opacity: 0.3,
            cursor: 'not-allowed',
          },
        }}
      >
        {direction === 'left' ? (
          <ArrowBackIos sx={{ fontSize: 16, ml: 0.5 }} />
        ) : (
          <ArrowForwardIos sx={{ fontSize: 16 }} />
        )}
      </IconButton>
    );
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ width: '100%', py: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 3,
            color: 'text.primary',
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          }}
        >
          {title}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  // Empty state
  if (!cast || cast.length === 0) {
    return (
      <Box sx={{ width: '100%', py: 4 }}>
        {title && (
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: 'text.primary',
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
            }}
          >
            {title}
          </Typography>
        )}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            bgcolor: alpha(theme.palette.background.paper, 0.5),
            border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`
          }}
        >
          <PersonIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            No cast information available
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ExploreIcon />}
            onClick={() => navigate('/movies')}
            sx={{ borderRadius: 2 }}
          >
            Explore Movies
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', position: 'relative', py: 2 }}>
      {/* Section Header */}
      <Box sx={{ mb: 4 }}>
        {title && (
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: 'text.primary',
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
            }}
          >
            {title}
          </Typography>
        )}

        {/* Cast Count */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <TrendingIcon fontSize="small" />
          {cast.length} cast member{cast.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Carousel Container */}
      <Box 
        sx={{ 
          position: 'relative', 
          width: '100%',
          px: { xs: 1, sm: 0 },
          '& .carousel-container': {
            overflow: 'visible !important',
            padding: '0 5px',
          },
          '& .react-multi-carousel-track': {
            gap: isMobile ? '16px' : '24px',
            marginLeft: isMobile ? 0 : 'auto',
            marginRight: isMobile ? 0 : 'auto',
          },
          '& .react-multi-carousel-item': {
            display: 'flex',
            justifyContent: 'center',
          }
        }}
        onMouseEnter={() => !isMobile && setIsHovering(true)}
        onMouseLeave={() => !isMobile && setIsHovering(false)}
      >
        <Carousel
          responsive={responsive}
          infinite={cast.length > 5}
          autoPlay={false}
          keyBoardControl={true}
          customTransition="transform 300ms ease-in-out"
          transitionDuration={300}
          containerClass="carousel-container"
          removeArrowOnDeviceType={['mobile']}
          itemClass="carousel-item"
          partialVisible={false}
          customLeftArrow={<CustomArrow direction="left" />}
          customRightArrow={<CustomArrow direction="right" />}
          draggable={true}
          swipeable={true}
          centerMode={false}
          focusOnSelect={false}
          additionalTransform={0}
          slidesToSlide={isMobile ? 1 : 3}
          shouldResetAutoplay={false}
          rewind={false}
          rewindWithAnimation={false}
          rtl={false}
        >
          {cast.map((person, index) => {
            const imageUrl = person.profile_path 
              ? getImageUrl(person.profile_path, 'w500')
              : null;
            const hasImageError = imageErrors[person.id];

            return (
              <Box
                key={`${person.id}-${index}-${person.character || 'unknown'}`}
                sx={{
                  px: { xs: 0.5, sm: 1 },
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100% !important',
                }}
              >
                <Link 
                  to={`/person/${person.id}`} 
                  style={{ 
                    textDecoration: 'none', 
                    width: '100%',
                    display: 'block'
                  }}
                  aria-label={`View ${person.name}'s profile`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: Math.min(index * 0.05, 1) // Limit delay to prevent long animations
                    }}
                    whileHover={{ 
                      y: -8,
                      transition: { duration: 0.2 }
                    }}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        height: '100%',
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        width: '100%',
                        maxWidth: { xs: 160, sm: 180, md: 200 },
                        mx: 'auto',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                          transform: 'translateY(-4px)',
                        },
                      }}
                    >
                      {/* Avatar Container */}
                      <Box sx={{ position: 'relative', mb: 2, width: '100%' }}>
                        <Avatar
                          alt={person.name}
                          src={!hasImageError ? imageUrl : undefined}
                          onError={() => handleImageError(person.id)}
                          sx={{
                            width: { xs: 80, sm: 100, md: 120 },
                            height: { xs: 80, sm: 100, md: 120 },
                            border: `3px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            transition: 'all 0.3s ease',
                            bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.light',
                            fontSize: { xs: 32, sm: 40 },
                            mx: 'auto',
                            '&:hover': {
                              borderColor: alpha(theme.palette.primary.main, 0.3),
                              transform: 'scale(1.05)',
                            },
                          }}
                        >
                          {(!imageUrl || hasImageError) && <PersonIcon />}
                        </Avatar>
                        
                        {/* Order Badge - Only show if order is defined and less than 10 */}
                        {typeof person.order === 'number' && person.order < 10 && (
                          <Tooltip title={`Featured cast #${person.order + 1}`} arrow>
                            <Box
                              sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                bgcolor: theme.palette.primary.main,
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                                zIndex: 2,
                              }}
                            >
                              #{person.order + 1}
                            </Box>
                          </Tooltip>
                        )}
                      </Box>

                      {/* Name */}
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          mb: 0.5,
                          color: 'text.primary',
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          lineHeight: 1.3,
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          minHeight: { xs: '2.6em', sm: '2.6em' },
                        }}
                      >
                        {person.name}
                      </Typography>

                      {/* Character */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                          lineHeight: 1.4,
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          mb: 2,
                          fontStyle: person.character ? 'italic' : 'normal',
                          minHeight: { xs: '2.8em', sm: '2.8em' },
                        }}
                      >
                        {person.character || 'Actor/Actress'}
                      </Typography>

                      {/* Additional Info */}
                      {(person.gender || person.popularity) && (
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
                            mt: 'auto',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            width: '100%',
                          }}
                        >
                          {/* Gender */}
                          {person.gender && (
                            <Tooltip 
                              title={
                                person.gender === 1 ? 'Female' : 
                                person.gender === 2 ? 'Male' : 
                                'Not specified'
                              } 
                              arrow
                            >
                              <Chip
                                icon={person.gender === 1 ? <FemaleIcon /> : <MaleIcon />}
                                size="small"
                                sx={{
                                  fontSize: '0.65rem',
                                  height: 22,
                                  bgcolor: alpha(
                                    person.gender === 1 
                                      ? theme.palette.secondary.main 
                                      : theme.palette.primary.main,
                                    0.1
                                  ),
                                  color: person.gender === 1 
                                    ? theme.palette.secondary.main 
                                    : theme.palette.primary.main,
                                  '& .MuiChip-icon': {
                                    fontSize: 12,
                                  }
                                }}
                              />
                            </Tooltip>
                          )}
                          
                          {/* Popularity */}
                          {person.popularity && (
                            <Tooltip title={`Popularity: ${person.popularity.toFixed(1)}`} arrow>
                              <Chip
                                label={person.popularity.toFixed(1)}
                                size="small"
                                sx={{
                                  fontSize: '0.65rem',
                                  height: 22,
                                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                                  color: theme.palette.warning.main,
                                  fontWeight: 600,
                                }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      )}
                    </Paper>
                  </motion.div>
                </Link>
              </Box>
            );
          })}
        </Carousel>

        {/* Mobile Scroll Indicator */}
        {isMobile && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
              }}
            >
              ← Swipe to scroll →
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CastCarousel;