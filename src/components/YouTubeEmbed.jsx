import { Box, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const YouTubeEmbed = ({ videoId }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              position: 'relative',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              height: 0,
              overflow: 'hidden',
            }}
          >
            <iframe
              width="100%"
              height="100%"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>
        </motion.div>
      </Paper>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
        Video courtesy of YouTube
      </Typography>
    </Box>
  );
};

export default YouTubeEmbed;