import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./layout/Header";
import DashboardOverview from "./dashboard/DashboardOverview";
import MixCreator from "./mixCreator/MixCreator";
import TrackLibrary from "./trackLibrary/TrackLibrary";
import SavedMixes from "./savedMixes/SavedMixes";
import HarmonicWheel from "./common/HarmonicWheel";
import {
  Home as HomeIcon,
  Music,
  Library,
  FolderPlus,
  Settings,
} from "lucide-react";
import { Button } from "./ui/button";

type ActiveView = "dashboard" | "mixCreator" | "trackLibrary" | "savedMixes";

const Home = () => {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [selectedKey, setSelectedKey] = useState<string>("8B"); // Default to C major

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
      case "trackLibrary":
        window.history.pushState({}, "", "/track-library");
        break;
      case "savedMixes":
        window.history.pushState({}, "", "/saved-mixes");
        break;
    }
  };

  // Check URL on component mount and set the active view accordingly
  React.useEffect(() => {
    const path = window.location.pathname;
    if (path === "/create-mix") {
      setActiveView("mixCreator");
    } else if (path === "/track-library") {
      setActiveView("trackLibrary");
    } else if (path === "/saved-mixes") {
      setActiveView("savedMixes");
    } else {
      setActiveView("dashboard");
    }
  }, []);

  // Render the appropriate view based on activeView state
  const renderView = () => {
    switch (activeView) {
      case "mixCreator":
        return (
          <MixCreator
            selectedKey={selectedKey}
            onKeySelect={setSelectedKey}
            initialMixTitle="New Harmonic Mix"
          />
        );
      case "trackLibrary":
        return <TrackLibrary />;
      case "savedMixes":
        return <SavedMixes />;
      case "dashboard":
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header with navigation */}
      <Header
        username="DJ Producer"
        avatarUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=mixer"
      />

      {/* Main content area */}
      <main className="flex-1 bg-gray-50">
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
            variant={activeView === "trackLibrary" ? "default" : "ghost"}
            size="sm"
            onClick={() => navigateTo("trackLibrary")}
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
                <Link
                  to="#"
                  onClick={() => navigateTo("dashboard")}
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <HomeIcon className="h-4 w-4" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  onClick={() => navigateTo("trackLibrary")}
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Library className="h-4 w-4" />
                  Track Library
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  onClick={() => navigateTo("savedMixes")}
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <FolderPlus className="h-4 w-4" />
                  Saved Mixes
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  onClick={() => navigateTo("mixCreator")}
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Music className="h-4 w-4" />
                  Create New Mix
                </Link>
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
  );
};

export default Home;
