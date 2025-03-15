import React, { useState, useRef, useEffect } from "react";
import {
  ModularBlocksCreatorProps,
  HarmonicBlock,
  TransitionBridge,
  Track,
} from "./types";
import { blockLibrary } from "./data/blockLibrary";
import { bridgeLibrary } from "./data/bridgeLibrary";
import { templates } from "./data/templates";
import { isCompatibleKey } from "./utils/keyUtils";
import { getBlockTypeColor } from "./utils/colorUtils";
import TopBar from "./components/TopBar";
import BlockLibraryPanel from "./components/BlockLibraryPanel";
import MixCanvas from "./components/MixCanvas";
import EnergyCurveVisualization from "./components/EnergyCurveVisualization";
import HarmonicPathVisualization from "./components/HarmonicPathVisualization";
import DetailsPanel from "./components/DetailsPanel";
import CustomBlockDialog from "./components/CustomBlockDialog";

const ModularBlocksCreator: React.FC<ModularBlocksCreatorProps> = ({
  onComplete,
  onCancel,
  availableTracks = [],
}) => {
  // Main state
  const [setDuration, setSetDuration] = useState<number>(60); // in minutes
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [showEnergyCurve, setShowEnergyCurve] = useState<boolean>(true);
  const [showHarmonicPath, setShowHarmonicPath] = useState<boolean>(true);
  const [autoPopulate, setAutoPopulate] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"horizontal" | "vertical">(
    "horizontal",
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDuration, setFilterDuration] = useState<string>("all");
  const [showCreateCustomBlock, setShowCreateCustomBlock] =
    useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragOverBlockId, setDragOverBlockId] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [trackRecommendations, setTrackRecommendations] = useState<Track[]>([]);

  // Custom block creation state
  const [newBlockName, setNewBlockName] = useState<string>("");
  const [newBlockCode, setNewBlockCode] = useState<string>("");
  const [newBlockType, setNewBlockType] = useState<string>("CUSTOM");
  const [newBlockKeyPattern, setNewBlockKeyPattern] = useState<string[]>([]);
  const [newBlockEnergyProfile, setNewBlockEnergyProfile] = useState<number[]>([
    50,
  ]);
  const [newBlockDuration, setNewBlockDuration] = useState<number>(10);
  const [newBlockColor, setNewBlockColor] = useState<string>("#64748b");
  const [newBlockGenreAffinity, setNewBlockGenreAffinity] = useState<string[]>(
    [],
  );

  // Canvas refs
  const canvasRef = useRef<HTMLDivElement>(null);

  // State for the current mix being built
  const [mixBlocks, setMixBlocks] = useState<HarmonicBlock[]>([]);
  const [mixBridges, setMixBridges] = useState<TransitionBridge[]>([]);
  const [customBlocks, setCustomBlocks] = useState<HarmonicBlock[]>([]);

  // Effect to generate track recommendations when a position is selected
  useEffect(() => {
    if (selectedBlockId && selectedPositionId && availableTracks.length > 0) {
      const block = mixBlocks.find((b) => b.id === selectedBlockId);
      if (!block) return;

      const position = block.trackPositions.find(
        (p) => p.id === selectedPositionId,
      );
      if (!position) return;

      // Filter tracks by key compatibility
      const compatibleTracks = availableTracks.filter((track) => {
        // In a real app, this would use proper key compatibility logic
        return (
          track.key === position.key || isCompatibleKey(track.key, position.key)
        );
      });

      // Sort by energy level similarity
      const sortedTracks = compatibleTracks.sort((a, b) => {
        const aDiff = Math.abs(a.energy - position.energy);
        const bDiff = Math.abs(b.energy - position.energy);
        return aDiff - bDiff;
      });

      setTrackRecommendations(sortedTracks.slice(0, 10));
    }
  }, [selectedBlockId, selectedPositionId, availableTracks, mixBlocks]);

  // Function to add a block to the mix
  const addBlockToMix = (blockId: string) => {
    // Find the block in the library or custom blocks
    const block = [...blockLibrary, ...customBlocks].find(
      (b) => b.id === blockId,
    );
    if (!block) return;

    // Create a copy of the block with a unique ID
    const newBlock = {
      ...block,
      id: `${block.id}-${Date.now()}`,
      trackPositions: block.trackPositions.map((pos) => ({
        ...pos,
        id: `${pos.id}-${Date.now()}`,
      })),
    };

    // Auto-populate tracks if enabled
    if (autoPopulate && availableTracks.length > 0) {
      newBlock.trackPositions = newBlock.trackPositions.map((position) => {
        const compatibleTracks = availableTracks.filter(
          (track) =>
            track.key === position.key ||
            isCompatibleKey(track.key, position.key),
        );

        if (compatibleTracks.length > 0) {
          // Find best match by energy
          const bestMatch = compatibleTracks.sort((a, b) => {
            const aDiff = Math.abs(a.energy - position.energy);
            const bDiff = Math.abs(b.energy - position.energy);
            return aDiff - bDiff;
          })[0];

          return {
            ...position,
            trackId: bestMatch.id,
            trackName: bestMatch.title,
            artist: bestMatch.artist,
            bpm: bestMatch.bpm,
          };
        }

        return position;
      });
    }

    setMixBlocks([...mixBlocks, newBlock]);

    // If there's a previous block, suggest a transition bridge
    if (mixBlocks.length > 0) {
      const prevBlock = mixBlocks[mixBlocks.length - 1];
      suggestBridge(prevBlock.id, newBlock.id);
    }

    // Select the newly added block
    setSelectedBlockId(newBlock.id);
  };

  // Function to suggest a transition bridge between blocks
  const suggestBridge = (fromBlockId: string, toBlockId: string) => {
    const fromBlock = mixBlocks.find((b) => b.id === fromBlockId);
    const toBlock = mixBlocks.find((b) => b.id === toBlockId);
    if (!fromBlock || !toBlock) return;

    // Get the last key from the first block and the first key from the second block
    const lastKey = fromBlock.keyPattern[fromBlock.keyPattern.length - 1];
    const firstKey = toBlock.keyPattern[0];

    // Determine bridge type based on key relationship
    let bridgeType: "PERFECT" | "NATURAL" | "MODAL" | "ENERGY" | "TENSION" =
      "NATURAL";

    if (lastKey === firstKey) {
      bridgeType = "PERFECT";
    } else if (
      (parseInt(lastKey) + 1) % 12 === parseInt(firstKey) ||
      (parseInt(lastKey) - 1 + 12) % 12 === parseInt(firstKey)
    ) {
      bridgeType = "NATURAL";
    } else if (
      (lastKey.endsWith("A") && firstKey.endsWith("B")) ||
      (lastKey.endsWith("B") && firstKey.endsWith("A"))
    ) {
      bridgeType = "MODAL";
    } else if (
      (parseInt(lastKey) + 7) % 12 === parseInt(firstKey) ||
      (parseInt(lastKey) - 5 + 12) % 12 === parseInt(firstKey)
    ) {
      bridgeType = "ENERGY";
    } else {
      bridgeType = "TENSION";
    }

    // Create a new bridge
    const newBridge: TransitionBridge = {
      id: `bridge-${fromBlockId}-${toBlockId}`,
      fromBlockId,
      toBlockId,
      type: bridgeType,
      trackPositions: [
        { id: `bridge-pos1-${Date.now()}`, key: lastKey },
        { id: `bridge-pos2-${Date.now()}`, key: firstKey },
      ],
    };

    setMixBridges([...mixBridges, newBridge]);
  };

  // Function to remove a block from the mix
  const removeBlock = (blockId: string) => {
    // Remove the block
    setMixBlocks(mixBlocks.filter((b) => b.id !== blockId));

    // Remove any bridges connected to this block
    setMixBridges(
      mixBridges.filter(
        (b) => b.fromBlockId !== blockId && b.toBlockId !== blockId,
      ),
    );

    // If this was the selected block, clear the selection
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
      setSelectedPositionId(null);
    }

    // If we removed a block in the middle, suggest a new bridge between the now-adjacent blocks
    const blockIndex = mixBlocks.findIndex((b) => b.id === blockId);
    if (blockIndex > 0 && blockIndex < mixBlocks.length - 1) {
      const prevBlock = mixBlocks[blockIndex - 1];
      const nextBlock = mixBlocks[blockIndex + 1];
      suggestBridge(prevBlock.id, nextBlock.id);
    }
  };

  // Function to handle block drag start
  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setIsDragging(true);
    setDraggedBlockId(blockId);
    e.dataTransfer.setData("text/plain", blockId);
    e.dataTransfer.effectAllowed = "move";
  };

  // Function to handle block drag over
  const handleDragOver = (e: React.DragEvent, blockId: string) => {
    e.preventDefault();
    if (draggedBlockId !== blockId) {
      setDragOverBlockId(blockId);
    }
  };

  // Function to handle block drop
  const handleDrop = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();
    setIsDragging(false);
    setDragOverBlockId(null);

    if (!draggedBlockId || draggedBlockId === targetBlockId) return;

    // Reorder blocks
    const sourceIndex = mixBlocks.findIndex((b) => b.id === draggedBlockId);
    const targetIndex = mixBlocks.findIndex((b) => b.id === targetBlockId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const newBlocks = [...mixBlocks];
    const [movedBlock] = newBlocks.splice(sourceIndex, 1);
    newBlocks.splice(targetIndex, 0, movedBlock);

    setMixBlocks(newBlocks);

    // Rebuild bridges
    const newBridges: TransitionBridge[] = [];
    for (let i = 0; i < newBlocks.length - 1; i++) {
      const fromBlock = newBlocks[i];
      const toBlock = newBlocks[i + 1];

      // Check if a bridge already exists
      const existingBridge = mixBridges.find(
        (b) => b.fromBlockId === fromBlock.id && b.toBlockId === toBlock.id,
      );

      if (existingBridge) {
        newBridges.push(existingBridge);
      } else {
        // Create a new bridge
        suggestBridge(fromBlock.id, toBlock.id);
      }
    }

    setMixBridges(newBridges);
    setDraggedBlockId(null);
  };

  // Function to handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedBlockId(null);
    setDragOverBlockId(null);
  };

  // Function to create a custom block
  const handleCreateCustomBlock = () => {
    if (!newBlockName || !newBlockCode || newBlockKeyPattern.length === 0) {
      return; // Validation failed
    }

    const newBlock: HarmonicBlock = {
      id: `custom-${Date.now()}`,
      code: newBlockCode,
      name: newBlockName,
      type: newBlockType as any,
      keyPattern: newBlockKeyPattern,
      energyProfile: newBlockEnergyProfile,
      duration: newBlockDuration,
      color: newBlockColor || getBlockTypeColor(newBlockType),
      genreAffinity: newBlockGenreAffinity,
      isCustom: true,
      trackPositions: newBlockKeyPattern.map((key, index) => ({
        id: `custom-pos-${index}-${Date.now()}`,
        key,
        energy: newBlockEnergyProfile[index] || 50,
      })),
    };

    setCustomBlocks([...customBlocks, newBlock]);
    setShowCreateCustomBlock(false);

    // Reset form
    setNewBlockName("");
    setNewBlockCode("");
    setNewBlockType("CUSTOM");
    setNewBlockKeyPattern([]);
    setNewBlockEnergyProfile([50]);
    setNewBlockDuration(10);
    setNewBlockColor("#64748b");
    setNewBlockGenreAffinity([]);
  };

  // Function to assign a track to a position
  const assignTrackToPosition = (trackId: string) => {
    if (!selectedBlockId || !selectedPositionId) return;

    const track = availableTracks.find((t) => t.id === trackId);
    if (!track) return;

    const updatedBlocks = mixBlocks.map((block) => {
      if (block.id === selectedBlockId) {
        return {
          ...block,
          trackPositions: block.trackPositions.map((pos) => {
            if (pos.id === selectedPositionId) {
              return {
                ...pos,
                trackId: track.id,
                trackName: track.title,
                artist: track.artist,
                bpm: track.bpm,
                tags: track.tags,
              };
            }
            return pos;
          }),
        };
      }
      return block;
    });

    setMixBlocks(updatedBlocks);
  };

  // Function to load a template
  const loadTemplate = (templateId: string) => {
    // Clear current mix
    setMixBlocks([]);
    setMixBridges([]);

    // Load template blocks and bridges
    if (templateId === "progressive") {
      // Progressive Journey template
      const template = [
        blockLibrary.find((b) => b.id === "op1"),
        blockLibrary.find((b) => b.id === "eb1"),
        blockLibrary.find((b) => b.id === "pt1"),
        blockLibrary.find((b) => b.id === "ep1"),
        blockLibrary.find((b) => b.id === "er1"),
        blockLibrary.find((b) => b.id === "cl1"),
      ].filter(Boolean) as HarmonicBlock[];

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
    } else if (templateId === "techno") {
      // Techno Expedition template
      const template = [
        blockLibrary.find((b) => b.id === "op2"),
        blockLibrary.find((b) => b.id === "eb2"),
        blockLibrary.find((b) => b.id === "pt2"),
        blockLibrary.find((b) => b.id === "er2"),
        blockLibrary.find((b) => b.id === "cl1"),
      ].filter(Boolean) as HarmonicBlock[];

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
    } else if (templateId === "house") {
      // House Classics template
      const template = [
        blockLibrary.find((b) => b.id === "op1"),
        blockLibrary.find((b) => b.id === "eb1"),
        blockLibrary.find((b) => b.id === "ep2"),
        blockLibrary.find((b) => b.id === "pt1"),
        blockLibrary.find((b) => b.id === "ep1"),
        blockLibrary.find((b) => b.id === "er1"),
        blockLibrary.find((b) => b.id === "cl2"),
      ].filter(Boolean) as HarmonicBlock[];

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
    } else if (templateId === "ambient") {
      // Ambient Experience template
      const template = [
        blockLibrary.find((b) => b.id === "op2"),
        blockLibrary.find((b) => b.id === "ep2"),
        blockLibrary.find((b) => b.id === "ep1"),
        blockLibrary.find((b) => b.id === "er2"),
        blockLibrary.find((b) => b.id === "cl2"),
      ].filter(Boolean) as HarmonicBlock[];

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
    } else if (templateId === "peak-time") {
      // Peak Time Focus template
      const template = [
        blockLibrary.find((b) => b.id === "eb2"),
        blockLibrary.find((b) => b.id === "pt1"),
        blockLibrary.find((b) => b.id === "pt2"),
        blockLibrary.find((b) => b.id === "qs1"),
        blockLibrary.find((b) => b.id === "pt1"),
        blockLibrary.find((b) => b.id === "er1"),
      ].filter(Boolean) as HarmonicBlock[];

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
    }
  };

  // Function to complete the mix creation
  const handleComplete = () => {
    onComplete(mixBlocks, mixBridges);
  };

  // Filter blocks based on search and filters
  const filteredBlocks = [...blockLibrary, ...customBlocks].filter((block) => {
    // Filter by search term
    if (
      searchTerm &&
      !block.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !block.code.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filter by type
    if (filterType !== "all" && block.type !== filterType) {
      return false;
    }

    // Filter by duration
    if (filterDuration !== "all") {
      if (filterDuration === "short" && block.duration > 10) return false;
      if (
        filterDuration === "medium" &&
        (block.duration < 10 || block.duration > 15)
      )
        return false;
      if (filterDuration === "long" && block.duration < 15) return false;
    }

    return true;
  });

  return (
    <div className="w-full h-full bg-background flex flex-col">
      {/* Top Bar */}
      <TopBar
        setDuration={setDuration}
        setSetDuration={setSetDuration}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
        loadTemplate={loadTemplate}
        showEnergyCurve={showEnergyCurve}
        setShowEnergyCurve={setShowEnergyCurve}
        showHarmonicPath={showHarmonicPath}
        setShowHarmonicPath={setShowHarmonicPath}
        autoPopulate={autoPopulate}
        setAutoPopulate={setAutoPopulate}
        setShowTutorial={setShowTutorial}
        onCancel={onCancel}
        handleComplete={handleComplete}
        templates={templates}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Block Library */}
        <BlockLibraryPanel
          blockLibrary={blockLibrary}
          bridgeLibrary={bridgeLibrary}
          customBlocks={customBlocks}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          filterDuration={filterDuration}
          setFilterDuration={setFilterDuration}
          filteredBlocks={filteredBlocks}
          addBlockToMix={addBlockToMix}
          setShowCreateCustomBlock={setShowCreateCustomBlock}
        />

        {/* Main Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <MixCanvas
            mixBlocks={mixBlocks}
            mixBridges={mixBridges}
            templates={templates}
            selectedBlockId={selectedBlockId}
            selectedPositionId={selectedPositionId}
            dragOverBlockId={dragOverBlockId}
            viewMode={viewMode}
            zoomLevel={zoomLevel}
            canvasRef={canvasRef}
            setSelectedBlockId={setSelectedBlockId}
            setSelectedPositionId={setSelectedPositionId}
            setSelectedTemplate={setSelectedTemplate}
            loadTemplate={loadTemplate}
            setZoomLevel={setZoomLevel}
            setViewMode={setViewMode}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleDragEnd={handleDragEnd}
            removeBlock={removeBlock}
          />

          {/* Energy curve visualization */}
          <EnergyCurveVisualization
            mixBlocks={mixBlocks}
            showEnergyCurve={showEnergyCurve}
          />

          {/* Harmonic path visualization */}
          <HarmonicPathVisualization
            mixBlocks={mixBlocks}
            showHarmonicPath={showHarmonicPath}
          />
        </div>

        {/* Right Panel - Details */}
        <DetailsPanel
          selectedBlockId={selectedBlockId}
          selectedPositionId={selectedPositionId}
          mixBlocks={mixBlocks}
          trackRecommendations={trackRecommendations}
          assignTrackToPosition={assignTrackToPosition}
        />
      </div>

      {/* Create Custom Block Dialog */}
      <CustomBlockDialog
        showCreateCustomBlock={showCreateCustomBlock}
        setShowCreateCustomBlock={setShowCreateCustomBlock}
        newBlockName={newBlockName}
        setNewBlockName={setNewBlockName}
        newBlockCode={newBlockCode}
        setNewBlockCode={setNewBlockCode}
        newBlockType={newBlockType}
        setNewBlockType={setNewBlockType}
        newBlockKeyPattern={newBlockKeyPattern}
        setNewBlockKeyPattern={setNewBlockKeyPattern}
        newBlockEnergyProfile={newBlockEnergyProfile}
        setNewBlockEnergyProfile={setNewBlockEnergyProfile}
        newBlockDuration={newBlockDuration}
        setNewBlockDuration={setNewBlockDuration}
        newBlockColor={newBlockColor}
        setNewBlockColor={setNewBlockColor}
        newBlockGenreAffinity={newBlockGenreAffinity}
        setNewBlockGenreAffinity={setNewBlockGenreAffinity}
        handleCreateCustomBlock={handleCreateCustomBlock}
      />
    </div>
  );
};

export default ModularBlocksCreator;
