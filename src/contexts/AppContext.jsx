// src/contexts/AppContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [watchlist, setWatchlist] = useState([]);

  // Load theme and watchlist from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('movieExplorerTheme');
    const savedWatchlist = localStorage.getItem('movieExplorerWatchlist');
    
    if (savedTheme) setTheme(savedTheme);
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
  }, []);

  // Save theme and watchlist to localStorage when they change
  useEffect(() => {
    localStorage.setItem('movieExplorerTheme', theme);
    localStorage.setItem('movieExplorerWatchlist', JSON.stringify(watchlist));
  }, [theme, watchlist]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addToWatchlist = (item) => {
    setWatchlist(prev => {
      const exists = prev.some(i => i.id === item.id && i.media_type === item.media_type);
      return exists ? prev : [...prev, item];
    });
  };

  const removeFromWatchlist = (id, mediaType) => {
    setWatchlist(prev => prev.filter(item => !(item.id === id && item.media_type === mediaType)));
  };

  const isInWatchlist = (id, mediaType) => {
    return watchlist.some(item => item.id === id && item.media_type === mediaType);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};