import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { toast as hotToast } from "@/components/ui/use-toast";

export function TestToast() {
  const { toast } = useToast();

  const showDefaultToast = () => {
    toast({
      title: "Thông báo mặc định",
      description: "Đây là thông báo mặc định",
      className: "bg-background border-border",
    });
  };

  const showWarningToast = () => {
    toast({
      title: "Cần đăng nhập",
      description: "Vui lòng đăng nhập để sử dụng tính năng này",
      variant: "warning",
      className: "bg-slate-800 text-amber-200 border-amber-500",
    });
  };

  // Direct approach using the exported toast function
  const showDirectToast = () => {
    hotToast({
      title: "ĐĂNG NHẬP TRƯỚC",
      description: "Bạn cần đăng nhập để sử dụng tính năng này!",
      variant: "destructive",
      className: "font-bold",
    });
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={showDefaultToast}>Toast mặc định</Button>
      <Button onClick={showWarningToast}>Toast cảnh báo</Button>
      <Button variant="destructive" onClick={showDirectToast}>Toast trực tiếp</Button>
    </div>
  );
} 