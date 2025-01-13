import React from 'react';
import {
    Typography,
    Box,
    Paper,
    Grid
} from '@mui/material';
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import D3ACDCAnimation from './acdc';

const ACDCSection = ({ config }) => (
    <Paper elevation={0} sx={{ p: 1, mb: 1 }}>
        <Typography variant="h5" gutterBottom>
        Unlearning Old Labels with AC⚡DC
        </Typography>


        <Grid container spacing={4} alignItems="center">
            {/* Animation */}
            <Grid item xs={12} sm={6} md={6} lg={6}>
                <Box sx={{ transform: 'scale(1)', transformOrigin: 'top left', width: '100%', height: 'auto' }}>
                    <D3ACDCAnimation />
                </Box>
            </Grid>

            {/* Math equations - MathJax only wraps this section */}
            <Grid item xs={12} sm={6} md={6} lg={6}>
                <MathJaxContext config={config}>
                    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>

                        <Typography variant="body1" sx={{ textAlign: 'justify', mb: 2 }}>
                            Next, we address the question: Can we undo the effect of the task loss <MathJaxContext><MathJax inline>{"$\\mathcal{L}_{\\text{task}}$"}</MathJax></MathJaxContext> explicitly learning to fit the node representations of Sm to potentially wrong labels? We perform gradient ascent on Sf to non-directionally maximize the training loss for old labels, while counterbalancing with steps that minimize the task loss on remaining data.
                        </Typography>

                        <Typography variant="body1" gutterBottom>
                            More precisely, we perform gradient ascent on <MathJax inline>{"$\\mathcal{V}_f$"}</MathJax> and gradient descent on <MathJax inline>{"$\\mathcal{V}_r$"}</MathJax>, iteratively on the original GNN <MathJax inline>{"$\\mathcal{M}$"}</MathJax>:
                        </Typography>

                        <Box sx={{ my: 3, display: 'flex', justifyContent: 'center' }}>
                            <MathJax>{"$$\\mathcal{L}_a = -\\mathcal{L}_{\\text{task}}(\\mathcal{V}_f), \\quad \\mathcal{L}_d = \\mathcal{L}_{\\text{task}}(\\mathcal{V}_r)$$"}</MathJax>
                        </Box>

                        <Typography variant="body1" sx={{ mt: 2 }}>
                            This requires a careful balance between ascent and descent, which we achieve using two different optimizers and starting learning rates. While similar approaches have been studied for image classification and language models, graphs present unique challenges due to the interconnected nature of the data.
                        </Typography>

                        <Typography variant="body1" sx={{ mt: 2 }}>
                            We call this component Ascent Descent de↯coupled (AC↯DC) to emphasize the distinction from existing variants of ascent on Sf and descent on remaining data. This component is crucial when Sf ⊂ Sm, as the remaining data could still contain manipulated entities which we aim to avoid reinforcing.
                        </Typography>
                    </Box>
                </MathJaxContext>
            </Grid>
        </Grid>
    </Paper>
);

export default ACDCSection;