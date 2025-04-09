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
import { ContentCopy, Style } from '@mui/icons-material';

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
      console.error('Failed to convert:', error);
      setSnackbar({
        open: true,
        message: '文体の変換に失敗しました',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(convertedText);
      setSnackbar({
        open: true,
        message: '変換結果をクリップボードにコピーしました',
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
          <Style color="primary" />
          <Typography variant="h5" component="h2">
            文体変換
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
              label="変換したい文章"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="変換したい文章を入力してください"
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConvert}
              disabled={loading || !inputText.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : <Style />}
            >
              変換する
            </Button>
          </Box>
          
          {convertedText && (
            <Box sx={{ 
              flex: 1,
              position: 'relative',
            }}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Style color="primary" />
                  <Typography variant="h6">
                    変換結果
                  </Typography>
                </Stack>
                <Typography
                  component="div"
                  sx={{ 
                    whiteSpace: 'pre-line', 
                    pt: 1,
                  }}
                >
                  {convertedText}
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

export default StyleConverter; 