import React, { useState } from 'react';
import { openAIService } from '../services/openai';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ContentCopy, Summarize, Email } from '@mui/icons-material';

// Electronオブジェクトの型定義
declare global {
  interface Window {
    electron?: Electron;
  }
}

const MailSummary: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
      const prompts = [
        {
          role: 'system' as const,
          content: 'あなたはメールの要約を専門とするAIアシスタントです。与えられたメールの内容を箇条書きにして、要約してください。',
        },
        {
          role: 'user' as const,
          content: inputText,
        },
      ];

      const result = await openAIService.generateText(prompts);
      setSummary(result);
    } catch (error) {
      console.error('Failed to summarize:', error);
      setSnackbar({
        open: true,
        message: '要約の生成に失敗しました',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setSnackbar({
        open: true,
        message: '要約をクリップボードにコピーしました',
        severity: 'success',
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      setSnackbar({
        open: true,
        message: 'コピーに失敗しました',
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
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Email color="primary" />
          <Typography variant="h5" component="h2">
            メール要約
          </Typography>
        </Stack>
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          mt: 2,
        }}>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={isMobile ? 8 : 10}
              label="メール本文"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="要約したいメール本文を入力してください"
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSummarize}
              disabled={loading || !inputText.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : <Summarize />}
            >
              要約する
            </Button>
          </Box>
          
          {summary && (
            <Box sx={{ 
              flex: 1,
              position: 'relative',
            }}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Summarize color="primary" />
                  <Typography variant="h6">
                    要約結果
                  </Typography>
                </Stack>
                <Typography
                  component="div"
                  sx={{ 
                    whiteSpace: 'pre-line', 
                    pt: 1,
                  }}
                >
                  {summary}
                </Typography>
              </Paper>
              <IconButton
                onClick={handleCopy}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                }}
              >
                <ContentCopy />
              </IconButton>
            </Box>
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