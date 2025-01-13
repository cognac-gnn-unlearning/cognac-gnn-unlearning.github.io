import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Stack,
  Link,
  IconButton,
  Paper,
  Grid
} from '@mui/material';
import { Copy } from 'lucide-react';
import { GitHub, Description, Image } from '@mui/icons-material';
import { X } from 'lucide-react';
import Cognac from './Cognac';
import TwitterEmbeds from './Twitter';
import NetworkGraph from './PoisonedNetwork';
import NodeHealthBar from './NodeHealthBar';
import SimpleMovement from './contrastive_animation';
import D3ACDCAnimation from './acdc';
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import ContrastiveSection from './contrastive_section';
import ACDCSection from './acdc_section';
import EmbeddingVisualization from './embedding_visualisation';
const PaperWebsite = () => {
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    document.title = 'A Cognac Shot';
  }, []);

  const authors = [
    { name: 'Varshita Kolipaka', affiliation: 1, isEqualContrib: true },
    { name: 'Akshit Sinha', affiliation: 1, isEqualContrib: true },
    { name: 'Debangan Mishra', affiliation: 1 },
    { name: 'Sumit Kumar', affiliation: 1 },
    { name: 'Arvindh Arun', affiliation: [1, 2] },
    { name: 'Shashwat Goel', affiliation: [1, 3, 4] },
    { name: 'Ponnurangam Kumaraguru', affiliation: 1 }
  ];

  const affiliations = [
    'IIIT Hyderabad',
    'Institute for AI, University of Stuttgart',
    'Max Planck Institute for Intelligent Systems',
    'ELLIS Institute Tübingen'
  ];

  const bibtex = `@misc{kolipaka2024cognacshotforgetbad,
      title={A Cognac shot to forget bad memories: Corrective Unlearning in GNNs}, 
      author={Varshita Kolipaka and Akshit Sinha and Debangan Mishra and Sumit Kumar and Arvindh Arun and Shashwat Goel and Ponnurangam Kumaraguru},
      year={2024},
      eprint={2412.00789},
      archivePrefix={arXiv},
      primaryClass={cs.LG},
      url={https://arxiv.org/abs/2412.00789}, 
}`;

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(bibtex);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const config = {
    loader: { load: ["[tex]/html"] },
    tex: {
      inlineMath: [["$", "$"]],
      displayMath: [["$$", "$$"]]
    }
  };


  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 2,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 0
        }}
      >
        {/* Title Section */}
        <Box sx={{ mb: 0 }}>
          <Typography variant="h3" align="center" gutterBottom>
            A <Cognac /> Shot To Forget Bad Memories: Corrective Unlearning in GNNs
          </Typography>
        </Box>

        {/* Authors Section */}
        <Paper elevation={0} sx={{ p: 1, mb: 0 }}>
          <Box sx={{ textAlign: 'center', mb: 1 }}>
            {authors.map((author, idx) => (
              <Typography component="span" key={idx}>
                <Link href="#" underline="hover">{author.name}</Link>
                {author.isEqualContrib && <sup>*</sup>}
                <sup>
                  {Array.isArray(author.affiliation)
                    ? author.affiliation.join(',')
                    : author.affiliation}
                </sup>
                {idx < authors.length - 1 && ', '}
              </Typography>
            ))}
          </Box>

          <Typography variant="body2" align="center">
            {affiliations.map((aff, idx) => (
              <span key={idx}>
                <sup>{idx + 1}</sup> {aff}
                {idx < affiliations.length - 1 && ' • '}
              </span>
            ))}
          </Typography>
        </Paper>

        {/* Buttons Section */}
        <Paper elevation={0} sx={{ p: 1, mb: 2 }}>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
          >
            <Button
              variant="contained"
              startIcon={<Description />}
              sx={{ backgroundColor: '#333333', borderRadius: '20px', textTransform: 'none' }}
            >
              Paper
            </Button>
            <Button
              variant="contained"
              startIcon={<GitHub />}
              sx={{ backgroundColor: '#333333', borderRadius: '20px', textTransform: 'none' }}
            >
              Code
            </Button>
            <Button
              variant="contained"
              startIcon={<Image />}
              sx={{ backgroundColor: '#333333', borderRadius: '20px', textTransform: 'none' }}
            >
              Poster
            </Button>
          </Stack>
        </Paper>

        {/* Abstract Section */}
        <Paper elevation={0} sx={{ p: 1, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Abstract
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'justify' }}>
            Graph Neural Networks (GNNs) are increasingly being used for a variety of ML applications on graph data.
            Because graph data does not follow the independently and identically distributed (<i>i.i.d.</i>) assumption,
            adversarial manipulations or incorrect data can propagate to other data points through message passing,
            which deteriorates the model's performance. To allow model developers to remove the adverse effects of
            manipulated entities from a trained GNN, we study the recently formulated problem of <i>Corrective Unlearning</i>.
            We find that current graph unlearning methods fail to unlearn the effect of manipulations even when the whole
            manipulated set is known. We introduce a new graph unlearning method, <Cognac />, which can unlearn the effect
            of the manipulation set even when only 5% of it is identified.
          </Typography>
        </Paper>

        {/* Problem Setting Section */}
        <Paper elevation={0} sx={{ p: 1, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Problem Setting
          </Typography>

          <MathJaxContext config={config}>

            <Typography paragraph sx={{ mb: 3 }}>
              We focus on semi-supervised node classification using GNNs and formulate the <i>Corrective Unlearning</i> problem for graph-structured data. Consider a graph <MathJax inline>{"$\\mathcal{G} = (V, \\mathcal{E})$"}</MathJax>, where <MathJax inline>{"$V$"}</MathJax> and <MathJax inline>{"$\\mathcal{E}$"}</MathJax> represent the constituent set of nodes and edges respectively. Unlearning requests can be of the form to unlearn one or more of nodes and edges of the graph, where for each node <MathJax inline>{"$V_i \\in V$"}</MathJax>, we have a feature vector <MathJax inline>{"$X_i$"}</MathJax> and label <MathJax inline>{"$Y_i$"}</MathJax>, where <MathJax inline>{"$V = (X,Y)$"}</MathJax>.
            </Typography>

            <Typography variant="body1">
              Can we unlearn the effect of all the devil nodes (red and black) while discovering only a few (red)?
              This problem is interesting in graphs because the effect of a node can propagate to other nodes
              through message passing.
            </Typography>

          </MathJaxContext>

          



          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: 'auto',
                  minHeight: '200px',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',

                }}
              >
                <NetworkGraph />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <EmbeddingVisualization />
            </Grid>
          </Grid>
        </Paper>

        <MathJaxContext config={config}>
            

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Adversary's Perspective
            </Typography>

            <Typography paragraph>
              The adversary aims to reduce model accuracy by manipulating the training data <MathJax inline>{"$\\mathcal{G}$"}</MathJax>.
              This can be done by:
            </Typography>

            <Typography component="div" sx={{ pl: 3 }}>
              <ul>
                <li>
                  <Typography paragraph>
                    Adding spurious edges <MathJax inline>{"$\\mathcal{E}$"}</MathJax>, resulting in <MathJax inline>{"$\\mathcal{G}' = \\mathcal{E} \\cup \\mathcal{G}$"}</MathJax>
                  </Typography>
                </li>
                <li>
                  <Typography paragraph>
                    Manipulating node information <MathJax inline>{"$V' = f_m(V)$"}</MathJax>, where <MathJax inline>{"$f_m$"}</MathJax> modifies node features or labels
                  </Typography>
                </li>
              </ul>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Unlearner's Perspective
            </Typography>

            <Typography paragraph>
             The objective is to remove the influence of manipulated training data <MathJax inline>{"$S_m$"}</MathJax> while
              maintaining performance on clean data.
            </Typography>

            <Box sx={{ my: 3, display: 'flex', justifyContent: 'center' }}>
              <MathJax>{"$S_f$ must be a representative subset of $S_m$. The unlearning method $f_u(\\mathcal{M},S_f,\\mathcal{G}')$ should maximize accuracy on clean samples while improving robustness against manipulation."}</MathJax>
            </Box>
          </MathJaxContext>

        {/* Method Section */}
        <Paper elevation={0} sx={{ p: 1, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Method
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'justify' }}>
            We propose a novel method, <Cognac />, which can unlearn the effect of the manipulation set even when only
            5% of it is identified. <Cognac /> is based on the idea of <i>Corrective Unlearning</i>, where we aim to
            unlearn the effect of the manipulated nodes while retaining the knowledge of the clean nodes. We achieve this
            by introducing a new loss function that encourages the model to predict the correct label for the clean nodes
            while predicting the incorrect label for the manipulated nodes. We show that <Cognac /> outperforms the
            state-of-the-art methods in unlearning the effect of the manipulation set.
          </Typography>
        </Paper>

        <ContrastiveSection config={config} />

        {/* ACDC Section */}
        <ACDCSection config={config} />

        {/* Contrastive Section */}



        {/* Citation Section */}
        <Paper elevation={1} sx={{ p: 2, mb: 4, position: 'relative' }}>
          <Typography variant="h5" gutterBottom>
            Citation
          </Typography>
          <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', overflow: 'auto' }}>
              {bibtex}
            </pre>
            <IconButton
              onClick={handleCopyBibtex}
              sx={{ position: 'absolute', top: 8, right: 8 }}
              size="small"
            >
              {showCopied ? (
                <Typography variant="caption" color="success.main">
                  Copied!
                </Typography>
              ) : (
                <Copy size={20} />
              )}
            </IconButton>
          </Box>
        </Paper>

        {/* Twitter Section */}
        <Paper elevation={0} sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Twitter
          </Typography>
          <Box sx={{ overflow: 'hidden' }}>
            <TwitterEmbeds />
          </Box>
        </Paper>
      </Paper>
    </Container>
  );
};

export default PaperWebsite;