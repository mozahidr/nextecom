import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: 'string', required: true },
        email: { type: 'string', required: true, unique: true },
        password: { type: 'string', required: true },
        isAdmin: { type: 'boolean', default: false, required: true },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;