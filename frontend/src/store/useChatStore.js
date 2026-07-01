import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // ดึงรายชื่อผู้ใช้
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "โหลดรายชื่อผู้ใช้ไม่สำเร็จ",
      );
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // ดึงข้อความ
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

  // ส่งข้อความ
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "ส่งข้อความไม่สำเร็จ");
    }
  },

  // subscribe รับข้อความใหม่จาก socket
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser.User._id
      if(newMessage.senderId !== selectedUser._id) return
      set({ messages: [...get().messages, newMessage] });
    });
  },

  // unsubscribe ปิดการฟัง event
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off("newMessage");
  },

  // เลือกผู้ใช้
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
