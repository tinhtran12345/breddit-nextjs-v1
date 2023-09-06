import { User } from "@prisma/client";
import { AvatarProps } from "@radix-ui/react-avatar";
import { Icons } from "./icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Menu } from "lucide-react";

interface UserAvatarProps extends AvatarProps {
    user: Pick<User, "image" | "name">;
}

const UserAvatar = ({ user, ...props }: UserAvatarProps) => {
    return (
        <Avatar {...props}>
            {user.image && (
                <div className="relative aspect-square h-full w-full flex items-center justify-center">
                    <Image
                        fill
                        src={user.image}
                        alt="profile picture"
                        referrerPolicy="no-referrer"
                    />
                </div>
            )}
            <AvatarFallback>
                <span className="sr-only">{user?.name}</span>
                <Icons.user className="h-4 w-4" />
            </AvatarFallback>
        </Avatar>
    );
};

export default UserAvatar;
