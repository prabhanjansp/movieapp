import { Link } from 'react-router-dom';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box,
  Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import { getImageUrl } from '../services/tmdb';

const PersonCard = ({ person }) => {
  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <Link 
        to={`/person/${person.id}`} 
        style={{ textDecoration: 'none' }}
      >
        <Card sx={{ height: '100%' }}>
          <CardMedia
            component="div"
            sx={{
              height: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'background.paper',
            }}
          >
            <Avatar
              alt={person.name}
              src={
                person.profile_path
                  ? getImageUrl(person.profile_path, 'w500')
                  : undefined
              }
              sx={{ 
                width: 150, 
                height: 150,
                fontSize: 60
              }}
            />
          </CardMedia>
          <CardContent>
            <Typography variant="subtitle1" align="center" noWrap>
              {person.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {person.character || person.known_for_department}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default PersonCard;