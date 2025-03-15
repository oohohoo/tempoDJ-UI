import { useState, useCallback } from "react";
import { HarmonicBlock } from "../types";
import { blockLibrary } from "../data/blockLibrary";

type SuggestBridgeFunction = (fromBlockId: string, toBlockId: string) => void;

export const useTemplateLoader = (suggestBridge: SuggestBridgeFunction) => {
  const [mixBlocks, setMixBlocks] = useState<HarmonicBlock[]>([]);
  const [mixBridges, setMixBridges] = useState<any[]>([]);

  const loadTemplate = useCallback(
    (templateId: string) => {
      // Clear current mix
      setMixBlocks([]);
      setMixBridges([]);

      if (!templateId) return; // If empty, just clear

      let template: HarmonicBlock[] = [];

      // Load template blocks based on template ID
      switch (templateId) {
        case "progressive":
          template = [
            blockLibrary.find((b) => b.id === "op1"),
            blockLibrary.find((b) => b.id === "eb1"),
            blockLibrary.find((b) => b.id === "pt1"),
            blockLibrary.find((b) => b.id === "ep1"),
            blockLibrary.find((b) => b.id === "er1"),
            blockLibrary.find((b) => b.id === "cl1"),
          ].filter(Boolean) as HarmonicBlock[];
          break;
        case "techno":
          template = [
            blockLibrary.find((b) => b.id === "op2"),
            blockLibrary.find((b) => b.id === "eb2"),
            blockLibrary.find((b) => b.id === "pt2"),
            blockLibrary.find((b) => b.id === "er2"),
            blockLibrary.find((b) => b.id === "cl1"),
          ].filter(Boolean) as HarmonicBlock[];
          break;
        case "house":
          template = [
            blockLibrary.find((b) => b.id === "op1"),
            blockLibrary.find((b) => b.id === "eb1"),
            blockLibrary.find((b) => b.id === "ep2"),
            blockLibrary.find((b) => b.id === "pt1"),
            blockLibrary.find((b) => b.id === "ep1"),
            blockLibrary.find((b) => b.id === "er1"),
            blockLibrary.find((b) => b.id === "cl2"),
          ].filter(Boolean) as HarmonicBlock[];
          break;
        case "ambient":
          template = [
            blockLibrary.find((b) => b.id === "op2"),
            blockLibrary.find((b) => b.id === "ep2"),
            blockLibrary.find((b) => b.id === "ep1"),
            blockLibrary.find((b) => b.id === "er2"),
            blockLibrary.find((b) => b.id === "cl2"),
          ].filter(Boolean) as HarmonicBlock[];
          break;
        case "peak-time":
          template = [
            blockLibrary.find((b) => b.id === "eb2"),
            blockLibrary.find((b) => b.id === "pt1"),
            blockLibrary.find((b) => b.id === "pt2"),
            blockLibrary.find((b) => b.id === "qs1"),
            blockLibrary.find((b) => b.id === "pt1"),
            blockLibrary.find((b) => b.id === "er1"),
          ].filter(Boolean) as HarmonicBlock[];
          break;
        default:
          return; // No template selected
      }

      // Add blocks with unique IDs
      const newBlocks = template.map((block) => ({
        ...block,
        id: `${block.id}-${Date.now()}`,
        trackPositions: block.trackPositions.map((pos) => ({
          ...pos,
          id: `${pos.id}-${Date.now()}`,
        })),
      }));

      setMixBlocks(newBlocks);

      // Create bridges between blocks
      for (let i = 0; i < newBlocks.length - 1; i++) {
        suggestBridge(newBlocks[i].id, newBlocks[i + 1].id);
      }
    },
    [suggestBridge],
  );

  return { mixBlocks, setMixBlocks, mixBridges, setMixBridges, loadTemplate };
};
