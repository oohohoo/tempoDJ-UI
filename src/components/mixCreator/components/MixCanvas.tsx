import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HarmonicBlock, TransitionBridge } from "../types";
import { getBridgeTypeColor, getBridgeTypeName } from "../utils/colorUtils";
import {
  Layers,
  ZoomIn,
  ZoomOut,
  LayoutGrid,
  LayoutList,
  X,
} from "lucide-react";

interface MixCanvasProps {
  mixBlocks: HarmonicBlock[];
  mixBridges: TransitionBridge[];
  templates: { id: string; name: string }[];
  selectedBlockId: string | null;
  selectedPositionId: string | null;
  dragOverBlockId: string | null;
  viewMode: "horizontal" | "vertical";
  zoomLevel: number;
  canvasRef: React.RefObject<HTMLDivElement>;
  setSelectedBlockId: (id: string | null) => void;
  setSelectedPositionId: (id: string | null) => void;
  setSelectedTemplate: (id: string) => void;
  loadTemplate: (id: string) => void;
  setZoomLevel: (level: number) => void;
  setViewMode: (mode: "horizontal" | "vertical") => void;
  handleDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    blockId: string,
  ) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>, blockId: string) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, blockId: string) => void;
  handleDragEnd: () => void;
  removeBlock: (blockId: string) => void;
}

