import React from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { HarmonicBlock } from "../types";

interface HarmonicPathVisualizationProps {
  mixBlocks: HarmonicBlock[];
  showHarmonicPath: boolean;
}

const HarmonicPathVisualization: React.FC<HarmonicPathVisualizationProps> = ({
  mixBlocks,
  showHarmonicPath,
}) => {
  if (!showHarmonicPath || mixBlocks.length === 0) return null;

  return (
    <div className="mt-4 border rounded-lg p-4 bg-muted/10">
      <h3 className="text-sm font-medium mb-2">Harmonic Path</h3>
      <div className="flex flex-wrap gap-2">
        {mixBlocks.flatMap((block, blockIndex) => {
          return block.keyPattern.map((key, keyIndex) => {
            const isLast =
              blockIndex === mixBlocks.length - 1 &&
              keyIndex === block.keyPattern.length - 1;
            return (
              <React.Fragment key={`${block.id}-${keyIndex}`}>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1"
                  style={{
                    borderColor: block.color,
                    backgroundColor: `${block.color}20`,
                  }}
                >
                  {key}
                </Badge>
                {!isLast && (
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                )}
              </React.Fragment>
            );
          });
        })}
      </div>
    </div>
  );
};

export default HarmonicPathVisualization;
