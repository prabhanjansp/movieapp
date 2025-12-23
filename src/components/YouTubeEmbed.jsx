import { useState, useRef } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  Tooltip, 
  LinearProgress,
  useTheme,
  alpha,
  Chip,
  Stack,
  CircularProgress
} from '@mui/material';
import { 
  PlayCircle as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeIcon,
  VolumeOff as MuteIcon,
  Fullscreen as FullscreenIcon,
  OpenInNew as OpenIcon,
  Settings as SettingsIcon,
  YouTube as YouTubeIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const YouTubeEmbed = ({ videoId, title = "YouTube Video", showControls = true, autoplay = false }) => {
  const theme = useTheme();
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const [videoTitle, setVideoTitle] = useState(title);

  const handleLoad = () => {
    setIsLoading(false);
    setShowOverlay(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, you would communicate with YouTube API
    // This is just UI state for demonstration
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.mozRequestFullScreen) {
        iframe.mozRequestFullScreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      }
    }
  };

  const handleOpenYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ 
      position: 'relative',
      borderRadius: 3,
      overflow: 'hidden',
      bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
      boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.15)}`,
      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    }}>
      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: theme.palette.mode === 'dark' 
                ? 'rgba(0, 0, 0, 0.8)' 
                : 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress 
                size={60} 
                thickness={4}
                sx={{ 
                  color: theme.palette.primary.main,
                  mb: 2 
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Loading video...
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Container */}
      <Box
        sx={{
          position: 'relative',
          paddingBottom: '56.25%', // 16:9 aspect ratio
          height: 0,
          overflow: 'hidden',
          background: theme.palette.mode === 'dark' ? '#000' : '#111',
        }}
        onMouseEnter={() => showControls && setShowOverlay(true)}
        onMouseLeave={() => showControls && setShowOverlay(false)}
      >
        {/* YouTube Embed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        >
          <iframe
            ref={iframeRef}
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
            src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&modestbranding=1&rel=0&showinfo=0&controls=${showControls ? 1 : 0}`}
            title={videoTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={handleLoad}
          />
        </motion.div>

        {/* Custom Controls Overlay */}
        <AnimatePresence>
          {showControls && showOverlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.3) 100%)',
                pointerEvents: 'none',
              }}
            >
              {/* Top Bar */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pointerEvents: 'auto',
                }}
              >
                <Chip
                  icon={<YouTubeIcon />}
                  label="YouTube"
                  size="small"
                  sx={{
                    bgcolor: alpha('#FF0000', 0.9),
                    color: 'white',
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)',
                    '& .MuiChip-icon': {
                      color: 'white',
                    }
                  }}
                />
                
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Open in YouTube" arrow>
                    <IconButton
                      onClick={handleOpenYouTube}
                      sx={{
                        bgcolor: alpha(theme.palette.common.black, 0.6),
                        color: 'white',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.common.black, 0.8),
                        }
                      }}
                      size="small"
                    >
                      <OpenIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Settings" arrow>
                    <IconButton
                      sx={{
                        bgcolor: alpha(theme.palette.common.black, 0.6),
                        color: 'white',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.common.black, 0.8),
                        }
                      }}
                      size="small"
                    >
                      <SettingsIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>

              {/* Center Play Button */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'auto',
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconButton
                    onClick={handlePlayPause}
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: alpha(theme.palette.common.black, 0.7),
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.common.black, 0.9),
                      }
                    }}
                  >
                    {isPlaying ? (
                      <PauseIcon sx={{ fontSize: 40 }} />
                    ) : (
                      <PlayIcon sx={{ fontSize: 40 }} />
                    )}
                  </IconButton>
                </motion.div>
              </Box>

              {/* Bottom Controls */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 2,
                  pointerEvents: 'auto',
                }}
              >
                {/* Progress Bar */}
                <Box sx={{ mb: 1.5 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.common.white, 0.3),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#FF0000',
                        borderRadius: 2,
                      }
                    }}
                  />
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mt: 0.5 
                  }}>
                    <Typography variant="caption" sx={{ color: 'white' }}>
                      {formatTime(progress * 100)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'white' }}>
                      {formatTime(300)} {/* Example duration */}
                    </Typography>
                  </Box>
                </Box>

                {/* Control Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center' 
                }}>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title={isPlaying ? "Pause" : "Play"} arrow>
                      <IconButton
                        onClick={handlePlayPause}
                        sx={{ color: 'white' }}
                        size="small"
                      >
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title={isMuted ? "Unmute" : "Mute"} arrow>
                      <IconButton
                        onClick={handleMuteToggle}
                        sx={{ color: 'white' }}
                        size="small"
                      >
                        {isMuted ? <MuteIcon /> : <VolumeIcon />}
                      </IconButton>
                    </Tooltip>
                    
                    <Typography variant="body2" sx={{ color: 'white', alignSelf: 'center' }}>
                      {videoTitle}
                    </Typography>
                  </Stack>

                  <Tooltip title="Fullscreen" arrow>
                    <IconButton
                      onClick={handleFullscreen}
                      sx={{ color: 'white' }}
                      size="small"
                    >
                      <FullscreenIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Footer Info */}
      <Box
        sx={{
          p: 2,
          bgcolor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.8)
            : 'white',
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Embedded YouTube content
          </Typography>
          <Chip
            label="Powered by YouTube"
            size="small"
            icon={<YouTubeIcon />}
            sx={{
              bgcolor: alpha('#FF0000', 0.1),
              color: '#FF0000',
              fontWeight: 500,
            }}
          />
        </Stack>
      </Box>

      {/* Quality Indicator (Mock) */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 20,
        }}
      >
        <Chip
          label="HD"
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.success.main, 0.9),
            color: 'white',
            fontWeight: 600,
            fontSize: '0.625rem',
            height: 20,
          }}
        />
      </Box>
    </Box>
  );
};

export default YouTubeEmbed;