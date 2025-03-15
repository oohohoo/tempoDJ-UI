import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Music, Upload, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  artist: z.string().min(1, { message: "Artist is required" }),
  key: z.string().optional(),
  bpm: z.string().optional(),
  genre: z.string().optional(),
  folder: z.string().optional(),
});

type TrackUploaderProps = {
  isOpen?: boolean;
  onClose?: () => void;
  onUploadComplete?: (
    trackData: z.infer<typeof formSchema> & { file: File },
  ) => void;
};

const TrackUploader = ({
  isOpen = true,
  onClose = () => {},
  onUploadComplete = () => {},
}: TrackUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [folders, setFolders] = useState([
    "Summer Playlist",
    "Night Sessions",
    "Chill Vibes",
    "High Energy",
    "Sunset Sessions",
    "City Sounds",
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      artist: "",
      key: "",
      bpm: "",
      genre: "",
      folder: "",
    },
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("audio/")) {
        handleFileSelect(file);
      }
    }
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsAnalyzing(true);

    // Simulate audio analysis
    setTimeout(() => {
      // Mock analysis results
      const mockKey = ["Am", "C", "G", "D", "F"][Math.floor(Math.random() * 5)];
      const mockBPM = Math.floor(Math.random() * 40 + 120).toString();
      const mockGenre = [
        "House",
        "Techno",
        "Deep House",
        "Drum & Bass",
        "Chill",
      ][Math.floor(Math.random() * 5)];

      form.setValue("title", file.name.replace(/\.[^/.]+$/, ""));
      form.setValue("key", mockKey);
      form.setValue("bpm", mockBPM);
      form.setValue("genre", mockGenre);

      setIsAnalyzing(false);
    }, 1500);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (selectedFile) {
      onUploadComplete({ ...data, file: selectedFile });
      form.reset();
      setSelectedFile(null);
      onClose();
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>Upload New Track</DialogTitle>
          <DialogDescription>
            Upload an audio file to add to your collection. The system will
            automatically analyze the file for key, BPM, and other attributes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {!selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center ${isDragging ? "border-primary bg-primary/5" : "border-gray-300"}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-medium">
                    Drag and drop your audio file here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse
                  </p>
                </div>
                <Input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileInputChange}
                />
                <Button asChild variant="outline">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Browse Files
                  </label>
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="flex items-center p-4 bg-muted rounded-lg">
                  <div className="p-2 mr-3 bg-primary/10 rounded-full">
                    <Music className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={removeSelectedFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {isAnalyzing ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground animate-pulse">
                      Analyzing audio file...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Track title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="artist"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Artist</FormLabel>
                            <FormControl>
                              <Input placeholder="Artist name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="key"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Key</FormLabel>
                            <FormControl>
                              <Input placeholder="Musical key" {...field} />
                            </FormControl>
                            <FormDescription>
                              Detected automatically, but can be edited
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bpm"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>BPM</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Beats per minute"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Detected automatically, but can be edited
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="genre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Genre</FormLabel>
                            <FormControl>
                              <Input placeholder="Genre" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="folder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Folder</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a folder" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="">None</SelectItem>
                                {folders.map((folder) => (
                                  <SelectItem key={folder} value={folder}>
                                    {folder}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Optional: Add to an existing folder
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isAnalyzing || !selectedFile}>
                    Upload Track
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrackUploader;
