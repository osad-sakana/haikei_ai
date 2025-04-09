import React, { useState } from 'react';
import { openAIService } from '../services/openai';
import { createAppError, getErrorMessage } from '../utils/errorHandler';
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

/**
 * メール要約コンポーネント
 * メール本文を入力すると、AIを使用して要約を生成します。
 * @returns メール要約コンポーネント
 */
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

  /**
   * メール本文を要約する
   * @returns Promise<void>
   */
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
      const appError = createAppError(error);
      console.error('Failed to summarize:', appError);
      setSnackbar({
        open: true,
        message: getErrorMessage(appError),
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * スナックバーを閉じる
   */
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  /**
   * 要約結果をクリップボードにコピーする
   */
  const handleCopySummary = () => {
    navigator.clipboard.writeText(summary);
    setSnackbar({
      open: true,
      message: '要約をクリップボードにコピーしました',
      severity: 'success',
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          メール要約
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="メール本文"
            multiline
            rows={6}
            fullWidth
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="要約したいメール本文を入力してください"
          />
          <Button
            variant="contained"
            onClick={handleSummarize}
            disabled={loading || !inputText.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : <Summarize />}
          >
            {loading ? '要約中...' : '要約する'}
          </Button>
          {summary && (
            <Box>
              <Typography variant="h6" gutterBottom>
                要約結果
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, position: 'relative' }}>
                <Typography>{summary}</Typography>
                <IconButton
                  onClick={handleCopySummary}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <ContentCopy />
                </IconButton>
              </Paper>
            </Box>
          )}
        </Stack>
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