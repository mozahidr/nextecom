import db from "../../../utils/db";
import User from "../../../models/User";
import bcryptjs from 'bcryptjs';

async function handler(req, res) {
    if(req.method !== 'POST') {
        return;
    }
    const { name, lastName, mobile, email, password } = req.body;
    if(!name || !lastName || !mobile || !email || !email.includes('@') || !password ||
    password.trim().length < 8 ) {
        res.status(422).json({
            message: 'Validation error',
        });
        return;
    }

    await db.connect();
    // find existing users
    const existingUser = await User.findOne({ email: email });
    if(existingUser) {
        res.status(422).json({ message: 'User already exists' });
        await db.disconnect();
        return;
    }

    const newUser = new User({
        name,
        lastName,
        mobile,
        email,
        password: bcryptjs.hashSync(password),
        isAdmin: false,
    });

    // save user
    const user = await newUser.save();
    await db.disconnect();

    res.status(201).send({
        message: 'Created User Successfully!',
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        mobile: user.mobile,
        email: user.email,
        isAdmin: user.isAdmin,
    });


}

export default handler;