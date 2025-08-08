import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
    webpack(config: Configuration, { isServer }) {
        if (!isServer) {
        
            config.externals = config.externals || [];
            if (Array.isArray(config.externals)) {
                config.externals.push({ canvas: '{}' });
            } else {
                (config.externals as Record<string, string>)['canvas'] = '{}';
            }
        }
        return config;
    },
};

export default nextConfig;
