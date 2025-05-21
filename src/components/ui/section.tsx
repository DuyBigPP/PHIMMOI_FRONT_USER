import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  href?: string;
  viewAllText?: string;
  className?: string;
  children: React.ReactNode;
}

export function Section({ 
  title, 
  href, 
  viewAllText = "Xem tất cả", 
  className,
  children 
}: SectionProps) {
  return (
    <section className={cn("mb-8", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
        {href && (
          <Link 
            to={href} 
            className="flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            {viewAllText}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
} 