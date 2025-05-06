import { Box } from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import MovieCard from './MovieCard';
import PersonCard from './PersonCard';


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

const MediaCarousel = ({ items, mediaType, showMediaType = false }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Carousel
      responsive={responsive}
      infinite
      keyBoardControl
      containerClass="carousel-container"
      removeArrowOnDeviceType={['mobile']}
      itemClass="carousel-item"
    >
      {items.map((item) => (
        <Box key={item.id} sx={{ p: 1 }}>
          {item.media_type === 'person' || mediaType === 'person' ? (
            <PersonCard person={item} />
          ) : (
            <MovieCard 
              item={item} 
              mediaType={item.media_type || mediaType} 
              showMediaType={showMediaType}
            />
          )}
        </Box>
      ))}
    </Carousel>
  );
};

export default MediaCarousel;