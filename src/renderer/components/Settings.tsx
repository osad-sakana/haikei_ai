import React, { useState, useEffect } from 'react';
import { openAIService } from '../services/openai';
import { createAppError, getErrorMessage } from '../utils/errorHandler';
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

/**
 * 設定コンポーネント
 * OpenAI APIキーの設定と管理を行います
 */
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
        const savedApiKey = await openAIService.getApiKey();
        if (savedApiKey) {
          setApiKey(savedApiKey);
        }
      } catch (error) {
        const appError = createAppError(error);
        console.error('Failed to load API key:', appError);
        setSnackbar({
          open: true,
          message: getErrorMessage(appError),
          severity: 'error',
        });
      }
    };

    loadApiKey();
  }, []);

  /**
   * APIキーを保存する
   */
  const handleSave = async () => {
    try {
      await openAIService.setApiKey(apiKey);
      setSnackbar({
        open: true,
        message: 'APIキーを保存しました',
        severity: 'success',
      });
    } catch (error) {
      const appError = createAppError(error);
      console.error('Failed to save API key:', appError);
      setSnackbar({
        open: true,
        message: getErrorMessage(appError),
        severity: 'error',
      });
    }
  };

  /**
   * スナックバーを閉じる
   */
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          設定
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            OpenAI APIキー
          </Typography>
          <TextField
            fullWidth
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
              onClick={handleSave}
              disabled={!apiKey.trim()}
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