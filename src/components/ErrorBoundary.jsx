import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  useTheme,
  alpha,
  Stack,
  Collapse,
  
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Refresh as RefreshIcon,
  Home as HomeIcon,
  ReportProblem as ReportIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Code as CodeIcon,
  BugReport as BugReportIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Error handler for uncaught errors
    const handleError = (errorEvent) => {
      console.error('Uncaught error:', errorEvent.error);
      setHasError(true);
      setError(errorEvent.error);
    };

    // Error handler for unhandled promise rejections
    const handleUnhandledRejection = (promiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', promiseRejectionEvent.reason);
      setHasError(true);
      setError(promiseRejectionEvent.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const handleCatch = (error, info) => {
    console.error('ErrorBoundary caught an error:', error, info);
    setHasError(true);
    setError(error);
    setErrorInfo(info);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleReset = () => {
    setHasError(false);
    setError(null);
    setErrorInfo(null);
    setShowDetails(false);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  if (hasError) {
    return (
      <ErrorDisplay
        error={error}
        errorInfo={errorInfo}
        showDetails={showDetails}
        onRefresh={handleRefresh}
        onReset={handleReset}
        onToggleDetails={toggleDetails}
      />
    );
  }

  // Render children normally
  try {
    return children;
  } catch (error) {
    handleCatch(error, { componentStack: error.stack });
    return null;
  }
};

const ErrorDisplay = ({ error, errorInfo, showDetails, onRefresh, onReset, onToggleDetails }) => {
  const theme = useTheme();

  // Animated background particles
  const Particle = ({ delay }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.5, 0],
        scale: [0, 1, 0],
        x: [0, Math.random() * 100 - 50],
        y: [0, Math.random() * 100 - 50],
      }}
      transition={{
        duration: 3,
        delay: delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
      }}
      style={{
        position: 'absolute',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: alpha(theme.palette.error.main, 0.3),
      }}
    />
  );

  return (
    <Container maxWidth="md" sx={{ py: 8, position: 'relative', overflow: 'hidden' }}>
      {/* Animated background particles */}
      {[...Array(15)].map((_, i) => (
        <Particle key={i} delay={i * 0.2} />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            bgcolor: theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.95)
              : 'white',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Gradient header */}
          <Box
            sx={{
              height: 6,
              background: `linear-gradient(90deg, ${theme.palette.error.main} 0%, ${theme.palette.warning.main} 50%, ${theme.palette.info.main} 100%)`,
            }}
          />

          <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
            {/* Animated error icon */}
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{ textAlign: 'center', marginBottom: 24 }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  border: `2px solid ${alpha(theme.palette.error.main, 0.2)}`,
                }}
              >
                <BugReportIcon
                  sx={{
                    fontSize: 48,
                    color: theme.palette.error.main
                  }}
                />
              </Box>
            </motion.div>

            {/* Error title */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                mb: 2,
                color: 'text.primary',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              }}
            >
              Something Went Wrong
            </Typography>

            {/* Error message */}
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              We encountered an unexpected error. Don't worry, our team has been notified.
              You can try refreshing the page or go back to the homepage.
            </Typography>

            {/* Error code if available */}
            {error?.message && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.error.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CodeIcon fontSize="small" color="error" />
                  <Typography variant="subtitle2" color="error.main" sx={{ fontWeight: 600 }}>
                    Error Details
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontFamily: 'monospace',
                    display: 'block',
                    wordBreak: 'break-word',
                  }}
                >
                  {error.message.length > 200
                    ? `${error.message.substring(0, 200)}...`
                    : error.message
                  }
                </Typography>
              </Paper>
            )}

            {/* Action buttons */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{
                mb: 4,
                justifyContent: 'center',
                '& .MuiButton-root': {
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                }
              }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  onClick={onRefresh}
                  startIcon={<RefreshIcon />}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                    }
                  }}
                >
                  Refresh Page
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  component={Link}
                  to="/"
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  sx={{
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    color: 'text.primary',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                    }
                  }}
                >
                  Go to Homepage
                </Button>
              </motion.div>
            </Stack>

            {/* Error details toggle */}
            {(errorInfo || error?.stack) && (
              <Box sx={{ mb: 3 }}>
                <Button
                  fullWidth
                  onClick={onToggleDetails}
                  startIcon={showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  endIcon={<ReportIcon />}
                  sx={{
                    justifyContent: 'space-between',
                    textTransform: 'none',
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'text.primary',
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                    }
                  }}
                >
                  {showDetails ? 'Hide Technical Details' : 'Show Technical Details'}
                </Button>

                <Collapse in={showDetails}>
                  <Paper
                    elevation={0}
                    sx={{
                      mt: 2,
                      p: 3,
                      borderRadius: 2,
                      bgcolor: theme.palette.mode === 'dark'
                        ? 'grey.900'
                        : 'grey.50',
                      border: `1px solid ${theme.palette.divider}`,
                      maxHeight: 300,
                      overflow: 'auto',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        fontSize: '0.75rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {error?.stack || errorInfo?.componentStack || 'No stack trace available'}
                    </Typography>
                  </Paper>
                </Collapse>
              </Box>
            )}

            {/* Debug button for development */}
            {process.env.NODE_ENV === 'development' && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="text"
                  onClick={onReset}
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    '&:hover': {
                      color: 'text.primary',
                    }
                  }}
                >
                  Reset Error State
                </Button>
              </motion.div>
            )}

            {/* Additional help */}
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                color: 'text.secondary',
                mt: 3,
                fontStyle: 'italic',
              }}
            >
              If the problem persists, please contact our support team.
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default ErrorBoundary;