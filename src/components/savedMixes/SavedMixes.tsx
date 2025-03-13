import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MixGrid from "./MixGrid";
import { PlusCircle, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SavedMixesProps {
  onCreateNewMix?: () => void;
  onEditMix?: (mixId: string) => void;
  onDeleteMix?: (mixId: string) => void;
  onExportMix?: (mixId: string) => void;
}

const SavedMixes: React.FC<SavedMixesProps> = ({
  onCreateNewMix = () => console.log("Create new mix"),
  onEditMix = (mixId) => console.log(`Edit mix ${mixId}`),
  onDeleteMix = (mixId) => console.log(`Delete mix ${mixId}`),
  onExportMix = (mixId) => console.log(`Export mix ${mixId}`),
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mixToDelete, setMixToDelete] = useState<string | null>(null);

  // Mock data for different categories
  const recentMixes = [
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
  ];

  const favoriteMixes = [
    {
      id: "3",
      title: "Progressive Mix Vol. 1",
      createdAt: "2023-08-05",
      trackCount: 10,
      duration: "1:12:45",
      description: "Progressive build-ups with perfect harmonic flow",
    },
  ];

  const allMixes = [
    ...recentMixes,
    ...favoriteMixes,
    {
      id: "4",
      title: "Techno Exploration",
      createdAt: "2023-09-10",
      trackCount: 15,
      duration: "1:45:20",
      description: "Dark techno journey with compatible key progressions",
    },
  ];

  const handleDeleteMix = (mixId: string) => {
    setMixToDelete(mixId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (mixToDelete) {
      onDeleteMix(mixToDelete);
      setMixToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const filteredMixes = {
    all: allMixes.filter(
      (mix) =>
        mix.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mix.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
    recent: recentMixes.filter(
      (mix) =>
        mix.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mix.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
    favorites: favoriteMixes.filter(
      (mix) =>
        mix.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mix.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  };

  return (
    <div className="bg-background w-full h-full p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Saved Mixes</h1>
        <Button onClick={onCreateNewMix}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Mix
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search mixes..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Mixes</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="w-full">
          <MixGrid
            mixes={filteredMixes.all}
            onEdit={onEditMix}
            onDelete={handleDeleteMix}
            onExport={onExportMix}
          />
        </TabsContent>

        <TabsContent value="recent" className="w-full">
          <MixGrid
            mixes={filteredMixes.recent}
            onEdit={onEditMix}
            onDelete={handleDeleteMix}
            onExport={onExportMix}
          />
        </TabsContent>

        <TabsContent value="favorites" className="w-full">
          <MixGrid
            mixes={filteredMixes.favorites}
            onEdit={onEditMix}
            onDelete={handleDeleteMix}
            onExport={onExportMix}
          />
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              mix and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SavedMixes;
