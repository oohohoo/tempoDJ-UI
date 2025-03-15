import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import {
  Music,
  Upload,
  Search,
  SlidersHorizontal,
  FolderPlus,
  RefreshCw,
  Eraser,
  Play,
  Download,
  MoreVertical,
  Folder,
  FileAudio,
  Plus,
  Filter,
  AlertTriangle,
  Import
} from "lucide-react";
import TrackUploader from "./TrackUploader";
import TrackList from "./TrackList";
import FolderList from "./FolderList";
import ExpandedTrackView from "./ExpandedTrackView";

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

interface Folder {
  id: string;
  name: string;
  trackCount: number;
  source?: string;
  dateAdded: string;
}

interface CollectionProps {
  tracks?: Track[];
  folders?: Folder[];
  onTrackSelect?: (track: Track) => void;
  onTrackPlay?: (track: Track) => void;
  onTrackDownload?: (track: Track) => void;
  onTrackAnalyze?: (track: Track) => void;
  onFolderAnalyze?: (folder: Folder) => void;
}

const Collection: React.FC<CollectionProps> = ({
  tracks = [
    {
      id: "1",
      title: "Summer Vibes",
      artist: "DJ Sunshine",
      key: "A min",
      bpm: 128,
      duration: "6:45",
      dateAdded: "2023-05-15",
      genre: "House",
      energy: 7,
      analyzed: true,
      imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
      waveform: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=600&q=75",
      folder: "Summer Playlist"
    },
    {
      id: "2",
      title: "Night Drive",
      artist: "Electro Dreams",
      key: "F maj",
      bpm: 124,
      duration: "7:12",
      dateAdded: "2023-06-02",
      genre: "Techno",
      energy: 8,
      analyzed: true,
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80",
      waveform: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=600&q=75",
      folder: "Night Sessions"
    },
    {
      id: "3",
      title: "Deep Thoughts",
      artist: "Mind Wanderer",
      key: "D min",
      bpm: 118,
      duration: "8:30",
      dateAdded: "2023-06-10",
      genre: "Deep House",
      energy: 5,
      analyzed: true,
      imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80",
      waveform: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=600&q=75",
      folder: "Chill Vibes"
    },
    {
      id: "4",
      title: "Rhythm Nation",
      artist: "Beat Collective",
      key: "G maj",
      bpm: 130,
      duration: "5:55",
      dateAdded: "2023-06-15",
      genre: "Drum & Bass",
      energy: 9,
      analyzed: false,
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
      folder: "High Energy"
    },
    {
      id: "5",
      title: "Sunset Boulevard",
      artist: "Ocean Waves",
      key: "C maj",
      bpm: 122,
      duration: "6:20",
      dateAdded: "2023-06-20",
      genre: "Chill",
      energy: 4,
      analyzed: true,
      imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&q=80",
      waveform: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=600&q=75",
      folder: "Sunset Sessions"
    },
    {
      id: "6",
      title: "Urban Jungle",
      artist: "City Beats",
      key: "E min",
      bpm: 126,
      duration: "7:05",
      dateAdded: "2023-06-25",
      genre: "Tech House",
      energy: 7,
      analyzed: true,
      imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&q=80",
      waveform: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=600&q=75",
      folder: "City Sounds"
    },
  ],
  folders = [
    {
      id: "f1",
      name: "Summer Playlist",
      trackCount: 12,
      source: "Local",
      dateAdded: "2023-05-10"
    },
    {
      id: "f2",
      name: "Night Sessions",
      trackCount: 8,
      source: "Rekordbox",
      dateAdded: "2023-06-01"
    },
    {
      id: "f3",
      name: "Chill Vibes",
      trackCount: 15,
      source: "Engine DJ",
      dateAdded: "2023-06-05"
    },
    {
      id: "f4",
      name: "High Energy",
      trackCount: 10,
      source: "Local",
      dateAdded: "2023-06-12"
    },
    {
      id: "f5",
      name: "Sunset Sessions",
      trackCount: 7,
      source: "Rekordbox",
      dateAdded: "2023-06-18"
    },
    {
      id: "f6",
      name: "City Sounds",
      trackCount: 9,
      source: "Engine DJ",
      dateAdded: "2023-06-22"
    },
  ],
  onTrackSelect = () => {},
  onTrackPlay = () => {},
  onTrackDownload = () => {},
  onTrackAnalyze = () => {},
  onFolderAnalyze = () => {},
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [bpmRange, setBpmRange] = useState<string>("");
  const [energyLevel, setEnergyLevel] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("dateAdded");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedTrackId, setExpandedTrackId] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Filter tracks based on active tab, search query, and filters
  const filteredTracks = tracks.filter((track) => {
    const matchesSearch =
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesKey = selectedKey ? track.key === selectedKey : true;
    const matchesGenre = selectedGenre ? track.genre === selectedGenre : true;
    const matchesFolder = selectedFolder ? track.folder === selectedFolder : true;
    
    // BPM range filtering
    let matchesBpm = true;
    if (bpmRange === "slow") {
      matchesBpm = track.bpm < 120;
    } else if (bpmRange === "medium") {
      matchesBpm = track.bpm >= 120 && track.bpm < 130;
    } else if (bpmRange === "fast") {
      matchesBpm = track.bpm >= 130;
    }
    
    // Energy level filtering
    let matchesEnergy = true;
    if (energyLevel === "low") {
      matchesEnergy = (track.energy || 0) <= 3;
    } else if (energyLevel === "medium") {
      matchesEnergy = (track.energy || 0) > 3 && (track.energy || 0) <= 7;
    } else if (energyLevel === "high") {
      matchesEnergy = (track.energy || 0) > 7;
    }

    // Filter by tab selection
    if (activeTab === "all") {
      return matchesSearch && matchesKey && matchesBpm && matchesGenre && matchesEnergy && matchesFolder;
    } else if (activeTab === "recent") {
      // Filter for tracks added in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const trackDate = new Date(track.dateAdded);
      return matchesSearch && matchesKey && matchesBpm && matchesGenre && matchesEnergy && matchesFolder && trackDate >= thirtyDaysAgo;
    } else if (activeTab === "favorites") {
      // For demo, we'll just use even IDs as favorites
      return matchesSearch && matchesKey && matchesBpm && matchesGenre && matchesEnergy && matchesFolder && parseInt(track.id) % 2 === 0;
    } else if (activeTab === "folders") {
      return matchesFolder;
    }

    return matchesSearch && matchesKey && matchesBpm && matchesGenre && matchesEnergy && matchesFolder;
  });

  // Sort tracks based on sortBy and sortOrder
  const sortedTracks = [...filteredTracks].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "artist":
        comparison = a.artist.localeCompare(b.artist);
        break;
      case "key":
        comparison = a.key.localeCompare(b.key);
        break;
      case "bpm":
        comparison = a.bpm - b.bpm;
        break;
      case "duration":
        // Simple string comparison for duration (not ideal but works for demo)
        comparison = a.duration.localeCompare(b.duration);
        break;
      case "dateAdded":
        comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        break;
      case "energy":
        comparison = (a.energy || 0) - (b.energy || 0);
        break;
      default:
        comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleTrackSelect = (track: Track) => {
    if (expandedTrackId === track.id) {
      setExpandedTrackId(null);
    } else {
      setExpandedTrackId(track.id);
      onTrackSelect(track);
    }
  };

  const handleFolderSelect = (folder: Folder) => {
    setSelectedFolder(folder.name);
    setActiveTab("all");
  };

  const handleUploadComplete = (trackData: any) => {
    console.log("Track uploaded:", trackData);
    setIsUploaderOpen(false);
    // In a real app, you would add the new track to the tracks array
  };

  const handleBulkAnalyze = () => {
    if (selectedTracks.length === 0) return;
    
    setIsAnalyzing(true);
    setAnalyzeProgress(0);
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalyzeProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsAnalyzing(false);
            setSelectedTracks([]);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  const handleCheckboxChange = (trackId: string) => {
    setSelectedTracks((prev) => {
      if (prev.includes(trackId)) {
        return prev.filter((id) => id !== trackId);
      } else {
        return [...prev, trackId];
      };
    });
  };

  const handleSelectAll = () => {
    if (selectedTracks.length === sortedTracks.length) {
      setSelectedTracks([]);
    } else {
      setSelectedTracks(sortedTracks.map(track => track.id));
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setSelectedKey("");
    setBpmRange("");
    setSelectedGenre("");
    setEnergyLevel("");
    setSortBy("dateAdded");
    setSortOrder("desc");
    setSearchQuery("");
    setSelectedFolder(null);
  };

  const genres = Array.from(new Set(tracks.map(track => track.genre).filter(Boolean)));

  return (
    <div className="w-full h-full bg-background p-6 flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Collection</h1>
          <p className="text-muted-foreground">
            Browse, search, and manage your tracks for harmonic mixing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-[200px] md:w-[300px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tracks by name, artist, or key..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button variant="outline" onClick={toggleFilters}>
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>

          <Button onClick={() => setIsUploaderOpen(true)}>
            <Upload className="mr-2 h-4 w-4" /> Upload Track
          </Button>

          <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
            <Import className="mr-2 h-4 w-4" /> Import
          </Button>

          {selectedTracks.length > 0 && (
            <Button onClick={handleBulkAnalyze}>
              <RefreshCw className="mr-2 h-4 w-4" /> Analyze ({selectedTracks.length})
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium">Key</label>
              <Select value={selectedKey} onValueChange={setSelectedKey}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Keys" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Keys</SelectItem>
                  <SelectItem value="A min">A Minor</SelectItem>
                  <SelectItem value="C maj">C Major</SelectItem>
                  <SelectItem value="D min">D Minor</SelectItem>
                  <SelectItem value="E min">E Minor</SelectItem>
                  <SelectItem value="F maj">F Major</SelectItem>
                  <SelectItem value="G maj">G Major</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium">BPM Range</label>
              <Select value={bpmRange} onValueChange={setBpmRange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All BPM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All BPM</SelectItem>
                  <SelectItem value="slow">Slow (< 120)</SelectItem>
                  <SelectItem value="medium">Medium (120-130)</SelectItem>
                  <SelectItem value="fast">Fast (> 130)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium">Genre</label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Genres</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre as string}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium">Energy</label>
              <Select value={energyLevel} onValueChange={setEnergyLevel}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Energy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Energy</SelectItem>
                  <SelectItem value="low">Low (1-3)</SelectItem>
                  <SelectItem value="medium">Medium (4-7)</SelectItem>
                  <SelectItem value="high">High (8-10)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dateAdded">Date Added</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="artist">Artist</SelectItem>
                  <SelectItem value="key">Key</SelectItem>
                  <SelectItem value="bpm">BPM</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium">Order</label>
              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {isAnalyzing && (
        <Alert>
          <AlertDescription className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span>Analyzing {selectedTracks.length} tracks...</span>
              <span>{analyzeProgress}%</span>
            </div>
            <Progress value={analyzeProgress} className="w-full" />
          </AlertDescription>
        </Alert>
      )}

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
          <TabsTrigger value="folders">Folders & Playlists</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <TrackList
            tracks={sortedTracks}
            selectedTracks={selectedTracks}
            expandedTrackId={expandedTrackId}
            onTrackSelect={handleTrackSelect}
            onTrackPlay={onTrackPlay}
            onTrackDownload={onTrackDownload}
            onTrackAnalyze={onTrackAnalyze}
            onCheckboxChange={handleCheckboxChange}
            onSelectAll={handleSelectAll}
          />
          {expandedTrackId && (
            <ExpandedTrackView 
              track={tracks.find(t => t.id === expandedTrackId)!}
              onClose={() => setExpandedTrackId(null)}
            />
          )}
        </TabsContent>

        <TabsContent value="recent" className="mt-0">
          <TrackList
            tracks={sortedTracks}
            selectedTracks={selectedTracks}
            expandedTrackId={expandedTrackId}
            onTrackSelect={handleTrackSelect}
            onTrackPlay={onTrackPlay}
            onTrackDownload={onTrackDownload}
            onTrackAnalyze={onTrackAnalyze}
            onCheckboxChange={handleCheckboxChange}
            onSelectAll={handleSelectAll}
          />
          {expandedTrackId && (
            <ExpandedTrackView 
              track={tracks.find(t => t.id === expandedTrackId)!}
              onClose={() => setExpandedTrackId(null)}
            />
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-0">
          <TrackList
            tracks={sortedTracks}
            selectedTracks={selectedTracks}
            expandedTrackId={expandedTrackId}
            onTrackSelect={handleTrackSelect}
            onTrackPlay={onTrackPlay}
            onTrackDownload={onTrackDownload}
            onTrackAnalyze={onTrackAnalyze}
            onCheckboxChange={handleCheckboxChange}
            onSelectAll={handleSelectAll}
          />
          {expandedTrackId && (
            <ExpandedTrackView 
              track={tracks.find(t => t.id === expandedTrackId)!}
              onClose={() => setExpandedTrackId(null)}
            />
          )}
        </TabsContent>

        <TabsContent value="folders" className="mt-0">
          <FolderList 
            folders={folders}
            onFolderSelect={handleFolderSelect}
            onFolderAnalyze={onFolderAnalyze}
          />
          {selectedFolder && (
            <>
              <div className="flex items-center mt-6 mb-4">
                <h3 className="text-lg font-medium">Tracks in {selectedFolder}</h3>
                <Badge variant="outline" className="ml-2">
                  {sortedTracks.length} tracks
                </Badge>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setSelectedFolder(null)}>
                  Clear Selection
                </Button>
              </div>
              <TrackList
                tracks={sortedTracks}
                selectedTracks={selectedTracks}
                expandedTrackId={expandedTrackId}
                onTrackSelect={handleTrackSelect}
                onTrackPlay={onTrackPlay}
                onTrackDownload={onTrackDownload}
                onTrackAnalyze={onTrackAnalyze}
                onCheckboxChange={handleCheckboxChange}
                onSelectAll={handleSelectAll}
              />
              {expandedTrackId && (
                <ExpandedTrackView 
                  track={tracks.find(t => t.id === expandedTrackId)!}
                  onClose={() => setExpandedTrackId(null)}
                />
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Empty state when no tracks are found */}
      {sortedTracks.length === 0 && activeTab !== "folders" && (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <Music className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No tracks found</h3>
          <p className="text-muted-foreground mt-2">
            {searchQuery || selectedKey || bpmRange || selectedGenre || energyLevel
              ? "Try adjusting your search or filters."
              : "Your collection is empty. Upload your first track or import a playlist to get started."}
          </p>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => setIsUploaderOpen(true)}>
              <Upload className="mr-2 h-4 w-4" /> Upload Track
            </Button>
            <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
              <Import className="mr-2 h-4 w-4" /> Import Playlist
            </Button>
          </div>
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

export default Collection;
