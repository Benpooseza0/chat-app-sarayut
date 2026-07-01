import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

// icons จาก lucide-react
import { MessageSquare, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) return toast.error("โปรดกรอกอีเมล์");
    if (!formData.password.trim()) return toast.error("โปรดกรอกรหัสผ่าน");
    const success = await login(formData);
    if(success) {
        navigate("/") //เมื่อเข้าสู่ระบบสำเร็จจะไปหน้า Homepage
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo + Title */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">เข้าสู่ระบบ</h1>
              <p className="text-base-content/60">
                เข้าสู่ระบบเพื่อใช้งานบัญชีของคุณ
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">อีเมล์</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10 relative z-0"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">รหัสผ่าน</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 pr-10 relative z-0"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                "เข้าสู่ระบบ"
              )}
            </button>
          </form>

          {/* Link to SignUp */}
          <div className="text-center">
            <p className="text-base-content/60">
              ยังไม่มีบัญชีใช่ไหม ?{" "}
              <Link to="/signup" className="link link-primary">
                สร้างบัญชี
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side */}
      <AuthImagePattern
        title="ยินดีต้อนรับกลับ"
        subtitle="เข้าสู่ระบบเพื่อพูดคุยกับเพื่อนของคุณ"
      />
    </div>
  );
};

export default LoginPage;
