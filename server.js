const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "pixelprod-lambda" });
});

app.post("/render", async (req, res) => {
  const { compositionId, props } = req.body;

  const validIds = ["PackshotStudioPremium", "HeroProductReveal", "BrandLogoAnimation"];
  if (!compositionId || !validIds.includes(compositionId)) {
    return res.status(400).json({ success: false, error: "compositionId invalide" });
  }

  try {
    const { renderMediaOnLambda } = await import("@remotion/lambda/client");

    const result = await renderMediaOnLambda({
      region: "us-east-1",
      functionName: "remotion-render-4-0-290-mem2048mb-disk2048mb-120sec",
      serveUrl: "https://remotionlambda-useast1-qaolz0pg8y.s3.us-east-1.amazonaws.com/sites/pixelprod/index.html",
      composition: compositionId,
      inputProps: props,
      codec: "h264",
      downloadBehavior: { type: "play-in-browser" },
    });

    res.json({ success: true, videoUrl: result.outputFile });

  } catch (err) {
    console.error("[PixelProd] Erreur Lambda :", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[PixelProd] Serveur démarré sur le port ${PORT}`);
});
