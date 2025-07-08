/**
 * Game-Inspired Responsive Layout
 * Incorporates design patterns from Mahjong, Spider Solitaire, and other strategy games
 * Features: Tile-based layouts, cascading information, strategic visual hierarchy
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Crown,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Brain,
  Activity,
  ChevronRight,
  ChevronDown,
  Layers,
  RotateCcw,
  Shuffle,
  Play,
  Pause,
  SkipForward,
} from "lucide-react";

interface GameTile {
  id: string;
  title: string;
  description: string;
  tier: "free" | "starter" | "professional" | "enterprise";
  category: "investment" | "analytics" | "tools" | "features";
  icon: React.ReactNode;
  level: number; // Mahjong-style layer level (0-4)
  position: { x: number; y: number }; // Grid position
  isActive: boolean;
  isLocked: boolean;
  connections: string[]; // Connected tile IDs (like Mahjong matches)
  route: string;
  estimatedTime: string;
  popularity: number;
}

interface GameLayoutProps {
  tiles: GameTile[];
  viewMode: "mahjong" | "solitaire" | "grid" | "cascade";
  onTileSelect: (tile: GameTile) => void;
  onLayoutChange: (layout: string) => void;
}

const GameInspiredLayout: React.FC<GameLayoutProps> = ({
  tiles,
  viewMode = "mahjong",
  onTileSelect,
  onLayoutChange,
}) => {
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [gameScore, setGameScore] = useState(0);
  const layoutRef = useRef<HTMLDivElement>(null);

  // Filter tiles based on search and tier
  const filteredTiles = tiles.filter((tile) => {
    const matchesSearch =
      tile.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tile.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = filterTier === "all" || tile.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  // Mahjong-style tile selection logic
  const handleTileClick = (tile: GameTile) => {
    if (tile.isLocked) return;

    if (selectedTiles.includes(tile.id)) {
      setSelectedTiles((prev) => prev.filter((id) => id !== tile.id));
    } else if (selectedTiles.length < 2) {
      setSelectedTiles((prev) => [...prev, tile.id]);
    } else {
      // Replace oldest selection (like Mahjong matching)
      setSelectedTiles([selectedTiles[1], tile.id]);
    }

    // Check for matches
    if (selectedTiles.length === 1) {
      const selectedTile = tiles.find((t) => t.id === selectedTiles[0]);
      if (selectedTile && canTilesMatch(selectedTile, tile)) {
        // Matching logic - could navigate or perform action
        setTimeout(() => {
          onTileSelect(tile);
          setSelectedTiles([]);
          setGameScore((prev) => prev + 10);
        }, 300);
      }
    }
  };

  // Game-style matching logic
  const canTilesMatch = (tile1: GameTile, tile2: GameTile): boolean => {
    return (
      tile1.category === tile2.category ||
      tile1.tier === tile2.tier ||
      tile1.connections.includes(tile2.id)
    );
  };

  // Render tiles in Mahjong-style pyramid layout
  const renderMahjongLayout = () => {
    const maxLevel = Math.max(...filteredTiles.map((tile) => tile.level));

    return (
      <div className="relative w-full h-full min-h-[600px] perspective-1000">
        {Array.from({ length: maxLevel + 1 }, (_, level) => (
          <div
            key={level}
            className="absolute inset-0"
            style={{
              transform: `translateZ(${level * 10}px)`,
              zIndex: maxLevel - level + 10,
            }}
          >
            <div className="grid grid-cols-8 gap-2 p-4">
              {filteredTiles
                .filter((tile) => tile.level === level)
                .map((tile, index) => (
                  <MahjongTile
                    key={tile.id}
                    tile={tile}
                    isSelected={selectedTiles.includes(tile.id)}
                    isHovered={hoveredTile === tile.id}
                    onHover={setHoveredTile}
                    onClick={handleTileClick}
                    animationDelay={index * 100}
                    animationEnabled={animationEnabled}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render tiles in Spider Solitaire column layout
  const renderSolitaireLayout = () => {
    const columns = 8;
    const tilesPerColumn = Math.ceil(filteredTiles.length / columns);

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4 p-4">
        {Array.from({ length: columns }, (_, colIndex) => (
          <div key={colIndex} className="space-y-2">
            {filteredTiles
              .slice(colIndex * tilesPerColumn, (colIndex + 1) * tilesPerColumn)
              .map((tile, index) => (
                <SolitaireTile
                  key={tile.id}
                  tile={tile}
                  stackIndex={index}
                  isSelected={selectedTiles.includes(tile.id)}
                  onClick={handleTileClick}
                  animationDelay={colIndex * 200 + index * 50}
                />
              ))}
          </div>
        ))}
      </div>
    );
  };

  // Render cascading information layout
  const renderCascadeLayout = () => {
    return (
      <div className="relative overflow-hidden">
        <div className="space-y-1">
          {filteredTiles.map((tile, index) => (
            <CascadeTile
              key={tile.id}
              tile={tile}
              index={index}
              isSelected={selectedTiles.includes(tile.id)}
              onClick={handleTileClick}
              animationDelay={index * 100}
            />
          ))}
        </div>
      </div>
    );
  };

  // Standard responsive grid layout
  const renderGridLayout = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {filteredTiles.map((tile, index) => (
          <GridTile
            key={tile.id}
            tile={tile}
            isSelected={selectedTiles.includes(tile.id)}
            onClick={handleTileClick}
            animationDelay={index * 50}
          />
        ))}
      </div>
    );
  };

  const renderLayout = () => {
    switch (viewMode) {
      case "mahjong":
        return renderMahjongLayout();
      case "solitaire":
        return renderSolitaireLayout();
      case "cascade":
        return renderCascadeLayout();
      case "grid":
      default:
        return renderGridLayout();
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Game-style header with controls */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Game Title & Score */}
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  QuantumVest Strategy Platform
                </h1>
                <p className="text-sm text-gray-600">
                  Navigate your investment journey • Score: {gameScore}
                </p>
              </div>
              <Badge variant="outline" className="hidden md:flex">
                {filteredTiles.length} Platforms Available
              </Badge>
            </div>

            {/* Game Controls */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={viewMode === "mahjong" ? "default" : "outline"}
                size="sm"
                onClick={() => onLayoutChange("mahjong")}
                className="game-button"
              >
                <Layers className="h-4 w-4 mr-1" />
                Mahjong
              </Button>
              <Button
                variant={viewMode === "solitaire" ? "default" : "outline"}
                size="sm"
                onClick={() => onLayoutChange("solitaire")}
                className="game-button"
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Solitaire
              </Button>
              <Button
                variant={viewMode === "cascade" ? "default" : "outline"}
                size="sm"
                onClick={() => onLayoutChange("cascade")}
                className="game-button"
              >
                <List className="h-4 w-4 mr-1" />
                Cascade
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => onLayoutChange("grid")}
                className="game-button"
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Grid
              </Button>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search investment strategies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 game-input"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm game-select"
              >
                <option value="all">All Tiers</option>
                <option value="free">Free</option>
                <option value="starter">Starter</option>
                <option value="professional">Professional</option>
                <option value="enterprise">Enterprise</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setAnimationEnabled(!animationEnabled)}
                className="game-button"
              >
                {animationEnabled ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedTiles([]);
                  setSearchQuery("");
                  setFilterTier("all");
                }}
                className="game-button"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Layout */}
      <div ref={layoutRef} className="relative">
        {renderLayout()}
      </div>

      {/* Game Stats Footer */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t p-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
            <div className="flex gap-6">
              <span>Selected: {selectedTiles.length}/2</span>
              <span>Filtered: {filteredTiles.length} platforms</span>
              <span>Layout: {viewMode}</span>
            </div>
            <div className="flex gap-4">
              <span>Score: {gameScore}</span>
              <span>Animations: {animationEnabled ? "On" : "Off"}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        .game-button {
          transition: all 0.2s ease;
          transform-origin: center;
        }

        .game-button:hover {
          transform: scale(1.05);
        }

        .game-button:active {
          transform: scale(0.95);
        }

        .game-input,
        .game-select {
          transition: all 0.2s ease;
        }

        .game-input:focus,
        .game-select:focus {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

// Mahjong-style tile component
const MahjongTile: React.FC<{
  tile: GameTile;
  isSelected: boolean;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onClick: (tile: GameTile) => void;
  animationDelay: number;
  animationEnabled: boolean;
}> = ({
  tile,
  isSelected,
  isHovered,
  onHover,
  onClick,
  animationDelay,
  animationEnabled,
}) => {
  return (
    <div
      className={`
        relative group cursor-pointer transform transition-all duration-300
        ${animationEnabled ? "animate-slide-in" : ""}
        ${isSelected ? "scale-110 rotate-3 z-20" : "hover:scale-105 hover:-rotate-1"}
        ${tile.isLocked ? "opacity-50 cursor-not-allowed" : ""}
      `}
      style={{
        animationDelay: `${animationDelay}ms`,
        gridColumn: `${tile.position.x + 1}`,
        gridRow: `${tile.position.y + 1}`,
      }}
      onMouseEnter={() => onHover(tile.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(tile)}
    >
      <Card
        className={`
        h-24 w-20 border-2 shadow-lg
        ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}
        ${isHovered ? "shadow-xl" : ""}
        ${tile.isLocked ? "bg-gray-100" : ""}
      `}
      >
        <CardContent className="p-2 flex flex-col items-center justify-center h-full">
          <div
            className={`
            text-lg transition-colors duration-200
            ${isSelected ? "text-blue-600" : "text-gray-700"}
          `}
          >
            {tile.icon}
          </div>
          <div className="text-xs font-medium text-center mt-1 line-clamp-2">
            {tile.title}
          </div>
          <Badge
            variant={tile.tier === "enterprise" ? "default" : "secondary"}
            className="text-xs mt-1"
          >
            {tile.tier.charAt(0).toUpperCase()}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

// Spider Solitaire-style cascading tile
const SolitaireTile: React.FC<{
  tile: GameTile;
  stackIndex: number;
  isSelected: boolean;
  onClick: (tile: GameTile) => void;
  animationDelay: number;
}> = ({ tile, stackIndex, isSelected, onClick, animationDelay }) => {
  return (
    <div
      className={`
        relative transform transition-all duration-300 cursor-pointer
        ${isSelected ? "scale-105 z-10" : "hover:scale-102"}
        animate-cascade
      `}
      style={{
        animationDelay: `${animationDelay}ms`,
        marginTop: stackIndex > 0 ? "-2rem" : "0",
      }}
      onClick={() => onClick(tile)}
    >
      <Card
        className={`
        w-full border shadow-md
        ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}
        ${stackIndex === 0 ? "shadow-lg" : "shadow-sm"}
      `}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div
              className={`
              text-xl transition-colors duration-200
              ${isSelected ? "text-blue-600" : "text-gray-700"}
            `}
            >
              {tile.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm text-gray-900 truncate">
                {tile.title}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {tile.description}
              </p>
            </div>
            <Badge
              variant={tile.tier === "enterprise" ? "default" : "secondary"}
            >
              {tile.tier}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Cascading information tile
const CascadeTile: React.FC<{
  tile: GameTile;
  index: number;
  isSelected: boolean;
  onClick: (tile: GameTile) => void;
  animationDelay: number;
}> = ({ tile, index, isSelected, onClick, animationDelay }) => {
  return (
    <div
      className={`
        transform transition-all duration-300 cursor-pointer
        ${isSelected ? "scale-102 bg-blue-50" : "hover:bg-gray-50"}
        animate-slide-in-right
      `}
      style={{
        animationDelay: `${animationDelay}ms`,
        paddingLeft: `${(index % 4) * 1}rem`,
      }}
      onClick={() => onClick(tile)}
    >
      <div className="flex items-center gap-4 p-4 border-l-4 border-transparent hover:border-blue-500">
        <div
          className={`
          text-2xl transition-colors duration-200
          ${isSelected ? "text-blue-600" : "text-gray-700"}
        `}
        >
          {tile.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{tile.title}</h3>
          <p className="text-sm text-gray-600">{tile.description}</p>
          <div className="flex gap-2 mt-2">
            <Badge
              variant={tile.tier === "enterprise" ? "default" : "secondary"}
            >
              {tile.tier}
            </Badge>
            <Badge variant="outline">{tile.estimatedTime}</Badge>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
};

// Standard grid tile
const GridTile: React.FC<{
  tile: GameTile;
  isSelected: boolean;
  onClick: (tile: GameTile) => void;
  animationDelay: number;
}> = ({ tile, isSelected, onClick, animationDelay }) => {
  return (
    <div
      className={`
        transform transition-all duration-300 cursor-pointer
        ${isSelected ? "scale-105" : "hover:scale-102"}
        animate-fade-in
      `}
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={() => onClick(tile)}
    >
      <Card
        className={`
        h-full border shadow-sm hover:shadow-md
        ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}
      `}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div
              className={`
              text-2xl transition-colors duration-200
              ${isSelected ? "text-blue-600" : "text-gray-700"}
            `}
            >
              {tile.icon}
            </div>
            <Badge
              variant={tile.tier === "enterprise" ? "default" : "secondary"}
            >
              {tile.tier}
            </Badge>
          </div>
          <CardTitle className="text-lg">{tile.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-3">{tile.description}</CardDescription>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">{tile.estimatedTime}</span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              <span>{tile.popularity}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameInspiredLayout;
