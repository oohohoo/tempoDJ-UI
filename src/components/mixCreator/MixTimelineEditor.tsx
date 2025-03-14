import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
  Music,
  Scissors,
  Wand2,
  Save,
  Download,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Track {
  id: string;
  title: string;
  artist: string;
  key: string;
  bpm: number;
  duration: number;
  waveform?: string;
  color?: string;
  startPosition?: number; // Position in seconds where track starts in the mix
  fadeInDuration?: number; // Duration of fade in in seconds
  fadeOutDuration?: number; // Duration of fade out in seconds
  volume?: number; // Volume level (0-100)
  eqSettings?: {
    low: number;
    mid: number;
    high: number;
  };
  effects?: string[];
}

interface Transition {
  fromTrackId: string;
  toTrackId: string;
  startPoint: number; // Position in seconds where transition starts
  duration: number; // Duration of transition in seconds
  type: "beatmatch" | "cut" | "fade" | "filter" | "echo" | "custom";
  eqSettings?: {
    lowCut: number;
    midCut: number;
    highCut: number;
  };
  effects?: string[];
}

interface MixTimelineEditorProps {
  tracks: Track[];
  transitions: Record<string, Transition>;
  onTrackUpdate?: (trackId: string, updates: Partial<Track>) => void;
  onTransitionUpdate?: (
    fromTrackId: string,
    toTrackId: string,
    updates: Partial<Transition>,
  ) => void;
  onSaveMix?: () => void;
  onExportMix?: () => void;
}

