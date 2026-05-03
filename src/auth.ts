import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import Credentials from "next-auth/providers/credentials"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('Authorize attempt for:', credentials?.email);
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null
        }
        
        try {
          const user = await db.query.users.findFirst({
            where: eq(users.email, credentials.email as string)
          })

          if (!user) {
            console.log('User not found in DB:', credentials.email);
            return null
          }

          if (!user.password) {
            console.log('User has no password set in DB');
            return null
          }

          const isValid = await bcrypt.compare(credentials.password as string, user.password)
          console.log('Password comparison result:', isValid);
          
          if (!isValid) return null

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        } catch (error) {
          console.error('DB Error during authorize:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (token.role && session.user) {
        (session.user as any).role = token.role as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    }
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  }
})
