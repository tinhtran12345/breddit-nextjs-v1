import SignIn from "@/components/SignIn";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

interface PageProps {}

const Page: React.FC<PageProps> = async () => {
    const session = await getAuthSession();
    if (session?.user) {
        return redirect("/");
    }

    return (
        <div className="absolute inset-0">
            <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-5">
                <Link
                    href="/"
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "self-start -mt-15"
                    )}
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Home
                </Link>
                <SignIn />
            </div>
        </div>
    );
};
export default Page;
