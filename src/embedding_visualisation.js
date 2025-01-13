import React from 'react';
import { Box, Typography, LinearProgress, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import embeddingplot from './pixelcut-export.png';
// Custom styled components
const StyledProgressBar = styled(LinearProgress)(({ theme, color }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: '#e5e7eb',
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    backgroundColor: color,
  }
}));

const AccuracyBar = ({ label, value, color }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
        {label}
      </Typography>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        {value}%
      </Typography>
    </Box>
    <StyledProgressBar 
      variant="determinate" 
      value={value} 
      color={color}
    />
  </Box>
);

const EmbeddingVisualization = () => {
  return (
    <Box sx={{ display: 'flex', gap: 4, p: 3 }}>
      {/* Left side: Embedding Plot */}
      <Box sx={{ flex: '1 1 50%' }}>
        <Box
          component="img"
          src={embeddingplot}
          alt="Embedding visualization"
          sx={{
            width: '100%',
            height: 'auto',
            borderRadius: 2,
            mb: 2
          }}
        />
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            textAlign: 'center',
            fontSize: '0.875rem'
          }}
        >
          The blue and red nodes belong to two affected classes due to label confusion. 
          The embeddings of these classes are fully entangled in the original trained model.
        </Typography>
      </Box>

      {/* Right side: Accuracy Bars */}
      <Box sx={{ flex: '1 1 50%' }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            bgcolor: '#f8fafc',
            borderRadius: 2,
            border: '1px solid #e2e8f0'
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3,
              fontWeight: 500,
              color: 'text.primary'
            }}
          >
            Model Performance
          </Typography>
          
          <AccuracyBar 
            label="Clean Accuracy" 
            value={85} 
            color="#1e40af"  // dark blue
          />
          
          <AccuracyBar 
            label="Affected Accuracy" 
            value={20} 
            color="#991b1b"  // dark red
          />

          <Box sx={{ mt: 3 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                display: 'block'
              }}
            >
              * Values shown are representative
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default EmbeddingVisualization;