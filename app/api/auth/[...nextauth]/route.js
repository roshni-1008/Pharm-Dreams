// Optional Google sign-in (NextAuth). It switches on only when ALL THREE of these exist:
// GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and NEXTAUTH_SECRET. Otherwise this route answers
// with empty JSON and the site simply hides Google sign-in.
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const enabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.NEXTAUTH_SECRET
);

const off = () => Response.json({}, { headers: { 'Cache-Control': 'no-store' } });

const handler = enabled
  ? NextAuth({
      providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
      ],
      session: { strategy: 'jwt' },
      secret: process.env.NEXTAUTH_SECRET
    })
  : off;

export { handler as GET, handler as POST };
