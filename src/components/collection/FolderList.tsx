import React from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Folder, RefreshCw, Trash2, ChevronRight } from "lucide-react";

interface FolderItem {
  id: string;
  name: string;
  trackCount: number;
  source?: string;
  dateAdded: string;
}

interface FolderListProps {
  folders: FolderItem[];
  onFolderSelect: (folder: FolderItem) => void;
  onFolderAnalyze: (folder: FolderItem) => void;
}

const FolderList: React.FC<FolderListProps> = ({
  folders = [],
  onFolderSelect = () => {},
  onFolderAnalyze = () => {},
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {folders.map((folder) => (
        <Card
          key={folder.id}
          className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 mr-3 bg-primary/10 rounded-full">
                  <Folder className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{folder.name}</CardTitle>
              </div>
              {folder.source && (
                <Badge variant="outline">{folder.source}</Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Tracks</p>
                <p className="font-medium">{folder.trackCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Added</p>
                <p>{new Date(folder.dateAdded).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="justify-between pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFolderAnalyze(folder)}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Analyze
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => onFolderSelect(folder)}
            >
              View Tracks <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}

      {folders.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
          <Folder className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No folders or playlists found</h3>
          <p className="text-muted-foreground mt-2">
            Import folders or playlists from your computer or other DJ apps.
          </p>
          <Button className="mt-4">Import Folder/Playlist</Button>
        </div>
      )}
    </div>
  );
};

export default FolderList;
