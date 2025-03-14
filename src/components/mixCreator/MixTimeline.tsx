import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import MixMiniMap from "./MixMiniMap";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Music,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Clock,
  Trash2,
  Copy,
  Scissors,
  Wand2,
  Zap,
  BarChart2,
  Sliders,
  Save,
  Download,
  Share2,
  Plus,
  Undo,
  Redo,
  RotateCcw,
  Maximize,
  Minimize,
  Bookmark,
  BookmarkPlus,
  AlertTriangle,
  Info,
  Settings,
  Layers,
  Repeat,
  SkipForward,
  SkipBack,
  FastForward,
  Rewind,
  Shuffle,
  Headphones,
  Mic,
  Filter,
  Tag,
  Edit,
  MoreHorizontal,
} from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  key: string;
  bpm: number;
  duration: number;
  waveform: string; // URL to waveform image
  color: string;
  energy?: number;
  genre?: string;
  tags?: string[];
  cuePoints?: CuePoint[];
  loops?: Loop[];
}

interface CuePoint {
  id: string;
  time: number;
  label: string;
  color?: string;
  type?: "intro" | "verse" | "chorus" | "bridge" | "outro" | "custom";
}

interface Loop {
  id: string;
  startTime: number;
  endTime: number;
  label: string;
}

interface Transition {
  fromTrackId: string;
  toTrackId: string;
  duration: number;
  startPoint: number;
  endPoint: number;
  type: "beatmatch" | "cut" | "fade" | "filter" | "echo" | "custom";
  notes?: string;
  effectsApplied?: string[];
}

interface MixTimelineProps {
  tracks?: Track[];
  transitions?: Record<string, Transition>;
  onTrackMove?: (sourceIndex: number, destinationIndex: number) => void;
  onTrackRemove?: (trackId: string) => void;
  onTrackDuplicate?: (trackId: string) => void;
  onTrackEdit?: (trackId: string) => void;
  onTransitionAdjust?: (
    fromTrackId: string,
    toTrackId: string,
    transitionData: Partial<Transition>,
  ) => void;
  onPreviewTransition?: (trackId: string, nextTrackId: string) => void;
  onAddCuePoint?: (trackId: string, cuePoint: Omit<CuePoint, "id">) => void;
  onRemoveCuePoint?: (trackId: string, cuePointId: string) => void;
  onAddLoop?: (trackId: string, loop: Omit<Loop, "id">) => void;
  onRemoveLoop?: (trackId: string, loopId: string) => void;
  onSaveMixState?: () => void;
  onExportMix?: () => void;
  onZoomChange?: (zoomLevel: number) => void;
  isEditable?: boolean;
}

