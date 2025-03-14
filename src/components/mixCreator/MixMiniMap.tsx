import React, { useState } from "react";
import { ChevronUp, ChevronDown, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface Track {
  id: string;
  title: string;
  artist: string;
  key: string;
  bpm: number;
  color?: string;
  waveform?: string;
}

interface MixMiniMapProps {
  tracks: Track[];
  onTrackMove: (sourceIndex: number, destinationIndex: number) => void;
  selectedTrackId?: string | null;
  onTrackSelect?: (trackId: string) => void;
}

const MixMiniMap: React.FC<MixMiniMapProps> = ({
  tracks = [],
  onTrackMove,
  selectedTrackId = null,
  onTrackSelect = () => {},
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    onTrackMove(sourceIndex, destinationIndex);
  };

  return (
    <div className="bg-card border rounded-lg shadow-sm overflow-hidden transition-all duration-300">
      <div className="flex items-center justify-between p-2 bg-muted/50 border-b">
        <h3 className="text-sm font-medium">Mix Overview</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="p-2">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="mini-map-tracks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-1"
                >
                  {tracks.map((track, index) => (
                    <Draggable
                      key={track.id}
                      draggableId={track.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`flex items-center p-1.5 rounded-md cursor-pointer transition-colors ${selectedTrackId === track.id ? "bg-primary/10 border border-primary/30" : "hover:bg-accent/50"}`}
                          style={{
                            ...provided.draggableProps.style,
                            borderLeft: `3px solid ${track.color || "#4f46e5"}`,
                          }}
                          onClick={() => onTrackSelect(track.id)}
                        >
                          <div className="w-5 h-5 rounded-sm overflow-hidden mr-2 flex-shrink-0">
                            {track.waveform ? (
                              <img
                                src={track.waveform}
                                alt={track.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Music className="h-3 w-3 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">
                              {index + 1}. {track.title}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="ml-1 text-[10px] px-1 h-4"
                          >
                            {track.key}
                          </Badge>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {tracks.length === 0 && (
            <div className="text-center py-2 text-xs text-muted-foreground">
              No tracks in mix
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MixMiniMap;
