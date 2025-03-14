import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Music,
  Library,
  FolderPlus,
  Settings,
  User,
  ChevronRight,
  ChevronLeft,
  LogOut,
  HelpCircle,
  BarChart2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  username?: string;
  avatarUrl?: string;
  onNavigate?: (view: string) => void;
}

const Sidebar = ({
  username = "DJ User",
  avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=mixer",
  onNavigate,
}: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const navItems = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Dashboard",
      path: "/",
      view: "dashboard",
    },
    {
      icon: <Library className="h-5 w-5" />,
      label: "Track Library",
      path: "/track-library",
      view: "trackLibrary",
    },
    {
      icon: <FolderPlus className="h-5 w-5" />,
      label: "Saved Mixes",
      path: "/saved-mixes",
      view: "savedMixes",
    },
    {
      icon: <Music className="h-5 w-5" />,
      label: "Create Mix",
      path: "/create-mix",
      view: "mixCreator",
    },
    {
      icon: <BarChart2 className="h-5 w-5" />,
      label: "Analytics",
      path: "/analytics",
      view: "analytics",
    },
  ];

  const bottomNavItems = [
    {
      icon: <User className="h-5 w-5" />,
      label: "Profile",
      path: "/profile",
      view: "profile",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      path: "/settings",
      view: "settings",
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: "Help",
      path: "/help",
      view: "help",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavigation = (e: React.MouseEvent, view: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(view);
    }
  };

  return (
    <div
      ref={sidebarRef}
      className={cn(
        "h-screen bg-background border-r flex flex-col transition-all duration-300 fixed left-0 top-0 z-40",
        collapsed ? "w-[70px]" : "w-[240px]",
      )}
    >
      <div className="p-4 flex items-center justify-between border-b">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Music className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-bold">DJ Mix</h1>
          </div>
        )}
        {collapsed && <Music className="h-6 w-6 text-primary mx-auto" />}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 ml-auto"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <TooltipProvider key={item.path}>
              <Tooltip delayDuration={collapsed ? 300 : 9999999}>
                <TooltipTrigger asChild>
                  <a href="#" onClick={(e) => handleNavigation(e, item.view)}>
                    <Button
                      variant={isActive(item.path) ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        collapsed ? "px-2" : "px-3",
                      )}
                    >
                      <span className={cn("mr-2", collapsed && "mr-0")}>
                        {item.icon}
                      </span>
                      {!collapsed && <span>{item.label}</span>}
                    </Button>
                  </a>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">{item.label}</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
      </div>

      <div className="border-t py-4 px-2 space-y-1">
        {bottomNavItems.map((item) => (
          <TooltipProvider key={item.path}>
            <Tooltip delayDuration={collapsed ? 300 : 9999999}>
              <TooltipTrigger asChild>
                <a href="#" onClick={(e) => handleNavigation(e, item.view)}>
                  <Button
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      collapsed ? "px-2" : "px-3",
                    )}
                  >
                    <span className={cn("mr-2", collapsed && "mr-0")}>
                      {item.icon}
                    </span>
                    {!collapsed && <span>{item.label}</span>}
                  </Button>
                </a>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">{item.label}</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ))}

        <TooltipProvider>
          <Tooltip delayDuration={collapsed ? 300 : 9999999}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50",
                  collapsed ? "px-2" : "px-3",
                )}
              >
                <span className={cn("mr-2", collapsed && "mr-0")}>
                  <LogOut className="h-5 w-5" />
                </span>
                {!collapsed && <span>Logout</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Logout</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="p-4 border-t">
        {collapsed ? (
          <Avatar className="h-10 w-10 mx-auto">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback>
              {username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={avatarUrl} alt={username} />
              <AvatarFallback>
                {username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{username}</p>
              <p className="text-xs text-muted-foreground truncate">
                DJ Account
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
