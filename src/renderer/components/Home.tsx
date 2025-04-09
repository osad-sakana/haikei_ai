import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Email,
  Style,
  Settings,
} from '@mui/icons-material';

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      title: 'メール要約',
      description: '長文のメールをAIが自動で要約します。重要なポイントを素早く把握できます。',
      icon: <Email sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/mail-summary',
    },
    {
      title: '文体変換',
      description: '文章の文体を変換します。箇条書きの文章をビジネスに合う文章に変換します。',
      icon: <Style sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/style-converter',
    },
    {
      title: '設定',
      description: 'APIキーの設定やアプリケーションの設定を行います。',
      icon: <Settings sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/settings',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Haikei AI
        </Typography>
        <Typography variant="h6" color="text.secondary">
          AIを活用した文章処理ツール
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature) => (
            <Card
                sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                },
                }}
            >
                <CardContent sx={{ 
                flexGrow: 1, 
                textAlign: 'center',
                width: '100%',
                }}>
                <Box sx={{ mb: 2 }}>
                    {feature.icon}
                </Box>
                <Typography variant="h5" component="h2" gutterBottom>
                    {feature.title}
                </Typography>
                <Typography color="text.secondary">
                    {feature.description}
                </Typography>
                </CardContent>
                <CardActions sx={{ 
                justifyContent: 'center', 
                pb: 2,
                width: '100%',
                }}>
                <Button
                    component={Link}
                    to={feature.path}
                    variant="contained"
                    size="large"
                    fullWidth
                >
                    使ってみる
                </Button>
                </CardActions>
            </Card>
        ))}
      </Grid>
    </Container>
  );
};

export default Home; 