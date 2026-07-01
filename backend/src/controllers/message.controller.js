import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js"; // ใช้ไฟล์ config ที่ถูกต้อง
import { getReceiverSocketId } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "เซิร์ฟเวอร์เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages Controller ", error.message);
    res.status(500).json({ error: "เซิร์ฟเวอร์เกิดข้อผิดพลาด" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = "";
    let uploadResponse;

    if (image) {
      try {
        console.log("Image prefix:", image.substring(0, 30)); // ตรวจว่า base64 มี prefix
        uploadResponse = await cloudinary.uploader.upload(image, {
          folder: "chat_images",
          upload_preset: "chat_images", // ใช้ preset ที่เปิด unsigned upload แล้ว
        });
        imageUrl = uploadResponse.secure_url;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();
    console.log("Saved message:", newMessage);

    const receiverSockektId = getReceiverSocketId(receiverId)
    if(receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }
      

    res.status(201).json(newMessage); // ส่ง response ครั้งเดียว
  } catch (error) {
    console.log("Error in sendMessage controller", error.message);
    res.status(500).json({ error: "เซิร์ฟเวอร์เกิดข้อผิดพลาด" });
  }
};


