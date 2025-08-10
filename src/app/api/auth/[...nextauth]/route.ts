import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'UsersFakeDB.json');

async function getUsers() {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read user database:", error);
    return [];
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) {
            return null;
        }

        try {
            const users = await getUsers();
            const foundUser = users.find((u: any) => u.user === credentials.username && u.Password === credentials.password);
            
            if (foundUser) {
                return { id: credentials.username, name: credentials.username, email: '' }; 
            } else {
                return null;
            }
        } catch (error) {
            console.error("Authorize error:", error);
            return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // This is a type augmentation, so we need to assert the type.
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST }
