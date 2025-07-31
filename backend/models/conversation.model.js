import mongoose from "mongoose"

const conversationSchema = new mongoose.Schema({
    participants: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}], // Jo do log baat kr rhay hai un ka messages
    message: [{type: mongoose.Schema.Types.ObjectId, ref: "Message"}] // un ka saray messages
},{timestamps: true})

export const Conversation = mongoose.Model("Conversation", conversationSchema)