import SimpleMovement from './contrastive_animation';
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid
} from '@mui/material';
import { MathJaxContext, MathJax } from 'better-react-mathjax';

const ContrastiveSection = ({ config }) => (
  <Paper elevation={0} sx={{ p: 1, mb: 1 }}>
    <Typography variant="h5" gutterBottom>
      Contrastive Unlearning
    </Typography>
    
    <Typography variant="body1" sx={{ textAlign: 'justify', mb: 2 }}>
      To remove the influence of the deletion set Sf on the affected nodes identified in the previous step, we can optimize a loss function that updates the weights such that the final layer logits of Sf and the affected nodes are pushed away. However, this alone will lead to unrestricted separation and damage the quality of learned representations. To prevent this, we also counterbalance the loss with another term that penalizes moving away from logits of neighboring nodes not in the deletion set Sf.
    </Typography>

    <Grid container spacing={4} alignItems="center">
      {/* Animation */}
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <Box sx={{ transform: 'scale(1)', transformOrigin: 'top left', width: '100%', height: 'auto' }}>
          <SimpleMovement />
        </Box>
      </Grid>

      {/* Math equations - MathJax only wraps this section */}
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <MathJaxContext config={config}>
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="body1" gutterBottom>
              For each node v ∈ S, let <MathJax inline>{"$z_v$"}</MathJax> represent its internal embedding, with p ∈ N(v) and n ∈ Vf serving as the positive and negative samples, respectively. We use the following unsupervised contrastive loss:
            </Typography>

            <Box sx={{ my: 3, display: 'flex', justifyContent: 'center' }}>
              <MathJax>{"$$\\mathcal{L}_c = -\\log(\\sigma(z_v^{\\top} z_p)) - \\log(\\sigma(-z_v^{\\top} z_n))$$"}</MathJax>
            </Box>

            <Typography variant="body2" sx={{ mt: 2 }}>
              where:
            </Typography>
            <Box sx={{ pl: 2, mt: 1 }}>
              <Typography component="div" sx={{ mb: 1 }}>
                <MathJax inline>{"$z_v$"}</MathJax> represents internal node embeddings
              </Typography>
              <Typography component="div" sx={{ mb: 1 }}>
                <MathJax inline>{"$p \\in \\mathcal{N}(v)$"}</MathJax> defines positive samples
              </Typography>
              <Typography component="div" sx={{ mb: 1 }}>
                <MathJax inline>{"$n \\in \\mathcal{V}_f$"}</MathJax> indicates negative samples
              </Typography>
              <Typography component="div" sx={{ mb: 1 }}>
                <MathJax inline>{"$\\sigma$"}</MathJax> is the sigmoid activation
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ mt: 2 }}>
              The loss is similar to the one used in GraphSAGE (Hamilton et al., 2017), but only updates affected nodes to make their representations dissimilar from the deletion set while keeping them similar to the remaining nodes in their neighborhood. We choose an unsupervised loss function to fix representations even in mislabeling, which is essential when the manipulated set is not fully known (Sf ⊂ Sm).
            </Typography>
          </Box>
        </MathJaxContext>
      </Grid>
    </Grid>
  </Paper>
);

export default ContrastiveSection;