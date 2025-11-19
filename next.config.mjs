/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                // hostname: 'ufs.sh',
                hostname: 'utfs.io',
                port: '',
                // pathname: '/**',
                pathname: '/f/**',
            },
            {
                protocol: 'https',
                hostname: '*.ufs.sh', // Wildcard for any subdomain
                port: '',
                pathname: '/f/**',
            },
        ],
    },
};

export default nextConfig;
