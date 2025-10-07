import { cn } from "@/lib/utils"
import { Button } from "@/shadcn-components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shadcn-components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shadcn-components/ui/field"
import { Input } from "@/shadcn-components/ui/input"
import { CredentialSignIn, OAuthButton, OAuthButtonGroup } from "@stackframe/stack"

export function LoginForm({
  className,
  ...props
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-card text-card-foreground shadow-sm font-sans">
        <CardHeader className="text-center">
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your credentials below to login
          </CardDescription>
        </CardHeader>
        <CardContent>
            <FieldGroup>
              {/* <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input id="password" type="password" required />
                  <a
                    href="#"
                    className="text-end ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
              </Field> */}
              <CredentialSignIn></CredentialSignIn>
              <Field>
                {/* <OAuthButtonGroup type='sign-in' /> */}
                <OAuthButton provider="google" type="sign-in"></OAuthButton>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/SignUp">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          {/* <form>
          </form> */}
        </CardContent>
      </Card>
    </div>
  );
}
