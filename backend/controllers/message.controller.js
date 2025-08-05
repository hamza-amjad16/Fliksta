import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

// For Chat
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [ senderId, receiverId ] },
    });
    // establish the conversation if not started yet
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);
    // implement socket.io   one-to-one


    return res.status(201).json({
        success: true,
        newMessage
    })
  } catch (error) {
    console.log("Send message", error);
  }
};

export const getMessage = async (req, res) => {
    try {
        const senderId = req.id
        const receiverId = req.params.id

        // jin 2 ka darmiyan bat hui un ka messages
        const conversation = await Conversation.findOne({
            participants: {$all: [senderId, receiverId]}
        })
        if(!conversation) return res.status(200).json({success: true, messages: []})

         return res.status(200).json({
            success: true,
            messages: conversation?.messages
         })   
    } catch (error) {
        console.log("Get message error",error);
        
    }
}