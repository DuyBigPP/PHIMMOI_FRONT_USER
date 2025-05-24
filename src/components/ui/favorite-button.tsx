import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/context/AuthContext';
import { addFavorite, deleteFavorite, getUserFavorite } from '@/service/function';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  movieId: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onToggle?: (isFavorite: boolean) => void;
}

export function FavoriteButton({
  movieId,
  variant = 'outline',
  size = 'icon',
  className,
  onToggle
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const { user } = useAuth();

  // Kiểm tra xem phim có nằm trong danh sách yêu thích không
  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!user || !movieId) return;

      try {
        const response = await getUserFavorite();
        if (response.success && response.data && Array.isArray(response.data)) {
          // Trường hợp API trả về mảng trực tiếp
          const isFav = response.data.some((fav) => fav.movieId === movieId);
          setIsFavorite(isFav);
        } else if (response.success && response.data && response.data.favorites) {
          // Trường hợp API trả về { favorites: [] }
          const isFav = response.data.favorites.some((fav) => fav.movieId === movieId);
          setIsFavorite(isFav);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkIfFavorite();
  }, [movieId, user]);

  // Ẩn thông báo đăng nhập sau 3 giây
  useEffect(() => {
    if (showLoginMessage) {
      const timer = setTimeout(() => {
        setShowLoginMessage(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showLoginMessage]);

  const handleToggleFavorite = async () => {
    if (!user) {
      setShowLoginMessage(true);
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorite) {
        // Xóa khỏi danh sách yêu thích
        await deleteFavorite(movieId);
        console.log('Đã xóa khỏi danh sách yêu thích');
      } else {
        // Thêm vào danh sách yêu thích
        await addFavorite(movieId);
        console.log('Đã thêm vào danh sách yêu thích');
      }

      // Cập nhật trạng thái
      setIsFavorite(!isFavorite);
      if (onToggle) onToggle(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
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
              onClick={handleToggleFavorite}
              disabled={isLoading}
            >
              <Heart
                className={cn(
                  'h-4 w-4 transition-colors',
                  isFavorite ? 'fill-current text-red-500' : 'text-muted-foreground'
                )}
              />
              <span className="sr-only">{isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {/* Thông báo đăng nhập hiển thị trực tiếp */}
      {showLoginMessage && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-slate-800 border border-amber-500 text-amber-200 px-3 py-1.5 rounded-md text-sm whitespace-nowrap z-50 animate-in fade-in duration-300">
          Vui lòng đăng nhập trước
        </div>
      )}
    </div>
  );
} 