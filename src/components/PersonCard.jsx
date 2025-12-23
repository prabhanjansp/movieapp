import { Link } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Paper,
  Stack
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Star as StarIcon,
  Person as PersonIcon,
  EmojiEvents as AwardIcon,
  Visibility as PopularityIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { getImageUrl } from '../services/tmdb';

const PersonCard = ({ person, showDetails = true }) => {
  const theme = useTheme();

  const getPopularityColor = (popularity) => {
    if (popularity > 50) return theme.palette.success.main;
    if (popularity > 20) return theme.palette.warning.main;
    return theme.palette.text.secondary;
  };

  const getPopularityLevel = (popularity) => {
    if (popularity > 50) return 'High';
    if (popularity > 20) return 'Medium';
    return 'Low';
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ height: '100%' }}
    >
      <Link
        to={`/person/${person.id}`}
        style={{ textDecoration: 'none', display: 'block', height: '100%' }}
      >
        <Paper
          elevation={0}
          sx={{
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            bgcolor: theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.9)
              : 'white',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              borderColor: alpha(theme.palette.primary.main, 0.3),
              boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.1)}`,
            },
          }}
        >
          {/* Avatar Container with Gradient Background */}
          <Box
            sx={{
              position: 'relative',
              height: 200,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(156, 39, 176, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(156, 39, 176, 0.05) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Decorative Elements */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 30% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)',
              }}
            />

            {/* Main Avatar */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 2 }}
              transition={{ duration: 0.3 }}
            >
              <Avatar
                alt={person.name}
                src={
                  person.profile_path
                    ? getImageUrl(person.profile_path, 'w500')
                    : undefined
                }
                sx={{
                  width: 120,
                  height: 120,
                  border: `4px solid ${alpha(theme.palette.background.paper, 0.9)}`,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.15)}`,
                  bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.light',
                  fontSize: 48,
                  fontWeight: 700,
                }}
              >
                {!person.profile_path && (
                  <PersonIcon sx={{ fontSize: 40, color: 'white' }} />
                )}
              </Avatar>
            </motion.div>

            {/* Popularity Badge */}
            {person.popularity && (
              <Tooltip title={`Popularity: ${getPopularityLevel(person.popularity)}`} arrow>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 20,
                    bgcolor: alpha(theme.palette.background.paper, 0.9),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
                  }}
                >
                  <PopularityIcon sx={{ fontSize: 16, color: getPopularityColor(person.popularity) }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    {person.popularity.toFixed(1)}
                  </Typography>
                </Box>
              </Tooltip>
            )}

            {/* Known For Badge */}
            {person.known_for_department && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                }}
              >
                <Chip
                  label={person.known_for_department}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 24,
                    bgcolor: alpha(theme.palette.primary.main, 0.9),
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    '& .MuiChip-label': { px: 1.5 },
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Content Area */}
          <CardContent sx={{ p: 2.5 }}>
            <Stack spacing={1.5}>
              {/* Name */}
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.3,
                  textAlign: 'center',
                  color: 'text.primary',
                  fontSize: '1rem',
                  minHeight: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {person.name}
              </Typography>

              {/* Character/Role */}
              {person.character && (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                      lineHeight: 1.4,
                      fontStyle: 'italic',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    as {person.character}
                  </Typography>
                </Box>
              )}

              {/* Additional Information */}
              {showDetails && (
                <Stack spacing={1} sx={{ mt: 1 }}>
                  {/* Known For */}
                  {person.known_for && person.known_for.length > 0 && (
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 600,
                          display: 'block',
                          mb: 0.5,
                        }}
                      >
                        Known For:
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.primary',
                          fontSize: '0.75rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {person.known_for.map(item => item.title || item.name).join(', ')}
                      </Typography>
                    </Box>
                  )}

                  {/* Gender */}
                  {person.gender && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.75rem',
                        }}
                      >
                        {person.gender === 1 ? 'Female' : person.gender === 2 ? 'Male' : 'Other'}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              )}

              {/* View Profile CTA */}
              <Box sx={{ textAlign: 'center', pt: 1 }}>
                <Chip
                  label="View Profile"
                  size="small"
                  icon={<ArrowIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    },
                    '& .MuiChip-icon': {
                      ml: 0,
                      mr: -0.5,
                    },
                  }}
                />
              </Box>
            </Stack>
          </CardContent>

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.9)} 0%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 2,
                fontSize: '1.1rem',
              }}
            >
              {person.name}
            </Typography>

            {person.character && (
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 2,
                  fontStyle: 'italic',
                }}
              >
                as {person.character}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              {person.popularity && (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                    {person.popularity.toFixed(1)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Popularity
                  </Typography>
                </Box>
              )}

              {person.known_for_department && (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>
                    {person.known_for_department}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Department
                  </Typography>
                </Box>
              )}
            </Box>

            <Chip
              label="View Full Profile"
              sx={{
                bgcolor: 'white',
                color: theme.palette.primary.main,
                fontWeight: 600,
                px: 2,
                pointerEvents: 'auto',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            />
          </motion.div>
        </Paper>
      </Link>
    </motion.div>
  );
};

export default PersonCard;