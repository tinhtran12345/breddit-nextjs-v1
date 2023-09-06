import SignUp from "@/components/SignUp";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
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
            <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
                <Link
                    href="/"
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "self-start -mt-20"
                    )}
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Home
                </Link>

                <SignUp />
            </div>
        </div>
    );
};
export default Page;
