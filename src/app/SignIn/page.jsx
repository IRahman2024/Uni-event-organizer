import { LoginForm } from "@/shadcn-components/login-form"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full font-sans items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
