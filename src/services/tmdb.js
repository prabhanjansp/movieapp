import axios from 'axios';

const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const tmdb = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const fetchTrending = async (mediaType = 'all', timeWindow = 'week') => {
  const { data } = await tmdb.get(`/trending/${mediaType}/${timeWindow}`);
  return data.results;
};

export const fetchPopular = async (mediaType = 'movie') => {
  const { data } = await tmdb.get(`/${mediaType}/popular`);
  return data.results;
};

export const fetchUpcomingMovies = async () => {
  const { data } = await tmdb.get('/movie/upcoming');
  return data.results;
};

export const fetchNowPlayingMovies = async () => {
  const { data } = await tmdb.get('/movie/now_playing');
  return data.results;
};

export const fetchMovieDetails = async (id) => {
  const { data } = await tmdb.get(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos,similar' },
  });
  return data;
};

export const fetchTVDetails = async (id) => {
  const { data } = await tmdb.get(`/tv/${id}`, {
    params: { append_to_response: 'credits,videos,similar' },
  });
  return data;
};

export const fetchPersonDetails = async (id) => {
  const { data } = await tmdb.get(`/person/${id}`, {
    params: { append_to_response: 'combined_credits,images' },
  });
  return data;
};

export const searchMulti = async (query, page = 1) => {
  const { data } = await tmdb.get('/search/multi', {
    params: { query, page },
  });
  return data;
};

export const getImageUrl = (path, size = 'w500') => {
  return `${import.meta.env.VITE_TMDB_IMAGE_BASE_URL}/${size}${path}`;
};