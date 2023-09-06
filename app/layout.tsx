import AuthProvider from "@/providers/auth-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/providers/toast-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "reddit-nextjs",
    description: "A Reddit clone built with Next.js and TypeScript.",
};

export default function RootLayout({
    children,
}: // authModal,
{
    children: React.ReactNode;
    // authModal: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={cn(" text-slate-900 antialiased light", inter.className)}
            suppressHydrationWarning
        >
            <body className={"min-h-screen pt-20 antialiased "}>
                <ToastProvider />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <AuthProvider>
                        <Navbar />
                        {/* {authModal} */}

                        <div className="container max-w-7xl mx-auto h-full">
                            {children}
                        </div>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
