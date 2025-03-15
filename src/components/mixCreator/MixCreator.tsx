import React, { useState, useEffect } from "react";
import {
  Save,
  Plus,
  Music,
  Download,
  Share2,
  Clock,
  Tag,
  AlertTriangle,
  Info,
  Headphones,
  BarChart2,
  Sliders,
  Settings,
  Copy,
  Twitter,
  Facebook,
  Instagram,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Wand2,
  Check,
  Puzzle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import TrackSelector from "./TrackSelector";
import MixTimeline from "./MixTimeline";
import TransitionEditor from "./TransitionEditor";
import HarmonicWheel from "../common/HarmonicWheel";
import MixCreationSelector from "./MixCreationSelector";
import SmartMixGenerator from "./SmartMixGenerator";
import ModularBlocksCreator from "./ModularBlocksCreator";

interface Track {
  id: string;
  title: string;
  artist: string;
  key: string;
  bpm: number;
  duration: number | string;
  waveform?: string;
  color?: string;
  compatible?: boolean;
  energy?: number;
  genre?: string;
  startPosition?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  volume?: number;
  eqSettings?: {
    low: number;
    mid: number;
    high: number;
  };
}

interface Transition {
  fromTrackId: string;
  toTrackId: string;
  duration: number;
  notes: string;
  type?: string;
  startPoint?: number;
  endPoint?: number;
  effectsApplied?: string[];
  eqSettings?: {
    lowCut: number;
    midCut: number;
    highCut: number;
  };
}

interface MixCreatorProps {
  initialMixTitle?: string;
  initialTracks?: Track[];
  selectedKey?: string;
  onKeySelect?: (key: string) => void;
  onSaveMix?: (mixData: any) => void;
  onExportMix?: (mixData: any) => void;
}

const MixCreator = ({
  initialMixTitle = "Untitled Mix",
  initialTracks = [],
  selectedKey = "8B", // Default to C major
  onKeySelect = () => {},
  onSaveMix = () => {},
  onExportMix = () => {},
}: MixCreatorProps) => {
  const [creationMethod, setCreationMethod] = useState<
    "selector" | "manual" | "smart" | "modular"
  >("selector");
  const [mixTitle, setMixTitle] = useState(initialMixTitle);
  const [mixDescription, setMixDescription] = useState("");
  const [mixGenre, setMixGenre] = useState("");
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [activeTab, setActiveTab] = useState("timeline");
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showHarmonicWheel, setShowHarmonicWheel] = useState(false);
  const [autoAnalyzeEnabled, setAutoAnalyzeEnabled] = useState(true);
  const [mixEnergy, setMixEnergy] = useState(0);
  const [mixProgress, setMixProgress] = useState(0);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState("mp3");
  const [exportQuality, setExportQuality] = useState("320");

  // Transitions data structure to store all transitions between tracks
  const [transitions, setTransitions] = useState<Record<string, Transition>>(
    {},
  );

  // Current transition being edited
  const [currentTransition, setCurrentTransition] = useState<{
    fromTrack: Track | null;
    toTrack: Track | null;
    duration: number;
    notes: string;
    type: string;
    effectsApplied: string[];
  }>({
    fromTrack: null,
    toTrack: null,
    duration: 16,
    notes: "",
    type: "beatmatch",
    effectsApplied: [],
  });

  // Calculate mix energy based on track energy levels
  useEffect(() => {
    if (tracks.length === 0) return;

    const avgEnergy =
      tracks.reduce((sum, track) => sum + (track.energy || 50), 0) /
      tracks.length;
    setMixEnergy(avgEnergy);

    // Calculate mix completion progress
    const hasAllTransitions =
      tracks.length <= 1 ||
      tracks.slice(0, -1).every((_, index) => {
        const transitionKey = `${tracks[index].id}-${tracks[index + 1].id}`;
        return transitions[transitionKey];
      });

    const progress =
      tracks.length === 0
        ? 0
        : ((tracks.length * 20 +
            (hasAllTransitions ? 40 : 0) +
            (mixTitle !== "Untitled Mix" ? 20 : 0) +
            (mixDescription ? 20 : 0)) /
            100) *
          100;

    setMixProgress(Math.min(100, progress));
  }, [tracks, transitions, mixTitle, mixDescription]);

  // Get compatible keys based on selected track
  const getCompatibleKeys = () => {
    if (!selectedTrack) return [];

    // This is a simplified version - in a real app, you would use the Camelot wheel
    // to determine truly compatible keys based on the selected track's key
    const keyMap: Record<string, string[]> = {
      Am: ["Em", "Dm", "C", "G", "F"],
      Bm: ["F#m", "Em", "D", "A", "G"],
      Cm: ["Gm", "Fm", "Eb", "Bb", "Ab"],
      Dm: ["Am", "Gm", "F", "C", "Bb"],
      Em: ["Bm", "Am", "G", "D", "C"],
      Fm: ["Cm", "Bbm", "Ab", "Eb", "Db"],
      Gm: ["Dm", "Cm", "Bb", "F", "Eb"],
      C: ["G", "F", "Am", "Em", "Dm"],
      D: ["A", "G", "Bm", "F#m", "Em"],
      E: ["B", "A", "C#m", "G#m", "F#m"],
      F: ["C", "Bb", "Dm", "Am", "Gm"],
      G: ["D", "C", "Em", "Bm", "Am"],
      A: ["E", "D", "F#m", "C#m", "Bm"],
      B: ["F#", "E", "G#m", "D#m", "C#m"],
    };

    return keyMap[selectedTrack.key] || [];
  };

  const handleAddTrack = (track: Track) => {
    // Convert string duration to number if needed
    const trackToAdd = {
      ...track,
      duration:
        typeof track.duration === "string"
          ? parseInt(track.duration.split(":")[0]) * 60 +
            parseInt(track.duration.split(":")[1])
          : track.duration,
      color: track.color || getRandomColor(),
      energy: track.energy || Math.floor(Math.random() * 30) + 50, // Random energy level if not provided
      startPosition: calculateStartPosition(tracks),
      volume: 100,
    };

    setTracks([...tracks, trackToAdd]);
    setSelectedTrack(trackToAdd);

    // If this is the second or later track, create a default transition
    if (tracks.length > 0) {
      const previousTrack = tracks[tracks.length - 1];
      const transitionKey = `${previousTrack.id}-${trackToAdd.id}`;

      setTransitions({
        ...transitions,
        [transitionKey]: {
          fromTrackId: previousTrack.id,
          toTrackId: trackToAdd.id,
          duration: 16,
          notes: "",
          type: "beatmatch",
          startPoint: 0.8, // Default to 80% of the first track
          endPoint: 0.2, // Default to 20% of the second track
          effectsApplied: [],
        },
      });
    }
  };

  // Calculate the start position for a new track
  const calculateStartPosition = (currentTracks: Track[]) => {
    if (currentTracks.length === 0) return 0;

    const lastTrack = currentTracks[currentTracks.length - 1];
    const lastTrackStart = lastTrack.startPosition || 0;
    const lastTrackDuration =
      typeof lastTrack.duration === "string"
        ? parseInt(lastTrack.duration.split(":")[0]) * 60 +
          parseInt(lastTrack.duration.split(":")[1])
        : lastTrack.duration;

    // Position the new track to overlap with the last track by 30 seconds (or less if the track is shorter)
    const overlap = Math.min(30, lastTrackDuration * 0.2);
    return lastTrackStart + lastTrackDuration - overlap;
  };

  const handleRemoveTrack = (trackId: string) => {
    // Find the index of the track to remove
    const trackIndex = tracks.findIndex((track) => track.id === trackId);
    if (trackIndex === -1) return;

    // Remove the track
    const newTracks = tracks.filter((track) => track.id !== trackId);
    setTracks(newTracks);

    // If the selected track is being removed, clear the selection
    if (selectedTrack?.id === trackId) {
      setSelectedTrack(null);
    }

    // Remove any transitions involving this track
    const newTransitions = { ...transitions };
    Object.keys(newTransitions).forEach((key) => {
      if (key.includes(trackId)) {
        delete newTransitions[key];
      }
    });

    // If we removed a track in the middle, and there are tracks before and after,
    // create a new transition between the now-adjacent tracks
    if (trackIndex > 0 && trackIndex < tracks.length - 1) {
      const beforeTrack = tracks[trackIndex - 1];
      const afterTrack = tracks[trackIndex + 1];
      const newTransitionKey = `${beforeTrack.id}-${afterTrack.id}`;

      newTransitions[newTransitionKey] = {
        fromTrackId: beforeTrack.id,
        toTrackId: afterTrack.id,
        duration: 16,
        notes: "Auto-created after track removal",
        type: "beatmatch",
        startPoint: 0.8,
        endPoint: 0.2,
        effectsApplied: [],
      };
    }

    setTransitions(newTransitions);
  };

  const handleTrackMove = (sourceIndex: number, destinationIndex: number) => {
    if (sourceIndex === destinationIndex) return;

    const result = Array.from(tracks);
    const [removed] = result.splice(sourceIndex, 1);
    result.splice(destinationIndex, 0, removed);

    // Update the tracks array
    setTracks(result);

    // Rebuild all transitions based on the new order
    const newTransitions: Record<string, Transition> = {};

    for (let i = 0; i < result.length - 1; i++) {
      const fromTrack = result[i];
      const toTrack = result[i + 1];
      const newKey = `${fromTrack.id}-${toTrack.id}`;

      // Check if this transition already exists
      const existingTransitionKey = Object.keys(transitions).find(
        (key) => key.includes(fromTrack.id) && key.includes(toTrack.id),
      );

      if (existingTransitionKey && transitions[existingTransitionKey]) {
        // Use existing transition data
        newTransitions[newKey] = {
          ...transitions[existingTransitionKey],
          fromTrackId: fromTrack.id,
          toTrackId: toTrack.id,
        };
      } else {
        // Create a new default transition
        newTransitions[newKey] = {
          fromTrackId: fromTrack.id,
          toTrackId: toTrack.id,
          duration: 16,
          notes: "Auto-created after track reordering",
          type: "beatmatch",
          startPoint: 0.8,
          endPoint: 0.2,
          effectsApplied: [],
        };
      }
    }

    setTransitions(newTransitions);
  };

  const handleTransitionSelect = (trackId: string, nextTrackId: string) => {
    const fromTrack = tracks.find((t) => t.id === trackId) || null;
    const toTrack = tracks.find((t) => t.id === nextTrackId) || null;

    if (!fromTrack || !toTrack) return;

    const transitionKey = `${trackId}-${nextTrackId}`;
    const existingTransition = transitions[transitionKey] || {
      duration: 16,
      notes: "",
      type: "beatmatch",
      effectsApplied: [],
    };

    setCurrentTransition({
      fromTrack,
      toTrack,
      duration: existingTransition.duration,
      notes: existingTransition.notes,
      type: existingTransition.type || "beatmatch",
      effectsApplied: existingTransition.effectsApplied || [],
    });

    setActiveTab("transition");
  };

  const handleSaveTransition = (data: {
    duration: number;
    notes: string;
    type?: string;
    effectsApplied?: string[];
  }) => {
    if (!currentTransition.fromTrack || !currentTransition.toTrack) return;

    const transitionKey = `${currentTransition.fromTrack.id}-${currentTransition.toTrack.id}`;

    setTransitions({
      ...transitions,
      [transitionKey]: {
        fromTrackId: currentTransition.fromTrack.id,
        toTrackId: currentTransition.toTrack.id,
        duration: data.duration,
        notes: data.notes,
        type: data.type || "beatmatch",
        effectsApplied: data.effectsApplied || [],
      },
    });

    setCurrentTransition({
      ...currentTransition,
      duration: data.duration,
      notes: data.notes,
      type: data.type || currentTransition.type,
      effectsApplied: data.effectsApplied || currentTransition.effectsApplied,
    });

    // Show a success message or notification
    // This could be implemented with a toast notification system
  };

  const handleSaveMix = () => {
    setIsSaving(true);

    // Simulate saving delay
    setTimeout(() => {
      const mixData = {
        title: mixTitle,
        description: mixDescription,
        genre: mixGenre,
        tracks,
        transitions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalDuration: calculateTotalDuration(),
        energy: mixEnergy,
        completionStatus: mixProgress === 100 ? "complete" : "draft",
      };

      onSaveMix(mixData);
      setIsSaving(false);
      setShowSaveSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setShowSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleExportMix = () => {
    setIsExporting(true);

    // Simulate export delay
    setTimeout(() => {
      const mixData = {
        title: mixTitle,
        description: mixDescription,
        genre: mixGenre,
        tracks,
        transitions,
        format: exportFormat,
        quality: exportQuality,
        exportDate: new Date().toISOString(),
      };

      onExportMix(mixData);
      setIsExporting(false);

      // Show export success message or open download dialog
      // This would typically trigger a file download in a real app
    }, 2000);
  };

  // Calculate total mix duration in seconds
  const calculateTotalDuration = () => {
    if (tracks.length === 0) return 0;

    // Find the last track's start position and add its duration
    const lastTrack = tracks[tracks.length - 1];
    const lastTrackStart = lastTrack.startPosition || 0;
    const lastTrackDuration =
      typeof lastTrack.duration === "string"
        ? parseInt(lastTrack.duration.split(":")[0]) * 60 +
          parseInt(lastTrack.duration.split(":")[1])
        : lastTrack.duration;

    return lastTrackStart + lastTrackDuration;
  };

  // Format seconds to MM:SS format
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Helper function to generate random colors for tracks
  const getRandomColor = () => {
    const colors = [
      "#4f46e5", // Indigo
      "#8b5cf6", // Violet
      "#ec4899", // Pink
      "#f97316", // Orange
      "#10b981", // Emerald
      "#06b6d4", // Cyan
      "#0ea5e9", // Sky
      "#6366f1", // Indigo
      "#d946ef", // Fuchsia
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Handle modular blocks creation completion
  const handleModularBlocksComplete = (blocks: any[], bridges: any[]) => {
    // Convert blocks and bridges to tracks and transitions
    const newTracks: Track[] = [];
    const newTransitions: Record<string, Transition> = {};

    // Process each block to create tracks
    blocks.forEach((block) => {
      block.trackPositions.forEach((position: any) => {
        if (position.trackId) {
          const track: Track = {
            id: position.trackId,
            title: position.trackName || `Track in ${block.name}`,
            artist: "Unknown Artist",
            key: position.key,
            bpm: 128, // Default BPM
            duration: 240, // Default duration in seconds
            energy: position.energy,
            color: block.color,
            startPosition:
              newTracks.length > 0 ? calculateStartPosition(newTracks) : 0,
          };
          newTracks.push(track);
        }
      });
    });

    // Process bridges to create transitions
    bridges.forEach((bridge) => {
      if (
        bridge.trackPositions.length >= 2 &&
        bridge.trackPositions[0].trackId &&
        bridge.trackPositions[1].trackId
      ) {
        const fromTrackId = bridge.trackPositions[0].trackId;
        const toTrackId = bridge.trackPositions[1].trackId;
        const transitionKey = `${fromTrackId}-${toTrackId}`;

        newTransitions[transitionKey] = {
          fromTrackId,
          toTrackId,
          duration: 16, // Default duration
          notes: `${bridge.type} transition`,
          type: bridge.type.toLowerCase(),
          startPoint: 0.8,
          endPoint: 0.2,
          effectsApplied: [],
        };
      }
    });

    // Update state with new tracks and transitions
    setTracks(newTracks);
    setTransitions(newTransitions);
    setCreationMethod("manual"); // Switch to manual mode to edit the created mix
  };

  // Render the component UI
  return (
    <div className="w-full h-full bg-background">
      {creationMethod === "selector" && (
        <MixCreationSelector
          onSelectMethod={(method) => setCreationMethod(method)}
        />
      )}

      {creationMethod === "smart" && (
        <SmartMixGenerator
          onGenerateMix={(generatedTracks) => {
            setTracks(generatedTracks);
            setCreationMethod("manual");
          }}
          onCancel={() => setCreationMethod("selector")}
        />
      )}

      {creationMethod === "modular" && (
        <ModularBlocksCreator
          onComplete={handleModularBlocksComplete}
          onCancel={() => setCreationMethod("selector")}
        />
      )}

      {creationMethod === "manual" && (
        <div className="flex flex-col h-full">
          {/* Header with mix info */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Mix title"
                  className="text-xl font-bold border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                  value={mixTitle}
                  onChange={(e) => setMixTitle(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHarmonicWheel(!showHarmonicWheel)}
                >
                  <Music className="mr-2 h-4 w-4" />
                  Harmonic Wheel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowShareDialog(true)}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportMix}
                  disabled={isExporting}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isExporting ? "Exporting..." : "Export"}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveMix}
                  disabled={isSaving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Mix"}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 flex items-center gap-4">
                <div className="w-64">
                  <Select
                    value={mixGenre || ""}
                    onValueChange={setMixGenre}
                    placeholder="Select genre"
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="techno">Techno</SelectItem>
                      <SelectItem value="trance">Trance</SelectItem>
                      <SelectItem value="drum-and-bass">Drum & Bass</SelectItem>
                      <SelectItem value="dubstep">Dubstep</SelectItem>
                      <SelectItem value="ambient">Ambient</SelectItem>
                      <SelectItem value="hip-hop">Hip Hop</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(calculateTotalDuration())}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Music className="h-3 w-3" />
                    {tracks.length} tracks
                  </Badge>
                  {mixEnergy > 0 && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <BarChart2 className="h-3 w-3" />
                      Energy: {Math.round(mixEnergy)}%
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Label
                    htmlFor="auto-analyze"
                    className="text-xs text-muted-foreground"
                  >
                    Auto-analyze
                  </Label>
                  <Switch
                    id="auto-analyze"
                    checked={autoAnalyzeEnabled}
                    onCheckedChange={setAutoAnalyzeEnabled}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Completion:
                  </span>
                  <Progress
                    value={mixProgress}
                    className="w-24 h-2"
                    style={
                      {
                        "--progress-color":
                          mixProgress < 50
                            ? "hsl(var(--warning))"
                            : mixProgress < 80
                              ? "hsl(var(--info))"
                              : "hsl(var(--success))",
                      } as React.CSSProperties
                    }
                  />
                  <span className="text-xs font-medium">{mixProgress}%</span>
                </div>
              </div>
            </div>

            {showSaveSuccess && (
              <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
                <Check className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Your mix has been saved successfully.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Left sidebar - Track selector */}
            <TrackSelector
              selectedTrack={selectedTrack}
              onTrackSelect={handleAddTrack}
              compatibleKeys={getCompatibleKeys()}
              handleAddTrack={handleAddTrack}
            />

            {/* Main content area */}
            <div className="flex-1 overflow-auto p-4">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full h-full"
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="transition">
                    Transition Editor
                  </TabsTrigger>
                  <TabsTrigger value="details">Mix Details</TabsTrigger>
                  <TabsTrigger value="modular">Modular Blocks</TabsTrigger>
                </TabsList>

                <TabsContent value="timeline" className="h-[calc(100%-40px)]">
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <MixTimeline
                        tracks={tracks}
                        transitions={transitions}
                        onTrackMove={handleTrackMove}
                        onTrackRemove={handleRemoveTrack}
                        onTransitionAdjust={(fromId, toId, data) => {
                          const key = `${fromId}-${toId}`;
                          setTransitions({
                            ...transitions,
                            [key]: {
                              ...transitions[key],
                              ...data,
                              fromTrackId: fromId,
                              toTrackId: toId,
                            },
                          });
                        }}
                        onPreviewTransition={handleTransitionSelect}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="transition" className="h-[calc(100%-40px)]">
                  {currentTransition.fromTrack && currentTransition.toTrack ? (
                    <TransitionEditor
                      currentTrack={currentTransition.fromTrack}
                      nextTrack={currentTransition.toTrack}
                      transitionDuration={currentTransition.duration}
                      transitionNotes={currentTransition.notes}
                      onSaveTransition={handleSaveTransition}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        No Transition Selected
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-md">
                        Select a transition point between two tracks in the
                        timeline to edit it. You can click on the transition
                        markers or use the "Preview" button on any transition.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="details" className="h-[calc(100%-40px)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Mix Details</CardTitle>
                        <CardDescription>
                          Add information about your mix
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="mix-description">Description</Label>
                          <Textarea
                            id="mix-description"
                            placeholder="Describe your mix..."
                            value={mixDescription}
                            onChange={(e) => setMixDescription(e.target.value)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="modular" className="h-[calc(100%-40px)]">
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <Puzzle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Modular Blocks Editor
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-md mb-4">
                      You can use the modular blocks approach to quickly create
                      structured mixes with consistent harmonic patterns.
                    </p>
                    <Button
                      onClick={() => setCreationMethod("modular")}
                      className="flex items-center gap-2"
                    >
                      <Puzzle className="h-4 w-4" />
                      Open Modular Blocks Editor
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MixCreator;
