import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions:{
            bodySizeLimit: '25gb'
        }
    }
};

export default withNextVideo(nextConfig);