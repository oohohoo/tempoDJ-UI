import React, { useState } from "react";
import { Search, Filter, Music, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Create a simple placeholder for the HarmonicWheel component
const HarmonicWheelPlaceholder = () => {
  return (
    <div className="w-[300px] h-[300px] rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
      <div className="text-center">
        <div className="text-lg font-medium">Harmonic Wheel</div>
        <div className="text-sm text-gray-500">
          Visualization of compatible keys
        </div>
      </div>
    </div>
  );
};

interface Track {
  id: string;
  title: string;
  artist: string;
  key: string;
  bpm: number;
  duration: string;
  compatible?: boolean;
  waveform?: string;
}

interface TrackSelectorProps {
  selectedTrack?: Track | null;
  onTrackSelect?: (track: Track) => void;
  compatibleKeys?: string[];
}

const TrackSelector = ({
  selectedTrack = null,
  onTrackSelect = (track) => handleAddTrack(track),
  compatibleKeys = ["Am", "Em", "Dm", "Gm", "Cm"],
  handleAddTrack = (track: Track) => {},
}: TrackSelectorProps & { handleAddTrack?: (track: Track) => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bpmRange, setBpmRange] = useState<[number, number]>([90, 140]);
  const [activeTab, setActiveTab] = useState("library");

  // Mock data for tracks
  const mockTracks: Track[] = [
    {
      id: "1",
      title: "Summer Vibes",
      artist: "DJ Sunshine",
      key: "Am",
      bpm: 128,
      duration: "6:45",
      compatible: true,
      waveform:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
    },
    {
      id: "2",
      title: "Midnight Run",
      artist: "Night Cruiser",
      key: "Cm",
      bpm: 125,
      duration: "7:12",
      compatible: true,
      waveform:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80",
    },
    {
      id: "3",
      title: "Electric Dreams",
      artist: "Synth Master",
      key: "Gm",
      bpm: 130,
      duration: "5:30",
      compatible: true,
      waveform:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80",
    },
    {
      id: "4",
      title: "Ocean Waves",
      artist: "Coastal Beats",
      key: "Bm",
      bpm: 122,
      duration: "8:15",
      compatible: false,
      waveform:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
    },
    {
      id: "5",
      title: "Urban Jungle",
      artist: "City Dweller",
      key: "Fm",
      bpm: 135,
      duration: "6:20",
      compatible: false,
      waveform:
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&q=80",
    },
    {
      id: "6",
      title: "Desert Storm",
      artist: "Sand Walker",
      key: "Em",
      bpm: 118,
      duration: "7:45",
      compatible: true,
      waveform:
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&q=80",
    },
    {
      id: "7",
      title: "Neon Lights",
      artist: "Glow Stick",
      key: "Dm",
      bpm: 126,
      duration: "5:55",
      compatible: true,
      waveform:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
    },
    {
      id: "8",
      title: "Mountain High",
      artist: "Peak Climber",
      key: "Am",
      bpm: 124,
      duration: "6:10",
      compatible: true,
      waveform:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80",
    },
  ];

  const filteredTracks = mockTracks.filter((track) => {
    const matchesSearch =
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBpm = track.bpm >= bpmRange[0] && track.bpm <= bpmRange[1];
    return matchesSearch && matchesBpm;
  });

  return (
    <div className="w-[350px] h-full bg-gray-100 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold mb-4">Track Selector</h2>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search tracks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">
              BPM Range: {bpmRange[0]} - {bpmRange[1]}
            </span>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <Filter className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
          <Slider
            defaultValue={[90, 140]}
            min={70}
            max={180}
            step={1}
            value={bpmRange}
            onValueChange={(value) => setBpmRange(value as [number, number])}
            className="my-4"
          />
        </div>
      </div>

      <Tabs
        defaultValue="library"
        className="flex-1 flex flex-col"
        onValueChange={setActiveTab}
      >
        <div className="px-4 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="library" className="flex-1">
              Library
            </TabsTrigger>
            <TabsTrigger value="compatible" className="flex-1">
              Compatible
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="library" className="flex-1 p-0 m-0">
          <ScrollArea className="h-[calc(100%-2rem)] p-4">
            <div className="space-y-3">
              {filteredTracks.map((track) => (
                <Card
                  key={track.id}
                  className={`cursor-pointer hover:bg-gray-50 transition-colors ${selectedTrack?.id === track.id ? "border-primary" : ""}`}
                  onClick={() => onTrackSelect(track)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                        {track.waveform ? (
                          <img
                            src={track.waveform}
                            alt={track.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-muted">
                            <Music className="h-5 w-5 text-muted-foreground opacity-50" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{track.title}</h4>
                        <p className="text-sm text-gray-500 truncate">
                          {track.artist}
                        </p>
                      </div>
                    </div>
                    <div className="flex mt-2 gap-2">
                      <Badge variant="outline" className="text-xs">
                        {track.key}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {track.bpm} BPM
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {track.duration}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="compatible" className="flex-1 p-0 m-0">
          <div className="p-4 flex flex-col items-center">
            <HarmonicWheelPlaceholder />
            <Separator className="my-4" />
            <ScrollArea className="h-[calc(100%-350px)] w-full">
              <div className="space-y-3">
                {filteredTracks
                  .filter((track) => track.compatible)
                  .map((track) => (
                    <Card
                      key={track.id}
                      className={`cursor-pointer hover:bg-gray-50 transition-colors ${selectedTrack?.id === track.id ? "border-primary" : ""}`}
                      onClick={() => onTrackSelect(track)}
                    >
                      <div className="aspect-square bg-muted">
                        {track.waveform ? (
                          <img
                            src={track.waveform}
                            alt={track.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <Music className="h-12 w-12 text-muted-foreground opacity-50" />
                          </div>
                        )}
                        <Badge className="absolute top-2 right-2 bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                          Compatible
                        </Badge>
                      </div>
                      <CardContent className="p-3">
                        <div>
                          <h4 className="font-medium">{track.title}</h4>
                          <p className="text-sm text-gray-500">
                            {track.artist}
                          </p>
                        </div>
                        <div className="flex mt-2 gap-2">
                          <Badge variant="outline" className="text-xs">
                            {track.key}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {track.bpm} BPM
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {track.duration}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>

      <div className="p-4 border-t border-gray-200">
        <Button className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Upload New Track
        </Button>
      </div>
    </div>
  );
};

export default TrackSelector;