const MixTimeline = ({
  tracks = [
    {
      id: "track-1",
      title: "Summer Vibes",
      artist: "DJ Sunshine",
      key: "11A",
      bpm: 128,
      duration: 320,
      waveform:
        "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=600&q=75",
      color: "#4f46e5",
      energy: 75,
      genre: "House",
      tags: ["summer", "upbeat"],
      cuePoints: [
        { id: "cp1", time: 32, label: "Intro End", type: "intro" },
        { id: "cp2", time: 160, label: "Drop", type: "chorus" },
        { id: "cp3", time: 288, label: "Outro Start", type: "outro" },
      ],
      loops: [{ id: "loop1", startTime: 64, endTime: 96, label: "Vocal Loop" }],
    },
    {
      id: "track-2",
      title: "Midnight Groove",
      artist: "Night Owl",
      key: "12A",
      bpm: 126,
      duration: 345,
      waveform:
        "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=600&q=75",
      color: "#8b5cf6",
      energy: 65,
      genre: "Deep House",
      tags: ["night", "deep"],
      cuePoints: [
        { id: "cp1", time: 48, label: "Intro End", type: "intro" },
        { id: "cp2", time: 176, label: "Drop", type: "chorus" },
        { id: "cp3", time: 304, label: "Outro Start", type: "outro" },
      ],
    },
    {
      id: "track-3",
      title: "Deep Dive",
      artist: "Ocean Beats",
      key: "1A",
      bpm: 124,
      duration: 298,
      waveform:
        "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=600&q=75",
      color: "#ec4899",
      energy: 60,
      genre: "Progressive House",
      tags: ["deep", "melodic"],
      cuePoints: [
        { id: "cp1", time: 32, label: "Intro End", type: "intro" },
        { id: "cp2", time: 160, label: "Drop", type: "chorus" },
      ],
    },
  ],
  transitions = {},
  onTrackMove = () => {},
  onTrackRemove = () => {},
  onTrackDuplicate = () => {},
  onTrackEdit = () => {},
  onTransitionAdjust = () => {},
  onPreviewTransition = () => {},
  onAddCuePoint = () => {},
  onRemoveCuePoint = () => {},
  onAddLoop = () => {},
  onRemoveLoop = () => {},
  onSaveMixState = () => {},
  onExportMix = () => {},
  onZoomChange = () => {},
  isEditable = true,
}: MixTimelineProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showCuePoints, setShowCuePoints] = useState(true);
  const [showLoops, setShowLoops] = useState(true);
  const [showWaveforms, setShowWaveforms] = useState(true);
  const [showTransitionMarkers, setShowTransitionMarkers] = useState(true);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [selectedTransition, setSelectedTransition] = useState<string | null>(
    null,
  );
  const [isAddingCuePoint, setIsAddingCuePoint] = useState(false);
  const [newCuePoint, setNewCuePoint] = useState<{
    trackId: string;
    time: number;
    label: string;
    type: string;
  }>({ trackId: "", time: 0, label: "", type: "custom" });
  const [isAddingLoop, setIsAddingLoop] = useState(false);
  const [newLoop, setNewLoop] = useState<{
    trackId: string;
    startTime: number;
    endTime: number;
    label: string;
  }>({ trackId: "", startTime: 0, endTime: 0, label: "" });
  const [showTrackDetails, setShowTrackDetails] = useState<
    Record<string, boolean>
  >({});
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [historyStack, setHistoryStack] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [transitionPoints, setTransitionPoints] = useState<
    Record<string, number>
  >(tracks.reduce((acc, track) => ({ ...acc, [track.id]: 30 }), {}));

  const timelineRef = useRef<HTMLDivElement>(null);
  const playbackTimerRef = useRef<number | null>(null);

  // Calculate total mix duration
  const totalDuration = tracks.reduce(
    (total, track) => total + track.duration,
    0,
  );

  // Initialize transition points from transitions prop
  useEffect(() => {
    const newTransitionPoints: Record<string, number> = {};

    Object.entries(transitions).forEach(([key, transition]) => {
      const [fromTrackId] = key.split("-");
      newTransitionPoints[fromTrackId] = transition.startPoint * 100;
    });

    // For any tracks without transitions, set default values
    tracks.forEach((track) => {
      if (!newTransitionPoints[track.id]) {
        newTransitionPoints[track.id] = 30;
      }
    });

    setTransitionPoints(newTransitionPoints);
  }, [transitions, tracks]);

  // Simulate playback when isPlaying is true
  useEffect(() => {
    if (isPlaying) {
      playbackTimerRef.current = window.setInterval(() => {
        setCurrentTime((prevTime) => {
          const newTime = prevTime + 0.1 * playbackSpeed;
          if (newTime >= totalDuration) {
            clearInterval(playbackTimerRef.current!);
            setIsPlaying(false);
            return 0;
          }
          return newTime;
        });
      }, 100);
    } else if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
    }

    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    };
  }, [isPlaying, totalDuration, playbackSpeed]);

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Calculate the current track and position based on currentTime
  const getCurrentTrackInfo = () => {
    let elapsedTime = 0;
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      if (
        currentTime >= elapsedTime &&
        currentTime < elapsedTime + track.duration
      ) {
        return {
          trackIndex: i,
          trackId: track.id,
          positionInTrack: currentTime - elapsedTime,
          percentageInTrack:
            ((currentTime - elapsedTime) / track.duration) * 100,
        };
      }
      elapsedTime += track.duration;
    }
    return null;
  };

  // Get the absolute time position of a track in the mix
  const getTrackStartTime = (trackIndex: number) => {
    let startTime = 0;
    for (let i = 0; i < trackIndex; i++) {
      startTime += tracks[i].duration;
    }
    return startTime;
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination || !isEditable) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    // Save current state to history before making changes
    addToHistory();

    onTrackMove(sourceIndex, destinationIndex);
  };

  const handleTransitionChange = (
    trackId: string,
    nextTrackId: string,
    value: number[],
  ) => {
    const newPoint = value[0];
    setTransitionPoints({ ...transitionPoints, [trackId]: newPoint });

    // Calculate actual transition points as ratios (0-1) for the transition object
    const startPoint = newPoint / 100;
    const endPoint = 0.2; // Default end point, could be made adjustable

    onTransitionAdjust(trackId, nextTrackId, {
      startPoint,
      endPoint,
      duration: 16, // Default duration in beats, could be made adjustable
    });
  };

  const handleRemoveTrack = (trackId: string) => {
    if (!isEditable) return;
    addToHistory();
    onTrackRemove(trackId);
  };

  const handleDuplicateTrack = (trackId: string) => {
    if (!isEditable) return;
    addToHistory();
    onTrackDuplicate(trackId);
  };

  const handleEditTrack = (trackId: string) => {
    if (!isEditable) return;
    onTrackEdit(trackId);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handlePreviewTransition = (trackId: string, nextTrackId: string) => {
    // Find the track index
    const trackIndex = tracks.findIndex((t) => t.id === trackId);
    if (trackIndex === -1) return;

    // Calculate the start time for preview
    const trackStartTime = getTrackStartTime(trackIndex);
    const transitionPoint =
      trackStartTime +
      tracks[trackIndex].duration * (transitionPoints[trackId] / 100);

    // Set current time to slightly before the transition point
    setCurrentTime(Math.max(0, transitionPoint - 5));
    setIsPlaying(true);

    // Also call the parent handler
    onPreviewTransition(trackId, nextTrackId);
  };

  const handleAddCuePoint = () => {
    if (!isEditable || !newCuePoint.trackId) return;

    addToHistory();
    onAddCuePoint(newCuePoint.trackId, {
      time: newCuePoint.time,
      label: newCuePoint.label || "Cue Point",
      type: (newCuePoint.type as any) || "custom",
    });

    setIsAddingCuePoint(false);
    setNewCuePoint({ trackId: "", time: 0, label: "", type: "custom" });
  };

  const handleRemoveCuePoint = (trackId: string, cuePointId: string) => {
    if (!isEditable) return;
    addToHistory();
    onRemoveCuePoint(trackId, cuePointId);
  };

  const handleAddLoop = () => {
    if (!isEditable || !newLoop.trackId || newLoop.startTime >= newLoop.endTime)
      return;

    addToHistory();
    onAddLoop(newLoop.trackId, {
      startTime: newLoop.startTime,
      endTime: newLoop.endTime,
      label: newLoop.label || "Loop",
    });

    setIsAddingLoop(false);
    setNewLoop({ trackId: "", startTime: 0, endTime: 0, label: "" });
  };

  const handleRemoveLoop = (trackId: string, loopId: string) => {
    if (!isEditable) return;
    addToHistory();
    onRemoveLoop(trackId, loopId);
  };

  const handleZoomChange = (value: number[]) => {
    const newZoom = value[0];
    setZoomLevel(newZoom);
    onZoomChange(newZoom);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSkipForward = () => {
    const currentInfo = getCurrentTrackInfo();
    if (!currentInfo) return;

    // Skip to next track if available
    if (currentInfo.trackIndex < tracks.length - 1) {
      const nextTrackStartTime = getTrackStartTime(currentInfo.trackIndex + 1);
      setCurrentTime(nextTrackStartTime);
    }
  };

  const handleSkipBackward = () => {
    const currentInfo = getCurrentTrackInfo();
    if (!currentInfo) return;

    // If we're more than 5 seconds into the current track, go to its start
    if (currentInfo.positionInTrack > 5) {
      setCurrentTime(getTrackStartTime(currentInfo.trackIndex));
    }
    // Otherwise go to previous track if available
    else if (currentInfo.trackIndex > 0) {
      const prevTrackStartTime = getTrackStartTime(currentInfo.trackIndex - 1);
      setCurrentTime(prevTrackStartTime);
    }
  };

  const handleSeek = (seconds: number) => {
    const newTime = Math.max(0, Math.min(totalDuration, currentTime + seconds));
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    if (!timelineRef.current) return;

    try {
      if (!isFullscreen) {
        if (timelineRef.current.requestFullscreen) {
          timelineRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  // Add current state to history stack
  const addToHistory = () => {
    const currentState = {
      tracks: [...tracks],
      transitions: { ...transitions },
      transitionPoints: { ...transitionPoints },
    };

    // Remove any future history if we're not at the end
    const newStack = historyStack.slice(0, historyIndex + 1);
    newStack.push(currentState);

    // Limit history size to prevent memory issues
    if (newStack.length > 20) {
      newStack.shift();
    }

    setHistoryStack(newStack);
    setHistoryIndex(newStack.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex <= 0 || !isEditable) return;

    const prevState = historyStack[historyIndex - 1];
    // Here you would need to implement a way to restore the previous state
    // This might involve calling parent component methods with the previous state data

    setHistoryIndex(historyIndex - 1);
  };

  const handleRedo = () => {
    if (historyIndex >= historyStack.length - 1 || !isEditable) return;

    const nextState = historyStack[historyIndex + 1];
    // Here you would need to implement a way to restore the next state

    setHistoryIndex(historyIndex + 1);
  };

  const handleSaveMixState = () => {
    onSaveMixState();
  };

  const handleExportMix = () => {
    onExportMix();
  };

  // Get the current track being played
  const currentTrackInfo = getCurrentTrackInfo();
  const currentTrack = currentTrackInfo
    ? tracks[currentTrackInfo.trackIndex]
    : null;

  // Calculate playback position indicator
  const getPlaybackIndicatorPosition = () => {
    if (!currentTrackInfo) return 0;
    return `${currentTrackInfo.percentageInTrack * zoomLevel}%`;
  };

  // Toggle track details expansion
  const toggleTrackDetails = (trackId: string) => {
    setShowTrackDetails((prev) => ({
      ...prev,
      [trackId]: !prev[trackId],
    }));
  };

  return (
    <div
      ref={timelineRef}
      className={`w-full h-full bg-background border rounded-lg p-4 flex flex-col gap-4 ${isFullscreen ? "fixed inset-0 z-50" : ""}`}
    >
      {/* Mix Mini Map */}
      <div className="mb-4 sticky top-0 z-10">
        <MixMiniMap
          tracks={tracks}
          onTrackMove={onTrackMove}
          selectedTrackId={selectedTrackId}
          onTrackSelect={setSelectedTrackId}
        />
      </div>

      {/* Header with controls and info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Mix Timeline</h2>
          {currentTrack && (
            <Badge variant="outline" className="ml-2">
              Now Playing: {currentTrack.title} - {currentTrack.artist}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Total: {formatTime(totalDuration)}
            </span>
            <Badge variant="outline" className="flex items-center gap-1">
              <Music className="h-3 w-3" />
              {tracks.length} tracks
            </Badge>
          </div>

          {isEditable && (
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleUndo}
                      disabled={historyIndex <= 0}
                    >
                      <Undo className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Undo</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleRedo}
                      disabled={historyIndex >= historyStack.length - 1}
                    >
                      <Redo className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Redo</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleSaveMixState}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save Mix</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? (
                      <Minimize className="h-4 w-4" />
                    ) : (
                      <Maximize className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Timeline Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="show-cuepoints" className="text-sm">
                      Show Cue Points
                    </Label>
                    <Switch
                      id="show-cuepoints"
                      checked={showCuePoints}
                      onCheckedChange={setShowCuePoints}
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="show-loops" className="text-sm">
                      Show Loops
                    </Label>
                    <Switch
                      id="show-loops"
                      checked={showLoops}
                      onCheckedChange={setShowLoops}
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="show-waveforms" className="text-sm">
                      Show Waveforms
                    </Label>
                    <Switch
                      id="show-waveforms"
                      checked={showWaveforms}
                      onCheckedChange={setShowWaveforms}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-transitions" className="text-sm">
                      Show Transitions
                    </Label>
                    <Switch
                      id="show-transitions"
                      checked={showTransitionMarkers}
                      onCheckedChange={setShowTransitionMarkers}
                    />
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExportMix}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Mix
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Playback controls */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={handleStop}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleSeek(-10)}
            >
              <Rewind className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleSkipBackward}>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="default" size="icon" onClick={handlePlayPause}>
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" size="icon" onClick={handleSkipForward}>
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleSeek(10)}
            >
              <FastForward className="h-4 w-4" />
            </Button>
            <Select
              value={playbackSpeed.toString()}
              onValueChange={(val) => setPlaybackSpeed(parseFloat(val))}
            >
              <SelectTrigger className="w-[80px] h-9">
                <SelectValue placeholder="Speed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">0.5x</SelectItem>
                <SelectItem value="0.75">0.75x</SelectItem>
                <SelectItem value="1">1x</SelectItem>
                <SelectItem value="1.25">1.25x</SelectItem>
                <SelectItem value="1.5">1.5x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 flex items-center gap-2">
            <span className="text-sm font-mono">{formatTime(currentTime)}</span>
            <div className="relative flex-1">
              <Slider
                className="flex-1"
                value={[currentTime]}
                max={totalDuration}
                step={0.1}
                onValueChange={(value) => setCurrentTime(value[0])}
              />
              {currentTrackInfo && (
                <div
                  className="absolute top-0 h-full w-1 bg-primary z-10"
                  style={{ left: getPlaybackIndicatorPosition() }}
                />
              )}
            </div>
            <span className="text-sm font-mono">
              {formatTime(totalDuration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleToggleMute}>
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              className="w-24"
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={(value) => {
                setVolume(value[0]);
                if (value[0] > 0 && isMuted) setIsMuted(false);
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="zoom-level" className="text-sm">
              Zoom:
            </Label>
            <Slider
              id="zoom-level"
              className="w-32"
              value={[zoomLevel]}
              min={0.5}
              max={3}
              step={0.1}
              onValueChange={handleZoomChange}
            />
            <span className="text-xs">{zoomLevel.toFixed(1)}x</span>
          </div>

          {isEditable && (
            <div className="flex items-center gap-2">
              <Dialog
                open={isAddingCuePoint}
                onOpenChange={setIsAddingCuePoint}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <BookmarkPlus className="mr-2 h-3 w-3" />
                    Add Cue Point
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Cue Point</DialogTitle>
                    <DialogDescription>
                      Add a cue point to mark important sections in your track.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cue-track" className="text-right">
                        Track
                      </Label>
                      <Select
                        value={newCuePoint.trackId}
                        onValueChange={(val) =>
                          setNewCuePoint({ ...newCuePoint, trackId: val })
                        }
                      >
                        <SelectTrigger id="cue-track" className="col-span-3">
                          <SelectValue placeholder="Select track" />
                        </SelectTrigger>
                        <SelectContent>
                          {tracks.map((track) => (
                            <SelectItem key={track.id} value={track.id}>
                              {track.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cue-time" className="text-right">
                        Time (sec)
                      </Label>
                      <Input
                        id="cue-time"
                        type="number"
                        value={newCuePoint.time}
                        onChange={(e) =>
                          setNewCuePoint({
                            ...newCuePoint,
                            time: parseInt(e.target.value) || 0,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cue-label" className="text-right">
                        Label
                      </Label>
                      <Input
                        id="cue-label"
                        value={newCuePoint.label}
                        onChange={(e) =>
                          setNewCuePoint({
                            ...newCuePoint,
                            label: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cue-type" className="text-right">
                        Type
                      </Label>
                      <Select
                        value={newCuePoint.type}
                        onValueChange={(val) =>
                          setNewCuePoint({ ...newCuePoint, type: val })
                        }
                      >
                        <SelectTrigger id="cue-type" className="col-span-3">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="intro">Intro</SelectItem>
                          <SelectItem value="verse">Verse</SelectItem>
                          <SelectItem value="chorus">Chorus/Drop</SelectItem>
                          <SelectItem value="bridge">Bridge</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingCuePoint(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddCuePoint}>Add Cue Point</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddingLoop} onOpenChange={setIsAddingLoop}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Repeat className="mr-2 h-3 w-3" />
                    Add Loop
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Loop</DialogTitle>
                    <DialogDescription>
                      Define a loop section in your track.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="loop-track" className="text-right">
                        Track
                      </Label>
                      <Select
                        value={newLoop.trackId}
                        onValueChange={(val) =>
                          setNewLoop({ ...newLoop, trackId: val })
                        }
                      >
                        <SelectTrigger id="loop-track" className="col-span-3">
                          <SelectValue placeholder="Select track" />
                        </SelectTrigger>
                        <SelectContent>
                          {tracks.map((track) => (
                            <SelectItem key={track.id} value={track.id}>
                              {track.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="loop-start" className="text-right">
                        Start (sec)
                      </Label>
                      <Input
                        id="loop-start"
                        type="number"
                        value={newLoop.startTime}
                        onChange={(e) =>
                          setNewLoop({
                            ...newLoop,
                            startTime: parseInt(e.target.value) || 0,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="loop-end" className="text-right">
                        End (sec)
                      </Label>
                      <Input
                        id="loop-end"
                        type="number"
                        value={newLoop.endTime}
                        onChange={(e) =>
                          setNewLoop({
                            ...newLoop,
                            endTime: parseInt(e.target.value) || 0,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="loop-label" className="text-right">
                        Label
                      </Label>
                      <Input
                        id="loop-label"
                        value={newLoop.label}
                        onChange={(e) =>
                          setNewLoop({ ...newLoop, label: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingLoop(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddLoop}>Add Loop</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>

      {/* Tracks timeline */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tracks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex-1 overflow-y-auto space-y-4"
              style={{ minHeight: tracks.length * 100 }}
            >
              {tracks.map((track, index) => {
                const nextTrack =
                  index < tracks.length - 1 ? tracks[index + 1] : null;
                const transitionKey = nextTrack
                  ? `${track.id}-${nextTrack.id}`
                  : null;
                const transition = transitionKey
                  ? transitions[transitionKey]
                  : null;

                return (
                  <Draggable
                    key={track.id}
                    draggableId={track.id}
                    index={index}
                    isDragDisabled={!isEditable}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-card rounded-lg p-3 border shadow-sm ${selectedTrackId === track.id ? "ring-2 ring-primary" : ""}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {isEditable && (
                              <div
                                {...provided.dragHandleProps}
                                className="p-2 rounded-md hover:bg-accent cursor-move mr-2"
                              >
                                <span className="font-bold text-lg">
                                  {index + 1}
                                </span>
                              </div>
                            )}
                            <div className="w-10 h-10 rounded-md overflow-hidden mr-2">
                              {track.waveform ? (
                                <img
                                  src={track.waveform}
                                  alt={track.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                  <Music className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex-1">
                            <h3 className="font-medium">{track.title}</h3>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-muted-foreground">
                                {track.artist}
                              </p>
                              {track.genre && (
                                <Badge variant="outline" className="text-xs">
                                  {track.genre}
                                </Badge>
                              )}
                              {track.tags &&
                                track.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Badge className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10">
                                {track.key}
                              </Badge>
                              <Badge className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10">
                                {track.bpm} BPM
                              </Badge>
                              {track.energy !== undefined && (
                                <Badge className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10">
                                  Energy: {track.energy}%
                                </Badge>
                              )}
                            </div>

                            <span className="text-sm flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(track.duration)}
                            </span>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => toggleTrackDetails(track.id)}
                                >
                                  {showTrackDetails[track.id] ? (
                                    <>
                                      <Minimize className="mr-2 h-4 w-4" />
                                      Hide Details
                                    </>
                                  ) : (
                                    <>
                                      <Maximize className="mr-2 h-4 w-4" />
                                      Show Details
                                    </>
                                  )}
                                </DropdownMenuItem>
                                {isEditable && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => handleEditTrack(track.id)}
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit Track
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDuplicateTrack(track.id)
                                      }
                                    >
                                      <Copy className="mr-2 h-4 w-4" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleRemoveTrack(track.id)
                                      }
                                      className="text-destructive"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Remove
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Track details accordion */}
                        {showTrackDetails[track.id] && (
                          <div className="mb-3 p-2 bg-muted/50 rounded-md">
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                            >
                              {track.cuePoints &&
                                track.cuePoints.length > 0 && (
                                  <AccordionItem value="cuepoints">
                                    <AccordionTrigger className="py-2 text-sm">
                                      Cue Points ({track.cuePoints.length})
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <div className="space-y-2">
                                        {track.cuePoints.map((cue) => (
                                          <div
                                            key={cue.id}
                                            className="flex items-center justify-between"
                                          >
                                            <div className="flex items-center gap-2">
                                              <Bookmark className="h-3 w-3" />
                                              <span className="text-sm">
                                                {cue.label}
                                              </span>
                                              <Badge
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                {formatTime(cue.time)}
                                              </Badge>
                                              {cue.type && (
                                                <Badge
                                                  variant="secondary"
                                                  className="text-xs"
                                                >
                                                  {cue.type}
                                                </Badge>
                                              )}
                                            </div>
                                            {isEditable && (
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() =>
                                                  handleRemoveCuePoint(
                                                    track.id,
                                                    cue.id,
                                                  )
                                                }
                                              >
                                                <Trash2 className="h-3 w-3" />
                                              </Button>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                )}

                              {track.loops && track.loops.length > 0 && (
                                <AccordionItem value="loops">
                                  <AccordionTrigger className="py-2 text-sm">
                                    Loops ({track.loops.length})
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-2">
                                      {track.loops.map((loop) => (
                                        <div
                                          key={loop.id}
                                          className="flex items-center justify-between"
                                        >
                                          <div className="flex items-center gap-2">
                                            <Repeat className="h-3 w-3" />
                                            <span className="text-sm">
                                              {loop.label}
                                            </span>
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {formatTime(loop.startTime)} -{" "}
                                              {formatTime(loop.endTime)}
                                            </Badge>
                                          </div>
                                          {isEditable && (
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-6 w-6"
                                              onClick={() =>
                                                handleRemoveLoop(
                                                  track.id,
                                                  loop.id,
                                                )
                                              }
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              )}
                            </Accordion>
                          </div>
                        )}

                        {/* Waveform visualization */}
                        <div
                          className="relative h-24 bg-accent/30 rounded-md overflow-hidden"
                          style={{ width: `${100 * zoomLevel}%` }}
                        >
                          {showWaveforms && (
                            <div
                              className="absolute inset-0 opacity-30 bg-cover bg-center"
                              style={{
                                backgroundImage: `url(${track.waveform})`,
                              }}
                            />
                          )}

                          <div
                            className="absolute inset-0"
                            style={{
                              background: `linear-gradient(90deg, ${track.color}33 0%, ${track.color}66 50%, ${track.color}33 100%)`,
                            }}
                          />

                          {/* Cue points */}
                          {showCuePoints &&
                            track.cuePoints &&
                            track.cuePoints.map((cue) => {
                              const position =
                                (cue.time / track.duration) * 100;
                              return (
                                <TooltipProvider key={cue.id}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className="absolute top-0 bottom-0 w-0.5 bg-yellow-500 cursor-pointer z-10"
                                        style={{ left: `${position}%` }}
                                        onClick={() =>
                                          setCurrentTime(
                                            getTrackStartTime(index) + cue.time,
                                          )
                                        }
                                      >
                                        <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="absolute -top-6 -translate-x-1/2 bg-yellow-500 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap">
                                          {cue.type}
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        {cue.label} ({formatTime(cue.time)})
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              );
                            })}

                          {/* Loops */}
                          {showLoops &&
                            track.loops &&
                            track.loops.map((loop) => {
                              const startPosition =
                                (loop.startTime / track.duration) * 100;
                              const endPosition =
                                (loop.endTime / track.duration) * 100;
                              const width = endPosition - startPosition;
                              return (
                                <TooltipProvider key={loop.id}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className="absolute top-0 h-full bg-green-500/20 border-l-2 border-r-2 border-green-500 cursor-pointer z-10"
                                        style={{
                                          left: `${startPosition}%`,
                                          width: `${width}%`,
                                        }}
                                        onClick={() =>
                                          setCurrentTime(
                                            getTrackStartTime(index) +
                                              loop.startTime,
                                          )
                                        }
                                      >
                                        <div className="absolute top-0 left-0 w-full text-center text-xs font-semibold bg-green-500/70 text-white truncate px-1">
                                          {loop.label}
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-full text-center text-xs text-green-700 truncate px-1 bg-white/70">
                                          {formatTime(loop.startTime)} -{" "}
                                          {formatTime(loop.endTime)}
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        {loop.label} (
                                        {formatTime(loop.startTime)} -{" "}
                                        {formatTime(loop.endTime)})
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              );
                            })}

                          {/* Transition point indicator */}
                          {showTransitionMarkers &&
                            index < tracks.length - 1 && (
                              <div
                                className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize z-20"
                                style={{
                                  left: `${transitionPoints[track.id] || 30}%`,
                                }}
                                onDoubleClick={() => {
                                  if (nextTrack) {
                                    handlePreviewTransition(
                                      track.id,
                                      nextTrack.id,
                                    );
                                  }
                                }}
                              >
                                <div className="absolute -top-6 -translate-x-1/2 bg-primary text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                                  Transition
                                </div>
                                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-primary"></div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="absolute top-8 -translate-x-1/2 bg-white"
                                  onClick={() => {
                                    if (nextTrack) {
                                      onPreviewTransition(
                                        track.id,
                                        nextTrack.id,
                                      );
                                    }
                                  }}
                                >
                                  Edit Transition
                                </Button>
                              </div>
                            )}

                          {/* Current playback position */}
                          {currentTrackInfo &&
                            currentTrackInfo.trackId === track.id && (
                              <div
                                className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30"
                                style={{
                                  left: `${currentTrackInfo.percentageInTrack}%`,
                                }}
                              >
                                <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-red-500" />
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default MixTimeline;
