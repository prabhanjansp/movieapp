import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  IconButton, 
  Typography, 
  useTheme, 
  alpha, 
  useMediaQuery,
  Skeleton,
  Paper,
  Chip
} from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import MovieCard from './MovieCard';
import PersonCard from './PersonCard';
import { 
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  PlayArrow as PlayIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MediaCarousel = ({ 
  items, 
  mediaType, 
  showMediaType = false, 
  title,
  subtitle,
  loading = false,
  autoPlay = true,
  autoPlaySpeed = 4000,
  showDots = false,
  showControls = true,
  infinite = true,
  centerMode = false,
  focusOnSelect = false,
  itemClass = '',
  containerClass = '',
  sx = {},
  onItemClick
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 2000 },
      items: 8,
      slidesToSlide: 3,
      partialVisibilityGutter: 40
    },
    largeDesktop: {
      breakpoint: { max: 2000, min: 1600 },
      items: 7,
      slidesToSlide: 3,
      partialVisibilityGutter: 30
    },
    desktop: {
      breakpoint: { max: 1600, min: 1200 },
      items: 6,
      slidesToSlide: 3,
      partialVisibilityGutter: 30
    },
    smallDesktop: {
      breakpoint: { max: 1200, min: 1024 },
      items: 5,
      slidesToSlide: 2,
      partialVisibilityGutter: 20
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 4,
      slidesToSlide: 2,
      partialVisibilityGutter: 20
    },
    smallTablet: {
      breakpoint: { max: 768, min: 600 },
      items: 3,
      slidesToSlide: 2,
      partialVisibilityGutter: 20
    },
    mobile: {
      breakpoint: { max: 600, min: 464 },
      items: 3,
      slidesToSlide: 2,
      partialVisibilityGutter: 10
    },
    smallMobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
      slidesToSlide: 1,
      partialVisibilityGutter: 10
    },
  };

  // Custom arrow components
  const CustomLeftArrow = ({ onClick, ...rest }) => {
    const isDisabled = rest.currentSlide === 0 && !infinite;
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isHovered ? 1 : 0.7, x: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.3 : 1,
        }}
      >
        <IconButton
          onClick={!isDisabled ? onClick : undefined}
          sx={{
            bgcolor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            width: 48,
            height: 48,
            boxShadow: theme.shadows[8],
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: theme.palette.background.paper,
              transform: 'scale(1.1)',
            },
            ...(isDisabled && {
              '&:hover': {
                cursor: 'not-allowed',
                transform: 'none',
              }
            })
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </motion.div>
    );
  };

  const CustomRightArrow = ({ onClick, ...rest }) => {
    const isLastSlide = rest.currentSlide >= rest.totalItems - rest.slidesToShow;
    const isDisabled = isLastSlide && !infinite;
    
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isHovered ? 1 : 0.7, x: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.3 : 1,
        }}
      >
        <IconButton
          onClick={!isDisabled ? onClick : undefined}
          sx={{
            bgcolor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            width: 48,
            height: 48,
            boxShadow: theme.shadows[8],
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: theme.palette.background.paper,
              transform: 'scale(1.1)',
            },
            ...(isDisabled && {
              '&:hover': {
                cursor: 'not-allowed',
                transform: 'none',
              }
            })
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </motion.div>
    );
  };

  // Custom dot component
  const CustomDot = ({ onClick, active, index, carouselState }) => {
    return (
      <button
        onClick={() => onClick()}
        style={{
          width: active ? 24 : 8,
          height: 8,
          background: active 
            ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
            : alpha(theme.palette.text.secondary, 0.3),
          border: 'none',
          borderRadius: 4,
          margin: '0 4px',
          padding: 0,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          transform: active ? 'scale(1.2)' : 'scale(1)',
        }}
      />
    );
  };

  // Handle slide change
  const handleBeforeChange = (nextSlide) => {
    setActiveSlide(nextSlide);
  };

  // Loading skeleton
  const renderSkeletons = () => {
    const skeletonCount = isMobile ? 2 : isTablet ? 4 : 6;
    
    return Array.from({ length: skeletonCount }).map((_, index) => (
      <Box key={index} sx={{ p: 1 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: alpha(theme.palette.background.paper, 0.5),
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height={isMobile ? 160 : 240}
            sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
          />
          <Box sx={{ p: 2 }}>
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="60%" height={16} />
          </Box>
        </Paper>
      </Box>
    ));
  };

  if (loading) {
    return (
      <Box sx={{ ...sx, position: 'relative' }}>
        {title && (
          <Box sx={{ mb: 3, px: { xs: 2, sm: 3 } }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        )}
        
        <Box sx={{ px: { xs: 1, sm: 2 } }}>
          <Carousel
            responsive={responsive}
            infinite={infinite}
            containerClass={`carousel-container ${containerClass}`}
            itemClass={`carousel-item ${itemClass}`}
            removeArrowOnDeviceType={['smallMobile', 'mobile']}
            draggable={isMobile}
            swipeable={isMobile}
            autoPlay={false}
            arrows={!isMobile}
            showDots={false}
          >
            {renderSkeletons()}
          </Carousel>
        </Box>
      </Box>
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Box 
      sx={{ 
        ...sx, 
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      {(title || subtitle) && (
        <Box sx={{ 
          mb: 3, 
          px: { xs: 2, sm: 3 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box>
            {title && (
              <Typography 
                variant="h5" 
                component="h2" 
                sx={{ 
                  fontWeight: 700,
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                {title}
                {items.length > 0 && (
                  <Chip
                    label={items.length}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                    }}
                  />
                )}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* Slide indicator */}
          {items.length > (isMobile ? 2 : isTablet ? 4 : 6) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {activeSlide + 1} / {Math.ceil(items.length / (isMobile ? 2 : isTablet ? 4 : 6))}
              </Typography>
              <TrendingIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            </Box>
          )}
        </Box>
      )}

      {/* Carousel Container */}
      <Box sx={{ 
        position: 'relative',
        px: { xs: 1, sm: 2 },
        py: 1,
      }}>
        <Carousel
          ref={carouselRef}
          responsive={responsive}
          infinite={infinite}
          keyBoardControl
          containerClass={`carousel-container ${containerClass}`}
          itemClass={`carousel-item ${itemClass}`}
          removeArrowOnDeviceType={['smallMobile', 'mobile']}
          draggable={true}
          swipeable={true}
          autoPlay={autoPlay && !isHovered}
          autoPlaySpeed={autoPlaySpeed}
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
          customDot={<CustomDot />}
          showDots={showDots && isMobile}
          arrows={showControls && !isMobile}
          beforeChange={handleBeforeChange}
          centerMode={centerMode}
          focusOnSelect={focusOnSelect}
          partialVisible={centerMode}
          additionalTransfrom={0}
          minimumTouchDrag={80}
          ssr={true}
          renderButtonGroupOutside={false}
          renderDotsOutside={true}
          dotListClass="custom-dot-list"
          sliderClass="carousel-slider"
          trackClass="carousel-track"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <Box 
                sx={{ 
                  p: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  }
                }}
                onClick={() => onItemClick && onItemClick(item)}
              >
                {item.media_type === 'person' || mediaType === 'person' ? (
                  <PersonCard 
                    person={item} 
                    elevation={isHovered && activeSlide === index ? 8 : 2}
                  />
                ) : (
                  <MovieCard 
                    item={item} 
                    mediaType={item.media_type || mediaType} 
                    showMediaType={showMediaType}
                    elevation={isHovered && activeSlide === index ? 8 : 2}
                  />
                )}
              </Box>
            </motion.div>
          ))}
        </Carousel>

        {/* Gradient overlays for better visibility */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 60,
            background: `linear-gradient(90deg, ${theme.palette.background.default} 0%, transparent 100%)`,
            pointerEvents: 'none',
            zIndex: 2,
            opacity: isHovered ? 0.7 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 60,
            background: `linear-gradient(270deg, ${theme.palette.background.default} 0%, transparent 100%)`,
            pointerEvents: 'none',
            zIndex: 2,
            opacity: isHovered ? 0.7 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      </Box>

      {/* Custom styles */}
      <style jsx global>{`
        .carousel-container {
          position: relative;
          padding: 8px 0;
        }
        
        .carousel-item {
          padding: 4px;
        }
        
        .carousel-slider {
          padding: 8px 0;
        }
        
        .carousel-track {
          display: flex;
          align-items: stretch;
        }
        
        .custom-dot-list {
          position: absolute;
          bottom: -30px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          padding: 10px 0;
          margin: 0;
        }
        
        .react-multi-carousel-item {
          display: flex;
          height: auto;
        }
        
        /* Hide default arrows */
        .react-multiple-carousel__arrow {
          display: none;
        }
        
        /* Custom scrollbar for draggable carousel */
        .carousel-slider::-webkit-scrollbar {
          height: 4px;
        }
        
        .carousel-slider::-webkit-scrollbar-track {
          background: ${alpha(theme.palette.divider, 0.1)};
          border-radius: 2px;
        }
        
        .carousel-slider::-webkit-scrollbar-thumb {
          background: ${alpha(theme.palette.primary.main, 0.3)};
          border-radius: 2px;
        }
        
        .carousel-slider::-webkit-scrollbar-thumb:hover {
          background: ${alpha(theme.palette.primary.main, 0.5)};
        }
      `}</style>
    </Box>
  );
};

export default MediaCarousel;