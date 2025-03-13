import React from "react";
import MixTimeline from "./MixTimeline";

export default {
  title: "MixCreator/MixTimeline",
  component: MixTimeline,
  parameters: {
    layout: "fullscreen",
  },
};

const mockTracks = [
  {
    id: "track-1",
    title: "Summer Vibes",
    artist: "DJ Sunshine",
    key: "11A",
    bpm: 128,
    duration: 320,
    waveform:
      "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=600&q=75",
    color: "#4f46e5",
    energy: 75,
    genre: "House",
    tags: ["summer", "upbeat"],
    cuePoints: [
      { id: "cp1", time: 32, label: "Intro End", type: "intro" },
      { id: "cp2", time: 160, label: "Drop", type: "chorus" },
      { id: "cp3", time: 288, label: "Outro Start", type: "outro" },
    ],
    loops: [{ id: "loop1", startTime: 64, endTime: 96, label: "Vocal Loop" }],
  },
  {
    id: "track-2",
    title: "Midnight Groove",
    artist: "Night Owl",
    key: "12A",
    bpm: 126,
    duration: 345,
    waveform:
      "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=600&q=75",
    color: "#8b5cf6",
    energy: 65,
    genre: "Deep House",
    tags: ["night", "deep"],
    cuePoints: [
      { id: "cp1", time: 48, label: "Intro End", type: "intro" },
      { id: "cp2", time: 176, label: "Drop", type: "chorus" },
      { id: "cp3", time: 304, label: "Outro Start", type: "outro" },
    ],
  },
  {
    id: "track-3",
    title: "Deep Dive",
    artist: "Ocean Beats",
    key: "1A",
    bpm: 124,
    duration: 298,
    waveform:
      "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=600&q=75",
    color: "#ec4899",
    energy: 60,
    genre: "Progressive House",
    tags: ["deep", "melodic"],
    cuePoints: [
      { id: "cp1", time: 32, label: "Intro End", type: "intro" },
      { id: "cp2", time: 160, label: "Drop", type: "chorus" },
    ],
  },
];

const mockTransitions = {
  "track-1-track-2": {
    fromTrackId: "track-1",
    toTrackId: "track-2",
    duration: 16,
    startPoint: 0.8,
    endPoint: 0.2,
    type: "beatmatch",
    notes: "Smooth transition with EQ swap",
    effectsApplied: ["eq", "filter"],
  },
  "track-2-track-3": {
    fromTrackId: "track-2",
    toTrackId: "track-3",
    duration: 32,
    startPoint: 0.9,
    endPoint: 0.1,
    type: "echo",
    notes: "Use echo out and bring in with filter",
    effectsApplied: ["echo", "filter"],
  },
};

export const Default = () => (
  <div className="p-6 bg-background min-h-screen">
    <MixTimeline
      tracks={mockTracks}
      transitions={mockTransitions}
      onTrackMove={(source, dest) =>
        console.log(`Move track from ${source} to ${dest}`)
      }
      onTrackRemove={(id) => console.log(`Remove track ${id}`)}
      onTrackDuplicate={(id) => console.log(`Duplicate track ${id}`)}
      onTrackEdit={(id) => console.log(`Edit track ${id}`)}
      onTransitionAdjust={(fromId, toId, data) =>
        console.log(`Adjust transition from ${fromId} to ${toId}:`, data)
      }
      onPreviewTransition={(fromId, toId) =>
        console.log(`Preview transition from ${fromId} to ${toId}`)
      }
      onAddCuePoint={(trackId, cuePoint) =>
        console.log(`Add cue point to ${trackId}:`, cuePoint)
      }
      onRemoveCuePoint={(trackId, cuePointId) =>
        console.log(`Remove cue point ${cuePointId} from ${trackId}`)
      }
      onAddLoop={(trackId, loop) =>
        console.log(`Add loop to ${trackId}:`, loop)
      }
      onRemoveLoop={(trackId, loopId) =>
        console.log(`Remove loop ${loopId} from ${trackId}`)
      }
      onSaveMixState={() => console.log("Save mix state")}
      onExportMix={() => console.log("Export mix")}
      onZoomChange={(zoom) => console.log(`Zoom changed to ${zoom}`)}
    />
  </div>
);

export const ReadOnly = () => (
  <div className="p-6 bg-background min-h-screen">
    <MixTimeline
      tracks={mockTracks}
      transitions={mockTransitions}
      isEditable={false}
    />
  </div>
);

export const EmptyState = () => (
  <div className="p-6 bg-background min-h-screen">
    <MixTimeline tracks={[]} transitions={{}} />
  </div>
);
