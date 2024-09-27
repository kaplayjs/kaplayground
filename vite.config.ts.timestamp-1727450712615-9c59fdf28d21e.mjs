// vite.config.ts
import react from "file:///C:/Users/USUARIO/Desktop/kaplayground/node_modules/.pnpm/@vitejs+plugin-react@4.3.1_vite@5.4.2_@types+node@22.7.0_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///C:/Users/USUARIO/Desktop/kaplayground/node_modules/.pnpm/vite@5.4.2_@types+node@22.7.0/node_modules/vite/dist/node/index.js";
import { viteStaticCopy } from "file:///C:/Users/USUARIO/Desktop/kaplayground/node_modules/.pnpm/vite-plugin-static-copy@1.0.6_vite@5.4.2_@types+node@22.7.0_/node_modules/vite-plugin-static-copy/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "kaplay/assets/sprites/**",
          dest: "sprites/"
        },
        {
          src: "kaplay/examples/**",
          dest: "examples/"
        }
      ]
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVU1VBUklPXFxcXERlc2t0b3BcXFxca2FwbGF5Z3JvdW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVU1VBUklPXFxcXERlc2t0b3BcXFxca2FwbGF5Z3JvdW5kXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9VU1VBUklPL0Rlc2t0b3Ava2FwbGF5Z3JvdW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgeyB2aXRlU3RhdGljQ29weSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1zdGF0aWMtY29weVwiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgICByZWFjdCgpLFxyXG4gICAgICAgIHZpdGVTdGF0aWNDb3B5KHtcclxuICAgICAgICAgICAgdGFyZ2V0czogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNyYzogXCJrYXBsYXkvYXNzZXRzL3Nwcml0ZXMvKipcIixcclxuICAgICAgICAgICAgICAgICAgICBkZXN0OiBcInNwcml0ZXMvXCIsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNyYzogXCJrYXBsYXkvZXhhbXBsZXMvKipcIixcclxuICAgICAgICAgICAgICAgICAgICBkZXN0OiBcImV4YW1wbGVzL1wiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9KSxcclxuICAgIF0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJTLE9BQU8sV0FBVztBQUM3VCxTQUFTLG9CQUFvQjtBQUM3QixTQUFTLHNCQUFzQjtBQUcvQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixlQUFlO0FBQUEsTUFDWCxTQUFTO0FBQUEsUUFDTDtBQUFBLFVBQ0ksS0FBSztBQUFBLFVBQ0wsTUFBTTtBQUFBLFFBQ1Y7QUFBQSxRQUNBO0FBQUEsVUFDSSxLQUFLO0FBQUEsVUFDTCxNQUFNO0FBQUEsUUFDVjtBQUFBLE1BQ0o7QUFBQSxJQUNKLENBQUM7QUFBQSxFQUNMO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
