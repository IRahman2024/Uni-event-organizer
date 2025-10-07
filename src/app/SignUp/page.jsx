import { CredentialSignUp } from "@stackframe/stack";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shadcn-components/ui/card"
import { FieldGroup } from "@/shadcn-components/ui/field";
import { cn } from "@/lib/utils";

const SignUp = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-6 min-h-screen font-sans">
            <Card className="bg-card text-card-foreground shadow-sm font-sans w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle>Sign Up for New Account</CardTitle>
                    <CardDescription>Enter your credentials below to signup</CardDescription>
                </CardHeader>
                <CardContent>
                    <FieldGroup>
                        <CredentialSignUp></CredentialSignUp>
                    </FieldGroup>
                </CardContent>
                <CardFooter className='text-center text-card-foreground'>
                    <p>Already Have Account?</p>
                    <a className="text-card-foreground hover:text-primary ml-2" href="/SignIn">Sign In</a>
                </CardFooter>
            </Card>
        </div>
    );
};

export default SignUp;