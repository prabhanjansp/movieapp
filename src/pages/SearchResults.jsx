import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  CircularProgress, 
  Tabs, 
  Tab, 
  Pagination,
  TextField,
  Button,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  Search as SearchIcon,
  Clear as ClearIcon,
  Movie as MovieIcon,
  Tv as TvIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import useDebounce from '../hooks/useDebounce';
import { searchMulti } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import PersonCard from '../components/PersonCard';
import SectionHeader from '../components/SectionHeader';






const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('query') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, [query, page]);
  const debouncedSearchTerm = useDebounce(searchInput, 500);

useEffect(() => {
  if (debouncedSearchTerm) {
    handleSearch(debouncedSearchTerm);
  }
}, [debouncedSearchTerm, page]);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const data = await searchMulti(searchQuery, page);
      setResults(data.results);
      setTotalPages(data.total_pages > 500 ? 500 : data.total_pages); // TMDB API limits pages to 500
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchInput)}`);
      setPage(1);
    }
  };
  const handleClear = () => {
    setSearchInput('');
  };

  const filteredResults = results.filter((result) => {
    if (tabValue === 0) return true;
    if (tabValue === 1) return result.media_type === 'movie';
    if (tabValue === 2) return result.media_type === 'tv';
    if (tabValue === 3) return result.media_type === 'person';
    return true;
  });

  return (
    <Box sx={{ p: 2 }}>
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search movies, TV shows, people..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchInput && (
              <InputAdornment position="end">
                <IconButton onClick={handleClear}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          size="large"
          disabled={!searchInput.trim()}
        >
          Search
        </Button>
      </Box>

      {query && (
        <>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 3 }}
          >
            <Tab label="All" />
            <Tab label="Movies" icon={<MovieIcon />} iconPosition="start" />
            <Tab label="TV Shows" icon={<TvIcon />} iconPosition="start" />
            <Tab label="People" icon={<PersonIcon />} iconPosition="start" />
          </Tabs>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>
              {error}
            </Typography>
          ) : filteredResults.length === 0 ? (
            <Typography sx={{ textAlign: 'center', mt: 4 }}>
              No results found for "{query}"
            </Typography>
          ) : (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Search Results for "{query}"
              </Typography>

              <Grid container spacing={2}>
                {filteredResults.map((item) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={item.id}>
                    {item.media_type === 'person' ? (
                      <PersonCard person={item} />
                    ) : (
                      <MovieCard 
                        item={item} 
                        mediaType={item.media_type} 
                      />
                    )}
                  </Grid>
                ))}
              </Grid>

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default SearchResults;