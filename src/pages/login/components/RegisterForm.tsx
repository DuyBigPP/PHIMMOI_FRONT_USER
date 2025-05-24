import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  console.log('RegisterForm initialized');
  const navigate = useNavigate();
  const auth = useAuth();
  console.log('Auth accessed in RegisterForm:', auth ? 'loaded' : 'undefined');
  
  useEffect(() => {
    console.log('RegisterForm mounted');
    return () => {
      console.log('RegisterForm unmounted');
    };
  }, []);
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    console.log('Register form submitted with values:', { ...values, password: '[REDACTED]' });
    setIsLoading(true);
    setError(null);

    try {
      console.log('Calling register function from auth');
      // Make sure password is a string
      const name = values.name.trim();
      const email = values.email.trim();
      const password = values.password;
      
      console.log('Register data formatted as:', { name, email, password: '[REDACTED]' });
      const success = await auth.register(name, email, password);
      console.log('Register result:', success ? 'success' : 'failed');
      
      if (success) {
        navigate("/home-page");
      } else {
        setError("Đăng ký thất bại. Email có thể đã được sử dụng.");
      }
    } catch (err) {
      console.error('Error during registration submission:', err);
      // Try to extract error message if available
      let errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại sau.";
      
      if (err && typeof err === 'object' && 'message' in err) {
        const errorObj = err as { 
          message: string, 
          response?: { 
            data?: { 
              errors?: Array<{msg: string}> 
            } 
          } 
        };
        
        // Check for validation errors from the API
        if (errorObj.response?.data?.errors && errorObj.response.data.errors.length > 0) {
          errorMessage = errorObj.response.data.errors[0].msg;
        } else {
          errorMessage = errorObj.message || errorMessage;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng ký tài khoản</CardTitle>
        <CardDescription>
          Tạo tài khoản mới để trải nghiệm đầy đủ tính năng
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng ký...
                </>
              ) : (
                "Đăng ký"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link to="/dang-nhap" className="font-medium text-primary hover:underline">
            Đăng nhập
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
} 