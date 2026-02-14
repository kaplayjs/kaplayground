// vite.config.ts
import react from "file:///E:/kaplayground/node_modules/.pnpm/@vitejs+plugin-react@4.3.2_vite@5.4.8_@types+node@22.7.5_terser@5.34.1_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path2 from "path";
import { defineConfig } from "file:///E:/kaplayground/node_modules/.pnpm/vite@5.4.8_@types+node@22.7.5_terser@5.34.1/node_modules/vite/dist/node/index.js";
import { viteStaticCopy } from "file:///E:/kaplayground/node_modules/.pnpm/vite-plugin-static-copy@2.3.1_vite@5.4.8_@types+node@22.7.5_terser@5.34.1_/node_modules/vite-plugin-static-copy/dist/index.js";

// scripts/examples.ts
import { execSync } from "child_process";
import { parse } from "file:///E:/kaplayground/node_modules/.pnpm/comment-parser@1.4.1/node_modules/comment-parser/es6/index.js";
import fs from "fs";
import mime from "file:///E:/kaplayground/node_modules/.pnpm/mime-types@3.0.1/node_modules/mime-types/index.js";
import path from "path";

// kaplay/examples/examples.json
var examples_default = {
  categories: {
    basics: {
      displayName: "Basics",
      description: "Basic examples to get started with the library",
      order: 0
    },
    concepts: {
      displayName: "Concepts",
      description: "Examples that showcase concepts of the library",
      order: 1
    },
    games: {
      displayName: "Games",
      description: "Examples that showcase games made with the library",
      order: 2
    }
  },
  tags: {
    basics: {
      displayName: "Basics",
      description: "Learn the KAPLAY basics"
    },
    gobj: {
      displayName: "Game Object",
      description: "Related to game objects"
    },
    ai: {
      displayName: "AI",
      description: "Related to AI"
    },
    comps: {
      displayName: "Components",
      description: "Related to a component or components"
    },
    animation: {
      displayName: "Animation",
      description: "Related to animation"
    },
    physics: {
      displayName: "Physics",
      description: "Related to physics"
    },
    audio: {
      displayName: "Audio",
      description: "Related to audio"
    },
    input: {
      displayName: "Input",
      description: "Related to input handling"
    },
    draw: {
      displayName: "Draw",
      description: "Related to drawing api"
    },
    visual: {
      displayName: "Visual",
      description: "Related to rendering"
    },
    ui: {
      displayName: "UI",
      description: "Related to user interface"
    },
    game: {
      displayName: "Game",
      description: "Examples that may work as a game"
    },
    effects: {
      displayName: "Effects",
      description: "Related to visual effects"
    },
    math: {
      displayName: "Math",
      description: "Just for nerds"
    },
    debug: {
      displayName: "Debug",
      description: "Related to debugging"
    },
    events: {
      displayName: "Events",
      description: "Related to event handling"
    },
    tween: {
      displayName: "Tween",
      description: "Related to tweening"
    }
  },
  difficulties: [
    {
      displayName: "Easy"
    },
    {
      displayName: "Medium"
    },
    {
      displayName: "Hard"
    },
    {
      displayName: "Auto"
    }
  ]
};

