// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// // import { useAppContext } from '../../contexts/AppContext';

// import { 
//   AppBar, 
//   Toolbar, 
//   Typography, 
//   IconButton, 
//   InputBase, 
//   Box, 
//   useTheme,
//   useMediaQuery
// } from '@mui/material';
// import {
//   Search as SearchIcon,
//   Brightness4 as DarkIcon,
//   Brightness7 as LightIcon,
//   Bookmark as WatchlistIcon,
//   Movie as MovieIcon,
//   Tv as TvIcon,
//   People as PeopleIcon,
// } from '@mui/icons-material';
// import { motion } from 'framer-motion';
// import { useAppContext } from '../contexts/AppContext';

// const Header = () => {
//   const { theme, toggleTheme, watchlist } = useAppContext();
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigate = useNavigate();
//   const muiTheme = useTheme();
//   const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?query=${searchQuery}`);
//       setSearchQuery('');
//     }
//   };

//   return (
//     <AppBar position="sticky">
//       <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <Typography
//             variant="h6"
//             component={Link}
//             to="/"
//             sx={{ 
//               textDecoration: 'none', 
//               color: 'inherit',
//               mr: 2,
//               display: 'flex',
//               alignItems: 'center'
//             }}
//           >
//             <MovieIcon sx={{ mr: 1 }} />
//             {!isMobile && 'Movie Explorer'}
//           </Typography>
          
//           {!isMobile && (
//             <Box sx={{ display: 'flex', gap: 1 }}>
//               <IconButton component={Link} to="/" color="inherit">
//                 <MovieIcon />
//               </IconButton>
//               <IconButton component={Link} to="/?type=tv" color="inherit">
//                 <TvIcon />
//               </IconButton>
//               <IconButton component={Link} to="/watchlist" color="inherit">
//                 <Box sx={{ position: 'relative' }}>
//                   <WatchlistIcon />
//                   {watchlist.length > 0 && (
//                     <motion.span
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       style={{
//                         position: 'absolute',
//                         top: -8,
//                         right: -8,
//                         backgroundColor: muiTheme.palette.secondary.main,
//                         color: 'white',
//                         borderRadius: '50%',
//                         width: 20,
//                         height: 20,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         fontSize: 12,
//                       }}
//                     >
//                       {watchlist.length}
//                     </motion.span>
//                   )}
//                 </Box>
//               </IconButton>
//             </Box>
//           )}
//         </Box>

//         <Box 
//           component="form" 
//           onSubmit={handleSearch}
//           sx={{ 
//             display: 'flex', 
//             alignItems: 'center',
//             backgroundColor: muiTheme.palette.mode === 'dark' 
//               ? 'rgba(255, 255, 255, 0.1)' 
//               : 'rgba(0, 0, 0, 0.1)',
//             borderRadius: muiTheme.shape.borderRadius,
//             p: 0.5,
//             flexGrow: isMobile ? 1 : 0.5,
//             mx: 2
//           }}
//         >
//           <InputBase
//             placeholder="Search movies, TV shows, people..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             sx={{ ml: 1, flex: 1, color: 'inherit' }}
//           />
//           <IconButton type="submit" color="inherit">
//             <SearchIcon />
//           </IconButton>
//         </Box>

//         <IconButton onClick={toggleTheme} color="inherit">
//           {theme === 'dark' ? <LightIcon /> : <DarkIcon />}
//         </IconButton>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Divider
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
import { motion } from 'framer-motion';
import { useAppContext } from '../contexts/AppContext';

const Header = () => {
  const { theme, toggleTheme, watchlist } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const navItems = [
    { icon: <MovieIcon />, text: 'Movies', path: '/' },
    { icon: <TvIcon />, text: 'TV Shows', path: '/?type=tv' },
    { 
      icon: <WatchlistIcon />, 
      text: 'Watchlist', 
      path: '/watchlist',
      badge: watchlist.length > 0 ? watchlist.length : null
    },
  ];

  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={toggleDrawer(true)}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{ 
                textDecoration: 'none', 
                color: 'inherit',
                mr: 2,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <MovieIcon sx={{ mr: 1 }} />
              {!isMobile && 'Movie Explorer'}
            </Typography>
            
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {navItems.map((item) => (
                  <Box 
                    key={item.text}
                    component={Link}
                    to={item.path}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      textDecoration: 'none',
                      color: 'inherit',
                      p: 1,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    <IconButton color="inherit" sx={{ p: 0, mr: 1 }}>
                      {item.icon}
                    </IconButton>
                    <Typography variant="body1">
                      {item.text}
                      {item.badge && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{
                            display: 'inline-block',
                            backgroundColor: muiTheme.palette.secondary.main,
                            color: 'white',
                            borderRadius: '50%',
                            width: 20,
                            height: 20,
                            marginLeft: 8,
                            textAlign: 'center',
                            fontSize: 12,
                            lineHeight: '20px'
                          }}
                        >
                          {item.badge}
                        </motion.span>
                      )}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Box 
            component="form" 
            onSubmit={handleSearch}
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              backgroundColor: muiTheme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.1)',
              borderRadius: muiTheme.shape.borderRadius,
              p: 0.5,
              flexGrow: isMobile ? 1 : 0.5,
              mx: 2
            }}
          >
            <InputBase
              placeholder="Search movies, TV shows, people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ ml: 1, flex: 1, color: 'inherit' }}
            />
            <IconButton type="submit" color="inherit">
              <SearchIcon />
            </IconButton>
          </Box>

          <IconButton onClick={toggleTheme} color="inherit">
            {theme === 'dark' ? <LightIcon /> : <DarkIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
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
          }}
        >
          <Typography variant="h6">Movie Explorer</Typography>
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItem 
              button 
              key={item.text}
              component={Link}
              to={item.path}
              onClick={toggleDrawer(false)}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              <ListItemIcon sx={{color:theme === 'dark'?"white":"black"}}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{color:theme === 'dark'?"white":"black"}} />
              {item.badge && (
                <Box
                  sx={{
                    backgroundColor: muiTheme.palette.secondary.main,
                    color: 'white',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                  }}
                >
                  {item.badge}
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Header;