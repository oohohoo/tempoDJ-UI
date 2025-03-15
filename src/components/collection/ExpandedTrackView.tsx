import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Slider } from "../ui/slider";
import { Badge } from "../ui/badge";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RefreshCw,
  Save,
  X,
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
  waveform?: string;
  folder?: string;
}

interface ExpandedTrackViewProps {
  track: Track;
  onClose: () => void;
}

const ExpandedTrackView: React.FC<ExpandedTrackViewProps> = ({
  track,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(50);
  const [comments, setComments] = useState("");
  const [currentPosition, setCurrentPosition] = useState(0);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };

  // Simulate sections of the track
  const sections = [
    { start: 0, end: 20, type: "intro", color: "rgba(74, 222, 128, 0.2)" },
    { start: 20, end: 50, type: "verse", color: "rgba(59, 130, 246, 0.2)" },
    { start: 50, end: 70, type: "chorus", color: "rgba(239, 68, 68, 0.2)" },
    { start: 70, end: 90, type: "verse", color: "rgba(59, 130, 246, 0.2)" },
    { start: 90, end: 100, type: "outro", color: "rgba(74, 222, 128, 0.2)" },
  ];

  return (
    <div className="mt-2 mb-6 p-6 bg-white border rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">
          {track.title} - {track.artist}
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Waveform and controls */}
        <div className="flex-1">
          <div
            className="relative h-32 bg-gray-100 rounded-md mb-4 overflow-hidden"
            style={{
              backgroundImage: `url(${track.waveform})`,
              backgroundSize: `${zoom * 2}% 100%`,
              backgroundPosition: "center",
            }}
          >
            {/* Beatgrid overlay */}
            <div className="absolute inset-0 flex">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 border-l border-gray-400 last:border-r"
                  style={{
                    borderWidth: i % 4 === 0 ? "2px" : "1px",
                    opacity: i % 4 === 0 ? 0.5 : 0.3,
                  }}
                />
              ))}
            </div>

            {/* Sections overlay */}
            <div className="absolute inset-0">
              {sections.map((section, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0"
                  style={{
                    left: `${section.start}%`,
                    width: `${section.end - section.start}%`,
                    backgroundColor: section.color,
                  }}
                >
                  <div className="text-xs font-medium p-1">{section.type}</div>
                </div>
              ))}
            </div>

            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
              style={{ left: `${currentPosition}%` }}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={togglePlayback}>
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" size="icon">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm">Zoom:</span>
              <Slider
                value={[zoom]}
                min={10}
                max={100}
                step={1}
                className="w-32"
                onValueChange={handleZoomChange}
              />
            </div>
          </div>
        </div>

        {/* Metadata panel */}
        <div className="w-full lg:w-64 space-y-4 p-4 bg-gray-50 rounded-md">
          <div>
            <h4 className="text-sm font-medium mb-1">Track Info</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Key</p>
                <p className="font-medium">{track.key}</p>
              </div>
              <div>
                <p className="text-muted-foreground">BPM</p>
                <p className="font-medium">{track.bpm}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="font-medium">{track.duration}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Energy</p>
                <p className="font-medium">{track.energy || "-"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Genre</p>
                <p className="font-medium">{track.genre || "-"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Added</p>
                <p className="font-medium">
                  {new Date(track.dateAdded).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">Comments</h4>
            <Textarea
              placeholder="Add notes about this track..."
              className="h-24"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" /> Reanalyze
            </Button>
            <Button size="sm">
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedTrackView;
