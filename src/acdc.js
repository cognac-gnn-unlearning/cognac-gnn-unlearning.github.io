import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
    Slider, 
    Box, 
    Typography, 
    Grid, 
    Paper,
    Button
  } from '@mui/material';

const D3ACDCAnimation = () => {
  const containerRef = useRef(null);
  const [params, setParams] = useState({
    acStepSize: 60,
    acRandomness: 30,
    acDecayRate: 0.08,
    acBaseAngle: 70,
    dcStepSize: 50,
    dcRandomness: 25,
    dcDecayRate: 0.2,
    dcBaseAngle: 240,
    animationDuration: 50,
  });

  const width = 450;
  const height = 300;
  const margin = 40;
  const goalRadius = 40;
  
  const bounds = {
    minX: margin + 5,
    maxX: width - margin - 5,
    minY: margin + 5,
    maxY: height - margin - 5,
  };

  const startPoint = { x: margin + 20, y: height - margin - 100 };
  const goalPoint = { x: width - margin - 20, y: height - margin - 100 };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getRandomAngle = (isAC) => {
    const { acRandomness, dcRandomness, acBaseAngle, dcBaseAngle } = params;
    const g = 9.81;
    const baseAngle = (isAC ? -(90 - acBaseAngle) : (360 - dcBaseAngle)) * (Math.PI / 180);
    const randRange = (isAC ? acRandomness : dcRandomness) * (Math.PI / 180);
    return clamp(
      baseAngle + (Math.random() - 0.5) * randRange,
      isAC ? -Math.PI / 2 : 0,
      isAC ? 0 : Math.PI
    );
  };

  const generateSegment = (start, isAC, stepCount) => {
    const { acStepSize, dcStepSize, acDecayRate, dcDecayRate } = params;
    const decayRate = isAC ? acDecayRate : dcDecayRate;
    
    let length = (isAC ? acStepSize : dcStepSize) * 
      ((!isAC && stepCount === 0) ? 1 : Math.exp(-decayRate * stepCount));

    const angle = getRandomAngle(isAC);
    const end = {
      x: clamp(start.x + length * Math.cos(angle), bounds.minX, bounds.maxX),
      y: clamp(start.y + length * Math.sin(angle), bounds.minY, bounds.maxY)
    };

    return {
      start,
      end,
      angle: angle * (180 / Math.PI),
      length,
      isAC
    };
  };

  const isNearGoal = (point) => 
    Math.hypot(goalPoint.x - point.x, goalPoint.y - point.y) <= goalRadius;

  const generatePath = () => {
    const paths = [];
    let current = startPoint;
    let acSteps = 0, dcSteps = 0;

    while (paths.length < 30 && !isNearGoal(current)) {
      const isAC = paths.length % 2 === 0;
      const segment = generateSegment(current, isAC, isAC ? acSteps : dcSteps);
      paths.push(segment);
      current = segment.end;
      if (isAC) acSteps++; else dcSteps++;
    }

    return paths;
  };

  const setupAnimation = () => {
    if (!containerRef.current) return;

    d3.select(containerRef.current).selectAll('*').remove();
    
    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'mb-4');

    // Add axes
    const xScale = d3.scaleLinear()
      .domain([0, 1])
      .range([margin, width - margin]);
    
    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([height - margin, margin]);

    const xAxis = d3.axisBottom(xScale)
      .tickSize(0)
      .tickFormat("");
    
    const yAxis = d3.axisLeft(yScale)
      .tickSize(0)
      .tickFormat("");

    svg.append('g')
      .attr('transform', `translate(0,${height - margin})`)
      .call(xAxis)
      .call(g => g.select(".domain").attr("stroke-width", 2));

    svg.append('g')
      .attr('transform', `translate(${margin},0)`)
      .call(yAxis)
      .call(g => g.select(".domain").attr("stroke-width", 2));

    // Axis labels
    svg.append("text")
      .attr("x", width - margin)
      .attr("y", height - margin/3)
      .attr("text-anchor", "end")
      .text("θ");

    svg.append("text")
      .attr("x", margin/2)
      .attr("y", margin)
      .attr("text-anchor", "end")
      .text("L(θ)");

    // Background gradient
    const defs = svg.append('defs');
    
    const gradient = defs.append('radialGradient')
      .attr('id', 'loss-gradient')
      .attr('cx', goalPoint.x / width * 100 + '%')
      .attr('cy', goalPoint.y / height * 100 + '%')
      .attr('r', '30%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#4ade80')
      .attr('stop-opacity', 0.3);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#fecaca')
      .attr('stop-opacity', 0.4);

    // Add background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#loss-gradient)');

    // Add contour ellipses centered on goal
    const ellipseData = [0.3, 0.6, 0.9];
    ellipseData.forEach(scale => {
      svg.append('ellipse')
        .attr('cx', goalPoint.x)
        .attr('cy', goalPoint.y)
        .attr('rx', 120 * scale)
        .attr('ry', 80 * scale)
        .attr('fill', 'none')
        .attr('stroke', '#888')
        .attr('stroke-width', 0.5)
        .attr('opacity', 0.3);
    });

    // Add flag emoji at goal
    svg.append('text')
      .attr('x', goalPoint.x - 10)
      .attr('y', goalPoint.y + 10)
      .attr('font-size', '24px')
      .text('🚩');
    const pattern = defs.append('pattern')
      .attr('id', 'grid')
      .attr('width', 20)
      .attr('height', 20)
      .attr('patternUnits', 'userSpaceOnUse');

    pattern.append('path')
      .attr('d', 'M 20 0 L 0 0 0 20')
      .attr('fill', 'none')
      .attr('stroke', 'gray')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.2);

    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#grid)');



    // Start point
    svg.append('circle')
      .attr('cx', startPoint.x)
      .attr('cy', startPoint.y)
      .attr('r', 4)
      .attr('fill', 'black');

    const paths = generatePath();
    let currentStep = 0;

    const animate = () => {
      if (currentStep >= paths.length) return;

      const segment = paths[currentStep];
      const color = segment.isAC ? '#dc2626' : '#2563eb';

      const line = svg.append('path')
        .attr('d', `M ${segment.start.x} ${segment.start.y} L ${segment.start.x} ${segment.start.y}`)
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('fill', 'none');

      line.transition()
        .duration(params.animationDuration / 2)
        .attr('d', `M ${segment.start.x} ${segment.start.y} L ${segment.end.x} ${segment.end.y}`)
        .on('end', () => {
          svg.append('path')
            .attr('d', 'M -6 -4 L 0 0 L -6 4')
            .attr('stroke', color)
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('transform', `translate(${segment.end.x}, ${segment.end.y}) rotate(${segment.angle})`)
            .style('opacity', 0)
            .transition()
            .duration(params.animationDuration / 4)
            .style('opacity', 1)
            .on('end', () => {
              currentStep++;
              if (currentStep < paths.length) {
                setTimeout(animate, params.animationDuration / 4);
              }
            });
        });
    };

    animate();
  };

  useEffect(setupAnimation, [params]);

  return (
<Box sx={{ width: '100%' }}>
    <div ref={containerRef} />
    
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <Button
        variant="contained"
        onClick={setupAnimation}
        size="small"
      >
        Restart Animation
      </Button>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
        <Typography variant="caption" sx={{ minWidth: 60 }}>Duration:</Typography>
        <Slider
          size="small"
          min={20}
          max={200}
          value={params.animationDuration}
          onChange={(_, value) => setParams({
            ...params,
            animationDuration: value
          })}
          sx={{
            '& .MuiSlider-thumb': {
              width: 14,
              height: 14,
            }
          }}
        />
        <Typography variant="caption" sx={{ minWidth: 30 }}>
          {params.animationDuration}
        </Typography>
      </Box>
    </Box>

    <Grid container spacing={2}>
      {/* Ascent Parameters */}
      <Grid item xs={6}>
        <Paper 
          sx={{ 
            p: 1.5, 
            bgcolor: '#fff1f2',
            '& .MuiTypography-root': { fontSize: '0.875rem' }
          }}
        >
          <Typography sx={{ color: '#dc2626', fontWeight: 500, mb: 0.5 }}>
            Gradient Ascent
          </Typography>
          {[
            ['Step Size', 'acStepSize', 20, 100],
            ['Base Angle', 'acBaseAngle', 0, 90],
            ['Randomness', 'acRandomness', 0, 90],
            ['Decay Rate', 'acDecayRate', 0, 0.5, true]
          ].map(([label, key, min, max, isDecimal]) => (
            <Box key={key} sx={{ mb: 0.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                <Typography variant="caption">{label}</Typography>
                <Typography variant="caption">
                  {isDecimal ? params[key].toFixed(2) : params[key]}
                  {key.includes('Randomness') ? '°' : ''}
                </Typography>
              </Box>
              <Slider
                size="small"
                min={isDecimal ? min * 100 : min}
                max={isDecimal ? max * 100 : max}
                value={isDecimal ? params[key] * 100 : params[key]}
                onChange={(_, value) => setParams({
                  ...params,
                  [key]: isDecimal ? value / 100 : value
                })}
                sx={{
                  color: '#dc2626',
                  py: 0,
                  '& .MuiSlider-thumb': {
                    width: 14,
                    height: 14,
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: 'none',
                    }
                  },
                  '& .MuiSlider-rail': {
                    opacity: 0.25,
                  }
                }}
              />
            </Box>
          ))}
        </Paper>
      </Grid>

      {/* Descent Parameters */}
      <Grid item xs={6}>
        <Paper 
          sx={{ 
            p: 1.5, 
            bgcolor: '#f0f7ff',
            '& .MuiTypography-root': { fontSize: '0.875rem' }
          }}
        >
          <Typography sx={{ color: '#2563eb', fontWeight: 500, mb: 0.5 }}>
            Gradient Descent
          </Typography>
          {[
            ['Step Size', 'dcStepSize', 20, 100],
            ['Base Angle', 'dcBaseAngle', 180, 270],
            ['Randomness', 'dcRandomness', 0, 90],
            ['Decay Rate', 'dcDecayRate', 0, 0.5, true]
          ].map(([label, key, min, max, isDecimal]) => (
            <Box key={key} sx={{ mb: 0.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                <Typography variant="caption">{label}</Typography>
                <Typography variant="caption">
                  {isDecimal ? params[key].toFixed(2) : params[key]}
                  {key.includes('Randomness') ? '°' : ''}
                </Typography>
              </Box>
              <Slider
                size="small"
                min={isDecimal ? min * 100 : min}
                max={isDecimal ? max * 100 : max}
                value={isDecimal ? params[key] * 100 : params[key]}
                onChange={(_, value) => setParams({
                  ...params,
                  [key]: isDecimal ? value / 100 : value
                })}
                sx={{
                  color: '#2563eb',
                  py: 0,
                  '& .MuiSlider-thumb': {
                    width: 14,
                    height: 14,
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: 'none',
                    }
                  },
                  '& .MuiSlider-rail': {
                    opacity: 0.25,
                  }
                }}
              />
            </Box>
          ))}
        </Paper>
      </Grid>
    </Grid>
  </Box>

  );
};

export default D3ACDCAnimation;