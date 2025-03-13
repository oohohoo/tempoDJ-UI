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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
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
    return tracks.reduce((total, track) => {
      const duration =
        typeof track.duration === "string"
          ? parseInt(track.duration.split(":")[0]) * 60 +
            parseInt(track.duration.split(":")[1])
          : track.duration;
      return total + duration;
    }, 0);
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
      "#8b5cf6", // Violet
      "#d946ef", // Fuchsia
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Check if there are any key compatibility issues in the mix
  const hasKeyCompatibilityIssues = () => {
    if (tracks.length <= 1) return false;

    for (let i = 0; i < tracks.length - 1; i++) {
      const currentTrack = tracks[i];
      const nextTrack = tracks[i + 1];

      // This is a simplified check - in a real app, you would use the Camelot wheel
      // to determine if keys are compatible
      const keyMap: Record<string, string[]> = {
        Am: ["Em", "Dm", "C", "G", "F"],
        Bm: ["F#m", "Em", "D", "A", "G"],
        Cm: ["Gm", "Fm", "Eb", "Bb", "Ab"],
        Dm: ["Am", "Gm", "F", "C", "Bb"],
        Em: ["Bm", "Am", "G", "D", "C"],
        C: ["G", "F", "Am", "Em", "Dm"],
        D: ["A", "G", "Bm", "F#m", "Em"],
        E: ["B", "A", "C#m", "G#m", "F#m"],
        F: ["C", "Bb", "Dm", "Am", "Gm"],
        G: ["D", "C", "Em", "Bm", "Am"],
        A: ["E", "D", "F#m", "C#m", "Bm"],
        B: ["F#", "E", "G#m", "D#m", "C#m"],
      };

      const compatibleKeys = keyMap[currentTrack.key] || [];
      if (!compatibleKeys.includes(nextTrack.key)) {
        return true;
      }
    }

    return false;
  };

  // Check if there are any BPM transition issues (large BPM jumps)
  const hasBpmTransitionIssues = () => {
    if (tracks.length <= 1) return false;

    for (let i = 0; i < tracks.length - 1; i++) {
      const currentTrack = tracks[i];
      const nextTrack = tracks[i + 1];

      // Consider a BPM difference of more than 8 as potentially problematic
      if (Math.abs(currentTrack.bpm - nextTrack.bpm) > 8) {
        return true;
      }
    }

    return false;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header with mix title and actions */}
      <div className="p-4 border-b flex items-center justify-between bg-white">
        <div className="flex items-center gap-4 flex-1">
          <Music className="h-6 w-6 text-primary" />
          <Input
            value={mixTitle}
            onChange={(e) => setMixTitle(e.target.value)}
            className="max-w-xs font-medium text-lg"
            placeholder="Enter mix title"
          />
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Music className="h-3 w-3" />
              {tracks.length} tracks
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(calculateTotalDuration())}
            </Badge>
            {mixGenre && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {mixGenre}
              </Badge>
            )}
            <Badge
              variant={mixProgress === 100 ? "default" : "outline"}
              className="flex items-center gap-1"
            >
              {mixProgress === 100
                ? "Complete"
                : `${Math.floor(mixProgress)}% Complete`}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowHarmonicWheel(true)}
                >
                  <BarChart2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Harmonic Wheel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="outline"
            onClick={() => setShowShareDialog(true)}
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>

          <Button
            variant="outline"
            onClick={handleExportMix}
            disabled={isExporting || tracks.length === 0}
            className="gap-2"
          >
            {isExporting ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                Exporting...
              </span>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export
              </>
            )}
          </Button>

          <Button
            onClick={handleSaveMix}
            disabled={isSaving || tracks.length === 0}
            className="gap-2"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></div>
                Saving...
              </span>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Mix
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Save success message */}
      {showSaveSuccess && (
        <div className="px-4 py-2 bg-green-50 border-b border-green-200 flex items-center justify-between">
          <span className="text-green-700 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Mix saved successfully!
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSaveSuccess(false)}
            className="h-6 text-green-700 hover:text-green-800 hover:bg-green-100"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Mix description */}
      <div className="px-4 py-2 border-b bg-white">
        <Textarea
          placeholder="Add a description for your mix..."
          className="resize-none h-16"
          value={mixDescription}
          onChange={(e) => setMixDescription(e.target.value)}
        />
      </div>

      {/* Warning alerts for key or BPM issues */}
      {(hasKeyCompatibilityIssues() || hasBpmTransitionIssues()) && (
        <div className="px-4 py-2 border-b">
          {hasKeyCompatibilityIssues() && (
            <Alert variant="warning" className="mb-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Key Compatibility Warning</AlertTitle>
              <AlertDescription>
                Some tracks in your mix have keys that may not be harmonically
                compatible. Check the harmonic wheel to ensure smooth
                transitions.
              </AlertDescription>
            </Alert>
          )}

          {hasBpmTransitionIssues() && (
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>BPM Transition Warning</AlertTitle>
              <AlertDescription>
                There are significant BPM changes between some tracks. Consider
                reordering tracks or using tempo adjustment during transitions.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Track selector sidebar */}
        <TrackSelector
          selectedTrack={selectedTrack}
          onTrackSelect={(track) => {
            if (tracks.some((t) => t.id === track.id)) {
              setSelectedTrack(track);
            } else {
              handleAddTrack(track);
            }
          }}
          compatibleKeys={selectedTrack ? getCompatibleKeys() : undefined}
        />

        {/* Main editor area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <div className="px-4 pt-4 bg-gray-50 border-b">
              <TabsList>
                <TabsTrigger
                  value="timeline"
                  className="flex items-center gap-1"
                >
                  <BarChart2 className="h-4 w-4" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger
                  value="transition"
                  className="flex items-center gap-1"
                >
                  <Sliders className="h-4 w-4" />
                  Transition Editor
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="flex items-center gap-1"
                >
                  <Headphones className="h-4 w-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="flex items-center gap-1"
                >
                  <Settings className="h-4 w-4" />
                  Mix Settings
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="timeline"
              className="flex-1 p-4 overflow-auto m-0"
            >
              {tracks.length > 0 ? (
                <MixTimeline
                  tracks={tracks}
                  onTrackMove={handleTrackMove}
                  onTrackRemove={handleRemoveTrack}
                  onPreviewTransition={handleTransitionSelect}
                  transitions={transitions}
                />
              ) : (
                <Card className="w-full h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      No tracks in your mix yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Select tracks from the library to add them to your mix
                    </p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Track
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent
              value="transition"
              className="flex-1 p-4 overflow-auto m-0"
            >
              {currentTransition.fromTrack && currentTransition.toTrack ? (
                <TransitionEditor
                  currentTrack={{
                    id: currentTransition.fromTrack.id,
                    title: currentTransition.fromTrack.title,
                    artist: currentTransition.fromTrack.artist,
                    waveform: currentTransition.fromTrack.waveform,
                  }}
                  nextTrack={{
                    id: currentTransition.toTrack.id,
                    title: currentTransition.toTrack.title,
                    artist: currentTransition.toTrack.artist,
                    waveform: currentTransition.toTrack.waveform,
                  }}
                  transitionDuration={currentTransition.duration}
                  transitionNotes={currentTransition.notes}
                  transitionType={currentTransition.type}
                  effectsApplied={currentTransition.effectsApplied}
                  onSaveTransition={handleSaveTransition}
                />
              ) : (
                <Card className="w-full h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">
                      No transition selected
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Select a transition point in the timeline to edit it
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent
              value="preview"
              className="flex-1 p-4 overflow-auto m-0"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Mix Preview</CardTitle>
                  <CardDescription>
                    Listen to your mix and check how the transitions sound
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {tracks.length > 0 ? (
                    <div className="space-y-6">
                      <div className="relative h-40 bg-muted rounded-md overflow-hidden">
                        {/* Waveform visualization would go here */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-muted-foreground">
                            Waveform visualization
                          </p>
                        </div>

                        {/* Playback controls */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                          <div className="bg-background/80 backdrop-blur-sm rounded-full p-2 flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                            >
                              <SkipBack className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="default"
                              size="icon"
                              className="h-10 w-10 rounded-full"
                            >
                              <Play className="h-5 w-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                            >
                              <SkipForward className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>0:00</span>
                          <span>
                            {formatDuration(calculateTotalDuration())}
                          </span>
                        </div>
                        <Slider
                          defaultValue={[0]}
                          max={calculateTotalDuration()}
                          step={1}
                        />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">
                          Currently Playing
                        </h3>
                        <div className="p-3 bg-muted rounded-md">
                          <div className="font-medium">{tracks[0].title}</div>
                          <div className="text-sm text-muted-foreground">
                            {tracks[0].artist}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">
                          Playback Settings
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="playback-speed">
                              Playback Speed
                            </Label>
                            <Select defaultValue="1">
                              <SelectTrigger id="playback-speed">
                                <SelectValue placeholder="Select speed" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0.5">0.5x</SelectItem>
                                <SelectItem value="0.75">0.75x</SelectItem>
                                <SelectItem value="1">1x (Normal)</SelectItem>
                                <SelectItem value="1.25">1.25x</SelectItem>
                                <SelectItem value="1.5">1.5x</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="volume">Volume</Label>
                            <Slider
                              id="volume"
                              defaultValue={[80]}
                              max={100}
                              step={1}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Add tracks to your mix to enable preview
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="settings"
              className="flex-1 p-4 overflow-auto m-0"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mix Information</CardTitle>
                    <CardDescription>
                      Basic information about your mix
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mix-title">Title</Label>
                      <Input
                        id="mix-title"
                        value={mixTitle}
                        onChange={(e) => setMixTitle(e.target.value)}
                        placeholder="Enter mix title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mix-genre">Genre</Label>
                      <Select value={mixGenre} onValueChange={setMixGenre}>
                        <SelectTrigger id="mix-genre">
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="techno">Techno</SelectItem>
                          <SelectItem value="trance">Trance</SelectItem>
                          <SelectItem value="drum-and-bass">
                            Drum & Bass
                          </SelectItem>
                          <SelectItem value="dubstep">Dubstep</SelectItem>
                          <SelectItem value="ambient">Ambient</SelectItem>
                          <SelectItem value="hip-hop">Hip Hop</SelectItem>
                          <SelectItem value="pop">Pop</SelectItem>
                          <SelectItem value="rock">Rock</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mix-description">Description</Label>
                      <Textarea
                        id="mix-description"
                        value={mixDescription}
                        onChange={(e) => setMixDescription(e.target.value)}
                        placeholder="Describe your mix..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="mix-energy"
                        className="flex justify-between"
                      >
                        <span>Energy Level</span>
                        <span>{mixEnergy.toFixed(0)}%</span>
                      </Label>
                      <Progress value={mixEnergy} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Energy level is calculated based on the tracks in your
                        mix
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Export Settings</CardTitle>
                    <CardDescription>
                      Configure how your mix will be exported
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="export-format">File Format</Label>
                      <Select
                        value={exportFormat}
                        onValueChange={setExportFormat}
                      >
                        <SelectTrigger id="export-format">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mp3">MP3</SelectItem>
                          <SelectItem value="wav">WAV</SelectItem>
                          <SelectItem value="aac">AAC</SelectItem>
                          <SelectItem value="flac">FLAC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="export-quality">Quality</Label>
                      <Select
                        value={exportQuality}
                        onValueChange={setExportQuality}
                      >
                        <SelectTrigger id="export-quality">
                          <SelectValue placeholder="Select quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="128">128 kbps</SelectItem>
                          <SelectItem value="192">192 kbps</SelectItem>
                          <SelectItem value="256">256 kbps</SelectItem>
                          <SelectItem value="320">320 kbps</SelectItem>
                          <SelectItem value="lossless">Lossless</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="normalize-audio">Normalize Audio</Label>
                        <Switch id="normalize-audio" defaultChecked />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Automatically adjust volume levels across all tracks
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-analyze">
                          Auto-Analyze Tracks
                        </Label>
                        <Switch
                          id="auto-analyze"
                          checked={autoAnalyzeEnabled}
                          onCheckedChange={setAutoAnalyzeEnabled}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Automatically analyze tracks for key and BPM when added
                      </p>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={handleExportMix}
                        disabled={isExporting || tracks.length === 0}
                        className="w-full"
                      >
                        {isExporting ? "Exporting..." : "Export Mix"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Harmonic Wheel Dialog */}
      <Dialog open={showHarmonicWheel} onOpenChange={setShowHarmonicWheel}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Harmonic Wheel</DialogTitle>
            <DialogDescription>
              Use the harmonic wheel to find compatible keys for your mix
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <HarmonicWheel
              selectedKey={selectedKey}
              onKeySelect={onKeySelect}
              size={300}
              highlightCompatible={true}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setShowHarmonicWheel(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Mix</DialogTitle>
            <DialogDescription>
              Share your mix with other DJs or on social media
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="share-link">Share Link</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="share-link"
                  readOnly
                  value={`https://harmonic-dj.example.com/mix/${mixTitle.toLowerCase().replace(/\s+/g, "-")}`}
                />
                <Button variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Share on Social Media</Label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
                <Button variant="outline" className="flex-1">
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
                <Button variant="outline" className="flex-1">
                  <Instagram className="h-4 w-4 mr-2" />
                  Instagram
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowShareDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MixCreator;
