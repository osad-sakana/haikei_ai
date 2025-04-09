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
import { ContentCopy, Style } from '@mui/icons-material';

/**
 * 文体変換コンポーネント
 * 入力されたテキストをビジネスメール形式に変換します。
 * @returns 文体変換コンポーネント
 */
const StyleConverter: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [convertedText, setConvertedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /**
   * テキストをビジネスメール形式に変換する
   * @returns Promise<void>
   */
  const handleConvert = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const prompts = [
        {
          role: 'system' as const,
          content: 'あなたは文章の文体を変換するAIアシスタントです。与えられた文章をビジネスメールに適した形にしてください。「お世話になっております。」から始まり、「よろしくお願いいたします。」で終わるようにしてください。',
        },
        {
          role: 'user' as const,
          content: inputText,
        },
      ];

      const result = await openAIService.generateText(prompts);
      setConvertedText(result);
    } catch (error) {
      const appError = createAppError(error);
      console.error('Failed to convert:', appError);
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
   * 変換結果をクリップボードにコピーする
   */
  const handleCopyText = () => {
    navigator.clipboard.writeText(convertedText);
    setSnackbar({
      open: true,
      message: '変換結果をクリップボードにコピーしました',
      severity: 'success',
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          文体変換
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="変換したいテキスト"
            multiline
            rows={6}
            fullWidth
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="ビジネスメール形式に変換したいテキストを入力してください"
          />
          <Button
            variant="contained"
            onClick={handleConvert}
            disabled={loading || !inputText.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : <Style />}
          >
            {loading ? '変換中...' : '変換する'}
          </Button>
          {convertedText && (
            <Box>
              <Typography variant="h6" gutterBottom>
                変換結果
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, position: 'relative' }}>
                <Typography>{convertedText}</Typography>
                <IconButton
                  onClick={handleCopyText}
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

export default StyleConverter; 