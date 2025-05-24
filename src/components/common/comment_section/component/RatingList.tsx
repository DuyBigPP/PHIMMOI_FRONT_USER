import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Rating } from '@/types/api';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/utils';
import { deleteRating } from '@/service/function';

interface RatingListProps {
  ratings: Rating[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function RatingList({ 
  ratings, 
  currentPage, 
  totalPages, 
  onPageChange 
}: RatingListProps) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async (ratingId: string) => {
    if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) {
      return;
    }
    
    setIsDeleting(ratingId);
    setErrorMessage(null);
    
    try {
      const response = await deleteRating(ratingId);
      
      if (response.success) {
        // Trigger reload of ratings
        onPageChange(currentPage);
      } else {
        setErrorMessage('Không thể xóa đánh giá');
      }
    } catch (error) {
      console.error('Error deleting rating:', error);
      setErrorMessage('Đã xảy ra lỗi khi xóa đánh giá');
    } finally {
      setIsDeleting(null);
    }
  };

  // Format date to Vietnamese style
  const formatDateString = (dateString: string): string => {
    try {
      return formatDate(new Date(dateString), 'dd/MM/yyyy');
    } catch {
      return dateString;
    }
  };

  if (errorMessage) {
    setTimeout(() => setErrorMessage(null), 3000);
  }

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="rounded-md bg-destructive/15 px-4 py-2 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <div className="space-y-4">
        {ratings.map((rating) => (
          <div 
            key={rating.id} 
            className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {rating.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{rating.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateString(rating.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < rating.score ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                      }`} 
                    />
                  ))}
                </div>
                
                {/* Delete button (only for admin or the user who created the rating) */}
                {user && (user.isAdmin || user.id === rating.userId) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isDeleting === rating.id}
                    onClick={() => handleDelete(rating.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Xóa đánh giá</span>
                  </Button>
                )}
              </div>
            </div>
            
            <p className="text-sm">{rating.review}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Trang trước</span>
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Trang {currentPage} / {totalPages}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Trang sau</span>
          </Button>
        </div>
      )}
    </div>
  );
} 