import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface WatchPageHeaderProps {
  movieSlug: string;
}

const WatchPageHeader = ({ movieSlug }: WatchPageHeaderProps) => {
  return (
    <div className="flex items-center">
      <Button variant="ghost" size="sm" asChild className="mr-auto">
        <Link to={`/phim/${movieSlug}`} className="flex items-center">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại
        </Link>
      </Button>
    </div>
  );
};

export default WatchPageHeader; 