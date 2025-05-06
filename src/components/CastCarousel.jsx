import { Box, Typography, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { getImageUrl } from '../services/tmdb';

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 8,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 6,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 4,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 3,
  },
};

const CastCarousel = ({ cast }) => {
  if (!cast || cast.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No cast information available.
      </Typography>
    );
  }

  return (
    <Carousel
      responsive={responsive}
      infinite
      autoPlay
      autoPlaySpeed={3000}
      keyBoardControl
      customTransition="all .5"
      transitionDuration={500}
      containerClass="carousel-container"
      removeArrowOnDeviceType={['mobile']}
      itemClass="carousel-item"
    >
      {cast.map((person) => (
        <Box
          key={person.id}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 1,
            textAlign: 'center',
          }}
          component={motion.div}
          whileHover={{ scale: 1.05 }}
        >
          <Avatar
            alt={person.name}
            src={
              person.profile_path
                ? getImageUrl(person.profile_path, 'w185')
                : '/no-image.jpg'
            }
            sx={{ width: 100, height: 100, mb: 1 }}
          />
          <Typography variant="subtitle2">{person.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {person.character}
          </Typography>
        </Box>
      ))}
    </Carousel>
  );
};

export default CastCarousel;