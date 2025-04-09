import React, { useState, useEffect } from 'react';
import { Electron, mockElectron } from '../types';
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
  Chip,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

declare global {
  interface Window {
    electron?: Electron;
  }
}

// モックストア（開発環境用）
const mockStore = {
  data: new Map<string, any>(),
  get: function(key: string) {
    return this.data.get(key);
  },
  set: function(key: string, value: any) {
    this.data.set(key, value);
    console.log(`Mock store: set ${key} to ${value}`);
  }
};

const Settings: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const loadApiKey = async () => {
      try {
        const electron = window.electron || mockElectron;
        const savedApiKey = await electron.store.get('apiKey');
        if (savedApiKey) {
          setApiKey(savedApiKey);
          setIsApiKeySet(true);
        }
      } catch (error) {
        console.error('APIキーの読み込みに失敗しました', error);
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
      const electron = window.electron || mockElectron;
      await electron.store.set('apiKey', apiKey);
      setIsApiKeySet(true);
      setSnackbar({
        open: true,
        message: 'APIキーを保存しました',
        severity: 'success',
      });
    } catch (error) {
      console.error('APIキーの保存に失敗しました', error);
      setSnackbar({
        open: true,
        message: 'APIキーの保存に失敗しました',
        severity: 'error',
      });
    }
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    if (isApiKeySet) {
      setSnackbar({
        open: true,
        message: 'APIキーが変更されました。保存してください。',
        severity: 'info',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          設定
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              OpenAI API Key
            </Typography>
            {isApiKeySet && (
              <Chip
                label="設定済み"
                color="success"
                size="small"
              />
            )}
          </Box>
          <TextField
            fullWidth
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            onChange={handleApiKeyChange}
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
            helperText="OpenAIのAPIキーを入力してください"
          />
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
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