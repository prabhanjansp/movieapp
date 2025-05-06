import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, type, url, image }) => {
  const defaultTitle = 'Movie Explorer - Discover Movies & TV Shows';
  const defaultDescription = 'Explore movies, TV shows, and actors using the TMDB API. Find trending content, search, and save to your watchlist.';
  const defaultKeywords = 'movies, TV shows, actors, TMDB, watchlist, trending';
  const defaultImage = '/logo.png';
  const siteUrl = window.location.origin;

  return (
    <Helmet>
      <title>{title ? `${title} | Movie Explorer` : defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content={type || 'website'} />
      <meta property="og:url" content={url || siteUrl} />
      <meta property="og:image" content={image || defaultImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
};

export default SEO;