import React, { useState, useEffect } from 'react';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';

const TwitterEmbeds = () => {
  const tweetIds = [
    '1871393423078650146',
    '1871087054454677826',
    '1871085510132965766',
    '1871099538506924428',
    '1871232239863787925'
  ];

  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = React.useRef(null);

  const handleScroll = () => {
    if (containerRef.current) {
      const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;
      const progress = (containerRef.current.scrollLeft / maxScroll) * 100;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{ 
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        px: 2,
        py: 2,
        '&::-webkit-scrollbar': {
          height: 4,
          borderRadius: 2
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(184,134,11,0.1)',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'linear-gradient(45deg, #b8860b 30%, #8b4513 90%)',
          borderRadius: 2,
          '&:hover': {
            background: 'linear-gradient(45deg, #daa520 30%, #cd853f 90%)'
          }
        }
      }}
    >
      {tweetIds.map(id => (
        <Card
          key={id}
          sx={{
            width: 260,
            height: 320,
            flexShrink: 0,
            background: 'linear-gradient(45deg, #b8860b 30%, #8b4513 90%)',
            borderRadius: 2
          }}
        >
          <Box sx={{ 
            width: '100%',
            height: '100%',
            bgcolor: 'background.paper',
            borderRadius: 1.5,
            overflowY: 'auto',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': {
              width: 4
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent'
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#b8860b',
              borderRadius: 2,
              '&:hover': {
                background: '#daa520'
              }
            }
          }}>
            <TwitterTweetEmbed
              tweetId={id}
              options={{
                width: 260,
                height: 320,
                cards: 'hidden',
                conversation: 'none',
              }}
            />
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default TwitterEmbeds;