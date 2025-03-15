import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Trash2 } from "lucide-react";
import { HarmonicBlock, TransitionBridge } from "../types";
import { getBridgeTypeColor, getBridgeTypeName } from "../utils/colorUtils";

interface BlockLibraryPanelProps {
  blockLibrary: HarmonicBlock[];
  bridgeLibrary: TransitionBridge[];
  customBlocks: HarmonicBlock[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  filterDuration: string;
  setFilterDuration: (duration: string) => void;
  filteredBlocks: HarmonicBlock[];
  addBlockToMix: (blockId: string) => void;
  setShowCreateCustomBlock: (show: boolean) => void;
}

const BlockLibraryPanel: React.FC<BlockLibraryPanelProps> = ({
  blockLibrary,
  bridgeLibrary,
  customBlocks,
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterDuration,
  setFilterDuration,
  filteredBlocks,
  addBlockToMix,
  setShowCreateCustomBlock,
}) => {
  return (
    <div className="w-72 border-r bg-muted/20 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Block Library</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCreateCustomBlock(true)}
        >
          <Plus className="mr-1 h-3 w-3" />
          Custom Block
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search blocks..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="EB">Energy Building</SelectItem>
            <SelectItem value="PT">Peak Time</SelectItem>
            <SelectItem value="EP">Energy Plateau</SelectItem>
            <SelectItem value="ER">Energy Release</SelectItem>
            <SelectItem value="OP">Opening</SelectItem>
            <SelectItem value="CL">Closing</SelectItem>
            <SelectItem value="QS">Quick Shift</SelectItem>
            <SelectItem value="CUSTOM">Custom</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterDuration} onValueChange={setFilterDuration}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Durations</SelectItem>
            <SelectItem value="short">Short (≤10 min)</SelectItem>
            <SelectItem value="medium">Medium (10-15 min)</SelectItem>
            <SelectItem value="long">Long (≥15 min)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="w-full mb-2">
          <TabsTrigger value="all" className="flex-1">
            All
          </TabsTrigger>
          <TabsTrigger value="byType" className="flex-1">
            By Type
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex-1">
            Custom
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <ScrollArea className="h-[calc(100vh-380px)]">
            <div className="space-y-2">
              {filteredBlocks.map((block) => (
                <Card
                  key={block.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => addBlockToMix(block.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center text-white font-medium text-sm"
                          style={{ backgroundColor: block.color }}
                        >
                          {block.code}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{block.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {block.keyPattern.join(" → ")}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {block.duration} min
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="byType" className="mt-0">
          <ScrollArea className="h-[calc(100vh-380px)]">
            <div className="space-y-4">
              {/* Energy Building Blocks */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                  Energy Building (EB)
                </h4>
                <div className="space-y-2">
                  {filteredBlocks
                    .filter((block) => block.type === "EB")
                    .map((block) => (
                      <Card
                        key={block.id}
                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => addBlockToMix(block.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-8 h-8 rounded-md flex items-center justify-center text-white font-medium text-sm"
                                style={{ backgroundColor: block.color }}
                              >
                                {block.code}
                              </div>
                              <p className="text-sm font-medium">
                                {block.name}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {block.duration} min
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Peak Time Blocks */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                  Peak Time (PT)
                </h4>
                <div className="space-y-2">
                  {filteredBlocks
                    .filter((block) => block.type === "PT")
                    .map((block) => (
                      <Card
                        key={block.id}
                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => addBlockToMix(block.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-8 h-8 rounded-md flex items-center justify-center text-white font-medium text-sm"
                                style={{ backgroundColor: block.color }}
                              >
                                {block.code}
                              </div>
                              <p className="text-sm font-medium">
                                {block.name}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {block.duration} min
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Energy Plateau Blocks */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <div className="w-3 h-3 rounded-full bg-sky-500 mr-2"></div>
                  Energy Plateau (EP)
                </h4>
                <div className="space-y-2">
                  {filteredBlocks
                    .filter((block) => block.type === "EP")
                    .map((block) => (
                      <Card
                        key={block.id}
                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => addBlockToMix(block.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-8 h-8 rounded-md flex items-center justify-center text-white font-medium text-sm"
                                style={{ backgroundColor: block.color }}
                              >
                                {block.code}
                              </div>
                              <p className="text-sm font-medium">
                                {block.name}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {block.duration} min
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Other block types would follow the same pattern */}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="custom" className="mt-0">
          <ScrollArea className="h-[calc(100vh-380px)]">
            <div className="space-y-2">
              {customBlocks.length === 0 ? (
                <div className="text-center p-6 border rounded-md bg-muted/20">
                  <p className="text-sm text-muted-foreground mb-2">
                    No custom blocks yet
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreateCustomBlock(true)}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Create Custom Block
                  </Button>
                </div>
              ) : (
                customBlocks.map((block) => (
                  <Card
                    key={block.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => addBlockToMix(block.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center text-white font-medium text-sm"
                            style={{ backgroundColor: block.color }}
                          >
                            {block.code}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{block.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {block.keyPattern.join(" → ")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {block.duration} min
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <Separator className="my-4" />

      <h3 className="font-medium mb-2">Transition Bridges</h3>
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {bridgeLibrary.map((bridge) => (
            <Card
              key={bridge.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {getBridgeTypeName(bridge.type)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {bridge.trackPositions.map((pos) => pos.key).join(" → ")}
                    </p>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getBridgeTypeColor(bridge.type) }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BlockLibraryPanel;
