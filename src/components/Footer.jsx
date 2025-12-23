import { Box, Typography, Link as MuiLink } from '@mui/material';

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
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        // position: 'sticky',
        // bottom: 0,
        // left: 0,
        // right: 0,
        // zIndex: 1000,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Copyright Section */}
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Movie Explorer
        </Typography>

        {/* TMDB Attribution */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Data provided by
          </Typography>
          <MuiLink
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'opacity 0.3s ease',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            <img
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
              alt="TMDB Logo"
              style={{
                height: '20px',
                width: 'auto',
              }}
            />
          </MuiLink>
        </Box>

        {/* Legal Text */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            textAlign: { xs: 'center', sm: 'right' },
            maxWidth: '300px',
            opacity: 0.8,
          }}
        >
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;