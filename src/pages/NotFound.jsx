import { Box, Typography, Button, Container, useTheme, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

const NotFound = () => {
  const theme = useTheme();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: theme.palette.mode === 'dark' 
              ? 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)'
              : 'radial-gradient(circle at 20% 50%, rgba(33, 150, 243, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(156, 39, 176, 0.05) 0%, transparent 50%)',
            zIndex: -1,
          }}
        />

        {/* Floating 404 numbers */}
        <Box sx={{ position: 'relative', mb: 4 }}>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            style={{ position: 'relative' }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '8rem', sm: '12rem', md: '15rem' },
                fontWeight: 900,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1,
                letterSpacing: '-0.05em',
                position: 'relative',
                mb: 2,
              }}
            >
              404
            </Typography>
            
            {/* Animated icon */}
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                y: [0, -10, 0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <SearchOffIcon
                sx={{
                  fontSize: { xs: '6rem', sm: '8rem', md: '10rem' },
                  color: theme.palette.mode === 'dark' 
                    ? 'rgba(255,255,255,0.15)' 
                    : 'rgba(0,0,0,0.1)',
                  filter: 'blur(2px)',
                }}
              />
            </motion.div>
          </motion.div>
        </Box>

        {/* Main content */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Stack spacing={2} alignItems="center">
            {/* Title with icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SentimentDissatisfiedIcon
                sx={{
                  fontSize: '2.5rem',
                  color: theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main',
                }}
              />
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' },
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #90caf9, #bb86fc)'
                    : 'linear-gradient(45deg, #1976d2, #9c27b0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Oops! Page Not Found
              </Typography>
            </Box>

            {/* Description */}
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                maxWidth: '600px',
                lineHeight: 1.6,
                mb: 1,
                fontWeight: 400,
              }}
            >
              It seems like you've wandered off the path. The page you're looking for might have been moved, deleted, or never existed.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: '500px',
                lineHeight: 1.6,
                mb: 4,
              }}
            >
              Don't worry, even the best explorers get lost sometimes. Let's get you back on track!
            </Typography>

            {/* Action buttons */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mt: 4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  component={Link}
                  to="/"
                  variant="contained"
                  size="large"
                  startIcon={<HomeIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8],
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Go to Homepage
                </Button>
              </motion.div>

              {window.history.length > 1 && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleGoBack}
                    variant="outlined"
                    size="large"
                    startIcon={<ArrowBackIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[4],
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Go Back
                  </Button>
                </motion.div>
              )}
            </Stack>

            {/* Helpful links */}
            <Box sx={{ mt: 6, pt: 4, borderTop: `1px solid ${theme.palette.divider}`, width: '100%' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                Quick Links
              </Typography>
              <Stack
                direction="row"
                spacing={3}
                justifyContent="center"
                flexWrap="wrap"
              >
                {['Movies', 'TV Shows', 'Trending', 'Popular'].map((link, index) => (
                  <motion.div
                    key={link}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <Button
                      component={Link}
                      to={`/${link.toLowerCase().replace(' ', '-')}`}
                      variant="text"
                      size="small"
                      sx={{
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'primary.main',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {link}
                    </Button>
                  </motion.div>
                ))}
              </Stack>
            </Box>
          </Stack>
        </motion.div>

        {/* Floating particles */}
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              scale: 0,
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
            }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0],
              x: Math.random() * 200 - 100,
              y: Math.random() * 200 - 100,
            }}
            transition={{
              duration: 3,
              delay: index * 0.3,
              repeat: Infinity,
              repeatDelay: Math.random() * 2,
            }}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: theme.palette.mode === 'dark'
                ? 'rgba(156, 39, 176, 0.5)'
                : 'rgba(33, 150, 243, 0.5)',
              zIndex: -1,
            }}
          />
        ))}

        {/* Error code hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'text.disabled',
              fontFamily: 'monospace',
              fontSize: '0.7rem',
            }}
          >
            Error 404: Resource not found
          </Typography>
        </motion.div>
      </Box>
    </Container>
  );
};

export default NotFound;