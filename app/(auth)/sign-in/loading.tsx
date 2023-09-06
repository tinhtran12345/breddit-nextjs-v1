"use client";

import { InfinitySpin } from "react-loader-spinner";

const Loading = () => {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <InfinitySpin width="200" color="green" />
        </div>
    );
};

export default Loading;
