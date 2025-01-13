import React, { useState, useEffect } from 'react';
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import { RotateCw } from 'lucide-react';
import {
    Container,
    Typography,
    Button,
    Box,
    Stack,
    Link,
    IconButton,
    Paper,
    LinearProgress
} from '@mui/material';

const NetworkGraph = () => {
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [animationStep, setAnimationStep] = useState(0);
    const [tick, setTick] = useState(0);

    const colors = {
        background: '#FFFFFF',
        links: '#DEB887',
        normal: '#00416A',
        affected: '#CC9999',
        identified: '#990000',
        unidentified: '#682860'
    };

    const resetAnimation = () => {
        const resetNodes = nodes.map(node => ({
            ...node,
            status: 'clean',
            affectedLevel: 0
        }));
        setNodes(resetNodes);
        setAnimationStep(0);
    };

    useEffect(() => {
        const generateNetwork = () => {
            const newNodes = [];
            const newLinks = [];
            const minDistance = 25;

            

            const addNodeWithSpacing = (attempt = 0) => {

                
                if (attempt > 100) return false;

                const angle = Math.random() * 2 * Math.PI;
                const radius = 60 + Math.random() * 80;
                const x = 175 + radius * Math.cos(angle);
                const y = 150 + radius * Math.sin(angle);

                const tooClose = newNodes.some(node => {
                    const dx = node.x - x;
                    const dy = node.y - y;
                    return Math.sqrt(dx * dx + dy * dy) < minDistance;
                });

                if (!tooClose) {
                    newNodes.push({
                        id: newNodes.length,
                        x,
                        y,
                        status: 'clean',
                        affectedLevel: 0
                    });
                    return true;
                }

                return addNodeWithSpacing(attempt + 1);
            };

            for (let i = 0; i < 25; i++) {
                if (!addNodeWithSpacing()) break;
            }

            const visited = new Set([0]);
            const unvisited = new Set(Array.from({ length: newNodes.length }, (_, i) => i).slice(1));

            while (unvisited.size > 0) {
                let minDist = Infinity;
                let bestEdge = null;

                for (const v of visited) {
                    for (const u of unvisited) {
                        const dist = Math.sqrt(
                            Math.pow(newNodes[v].x - newNodes[u].x, 2) +
                            Math.pow(newNodes[v].y - newNodes[u].y, 2)
                        );
                        if (dist < minDist) {
                            minDist = dist;
                            bestEdge = [v, u];
                        }
                    }
                }

                if (bestEdge) {
                    newLinks.push({ source: bestEdge[0], target: bestEdge[1] });
                    visited.add(bestEdge[1]);
                    unvisited.delete(bestEdge[1]);
                }
            }

            for (let i = 0; i < newNodes.length; i++) {
                const distances = newNodes
                    .map((node, index) => ({
                        id: index,
                        distance: Math.sqrt(
                            Math.pow(newNodes[i].x - node.x, 2) +
                            Math.pow(newNodes[i].y - node.y, 2)
                        )
                    }))
                    .filter(n => n.id !== i)
                    .sort((a, b) => a.distance - b.distance)
                    .slice(0, 2);

                distances.forEach(({ id: targetId }) => {
                    if (!newLinks.some(link =>
                        (link.source === i && link.target === targetId) ||
                        (link.source === targetId && link.target === i)
                    )) {
                        newLinks.push({ source: i, target: targetId });
                    }
                });
            }

            setNodes(newNodes);
            setLinks(newLinks);
        };

        generateNetwork();
    }, []);

    useEffect(() => {
        const pulseInterval = setInterval(() => {
            setTick(prev => (prev + 1) % 60);
        }, 50);
        return () => clearInterval(pulseInterval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setNodes(prevNodes => {
                if (animationStep < 5) {
                    const newNodes = prevNodes.map(node => ({ ...node, affectedLevel: 0 }));
                    const targetIndices = [5, 8, 12, 15, 18];

                    targetIndices.forEach((index, i) => {
                        if (i <= animationStep && index < newNodes.length) {
                            newNodes[index].status = i < 2 ? 'identified' : 'unidentified';

                            links.forEach(link => {
                                if (link.source === index) {
                                    newNodes[link.target].affectedLevel = 1;
                                } else if (link.target === index) {
                                    newNodes[link.source].affectedLevel = 1;
                                }
                            });
                        }
                    });
                    return newNodes;
                }
                return prevNodes;
            });
            setAnimationStep(prev => (prev < 5 ? prev + 1 : prev));
        }, 1000);

        return () => clearInterval(interval);
    }, [animationStep, links]);

    const getPulseScale = (node) => {
        if (node.status === 'identified' || node.status === 'unidentified') {
            return 1 + 0.15 * Math.sin(tick * 0.2);
        }
        return 1;
    };

    const DevilNode = ({ x, y, status }) => (
        <g transform={`translate(${x - 12},${y - 12}) scale(0.07)`}>
            <path d="M125.104,131.159c0-56.923,46.143-103.068,103.075-103.068c56.918,0,103.075,46.145,103.075,103.068
        c0.006,56.933-46.151,103.078-103.069,103.078C171.247,234.237,125.104,188.092,125.104,131.159z"
                fill={status === 'identified' ? colors.identified : colors.unidentified} />
            <path d="M120.595,101.771c8.127-29.078,23.247-40.711,23.247-40.711c-26.903,8.394-43.028-50.008-43.028-50.008
        C72.907,64.551,120.595,101.771,120.595,101.771z"
                fill={status === 'identified' ? colors.identified : colors.unidentified} />
            <path d="M330.468,90.718c0,0,47.688-37.217,19.777-90.718c0,0-19.612,58.404-46.518,50.008
        C303.728,50.014,322.341,61.64,330.468,90.718z"
                fill={status === 'identified' ? colors.identified : colors.unidentified} />
        </g>
    );

    return (
        <div className="relative"

            // make the margin on top 0
            sx={{
                mt: 0
            }}


        >
            <Button
                variant="outline"
                size="icon"
                onClick={resetAnimation}
            >
                <ReplayCircleFilledIcon />
            </Button>

            <svg
                viewBox="0 0 350 300"  // We can keep this ratio but make sure content uses full width
                width="100%"
                height="auto"
                preserveAspectRatio="xMidYMid meet"  // This helps center the content
                style={{
                    display: 'block',
                    width: '100%',  // Ensure it takes full width
                }}
            >


                {links.map((link, i) => (
                    <line
                        key={`link-${i}`}
                        x1={nodes[link.source]?.x}
                        y1={nodes[link.source]?.y}
                        x2={nodes[link.target]?.x}
                        y2={nodes[link.target]?.y}
                        stroke={colors.links}
                        strokeWidth={1.5}
                    />
                ))}

                {nodes.map((node, i) =>
                    node.status === 'clean' ? (
                        <circle
                            key={`node-${i}`}
                            cx={node.x}
                            cy={node.y}
                            r={6}
                            fill={node.affectedLevel > 0 ? colors.affected : colors.normal}
                            className="transition-colors duration-500"
                        />
                    ) : (
                        <g
                            key={`devil-${i}`}
                            className="transition-transform duration-500"
                            style={{
                                transformOrigin: `${node.x}px ${node.y}px`,
                                transform: `scale(${getPulseScale(node)})`
                            }}
                        >
                            <DevilNode x={node.x} y={node.y} status={node.status} />
                        </g>
                    )
                )}
            </svg>

            <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Legend</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 12, height: 12, backgroundColor: colors.normal, mr: 1 }} />
                        <Typography variant="body2">Normal</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 12, height: 12, backgroundColor: colors.affected, mr: 1 }} />
                        <Typography variant="body2">Affected</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 12, height: 12, backgroundColor: colors.identified, mr: 1 }} />
                        <Typography variant="body2">Identified</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 12, height: 12, backgroundColor: colors.unidentified, mr: 1 }} />
                        <Typography variant="body2">Unidentified</Typography>
                    </Box>
                </Stack>
            </Box>
        </div>
    );
};

export default NetworkGraph;