import bcrypt from "bcrypt";
import clientPromise from "@/lib/mongodb";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials: Record<"email" | "password", string> | undefined) {
                if (!credentials) {
                    throw new Error("Invalid credentials");
                };

                const client = await clientPromise;
                const db = client.db("taskManagement");

                const user = await db.collection("users").findOne({ email: credentials.email });
                if (!user) {
                    throw new Error("User not found");
                }

                const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                if (!isValidPassword) {
                    throw new Error("Invalid password");
                }

                return { id: user._id.toString(), name: user.name, email: user.email };
            },
        }),
    ],

    callbacks: {
        async redirect({ url, baseUrl }) {
            console.log("Redirecting to:", url);
            return url.startsWith(baseUrl) ? url : baseUrl + "/dashboard";
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };