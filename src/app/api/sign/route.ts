// app/api/signup/route.ts
import {NextApiRequest, NextApiResponse} from 'next';
import {auth, createUserWithEmailAndPassword, sendSignInLinkToEmail} from "@/firebase/firebase.config";
import {signupSchemaV2} from "@/app/signUp/signupForm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { _ } = req.query;

    switch (_) {
        case 'up':
            return await signUp(req, res);
        case 'in':
            return await signIn(req, res);
        case 'out':
            return await signOutUser(req, res);
        default:
            res.status(404).json({ message: 'Requested action not found' });
    }
}

async function signUp(req: NextApiRequest, res: NextApiResponse) {
    const data:signupSchemaV2 = req.body;
    console.log("userdata = ", data);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;
        // Optionally: Send verification email
        // await sendEmailVerification(user);

        // 이메일 인증 링크 전송
        const actionCodeSettings = {
            url: process.env.NEXT_PUBLIC_APP_DOMAIN + '/login',
            handleCodeInApp: true
        };
        await sendSignInLinkToEmail(auth, data.email, actionCodeSettings);
        res.status(200).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function signIn(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        res.status(200).json({ message: 'User signed in successfully', user: userCredential.user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function signOutUser(req: NextApiRequest, res: NextApiResponse) {
    try {
        await signOut(auth);
        res.status(200).json({ message: 'User signed out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function sendEmailVerification(user) {
    const actionCodeSettings = {
        url: 'http://localhost:3000/verified',
        handleCodeInApp: true
    };
    await sendSignInLinkToEmail(auth, user.email, actionCodeSettings);
}