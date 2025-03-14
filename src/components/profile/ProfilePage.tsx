import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Music, Calendar, Edit } from "lucide-react";

const ProfilePage = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-background">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=mixer"
                    alt="DJ Producer"
                  />
                  <AvatarFallback>DP</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>DJ Producer</CardTitle>
              <p className="text-sm text-muted-foreground">Professional DJ</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>DJ Producer</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>dj@example.com</span>
                </div>
                <div className="flex items-center">
                  <Music className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>House, Techno, Progressive</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Joined January 2023</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Stats</h3>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-muted p-2 rounded-md">
                    <div className="text-xl font-bold">24</div>
                    <div className="text-xs text-muted-foreground">Mixes</div>
                  </div>
                  <div className="bg-muted p-2 rounded-md">
                    <div className="text-xl font-bold">156</div>
                    <div className="text-xs text-muted-foreground">Tracks</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="DJ Producer" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="djproducer" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="dj@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    defaultValue="Professional DJ with over 5 years of experience in creating harmonic mixes across various genres including House, Techno, and Progressive."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genres">Preferred Genres</Label>
                  <Input
                    id="genres"
                    defaultValue="House, Techno, Progressive"
                  />
                </div>

                <Button type="button">
                  <Edit className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button type="button">Change Password</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
