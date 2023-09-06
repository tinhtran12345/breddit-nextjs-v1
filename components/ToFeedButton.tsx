"use client";

import { usePathname } from "next/navigation";
import { buttonVariants } from "./ui/button";
import { ChevronLeft } from "lucide-react";
const getSubredditPath = (pathname: string) => {
    const splitPath = pathname.split("/");

    if (splitPath.length === 3) return "/";
    else if (splitPath.length > 3) return `/${splitPath[1]}/${splitPath[2]}`;
    // default path, in case pathname does not match expected format
    else return "/";
};

const ToFeedButton = () => {
    const pathname = usePathname();
    const subredditPath = getSubredditPath(pathname);

    return (
        <a
            href={subredditPath}
            className={buttonVariants({ variant: "ghost" })}
        >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {subredditPath === "/" ? "Back home" : "Back to community"}
        </a>
    );
};

export default ToFeedButton;
