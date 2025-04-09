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
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
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
      const electron = window.electron || mockElectron;
      const result = await electron.convertStyle(inputText);
      setConvertedText(result);
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
        <Grid container spacing={3} sx={{ 
          flex: 1,
          mt: 2,
          height: '100%',
        }}>
          <Grid item xs={12} md={5} sx={{ height: '100%' }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
          </Grid>
          <Grid item xs={12} md={2} sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: isMobile ? 'row' : 'column',
            gap: 2,
          }}>
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
          </Grid>
          <Grid item xs={12} md={5} sx={{ height: '100%' }}>
            <Box sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              position: 'relative',
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
          </Grid>
        </Grid>
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