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

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  console.log('LoginForm initialized');
  const navigate = useNavigate();
  const auth = useAuth();
  console.log('Auth accessed in LoginForm:', auth ? 'loaded' : 'undefined');
  
  useEffect(() => {
    console.log('LoginForm mounted');
    return () => {
      console.log('LoginForm unmounted');
    };
  }, []);
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    console.log('Login form submitted with values:', values);
    setIsLoading(true);
    setError(null);

    try {
      console.log('Calling login function from auth');
      // Make sure to trim the email and ensure password is a string
      const email = values.email.trim();
      const password = values.password;
      
      console.log('Login data formatted as:', { email, password: '[REDACTED]' });
      const success = await auth.login(email, password);
      console.log('Login result:', success ? 'success' : 'failed');
      
      if (success) {
        navigate("/home-page");
      } else {
        setError("Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.");
      }
    } catch (err) {
      console.error('Error during login submission:', err);
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
        <CardTitle className="text-2xl">Đăng nhập</CardTitle>
        <CardDescription>
          Đăng nhập để tiếp tục với tài khoản của bạn
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
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link to="/dang-ky" className="font-medium text-primary hover:underline">
            Đăng ký
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
} 