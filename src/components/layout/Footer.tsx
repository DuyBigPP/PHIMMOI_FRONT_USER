import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/home-page" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold text-primary">PHIMSKIBIDI</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              PHIMSKIBIDI – Trang xem phim lậu xịn nhất thế giới.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Thể Loại</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/the-loai/hanh-dong" className="hover:text-primary">Phim Hành Động</Link></li>
              <li><Link to="/the-loai/tinh-cam" className="hover:text-primary">Phim Tình Cảm</Link></li>
              <li><Link to="/the-loai/kinh-di" className="hover:text-primary">Phim Kinh Dị</Link></li>
              <li><Link to="/the-loai/hai-huoc" className="hover:text-primary">Phim Hài Hước</Link></li>
              <li><Link to="/the-loai/co-trang" className="hover:text-primary">Phim Cổ Trang</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Quốc Gia</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/quoc-gia/viet-nam" className="hover:text-primary">Phim Việt Nam</Link></li>
              <li><Link to="/quoc-gia/han-quoc" className="hover:text-primary">Phim Hàn Quốc</Link></li>
              <li><Link to="/quoc-gia/trung-quoc" className="hover:text-primary">Phim Trung Quốc</Link></li>
              <li><Link to="/quoc-gia/thai-lan" className="hover:text-primary">Phim Thái Lan</Link></li>
              <li><Link to="/quoc-gia/au-my" className="hover:text-primary">Phim Âu Mỹ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Liên Hệ</h3>
            <div className="flex space-x-3 mb-4">
              <Button size="icon" variant="ghost">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost">
                <Youtube className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Email: ChuaCoEmail@gmail.com<br />
              Địa chỉ: Việt Nam
            </p>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2025 PHIMSKIBIDI. By ZuyBigPP and DuongStark.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/chinh-sach-bao-mat" className="hover:text-primary">Chính sách bảo mật</Link>
            <Link to="/dieu-khoan-su-dung" className="hover:text-primary">Điều khoản sử dụng</Link>
            <Link to="/gioi-thieu" className="hover:text-primary">Giới thiệu</Link>
            <Link to="/lien-he" className="hover:text-primary">Liên hệ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 