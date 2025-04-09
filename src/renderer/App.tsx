import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import Settings from './components/Settings';
import MailSummary from './components/MailSummary';
import StyleConverter from './components/StyleConverter';

// テーマの作成
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
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
              <Route path="/settings" element={<Settings />} />
              <Route path="/mail-summary" element={<MailSummary />} />
              <Route path="/style-converter" element={<StyleConverter />} />
              <Route path="/" element={<MailSummary />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App; 