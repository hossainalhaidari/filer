import { resolve } from "path";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const projectRootDir = resolve(__dirname);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": resolve(projectRootDir, "src"),
    },
  },
  envDir: resolve(projectRootDir, "env"),
});
