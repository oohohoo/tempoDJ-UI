import { HarmonicBlock } from "../types";
import { getBlockTypeColor } from "../utils/colorUtils";

// Sample blocks library
export const blockLibrary: HarmonicBlock[] = [
  {
    id: "eb1",
    code: "EB1",
    name: "Standard Ascension",
    type: "EB",
    keyPattern: ["8A", "9A", "10A", "11A", "12A"],
    energyProfile: [40, 45, 50, 55, 60],
    duration: 15, // minutes
    trackPositions: [
      { id: "eb1-pos1", key: "8A", energy: 40 },
      { id: "eb1-pos2", key: "9A", energy: 45 },
      { id: "eb1-pos3", key: "10A", energy: 50 },
      { id: "eb1-pos4", key: "11A", energy: 55 },
      { id: "eb1-pos5", key: "12A", energy: 60 },
    ],
    color: "#10b981", // emerald/green
    genreAffinity: ["progressive", "house", "trance"],
  },
  {
    id: "eb2",
    code: "EB2",
    name: "Rapid Build",
    type: "EB",
    keyPattern: ["5A", "7A", "9A", "11A"],
    energyProfile: [45, 55, 65, 75],
    duration: 12,
    trackPositions: [
      { id: "eb2-pos1", key: "5A", energy: 45 },
      { id: "eb2-pos2", key: "7A", energy: 55 },
      { id: "eb2-pos3", key: "9A", energy: 65 },
      { id: "eb2-pos4", key: "11A", energy: 75 },
    ],
    color: "#10b981", // emerald/green
    genreAffinity: ["techno", "progressive"],
  },
  {
    id: "pt1",
    code: "PT1",
    name: "Peak Intensity",
    type: "PT",
    keyPattern: ["1A", "2A", "3A", "4A"],
    energyProfile: [80, 90, 95, 90],
    duration: 12,
    trackPositions: [
      { id: "pt1-pos1", key: "1A", energy: 80 },
      { id: "pt1-pos2", key: "2A", energy: 90 },
      { id: "pt1-pos3", key: "3A", energy: 95 },
      { id: "pt1-pos4", key: "4A", energy: 90 },
    ],
    color: "#f97316", // orange
    genreAffinity: ["techno", "trance", "drum-and-bass"],
  },
  {
    id: "pt2",
    code: "PT2",
    name: "Sustained Peak",
    type: "PT",
    keyPattern: ["1A", "1A", "2A", "2A", "1A"],
    energyProfile: [85, 90, 95, 90, 85],
    duration: 15,
    trackPositions: [
      { id: "pt2-pos1", key: "1A", energy: 85 },
      { id: "pt2-pos2", key: "1A", energy: 90 },
      { id: "pt2-pos3", key: "2A", energy: 95 },
      { id: "pt2-pos4", key: "2A", energy: 90 },
      { id: "pt2-pos5", key: "1A", energy: 85 },
    ],
    color: "#f97316", // orange
    genreAffinity: ["techno", "trance"],
  },
  {
    id: "ep1",
    code: "EP1",
    name: "Sustained Energy",
    type: "EP",
    keyPattern: ["6A", "7A", "8A", "7A"],
    energyProfile: [70, 70, 75, 70],
    duration: 10,
    trackPositions: [
      { id: "ep1-pos1", key: "6A", energy: 70 },
      { id: "ep1-pos2", key: "7A", energy: 70 },
      { id: "ep1-pos3", key: "8A", energy: 75 },
      { id: "ep1-pos4", key: "7A", energy: 70 },
    ],
    color: "#0ea5e9", // sky blue
    genreAffinity: ["house", "progressive", "techno"],
  },
  {
    id: "ep2",
    code: "EP2",
    name: "Melodic Plateau",
    type: "EP",
    keyPattern: ["9A", "10A", "10A", "9A"],
    energyProfile: [65, 70, 70, 65],
    duration: 12,
    trackPositions: [
      { id: "ep2-pos1", key: "9A", energy: 65 },
      { id: "ep2-pos2", key: "10A", energy: 70 },
      { id: "ep2-pos3", key: "10A", energy: 70 },
      { id: "ep2-pos4", key: "9A", energy: 65 },
    ],
    color: "#0ea5e9", // sky blue
    genreAffinity: ["melodic-techno", "progressive", "deep-house"],
  },
  {
    id: "er1",
    code: "ER1",
    name: "Gradual Release",
    type: "ER",
    keyPattern: ["5A", "4A", "3A", "2A", "1A"],
    energyProfile: [65, 60, 55, 50, 45],
    duration: 15,
    trackPositions: [
      { id: "er1-pos1", key: "5A", energy: 65 },
      { id: "er1-pos2", key: "4A", energy: 60 },
      { id: "er1-pos3", key: "3A", energy: 55 },
      { id: "er1-pos4", key: "2A", energy: 50 },
      { id: "er1-pos5", key: "1A", energy: 45 },
    ],
    color: "#8b5cf6", // purple
    genreAffinity: ["progressive", "house", "techno"],
  },
  {
    id: "er2",
    code: "ER2",
    name: "Quick Descent",
    type: "ER",
    keyPattern: ["4A", "2A", "12A"],
    energyProfile: [70, 55, 40],
    duration: 8,
    trackPositions: [
      { id: "er2-pos1", key: "4A", energy: 70 },
      { id: "er2-pos2", key: "2A", energy: 55 },
      { id: "er2-pos3", key: "12A", energy: 40 },
    ],
    color: "#8b5cf6", // purple
    genreAffinity: ["techno", "progressive"],
  },
  {
    id: "op1",
    code: "OP1",
    name: "Gentle Opening",
    type: "OP",
    keyPattern: ["10A", "11A", "12A"],
    energyProfile: [30, 35, 40],
    duration: 8,
    trackPositions: [
      { id: "op1-pos1", key: "10A", energy: 30 },
      { id: "op1-pos2", key: "11A", energy: 35 },
      { id: "op1-pos3", key: "12A", energy: 40 },
    ],
    color: "#eab308", // yellow
    genreAffinity: ["ambient", "deep-house", "progressive"],
  },
  {
    id: "op2",
    code: "OP2",
    name: "Atmospheric Intro",
    type: "OP",
    keyPattern: ["8A", "9A", "10A"],
    energyProfile: [25, 30, 35],
    duration: 10,
    trackPositions: [
      { id: "op2-pos1", key: "8A", energy: 25 },
      { id: "op2-pos2", key: "9A", energy: 30 },
      { id: "op2-pos3", key: "10A", energy: 35 },
    ],
    color: "#eab308", // yellow
    genreAffinity: ["ambient", "downtempo", "deep-house"],
  },
  {
    id: "cl1",
    code: "CL1",
    name: "Smooth Closing",
    type: "CL",
    keyPattern: ["3A", "2A", "1A"],
    energyProfile: [40, 30, 20],
    duration: 8,
    trackPositions: [
      { id: "cl1-pos1", key: "3A", energy: 40 },
      { id: "cl1-pos2", key: "2A", energy: 30 },
      { id: "cl1-pos3", key: "1A", energy: 20 },
    ],
    color: "#6366f1", // indigo
    genreAffinity: ["deep-house", "ambient", "downtempo"],
  },
  {
    id: "cl2",
    code: "CL2",
    name: "Extended Outro",
    type: "CL",
    keyPattern: ["4A", "3A", "2A", "1A", "12A"],
    energyProfile: [45, 35, 30, 25, 20],
    duration: 12,
    trackPositions: [
      { id: "cl2-pos1", key: "4A", energy: 45 },
      { id: "cl2-pos2", key: "3A", energy: 35 },
      { id: "cl2-pos3", key: "2A", energy: 30 },
      { id: "cl2-pos4", key: "1A", energy: 25 },
      { id: "cl2-pos5", key: "12A", energy: 20 },
    ],
    color: "#6366f1", // indigo
    genreAffinity: ["ambient", "downtempo", "deep-house"],
  },
  {
    id: "qs1",
    code: "QS1",
    name: "Quick Shift Up",
    type: "QS",
    keyPattern: ["3A", "5A", "7A"],
    energyProfile: [60, 65, 70],
    duration: 6,
    trackPositions: [
      { id: "qs1-pos1", key: "3A", energy: 60 },
      { id: "qs1-pos2", key: "5A", energy: 65 },
      { id: "qs1-pos3", key: "7A", energy: 70 },
    ],
    color: "#84cc16", // lime
    genreAffinity: ["techno", "progressive", "trance"],
  },
  {
    id: "qs2",
    code: "QS2",
    name: "Quick Shift Down",
    type: "QS",
    keyPattern: ["7A", "5A", "3A"],
    energyProfile: [70, 65, 60],
    duration: 6,
    trackPositions: [
      { id: "qs2-pos1", key: "7A", energy: 70 },
      { id: "qs2-pos2", key: "5A", energy: 65 },
      { id: "qs2-pos3", key: "3A", energy: 60 },
    ],
    color: "#84cc16", // lime
    genreAffinity: ["techno", "progressive", "trance"],
  },
];
