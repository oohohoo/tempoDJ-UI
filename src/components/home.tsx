import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import DashboardOverview from "./dashboard/DashboardOverview";
import MixCreator from "./mixCreator/MixCreator";
import Collection from "./collection/Collection";
import SavedMixes from "./savedMixes/SavedMixes";
import HarmonicWheel from "./common/HarmonicWheel";
import ProfilePage from "./profile/ProfilePage";
import SettingsPage from "./settings/SettingsPage";
import MixTimelineEditor from "./mixCreator/MixTimelineEditor";
import {
  Home as HomeIcon,
  Music,
  Library,
  FolderPlus,
  Settings,
} from "lucide-react";
import { Button } from "./ui/button";

type ActiveView =
  | "dashboard"
  | "mixCreator"
  | "collection"
  | "savedMixes"
  | "profile"
  | "settings"
  | "analytics"
  | "help";

const Home = () => {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [selectedKey, setSelectedKey] = useState<string>("8B"); // Default to C major
  const location = useLocation();

  // Function to handle navigation between views
  const navigateTo = (view: ActiveView) => {
    setActiveView(view);
    // Update URL to match the view for better navigation
    switch (view) {
      case "dashboard":
        window.history.pushState({}, "", "/");
        break;
      case "mixCreator":
        window.history.pushState({}, "", "/create-mix");
        break;
      case "collection":
        window.history.pushState({}, "", "/collection");
        break;
      case "savedMixes":
        window.history.pushState({}, "", "/saved-mixes");
        break;
      case "profile":
        window.history.pushState({}, "", "/profile");
        break;
      case "settings":
        window.history.pushState({}, "", "/settings");
        break;
      case "analytics":
        window.history.pushState({}, "", "/analytics");
        break;
      case "help":
        window.history.pushState({}, "", "/help");
        break;
    }
  };

  // Check URL on component mount and set the active view accordingly
  React.useEffect(() => {
    const path = location.pathname;
    if (path === "/create-mix") {
      setActiveView("mixCreator");
    } else if (path === "/collection") {
      setActiveView("collection");
    } else if (path === "/saved-mixes") {
      setActiveView("savedMixes");
    } else if (path === "/profile") {
      setActiveView("profile");
    } else if (path === "/settings") {
      setActiveView("settings");
    } else if (path === "/analytics") {
      setActiveView("analytics");
    } else if (path === "/help") {
      setActiveView("help");
    } else {
      setActiveView("dashboard");
    }
  }, [location.pathname]);

  // Sample data for MixTimelineEditor
  const sampleTracks = [
    {
      id: "track-1",
      title: "Summer Vibes",
      artist: "DJ Sunshine",
      key: "8B",
      bpm: 128,
      duration: 320,
      waveform:
        "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=600&q=75",
      color: "#4f46e5",
      startPosition: 0,
      volume: 100,
      fadeInDuration: 10,
      fadeOutDuration: 15,
      eqSettings: { low: 0, mid: 0, high: 0 },
    },
    {
      id: "track-2",
      title: "Midnight Groove",
      artist: "Night Owl",
      key: "9B",
      bpm: 126,
      duration: 345,
      waveform:
        "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=600&q=75",
      color: "#8b5cf6",
      startPosition: 300,
      volume: 100,
      fadeInDuration: 15,
      fadeOutDuration: 10,
      eqSettings: { low: 0, mid: 0, high: 0 },
    },
  ];

  const sampleTransitions = {
    "track-1-track-2": {
      fromTrackId: "track-1",
      toTrackId: "track-2",
      startPoint: 0.8,
      duration: 20,
      type: "beatmatch",
      eqSettings: { lowCut: 50, midCut: 30, highCut: 0 },
    },
  };

  // Render the appropriate view based on activeView state
  const renderView = () => {
    switch (activeView) {
      case "mixCreator":
        return (
          <div className="flex flex-col h-full">
            <MixCreator
              selectedKey={selectedKey}
              onKeySelect={setSelectedKey}
              initialMixTitle="New Harmonic Mix"
            />
          </div>
        );
      case "collection":
        return <Collection />;
      case "savedMixes":
        return <SavedMixes />;
      case "profile":
        return <ProfilePage />;
      case "settings":
        return <SettingsPage />;
      case "analytics":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Analytics</h1>
            <p>Analytics page is under construction.</p>
          </div>
        );
      case "help":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Help Center</h1>
            <p>Help page is under construction.</p>
          </div>
        );
      case "dashboard":
      default:
        return (
          <DashboardOverview onCreateMix={() => navigateTo("mixCreator")} />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        username="DJ Producer"
        avatarUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=mixer"
        onNavigate={navigateTo}
      />

      <div
        className="flex flex-col flex-1 overflow-hidden"
        style={{ marginLeft: "240px" }}
      >
        {/* Header with navigation */}
        <Header
          username="DJ Producer"
          avatarUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=mixer"
        />

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {/* Mobile navigation (visible on small screens) */}
          <div className="md:hidden flex justify-between p-4 bg-white border-b">
            <Button
              variant={activeView === "dashboard" ? "default" : "ghost"}
              size="sm"
              onClick={() => navigateTo("dashboard")}
              className="flex items-center gap-1"
            >
              <HomeIcon className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Dashboard</span>
            </Button>

            <Button
              variant={activeView === "mixCreator" ? "default" : "ghost"}
              size="sm"
              onClick={() => navigateTo("mixCreator")}
              className="flex items-center gap-1"
            >
              <Music className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Mix Creator</span>
            </Button>

            <Button
              variant={activeView === "collection" ? "default" : "ghost"}
              size="sm"
              onClick={() => navigateTo("collection")}
              className="flex items-center gap-1"
            >
              <Library className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Tracks</span>
            </Button>

            <Button
              variant={activeView === "savedMixes" ? "default" : "ghost"}
              size="sm"
              onClick={() => navigateTo("savedMixes")}
              className="flex items-center gap-1"
            >
              <FolderPlus className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Mixes</span>
            </Button>
          </div>

          {/* Render the active view */}
          {renderView()}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white p-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">
                Harmonic DJ Mix Constructor
              </h3>
              <p className="text-gray-400">
                Create perfect harmonic mixes with ease using our advanced key
                detection and BPM analysis tools.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("dashboard");
                    }}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <HomeIcon className="h-4 w-4" />
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("collection");
                    }}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Library className="h-4 w-4" />
                    Collection
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("savedMixes");
                    }}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <FolderPlus className="h-4 w-4" />
                    Saved Mixes
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("mixCreator");
                    }}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Music className="h-4 w-4" />
                    Create New Mix
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Harmonic Wheel</h3>
              <div className="flex justify-center">
                <HarmonicWheel
                  size={200}
                  selectedKey={selectedKey}
                  onKeySelect={setSelectedKey}
                  highlightCompatible={true}
                />
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-800 text-center text-gray-500">
            <p>
              © {new Date().getFullYear()} Harmonic DJ Mix Constructor. All
              rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
