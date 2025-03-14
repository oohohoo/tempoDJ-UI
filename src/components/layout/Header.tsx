import React from "react";
import { Music, Library, FolderPlus, Settings, User } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface HeaderProps {
  username?: string;
  avatarUrl?: string;
  onNavigate?: (view: string) => void;
}

const Header = ({
  username = "DJ User",
  avatarUrl = "",
  onNavigate,
}: HeaderProps) => {
  const handleNavigation = (e: React.MouseEvent, view: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(view);
    }
  };

  return (
    <header className="w-full h-20 px-6 bg-background border-b border-border flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-2">
        <Music className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold">Harmonic DJ Mix Constructor</h1>
      </div>

      <nav className="flex items-center space-x-6">
        <Button
          className="flex items-center space-x-2"
          onClick={(e) => handleNavigation(e, "mixCreator")}
        >
          <Music className="h-5 w-5" />
          <span>Create New Mix</span>
        </Button>
      </nav>

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage
                  src={
                    avatarUrl ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=dj"
                  }
                  alt={username}
                />
                <AvatarFallback>
                  {username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(e) => handleNavigation(e, "profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => handleNavigation(e, "settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
