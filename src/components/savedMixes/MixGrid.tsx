import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Music,
  Filter,
  Search,
  SlidersHorizontal,
  MoreVertical,
  Play,
  Plus,
  Download,
  Edit,
  Trash,
} from "lucide-react";
import { Badge } from "../ui/badge";

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

interface Mix {
  id: string;
  title: string;
  createdAt: string;
  trackCount: number;
  duration: string;
  description?: string;
  imageUrl?: string;
}

interface MixGridProps {
  mixes?: Mix[];
  onEdit?: (mixId: string) => void;
  onDelete?: (mixId: string) => void;
  onExport?: (mixId: string) => void;
}

const MixGrid: React.FC<MixGridProps> = ({
  mixes = [
    {
      id: "1",
      title: "Summer Vibes 2023",
      createdAt: "2023-06-15",
      trackCount: 12,
      duration: "1:24:30",
      description: "A harmonic journey through summer house tracks",
    },
    {
      id: "2",
      title: "Deep House Transitions",
      createdAt: "2023-07-22",
      trackCount: 8,
      duration: "0:58:15",
      description: "Smooth key transitions between deep house tracks",
    },
    {
      id: "3",
      title: "Progressive Mix Vol. 1",
      createdAt: "2023-08-05",
      trackCount: 10,
      duration: "1:12:45",
      description: "Progressive build-ups with perfect harmonic flow",
    },
    {
      id: "4",
      title: "Techno Exploration",
      createdAt: "2023-09-10",
      trackCount: 15,
      duration: "1:45:20",
      description: "Dark techno journey with compatible key progressions",
    },
  ],
  onEdit = (mixId) => console.log(`Edit mix ${mixId}`),
  onDelete = (mixId) => console.log(`Delete mix ${mixId}`),
  onExport = (mixId) => console.log(`Export mix ${mixId}`),
}) => {
  const [sortBy, setSortBy] = useState<"date" | "title" | "tracks">("date");

  const sortedMixes = [...mixes].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else {
      return b.trackCount - a.trackCount;
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-background p-6 rounded-lg w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Saved Mixes</h2>
        <div className="flex gap-4">
          <Button
            variant={sortBy === "date" ? "default" : "outline"}
            onClick={() => setSortBy("date")}
            size="sm"
          >
            Date
          </Button>
          <Button
            variant={sortBy === "title" ? "default" : "outline"}
            onClick={() => setSortBy("title")}
            size="sm"
          >
            Title
          </Button>
          <Button
            variant={sortBy === "tracks" ? "default" : "outline"}
            onClick={() => setSortBy("tracks")}
            size="sm"
          >
            Tracks
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedMixes.map((mix) => (
          <Card
            key={mix.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center p-3 border-b">
              <div className="w-16 h-16 rounded-md overflow-hidden mr-3 flex-shrink-0 bg-gradient-to-r from-purple-500 to-blue-500 relative">
                {mix.imageUrl ? (
                  <img
                    src={mix.imageUrl}
                    alt={mix.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Music className="h-8 w-8 text-white opacity-50" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{mix.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {mix.description || "No description"}
                </p>
                <div className="mt-1">
                  <Badge variant="outline" className="mr-1">
                    BPM: 120-126
                  </Badge>
                  <Badge variant="outline">Energy: 4-6</Badge>
                </div>
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-black/30 hover:bg-black/50 text-white"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(mix.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Mix
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onExport(mix.id)}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Mix
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(mix.id)}
                      className="text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Mix
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <Badge className="mb-2">Warm-up Set</Badge>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Best For:</span> Warm-ups,
                      early sets, chill venues
                    </div>
                    <div>
                      <span className="font-medium">Mix Style:</span> Long
                      blends, smooth transitions
                    </div>
                    <div>
                      <span className="font-medium">Rules:</span> perfect +
                      adjacent + same_number
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Created: {formatDate(mix.createdAt)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Music className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{mix.trackCount} tracks</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Duration: {mix.duration}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => onEdit(mix.id)}>
                Open Mix
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MixGrid;
