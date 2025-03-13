import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus, Upload, Music, Search, Filter } from "lucide-react";
import TrackUploader from "./TrackUploader";

interface Track {
  id: string;
  title: string;
  artist: string;
  key: string;
  bpm: number;
  duration: string;
  dateAdded: string;
  imageUrl?: string;
}

interface TrackLibraryProps {
  tracks?: Track[];
  onTrackSelect?: (track: Track) => void;
  onTrackPlay?: (track: Track) => void;
  onTrackDownload?: (track: Track) => void;
}

// Create a TrackGrid component inline since it's not available for import
const TrackGrid: React.FC<{
  tracks: Track[];
  onTrackSelect?: (track: Track) => void;
  onTrackPlay?: (track: Track) => void;
  onTrackDownload?: (track: Track) => void;
}> = ({
  tracks = [],
  onTrackSelect = () => {},
  onTrackPlay = () => {},
  onTrackDownload = () => {},
}) => {
  return (
    <div className="w-full bg-background rounded-md border">
      <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 p-4 font-medium border-b">
        <div className="w-12"></div>
        <div>Track</div>
        <div>Key</div>
        <div>BPM</div>
        <div>Duration</div>
        <div>Actions</div>
      </div>
      <div className="divide-y">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 p-4 items-center hover:bg-accent/50 cursor-pointer"
            onClick={() => onTrackSelect(track)}
          >
            <div className="w-12 h-12 rounded-md overflow-hidden">
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
            </div>
            <div className="text-center">{track.key}</div>
            <div className="text-center">{track.bpm}</div>
            <div className="text-center">{track.duration}</div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onTrackPlay(track);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span className="sr-only">Play</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onTrackDownload(track);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span className="sr-only">Download</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TrackLibrary: React.FC<TrackLibraryProps> = ({
  tracks = [
    {
      id: "1",
      title: "Summer Vibes",
      artist: "DJ Sunshine",
      key: "A min",
      bpm: 128,
      duration: "6:45",
      dateAdded: "2023-05-15",
      imageUrl:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
    },
    {
      id: "2",
      title: "Night Drive",
      artist: "Electro Dreams",
      key: "F maj",
      bpm: 124,
      duration: "7:12",
      dateAdded: "2023-06-02",
      imageUrl:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80",
    },
    {
      id: "3",
      title: "Deep Thoughts",
      artist: "Mind Wanderer",
      key: "D min",
      bpm: 118,
      duration: "8:30",
      dateAdded: "2023-06-10",
      imageUrl:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80",
    },
    {
      id: "4",
      title: "Rhythm Nation",
      artist: "Beat Collective",
      key: "G maj",
      bpm: 130,
      duration: "5:55",
      dateAdded: "2023-06-15",
      imageUrl:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
    },
    {
      id: "5",
      title: "Sunset Boulevard",
      artist: "Ocean Waves",
      key: "C maj",
      bpm: 122,
      duration: "6:20",
      dateAdded: "2023-06-20",
      imageUrl:
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&q=80",
    },
    {
      id: "6",
      title: "Urban Jungle",
      artist: "City Beats",
      key: "E min",
      bpm: 126,
      duration: "7:05",
      dateAdded: "2023-06-25",
      imageUrl:
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&q=80",
    },
  ],
  onTrackSelect = () => {},
  onTrackPlay = () => {},
  onTrackDownload = () => {},
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Filter tracks based on active tab and search query
  const filteredTracks = tracks.filter((track) => {
    const matchesSearch =
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by tab selection
    if (activeTab === "all") {
      return matchesSearch;
    } else if (activeTab === "recent") {
      // Assuming tracks are sorted by dateAdded, filter for tracks added in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const trackDate = new Date(track.dateAdded);
      return matchesSearch && trackDate >= thirtyDaysAgo;
    } else if (activeTab === "favorites") {
      // This would normally check a favorites flag, but for demo we'll just use even IDs
      return matchesSearch && parseInt(track.id) % 2 === 0;
    }

    return matchesSearch;
  });

  const handleUploadComplete = (trackData: any) => {
    console.log("Track uploaded:", trackData);
    setIsUploaderOpen(false);
    // In a real app, you would add the new track to the tracks array
  };

  return (
    <div className="w-full h-full bg-background p-6 flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Track Library</h1>
          <p className="text-muted-foreground">
            Browse, search, and manage your tracks for harmonic mixing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-[200px] md:w-[300px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tracks..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button onClick={() => setIsUploaderOpen(true)}>
            <Upload className="mr-2 h-4 w-4" /> Upload Track
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Tracks</TabsTrigger>
          <TabsTrigger value="recent">Recently Added</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <TrackGrid
            tracks={filteredTracks}
            onTrackSelect={onTrackSelect}
            onTrackPlay={onTrackPlay}
            onTrackDownload={onTrackDownload}
          />
        </TabsContent>

        <TabsContent value="recent" className="mt-0">
          <TrackGrid
            tracks={filteredTracks}
            onTrackSelect={onTrackSelect}
            onTrackPlay={onTrackPlay}
            onTrackDownload={onTrackDownload}
          />
        </TabsContent>

        <TabsContent value="favorites" className="mt-0">
          <TrackGrid
            tracks={filteredTracks}
            onTrackSelect={onTrackSelect}
            onTrackPlay={onTrackPlay}
            onTrackDownload={onTrackDownload}
          />
        </TabsContent>
      </Tabs>

      {/* Empty state when no tracks are found */}
      {filteredTracks.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <Music className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No tracks found</h3>
          <p className="text-muted-foreground mt-2">
            {searchQuery
              ? "Try adjusting your search or filters."
              : "Your track library is empty. Upload your first track to get started."}
          </p>
          <Button className="mt-4" onClick={() => setIsUploaderOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Upload Track
          </Button>
        </div>
      )}

      {/* Track Uploader Dialog */}
      <TrackUploader
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
};

export default TrackLibrary;
