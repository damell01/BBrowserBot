// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"]
  },
  server: {
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        cookieDomainRewrite: {
          "*": ""
        },
        cookiePathRewrite: {
          "*": "/"
        },
        onProxyRes: (proxyRes) => {
          const cookies = proxyRes.headers["set-cookie"];
          if (cookies) {
            proxyRes.headers["set-cookie"] = cookies.map(
              (cookie) => cookie.replace(/SameSite=Lax/i, "SameSite=None").replace(/Secure;?/i, "").replace(/session=/i, "PHPSESSID=")
            );
          }
        }
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXhjbHVkZTogWydsdWNpZGUtcmVhY3QnXSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgaGlzdG9yeUFwaUZhbGxiYWNrOiB0cnVlLFxuICAgIHByb3h5OiB7XG4gICAgICAnL2FwaSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo4MDAwJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICBjb29raWVEb21haW5SZXdyaXRlOiB7XG4gICAgICAgICAgJyonOiAnJ1xuICAgICAgICB9LFxuICAgICAgICBjb29raWVQYXRoUmV3cml0ZToge1xuICAgICAgICAgICcqJzogJy8nXG4gICAgICAgIH0sXG4gICAgICAgIG9uUHJveHlSZXM6IChwcm94eVJlcykgPT4ge1xuICAgICAgICAgIGNvbnN0IGNvb2tpZXMgPSBwcm94eVJlcy5oZWFkZXJzWydzZXQtY29va2llJ107XG4gICAgICAgICAgaWYgKGNvb2tpZXMpIHtcbiAgICAgICAgICAgIHByb3h5UmVzLmhlYWRlcnNbJ3NldC1jb29raWUnXSA9IGNvb2tpZXMubWFwKGNvb2tpZSA9PlxuICAgICAgICAgICAgICBjb29raWVcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvU2FtZVNpdGU9TGF4L2ksICdTYW1lU2l0ZT1Ob25lJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvU2VjdXJlOz8vaSwgJycpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL3Nlc3Npb249L2ksICdQSFBTRVNTSUQ9JylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBidWlsZDoge1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICB2ZW5kb3I6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBRWxCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsY0FBYztBQUFBLEVBQzFCO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixvQkFBb0I7QUFBQSxJQUNwQixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxxQkFBcUI7QUFBQSxVQUNuQixLQUFLO0FBQUEsUUFDUDtBQUFBLFFBQ0EsbUJBQW1CO0FBQUEsVUFDakIsS0FBSztBQUFBLFFBQ1A7QUFBQSxRQUNBLFlBQVksQ0FBQyxhQUFhO0FBQ3hCLGdCQUFNLFVBQVUsU0FBUyxRQUFRLFlBQVk7QUFDN0MsY0FBSSxTQUFTO0FBQ1gscUJBQVMsUUFBUSxZQUFZLElBQUksUUFBUTtBQUFBLGNBQUksWUFDM0MsT0FDRyxRQUFRLGlCQUFpQixlQUFlLEVBQ3hDLFFBQVEsYUFBYSxFQUFFLEVBQ3ZCLFFBQVEsYUFBYSxZQUFZO0FBQUEsWUFDdEM7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osUUFBUSxDQUFDLFNBQVMsYUFBYSxrQkFBa0I7QUFBQSxRQUNuRDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
