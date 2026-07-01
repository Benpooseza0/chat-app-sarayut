import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

// สร้าง Zustand store สำหรับการจัดการ state ของแชท
export const useChatStore = create((set,get) => ({
  messages: [], // 
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // ฟังก์ชันดึงรายชื่อผู้ใช้จาก backend
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "โหลดรายชื่อผู้ใช้ไม่สำเร็จ");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // ฟังก์ชันดึงข้อความของผู้ใช้ที่เลือก
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "โหลดข้อความไม่สำเร็จ");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const {selectedUser, messages} = get()
    try {
        const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
        set({messages:[...messages,res.data]})
    } catch (error) {
        toast.error(error.response.data.message)
        
    }

  },

  // ฟังก์ชันเลือกผู้ใช้
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
