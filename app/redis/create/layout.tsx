import { getAuthSession } from "@/lib/auth";

import { notFound, redirect } from "next/navigation";

const CreateLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getAuthSession();
    if (!session?.user) {
        return redirect("/sign-in");
    }

    return <>{children}</>;
};

export default CreateLayout;
