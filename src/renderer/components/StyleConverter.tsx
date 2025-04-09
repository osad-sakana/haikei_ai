import React, { useState } from 'react';
import { Electron } from '../types';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
} from '@mui/material';

declare global {
  interface Window {
    electron?: Electron;
  }
}

const StyleConverter: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [convertedText, setConvertedText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleConvert = async () => {
    if (!inputText.trim()) {
      setSnackbar({
        open: true,
        message: '変換するテキストを入力してください',
        severity: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      if (window.electron) {
        const result = await window.electron.convertStyle(inputText);
        setConvertedText(result);
      } else {
        console.warn('Electron API is not available in development mode');
        setConvertedText('これは開発環境用のサンプル変換結果です。');
      }
    } catch (error) {
      console.error('文体の変換に失敗しました', error);
      setSnackbar({
        open: true,
        message: '文体の変換に失敗しました',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          文体変換
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              multiline
              rows={10}
              label="変換前のテキスト"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="変換したいテキストを入力してください"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              multiline
              rows={10}
              label="変換後のテキスト"
              value={convertedText}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConvert}
            disabled={loading || !inputText.trim()}
            sx={{ minWidth: 200 }}
          >
            {loading ? <CircularProgress size={24} /> : '変換する'}
          </Button>
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

export default StyleConverter; 