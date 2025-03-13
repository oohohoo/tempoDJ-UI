import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Music, Filter, Search, SlidersHorizontal, MoreVertical, Play, Plus, Download } from 'lucide-react';

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

interface TrackGridProps {
  tracks?: Track[];
  onTrackSelect?: (track: Track) => void;
  onTrackPlay?: (track: Track) => void;
  onTrackDownload?: (track: Track) => void;
}

const TrackGrid: React.FC<TrackGridProps> = ({
  tracks = [
    {
      id: '1',
      title: 'Summer Vibes',
      artist: 'DJ Sunshine',
      key: 'A min',
      bpm: 128,
      duration: '6:45',
      dateAdded: '2023-05-15',
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80'
    },
    {
      id: '2',
      title: 'Night Drive',
      artist: 'Electro Dreams',
      key: 'F maj',
      bpm: 124,
      duration: '7:12',
      dateAdded: '2023-06-02',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80'
    },
    {
      id: '3',
      title: 'Deep Thoughts',
      artist: 'Mind Wanderer',
      key: 'D min',
      bpm: 118,
      duration: '8:30',
      dateAdded: '2023-06-10',
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80'
    },
    {
      id: '4',
      title: 'Rhythm Nation',
      artist: 'Beat Collective',
      key: 'G maj',
      bpm: 130,
      duration: '5:55',
      dateAdded: '2023-06-15',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80'
    },
    {
      id: '5',
      title: 'Sunset Boulevard',
      artist: 'Ocean Waves',
      key: 'C maj',
      bpm: 122,
      duration: '6:20',
      dateAdded: '2023-06-20',
      imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&q=80'
    },
    {
      id: '6',
      title: 'Urban Jungle',
      artist: 'City Beats',
      key: 'E min',
      bpm: 126,
      duration: '7:05',
      dateAdded: '2023-06-25',
      imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&q=80'
    }
  ],
  onTrackSelect = () => {},
  onTrackPlay = () => {},
  onTrackDownload = () => {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [bpmRange, setBpmRange] = useState<string>('');
  
  // Filter tracks based on search query, key, and BPM range
  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKey = selectedKey ? track.key === selectedKey : true;
    
    // Simple BPM range filtering logic
    let matchesBpm = true;
    if (bpmRange === 'slow') {
      matchesBpm = track.bpm < 120;
    } else if (bpmRange === 'medium') {
      matchesBpm = track.bpm >= 120 && track.bpm < 130;
    } else if (bpmRange === 'fast') {
      matchesBpm = track.bpm >= 130;
    }
    
    return matchesSearch && matchesKey && matchesBpm;
  });

  return (
    <div className="w-full bg-background p-6">
      <div className="flex flex-col space-y-4">
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tracks by title or artist..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <Select value={selectedKey} onValueChange={setSelectedKey}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by key" />
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
            
            <Select value={bpmRange} onValueChange={setBpmRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="BPM Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All BPM</SelectItem>
                <SelectItem value="slow">Slow (< 120)</SelectItem>
                <SelectItem value="medium">Medium (120-130)</SelectItem>
                <SelectItem value="fast">Fast (> 130)</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            
            <Button variant="default">
              <Plus className="mr-2 h-4 w-4" /> Add Track
            </Button>
          </div>
        </div>
        
        {/* Track Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTracks.map((track) => (
            <Card 
              key={track.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
              onClick={() => onTrackSelect(track)}
            >
              <div className="relative h-40 bg-muted">
                {track.imageUrl ? (
                  <img 
                    src={track.imageUrl} 
                    alt={track.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-secondary">
                    <Music className="h-12 w-12 text-secondary-foreground opacity-50" />
                  </div>
                )}
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="absolute bottom-2 right-2 rounded-full bg-background/80 hover:bg-background"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTrackPlay(track);
                  }}
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{track.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{track.artist}</p>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Key</p>
                    <p>{track.key}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">BPM</p>
                    <p>{track.bpm}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p>{track.duration}</p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="justify-between">
                <p className="text-xs text-muted-foreground">Added: {track.dateAdded}</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onTrackPlay(track);
                    }}>
                      <Play className="mr-2 h-4 w-4" /> Play
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onTrackDownload(track);
                    }}>
                      <Download className="mr-2 h-4 w-4" /> Download
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Empty State */}
        {filteredTracks.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Music className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No tracks found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search or filters, or add a new track to your library.
            </p>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add Track
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackGrid;
