import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, FolderOpen, Wand2, Layers, Puzzle } from "lucide-react";

interface MixCreationSelectorProps {
  onSelectMethod: (method: "manual" | "smart" | "modular") => void;
}

const MixCreationSelector = ({
  onSelectMethod = () => {},
}: MixCreationSelectorProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-background">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Create a New Mix
        </h1>
        <p className="text-muted-foreground">
          Choose how you want to create your harmonic mix
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              Manual Mix Creation
            </CardTitle>
            <CardDescription>
              Build your mix track by track with full control
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-40 bg-muted rounded-md flex items-center justify-center mb-4">
              <Layers className="h-16 w-16 text-muted-foreground opacity-50" />
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Add tracks one by one from your library</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Fine-tune each transition manually</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Perfect for detailed mix crafting</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => onSelectMethod("manual")}>
              Start Manual Mix
            </Button>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              Smart Mix Generator
            </CardTitle>
            <CardDescription>
              Automatically create harmonic mixes from your tracks
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-40 bg-muted rounded-md flex items-center justify-center mb-4">
              <FolderOpen className="h-16 w-16 text-muted-foreground opacity-50" />
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Select a folder of tracks to work with</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Choose from recommended mix style templates</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Generate perfect harmonic mixes instantly</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant="default"
              onClick={() => onSelectMethod("smart")}
            >
              Try Smart Generator
            </Button>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden hover:shadow-md transition-shadow border-primary/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Puzzle className="h-5 w-5 text-primary" />
              Modular Harmonic Blocks
            </CardTitle>
            <CardDescription>
              Build your mix using pre-defined harmonic patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-40 bg-muted rounded-md flex items-center justify-center mb-4">
              <div className="flex space-x-2">
                <div className="w-12 h-12 bg-green-500/70 rounded-md flex items-center justify-center text-white font-bold">
                  EB1
                </div>
                <div className="w-3 h-3 bg-blue-500 rounded-full self-center"></div>
                <div className="w-12 h-12 bg-orange-500/70 rounded-md flex items-center justify-center text-white font-bold">
                  PT2
                </div>
                <div className="w-3 h-3 bg-purple-500 rounded-full self-center"></div>
                <div className="w-12 h-12 bg-indigo-500/70 rounded-md flex items-center justify-center text-white font-bold">
                  CL1
                </div>
              </div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Arrange harmonic blocks with consistent internal logic
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Connect blocks with transition bridges</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Perfect for structured, professional DJ sets</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant="default"
              onClick={() => onSelectMethod("modular")}
            >
              Try Modular Blocks
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default MixCreationSelector;
