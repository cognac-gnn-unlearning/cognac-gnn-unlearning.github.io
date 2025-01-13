import React, { useState, useEffect, useCallback } from 'react';
import { RotateCw } from 'lucide-react';
import { Box, Typography, Stack } from '@mui/material';
import { Button } from '@mui/material';
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';

const SimpleMovement = () => {
    const [nodes, setNodes] = useState([]);
    const [isAnimating, setIsAnimating] = useState(true);
    const [animationProgress, setAnimationProgress] = useState(0);

    const colors = {
        devil: '#990000',    // Red devils
        affected: '#FF69B4', // Pink affected nodes
        positive: '#00416A'  // Blue positive class
    };

    // Updated grid configuration for more compact layout
    const GRID = {
        cellSize: 12,    // Reduced cell size
        width: 20,       // Reduced grid width
        height: 16,      // Reduced grid height
        offsetX: 30,     // Reduced offset
        offsetY: 30      // Reduced offset
    };

    // Convert grid coordinates to screen coordinates
    const gridToScreen = (gridX, gridY) => ({
        x: gridX * GRID.cellSize + GRID.offsetX,
        y: gridY * GRID.cellSize + GRID.offsetY
    });

    // Updated cluster centers for compact layout
    const CLUSTERS = {
        devils: { x: 4, y: 8 },
        affected: { x: 6, y: 8 },
        positive: { x: 14, y: 8 }
    };

    // Initialize nodes with grid-based positioning
    const initializeNodes = useCallback(() => {
        const nodes = [];
        const occupiedCells = new Set();

        // Helper to find available cell near target with tighter clustering
        const findAvailableCell = (targetX, targetY, radius = 1.2) => {
            const cells = [];
            for (let r = 0; r <= radius; r += 0.4) {
                for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / 4) {
                    const dx = Math.round(r * Math.cos(theta));
                    const dy = Math.round(r * Math.sin(theta));
                    const x = targetX + dx;
                    const y = targetY + dy;
                    const key = `${x},${y}`;
                    if (!occupiedCells.has(key)) {
                        cells.push({
                            x,
                            y,
                            dist: dx * dx + dy * dy
                        });
                    }
                }
            }
            cells.sort((a, b) => a.dist - b.dist);
            return cells[0] || { x: targetX + (Math.random() - 0.5), y: targetY + (Math.random() - 0.5) };
        };

        // Create devil nodes
        for (let i = 0; i < 3; i++) {
            const cell = findAvailableCell(CLUSTERS.devils.x, CLUSTERS.devils.y);
            const pos = gridToScreen(cell.x, cell.y);
            occupiedCells.add(`${cell.x},${cell.y}`);

            nodes.push({
                id: `devil-${i}`,
                x: pos.x,
                y: pos.y,
                gridX: cell.x,
                gridY: cell.y,
                type: 'devil',
                color: colors.devil
            });
        }

        // Create positive nodes
        for (let i = 0; i < 5; i++) {
            const cell = findAvailableCell(CLUSTERS.positive.x, CLUSTERS.positive.y);
            const pos = gridToScreen(cell.x, cell.y);
            occupiedCells.add(`${cell.x},${cell.y}`);

            nodes.push({
                id: `positive-${i}`,
                x: pos.x,
                y: pos.y,
                gridX: cell.x,
                gridY: cell.y,
                type: 'positive',
                color: colors.positive
            });
        }

        // Create affected nodes
        for (let i = 0; i < 6; i++) {
            const startCell = findAvailableCell(CLUSTERS.affected.x, CLUSTERS.affected.y);
            const targetCell = findAvailableCell(CLUSTERS.positive.x, CLUSTERS.positive.y);

            const startPos = gridToScreen(startCell.x, startCell.y);
            const targetPos = gridToScreen(targetCell.x, targetCell.y);

            occupiedCells.add(`${startCell.x},${startCell.y}`);

            nodes.push({
                id: `affected-${i}`,
                x: startPos.x,
                y: startPos.y,
                gridX: startCell.x,
                gridY: startCell.y,
                targetGridX: targetCell.x,
                targetGridY: targetCell.y,
                type: 'affected',
                color: colors.affected,
                startPos,
                targetPos
            });
        }

        return nodes;
    }, []);

    useEffect(() => {
        setNodes(initializeNodes());
    }, [initializeNodes]);

    // Get position for a node during animation
    const getNodePosition = (node) => {
        const nodeIndex = parseInt(node.id.split('-')[1]);
        const steps = 8;
        const discreteProgress = Math.floor(animationProgress * steps) / steps;

        if (node.type === 'devil') {
            const repulsionStrength = discreteProgress * 1.5;  // Reduced movement
            const moveAwayX = -repulsionStrength * GRID.cellSize;
            const noiseY = Math.sin(discreteProgress * Math.PI * 2 + nodeIndex) * GRID.cellSize * 0.2;
            return {
                x: node.x + moveAwayX,
                y: node.y + noiseY
            };
        } else if (node.type === 'positive') {
            const adjustmentPhase = Math.sin(discreteProgress * Math.PI * 2);
            const adjustX = adjustmentPhase * GRID.cellSize * 0.2;
            const adjustY = Math.cos(discreteProgress * Math.PI * 2 + nodeIndex) * GRID.cellSize * 0.15;
            return {
                x: node.x + adjustX,
                y: node.y + adjustY
            };
        } else {
            const nodeProgress = Math.max(0, Math.min(1,
                discreteProgress - (nodeIndex * 0.15)
            ));

            const lerpGridPos = (start, end, progress) => start + (end - start) * progress;
            const currentGridX = lerpGridPos(node.gridX, node.targetGridX, nodeProgress);
            const currentGridY = lerpGridPos(node.gridY, node.targetGridY, nodeProgress);

            const { x, y } = gridToScreen(currentGridX, currentGridY);

            const cellNoise = 1.5;  // Reduced noise
            const noiseX = Math.sin(nodeProgress * Math.PI * 2 + nodeIndex) * cellNoise;
            const noiseY = Math.cos(nodeProgress * Math.PI * 2 + nodeIndex) * cellNoise;

            return {
                x: x + noiseX,
                y: y + noiseY
            };
        }
    };

    // Animation loop
    useEffect(() => {
        if (!isAnimating) return;

        let startTime;
        const duration = 3000;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            setAnimationProgress(progress);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setIsAnimating(false);
            }
        };

        requestAnimationFrame(animate);

        return () => {
            startTime = null;
        };
    }, [isAnimating]);

    // Color functions
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        };
    };

    const rgbToHex = ({ r, g, b }) => {
        return '#' + [r, g, b].map(x => {
            const hex = Math.round(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    };

    const interpolateColor = (c1, c2, factor) => {
        return {
            r: c1.r + (c2.r - c1.r) * factor,
            g: c1.g + (c2.g - c1.g) * factor,
            b: c1.b + (c2.b - c1.b) * factor
        };
    };

    const getNodeColor = (node) => {
        if (node.type !== 'affected') return node.color;

        const startColor = hexToRgb(colors.affected);
        const endColor = hexToRgb(colors.positive);
        const currentColor = interpolateColor(startColor, endColor, animationProgress);
        return rgbToHex(currentColor);
    };

    const renderGrid = () => {
        const lines = [];
        for (let x = 0; x <= GRID.width; x++) {
            const pos = gridToScreen(x, 0);
            lines.push(
                <line
                    key={`v${x}`}
                    x1={pos.x}
                    y1={GRID.offsetY}
                    x2={pos.x}
                    y2={GRID.offsetY + GRID.height * GRID.cellSize}
                    stroke="#ddd"
                    strokeWidth="0.5"
                    strokeDasharray="2,2"
                />
            );
        }
        for (let y = 0; y <= GRID.height; y++) {
            const pos = gridToScreen(0, y);
            lines.push(
                <line
                    key={`h${y}`}
                    x1={GRID.offsetX}
                    y1={pos.y}
                    x2={GRID.offsetX + GRID.width * GRID.cellSize}
                    y2={pos.y}
                    stroke="#ddd"
                    strokeWidth="0.5"
                    strokeDasharray="2,2"
                />
            );
        }
        return lines;
    };

    const DevilNode = ({ size = 20 }) => (
        <g transform={`translate(${-size / 2},${-size / 2}) scale(${size / 350})`}>
            <path d="M125.104,131.159c0-56.923,46.143-103.068,103.075-103.068c56.918,0,103.075,46.145,103.075,103.068
                c0.006,56.933-46.151,103.078-103.069,103.078C171.247,234.237,125.104,188.092,125.104,131.159z"
                fill={colors.devil} />
            <path d="M120.595,101.771c8.127-29.078,23.247-40.711,23.247-40.711c-26.903,8.394-43.028-50.008-43.028-50.008
                C72.907,64.551,120.595,101.771,120.595,101.771z"
                fill={colors.devil} />
            <path d="M330.468,90.718c0,0,47.688-37.217,19.777-90.718c0,0-19.612,58.404-46.518,50.008
                C303.728,50.014,322.341,61.64,330.468,90.718z"
                fill={colors.devil} />
        </g>
    );

    return (
        <div className="relative w-full">
            <Button
                variant="outline"
                size="icon"
                onClick={() => {
                    setAnimationProgress(0);
                    setNodes(initializeNodes());
                    setIsAnimating(true);
                }}
                startIcon={<ReplayCircleFilledIcon />}
                sx={{ position: 'absolute', top: 8, right: 8 }}
            >
            </Button>

            <svg
                viewBox={`0 0 ${GRID.offsetX * 2 + GRID.width * GRID.cellSize} ${GRID.offsetY * 2 + GRID.height * GRID.cellSize}`}
                className="w-full h-64"
                preserveAspectRatio="xMidYMid meet"
                style={{ background: '#FFFFFF' }}
            >
                {renderGrid()}

                {nodes.map((node) => {
                    const pos = getNodePosition(node);
                    return node.type === 'devil' ? (
                        <g
                            key={node.id}
                            transform={`translate(${pos.x},${pos.y})`}
                        >
                            <DevilNode size={16} />
                        </g>
                    ) : (
                        <circle
                            key={node.id}
                            cx={pos.x}
                            cy={pos.y}
                            r={4}
                            fill={getNodeColor(node)}
                            fillOpacity="0.7"
                            stroke={getNodeColor(node)}
                            strokeWidth="1.5"
                        />
                    );
                })}
            </svg>

            <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Legend
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ width: 12, height: 12, backgroundColor: colors.devil, borderRadius: '50%' }} />
                        <Typography variant="body2">Malicious</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ width: 12, height: 12, backgroundColor: colors.affected, borderRadius: '50%' }} />
                        <Typography variant="body2">Affected</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ width: 12, height: 12, backgroundColor: colors.positive, borderRadius: '50%' }} />
                        <Typography variant="body2">Safe</Typography>
                    </Stack>
                </Stack>
            </Box>
        </div>
    );
};

export default SimpleMovement;