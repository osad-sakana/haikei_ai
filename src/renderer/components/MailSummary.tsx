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
} from '@mui/material';

// Electronオブジェクトの型定義
declare global {
  interface Window {
    electron?: Electron;
  }
}

const MailSummary: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
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

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setSnackbar({
        open: true,
        message: 'メール本文を入力してください',
        severity: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      if (window.electron) {
        const result = await window.electron.summarizeMail(inputText);
        setSummary(result);
      } else {
        // 開発環境用のモックレスポンス
        console.warn('Electron API is not available in development mode');
        setSummary('これは開発環境用のサンプル要約です。');
      }
    } catch (error) {
      console.error('要約の生成に失敗しました', error);
      setSnackbar({
        open: true,
        message: '要約の生成に失敗しました',
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
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          メール要約
        </Typography>
        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="メール本文"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="要約したいメール本文を入力してください"
            sx={{ mb: 3 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSummarize}
              disabled={loading || !inputText.trim()}
            >
              {loading ? <CircularProgress size={24} /> : '要約する'}
            </Button>
          </Box>
          {summary && (
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                要約結果
              </Typography>
              <Typography>{summary}</Typography>
            </Paper>
          )}
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

export default MailSummary; 