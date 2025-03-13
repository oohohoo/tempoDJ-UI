import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Trash,
  Download,
  Clock,
  Music,
} from "lucide-react";

interface Mix {
  id: string;
  title: string;
  createdAt: string;
  trackCount: number;
  duration: string;
  description?: string;
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
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{mix.title}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
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
              <CardDescription>
                {mix.description || "No description provided"}
              </CardDescription>
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
