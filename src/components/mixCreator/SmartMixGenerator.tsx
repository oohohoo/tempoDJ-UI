import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  FolderOpen,
  Wand2,
  BarChart2,
  Music,
  Clock,
  Zap,
  ArrowRight,
  Check,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import HarmonicWheel from "../common/HarmonicWheel";

interface Track {
  id: string;
  title: string;
  artist: string;
  key: string;
  bpm: number;
  duration: number;
  energy?: number;
  genre?: string;
  color?: string;
  imageUrl?: string;
}

interface MixStyle {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  compatibility: number;
  rules: {
    keyProgression: string;
    bpmRange: [number, number];
    energyFlow: string;
  };
}

interface SmartMixGeneratorProps {
  onGenerateMix?: (tracks: Track[]) => void;
  onCancel?: () => void;
}

const SmartMixGenerator = ({
  onGenerateMix = () => {},
  onCancel = () => {},
}: SmartMixGeneratorProps) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [folderTracks, setFolderTracks] = useState<Track[]>([]);
  const [selectedMixStyle, setSelectedMixStyle] = useState<string>("");
  const [trackCount, setTrackCount] = useState<number>(8);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMix, setGeneratedMix] = useState<Track[]>([]);
  const [mixStats, setMixStats] = useState({
    harmonyScore: 0,
    bpmConsistency: 0,
    energyFlow: 0,
    overallScore: 0,
  });
  const [firstTrackSelection, setFirstTrackSelection] =
    useState<string>("random");
  const [selectedFirstTrack, setSelectedFirstTrack] = useState<string>("");
  const [powerBlockSize, setPowerBlockSize] = useState<string>("0");
  const [bpmTrend, setBpmTrend] = useState<string>("stable");

  // Mock data for available mix styles
  const mixStyles: MixStyle[] = [
    {
      id: "progressive",
      name: "Progressive Journey",
      description: "Gradually build energy with smooth key changes",
      icon: <Zap className="h-8 w-8" />,
      compatibility: 92,
      rules: {
        keyProgression: "Clockwise movement on Camelot wheel",
        bpmRange: [2, 6],
        energyFlow: "Gradually increasing",
      },
    },
    {
      id: "peaktime",
      name: "Peak Time Energy",
      description: "High energy tracks with compatible keys",
      icon: <BarChart2 className="h-8 w-8" />,
      compatibility: 78,
      rules: {
        keyProgression: "Same or adjacent keys",
        bpmRange: [0, 4],
        energyFlow: "Consistently high",
      },
    },
    {
      id: "deepflow",
      name: "Deep & Melodic Flow",
      description: "Hypnotic progression with related minor keys",
      icon: <Music className="h-8 w-8" />,
      compatibility: 85,
      rules: {
        keyProgression: "Minor keys with occasional relative major",
        bpmRange: [3, 8],
        energyFlow: "Wave pattern with subtle peaks",
      },
    },
    {
      id: "warmup",
      name: "Warm-Up Set",
      description: "Gradual BPM increase with compatible keys",
      icon: <Clock className="h-8 w-8" />,
      compatibility: 64,
      rules: {
        keyProgression: "Free movement within compatible keys",
        bpmRange: [5, 15],
        energyFlow: "Steadily increasing",
      },
    },
  ];

  // Mock function to simulate folder selection
  const handleFolderSelect = () => {
    // In a real app, this would open a folder picker
    setSelectedFolder("/Music/DJ Sets/Summer 2023");

    // Mock data for tracks in the selected folder
    const mockTracks: Track[] = [
      {
        id: "1",
        title: "Summer Vibes",
        artist: "DJ Sunshine",
        key: "8B", // C Major
        bpm: 128,
        duration: 320,
        energy: 75,
        genre: "House",
        imageUrl:
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
      },
      {
        id: "2",
        title: "Midnight Groove",
        artist: "Night Owl",
        key: "9B", // G Major
        bpm: 126,
        duration: 345,
        energy: 65,
        genre: "Deep House",
        imageUrl:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80",
      },
      {
        id: "3",
        title: "Deep Dive",
        artist: "Ocean Beats",
        key: "10B", // D Major
        bpm: 124,
        duration: 298,
        energy: 60,
        genre: "Progressive House",
        imageUrl:
          "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80",
      },
      {
        id: "4",
        title: "Sunset Boulevard",
        artist: "Coastal Vibes",
        key: "11B", // A Major
        bpm: 122,
        duration: 312,
        energy: 55,
        genre: "Melodic House",
        imageUrl:
          "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
      },
      {
        id: "5",
        title: "Urban Jungle",
        artist: "City Beats",
        key: "12B", // E Major
        bpm: 130,
        duration: 305,
        energy: 80,
        genre: "Tech House",
        imageUrl:
          "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&q=80",
      },
      {
        id: "6",
        title: "Neon Lights",
        artist: "Glow Stick",
        key: "1B", // B Major
        bpm: 132,
        duration: 318,
        energy: 85,
        genre: "Techno",
        imageUrl:
          "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&q=80",
      },
      {
        id: "7",
        title: "Desert Storm",
        artist: "Sand Walker",
        key: "2B", // F# Major
        bpm: 134,
        duration: 325,
        energy: 90,
        genre: "Progressive Trance",
        imageUrl:
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
      },
      {
        id: "8",
        title: "Mountain High",
        artist: "Peak Climber",
        key: "3B", // Db Major
        bpm: 136,
        duration: 330,
        energy: 95,
        genre: "Trance",
        imageUrl:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80",
      },
      {
        id: "9",
        title: "Ocean Waves",
        artist: "Beach DJ",
        key: "4B", // Ab Major
        bpm: 120,
        duration: 300,
        energy: 50,
        genre: "Chill House",
        imageUrl:
          "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80",
      },
      {
        id: "10",
        title: "Starry Night",
        artist: "Cosmic Sounds",
        key: "5B", // Eb Major
        bpm: 118,
        duration: 295,
        energy: 45,
        genre: "Ambient House",
        imageUrl:
          "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
      },
      {
        id: "11",
        title: "City Lights",
        artist: "Urban Legend",
        key: "6B", // Bb Major
        bpm: 125,
        duration: 310,
        energy: 70,
        genre: "Deep Tech",
        imageUrl:
          "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&q=80",
      },
      {
        id: "12",
        title: "Forest Retreat",
        artist: "Nature Sounds",
        key: "7B", // F Major
        bpm: 123,
        duration: 315,
        energy: 60,
        genre: "Organic House",
        imageUrl:
          "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&q=80",
      },
    ];

    setFolderTracks(mockTracks);
  };

  // Calculate compatibility scores for mix styles based on folder tracks
  useEffect(() => {
    if (folderTracks.length > 0) {
      // In a real app, this would analyze the tracks and calculate actual compatibility
      // For now, we'll just use the mock data
    }
  }, [folderTracks]);

  // Generate a mix based on selected style and track count
  const generateMix = () => {
    setIsGenerating(true);

    // Simulate mix generation with a delay
    setTimeout(() => {
      // In a real app, this would use algorithms based on the selected mix style
      // to select and order tracks from the folder

      // For now, we'll just select random tracks and assign colors based on Camelot wheel
      const selectedTracks = [...folderTracks]
        .sort(() => 0.5 - Math.random())
        .slice(0, trackCount);

      // Assign colors based on harmonic relationships
      const coloredTracks = selectedTracks.map((track, index) => {
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

        return {
          ...track,
          color: colors[index % colors.length],
        };
      });

      setGeneratedMix(coloredTracks);

      // Calculate mock stats for the generated mix
      setMixStats({
        harmonyScore: Math.floor(Math.random() * 20) + 80, // 80-100
        bpmConsistency: Math.floor(Math.random() * 30) + 70, // 70-100
        energyFlow: Math.floor(Math.random() * 25) + 75, // 75-100
        overallScore: Math.floor(Math.random() * 15) + 85, // 85-100
      });

      setIsGenerating(false);
      setStep(3);
    }, 2000);
  };

  const handleFinish = () => {
    onGenerateMix(generatedMix);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-background">
      {/* Header with steps */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-4">
          Smart Mix Generator
        </h1>
        <div className="flex items-center">
          <div
            className={`flex items-center ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-current">
              {step > 1 ? <Check className="h-4 w-4" /> : "1"}
            </div>
            <span className="ml-2 font-medium">Select Tracks</span>
          </div>
          <div className="w-12 h-0.5 mx-2 bg-border"></div>
          <div
            className={`flex items-center ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-current">
              {step > 2 ? <Check className="h-4 w-4" /> : "2"}
            </div>
            <span className="ml-2 font-medium">Choose Style</span>
          </div>
          <div className="w-12 h-0.5 mx-2 bg-border"></div>
          <div
            className={`flex items-center ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-current">
              "3"
            </div>
            <span className="ml-2 font-medium">Review Mix</span>
          </div>
        </div>
      </div>

      {/* Step 1: Select folder */}
      {step === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Track Source</CardTitle>
              <CardDescription>
                Choose a folder containing the tracks you want to use for your
                mix
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    value={selectedFolder}
                    readOnly
                    placeholder="No folder selected"
                    className="bg-muted"
                  />
                </div>
                <Button onClick={handleFolderSelect}>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Browse
                </Button>
              </div>

              {folderTracks.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">
                      Tracks in folder: {folderTracks.length}
                    </h3>
                    <Badge variant="outline">
                      {folderTracks.length} tracks found
                    </Badge>
                  </div>
                  <div className="border rounded-md overflow-hidden">
                    <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-3 bg-muted font-medium text-sm">
                      <div></div>
                      <div>Track</div>
                      <div>Key</div>
                      <div>BPM</div>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {folderTracks.slice(0, 6).map((track) => (
                        <div
                          key={track.id}
                          className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-3 border-t"
                        >
                          <div className="w-10 h-10 rounded-md overflow-hidden">
                            {track.imageUrl ? (
                              <img
                                src={track.imageUrl}
                                alt={track.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Music className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{track.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {track.artist}
                            </div>
                          </div>
                          <div className="text-center">{track.key}</div>
                          <div className="text-center">{track.bpm}</div>
                        </div>
                      ))}
                      {folderTracks.length > 6 && (
                        <div className="p-3 border-t text-center text-sm text-muted-foreground">
                          + {folderTracks.length - 6} more tracks
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                onClick={() => setStep(2)}
                disabled={folderTracks.length === 0}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Step 2: Choose mix style */}
      {step === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Choose Mix Style</CardTitle>
              <CardDescription>
                Select a mix style template that matches your tracks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {mixStyles.map((style) => (
                  <div
                    key={style.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedMixStyle === style.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-primary/50"}`}
                    onClick={() => setSelectedMixStyle(style.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-full text-primary">
                        {style.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{style.name}</h3>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            {style.compatibility}% match
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {style.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedMixStyle && (
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h3 className="font-medium mb-2">
                    {mixStyles.find((s) => s.id === selectedMixStyle)?.name}{" "}
                    Rules
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Key Progression</div>
                      <div className="text-muted-foreground">
                        {
                          mixStyles.find((s) => s.id === selectedMixStyle)
                            ?.rules.keyProgression
                        }
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">BPM Range</div>
                      <div className="text-muted-foreground">
                        ±
                        {
                          mixStyles.find((s) => s.id === selectedMixStyle)
                            ?.rules.bpmRange[1]
                        }{" "}
                        BPM between tracks
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Energy Flow</div>
                      <div className="text-muted-foreground">
                        {
                          mixStyles.find((s) => s.id === selectedMixStyle)
                            ?.rules.energyFlow
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">First Track Selection</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Select
                        value={firstTrackSelection}
                        onValueChange={setFirstTrackSelection}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="random">
                            Random First Track
                          </SelectItem>
                          <SelectItem value="select">
                            Select First Track
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {firstTrackSelection === "select" && (
                      <div>
                        <Select
                          value={selectedFirstTrack}
                          onValueChange={setSelectedFirstTrack}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select track" />
                          </SelectTrigger>
                          <SelectContent>
                            {folderTracks.map((track) => (
                              <SelectItem key={track.id} value={track.id}>
                                {track.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Number of tracks in mix</h3>
                    <span className="font-medium">{trackCount} tracks</span>
                  </div>
                  <Slider
                    value={[trackCount]}
                    min={4}
                    max={Math.min(30, folderTracks.length)}
                    step={1}
                    onValueChange={(value) => setTrackCount(value[0])}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Power Block Size</h3>
                  </div>
                  <Select
                    value={powerBlockSize}
                    onValueChange={setPowerBlockSize}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select power block size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No Power Blocks</SelectItem>
                      <SelectItem value="3">3 Tracks</SelectItem>
                      <SelectItem value="4">4 Tracks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">BPM Trend</h3>
                  </div>
                  <Select value={bpmTrend} onValueChange={setBpmTrend}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select BPM trend" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stable">Keep BPM Stable</SelectItem>
                      <SelectItem value="increase">
                        Gradually Increase BPM
                      </SelectItem>
                      <SelectItem value="decrease">
                        Gradually Decrease BPM
                      </SelectItem>
                      <SelectItem value="alternate">
                        Alternating Up and Down
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={generateMix}
                disabled={!selectedMixStyle || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Mix
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Step 3: Review generated mix */}
      {step === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Generated Mix</CardTitle>
                  <CardDescription>
                    Review your automatically generated harmonic mix
                  </CardDescription>
                </div>
                <Badge className="px-3 py-1">
                  {mixStyles.find((s) => s.id === selectedMixStyle)?.name}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="tracks">
                <TabsList className="mb-4">
                  <TabsTrigger value="tracks">Track List</TabsTrigger>
                  <TabsTrigger value="analysis">Mix Analysis</TabsTrigger>
                  <TabsTrigger value="harmony">Harmonic Wheel</TabsTrigger>
                </TabsList>

                <TabsContent value="tracks" className="space-y-4">
                  <div className="border rounded-md overflow-hidden">
                    <div className="grid grid-cols-[auto_auto_1fr_auto_auto] gap-4 p-3 bg-muted font-medium text-sm">
                      <div>#</div>
                      <div></div>
                      <div>Track</div>
                      <div>Key</div>
                      <div>BPM</div>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {generatedMix.map((track, index) => (
                        <div
                          key={track.id}
                          className="grid grid-cols-[auto_auto_1fr_auto_auto] gap-4 p-3 border-t"
                          style={{ backgroundColor: `${track.color}10` }}
                        >
                          <div className="font-medium">{index + 1}</div>
                          <div className="w-10 h-10 rounded-md overflow-hidden">
                            {track.imageUrl ? (
                              <img
                                src={track.imageUrl}
                                alt={track.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Music className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{track.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {track.artist}
                            </div>
                          </div>
                          <div className="text-center">
                            <Badge
                              variant="outline"
                              className="font-mono"
                              style={{
                                borderColor: track.color,
                                color: track.color,
                              }}
                            >
                              {track.key}
                            </Badge>
                          </div>
                          <div className="text-center">{track.bpm}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Tracks
                        </div>
                        <div className="font-medium">{generatedMix.length}</div>
                      </div>
                      <Separator orientation="vertical" className="h-8" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Total Duration
                        </div>
                        <div className="font-medium">
                          {Math.floor(
                            generatedMix.reduce(
                              (acc, track) => acc + track.duration,
                              0,
                            ) / 60,
                          )}
                          :
                          {(
                            generatedMix.reduce(
                              (acc, track) => acc + track.duration,
                              0,
                            ) % 60
                          )
                            .toString()
                            .padStart(2, "0")}
                        </div>
                      </div>
                      <Separator orientation="vertical" className="h-8" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          BPM Range
                        </div>
                        <div className="font-medium">
                          {Math.min(...generatedMix.map((t) => t.bpm))} -{" "}
                          {Math.max(...generatedMix.map((t) => t.bpm))}
                        </div>
                      </div>
                    </div>

                    <Badge variant="outline" className="gap-1">
                      <Music className="h-3 w-3" />
                      {mixStyles.find((s) => s.id === selectedMixStyle)?.name}
                    </Badge>
                  </div>
                </TabsContent>

                <TabsContent value="analysis" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            Harmonic Compatibility
                          </span>
                          <span className="text-sm">
                            {mixStats.harmonyScore}%
                          </span>
                        </div>
                        <Progress
                          value={mixStats.harmonyScore}
                          className="h-2"
                          style={
                            {
                              "--progress-color":
                                mixStats.harmonyScore > 90
                                  ? "hsl(142, 71%, 45%)"
                                  : mixStats.harmonyScore > 80
                                    ? "hsl(217, 91%, 60%)"
                                    : "hsl(38, 92%, 50%)",
                            } as React.CSSProperties
                          }
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {mixStats.harmonyScore > 90
                            ? "Excellent harmonic flow with perfect key relationships"
                            : mixStats.harmonyScore > 80
                              ? "Good harmonic progression with minor key clashes"
                              : "Acceptable harmonic structure with some key tensions"}
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            BPM Consistency
                          </span>
                          <span className="text-sm">
                            {mixStats.bpmConsistency}%
                          </span>
                        </div>
                        <Progress
                          value={mixStats.bpmConsistency}
                          className="h-2"
                          style={
                            {
                              "--progress-color":
                                mixStats.bpmConsistency > 90
                                  ? "hsl(142, 71%, 45%)"
                                  : mixStats.bpmConsistency > 80
                                    ? "hsl(217, 91%, 60%)"
                                    : "hsl(38, 92%, 50%)",
                            } as React.CSSProperties
                          }
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {mixStats.bpmConsistency > 90
                            ? "Smooth BPM transitions throughout the mix"
                            : mixStats.bpmConsistency > 80
                              ? "Good BPM flow with some larger transitions"
                              : "Acceptable BPM changes that may require manual adjustment"}
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            Energy Flow
                          </span>
                          <span className="text-sm">
                            {mixStats.energyFlow}%
                          </span>
                        </div>
                        <Progress
                          value={mixStats.energyFlow}
                          className="h-2"
                          style={
                            {
                              "--progress-color":
                                mixStats.energyFlow > 90
                                  ? "hsl(142, 71%, 45%)"
                                  : mixStats.energyFlow > 80
                                    ? "hsl(217, 91%, 60%)"
                                    : "hsl(38, 92%, 50%)",
                            } as React.CSSProperties
                          }
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {mixStats.energyFlow > 90
                            ? "Perfect energy progression matching the selected style"
                            : mixStats.energyFlow > 80
                              ? "Good energy flow with natural progression"
                              : "Acceptable energy pattern with some inconsistencies"}
                        </p>
                      </div>
                    </div>

                    <div className="border rounded-md p-4">
                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold">
                          {mixStats.overallScore}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Overall Mix Score
                        </div>
                      </div>

                      <div className="space-y-2">
                        {mixStats.overallScore > 90 ? (
                          <div className="flex items-start gap-2 text-green-600">
                            <Check className="h-5 w-5 mt-0.5 flex-shrink-0" />
                            <p className="text-sm">
                              This mix has excellent harmonic flow and energy
                              progression
                            </p>
                          </div>
                        ) : null}

                        {mixStats.harmonyScore > 85 ? (
                          <div className="flex items-start gap-2 text-green-600">
                            <Check className="h-5 w-5 mt-0.5 flex-shrink-0" />
                            <p className="text-sm">
                              Key relationships follow the Camelot wheel for
                              smooth transitions
                            </p>
                          </div>
                        ) : null}

                        {mixStats.bpmConsistency > 85 ? (
                          <div className="flex items-start gap-2 text-green-600">
                            <Check className="h-5 w-5 mt-0.5 flex-shrink-0" />
                            <p className="text-sm">
                              BPM changes are gradual and within mixing range
                            </p>
                          </div>
                        ) : null}

                        {mixStats.bpmConsistency < 85 ? (
                          <div className="flex items-start gap-2 text-amber-600">
                            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                            <p className="text-sm">
                              Some BPM transitions may require tempo adjustment
                            </p>
                          </div>
                        ) : null}

                        {mixStats.harmonyScore < 85 ? (
                          <div className="flex items-start gap-2 text-amber-600">
                            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                            <p className="text-sm">
                              Some key transitions may benefit from harmonic
                              mixing techniques
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md bg-muted/30">
                    <h3 className="font-medium mb-2">Mix Style Analysis</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This mix follows the "
                      {mixStyles.find((s) => s.id === selectedMixStyle)?.name}"
                      style with
                      {mixStyles
                        .find((s) => s.id === selectedMixStyle)
                        ?.rules.keyProgression.toLowerCase()}{" "}
                      and
                      {mixStyles
                        .find((s) => s.id === selectedMixStyle)
                        ?.rules.energyFlow.toLowerCase()}{" "}
                      energy pattern.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {generatedMix.length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Tracks
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {Math.floor(
                            generatedMix.reduce(
                              (acc, track) => acc + track.duration,
                              0,
                            ) / 60,
                          )}
                          m
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Duration
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {Math.round(
                            generatedMix.reduce(
                              (acc, track) => acc + track.bpm,
                              0,
                            ) / generatedMix.length,
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Avg BPM
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {Math.round(
                            generatedMix.reduce(
                              (acc, track) => acc + (track.energy || 0),
                              0,
                            ) / generatedMix.length,
                          )}
                          %
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Avg Energy
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="harmony"
                  className="flex justify-center py-4"
                >
                  <div className="text-center">
                    <HarmonicWheel
                      selectedKey={generatedMix[0]?.key || "8B"}
                      size={300}
                      highlightCompatible={true}
                    />
                    <p className="text-sm text-muted-foreground mt-4">
                      This mix uses keys that are harmonically compatible
                      according to the Camelot Wheel, ensuring smooth
                      transitions between tracks.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button variant="outline" onClick={generateMix}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
              </div>
              <Button onClick={handleFinish}>
                <Wand2 className="mr-2 h-4 w-4" />
                Create This Mix
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SmartMixGenerator;