// scripts/examples.ts
var __vite_injected_original_dirname = "E:\\kaplayground\\scripts";
var defaultExamplesPath = path.join(
  __vite_injected_original_dirname,
  "..",
  "kaplay",
  "examples"
);
var distPath = path.join(__vite_injected_original_dirname, "..", "src", "data");
var generatePublicAssets = async (examplesPath = defaultExamplesPath) => {
  function getAssetsRecursively(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    return entries.flatMap((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return getAssetsRecursively(fullPath);
      }
      if (path.extname(entry.name) !== ".js") {
        const content = fs.readFileSync(fullPath);
        const mimeType = mime.lookup(fullPath) || "application/octet-stream";
        const base64 = content.toString("base64");
        const dataUrl = `data:${mimeType};base64,${base64}`;
        const relativePath = path.relative(
          defaultExamplesPath,
          fullPath
        ).replace(
          /\\/g,
          "/"
        );
        return [{
          filename: relativePath,
          base64: dataUrl
        }];
      }
      return [];
    });
  }
  const assets = getAssetsRecursively(examplesPath);
  fs.writeFileSync(
    path.join(distPath, "publicAssets.json"),
    JSON.stringify({ assets }, null, 4)
  );
  console.log("Generated publicAssets.json");
};
var generateExamples = async (examplesPath = defaultExamplesPath) => {
  let exampleCount = 0;
  const examples = fs.readdirSync(examplesPath).map((file) => {
    if (!file.endsWith(".js")) return null;
    const filePath = path.join(examplesPath, file);
    const code = fs.readFileSync(filePath, "utf-8");
    const name = file.replace(".js", "");
    const codeJsdoc = parse(code);
    const codeWithoutMeta = code.replace(/\/\/ @ts-check\n/g, "").replace(
      /\/\*\*[\s\S]*?\*\//gm,
      ""
    ).trim();
    if (!codeWithoutMeta) return null;
    const tags = codeJsdoc[0]?.tags?.reduce(
      (acc, tag) => {
        acc[tag.tag] = [tag.name.trim(), tag.description.trim()].filter(
          (t) => t != ""
        ).join(" ");
        return acc;
      },
      {}
    );
    const sortName = [
      examples_default.categories?.[tags?.category]?.order ?? 9999,
      tags?.category,
      tags?.group ?? "zzzz",
      tags?.groupOrder ?? 9999,
      name
    ].filter((t) => t != void 0).join("-");
    const example = {
      id: exampleCount++,
      name,
      formattedName: tags?.file?.trim() || name,
      sortName,
      category: tags?.category || "",
      group: tags?.group || "",
      description: tags?.description || "",
      code: codeWithoutMeta,
      difficulty: parseInt(tags?.difficulty) ?? 4,
      version: normalizeVersion(tags?.ver, "master"),
      minVersion: normalizeVersion(tags?.minver, ""),
      tags: tags?.tags?.trim().split(", ") || [],
      createdAt: getFileTimestamp(filePath),
      updatedAt: getFileTimestamp(filePath, "updated")
    };
    if (tags?.locked != void 0) example.locked = true;
    return example;
  });
  fs.writeFileSync(
    path.join(distPath, "exampleList.json"),
    JSON.stringify(examples.filter(Boolean), null, 4)
  );
  console.log("Generated exampleList.json");
};
function getFileTimestamp(filePath, type = "created") {
  const cmd = {
    created: `git log --diff-filter=A --follow --format=%aI -1 -- "${filePath}"`,
    updated: `git log --follow --format=%aI -1 -- "${filePath}"`
  };
  try {
    const stdout = execSync(cmd[type], {
      cwd: path.join(__vite_injected_original_dirname, "..", "kaplay"),
      encoding: "utf8"
    });
    return stdout.trim();
  } catch (err) {
    console.log(err);
    return "";
  }
}
function normalizeVersion(ver, fallback) {
  if (!ver) return fallback;
  ver = ver.split("//")[0].trim();
  return !ver.includes(".") ? `${ver}.0` : ver;
}
generateExamples();
generatePublicAssets();

