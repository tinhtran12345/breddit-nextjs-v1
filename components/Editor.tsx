"use client";
import EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";

import { PostCreationRequest, PostValidator } from "@/lib/validators/post";

import axios from "axios";

import "@/app/editor.css";
import toast from "react-hot-toast";
import { uploadFiles } from "@/lib/uploadthing";
import Loader from "./ui/loader";

type FormData = z.infer<typeof PostValidator>;

interface EditorProps {
    subredditId: string;
}

const Editor: React.FC<EditorProps> = ({ subredditId }) => {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(PostValidator),
        defaultValues: {
            subredditId,
            title: "",
            content: null,
        },
    });
    const ref = useRef<EditorJS>();
    const _titleRef = useRef<HTMLTextAreaElement>(null);
    const router = useRouter();
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const pathname = usePathname();

    const createPost = async ({
        title,
        content,
        subredditId,
    }: PostCreationRequest) => {
        try {
            // call api
            setLoading(true);
            const payload: PostCreationRequest = {
                title,
                content,
                subredditId,
            };
            const res = await axios.post("/api/subreddit/post/create", payload);
            if (res?.data) {
                const newPathname = pathname.split("/").slice(0, -1).join("/");
                router.push(newPathname);

                router.refresh();
                toast.success("Your post has been published.");
            }
        } catch (error: any) {
            // toast.error("Your post was not published. Please try again.");
            console.log("Error:", error);
            toast.error(error?.response.data);
        } finally {
            setLoading(false);
        }
    };

    const initializeEditor = useCallback(async () => {
        const EditorJS = (await import("@editorjs/editorjs")).default;

        const Embed = (await import("@editorjs/embed")).default;
        const Table = (await import("@editorjs/table")).default;
        const List = (await import("@editorjs/list")).default;
        const Code = (await import("@editorjs/code")).default;
        const LinkTool = (await import("@editorjs/link")).default;
        const InlineCode = (await import("@editorjs/inline-code")).default;
        const ImageTool = (await import("@editorjs/image")).default;

        if (!ref.current) {
            let editor = await new EditorJS({
                holder: "editor",
                onReady() {
                    ref.current = editor;
                },
                placeholder: "Type here to write your post...",
                inlineToolbar: true,
                data: { blocks: [] },
                tools: {
                    linkTool: {
                        class: LinkTool,
                        config: {
                            endpoint: "/api/link",
                        },
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                async uploadByFile(file: File) {
                                    // upload to uploadthing
                                    const [res] = await uploadFiles(
                                        [file],
                                        "imageUploader"
                                    );
                                    return {
                                        success: 1,
                                        file: {
                                            url: res.fileUrl,
                                        },
                                    };
                                },
                            },
                        },
                    },
                    list: List,
                    code: Code,
                    inlineCode: InlineCode,
                    table: Table,
                    embed: Embed,
                },
            });
        }
    }, []);
    useEffect(() => {
        if (Object.keys(errors).length) {
            for (const [_key, value] of Object.entries(errors)) {
                value;
                toast("Something went wrong");
            }
        }
    }, [errors]);
    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsMounted(true);
        }
    }, []);
    useEffect(() => {
        const init = async () => {
            await initializeEditor();

            setTimeout(() => {
                _titleRef?.current?.focus();
            }, 0);
        };

        if (isMounted) {
            init();

            return () => {
                ref.current?.destroy();
                ref.current = undefined;
            };
        }
    }, [isMounted, initializeEditor]);
    async function onSubmit(data: FormData) {
        const blocks = await ref.current?.save();

        const payload: PostCreationRequest = {
            title: data.title,
            content: blocks,
            subredditId,
        };

        createPost(payload);
    }

    if (!isMounted) {
        return null;
    }

    const { ref: titleRef, ...rest } = register("title");
    return (
        <div className="w-full p-4  rounded-lg border border-zinc-200">
            {loading && <Loader />}
            <form
                id="subreddit-post-form"
                className="w-fit"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="prose prose-stone ">
                    <TextareaAutosize
                        ref={(e) => {
                            titleRef(e);
                            // @ts-ignore
                            _titleRef.current = e;
                        }}
                        {...rest}
                        placeholder="Title"
                        className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
                    />
                    <div id="editor" className="min-h-[200px]" />
                    <p className="text-sm">
                        Use{" "}
                        <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
                            Tab
                        </kbd>{" "}
                        to open the command menu.
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Editor;