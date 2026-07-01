import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

// สร้าง Zustand store สำหรับการจัดการ state ของการยืนยันตัวตน (Auth)
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // ฟังก์ชันตรวจสอบว่าผู้ใช้ล็อกอินอยู่หรือไม่
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data.user }); // ✅ ใช้ user ที่ส่งกลับมา
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ฟังก์ชันสมัครสมาชิก
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      await axiosInstance.post("/auth/signup", data);
      get().connectSocket();
      toast.success("สร้างบัญชีสำเร็จ");
    } catch (error) {
      toast.error(error.response?.data?.message || "สมัครไม่สำเร็จ");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ฟังก์ชันเข้าสู่ระบบ
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      if (success) {
        toast.success("เข้าสู่ระบบสำเร็จ");
        navigate("/");
      }
      get().connectSocket();
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ";
      toast.error(message);
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ฟังก์ชันออกจากระบบ
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("ออกจากระบบแล้ว");
      get().disconnectSocket();
    } catch (error) {
      const message = error.response?.data?.message || "ไม่สามารถออกจากระบบได้";
      toast.error(message);
    }
  },

  // ฟังก์ชันอัปเดตโปรไฟล์ (เช่น เปลี่ยนรูป, เปลี่ยนข้อมูล)
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    set({ socket });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
