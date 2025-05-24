import { useState, useEffect } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function ShareButton({
  variant = 'outline',
  size = 'icon',
  className
}: ShareButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Ẩn thông báo sau 3 giây
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleShare = async () => {
    setIsLoading(true);
    
    try {
      // Lấy URL hiện tại
      const url = window.location.href;
      
      // Kiểm tra nếu có API chia sẻ của trình duyệt
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          url: url
        });
        
        setStatusMessage('Đã chia sẻ thành công');
      } else {
        // Fallback: Sao chép vào clipboard
        await navigator.clipboard.writeText(url);
        
        setStatusMessage('Đã sao chép vào clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      setStatusMessage('Không thể chia sẻ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={size}
              className={cn('transition-all', className)}
              onClick={handleShare}
              disabled={isLoading}
            >
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Chia sẻ</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Chia sẻ</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {/* Thông báo trạng thái hiển thị trực tiếp */}
      {statusMessage && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-slate-800 border border-slate-600 text-white px-3 py-1.5 rounded-md text-sm whitespace-nowrap z-50 animate-in fade-in duration-300">
          {statusMessage}
        </div>
      )}
    </div>
  );
} 