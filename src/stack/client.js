import { StackClientApp } from "@stackframe/stack";

export const stackClientApp = new StackClientApp({
  tokenStore: "nextjs-cookie",
  urls: {
    afterSignIn: "/dashboard/student/my-profile",
    afterSignUp: "/dashboard/student/my-profile"
  }
});
