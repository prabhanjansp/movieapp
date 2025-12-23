import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Divider,
  Grid,
  Stack,
  IconButton,
  CircularProgress,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Container,
  useTheme,
  alpha,
  useMediaQuery,
  Badge,
  Tooltip,
  Fab,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  BookmarkAddOutlined as BookmarkAddIcon,
  BookmarkAdded as BookmarkAddedIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  CalendarToday as DateIcon,
  Theaters as TrailerIcon,
  Language as LanguageIcon,
  MonetizationOn as BudgetIcon,
  TrendingUp as RevenueIcon,
  PlayCircle as PlayIcon,
  TheaterComedy as CompanyIcon,
  MovieFilter as MediaIcon,
  Groups as CastIcon,
  Info as InfoIcon,
  PhotoLibrary as GalleryIcon,
  ExpandMore as ExpandIcon,
  CheckCircle as StatusIcon,
  LocalMovies as SimilarIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

import { fetchMovieDetails, getImageUrl } from "../services/tmdb";
import { useAppContext } from "../contexts/AppContext";
import CastCarousel from "../components/CastCarousel";
import MediaCarousel from "../components/MediaCarousel";
import SectionHeader from "../components/SectionHeader";
import YouTubeEmbed from "../components/YouTubeEmbed";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const { isInWatchlist, addToWatchlist, removeFromWatchlist } =
    useAppContext();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [isScrolled, setIsScrolled] = useState(false);

  const sections = [
    { id: "overview", label: "Overview", icon: <InfoIcon /> },
    { id: "cast", label: "Cast & Crew", icon: <CastIcon /> },
    { id: "media", label: "Media", icon: <MediaIcon /> },
    { id: "trailer", label: "Trailer", icon: <TrailerIcon /> },
    { id: "similar", label: "Similar", icon: <SimilarIcon /> },
  ];

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const data = await fetchMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWatchlist = () => {
    const itemToAdd = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      media_type: "movie",
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    };

    if (isInWatchlist(movie.id, "movie")) {
      removeFromWatchlist(movie.id, "movie");
    } else {
      addToWatchlist(itemToAdd);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const trailer = movie?.videos?.results.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  mb: 2,
                }}
              >
                Synopsis
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{
                  fontSize: "1.1rem",
                  lineHeight: 1.8,
                  color: "text.primary",
                  mb: 3,
                }}
              >
                {movie.overview}
              </Typography>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Grid container spacing={4}>
              <Grid>
                <SectionHeader
                  title="Movie Details"
                  icon={<InfoIcon />}
                  sx={{ mb: 3 }}
                />
                <List disablePadding>
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemAvatar sx={{ minWidth: 48 }}>
                      <Avatar
                        sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                      >
                        <LanguageIcon color="primary" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Original Language"
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{ color: "text.primary", fontWeight: 500 }}
                        >
                          {movie.original_language.toUpperCase()}
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemAvatar sx={{ minWidth: 48 }}>
                      <Avatar
                        sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}
                      >
                        <DateIcon color="success" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Release Date"
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{ color: "text.primary", fontWeight: 500 }}
                        >
                          {new Date(movie.release_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemAvatar sx={{ minWidth: 48 }}>
                      <Avatar
                        sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1) }}
                      >
                        <StatusIcon color="warning" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Status"
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{ color: "text.primary", fontWeight: 500 }}
                        >
                          {movie.status}
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemAvatar sx={{ minWidth: 48 }}>
                      <Avatar
                        sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }}
                      >
                        <BudgetIcon color="info" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Budget"
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{ color: "text.primary", fontWeight: 500 }}
                        >
                          {formatCurrency(movie.budget)}
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemAvatar sx={{ minWidth: 48 }}>
                      <Avatar
                        sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}
                      >
                        <RevenueIcon color="success" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Revenue"
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{ color: "text.primary", fontWeight: 500 }}
                        >
                          {formatCurrency(movie.revenue)}
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid>
                <SectionHeader
                  title="Production Companies"
                  icon={<CompanyIcon />}
                  sx={{ mb: 3 }}
                />
                <Grid container spacing={2}>
                  {movie.production_companies?.map((company) => (
                    <Grid key={company.id}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          textAlign: "center",
                          bgcolor: alpha(theme.palette.background.paper, 0.5),
                          border: `1px solid ${alpha(
                            theme.palette.divider,
                            0.2
                          )}`,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: 100,
                        }}
                      >
                        {company.logo_path ? (
                          <img
                            src={getImageUrl(company.logo_path, "w200")}
                            alt={company.name}
                            style={{
                              height: 40,
                              width: "100%",
                              objectFit: "contain",
                              marginBottom: 8,
                            }}
                          />
                        ) : (
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 500,
                              color: "text.secondary",
                              textAlign: "center",
                            }}
                          >
                            {company.name}
                          </Typography>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </motion.div>
        );

      case "cast":
        return (
          <motion.div
            key="cast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  mb: 3,
                }}
              >
                Main Cast
              </Typography>
              <CastCarousel cast={movie.credits?.cast} />
            </Box>

            <Box sx={{ mt: 6 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  mb: 3,
                }}
              >
                Crew Members
              </Typography>
              <Grid container spacing={2}>
                {movie.credits?.crew
                  ?.filter((person) => person.profile_path)
                  .slice(0, isMobile ? 4 : 12)
                  .map((person) => (
                    <Grid
                      
                      key={person.credit_id}
                    >
                      <motion.div whileHover={{ y: -4 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            textAlign: "center",
                            bgcolor: alpha(theme.palette.background.paper, 0.5),
                            border: `1px solid ${alpha(
                              theme.palette.divider,
                              0.2
                            )}`,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <Avatar
                            alt={person.name}
                            src={getImageUrl(person.profile_path, "w185")}
                            sx={{
                              width: 80,
                              height: 80,
                              mx: "auto",
                              mb: 1.5,
                            }}
                          />
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              textAlign: "center",
                              mb: 0.5,
                            }}
                          >
                            {person.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "primary.main",
                              fontWeight: 500,
                              textAlign: "center",
                              display: "block",
                            }}
                          >
                            {person.job}
                          </Typography>
                        </Paper>
                      </motion.div>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </motion.div>
        );

      case "media":
        return (
          <motion.div
            key="media"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: "text.primary",
                mb: 3,
              }}
            >
              Movie Images
            </Typography>
            <Grid container spacing={2}>
              {movie.images?.backdrops
                ?.slice(0, isMobile ? 2 : 6)
                .map((image, index) => (
                  <Grid key={index}>
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          borderRadius: 2,
                          overflow: "hidden",
                          border: `1px solid ${alpha(
                            theme.palette.divider,
                            0.2
                          )}`,
                        }}
                      >
                        <img
                          src={getImageUrl(image.file_path, "w500")}
                          alt={`${movie.title} backdrop ${index + 1}`}
                          style={{
                            width: "100%",
                            height: 200,
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
            </Grid>
          </motion.div>
        );

      case "trailer":
        return trailer ? (
          <motion.div
            key="trailer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: "text.primary",
                mb: 3,
              }}
            >
              Official Trailer
            </Typography>
            <Box
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                mb: 4,
              }}
            >
              <YouTubeEmbed videoId={trailer.key} />
            </Box>

            {movie.videos?.results.length > 1 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  More Videos
                </Typography>
                <Grid container spacing={2}>
                  {movie.videos.results.slice(1, 4).map((video) => (
                    <Grid key={video.id}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.background.paper, 0.5),
                          border: `1px solid ${alpha(
                            theme.palette.divider,
                            0.2
                          )}`,
                          cursor: "pointer",
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                          },
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <PlayIcon color="primary" />
                          <Box>
                            <Typography variant="subtitle2">
                              {video.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {video.type}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </motion.div>
        ) : (
          <Paper
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              bgcolor: alpha(theme.palette.background.paper, 0.5),
              border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`,
            }}
          >
            <TrailerIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Trailer Available
            </Typography>
            <Typography color="text.secondary">
              The trailer for this movie is not available at the moment.
            </Typography>
          </Paper>
        );

      case "similar":
        return (
          <motion.div
            key="similar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: "text.primary",
                mb: 3,
              }}
            >
              Similar Movies
            </Typography>
            <MediaCarousel items={movie.similar?.results} mediaType="movie" />
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Paper
          sx={{
            p: 6,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.error.main, 0.05),
            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Error Loading Movie
          </Typography>
          <Typography color="text.secondary" paragraph>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!movie) {
    return null;
  }

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: { xs: "50vh", md: "65vh" },
          position: "relative",
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.9)), url(${getImageUrl(
            movie.backdrop_path,
            "original"
          )})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        {/* Navigation Buttons */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            right: 16,
            display: "flex",
            justifyContent: "space-between",
            zIndex: 10,
          }}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                color: "white",
                bgcolor: alpha(theme.palette.common.black, 0.6),
                backdropFilter: "blur(10px)",
                border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                "&:hover": {
                  bgcolor: alpha(theme.palette.common.black, 0.8),
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Tooltip
              title={
                isInWatchlist(movie.id, "movie")
                  ? "Remove from Watchlist"
                  : "Add to Watchlist"
              }
              arrow
            >
              <IconButton
                onClick={handleWatchlist}
                sx={{
                  color: isInWatchlist(movie.id, "movie")
                    ? theme.palette.secondary.main
                    : "white",
                  bgcolor: alpha(theme.palette.common.black, 0.6),
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.common.black, 0.8),
                  },
                }}
              >
                {isInWatchlist(movie.id, "movie") ? (
                  <BookmarkAddedIcon />
                ) : (
                  <BookmarkAddIcon />
                )}
              </IconButton>
            </Tooltip>
          </motion.div>
        </Box>

        {/* Hero Content */}
        <Container
          maxWidth="xl"
          sx={{ position: "relative", zIndex: 2, pb: 4 }}
        >
          <Grid container spacing={4} alignItems="flex-end">
            {/* Poster Column */}
            <Grid>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ width: "100%" }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    width: "100%",
                    maxWidth: { xs: 280, sm: 320, md: "100%" },
                    margin: "0 auto",
                    aspectRatio: "2/3",
                    border: `4px solid ${alpha(
                      theme.palette.common.white,
                      0.1
                    )}`,
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <img
                    src={
                      movie.poster_path
                        ? getImageUrl(movie.poster_path, "w500")
                        : "/no-image.jpg"
                    }
                    alt={movie.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Paper>
              </motion.div>
            </Grid>

            {/* Info Column */}
            <Grid>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Typography
                  variant={isMobile ? "h4" : "h2"}
                  component="h1"
                  color="white"
                  sx={{
                    fontWeight: 700,
                    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                    mb: 1,
                    lineHeight: 1.2,
                  }}
                >
                  {movie.title}
                </Typography>

                {movie.tagline && (
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    color="rgba(255, 255, 255, 0.9)"
                    gutterBottom
                    sx={{
                      fontStyle: "italic",
                      fontWeight: 300,
                      mb: 3,
                    }}
                  >
                    "{movie.tagline}"
                  </Typography>
                )}

                {/* Genres */}
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ my: 2, flexWrap: "wrap", gap: 1 }}
                >
                  {movie.genres?.map((genre) => (
                    <Chip
                      key={genre.id}
                      label={genre.name}
                      size="medium"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.9),
                        color: "white",
                        fontWeight: 600,
                        backdropFilter: "blur(10px)",
                      }}
                    />
                  ))}
                </Stack>

                {/* Stats */}
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <StarIcon
                        sx={{ fontSize: 32, color: "warning.main", mr: 1 }}
                      />

                      <Box>
                        <Typography
                          variant="body1"
                          color="white"
                          sx={{ fontWeight: 500 }}
                        >
                          {movie.vote_average.toFixed(1)} / 10
                        </Typography>
                        <Typography
                          variant="caption"
                          color="rgba(255,255,255,0.7)"
                        >
                          {movie.vote_count.toLocaleString()} votes
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <TimeIcon sx={{ fontSize: 32, color: "white", mr: 2 }} />
                      <Box>
                        <Typography
                          variant="body1"
                          color="white"
                          sx={{ fontWeight: 500 }}
                        >
                          {formatRuntime(movie.runtime)}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="rgba(255,255,255,0.7)"
                        >
                          Runtime
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <DateIcon sx={{ fontSize: 32, color: "white", mr: 2 }} />
                      <Box>
                        <Typography
                          variant="body1"
                          color="white"
                          sx={{ fontWeight: 500 }}
                        >
                          {new Date(movie.release_date).getFullYear()}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="rgba(255,255,255,0.7)"
                        >
                          Release Year
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Content Area - Now with proper spacing */}
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Paper
          elevation={isScrolled ? 4 : 0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            transition: "all 0.3s ease",
          }}
        >
          {/* Section Navigation */}
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1000,
              bgcolor: theme.palette.background.paper,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backdropFilter: "blur(10px)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                overflowX: "auto",
                px: { xs: 2, md: 3 },
                py: 2,
                gap: 1,
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                const disabled = section.id === "trailer" && !trailer;

                if (disabled) return null;

                return (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    disabled={disabled}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                        : theme.palette.mode === "dark"
                        ? alpha(theme.palette.background.paper, 0.5)
                        : alpha(theme.palette.grey[100], 0.8),
                      border: "none",
                      borderRadius: 12,
                      padding: "12px 20px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      minWidth: "fit-content",
                      whiteSpace: "nowrap",
                      transition: "all 0.3s ease",
                      opacity: disabled ? 0.5 : 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: isActive ? "white" : theme.palette.text.primary,
                      }}
                    >
                      {section.icon}
                      <Typography
                        variant="button"
                        sx={{
                          fontWeight: isActive ? 700 : 600,
                          fontSize: "0.875rem",
                          color: isActive ? "white" : "inherit",
                        }}
                      >
                        {section.label}
                      </Typography>
                    </Box>
                  </motion.button>
                );
              })}
            </Box>
          </Box>

          {/* Content Section with proper padding */}
          <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }} id="content-section">
            <AnimatePresence mode="wait">{renderSection()}</AnimatePresence>
          </Box>
        </Paper>
      </Container>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
          onClick={() => {
            const element = document.getElementById("content-section");
            element?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <ExpandIcon />
        </Fab>
      )}
    </Box>
  );
};

export default MovieDetails;
