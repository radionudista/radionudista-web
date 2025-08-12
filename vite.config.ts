import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { multiLanguageBuild } from "./src/plugins/multiLanguageBuild";
import { contentJsonGeneratorPlugin } from './src/plugins/contentJsonGenerator';
// Removed unused import of env

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const envVars = loadEnv(mode, process.cwd(), '');
  // Ensure supportedLanguages is always an array
  const supportedLanguages = (envVars.VITE_SUPPORTED_LANGUAGES || 'es,pt')
    .split(',')
    .map(l => l.trim())
    .filter(Boolean);

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
      multiLanguageBuild({
        langDir: path.resolve(__dirname, 'src/lang'),
        defaultLang: 'en',
      }),
      contentJsonGeneratorPlugin({
        contentDir: path.resolve(__dirname, 'src/content'),
        outputFile: path.resolve(__dirname, 'src/contentIndex.json'),
        supportedLanguages: Array.isArray(supportedLanguages) ? supportedLanguages : [supportedLanguages],
      })
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Expose environment variables to the client
    define: {
      __APP_ENV__: JSON.stringify(mode),
    },
  };
});
