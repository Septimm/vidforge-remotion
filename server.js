const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { bundle } = require("@remotion/bundler");
const { renderMedia, selectComposition } = require("@remotion/renderer");

const app = express();
app.use(cors());
app.use(express.json());

const OUTPUT_DIR = path.join(__dirname, "outputs");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

app.use("/videos", express.static(OUTPUT_DIR));

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "vidforge-remotion" });
});

app.post("/render", async (req, res) => {
  const { compositionId, props } = req.body;

  const validIds = ["PackshotStudioPremium", "HeroProductReveal", "BrandLogoAnimation"];
  if (!compositionId || !validIds.includes(compositionId)) {
    return res.status(400).json({ success: false, error: "compositionId invalide" });
  }
  if (!props) {
    return res.status(400).json({ success: false, error: "props manquants" });
  }

  const renderId = `render_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const outputPath = path.join(OUTPUT_DIR, `${renderId}.mp4`);

  try {
    console.log(`[VidForge] Démarrage rendu ${compositionId} — ${renderId}`);

    const bundleLocation = await bundle({
      entryPoint: path.join(__dirname, "src/index.ts"),
      webpackOverride: (config) => config,
    });

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps: props,
    });

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: props,
    });

    const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
    const videoUrl = `${baseUrl}/videos/${renderId}.mp4`;

    console.log(`[VidForge] Rendu terminé — ${videoUrl}`);
    res.json({ success: true, renderId, videoUrl });

  } catch (err) {
    console.error("[VidForge] Erreur rendu :", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[VidForge] Serveur démarré sur le port ${PORT}`);
});
