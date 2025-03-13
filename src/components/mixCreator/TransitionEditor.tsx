import React, { useState } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Save,
  Volume2,
  VolumeX,
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

  return (
    <div className="w-full bg-background border rounded-lg p-4 shadow-md">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Transition Editor</h2>
          <Button variant="outline" size="sm" onClick={handleSaveTransition}>
            <Save className="mr-2 h-4 w-4" />
            Save Transition
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Waveform visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Current Track: {currentTrack.title} - {currentTrack.artist}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-24 bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={currentTrack.waveform}
                  alt="Track waveform"
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="relative h-1 bg-primary w-1/3 -mt-12 mx-4"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Next Track: {nextTrack.title} - {nextTrack.artist}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-24 bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={nextTrack.waveform}
                  alt="Track waveform"
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="relative h-1 bg-secondary w-1/3 -mt-12 mx-4"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transition controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-center space-x-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => {}}>
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
                      <Button variant="outline" size="icon" onClick={() => {}}>
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Skip 10 seconds forward</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