export default function MixCanvas(props: MixCanvasProps) {
  const {
    mixBlocks,
    mixBridges,
    templates,
    selectedBlockId,
    selectedPositionId,
    dragOverBlockId,
    viewMode,
    zoomLevel,
    canvasRef,
    setSelectedBlockId,
    setSelectedPositionId,
    setSelectedTemplate,
    loadTemplate,
    setZoomLevel,
    setViewMode,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    removeBlock,
  } = props;

  return React.createElement(
    "div",
    { className: "flex-1 overflow-auto p-4" },
    React.createElement(
      "div",
      { className: "flex items-center justify-between mb-4" },
      React.createElement(
        "h2",
        { className: "text-xl font-bold" },
        "Modular Harmonic Blocks Mix",
      ),
      React.createElement(
        "div",
        { className: "flex items-center gap-2" },
        React.createElement(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setZoomLevel(Math.max(0.5, zoomLevel - 0.1)),
          },
          React.createElement(ZoomOut, { className: "h-4 w-4" }),
        ),
        React.createElement(
          "span",
          { className: "text-sm" },
          `${zoomLevel.toFixed(1)}x`,
        ),
        React.createElement(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setZoomLevel(Math.min(2, zoomLevel + 0.1)),
          },
          React.createElement(ZoomIn, { className: "h-4 w-4" }),
        ),
        React.createElement(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () =>
              setViewMode(
                viewMode === "horizontal" ? "vertical" : "horizontal",
              ),
          },
          viewMode === "horizontal"
            ? React.createElement(LayoutList, { className: "h-4 w-4" })
            : React.createElement(LayoutGrid, { className: "h-4 w-4" }),
        ),
      ),
    ),
    React.createElement(
      "div",
      {
        ref: canvasRef,
        className: `relative border rounded-lg bg-muted/20 p-4 ${viewMode === "horizontal" ? "min-h-[400px]" : "min-h-[600px]"}`,
        style: { width: `${100 * zoomLevel}%` },
      },
      mixBlocks.length === 0
        ? React.createElement(
            "div",
            {
              className:
                "flex flex-col items-center justify-center h-full text-center p-8",
            },
            React.createElement(Layers, {
              className: "h-16 w-16 text-muted-foreground mb-4",
            }),
            React.createElement(
              "h3",
              { className: "text-lg font-medium mb-2" },
              "Start Building Your Mix",
            ),
            React.createElement(
              "p",
              { className: "text-sm text-muted-foreground max-w-md mb-4" },
              "Drag blocks from the library on the left to build your mix, or select a template from the dropdown above.",
            ),
            React.createElement(
              "div",
              { className: "flex flex-wrap gap-2 justify-center" },
              templates.map((template) =>
                React.createElement(
                  Button,
                  {
                    key: template.id,
                    variant: "outline",
                    onClick: () => {
                      setSelectedTemplate(template.id);
                      loadTemplate(template.id);
                    },
                  },
                  template.name,
                ),
              ),
            ),
          )
        : React.createElement(
            "div",
            {
              className: `flex ${viewMode === "horizontal" ? "flex-row" : "flex-col"} gap-4`,
            },
            mixBlocks.map((block, index) => {
              // Find bridge to next block if it exists
              const nextBlock = mixBlocks[index + 1];
              const bridge = nextBlock
                ? mixBridges.find(
                    (b) =>
                      b.fromBlockId === block.id &&
                      b.toBlockId === nextBlock.id,
                  )
                : null;

              return React.createElement(
                React.Fragment,
                { key: block.id },
                // Block
                React.createElement(
                  "div",
                  {
                    className: `border rounded-lg overflow-hidden ${selectedBlockId === block.id ? "ring-2 ring-primary" : ""} ${dragOverBlockId === block.id ? "ring-2 ring-dashed ring-blue-400" : ""}`,
                    style: {
                      backgroundColor: `${block.color}20`,
                      borderColor: block.color,
                      width:
                        viewMode === "horizontal"
                          ? `${block.duration * 10}px`
                          : "100%",
                      minWidth: "150px",
                    },
                    draggable: true,
                    onDragStart: (e) => handleDragStart(e, block.id),
                    onDragOver: (e) => handleDragOver(e, block.id),
                    onDrop: (e) => handleDrop(e, block.id),
                    onDragEnd: handleDragEnd,
                  },
                  // Block header
                  React.createElement(
                    "div",
                    {
                      className: "p-2 flex items-center justify-between",
                      style: { backgroundColor: block.color },
                    },
                    React.createElement(
                      "div",
                      { className: "flex items-center gap-2" },
                      React.createElement(
                        "span",
                        { className: "text-white font-bold" },
                        block.code,
                      ),
                      React.createElement(
                        "span",
                        { className: "text-white text-sm" },
                        block.name,
                      ),
                    ),
                    React.createElement(
                      "div",
                      { className: "flex items-center gap-1" },
                      React.createElement(
                        Badge,
                        {
                          className: "bg-white/20 hover:bg-white/30 text-white",
                        },
                        `${block.duration} min`,
                      ),
                      React.createElement(
                        Button,
                        {
                          variant: "ghost",
                          size: "icon",
                          className: "h-6 w-6 text-white hover:bg-white/20",
                          onClick: () => removeBlock(block.id),
                        },
                        React.createElement(X, { className: "h-3 w-3" }),
                      ),
                    ),
                  ),
                  // Block content - track positions
                  React.createElement(
                    "div",
                    { className: "p-2 space-y-2" },
                    block.trackPositions.map((position) =>
                      React.createElement(
                        "div",
                        {
                          key: position.id,
                          className: `p-2 rounded-md cursor-pointer ${selectedPositionId === position.id ? "bg-primary/20 border border-primary" : "bg-white/80 hover:bg-white"}`,
                          onClick: () => {
                            setSelectedBlockId(block.id);
                            setSelectedPositionId(position.id);
                          },
                        },
                        React.createElement(
                          "div",
                          { className: "flex items-center justify-between" },
                          React.createElement(
                            "div",
                            { className: "flex items-center gap-2" },
                            React.createElement(
                              Badge,
                              { variant: "outline" },
                              position.key,
                            ),
                            React.createElement(
                              "div",
                              {
                                className:
                                  "w-16 bg-gray-200 rounded-full h-1.5",
                              },
                              React.createElement("div", {
                                className: "bg-primary h-1.5 rounded-full",
                                style: { width: `${position.energy}%` },
                              }),
                            ),
                          ),
                          position.trackName
                            ? React.createElement(
                                "div",
                                { className: "flex flex-col items-end" },
                                React.createElement(
                                  "span",
                                  {
                                    className:
                                      "text-xs font-medium truncate max-w-[100px]",
                                  },
                                  position.trackName,
                                ),
                                React.createElement(
                                  "span",
                                  {
                                    className:
                                      "text-xs text-muted-foreground truncate max-w-[100px]",
                                  },
                                  position.artist,
                                ),
                              )
                            : React.createElement(
                                Badge,
                                {
                                  variant: "outline",
                                  className: "text-xs bg-muted/50",
                                },
                                "Empty",
                              ),
                        ),
                      ),
                    ),
                  ),
                ),
                // Bridge to next block if exists
                bridge &&
                  React.createElement(
                    "div",
                    {
                      className: `flex ${viewMode === "horizontal" ? "flex-col" : "flex-row"} items-center justify-center`,
                      style: {
                        minWidth: viewMode === "horizontal" ? "60px" : "auto",
                        minHeight: viewMode === "vertical" ? "60px" : "auto",
                      },
                    },
                    React.createElement(
                      "div",
                      {
                        className:
                          "rounded-md p-2 text-white text-xs font-medium",
                        style: {
                          backgroundColor: getBridgeTypeColor(bridge.type),
                        },
                      },
                      getBridgeTypeName(bridge.type),
                    ),
                    viewMode === "horizontal"
                      ? React.createElement("div", {
                          className: "h-0.5 w-full bg-gray-300 my-2",
                        })
                      : React.createElement("div", {
                          className: "w-0.5 h-full bg-gray-300 mx-2",
                        }),
                  ),
              );
            }),
          ),
    ),
  );
}
