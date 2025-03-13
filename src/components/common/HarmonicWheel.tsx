import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HarmonicWheelProps {
  selectedKey?: string;
  onKeySelect?: (key: string) => void;
  size?: number;
  highlightCompatible?: boolean;
}

const CAMELOT_WHEEL = [
  { position: 1, major: "8B", minor: "8A" },
  { position: 2, major: "3B", minor: "3A" },
  { position: 3, major: "10B", minor: "10A" },
  { position: 4, major: "5B", minor: "5A" },
  { position: 5, major: "12B", minor: "12A" },
  { position: 6, major: "7B", minor: "7A" },
  { position: 7, major: "2B", minor: "2A" },
  { position: 8, major: "9B", minor: "9A" },
  { position: 9, major: "4B", minor: "4A" },
  { position: 10, major: "11B", minor: "11A" },
  { position: 11, major: "6B", minor: "6A" },
  { position: 12, major: "1B", minor: "1A" },
];

// Map Camelot notation to traditional musical keys
const CAMELOT_TO_MUSICAL_KEY = {
  "1A": "Ab min",
  "1B": "B maj",
  "2A": "Eb min",
  "2B": "Gb maj",
  "3A": "Bb min",
  "3B": "Db maj",
  "4A": "F min",
  "4B": "Ab maj",
  "5A": "C min",
  "5B": "Eb maj",
  "6A": "G min",
  "6B": "Bb maj",
  "7A": "D min",
  "7B": "F maj",
  "8A": "A min",
  "8B": "C maj",
  "9A": "E min",
  "9B": "G maj",
  "10A": "B min",
  "10B": "D maj",
  "11A": "Gb min",
  "11B": "A maj",
  "12A": "Db min",
  "12B": "E maj",
};

