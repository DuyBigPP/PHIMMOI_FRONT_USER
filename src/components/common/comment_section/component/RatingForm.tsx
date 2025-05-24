import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createRating } from '@/service/function';

interface RatingFormProps {
  movieId: string;
  onRatingSubmitted: () => void;
}

export default function RatingForm({ movieId, onRatingSubmitted }: RatingFormProps) {
  const [score, setScore] = useState<number>(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
  };

  const resetForm = () => {
    setScore(0);
    setReview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (score === 0) {
      setErrorMessage('Vui lòng chọn số sao đánh giá');
      return;
    }

    if (review.trim().length < 10) {
      setErrorMessage('Bình luận phải có ít nhất 10 ký tự');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await createRating(movieId, score, review);
      
      if (response.success) {
        setSuccessMessage('Đã gửi đánh giá thành công!');
        resetForm();
        onRatingSubmitted();
      } else {
        setErrorMessage(response.message || 'Có lỗi xảy ra khi gửi đánh giá');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      setErrorMessage('Không thể gửi đánh giá. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hide messages after 3 seconds
  if (errorMessage) {
    setTimeout(() => setErrorMessage(null), 3000);
  }
  
  if (successMessage) {
    setTimeout(() => setSuccessMessage(null), 3000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center">
        <p className="mb-2 text-sm text-muted-foreground">Chọn số sao đánh giá</p>
        <div className="flex justify-center space-x-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              className="p-1"
              onClick={() => handleScoreChange(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <Star
                className={`h-8 w-8 ${
                  (hoverRating ? value <= hoverRating : value <= score)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                } transition-colors`}
              />
            </button>
          ))}
        </div>
        <p className="mt-1 text-sm font-medium">
          {score > 0 ? `${score} sao` : 'Chưa đánh giá'}
        </p>
      </div>

      <div>
        <Textarea
          placeholder="Chia sẻ cảm nghĩ của bạn về bộ phim này..."
          rows={4}
          value={review}
          onChange={handleReviewChange}
          className="resize-none"
        />
      </div>

      {errorMessage && (
        <div className="rounded-md bg-destructive/15 px-4 py-2 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="rounded-md bg-green-500/15 px-4 py-2 text-sm text-green-500">
          {successMessage}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        </Button>
      </div>
    </form>
  );
} 