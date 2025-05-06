import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  const handleCatch = (error, errorInfo) => {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    setHasError(true);
  };

  if (hasError) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          p: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Something went wrong
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          We're sorry for the inconvenience. Please try refreshing the page.
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </Button>
      </Box>
    );
  }

  return children;
};

export default ErrorBoundary;