const HarmonicWheel = ({
  selectedKey = "8B", // Default to C major
  onKeySelect = () => {},
  size = 300,
  highlightCompatible = true,
}: HarmonicWheelProps) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  // Calculate center and radius
  const center = size / 2;
  const outerRadius = center - 10;
  const innerRadius = outerRadius - 40;

  // Function to determine if a key is compatible with the selected key
  const isCompatibleKey = (key: string) => {
    if (!highlightCompatible || !selectedKey) return false;

    // Extract the number and letter from the key (e.g., "8B" -> 8, "B")
    const selectedNum = parseInt(selectedKey.match(/\d+/)?.[0] || "0");
    const selectedLetter = selectedKey.slice(-1);

    const keyNum = parseInt(key.match(/\d+/)?.[0] || "0");
    const keyLetter = key.slice(-1);

    // Perfect match (same key)
    if (key === selectedKey) return true;

    // Same letter (both major or both minor)
    if (keyLetter === selectedLetter) {
      // Adjacent keys (e.g., 8B and 9B) - "neighbor" keys
      if (
        Math.abs(keyNum - selectedNum) === 1 ||
        Math.abs(keyNum - selectedNum) === 11
      )
        return true;

      // Keys separated by 7 semitones (e.g., 8B and 3B) - "dominant" keys
      if (
        Math.abs(keyNum - selectedNum) === 7 ||
        Math.abs(keyNum - selectedNum) === 5
      )
        return true;
    }

    // Relative major/minor (e.g., 8B and 8A)
    if (
      key.slice(0, -1) === selectedKey.slice(0, -1) &&
      key.slice(-1) !== selectedKey.slice(-1)
    )
      return true;

    return false;
  };

  // Function to get the color for a key segment
  const getKeyColor = (key: string) => {
    if (key === selectedKey) return "bg-blue-500";
    if (key === hoveredKey) return "bg-blue-300";
    if (isCompatibleKey(key)) return "bg-green-400";
    return "bg-gray-200";
  };

  // Calculate positions for each key on the wheel
  const getKeyPosition = (position: number, isInner: boolean) => {
    const radius = isInner ? innerRadius : outerRadius;
    const angle = (position - 1) * 30 * (Math.PI / 180);
    const x = center + radius * Math.sin(angle);
    const y = center - radius * Math.cos(angle);
    return { x, y };
  };

  return (
    <div
      className="relative bg-white rounded-full shadow-md"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Outer ring (major keys) */}
        {CAMELOT_WHEEL.map((item) => {
          const startAngle = (item.position - 1) * 30 * (Math.PI / 180);
          const endAngle = item.position * 30 * (Math.PI / 180);

          const x1 = center + outerRadius * Math.sin(startAngle);
          const y1 = center - outerRadius * Math.cos(startAngle);
          const x2 = center + outerRadius * Math.sin(endAngle);
          const y2 = center - outerRadius * Math.cos(endAngle);

          const largeArcFlag = 0; // 0 for arcs less than 180 degrees

          // Path for the outer arc
          const path = [
            `M ${center} ${center}`,
            `L ${x1} ${y1}`,
            `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            "Z",
          ].join(" ");

          return (
            <g key={`major-${item.position}`}>
              <path
                d={path}
                className={cn(
                  "cursor-pointer transition-colors duration-200",
                  getKeyColor(item.major),
                )}
                onClick={() => onKeySelect(item.major)}
                onMouseEnter={() => setHoveredKey(item.major)}
                onMouseLeave={() => setHoveredKey(null)}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <text
                      x={
                        center +
                        (outerRadius - 20) * Math.sin(startAngle + Math.PI / 12)
                      }
                      y={
                        center -
                        (outerRadius - 20) * Math.cos(startAngle + Math.PI / 12)
                      }
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-bold cursor-pointer"
                      onClick={() => onKeySelect(item.major)}
                    >
                      {item.major}
                    </text>
                  </TooltipTrigger>
                  <TooltipContent>
                    {
                      CAMELOT_TO_MUSICAL_KEY[
                        item.major as keyof typeof CAMELOT_TO_MUSICAL_KEY
                      ]
                    }
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </g>
          );
        })}

        {/* Inner ring (minor keys) */}
        {CAMELOT_WHEEL.map((item) => {
          const startAngle = (item.position - 1) * 30 * (Math.PI / 180);
          const endAngle = item.position * 30 * (Math.PI / 180);

          const x1 = center + innerRadius * Math.sin(startAngle);
          const y1 = center - innerRadius * Math.cos(startAngle);
          const x2 = center + innerRadius * Math.sin(endAngle);
          const y2 = center - innerRadius * Math.cos(endAngle);

          const largeArcFlag = 0; // 0 for arcs less than 180 degrees

          // Path for the inner arc
          const path = [
            `M ${center} ${center}`,
            `L ${x1} ${y1}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            "Z",
          ].join(" ");

          return (
            <g key={`minor-${item.position}`}>
              <path
                d={path}
                className={cn(
                  "cursor-pointer transition-colors duration-200",
                  getKeyColor(item.minor),
                )}
                onClick={() => onKeySelect(item.minor)}
                onMouseEnter={() => setHoveredKey(item.minor)}
                onMouseLeave={() => setHoveredKey(null)}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <text
                      x={
                        center +
                        (innerRadius - 20) * Math.sin(startAngle + Math.PI / 12)
                      }
                      y={
                        center -
                        (innerRadius - 20) * Math.cos(startAngle + Math.PI / 12)
                      }
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-bold cursor-pointer"
                      onClick={() => onKeySelect(item.minor)}
                    >
                      {item.minor}
                    </text>
                  </TooltipTrigger>
                  <TooltipContent>
                    {
                      CAMELOT_TO_MUSICAL_KEY[
                        item.minor as keyof typeof CAMELOT_TO_MUSICAL_KEY
                      ]
                    }
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </g>
          );
        })}

        {/* Center circle */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius - 20}
          className="fill-white stroke-gray-300"
        />
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm font-semibold"
        >
          Camelot Wheel
        </text>
        {selectedKey && (
          <text
            x={center}
            y={center + 20}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs text-blue-500 font-bold"
          >
            Selected: {selectedKey} (
            {
              CAMELOT_TO_MUSICAL_KEY[
                selectedKey as keyof typeof CAMELOT_TO_MUSICAL_KEY
              ]
            }
            )
          </text>
        )}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-3 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
          <span>Selected</span>
        </div>
        {highlightCompatible && (
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-1"></div>
            <span>Compatible</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HarmonicWheel;
