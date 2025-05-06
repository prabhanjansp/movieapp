import { Box, Typography, Divider } from '@mui/material';
import { motion } from 'framer-motion';

const SectionHeader = ({ title, sx }) => {
  return (
    <Box sx={{ mb: 3, ...sx }}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>
        <Divider />
      </motion.div>
    </Box>
  );
};

export default SectionHeader;