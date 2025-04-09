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
} from '@mui/material';
import { ContentCopy } from '@mui/icons-material';

// Electronオブジェクトの型定義
declare global {
  interface Window {
    electron?: Electron;
  }
}

const MailSummary: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
      let result: string;
      
      // 実際のElectron APIまたはフェッチAPIを使う
      if (window.electron) {
        // Electronの場合
        result = await window.electron.summarizeMail(inputText);
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
                content: 'あなたはメールの要約を専門とするAIアシスタントです。与えられたメールの内容を簡潔に要約し、重要なポイントとアクションアイテムを箇条書きで抽出してください。'
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
      
      setSummary(result);
    } catch (error) {
      console.error('要約の生成に失敗しました', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : '要約の生成に失敗しました',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary).then(() => {
      setSnackbar({
        open: true,
        message: '要約結果をコピーしました',
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
          メール要約
        </Typography>
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
            >
              {loading ? <CircularProgress size={24} /> : '要約する'}
            </Button>
          </Box>
          
          {summary && (
            <Box sx={{ 
              flex: 1,
              position: 'relative',
            }}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  要約結果
                </Typography>
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