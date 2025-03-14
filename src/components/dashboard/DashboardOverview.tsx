import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Music, Plus, Upload, Clock, Calendar, BarChart2 } from "lucide-react";

interface RecentMixProps {
  title?: string;
  date?: string;
  trackCount?: number;
  duration?: string;
  imageUrl?: string;
}

const RecentMix = ({
  title = "Summer Vibes 2023",
  date = "June 15, 2023",
  trackCount = 12,
  duration = "1:24:36",
  imageUrl,
}: RecentMixProps) => {
  return (
    <Card className="w-full bg-white hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex items-center p-3">
        <div className="w-16 h-16 rounded-md overflow-hidden mr-3 flex-shrink-0 bg-gradient-to-r from-purple-500 to-blue-500 relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Music className="h-8 w-8 text-white opacity-50" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="text-xs">{date}</CardDescription>
          <div className="flex items-center justify-between text-sm mt-1">
            <div className="flex items-center gap-1">
              <Music className="h-4 w-4 text-muted-foreground" />
              <span>{trackCount} tracks</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{duration}</span>
            </div>
          </div>
        </div>
      </div>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full">
          Open Mix
        </Button>
      </CardFooter>
    </Card>
  );
};

interface RecentTrackProps {
  title?: string;
  artist?: string;
  keySignature?: string;
  bpm?: number;
  imageUrl?: string;
}

const RecentTrack = ({
  title = "Midnight City",
  artist = "M83",
  keySignature = "F Minor",
  bpm = 120,
  imageUrl,
}: RecentTrackProps) => {
  return (
    <Card className="w-full bg-white hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex items-center p-3">
        <div className="w-16 h-16 rounded-md overflow-hidden mr-3 flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-500 relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Music className="h-8 w-8 text-white opacity-50" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="text-xs">{artist}</CardDescription>
          <div className="flex items-center justify-between text-sm mt-1">
            <div className="flex items-center gap-1">
              <span className="font-medium">Key:</span>
              <span>{keySignature}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">BPM:</span>
              <span>{bpm}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

interface StatCardProps {
  title?: string;
  value?: string | number;
  icon?: React.ReactNode;
}

const StatCard = ({
  title = "Total Mixes",
  value = 24,
  icon = <BarChart2 className="h-5 w-5" />,
}: StatCardProps) => {
  return (
    <Card className="w-full bg-white">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-full text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface DashboardOverviewProps {
  recentMixes?: RecentMixProps[];
  recentTracks?: RecentTrackProps[];
  onCreateMix?: () => void;
}

const DashboardOverview = ({
  recentMixes = [
    {
      title: "Summer Vibes 2023",
      date: "June 15, 2023",
      trackCount: 12,
      duration: "1:24:36",
      imageUrl:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80",
    },
    {
      title: "Deep House Session",
      date: "May 28, 2023",
      trackCount: 8,
      duration: "0:58:12",
      imageUrl:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    },
    {
      title: "Club Classics",
      date: "April 10, 2023",
      trackCount: 15,
      duration: "1:45:20",
      imageUrl:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
    },
  ],
  recentTracks = [
    {
      title: "Midnight City",
      artist: "M83",
      keySignature: "F Minor",
      bpm: 120,
      imageUrl:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80",
    },
    {
      title: "Strobe",
      artist: "Deadmau5",
      keySignature: "B Minor",
      bpm: 128,
      imageUrl:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80",
    },
    {
      title: "Opus",
      artist: "Eric Prydz",
      keySignature: "D Major",
      bpm: 126,
      imageUrl:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
    },
    {
      title: "Levels",
      artist: "Avicii",
      keySignature: "G# Minor",
      bpm: 126,
      imageUrl:
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&q=80",
    },
  ],
  onCreateMix = () => {},
}: DashboardOverviewProps) => {
  return (
    <div className="w-full h-full p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome to your DJ Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Create harmonic mixes with ease
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="gap-2" onClick={onCreateMix}>
              <Plus className="h-4 w-4" />
              Create New Mix
            </Button>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Tracks
            </Button>
          </div>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Mixes"
            value={24}
            icon={<Music className="h-5 w-5" />}
          />
          <StatCard
            title="Total Tracks"
            value={156}
            icon={<BarChart2 className="h-5 w-5" />}
          />
          <StatCard
            title="Last Mix"
            value="2 days ago"
            icon={<Calendar className="h-5 w-5" />}
          />
        </div>

        {/* Recent mixes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Mixes</h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentMixes.map((mix, index) => (
              <RecentMix
                key={index}
                title={mix.title}
                date={mix.date}
                trackCount={mix.trackCount}
                duration={mix.duration}
                imageUrl={mix.imageUrl}
              />
            ))}
          </div>
        </div>

        {/* Recently added tracks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recently Added Tracks</h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {recentTracks.map((track, index) => (
              <RecentTrack
                key={index}
                title={track.title}
                artist={track.artist}
                keySignature={track.keySignature}
                bpm={track.bpm}
                imageUrl={track.imageUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
