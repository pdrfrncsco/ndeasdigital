const proxyTargetRaw = process.env.API_PROXY_TARGET || ''
const apiProxy = proxyTargetRaw.replace(/\/$/, '')
const isSelfOrigin = apiProxy.includes('localhost:3000') || apiProxy.includes('127.0.0.1:3000') || apiProxy.includes('0.0.0.0:3000')

module.exports = {
  async rewrites() {
    if (!apiProxy || isSelfOrigin) return []
    return [
      {
        source: '/api/:path*',
        destination: `${apiProxy}/api/:path*`
      }
    ]
  }
}