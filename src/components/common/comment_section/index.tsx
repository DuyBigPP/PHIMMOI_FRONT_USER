import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { getRatingsByMovieId } from '@/service/function';
import { Rating } from '@/types/api';
import RatingForm from './component/RatingForm';
import RatingList from './component/RatingList';
import LoadingAnimation from '@/components/common/loading_animation';

interface CommentSectionProps {
  movieId: string;
  className?: string;
}

export default function CommentSection({ movieId, className }: CommentSectionProps) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [averageScore, setAverageScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user } = useAuth();

  const loadRatings = async (page = 1) => {
    if (!movieId) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const response = await getRatingsByMovieId(movieId, page, 10);
      
      if (response.success && response.data) {
        setRatings(response.data.ratings || []);
        setAverageScore(response.data.averageScore || 0);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setCurrentPage(page);
      } else {
        setErrorMessage('Không thể tải đánh giá');
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setErrorMessage('Đã xảy ra lỗi khi tải đánh giá');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRatings(1);
  }, [movieId]);

  const handleRatingSubmitted = () => {
    // Reload ratings after a new rating is submitted
    loadRatings(1);
  };

  const handlePageChange = (page: number) => {
    loadRatings(page);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Đánh giá & Bình luận</span>
          {averageScore > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-normal text-muted-foreground">
                Điểm trung bình:
              </span>
              <span className="rounded bg-primary px-2 py-1 text-sm font-semibold text-primary-foreground">
                {averageScore.toFixed(1)}
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="reviews">Đánh giá ({ratings.length})</TabsTrigger>
            <TabsTrigger value="add-review">Thêm đánh giá</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reviews">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoadingAnimation />
              </div>
            ) : errorMessage ? (
              <div className="py-8 text-center text-muted-foreground">
                {errorMessage}
              </div>
            ) : ratings.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá bộ phim này!
              </div>
            ) : (
              <RatingList 
                ratings={ratings} 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </TabsContent>
          
          <TabsContent value="add-review">
            {!user ? (
              <div className="py-8 text-center">
                <p className="mb-4 text-muted-foreground">
                  Vui lòng đăng nhập để thêm đánh giá
                </p>
              </div>
            ) : (
              <RatingForm movieId={movieId} onRatingSubmitted={handleRatingSubmitted} />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
