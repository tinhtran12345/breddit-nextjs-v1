import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserNameForm from "@/components/ui/user-name-form";

interface PageProps {}
const Page: React.FC<PageProps> = async () => {
    const session = await getAuthSession();

    if (!session?.user) {
        return redirect("/sign-in");
    }
    return (
        <div className="max-w-4xl mx-auto py-12">
            <div className="grid items-start gap-8">
                <h1 className="font-bold text-3xl md:text-4xl">Settings</h1>

                <div className="grid gap-10">
                    <UserNameForm
                        user={{
                            id: session.user.id,
                            username: session.user.username || "",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
export default Page;
