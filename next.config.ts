import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      '@radix-ui/react-icons', 
      'framer-motion', 
      '@fluentui/react-components', 
      '@fluentui/react-icons',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dialog',
      '@radix-ui/react-label',
      '@radix-ui/react-progress',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs'
    ],
    webpackBuildWorker: true,
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
    optimisticClientCache: true,
    esmExternals: true,
    serverComponentsExternalPackages: ['@vercel/blob', '@vercel/kv'],
  },
  turbopack: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: true,
  },
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false,
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=600',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  //output: 'standalone',
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  modularizeImports: {
    '@radix-ui/react-icons': {
      transform: '@radix-ui/react-icons/{{member}}',
    },
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
    '@fluentui/react-icons': {
      transform: '@fluentui/react-icons/lib/{{member}}',
    },
  },
  webpack: (config: any, { dev, isServer }: any) => {
    // Optimize for faster builds
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@radix-ui/react-icons': '@radix-ui/react-icons/dist/index.js',
      }
    }
    
    // Enable caching
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    }
    
    return config
  },
};

export default nextConfig;
