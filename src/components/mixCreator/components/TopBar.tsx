import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  ArrowRight,
  BarChart2,
  HelpCircle,
  Music,
  Wand2,
} from "lucide-react";

interface TopBarProps {
  setDuration: number;
  setSetDuration: (duration: number) => void;
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  loadTemplate: (template: string) => void;
  showEnergyCurve: boolean;
  setShowEnergyCurve: (show: boolean) => void;
  showHarmonicPath: boolean;
  setShowHarmonicPath: (show: boolean) => void;
  autoPopulate: boolean;
  setAutoPopulate: (auto: boolean) => void;
  setShowTutorial: (show: boolean) => void;
  onCancel: () => void;
  handleComplete: () => void;
  templates: { id: string; name: string }[];
}

const TopBar: React.FC<TopBarProps> = ({
  setDuration,
  setSetDuration,
  selectedTemplate,
  setSelectedTemplate,
  loadTemplate,
  showEnergyCurve,
  setShowEnergyCurve,
  showHarmonicPath,
  setShowHarmonicPath,
  autoPopulate,
  setAutoPopulate,
  setShowTutorial,
  onCancel,
  handleComplete,
  templates,
}) => {
  return (
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Set Duration:</span>
          <Select
            value={setDuration.toString()}
            onValueChange={(val) => setSetDuration(parseInt(val))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 min</SelectItem>
              <SelectItem value="60">60 min</SelectItem>
              <SelectItem value="90">90 min</SelectItem>
              <SelectItem value="120">120 min</SelectItem>
              <SelectItem value="180">180 min</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Template:</span>
          <Select
            value={selectedTemplate}
            onValueChange={(val) => {
              setSelectedTemplate(val);
              loadTemplate(val);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Start from scratch</SelectItem>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showEnergyCurve ? "default" : "outline"}
                size="sm"
                onClick={() => setShowEnergyCurve(!showEnergyCurve)}
              >
                <BarChart2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Energy Curve</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showHarmonicPath ? "default" : "outline"}
                size="sm"
                onClick={() => setShowHarmonicPath(!showHarmonicPath)}
              >
                <Music className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Harmonic Path</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={autoPopulate ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoPopulate(!autoPopulate)}
              >
                <Wand2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Auto-Populate Tracks</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTutorial(true)}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Show Tutorial</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button variant="default" onClick={handleComplete}>
          <ArrowRight className="mr-2 h-4 w-4" />
          Complete Mix
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
