import React, { useState, useEffect } from 'react';
import { Electron, mockElectron } from '../types';
import { openAIService } from '../services/openai';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const electron: Electron = window.electron || mockElectron;

const Settings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    const loadApiKey = async () => {
      try {
        const savedApiKey = await electron.store.get('openaiApiKey');
        if (savedApiKey) {
          setApiKey(savedApiKey);
        }
      } catch (error) {
        console.error('Failed to load API key:', error);
        setSnackbar({
          open: true,
          message: 'APIキーの読み込みに失敗しました',
          severity: 'error',
        });
      }
    };

    loadApiKey();
  }, []);

  const handleSave = async () => {
    try {
      await openAIService.setApiKey(apiKey);
      setSnackbar({
        open: true,
        message: 'APIキーを保存しました',
        severity: 'success',
      });
    } catch (error) {
      console.error('Failed to save API key:', error);
      setSnackbar({
        open: true,
        message: 'APIキーの保存に失敗しました',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      p: { xs: 2, md: 4 },
    }}>
      <Paper elevation={3} sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        p: { xs: 2, md: 4 },
      }}>
        <Typography variant="h5" component="h2" gutterBottom>
          設定
        </Typography>
        <Box sx={{ mt: 4 }}>
          <TextField
            fullWidth
            label="OpenAI API Key"
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowApiKey(!showApiKey)}
                    edge="end"
                  >
                    {showApiKey ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={!apiKey}
            >
              保存
            </Button>
          </Box>
        </Box>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings; 