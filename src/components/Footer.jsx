import { Box, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        © {new Date().getFullYear()} Movie Explorer
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        <MuiLink 
          href="https://www.themoviedb.org/" 
          target="_blank" 
          rel="noopener"
        >
          <img 
            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg" 
            alt="TMDB Logo" 
            style={{ height: '20px', verticalAlign: 'middle', margin: '0 5px' }}
          />
        </MuiLink>
      </Typography>
    </Box>
  );
};

export default Footer;