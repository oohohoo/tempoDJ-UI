import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Music, Plus, Settings } from "lucide-react";
import { HarmonicBlock, Track } from "../types";

interface DetailsPanelProps {
  selectedBlockId: string | null;
  selectedPositionId: string | null;
  mixBlocks: HarmonicBlock[];
  trackRecommendations: Track[];
  assignTrackToPosition: (trackId: string) => void;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({
  selectedBlockId,
  selectedPositionId,
  mixBlocks,
  trackRecommendations,
  assignTrackToPosition,
}) => {
  const selectedBlock = selectedBlockId
    ? mixBlocks.find((b) => b.id === selectedBlockId)
    : null;
  const selectedPosition =
    selectedBlock && selectedPositionId
      ? selectedBlock.trackPositions.find((p) => p.id === selectedPositionId)
      : null;

  if (
    !selectedBlockId ||
    !selectedPositionId ||
    !selectedBlock ||
    !selectedPosition
  ) {
    return (
      <div className="w-72 border-l bg-muted/20 p-4 flex flex-col">
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <Settings className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Block Details</h3>
          <p className="text-sm text-muted-foreground">
            Select a block or track position to see details and recommendations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 border-l bg-muted/20 p-4 flex flex-col">
      <div>
        <h3 className="font-medium mb-2">Track Position Details</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">Block</p>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center text-white font-medium text-sm"
                style={{
                  backgroundColor: selectedBlock.color,
                }}
              >
                {selectedBlock.code}
              </div>
              <span className="text-sm">{selectedBlock.name}</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Position</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{selectedPosition.key}</Badge>
              <span className="text-sm">
                Energy: {selectedPosition.energy}%
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium">Track Recommendations</p>
              <Badge variant="outline" className="text-xs">
                {trackRecommendations.length} tracks
              </Badge>
            </div>

            <ScrollArea className="h-[300px] border rounded-md bg-card">
              <div className="p-2 space-y-2">
                {trackRecommendations.length > 0 ? (
                  trackRecommendations.map((track) => (
                    <Card
                      key={track.id}
                      className="cursor-pointer hover:bg-accent/50"
                      onClick={() => assignTrackToPosition(track.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center text-white font-medium text-sm"
                            style={{
                              backgroundColor: track.color || "#64748b",
                            }}
                          >
                            <Music className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{track.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {track.artist}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="text-xs">
                            {track.key}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {track.bpm} BPM
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {track.energy}% Energy
                          </Badge>
                        </div>
                        {track.tags && track.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {track.tags.map((tag, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No compatible tracks found for this position.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="mr-1 h-3 w-3" />
                      Add Track
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="flex justify-end">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Assign Track
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPanel;
