import mongoose from "mongoose"

const searchSchema = new mongoose.Schema({
    postId: {
        type: String,
        required: true,
        unique: true 
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        required: true
    }
}, { timestamps: true })

// create an index
searchSchema.index({ content : 'text'})
searchSchema.index({ createdAt : -1 })

export const Search = mongoose.model('Search', searchSchema);