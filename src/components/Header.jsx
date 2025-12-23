import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Button,
  alpha,
  Container
} from '@mui/material';
import {
  Search as SearchIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Bookmark as WatchlistIcon,
  Movie as MovieIcon,
  Tv as TvIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAppContext } from '../contexts/AppContext';
import GroupWorkIcon from '@mui/icons-material/GroupWork';

const Header = () => {
  const { theme, toggleTheme, watchlist } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useTheme();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up('md'));

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      if (isMobile) setDrawerOpen(false);
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // Check if a path is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' && !location.search.includes('type=tv');
    }
    if (path === '/?type=tv') {
      return location.search.includes('type=tv');
    }
    return location.pathname === path;
  };

  const navItems = [
    
    { 
      icon: <MovieIcon />, 
      text: 'Movies', 
      path: '/?type=movie' 
    },
    { 
      icon: <TvIcon />, 
      text: 'TV Shows', 
      path: '/?type=tv'
    },
    {
      icon: <WatchlistIcon />,
      text: 'Watchlist',
      path: '/watchlist',
      badge: watchlist.length
    },
  ];

  return (
    <>
      <AppBar 
        position="fixed"
        elevation={scrolled ? 4 : 0}
        sx={{
          background: scrolled 
            ? alpha(muiTheme.palette.background.default, 0.95)
            : muiTheme.palette.background.default,
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          transition: 'all 0.3s ease',
          borderBottom: `1px solid ${alpha(muiTheme.palette.divider, 0.1)}`,
        }}
      >
        <Container maxWidth="xl" disableGutters>
          <Toolbar sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            px: { xs: 2, sm: 3 },
            minHeight: 64
          }}>
            {/* Left Section: Logo and Mobile Menu */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              flexShrink: 0
            }}>
              {isMobile && (
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={toggleDrawer(true)}
                  sx={{ 
                    mr: 1,
                    color: muiTheme.palette.text.primary
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}

              <Box
                component={Link}
                to="/"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                  mr: { xs: 1, md: 3 },
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              >
                <GroupWorkIcon sx={{ 
                  mr: 1, 
                  fontSize: { xs: 28, md: 32 },
                  color: muiTheme.palette.primary.main 
                }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: muiTheme.palette.text.primary,
                    display: { xs: 'none', sm: 'block' },
                    fontSize: { sm: '1.2rem', md: '1.3rem' }
                  }}
                >
                  CineVerse
                </Typography>
              </Box>
            </Box>

            {/* Center Section: Navigation (Desktop) */}
            {isDesktop && (
              <Box sx={{ 
                display: 'flex', 
                gap: 1,
                flex: 1,
                justifyContent: 'center',
                mx: 2
              }}>
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Button
                      key={item.text}
                      component={Link}
                      to={item.path}
                      startIcon={
                        <Box sx={{ 
                          color: active ? muiTheme.palette.primary.main : muiTheme.palette.text.primary,
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          {item.icon}
                        </Box>
                      }
                      sx={{
                        color: active ? muiTheme.palette.primary.main : muiTheme.palette.text.primary,
                        textTransform: 'none',
                        px: 2,
                        borderRadius: 1,
                        fontSize: '0.95rem',
                        fontWeight: active ? 600 : 500,
                        backgroundColor: active ? alpha(muiTheme.palette.primary.main, 0.1) : 'transparent',
                        position: 'relative',
                        '&:hover': {
                          backgroundColor: active 
                            ? alpha(muiTheme.palette.primary.main, 0.15)
                            : alpha(muiTheme.palette.primary.main, 0.05),
                        },
                        '&::after': active ? {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '80%',
                          height: 2,
                          backgroundColor: muiTheme.palette.primary.main,
                          borderRadius: '1px 1px 0 0',
                        } : {}
                      }}
                    >
                      {item.text}
                      {item.badge > 0 && (
                        <Badge
                          badgeContent={item.badge}
                          color="secondary"
                          sx={{
                            ml: 1,
                            '& .MuiBadge-badge': {
                              fontSize: '0.6rem',
                              height: 18,
                              minWidth: 18,
                            }
                          }}
                        />
                      )}
                    </Button>
                  );
                })}
              </Box>
            )}

            {/* Right Section: Search and Theme Toggle */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1,
              flexShrink: 0
            }}>
              {/* Search Bar */}
              <Box
                component="form"
                onSubmit={handleSearch}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: muiTheme.palette.mode === 'dark' 
                    ? alpha(muiTheme.palette.common.white, 0.1)
                    : alpha(muiTheme.palette.common.black, 0.05),
                  borderRadius: 2,
                  p: 0.5,
                  transition: 'all 0.2s ease',
                  width: isMobile ? 180 : 300,
                  '&:hover': {
                    backgroundColor: muiTheme.palette.mode === 'dark' 
                      ? alpha(muiTheme.palette.common.white, 0.15)
                      : alpha(muiTheme.palette.common.black, 0.08),
                  },
                  '&:focus-within': {
                    backgroundColor: muiTheme.palette.mode === 'dark' 
                      ? alpha(muiTheme.palette.common.white, 0.15)
                      : alpha(muiTheme.palette.common.black, 0.08),
                    boxShadow: `0 0 0 2px ${alpha(muiTheme.palette.primary.main, 0.2)}`,
                  }
                }}
              >
                <IconButton 
                  type="submit" 
                  sx={{ 
                    p: 0.75,
                    mr: 0.5,
                    color: muiTheme.palette.text.secondary
                  }}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
                <InputBase
                  placeholder={isMobile ? "Search..." : "Search movies & shows..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ 
                    flex: 1, 
                    color: muiTheme.palette.text.primary,
                    '& input': {
                      padding: '4px 0',
                      fontSize: '0.9rem',
                    },
                    '& input::placeholder': {
                      color: muiTheme.palette.text.secondary,
                      opacity: 0.7
                    }
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Box>

              {/* Theme Toggle */}
              <IconButton 
                onClick={toggleTheme}
                sx={{
                  color: muiTheme.palette.text.primary,
                  '&:hover': {
                    backgroundColor: alpha(muiTheme.palette.primary.main, 0.1),
                  }
                }}
              >
                {theme === 'dark' ? <LightIcon /> : <DarkIcon />}
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Spacer for fixed header */}
      <Toolbar sx={{ minHeight: '64px !important' }} />

      {/* Mobile Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            backgroundColor: muiTheme.palette.background.default,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: `1px solid ${alpha(muiTheme.palette.divider, 0.1)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <GroupWorkIcon sx={{ 
              mr: 1.5, 
              fontSize: 28,
              color: muiTheme.palette.primary.main 
            }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: muiTheme.palette.text.primary,
              }}
            >
              CineVerse
            </Typography>
          </Box>
          <IconButton 
            onClick={toggleDrawer(false)}
            sx={{
              color: muiTheme.palette.text.primary,
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        <List sx={{ p: 1 }}>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem
                key={item.text}
                component={Link}
                to={item.path}
                onClick={toggleDrawer(false)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  textDecoration: 'none',
                  color: active ? muiTheme.palette.primary.main : muiTheme.palette.text.primary,
                  backgroundColor: active ? alpha(muiTheme.palette.primary.main, 0.1) : 'transparent',
                  borderLeft: active ? `3px solid ${muiTheme.palette.primary.main}` : '3px solid transparent',
                  '&:hover': {
                    backgroundColor: active 
                      ? alpha(muiTheme.palette.primary.main, 0.15)
                      : alpha(muiTheme.palette.primary.main, 0.05),
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 40,
                  color: active ? muiTheme.palette.primary.main : muiTheme.palette.text.secondary
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: active ? 600 : 500,
                    fontSize: '1rem'
                  }}
                />
                {item.badge > 0 && (
                  <Badge
                    badgeContent={item.badge}
                    color="secondary"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '0.7rem',
                        height: 20,
                        minWidth: 20,
                      }
                    }}
                  />
                )}
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </>
  );
};

export default Header;