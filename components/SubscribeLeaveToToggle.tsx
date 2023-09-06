"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Loader from "./ui/loader";
import axios from "axios";
import toast from "react-hot-toast";

// work flow: (Kết quả mong muốn là thực hiện 2 chức năng follow và hủy follow một subreddit): Nếu tài khoản user đang dùng đang có trang thái isSubreddit là true
// => Hiện nút hủy đang kí; Ngược lại thì hiện nút đăng kí. (ok)
// => Tạo chức năng đăng ki=> Bấm nút đang kí => gọi api vào cái subscribe với input đầu vào là subredditId
//    => Tạo Api chức năng subscribe: check authorized => check xem user đã subscribe cái subreddit này chưa(vào collection trong mong db để find subreddit với id tương ứng)
//          => Có thì trả về You've already subscribed to this subreddit
//          => Chưa: tạo ra trong db 1 collection: data: subredditId và userId: link tới cái user subscribe cái subreddit này => trả về subredditId

// => Tạo chức hủy năng đăng ki=> Bấm nút hủy đang kí => gọi api vào cái unsubscribe với input đầu vào là subredditId
//    => Tạo Api chức năng unsubscribe: check authorized => check xem user đã subscribe cái subreddit này chưa ((vào collection trong mong db để find subreddit với id tương ứng))
//          => Nếu không tìm thấy (unsubscribe rồi)=> "You've not been subscribed to this subreddit, yet."
//          => Nếu tìm thấy (đang subscribe)=> delete cái items (subredditId và userId) {Xóa theo 2 attributes trên} => Trả về subredditId

// Khi nhận trực tiếp input từ một sự kiên=> sủ dụng on để đặt tên cho hàm:
// Khi nhận gián tiến input từ props hoặc từ phía bên ngoài thì dùng handle hoặc là một từ khác để đặt tên
interface SubScribeLeaveToToggleProps {
    isSubscribed: boolean;
    subredditId: string;
    subredditName: string;
}

const SubScribeLeaveToToggle = ({
    isSubscribed,
    subredditId,
    subredditName,
}: SubScribeLeaveToToggleProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const handleSubscribe = async () => {
        try {
            setLoading(true);
            // call api
            await axios.post("/api/subreddit/subscribe", {
                subredditId: subredditId,
            });
            router.refresh();
            toast.success("Successfully");
        } catch (error) {
            console.log("Error:", error);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };
    const handleUnsubscribe = async () => {
        try {
            setLoading(true);
            // call api
            await axios.post("/api/subreddit/unsubscribe", {
                subredditId: subredditId,
            });
            router.refresh();
            toast.success("Successfully");
        } catch (error) {
            console.log("Error:", error);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            {loading && <Loader />}
            {isSubscribed ? (
                <Button
                    onClick={() => handleUnsubscribe()}
                    disabled={loading}
                    className="w-full mt-1 mb-4 "
                >
                    {loading ? <>Loading...</> : <>Leave community</>}
                </Button>
            ) : (
                <Button
                    onClick={() => handleSubscribe()}
                    disabled={loading}
                    className="w-full mt-1 mb-4 bg-red-500 hover:bg-red-600 border-none"
                >
                    {loading ? <>Loading...</> : <>Join to post</>}
                </Button>
            )}
        </>
    );
};

export default SubScribeLeaveToToggle;