// vite.config.ts
var __vite_injected_original_dirname2 = "E:\\kaplayground";
var vite_config_default = defineConfig({
  clearScreen: false,
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "kaplay/examples/**",
          dest: ""
        }
      ]
    }),
    {
      name: "kaplay",
      buildStart() {
        const examplesPath = process.env.EXAMPLES_PATH;
        if (examplesPath) {
          generateExamples(
            path2.join(__vite_injected_original_dirname2, examplesPath)
          );
        } else generateExamples();
      }
    }
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic2NyaXB0cy9leGFtcGxlcy50cyIsICJrYXBsYXkvZXhhbXBsZXMvZXhhbXBsZXMuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkU6XFxcXGthcGxheWdyb3VuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxca2FwbGF5Z3JvdW5kXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9rYXBsYXlncm91bmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCB7IHZpdGVTdGF0aWNDb3B5IH0gZnJvbSBcInZpdGUtcGx1Z2luLXN0YXRpYy1jb3B5XCI7XHJcbmltcG9ydCB7IGdlbmVyYXRlRXhhbXBsZXMgfSBmcm9tIFwiLi9zY3JpcHRzL2V4YW1wbGVzLmpzXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gICAgY2xlYXJTY3JlZW46IGZhbHNlLFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICAgIHJlYWN0KCksXHJcbiAgICAgICAgdml0ZVN0YXRpY0NvcHkoe1xyXG4gICAgICAgICAgICB0YXJnZXRzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3JjOiBcImthcGxheS9leGFtcGxlcy8qKlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc3Q6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogXCJrYXBsYXlcIixcclxuICAgICAgICAgICAgYnVpbGRTdGFydCgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4YW1wbGVzUGF0aCA9IHByb2Nlc3MuZW52LkVYQU1QTEVTX1BBVEg7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGV4YW1wbGVzUGF0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlRXhhbXBsZXMoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGguam9pbihpbXBvcnQubWV0YS5kaXJuYW1lLCBleGFtcGxlc1BhdGgpLFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgZ2VuZXJhdGVFeGFtcGxlcygpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICBdLFxyXG59KTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxrYXBsYXlncm91bmRcXFxcc2NyaXB0c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxca2FwbGF5Z3JvdW5kXFxcXHNjcmlwdHNcXFxcZXhhbXBsZXMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L2thcGxheWdyb3VuZC9zY3JpcHRzL2V4YW1wbGVzLnRzXCI7Ly8gQSBzY3JpcHQgdGhhdCBnZXRzIGFsbCB0aGUgZXhhbXBsZXMgb24ga2FwbGF5L2V4YW1wbGVzIGZvbGRlciBhbmQgZ2VuZXJhdGVzIGFcclxuLy8gbGlzdCBvZiBleGFtcGxlcyB3aXRoIGNvZGUgYW5kIG5hbWUuXHJcblxyXG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XHJcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSBcImNvbW1lbnQtcGFyc2VyXCI7XHJcbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcclxuaW1wb3J0IG1pbWUgZnJvbSBcIm1pbWUtdHlwZXNcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHR5cGUgeyBQYWNrdW1lbnQgfSBmcm9tIFwicXVlcnktcmVnaXN0cnlcIjtcclxuaW1wb3J0IGV4YW1wbGVzRGF0YSBmcm9tIFwiLi4va2FwbGF5L2V4YW1wbGVzL2V4YW1wbGVzLmpzb25cIiB3aXRoIHtcclxuICAgIHR5cGU6IFwianNvblwiLFxyXG59O1xyXG5cclxuLy8gQHRzLWlnbm9yZVxyXG5hc3luYyBmdW5jdGlvbiBnZXRQYWNrYWdlSW5mbyhuYW1lOiBzdHJpbmcpOiBQcm9taXNlPFBhY2t1bWVudD4ge1xyXG4gICAgY29uc3QgZW5kcG9pbnQgPSBgaHR0cHM6Ly9yZWdpc3RyeS5ucG1qcy5vcmcvJHtuYW1lfWA7XHJcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChlbmRwb2ludCk7XHJcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKTtcclxuICAgIHJldHVybiBkYXRhIGFzIFBhY2t1bWVudDtcclxufVxyXG5cclxuY29uc3QgZGVmYXVsdEV4YW1wbGVzUGF0aCA9IHBhdGguam9pbihcclxuICAgIGltcG9ydC5tZXRhLmRpcm5hbWUsXHJcbiAgICBcIi4uXCIsXHJcbiAgICBcImthcGxheVwiLFxyXG4gICAgXCJleGFtcGxlc1wiLFxyXG4pO1xyXG5cclxuY29uc3QgZGlzdFBhdGggPSBwYXRoLmpvaW4oaW1wb3J0Lm1ldGEuZGlybmFtZSwgXCIuLlwiLCBcInNyY1wiLCBcImRhdGFcIik7XHJcblxyXG5leHBvcnQgY29uc3QgZ2VuZXJhdGVQdWJsaWNBc3NldHMgPSBhc3luYyAoXHJcbiAgICBleGFtcGxlc1BhdGggPSBkZWZhdWx0RXhhbXBsZXNQYXRoLFxyXG4pID0+IHtcclxuICAgIGZ1bmN0aW9uIGdldEFzc2V0c1JlY3Vyc2l2ZWx5KGRpcikge1xyXG4gICAgICAgIGNvbnN0IGVudHJpZXMgPSBmcy5yZWFkZGlyU3luYyhkaXIsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGVudHJpZXMuZmxhdE1hcCgoZW50cnkpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oZGlyLCBlbnRyeS5uYW1lKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlbnRyeS5pc0RpcmVjdG9yeSgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0QXNzZXRzUmVjdXJzaXZlbHkoZnVsbFBhdGgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocGF0aC5leHRuYW1lKGVudHJ5Lm5hbWUpICE9PSBcIi5qc1wiKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKGZ1bGxQYXRoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1pbWVUeXBlID0gbWltZS5sb29rdXAoZnVsbFBhdGgpXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJhc2U2NCA9IGNvbnRlbnQudG9TdHJpbmcoXCJiYXNlNjRcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhVXJsID0gYGRhdGE6JHttaW1lVHlwZX07YmFzZTY0LCR7YmFzZTY0fWA7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBwYXRoLnJlbGF0aXZlKFxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRFeGFtcGxlc1BhdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgZnVsbFBhdGgsXHJcbiAgICAgICAgICAgICAgICApLnJlcGxhY2UoXHJcbiAgICAgICAgICAgICAgICAgICAgL1xcXFwvZyxcclxuICAgICAgICAgICAgICAgICAgICBcIi9cIixcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IHJlbGF0aXZlUGF0aCxcclxuICAgICAgICAgICAgICAgICAgICBiYXNlNjQ6IGRhdGFVcmwsXHJcbiAgICAgICAgICAgICAgICB9XTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFzc2V0cyA9IGdldEFzc2V0c1JlY3Vyc2l2ZWx5KGV4YW1wbGVzUGF0aCk7XHJcblxyXG4gICAgLy8gV3JpdGUgYSBKU09OIGZpbGUgd2l0aCB0aGUgZXhhbXBsZXNcclxuICAgIGZzLndyaXRlRmlsZVN5bmMoXHJcbiAgICAgICAgcGF0aC5qb2luKGRpc3RQYXRoLCBcInB1YmxpY0Fzc2V0cy5qc29uXCIpLFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHsgYXNzZXRzOiBhc3NldHMgfSwgbnVsbCwgNCksXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiR2VuZXJhdGVkIHB1YmxpY0Fzc2V0cy5qc29uXCIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdlbmVyYXRlRXhhbXBsZXMgPSBhc3luYyAoZXhhbXBsZXNQYXRoID0gZGVmYXVsdEV4YW1wbGVzUGF0aCkgPT4ge1xyXG4gICAgbGV0IGV4YW1wbGVDb3VudCA9IDA7XHJcblxyXG4gICAgY29uc3QgZXhhbXBsZXMgPSBmcy5yZWFkZGlyU3luYyhleGFtcGxlc1BhdGgpLm1hcCgoZmlsZSkgPT4ge1xyXG4gICAgICAgIGlmICghZmlsZS5lbmRzV2l0aChcIi5qc1wiKSkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKGV4YW1wbGVzUGF0aCwgZmlsZSk7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwgXCJ1dGYtOFwiKTtcclxuICAgICAgICBjb25zdCBuYW1lID0gZmlsZS5yZXBsYWNlKFwiLmpzXCIsIFwiXCIpO1xyXG5cclxuICAgICAgICBjb25zdCBjb2RlSnNkb2MgPSBwYXJzZShjb2RlKTtcclxuICAgICAgICBjb25zdCBjb2RlV2l0aG91dE1ldGEgPSBjb2RlLnJlcGxhY2UoL1xcL1xcLyBAdHMtY2hlY2tcXG4vZywgXCJcIikucmVwbGFjZShcclxuICAgICAgICAgICAgL1xcL1xcKlxcKltcXHNcXFNdKj9cXCpcXC8vZ20sXHJcbiAgICAgICAgICAgIFwiXCIsXHJcbiAgICAgICAgKS50cmltKCk7XHJcblxyXG4gICAgICAgIGlmICghY29kZVdpdGhvdXRNZXRhKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgY29uc3QgdGFncyA9IGNvZGVKc2RvY1swXT8udGFncz8ucmVkdWNlKFxyXG4gICAgICAgICAgICAoYWNjLCB0YWcpID0+IHtcclxuICAgICAgICAgICAgICAgIGFjY1t0YWcudGFnXSA9IFt0YWcubmFtZS50cmltKCksIHRhZy5kZXNjcmlwdGlvbi50cmltKCldLmZpbHRlcihcclxuICAgICAgICAgICAgICAgICAgICB0ID0+IHQgIT0gXCJcIixcclxuICAgICAgICAgICAgICAgICkuam9pbihcIiBcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7fSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNvcnROYW1lID0gW1xyXG4gICAgICAgICAgICBleGFtcGxlc0RhdGEuY2F0ZWdvcmllcz8uW3RhZ3M/LmNhdGVnb3J5XT8ub3JkZXIgPz8gOTk5OSxcclxuICAgICAgICAgICAgdGFncz8uY2F0ZWdvcnksXHJcbiAgICAgICAgICAgIHRhZ3M/Lmdyb3VwID8/IFwienp6elwiLFxyXG4gICAgICAgICAgICB0YWdzPy5ncm91cE9yZGVyID8/IDk5OTksXHJcbiAgICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgXS5maWx0ZXIodCA9PiB0ICE9IHVuZGVmaW5lZCkuam9pbihcIi1cIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGV4YW1wbGU6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XHJcbiAgICAgICAgICAgIGlkOiBleGFtcGxlQ291bnQrKyxcclxuICAgICAgICAgICAgbmFtZSxcclxuICAgICAgICAgICAgZm9ybWF0dGVkTmFtZTogdGFncz8uZmlsZT8udHJpbSgpIHx8IG5hbWUsXHJcbiAgICAgICAgICAgIHNvcnROYW1lLFxyXG4gICAgICAgICAgICBjYXRlZ29yeTogdGFncz8uY2F0ZWdvcnkgfHwgXCJcIixcclxuICAgICAgICAgICAgZ3JvdXA6IHRhZ3M/Lmdyb3VwIHx8IFwiXCIsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB0YWdzPy5kZXNjcmlwdGlvbiB8fCBcIlwiLFxyXG4gICAgICAgICAgICBjb2RlOiBjb2RlV2l0aG91dE1ldGEsXHJcbiAgICAgICAgICAgIGRpZmZpY3VsdHk6IHBhcnNlSW50KHRhZ3M/LmRpZmZpY3VsdHkpID8/IDQsXHJcbiAgICAgICAgICAgIHZlcnNpb246IG5vcm1hbGl6ZVZlcnNpb24odGFncz8udmVyLCBcIm1hc3RlclwiKSxcclxuICAgICAgICAgICAgbWluVmVyc2lvbjogbm9ybWFsaXplVmVyc2lvbih0YWdzPy5taW52ZXIsIFwiXCIpLFxyXG4gICAgICAgICAgICB0YWdzOiB0YWdzPy50YWdzPy50cmltKCkuc3BsaXQoXCIsIFwiKSB8fCBbXSxcclxuICAgICAgICAgICAgY3JlYXRlZEF0OiBnZXRGaWxlVGltZXN0YW1wKGZpbGVQYXRoKSxcclxuICAgICAgICAgICAgdXBkYXRlZEF0OiBnZXRGaWxlVGltZXN0YW1wKGZpbGVQYXRoLCBcInVwZGF0ZWRcIiksXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKHRhZ3M/LmxvY2tlZCAhPSB1bmRlZmluZWQpIGV4YW1wbGUubG9ja2VkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGV4YW1wbGU7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBXcml0ZSBhIEpTT04gZmlsZSB3aXRoIHRoZSBleGFtcGxlc1xyXG4gICAgZnMud3JpdGVGaWxlU3luYyhcclxuICAgICAgICBwYXRoLmpvaW4oZGlzdFBhdGgsIFwiZXhhbXBsZUxpc3QuanNvblwiKSxcclxuICAgICAgICBKU09OLnN0cmluZ2lmeShleGFtcGxlcy5maWx0ZXIoQm9vbGVhbiksIG51bGwsIDQpLFxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhcIkdlbmVyYXRlZCBleGFtcGxlTGlzdC5qc29uXCIpO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gZ2V0RmlsZVRpbWVzdGFtcChcclxuICAgIGZpbGVQYXRoOiBzdHJpbmcsXHJcbiAgICB0eXBlOiBcImNyZWF0ZWRcIiB8IFwidXBkYXRlZFwiID0gXCJjcmVhdGVkXCIsXHJcbikge1xyXG4gICAgY29uc3QgY21kID0ge1xyXG4gICAgICAgIGNyZWF0ZWQ6XHJcbiAgICAgICAgICAgIGBnaXQgbG9nIC0tZGlmZi1maWx0ZXI9QSAtLWZvbGxvdyAtLWZvcm1hdD0lYUkgLTEgLS0gXCIke2ZpbGVQYXRofVwiYCxcclxuICAgICAgICB1cGRhdGVkOiBgZ2l0IGxvZyAtLWZvbGxvdyAtLWZvcm1hdD0lYUkgLTEgLS0gXCIke2ZpbGVQYXRofVwiYCxcclxuICAgIH07XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBzdGRvdXQgPSBleGVjU3luYyhjbWRbdHlwZV0sIHtcclxuICAgICAgICAgICAgY3dkOiBwYXRoLmpvaW4oaW1wb3J0Lm1ldGEuZGlybmFtZSwgXCIuLlwiLCBcImthcGxheVwiKSxcclxuICAgICAgICAgICAgZW5jb2Rpbmc6IFwidXRmOFwiLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzdGRvdXQudHJpbSgpO1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbm9ybWFsaXplVmVyc2lvbih2ZXI6IHN0cmluZyB8IHVuZGVmaW5lZCwgZmFsbGJhY2s6IHN0cmluZykge1xyXG4gICAgaWYgKCF2ZXIpIHJldHVybiBmYWxsYmFjaztcclxuXHJcbiAgICB2ZXIgPSB2ZXIuc3BsaXQoXCIvL1wiKVswXS50cmltKCk7XHJcbiAgICByZXR1cm4gIXZlci5pbmNsdWRlcyhcIi5cIikgPyBgJHt2ZXJ9LjBgIDogdmVyO1xyXG59XHJcblxyXG5nZW5lcmF0ZUV4YW1wbGVzKCk7XHJcbmdlbmVyYXRlUHVibGljQXNzZXRzKCk7XHJcbiIsICJ7XHJcbiAgXCJjYXRlZ29yaWVzXCI6IHtcclxuICAgIFwiYmFzaWNzXCI6IHtcclxuICAgICAgXCJkaXNwbGF5TmFtZVwiOiBcIkJhc2ljc1wiLFxyXG4gICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQmFzaWMgZXhhbXBsZXMgdG8gZ2V0IHN0YXJ0ZWQgd2l0aCB0aGUgbGlicmFyeVwiLFxyXG4gICAgICBcIm9yZGVyXCI6IDBcclxuICAgIH0sXHJcbiAgICBcImNvbmNlcHRzXCI6IHtcclxuICAgICAgXCJkaXNwbGF5TmFtZVwiOiBcIkNvbmNlcHRzXCIsXHJcbiAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJFeGFtcGxlcyB0aGF0IHNob3djYXNlIGNvbmNlcHRzIG9mIHRoZSBsaWJyYXJ5XCIsXHJcbiAgICAgIFwib3JkZXJcIjogMVxyXG4gICAgfSxcclxuICAgIFwiZ2FtZXNcIjoge1xyXG4gICAgICBcImRpc3BsYXlOYW1lXCI6IFwiR2FtZXNcIixcclxuICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkV4YW1wbGVzIHRoYXQgc2hvd2Nhc2UgZ2FtZXMgbWFkZSB3aXRoIHRoZSBsaWJyYXJ5XCIsXHJcbiAgICAgIFwib3JkZXJcIjogMlxyXG4gICAgfVxyXG4gIH0sXHJcbiAgXCJ0YWdzXCI6IHtcclxuICAgIFwiYmFzaWNzXCI6IHtcclxuICAgICAgXCJkaXNwbGF5TmFtZVwiOiBcIkJhc2ljc1wiLFxyXG4gICAgICBcImRlc2NyaXB0aW9uXCI6IFwiTGVhcm4gdGhlIEtBUExBWSBiYXNpY3NcIlxyXG4gICAgfSxcclxuICAgIFwiZ29ialwiOiB7XHJcbiAgICAgIFwiZGlzcGxheU5hbWVcIjogXCJHYW1lIE9iamVjdFwiLFxyXG4gICAgICBcImRlc2NyaXB0aW9uXCI6IFwiUmVsYXRlZCB0byBnYW1lIG9iamVjdHNcIlxyXG4gICAgfSxcclxuICAgIFwiYWlcIjoge1xyXG4gICAgICBcImRpc3BsYXlOYW1lXCI6IFwiQUlcIixcclxuICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIlJlbGF0ZWQgdG8gQUlcIlxyXG4gICAgfSxcclxuICAgIFwiY29tcHNcIjoge1xyXG4gICAgICBcImRpc3BsYXlOYW1lXCI6IFwiQ29tcG9uZW50c1wiLFxyXG4gICAgICBcImRlc2NyaXB0aW9uXCI6IFwiUmVsYXRlZCB0byBhIGNvbXBvbmVudCBvciBjb21wb25lbnRzXCJcclxuICAgIH0sXHJcbiAgICBcImFuaW1hdGlvblwiOiB7XHJcbiAgICAgIFwiZGlzcGxheU5hbWVcIjogXCJBbmltYXRpb25cIixcclxuICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIlJlbGF0ZWQgdG8gYW5pbWF0aW9uXCJcclxuICAgIH0sXHJcbiAgICBcInBoeXNpY3NcIjoge1xyXG4gICAgICBcImRpc3BsYXlOYW1lXCI6IFwiUGh5c2ljc1wiLFxyXG4gICAgICBcImRlc2NyaXB0aW9uXCI6IFwiUmVsYXRlZCB0byBwaHlzaWNzXCJcclxuICAgIH0sXHJcbiAgICBcImF1ZGlvXCI6IHtcclxuICAgICAgXCJkaXNwbGF5TmFtZVwiOiBcIkF1ZGlvXCIsXHJcbiAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJSZWxhdGVkIHRvIGF1ZGlvXCJcclxuICAgIH0sXHJcbiAgICBcImlucHV0XCI6IHtcclxuICAgICAgXCJkaXNwbGF5TmFtZVwiOiBcIklucHV0XCIsXHJcbiAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJSZWxhdGVkIHRvIGlucHV0IGhhbmRsaW5nXCJcclxuICAgIH0sXHJcbiAgICBcImRyYXdcIjoge1xyXG4gICAgICBcImRpc3BsYXlOYW1lXCI6IFwiRHJhd1wiLFxyXG4gICAgICBcImRlc2NyaXB0aW9uXCI6IFwiUmVsYXRlZCB0byBkcmF3aW5nIGFwaVwiXHJcbiAgICB9LFxyXG4gICAgXCJ2aXN1YWxcIjoge1xyXG4gICAgICBcImRpc3BsYXlOYW1lXCI6IFwiVmlzdWFsXCIsXHJcbiAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJSZWxhdGVkIHRvIHJlbmRlcmluZ1wiXHJcbiAgICB9LFxyXG4gICAgXCJ1aVwiOiB7XHJcbiAgICAgIFwiZGlzcGxheU5hbWVcIjogXCJVSVwiLFxyXG4gICAgICBcImRlc2NyaXB0aW9uXCI6IFwiUmVsYXRlZCB0byB1c2VyIGludGVyZmFjZVwiXHJcbiAgICB9LFxyXG4gICAgXCJnYW1lXCI6IHtcclxuICAgICAgXCJkaXNwbGF5TmFtZVwiOiBcIkdhbWVcIixcclxuICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkV4YW1wbGVzIHRoYXQgbWF5IHdvcmsgYXMgYSBnYW1lXCJcclxuICAgIH0sXHJcbiAgICBcImVmZmVjdHNcIjoge1xyXG4gICAgICBcImRpc3BsYXlOYW1lXCI6IFwiRWZmZWN0c1wiLFxyXG4gICAgICBcImRlc2NyaXB0aW9uXCI6IFwiUmVsYXRlZCB0byB2aXN1YWwgZWZmZWN0c1wiXHJcbiAgICB9LFxyXG4gICAgXCJtYXRoXCI6IHtcclxuICAgICAgXCJkaXNwbGF5TmFtZVwiOiBcIk1hdGhcIixcclxuICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkp1c3QgZm9yIG5lcmRzXCJcclxuICAgIH0sXHJcbiAgICBcImRlYnVnXCI6IHtcclxuICAgICAgXCJkaXNwbGF5TmFtZVwiOiBcIkRlYnVnXCIsXHJcbiAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJSZWxhdGVkIHRvIGRlYnVnZ2luZ1wiXHJcbiAgICB9LFxyXG4gICAgXCJldmVudHNcIjoge1xyXG4gICAgICBcImRpc3BsYXlOYW1lXCI6IFwiRXZlbnRzXCIsXHJcbiAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJSZWxhdGVkIHRvIGV2ZW50IGhhbmRsaW5nXCJcclxuICAgIH0sXHJcbiAgICBcInR3ZWVuXCI6IHtcclxuICAgICAgXCJkaXNwbGF5TmFtZVwiOiBcIlR3ZWVuXCIsXHJcbiAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJSZWxhdGVkIHRvIHR3ZWVuaW5nXCJcclxuICAgIH1cclxuICB9LFxyXG4gIFwiZGlmZmljdWx0aWVzXCI6IFtcclxuICAgIHtcclxuICAgICAgXCJkaXNwbGF5TmFtZVwiOiBcIkVhc3lcIlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgXCJkaXNwbGF5TmFtZVwiOiBcIk1lZGl1bVwiXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBcImRpc3BsYXlOYW1lXCI6IFwiSGFyZFwiXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBcImRpc3BsYXlOYW1lXCI6IFwiQXV0b1wiXHJcbiAgICB9XHJcbiAgXVxyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbU8sT0FBTyxXQUFXO0FBQ3JQLE9BQU9BLFdBQVU7QUFDakIsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxzQkFBc0I7OztBQ0EvQixTQUFTLGdCQUFnQjtBQUN6QixTQUFTLGFBQWE7QUFDdEIsT0FBTyxRQUFRO0FBQ2YsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sVUFBVTs7O0FDUGpCO0FBQUEsRUFDRSxZQUFjO0FBQUEsSUFDWixRQUFVO0FBQUEsTUFDUixhQUFlO0FBQUEsTUFDZixhQUFlO0FBQUEsTUFDZixPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0EsVUFBWTtBQUFBLE1BQ1YsYUFBZTtBQUFBLE1BQ2Ys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
