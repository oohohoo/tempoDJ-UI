import React from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import {
  Music,
  Play,
  Download,
  RefreshCw,
  Eraser,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  key: string;
  bpm: number;
  duration: string;
  dateAdded: string;
  genre?: string;
  energy?: number;
  analyzed?: boolean;
  imageUrl?: string;
  folder?: string;
}

interface TrackListProps {
  tracks: Track[];
  selectedTracks: string[];
  expandedTrackId: string | null;
  onTrackSelect: (track: Track) => void;
  onTrackPlay: (track: Track) => void;
  onTrackDownload: (track: Track) => void;
  onTrackAnalyze: (track: Track) => void;
  onCheckboxChange: (trackId: string) => void;
  onSelectAll: () => void;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks = [],
  selectedTracks = [],
  expandedTrackId = null,
  onTrackSelect = () => {},
  onTrackPlay = () => {},
  onTrackDownload = () => {},
  onTrackAnalyze = () => {},
  onCheckboxChange = () => {},
  onSelectAll = () => {},
}) => {
  const isAllSelected =
    tracks.length > 0 && selectedTracks.length === tracks.length;

  return (
    <div className="w-full bg-background rounded-md border">
      <div className="grid grid-cols-[auto_auto_1fr_auto_auto_auto_auto_auto_auto] gap-4 p-4 font-medium border-b">
        <div className="flex items-center">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={onSelectAll}
            id="select-all"
          />
        </div>
        <div className="w-12"></div>
        <div>Track</div>
        <div>Key</div>
        <div>BPM</div>
        <div>Genre</div>
        <div>Energy</div>
        <div>Duration</div>
        <div>Actions</div>
      </div>
      <div className="divide-y">
        {tracks.map((track) => (
          <React.Fragment key={track.id}>
            <div
              className={`grid grid-cols-[auto_auto_1fr_auto_auto_auto_auto_auto_auto] gap-4 p-4 items-center hover:bg-accent/50 cursor-pointer ${expandedTrackId === track.id ? "bg-accent/50" : ""}`}
              onClick={() => onTrackSelect(track)}
            >
              <div
                className="flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={selectedTracks.includes(track.id)}
                  onCheckedChange={() => onCheckboxChange(track.id)}
                  id={`track-${track.id}`}
                />
              </div>
              <div className="w-12 h-12 rounded-md overflow-hidden aspect-square">
                {track.imageUrl ? (
                  <img
                    src={track.imageUrl}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-accent flex items-center justify-center">
                    <Music className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <div className="font-medium">{track.title}</div>
                <div className="text-sm text-muted-foreground">
                  {track.artist}
                </div>
                {track.folder && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Folder: {track.folder}
                  </div>
                )}
              </div>
              <div className="text-center">{track.key}</div>
              <div className="text-center">{track.bpm}</div>
              <div className="text-center">{track.genre || "-"}</div>
              <div className="text-center">
                {track.energy ? (
                  <div className="flex items-center justify-center">
                    <span className="mr-1">{track.energy}</span>
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          track.energy <= 3
                            ? "#4ade80"
                            : track.energy <= 7
                              ? "#facc15"
                              : "#ef4444",
                      }}
                    />
                  </div>
                ) : (
                  "-"
                )}
              </div>
              <div className="text-center">{track.duration}</div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTrackPlay(track);
                  }}
                  title="Play"
                >
                  <Play className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTrackDownload(track);
                  }}
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTrackAnalyze(track);
                  }}
                  title={track.analyzed ? "Reanalyze" : "Analyze"}
                >
                  {!track.analyzed ? (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
                {expandedTrackId === track.id ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTrackSelect(track);
                    }}
                    title="Collapse"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTrackSelect(track);
                    }}
                    title="Expand"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TrackList;
