import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center text-center">
      <h1 className="text-8xl font-extrabold tracking-tight">404</h1>
      <h2 className="mt-4 text-2xl font-bold">Trang không tìm thấy</h2>
      <p className="mt-2 max-w-lg text-muted-foreground">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      <Button className="mt-6" asChild>
        <Link to="/home-page">Về Trang Chủ</Link>
      </Button>
    </div>
  );
} 