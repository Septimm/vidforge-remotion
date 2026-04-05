const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());
app.use(express.json());

const renders = {};

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "pixelprod-lambda" });
});

app.post("/render", async (req, res) => {
  const { compositionId, props } = req.body;

  const validIds = ["PackshotStudioPremium", "HeroProductReveal", "BrandLogoAnimation"];
  if (!compositionId || !validIds.includes(compositionId)) {
    return res.status(400).json({ success: false, error: "compositionId invalide" });
  }

  const taskId = `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  renders[taskId] = { status: "processing", videoUrl: null, error: null };

  (async () => {
    try {
      const { renderMediaOnLambda } = await import("@remotion/lambda/client");
      const result = await renderMediaOnLambda({
        region: "us-east-1",
        functionName: "remotion-render-4-0-445-mem2048mb-disk2048mb-120sec",
        serveUrl: "https://remotionlambda-useast1-qaolz0pg8y.s3.us-east-1.amazonaws.com/sites/pixelprod/index.html",
        composition: compositionId,
        inputProps: props,
        codec: "h264",
        downloadBehavior: { type: "play-in-browser" },
      });
      renders[taskId] = { status: "completed", videoUrl: result.outputFile, error: null };
      console.log(`[PixelProd] Rendu terminé — ${result.outputFile}`);
    } catch (err) {
      renders[taskId] = { status: "failed", videoUrl: null, error: err.message };
      console.error(`[PixelProd] Erreur :`, err.message);
    }
  })();

  res.json({ success: true, taskId, status: "processing" });
});

app.get("/status/:taskId", (req, res) => {
  const render = renders[req.params.taskId];
  if (!render) return res.status(404).json({ error: "taskId introuvable" });
  res.json(render);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[PixelProd] Serveur démarré sur le port ${PORT}`);
});
