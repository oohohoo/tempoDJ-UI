import { TransitionBridge } from "../types";

// Sample transition bridges
export const bridgeLibrary: TransitionBridge[] = [
  {
    id: "bridge1",
    fromBlockId: "eb1",
    toBlockId: "pt1",
    type: "NATURAL",
    trackPositions: [
      { id: "bridge1-pos1", key: "12A" },
      { id: "bridge1-pos2", key: "1A" },
    ],
  },
  {
    id: "bridge2",
    fromBlockId: "pt1",
    toBlockId: "ep1",
    type: "ENERGY",
    trackPositions: [
      { id: "bridge2-pos1", key: "4A" },
      { id: "bridge2-pos2", key: "6A" },
    ],
  },
  {
    id: "bridge3",
    fromBlockId: "ep1",
    toBlockId: "er1",
    type: "PERFECT",
    trackPositions: [
      { id: "bridge3-pos1", key: "7A" },
      { id: "bridge3-pos2", key: "5A" },
    ],
  },
  {
    id: "bridge4",
    fromBlockId: "op1",
    toBlockId: "eb1",
    type: "PERFECT",
    trackPositions: [
      { id: "bridge4-pos1", key: "12A" },
      { id: "bridge4-pos2", key: "8A" },
    ],
  },
  {
    id: "bridge5",
    fromBlockId: "er1",
    toBlockId: "cl1",
    type: "PERFECT",
    trackPositions: [
      { id: "bridge5-pos1", key: "1A" },
      { id: "bridge5-pos2", key: "3A" },
    ],
  },
];
