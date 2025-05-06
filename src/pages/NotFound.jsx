import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        p: 3,
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h1" component="h1" sx={{ mb: 2 }}>
          404
        </Typography>
        <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          size="large"
        >
          Go to Homepage
        </Button>
      </motion.div>
    </Box>
  );
};

export default NotFound;