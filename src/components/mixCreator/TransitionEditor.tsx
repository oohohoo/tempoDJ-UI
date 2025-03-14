import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Save,
  Volume2,
  VolumeX,
  Music,
  Waveform,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface TransitionEditorProps {
  currentTrack?: {
    id: string;
    title: string;
    artist: string;
    waveform?: string;
  };
  nextTrack?: {
    id: string;
    title: string;
    artist: string;
    waveform?: string;
  };
  transitionDuration?: number;
  transitionNotes?: string;
  onSaveTransition?: (data: { duration: number; notes: string }) => void;
}

const TransitionEditor = ({
  currentTrack = {
    id: "1",
    title: "Summer Vibes",
    artist: "DJ Sunshine",
    waveform:
      "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=800&q=80",
  },
  nextTrack = {
    id: "2",
    title: "Midnight Groove",
    artist: "Luna Beats",
    waveform:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
  },
  transitionDuration = 16,
  transitionNotes = "",
  onSaveTransition = () => {},
}: TransitionEditorProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(transitionDuration);
  const [notes, setNotes] = useState(transitionNotes);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [transitionPoint, setTransitionPoint] = useState(0.7); // 70% of first track
  const [transitionType, setTransitionType] = useState("beatmatch");

  // Reset state when tracks change
  useEffect(() => {
    setDuration(transitionDuration);
    setNotes(transitionNotes);
    setCurrentTime(0);
    setIsPlaying(false);
  }, [currentTrack.id, nextTrack.id, transitionDuration, transitionNotes]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control audio playback
  };

  const handleSaveTransition = () => {
    onSaveTransition({
      duration,
      notes,
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Calculate transition position for visualization
  const getTransitionPosition = () => {
    // Assuming track duration is in seconds
    const trackDuration = 240; // 4 minutes as example
    return Math.floor(trackDuration * transitionPoint);
  };

  return (
    <div className="w-full bg-background border rounded-lg p-4 shadow-md">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Transition Editor</h2>
          <div className="flex gap-2">
            <Select value={transitionType} onValueChange={setTransitionType}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Transition type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beatmatch">Beatmatch</SelectItem>
                <SelectItem value="cut">Cut</SelectItem>
                <SelectItem value="fade">Fade</SelectItem>
                <SelectItem value="filter">Filter</SelectItem>
                <SelectItem value="echo">Echo</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="default" size="sm" onClick={handleSaveTransition}>
              <Save className="mr-2 h-4 w-4" />
              Save Transition
            </Button>
          </div>
        </div>

        {/* Visual transition preview */}
        <div className="bg-muted/30 rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 text-primary" />
              <span className="font-medium">{currentTrack.title}</span>
              <span className="text-muted-foreground">
                by {currentTrack.artist}
              </span>
            </div>
            <Badge variant="outline">
              {formatTime(getTransitionPosition())} / 4:00
            </Badge>
          </div>

          <div className="relative h-32 mb-4 bg-black/10 rounded-md overflow-hidden">
            {/* First track waveform */}
            <div className="absolute inset-0 flex">
              <div className="flex-1 relative overflow-hidden">
                <img
                  src={currentTrack.waveform}
                  alt="Track waveform"
                  className="w-full h-full object-cover opacity-40"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/30"
                  style={{
                    clipPath: `inset(0 ${100 - transitionPoint * 100}% 0 0)`,
                  }}
                ></div>
              </div>

              {/* Second track waveform */}
              <div className="flex-1 relative overflow-hidden">
                <img
                  src={nextTrack.waveform}
                  alt="Track waveform"
                  className="w-full h-full object-cover opacity-40"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent to-secondary/30"
                  style={{ clipPath: `inset(0 0 0 ${transitionPoint * 100}%)` }}
                ></div>
              </div>
            </div>

            {/* Transition point indicator */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white z-10 cursor-ew-resize"
              style={{ left: `${transitionPoint * 100}%` }}
            >
              <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-white"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-white"></div>
            </div>

            {/* Playback position indicator */}
            {isPlaying && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
                style={{ left: `${(currentTime / 240) * 100}%` }}
              >
                <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-red-500"></div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 text-secondary" />
              <span className="font-medium">{nextTrack.title}</span>
              <span className="text-muted-foreground">
                by {nextTrack.artist}
              </span>
            </div>
            <Badge variant="outline" className="bg-secondary/10">
              Transition: {transitionType}
            </Badge>
          </div>
        </div>

        {/* Transition controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-center space-x-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setCurrentTime(Math.max(0, currentTime - 10))
                        }
                      >
                        <SkipBack className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Skip 10 seconds back</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="default"
                        size="icon"
                        className="h-12 w-12 rounded-full"
                        onClick={handlePlayPause}
                      >
                        {isPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isPlaying ? "Pause" : "Play"} transition</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setCurrentTime(Math.min(240, currentTime + 10))
                        }
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Skip 10 seconds forward</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Playback Position</span>
                  <span className="text-sm">{formatTime(currentTime)}</span>
                </div>
                <Slider
                  value={[currentTime]}
                  min={0}
                  max={240}
                  step={1}
                  onValueChange={(value) => setCurrentTime(value[0])}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      Transition Point
                    </span>
                    <span className="text-sm">
                      {Math.round(transitionPoint * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[transitionPoint * 100]}
                    min={10}
                    max={90}
                    step={1}
                    onValueChange={(value) =>
                      setTransitionPoint(value[0] / 100)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      Transition Duration (beats)
                    </span>
                    <span className="text-sm">{duration}</span>
                  </div>
                  <Slider
                    value={[duration]}
                    min={4}
                    max={64}
                    step={4}
                    onValueChange={(value) => setDuration(value[0])}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Volume</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="p-0 h-8 w-8"
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => {
                    setVolume(value[0]);
                    if (value[0] > 0 && isMuted) setIsMuted(false);
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transition notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Transition Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add notes about this transition (e.g., EQ adjustments, effects, cue points)"
              className="min-h-[100px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              These notes will be saved with your mix and can be referenced
              later.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TransitionEditor;
