import express from "express";
import cors from "cors";
import { StreamChat } from "stream-chat";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import 'dotenv/config';
const app = express();

app.use(cors());
app.use(express.json());
const serverClient = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);

app.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, username, password } = req.body;
        const { users } = await serverClient.queryUsers({name: username});
        if (users.length !== 0) {
            return res.json({ badResponse: "Username is in use" });
        }
        const userID = uuidv4(); //unique user ID generator
        const hashedPassword = await bcrypt.hash(password, 10);
        const token = serverClient.createToken(userID);
        res.json({ token, userID, firstName, lastName, username, hashedPassword });
    } catch (e) {
        res.json(e);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const { users } = await serverClient.queryUsers({name: username});
        if (users.length === 0) {
            return res.json({badResponse: "User not found"});
        }
        const token = serverClient.createToken(users[0].id);
        const passwordMatch = await bcrypt.compare(password, users[0].hashedPassword);
        if (!passwordMatch) {
            return res.json({badResponse: "Password is incorrect"});
        }
        res.json({ 
            token,
            firstName: users[0].firstName,
            lastName: users[0].lastName,
            username,
            userID: users[0].id,
        })
    } catch (e) {
        console.log(e);
    }
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
 