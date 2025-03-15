import React from "react";
import { HarmonicBlock } from "../types";

interface EnergyCurveVisualizationProps {
  mixBlocks: HarmonicBlock[];
  showEnergyCurve: boolean;
}

const EnergyCurveVisualization: React.FC<EnergyCurveVisualizationProps> = ({
  mixBlocks,
  showEnergyCurve,
}) => {
  if (!showEnergyCurve || mixBlocks.length === 0) return null;

  // Calculate total duration for scaling
  const totalDuration = mixBlocks.reduce(
    (sum, block) => sum + block.duration,
    0,
  );

  // Generate points for the energy curve
  const generatePoints = () => {
    let points = [];
    let currentX = 0;

    for (const block of mixBlocks) {
      const blockWidth = (block.duration / totalDuration) * 1000;
      const segmentWidth = blockWidth / block.energyProfile.length;

      for (let i = 0; i < block.energyProfile.length; i++) {
        const x = currentX + i * segmentWidth;
        const y = 100 - block.energyProfile[i]; // Invert Y since SVG 0 is at top
        points.push(`${x},${y}`);
      }

      currentX += blockWidth;
    }

    return points.join(" ");
  };

  return (
    <div className="mt-4 border rounded-lg p-4 bg-muted/10">
      <h3 className="text-sm font-medium mb-2">Energy Curve</h3>
      <div className="h-24 bg-muted/20 rounded-md relative">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
        >
          {/* Background grid lines */}
          <line
            x1="0"
            y1="25"
            x2="1000"
            y2="25"
            stroke="#e2e8f0"
            strokeWidth="1"
            strokeDasharray="4"
          />
          <line
            x1="0"
            y1="50"
            x2="1000"
            y2="50"
            stroke="#e2e8f0"
            strokeWidth="1"
            strokeDasharray="4"
          />
          <line
            x1="0"
            y1="75"
            x2="1000"
            y2="75"
            stroke="#e2e8f0"
            strokeWidth="1"
            strokeDasharray="4"
          />

          {/* Energy curve */}
          <polyline
            points={generatePoints()}
            stroke="#3b82f6"
            strokeWidth="2"
            fill="none"
          />

          {/* Fill under the curve with gradient */}
          <linearGradient id="energyGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
          </linearGradient>
          <polygon
            points={`0,100 ${generatePoints()} 1000,100`}
            fill="url(#energyGradient)"
          />

          {/* Block markers */}
          {mixBlocks.map((block, index) => {
            // Calculate block position
            const prevBlocksDuration = mixBlocks
              .slice(0, index)
              .reduce((sum, b) => sum + b.duration, 0);
            const x = (prevBlocksDuration / totalDuration) * 1000;
            const width = (block.duration / totalDuration) * 1000;

            return (
              <React.Fragment key={block.id}>
                {/* Block separator line */}
                {index > 0 && (
                  <line
                    x1={x}
                    y1="0"
                    x2={x}
                    y2="100"
                    stroke="#64748b"
                    strokeWidth="1"
                    strokeDasharray="4"
                  />
                )}

                {/* Block label */}
                <text
                  x={x + width / 2}
                  y="15"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#64748b"
                >
                  {block.code}
                </text>

                {/* Block highlight area */}
                <rect
                  x={x}
                  y="0"
                  width={width}
                  height="100"
                  fill={`${block.color}10`}
                  stroke="none"
                />
              </React.Fragment>
            );
          })}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-xs text-muted-foreground p-1">
          <span>100%</span>
          <span>50%</span>
          <span>0%</span>
        </div>
      </div>
    </div>
  );
};

export default EnergyCurveVisualization;
