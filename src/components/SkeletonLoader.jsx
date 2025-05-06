import { Skeleton } from '@mui/material';
import { Box } from '@mui/system';

export const MovieCardSkeleton = () => {
  return (
    <Box sx={{ p: 1 }}>
      <Skeleton variant="rectangular" width="100%" height={300} />
      <Skeleton width="80%" />
      <Skeleton width="60%" />
    </Box>
  );
};

export const CastSkeleton = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1 }}>
      <Skeleton variant="circular" width={100} height={100} />
      <Skeleton width="80%" sx={{ mt: 1 }} />
      <Skeleton width="60%" />
    </Box>
  );
};

export const DetailsSkeleton = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Skeleton variant="rectangular" width="100%" height={400} sx={{ mb: 3 }} />
      <Skeleton width="60%" height={40} sx={{ mb: 2 }} />
      <Skeleton width="100%" height={20} sx={{ mb: 1 }} />
      <Skeleton width="100%" height={20} sx={{ mb: 1 }} />
      <Skeleton width="80%" height={20} sx={{ mb: 3 }} />
      <Skeleton variant="rectangular" width="100%" height={200} />
    </Box>
  );
};