const MixTimelineEditor: React.FC<MixTimelineEditorProps> = ({
  tracks = [],
  transitions = {},
  onTrackUpdate = () => {},
  onTransitionUpdate = () => {},
  onSaveMix = () => {},
  onExportMix = () => {},
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [selectedTransitionKey, setSelectedTransitionKey] = useState<
    string | null
  >(null);
  const [showEQControls, setShowEQControls] = useState(false);
  const [showEffects, setShowEffects] = useState(false);
  const [showWaveforms, setShowWaveforms] = useState(true);
  const [showTransitionMarkers, setShowTransitionMarkers] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState("tracks");
  const [energyFlowVisible, setEnergyFlowVisible] = useState(true);

  const timelineRef = useRef<HTMLDivElement>(null);
  const playbackTimerRef = useRef<number | null>(null);

  // Calculate total mix duration
  const calculateTotalDuration = () => {
    if (tracks.length === 0) return 0;

    // Find the last track's start position and add its duration
    const lastTrack = tracks[tracks.length - 1];
    const lastTrackStart = lastTrack.startPosition || 0;
    return lastTrackStart + lastTrack.duration;
  };

  const totalDuration = calculateTotalDuration();

  // Calculate track positions in the timeline
  const getTrackTimelinePositions = () => {
    const positions: Record<string, { start: number; end: number }> = {};

    tracks.forEach((track, index) => {
      const startPosition = track.startPosition || 0;
      positions[track.id] = {
        start: startPosition,
        end: startPosition + track.duration,
      };
    });

    return positions;
  };

  const trackPositions = getTrackTimelinePositions();

  // Handle playback
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

  // Get the current track based on playback position
  const getCurrentTrack = () => {
    for (const track of tracks) {
      const start = track.startPosition || 0;
      const end = start + track.duration;

      if (currentTime >= start && currentTime < end) {
        return track;
      }
    }
    return null;
  };

  // Get transition at current time
  const getCurrentTransition = () => {
    for (const key in transitions) {
      const transition = transitions[key];
      const [fromTrackId, toTrackId] = key.split("-");
      const fromTrack = tracks.find((t) => t.id === fromTrackId);

      if (fromTrack) {
        const start = (fromTrack.startPosition || 0) + transition.startPoint;
        const end = start + transition.duration;

        if (currentTime >= start && currentTime < end) {
          return { ...transition, key };
        }
      }
    }
    return null;
  };

  // Handle play/pause
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle stop
  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Handle seek
  const handleSeek = (seconds: number) => {
    const newTime = Math.max(0, Math.min(totalDuration, currentTime + seconds));
    setCurrentTime(newTime);
  };

  // Handle track selection
  const handleTrackSelect = (trackId: string) => {
    setSelectedTrackId(trackId);
    setSelectedTransitionKey(null);
  };

  // Handle transition selection
  const handleTransitionSelect = (transitionKey: string) => {
    setSelectedTransitionKey(transitionKey);
    setSelectedTrackId(null);
  };

  // Handle track volume change
  const handleTrackVolumeChange = (trackId: string, volume: number) => {
    onTrackUpdate(trackId, { volume });
  };

  // Handle track EQ change
  const handleTrackEQChange = (
    trackId: string,
    eqType: "low" | "mid" | "high",
    value: number,
  ) => {
    const track = tracks.find((t) => t.id === trackId);
    if (!track) return;

    const eqSettings = { ...(track.eqSettings || { low: 0, mid: 0, high: 0 }) };
    eqSettings[eqType] = value;

    onTrackUpdate(trackId, { eqSettings });
  };

  // Handle transition type change
  const handleTransitionTypeChange = (
    transitionKey: string,
    type: Transition["type"],
  ) => {
    const [fromTrackId, toTrackId] = transitionKey.split("-");
    onTransitionUpdate(fromTrackId, toTrackId, { type });
  };

  // Handle transition duration change
  const handleTransitionDurationChange = (
    transitionKey: string,
    duration: number,
  ) => {
    const [fromTrackId, toTrackId] = transitionKey.split("-");
    onTransitionUpdate(fromTrackId, toTrackId, { duration });
  };

  // Calculate energy flow data points
  const calculateEnergyFlow = () => {
    if (tracks.length === 0) return [];

    const dataPoints: { time: number; energy: number }[] = [];

    tracks.forEach((track, index) => {
      const startPosition = track.startPosition || 0;
      const energy = track.volume || 75; // Use volume as energy if not specified

      // Add data point at start of track
      dataPoints.push({ time: startPosition, energy });

      // Add data point at end of track
      dataPoints.push({ time: startPosition + track.duration, energy });

      // If there's a transition to the next track, add data points for the transition
      if (index < tracks.length - 1) {
        const nextTrack = tracks[index + 1];
        const transitionKey = `${track.id}-${nextTrack.id}`;
        const transition = transitions[transitionKey];

        if (transition) {
          const transitionStart = startPosition + transition.startPoint;
          const transitionEnd = transitionStart + transition.duration;
          const nextEnergy = nextTrack.volume || 75;

          // Add data points for the transition
          dataPoints.push({ time: transitionStart, energy });
          dataPoints.push({ time: transitionEnd, energy: nextEnergy });
        }
      }
    });

    // Sort data points by time
    return dataPoints.sort((a, b) => a.time - b.time);
  };

  const energyFlowData = calculateEnergyFlow();

  // Render energy flow visualization
  const renderEnergyFlow = () => {
    if (!energyFlowVisible || energyFlowData.length < 2) return null;

    const maxTime = totalDuration;
    const height = 50;
    const width = timelineRef.current?.clientWidth || 1000;

    // Create SVG path
    let pathData = `M ${(energyFlowData[0].time / maxTime) * width * zoomLevel} ${height - (energyFlowData[0].energy / 100) * height}`;

    for (let i = 1; i < energyFlowData.length; i++) {
      const x = (energyFlowData[i].time / maxTime) * width * zoomLevel;
      const y = height - (energyFlowData[i].energy / 100) * height;
      pathData += ` L ${x} ${y}`;
    }

    return (
      <div className="relative h-[50px] mt-4 mb-2">
        <div className="absolute left-0 top-0 text-xs text-muted-foreground">
          Energy Flow
        </div>
        <svg width="100%" height={height} className="overflow-visible">
          <defs>
            <linearGradient
              id="energyGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path d={pathData} stroke="#4f46e5" strokeWidth="2" fill="none" />
          <path
            d={`${pathData} L ${(energyFlowData[energyFlowData.length - 1].time / maxTime) * width * zoomLevel} ${height} L ${(energyFlowData[0].time / maxTime) * width * zoomLevel} ${height} Z`}
            fill="url(#energyGradient)"
            opacity="0.5"
          />
          {/* Current position indicator */}
          {currentTime > 0 && (
            <line
              x1={(currentTime / maxTime) * width * zoomLevel}
              y1="0"
              x2={(currentTime / maxTime) * width * zoomLevel}
              y2={height}
              stroke="#ef4444"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          )}
        </svg>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-background border rounded-lg p-4 gap-4">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Mix Timeline Editor</h2>
          <p className="text-sm text-muted-foreground">
            Edit track positions, transitions, and effects
          </p>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <span className="text-sm">{zoomLevel.toFixed(1)}x</span>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.1))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowEQControls(!showEQControls)}
                >
                  <Sliders className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle EQ Controls</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setEnergyFlowVisible(!energyFlowVisible)}
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Energy Flow</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={onSaveMix}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save Mix</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="default" onClick={onExportMix}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export Mix</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Playback controls */}
      <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-md">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={handleStop}>
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button variant="default" size="icon" onClick={handlePlayPause}>
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <Button variant="outline" size="icon" onClick={() => handleSeek(10)}>
            <SkipForward className="h-4 w-4" />
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
              value={[currentTime]}
              max={totalDuration}
              step={0.1}
              onValueChange={(value) => setCurrentTime(value[0])}
            />
          </div>
          <span className="text-sm font-mono">{formatTime(totalDuration)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
          >
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

      {/* Energy flow visualization */}
      {renderEnergyFlow()}

      {/* Timeline visualization */}
      <div
        ref={timelineRef}
        className="flex-1 overflow-x-auto overflow-y-hidden"
      >
        <div
          className="relative"
          style={{
            width: `${totalDuration * 20 * zoomLevel}px`,
            minWidth: "100%",
            height: "100%",
          }}
        >
          {/* Time markers */}
          <div className="absolute top-0 left-0 right-0 h-6 flex">
            {Array.from({ length: Math.ceil(totalDuration / 60) + 1 }).map(
              (_, i) => (
                <div
                  key={i}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${((i * 60) / totalDuration) * 100}%` }}
                >
                  <div className="h-2 w-0.5 bg-gray-300"></div>
                  <span className="text-xs text-gray-500">{i}:00</span>
                </div>
              ),
            )}
          </div>

          {/* Tracks visualization */}
          <div className="absolute top-8 left-0 right-0 bottom-0">
            {tracks.map((track, index) => {
              const startPercent =
                ((track.startPosition || 0) / totalDuration) * 100;
              const widthPercent = (track.duration / totalDuration) * 100;

              // Find transitions involving this track
              const outgoingTransition =
                index < tracks.length - 1
                  ? transitions[`${track.id}-${tracks[index + 1].id}`]
                  : null;
              const incomingTransition =
                index > 0
                  ? transitions[`${tracks[index - 1].id}-${track.id}`]
                  : null;

              return (
                <div
                  key={track.id}
                  className={`absolute h-24 rounded-md overflow-hidden cursor-pointer transition-all ${selectedTrackId === track.id ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-primary/50"}`}
                  style={{
                    left: `${startPercent}%`,
                    width: `${widthPercent}%`,
                    backgroundColor: `${track.color || "#4f46e5"}20`,
                    borderLeft: `4px solid ${track.color || "#4f46e5"}`,
                  }}
                  onClick={() => handleTrackSelect(track.id)}
                >
                  {/* Track waveform */}
                  {showWaveforms && track.waveform && (
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-30"
                      style={{ backgroundImage: `url(${track.waveform})` }}
                    ></div>
                  )}

                  {/* Track info */}
                  <div className="absolute inset-0 p-2 flex flex-col justify-between">
                    <div>
                      <div className="font-medium truncate">{track.title}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {track.artist}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="outline" className="bg-background/80">
                        {track.key}
                      </Badge>
                      <Badge variant="outline" className="bg-background/80">
                        {track.bpm} BPM
                      </Badge>
                      <span className="bg-background/80 px-1.5 py-0.5 rounded">
                        {formatTime(track.duration)}
                      </span>
                    </div>
                  </div>

                  {/* Fade in visualization */}
                  {track.fadeInDuration && track.fadeInDuration > 0 && (
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-black/50 to-transparent pointer-events-none"
                      style={{
                        width: `${(track.fadeInDuration / track.duration) * 100}%`,
                      }}
                    ></div>
                  )}

                  {/* Fade out visualization */}
                  {track.fadeOutDuration && track.fadeOutDuration > 0 && (
                    <div
                      className="absolute top-0 right-0 h-full bg-gradient-to-l from-black/50 to-transparent pointer-events-none"
                      style={{
                        width: `${(track.fadeOutDuration / track.duration) * 100}%`,
                      }}
                    ></div>
                  )}

                  {/* Outgoing transition marker */}
                  {outgoingTransition && showTransitionMarkers && (
                    <div
                      className={`absolute top-0 h-full w-1 bg-yellow-500 cursor-pointer ${selectedTransitionKey === `${track.id}-${tracks[index + 1].id}` ? "ring-2 ring-yellow-300" : ""}`}
                      style={{
                        left: `${(outgoingTransition.startPoint / track.duration) * 100}%`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTransitionSelect(
                          `${track.id}-${tracks[index + 1].id}`,
                        );
                      }}
                    >
                      <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-yellow-500"></div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Current position indicator */}
            <div
              className="absolute top-0 h-full w-0.5 bg-red-500 z-10"
              style={{ left: `${(currentTime / totalDuration) * 100}%` }}
            >
              <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-red-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected item details */}
      {(selectedTrackId || selectedTransitionKey) && (
        <div className="border rounded-md p-4">
          <Tabs
            defaultValue={selectedTrackId ? "track" : "transition"}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="track" disabled={!selectedTrackId}>
                Track Details
              </TabsTrigger>
              <TabsTrigger value="transition" disabled={!selectedTransitionKey}>
                Transition Details
              </TabsTrigger>
            </TabsList>

            {selectedTrackId && (
              <div className="space-y-4">
                {(() => {
                  const track = tracks.find((t) => t.id === selectedTrackId);
                  if (!track) return null;

                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{track.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {track.artist}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>{track.key}</Badge>
                          <Badge>{track.bpm} BPM</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Volume</Label>
                          <Slider
                            value={[track.volume || 100]}
                            max={100}
                            step={1}
                            onValueChange={(value) =>
                              handleTrackVolumeChange(track.id, value[0])
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Fade In Duration</Label>
                            <span className="text-sm">
                              {track.fadeInDuration || 0}s
                            </span>
                          </div>
                          <Slider
                            value={[track.fadeInDuration || 0]}
                            max={30}
                            step={1}
                            onValueChange={(value) =>
                              onTrackUpdate(track.id, {
                                fadeInDuration: value[0],
                              })
                            }
                          />
                        </div>
                      </div>

                      {showEQControls && (
                        <div className="space-y-2 pt-2 border-t">
                          <Label>EQ Settings</Label>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Low</span>
                                <span className="text-sm">
                                  {track.eqSettings?.low || 0}dB
                                </span>
                              </div>
                              <Slider
                                value={[track.eqSettings?.low || 0]}
                                min={-12}
                                max={12}
                                step={1}
                                onValueChange={(value) =>
                                  handleTrackEQChange(track.id, "low", value[0])
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Mid</span>
                                <span className="text-sm">
                                  {track.eqSettings?.mid || 0}dB
                                </span>
                              </div>
                              <Slider
                                value={[track.eqSettings?.mid || 0]}
                                min={-12}
                                max={12}
                                step={1}
                                onValueChange={(value) =>
                                  handleTrackEQChange(track.id, "mid", value[0])
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">High</span>
                                <span className="text-sm">
                                  {track.eqSettings?.high || 0}dB
                                </span>
                              </div>
                              <Slider
                                value={[track.eqSettings?.high || 0]}
                                min={-12}
                                max={12}
                                step={1}
                                onValueChange={(value) =>
                                  handleTrackEQChange(
                                    track.id,
                                    "high",
                                    value[0],
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="preview-track">Preview Track</Label>
                          <Switch id="preview-track" />
                        </div>

                        <Button variant="outline" size="sm">
                          <Scissors className="h-4 w-4 mr-2" />
                          Edit Cue Points
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {selectedTransitionKey && (
              <div className="space-y-4">
                {(() => {
                  const [fromTrackId, toTrackId] =
                    selectedTransitionKey.split("-");
                  const transition = transitions[selectedTransitionKey];
                  const fromTrack = tracks.find((t) => t.id === fromTrackId);
                  const toTrack = tracks.find((t) => t.id === toTrackId);

                  if (!transition || !fromTrack || !toTrack) return null;

                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Transition</h3>
                          <p className="text-sm text-muted-foreground">
                            {fromTrack.title} → {toTrack.title}
                          </p>
                        </div>
                        <Badge>
                          {transition.type.charAt(0).toUpperCase() +
                            transition.type.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Transition Type</Label>
                          <Select
                            value={transition.type}
                            onValueChange={(value) =>
                              handleTransitionTypeChange(
                                selectedTransitionKey,
                                value as Transition["type"],
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beatmatch">
                                Beatmatch
                              </SelectItem>
                              <SelectItem value="cut">Cut</SelectItem>
                              <SelectItem value="fade">Fade</SelectItem>
                              <SelectItem value="filter">Filter</SelectItem>
                              <SelectItem value="echo">Echo</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Duration</Label>
                            <span className="text-sm">
                              {transition.duration}s
                            </span>
                          </div>
                          <Slider
                            value={[transition.duration]}
                            min={1}
                            max={60}
                            step={1}
                            onValueChange={(value) =>
                              handleTransitionDurationChange(
                                selectedTransitionKey,
                                value[0],
                              )
                            }
                          />
                        </div>
                      </div>

                      {showEQControls && transition.type !== "cut" && (
                        <div className="space-y-2 pt-2 border-t">
                          <Label>EQ Transition Settings</Label>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Low Cut</span>
                                <span className="text-sm">
                                  {transition.eqSettings?.lowCut || 0}%
                                </span>
                              </div>
                              <Slider
                                value={[transition.eqSettings?.lowCut || 0]}
                                max={100}
                                step={1}
                                onValueChange={(value) => {
                                  const eqSettings = {
                                    ...(transition.eqSettings || {
                                      lowCut: 0,
                                      midCut: 0,
                                      highCut: 0,
                                    }),
                                  };
                                  eqSettings.lowCut = value[0];
                                  onTransitionUpdate(fromTrackId, toTrackId, {
                                    eqSettings,
                                  });
                                }}
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Mid Cut</span>
                                <span className="text-sm">
                                  {transition.eqSettings?.midCut || 0}%
                                </span>
                              </div>
                              <Slider
                                value={[transition.eqSettings?.midCut || 0]}
                                max={100}
                                step={1}
                                onValueChange={(value) => {
                                  const eqSettings = {
                                    ...(transition.eqSettings || {
                                      lowCut: 0,
                                      midCut: 0,
                                      highCut: 0,
                                    }),
                                  };
                                  eqSettings.midCut = value[0];
                                  onTransitionUpdate(fromTrackId, toTrackId, {
                                    eqSettings,
                                  });
                                }}
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">High Cut</span>
                                <span className="text-sm">
                                  {transition.eqSettings?.highCut || 0}%
                                </span>
                              </div>
                              <Slider
                                value={[transition.eqSettings?.highCut || 0]}
                                max={100}
                                step={1}
                                onValueChange={(value) => {
                                  const eqSettings = {
                                    ...(transition.eqSettings || {
                                      lowCut: 0,
                                      midCut: 0,
                                      highCut: 0,
                                    }),
                                  };
                                  eqSettings.highCut = value[0];
                                  onTransitionUpdate(fromTrackId, toTrackId, {
                                    eqSettings,
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="preview-transition">
                            Preview Transition
                          </Label>
                          <Switch id="preview-transition" />
                        </div>

                        <Button variant="outline" size="sm">
                          <Wand2 className="h-4 w-4 mr-2" />
                          Auto-Optimize
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default MixTimelineEditor;
