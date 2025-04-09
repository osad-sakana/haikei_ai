import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import Settings from './components/Settings';
import MailSummary from './components/MailSummary';
import StyleConverter from './components/StyleConverter';
import Home from './components/Home';

// オレンジ色のテーマを作成
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF9800', // オレンジ色
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FF5722', // 濃いオレンジ色
      light: '#FF8A65',
      dark: '#E64A19',
      contrastText: '#fff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Haikei AI
              </Typography>
              <Button color="inherit" component={Link} to="/">
                ホーム
              </Button>
              <Button color="inherit" component={Link} to="/mail-summary">
                メール要約
              </Button>
              <Button color="inherit" component={Link} to="/style-converter">
                文体変換
              </Button>
              <Button color="inherit" component={Link} to="/settings">
                設定
              </Button>
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/mail-summary" element={<MailSummary />} />
              <Route path="/style-converter" element={<StyleConverter />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App; 