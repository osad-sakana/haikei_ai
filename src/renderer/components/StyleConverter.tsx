import React, { useState } from 'react';
import { Electron, mockElectron } from '../types';
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
  Grid,
} from '@mui/material';
import { ContentCopy, ArrowForward } from '@mui/icons-material';

declare global {
  interface Window {
    electron?: Electron;
  }
}

const StyleConverter: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
      let result: string;
      
      // 実際のElectron APIまたはフェッチAPIを使う
      if (window.electron) {
        // Electronの場合
        result = await window.electron.convertStyle(inputText);
      } else {
        // 開発モードの場合は直接APIを呼び出す
        const apiKey = localStorage.getItem('apiKey');
        if (!apiKey) {
          throw new Error('APIキーが設定されていません。設定画面からAPIキーを設定してください。');
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'あなたは文体変換を専門とするAIアシスタントです。与えられたテキストを丁寧なビジネス文書の文体に変換してください。必ず「お世話になっております。〜です。」という挨拶で文章を始め、末尾は「よろしくお願いします。」で締めるようにしてください。'
              },
              {
                role: 'user',
                content: inputText
              }
            ],
            temperature: 0.7,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'APIリクエストに失敗しました');
        }
        
        const data = await response.json();
        result = data.choices[0].message.content;
      }
      
      setConvertedText(result);
    } catch (error) {
      console.error('文体の変換に失敗しました', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : '文体の変換に失敗しました',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedText).then(() => {
      setSnackbar({
        open: true,
        message: '変換結果をコピーしました',
        severity: 'success',
      });
    }).catch(() => {
      setSnackbar({
        open: true,
        message: 'コピーに失敗しました',
        severity: 'error',
      });
    });
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
          文体変換
        </Typography>
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          flex: 1,
          mt: 2,
        }}>
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            width: { xs: '100%', md: '40%' },
          }}>
            <TextField
              fullWidth
              multiline
              rows={isMobile ? 6 : 12}
              label="変換前のテキスト"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="箇条書きで入力してください"
              helperText="箇条書きで入力すると、より自然な変換結果が得られます"
              sx={{ flex: 1 }}
            />
          </Box>
          
          <Stack
            direction={isMobile ? 'row' : 'column'}
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{ py: 2 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleConvert}
              disabled={loading || !inputText.trim()}
              sx={{ 
                minWidth: isMobile ? 'auto' : 120,
                width: isMobile ? '100%' : 'auto',
              }}
            >
              {loading ? <CircularProgress size={24} /> : '変換'}
            </Button>
            <ArrowForward sx={{ 
              fontSize: 40, 
              color: 'primary.main',
              transform: isMobile ? 'rotate(90deg)' : 'none',
            }} />
          </Stack>
          
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
            width: { xs: '100%', md: '40%' },
          }}>
            <TextField
              fullWidth
              multiline
              rows={isMobile ? 6 : 12}
              label="変換後のテキスト"
              value={convertedText}
              InputProps={{
                readOnly: true,
              }}
              sx={{ flex: 1 }}
            />
            {convertedText && (
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
            )}
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

export default StyleConverter; 