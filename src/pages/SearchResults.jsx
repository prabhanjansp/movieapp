import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  CircularProgress, 
  Pagination,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Container,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
  alpha,
  Fade
} from '@mui/material';
import { 
  Search as SearchIcon,
  Clear as ClearIcon,
  Movie as MovieIcon,
  Tv as TvIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import useDebounce from '../hooks/useDebounce';
import { searchMulti } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import PersonCard from '../components/PersonCard';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const query = searchParams.get('query') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const tabs = [
    { id: 'all', label: 'All', icon: <TrendingUpIcon /> },
    { id: 'movie', label: 'Movies', icon: <MovieIcon /> },
    { id: 'tv', label: 'TV Shows', icon: <TvIcon /> },
    { id: 'person', label: 'People', icon: <PersonIcon /> },
  ];

  const debouncedSearchTerm = useDebounce(searchInput, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, page]);

  useEffect(() => {
    if (query) {
      setSearchInput(query);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const data = await searchMulti(searchQuery, page);
      setResults(data.results);
      setTotalResults(data.total_results);
      setTotalPages(Math.min(data.total_pages, 500));
    } catch (err) {
      setError('Failed to fetch results. Please try again.');
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchInput.trim())}`);
      setPage(1);
    }
  };

  const handleClear = () => {
    setSearchInput('');
    if (query) {
      navigate('/search');
    }
  };

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const filteredResults = results.filter((item) => {
    if (activeTab === 0) return true;
    const tab = tabs[activeTab];
    return item.media_type === tab.id;
  });

  const getTabCount = (tabId) => {
    if (tabId === 'all') return results.length;
    return results.filter(item => item.media_type === tabId).length;
  };

  const LoadingSkeleton = () => (
    <Grid container spacing={isMobile ? 2 : 3}>
      {[...Array(12)].map((_, index) => (
        <Grid key={index}>
          <Box
            sx={{
              height: 280,
              borderRadius: 2,
              bgcolor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.03)',
              position: 'relative',
              overflow: 'hidden',
            }}
          />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
      {/* Search Bar Section */}
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 3,
            textAlign: 'center',
            color: 'text.primary',
            fontSize: { xs: '1.75rem', md: '2.125rem' },
          }}
        >
          Search Entertainment
        </Typography>

        {/* Enhanced Search Bar */}
        <Box sx={{ maxWidth: 800, mx: 'auto', px: { xs: 0, sm: 2 } }}>
          <Paper
            component="form"
            onSubmit={handleSubmit}
            elevation={0}
            sx={{
              p: { xs: 1.5, sm: 2 },
              borderRadius: 3,
              bgcolor: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.background.paper, 0.9)
                : 'white',
              border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 6px 25px rgba(0, 0, 0, 0.12)',
                borderColor: alpha(theme.palette.primary.main, 0.3),
              },
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: { xs: 1, sm: 2 }
            }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="Search movies, TV shows, actors..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon 
                          sx={{ 
                            color: theme.palette.text.secondary,
                            fontSize: 24,
                          }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: searchInput && (
                      <InputAdornment position="end">
                        <IconButton 
                          onClick={handleClear}
                          size="small"
                          sx={{ 
                            color: 'text.secondary',
                            '&:hover': {
                              color: 'text.primary',
                            }
                          }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      fontSize: { xs: '1rem', sm: '1.125rem' },
                      fontWeight: 400,
                      pl: 1,
                    }
                  }}
                />
              </Box>
              
              <Button
                type="submit"
                variant="contained"
                disabled={!searchInput.trim()}
                sx={{
                  px: { xs: 2.5, sm: 3.5 },
                  py: { xs: 1, sm: 1.25 },
                  borderRadius: 2,
                  minWidth: 100,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  whiteSpace: 'nowrap',
                  bgcolor: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                    transform: 'translateY(-1px)',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Search
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Results Section */}
      <AnimatePresence>
        {query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Results Header */}
            <Box sx={{ mb: 5 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2,
                mb: 4,
              }}>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      color: 'text.primary',
                    }}
                  >
                    Results for "{query}"
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.9375rem',
                    }}
                  >
                    {totalResults.toLocaleString()} results found
                  </Typography>
                </Box>
              </Box>

              {/* Professional Tabs */}
              <Box sx={{ 
                position: 'relative',
                mb: 4,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              }}>
                <Box sx={{ 
                  display: 'flex',
                  gap: 1,
                  position: 'relative',
                  overflowX: 'auto',
                  pb: 1,
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': { display: 'none' },
                }}>
                  {tabs.map((tab, index) => {
                    const count = getTabCount(tab.id);
                    const isActive = activeTab === index;
                    
                    return (
                      <Button
                        key={tab.id}
                        onClick={() => handleTabChange(index)}
                        startIcon={tab.icon}
                        sx={{
                          px: 3,
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: isActive ? 600 : 500,
                          fontSize: '0.875rem',
                          color: isActive ? 'primary.main' : 'text.secondary',
                          bgcolor: isActive 
                            ? alpha(theme.palette.primary.main, 0.1)
                            : 'transparent',
                          border: 'none',
                          minWidth: 'auto',
                          whiteSpace: 'nowrap',
                          position: 'relative',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            color: 'text.primary',
                          },
                          '&:after': isActive ? {
                            content: '""',
                            position: 'absolute',
                            bottom: -1,
                            left: 0,
                            right: 0,
                            height: 2,
                            bgcolor: 'primary.main',
                            borderRadius: '2px 2px 0 0',
                          } : {},
                        }}
                      >
                        {tab.label}
                        {count > 0 && (
                          <Chip
                            label={count}
                            size="small"
                            sx={{
                              ml: 1,
                              height: 20,
                              fontSize: '0.6875rem',
                              fontWeight: 600,
                              bgcolor: isActive 
                                ? alpha(theme.palette.primary.main, 0.2)
                                : alpha(theme.palette.text.secondary, 0.1),
                              color: isActive 
                                ? 'primary.main' 
                                : 'text.secondary',
                            }}
                          />
                        )}
                      </Button>
                    );
                  })}
                </Box>
              </Box>

              {/* Loading State */}
              {loading && <LoadingSkeleton />}

              {/* Error State */}
              {error && !loading && (
                <Paper
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 2,
                    bgcolor: theme.palette.mode === 'dark' 
                      ? alpha(theme.palette.error.dark, 0.1)
                      : alpha(theme.palette.error.light, 0.05),
                    border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                    maxWidth: 600,
                    mx: 'auto',
                  }}
                >
                  <Typography color="error" gutterBottom>
                    {error}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="error"
                    onClick={() => performSearch(query)}
                    sx={{ mt: 1 }}
                  >
                    Try Again
                  </Button>
                </Paper>
              )}

              {/* Results Grid */}
              {!loading && !error && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {filteredResults.length === 0 ? (
                      <Paper
                        sx={{
                          p: 6,
                          textAlign: 'center',
                          borderRadius: 2,
                          bgcolor: theme.palette.mode === 'dark' 
                            ? 'grey.900' 
                            : 'grey.50',
                          border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                        }}
                      >
                        <SearchIcon 
                          sx={{ 
                            fontSize: 48, 
                            color: 'text.disabled', 
                            mb: 2 
                          }} 
                        />
                        <Typography variant="h6" gutterBottom>
                          No results found
                        </Typography>
                        <Typography color="text.secondary">
                          Try adjusting your search or filter
                        </Typography>
                      </Paper>
                    ) : (
                      <>
                        <Grid container spacing={isMobile ? 2 : 3}>
                          {filteredResults.map((item, index) => (
                            <Grid 
                            
                              key={`${item.id}-${index}`}
                            >
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ 
                                  duration: 0.3, 
                                  delay: index * 0.03 
                                }}
                              >
                                {item.media_type === 'person' ? (
                                  <PersonCard person={item} />
                                ) : (
                                  <MovieCard 
                                    item={item} 
                                    mediaType={item.media_type}
                                  />
                                )}
                              </motion.div>
                            </Grid>
                          ))}
                        </Grid>

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            mt: 6,
                            pt: 4,
                            borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                          }}>
                            <Pagination
                              count={totalPages}
                              page={page}
                              onChange={(e, value) => setPage(value)}
                              color="primary"
                              size={isMobile ? "small" : "medium"}
                              showFirstButton
                              showLastButton
                              siblingCount={isMobile ? 0 : 1}
                              boundaryCount={isMobile ? 1 : 2}
                              sx={{
                                '& .MuiPaginationItem-root': {
                                  borderRadius: 1.5,
                                  '&.Mui-selected': {
                                    fontWeight: 600,
                                  }
                                },
                              }}
                            />
                          </Box>
                        )}
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty Search State */}
      {!query && !loading && (
        <Fade in timeout={500}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <SearchIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
            <Typography variant="h5" gutterBottom>
              What are you looking for?
            </Typography>
            <Typography 
              color="text.secondary" 
              paragraph 
              sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}
            >
              Search for movies, TV shows, actors, or directors to get started
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              justifyContent: 'center', 
              flexWrap: 'wrap' 
            }}>
              {['Avengers', 'Stranger Things', 'Leonardo DiCaprio', 'The Office'].map((term) => (
                <Chip
                  key={term}
                  label={term}
                  onClick={() => {
                    setSearchInput(term);
                    navigate(`/search?query=${encodeURIComponent(term)}`);
                  }}
                  clickable
                  sx={{
                    borderRadius: 1.5,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        </Fade>
      )}
    </Container>
  );
};

export default SearchResults;