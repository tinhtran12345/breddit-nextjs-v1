"use client";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { useOnClickOutside } from "@/hooks/use-onclick-outside";
import axios from "axios";
import debounce from "lodash.debounce";
import { Loader, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";

interface SearchBarProps {}
const SearchBar: React.FC<SearchBarProps> = () => {
    const [input, setInput] = useState("");
    const pathname = usePathname();
    const commandRef = useRef<HTMLDivElement>(null);
    const [queryResults, setQueryResults] = useState([]);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useOnClickOutside(commandRef, () => {
        setInput("");
    });

    const refetch = useCallback(async (text: string) => {
        if (text.length) {
            const { data } = await axios.get(`/api/search?q=${text}`);
            setQueryResults(data);
        } else {
            setQueryResults([]);
        }
    }, []);
    useEffect(() => {
        setInput("");
    }, [pathname]);

    return (
        <Command
            ref={commandRef}
            className="relative rounded-lg border max-w-lg z-50 overflow-visible"
        >
            <CommandInput
                onValueChange={(text) => {
                    setInput(text);
                    refetch(text);
                }}
                value={input}
                className="outline-none border-none focus:border-none focus:outline-none ring-0"
                placeholder="Search communities..."
            />

            {input.length > 0 && (
                <CommandList className="absolute top-full inset-x-0 z-100 shadow rounded-b-md">
                    {(queryResults?.length ?? 0) > 0 ? (
                        <CommandGroup heading="Communities">
                            {queryResults?.map((subreddit) => (
                                <CommandItem
                                    className="mt-2"
                                    onSelect={(e) => {
                                        router.push(`/redis/${e}`);
                                        router.refresh();
                                    }}
                                    key={subreddit.id}
                                    value={subreddit?.name}
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    <a href={`/redis/${subreddit?.name}`}>
                                        redis/{subreddit?.name}
                                    </a>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ) : (
                        <CommandEmpty>No results found.</CommandEmpty>
                    )}
                </CommandList>
            )}
        </Command>
    );
};

export default SearchBar;
