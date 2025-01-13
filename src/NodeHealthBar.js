import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { styled } from '@mui/system';

const CustomLinearProgress = styled(LinearProgress)(({ theme, color }) => ({
  flexGrow: 1,
  height: 10,
  borderRadius: 5,
  border: '1px solid #ccc',
  width: '100%',
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    backgroundColor: color,
  },
}));

const NodeHealthBar = ({ cleanValue, affectedValue }) => (
  <Box display="flex" flexDirection="column" gap={2}>
    <Box display="flex" flexDirection="column" alignItems="flex-start" gap={1}>
      <Typography variant="p">Clean Accuracy</Typography>
      <CustomLinearProgress
        variant="determinate"
        value={cleanValue}
        color="#00416A" // Custom green color
      />
    </Box>
    <Box display="flex" flexDirection="column" alignItems="flex-start" gap={1}>
      <Typography variant="p">Affected Accuracy</Typography>
      <CustomLinearProgress
        variant="determinate"
        value={affectedValue}
        color="#990000" // Custom red color
      />
    </Box>
  </Box>
);

export default NodeHealthBar;