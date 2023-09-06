import React from "react";
import { InfinitySpin } from "react-loader-spinner";

const Loader = () => {
    return (
        <div className="fixed inset-0 z-10 flex justify-center items-center bg-slate-50/10 ">
            <InfinitySpin width="200" color="#4fa94d" />
        </div>
    );
};

export default Loader;
