import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";

interface CustomBlockDialogProps {
  showCreateCustomBlock: boolean;
  setShowCreateCustomBlock: (show: boolean) => void;
  newBlockName: string;
  setNewBlockName: (name: string) => void;
  newBlockCode: string;
  setNewBlockCode: (code: string) => void;
  newBlockType: string;
  setNewBlockType: (type: string) => void;
  newBlockKeyPattern: string[];
  setNewBlockKeyPattern: (pattern: string[]) => void;
  newBlockEnergyProfile: number[];
  setNewBlockEnergyProfile: (profile: number[]) => void;
  newBlockDuration: number;
  setNewBlockDuration: (duration: number) => void;
  newBlockColor: string;
  setNewBlockColor: (color: string) => void;
  newBlockGenreAffinity: string[];
  setNewBlockGenreAffinity: (genres: string[]) => void;
  handleCreateCustomBlock: () => void;
}

const CustomBlockDialog: React.FC<CustomBlockDialogProps> = ({
  showCreateCustomBlock,
  setShowCreateCustomBlock,
  newBlockName,
  setNewBlockName,
  newBlockCode,
  setNewBlockCode,
  newBlockType,
  setNewBlockType,
  newBlockKeyPattern,
  setNewBlockKeyPattern,
  newBlockEnergyProfile,
  setNewBlockEnergyProfile,
  newBlockDuration,
  setNewBlockDuration,
  newBlockColor,
  setNewBlockColor,
  newBlockGenreAffinity,
  setNewBlockGenreAffinity,
  handleCreateCustomBlock,
}) => {
  return (
    <Dialog
      open={showCreateCustomBlock}
      onOpenChange={setShowCreateCustomBlock}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Custom Block</DialogTitle>
          <DialogDescription>
            Design your own harmonic block with custom key patterns and energy
            profiles.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="block-name">Block Name</Label>
              <Input
                id="block-name"
                placeholder="e.g., My Custom Progression"
                value={newBlockName}
                onChange={(e) => setNewBlockName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="block-code">Block Code</Label>
              <Input
                id="block-code"
                placeholder="e.g., MY1"
                value={newBlockCode}
                onChange={(e) => setNewBlockCode(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="block-type">Block Type</Label>
              <Select value={newBlockType} onValueChange={setNewBlockType}>
                <SelectTrigger id="block-type">
                  <SelectValue placeholder="Select block type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EB">Energy Building (EB)</SelectItem>
                  <SelectItem value="PT">Peak Time (PT)</SelectItem>
                  <SelectItem value="EP">Energy Plateau (EP)</SelectItem>
                  <SelectItem value="ER">Energy Release (ER)</SelectItem>
                  <SelectItem value="OP">Opening (OP)</SelectItem>
                  <SelectItem value="CL">Closing (CL)</SelectItem>
                  <SelectItem value="QS">Quick Shift (QS)</SelectItem>
                  <SelectItem value="CUSTOM">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="block-duration">Duration (minutes)</Label>
              <Input
                id="block-duration"
                type="number"
                min="1"
                max="30"
                value={newBlockDuration}
                onChange={(e) => setNewBlockDuration(parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="block-color">Block Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="block-color"
                  type="color"
                  className="w-12 h-8 p-1"
                  value={newBlockColor}
                  onChange={(e) => setNewBlockColor(e.target.value)}
                />
                <div
                  className="w-8 h-8 rounded-md"
                  style={{ backgroundColor: newBlockColor }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Key Pattern</Label>
              <div className="flex flex-wrap gap-2 border rounded-md p-2 min-h-[100px]">
                {newBlockKeyPattern.map((key, index) => (
                  <Badge key={index} className="flex items-center gap-1">
                    {key}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1"
                      onClick={() => {
                        const newPattern = [...newBlockKeyPattern];
                        newPattern.splice(index, 1);
                        setNewBlockKeyPattern(newPattern);

                        // Also update energy profile
                        const newEnergy = [...newBlockEnergyProfile];
                        newEnergy.splice(index, 1);
                        setNewBlockEnergyProfile(
                          newEnergy.length > 0 ? newEnergy : [50],
                        );
                      }}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // This would open a key selector in a real app
                    const keys = [
                      "1A",
                      "2A",
                      "3A",
                      "4A",
                      "5A",
                      "6A",
                      "7A",
                      "8A",
                      "9A",
                      "10A",
                      "11A",
                      "12A",
                      "1B",
                      "2B",
                      "3B",
                      "4B",
                      "5B",
                      "6B",
                      "7B",
                      "8B",
                      "9B",
                      "10B",
                      "11B",
                      "12B",
                    ];
                    const randomKey =
                      keys[Math.floor(Math.random() * keys.length)];
                    setNewBlockKeyPattern([...newBlockKeyPattern, randomKey]);
                    setNewBlockEnergyProfile([...newBlockEnergyProfile, 50]);
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Key
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Energy Profile</Label>
              <div className="space-y-4">
                {newBlockKeyPattern.map((key, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="outline">{key}</Badge>
                    <Slider
                      value={[newBlockEnergyProfile[index] || 50]}
                      min={0}
                      max={100}
                      step={1}
                      className="flex-1"
                      onValueChange={(value) => {
                        const newEnergy = [...newBlockEnergyProfile];
                        newEnergy[index] = value[0];
                        setNewBlockEnergyProfile(newEnergy);
                      }}
                    />
                    <span className="text-xs font-medium w-8 text-right">
                      {newBlockEnergyProfile[index] || 50}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Genre Affinity</Label>
              <div className="flex flex-wrap gap-2 border rounded-md p-2 min-h-[60px]">
                {newBlockGenreAffinity.map((genre, index) => (
                  <Badge key={index} className="flex items-center gap-1">
                    {genre}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1"
                      onClick={() => {
                        const newGenres = [...newBlockGenreAffinity];
                        newGenres.splice(index, 1);
                        setNewBlockGenreAffinity(newGenres);
                      }}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
                <Select
                  onValueChange={(value) => {
                    if (value && !newBlockGenreAffinity.includes(value)) {
                      setNewBlockGenreAffinity([
                        ...newBlockGenreAffinity,
                        value,
                      ]);
                    }
                  }}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Add genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="techno">Techno</SelectItem>
                    <SelectItem value="trance">Trance</SelectItem>
                    <SelectItem value="progressive">Progressive</SelectItem>
                    <SelectItem value="ambient">Ambient</SelectItem>
                    <SelectItem value="deep-house">Deep House</SelectItem>
                    <SelectItem value="melodic-techno">
                      Melodic Techno
                    </SelectItem>
                    <SelectItem value="downtempo">Downtempo</SelectItem>
                    <SelectItem value="drum-and-bass">Drum & Bass</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowCreateCustomBlock(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleCreateCustomBlock}>Create Block</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomBlockDialog;
