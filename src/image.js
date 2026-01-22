// ============================================================
// 画像ロード＆キャンバス調整
// ============================================================

/**
 * loadImage を Promise 化
 */
function loadImageAsync(path) {
  return new Promise((resolve, reject) => {
    loadImage(
      path,
      (im) => resolve(im),
      (err) => reject(err ?? new Error("loadImage failed: " + path))
    );
  });
}

/**
 * 画像に合わせて canvas / offscreen を作り直す
 */
function setupCanvasesForImage(newImg) {
  resizeCanvas(newImg.width, newImg.height);
  pixelDensity(1);
  rectMode(CENTER);
  noStroke();

  // 入力用
  srcG = createGraphics(width, height);
  srcG.pixelDensity(1);
  srcG.image(newImg, 0, 0);

  // 軌跡用
  trailG = createGraphics(width, height);
  trailG.pixelDensity(1);
  trailG.rectMode(CENTER);
  trailG.noStroke();
  trailG.clear();
}

const UPLOAD_LIMIT_BYTES = 5 * 1024 * 1024;

const UPLOAD_STATE = {
  file: null,
  url: "",
  name: "",
  size: 0,
};

function getUploadedUrl() {
  return UPLOAD_STATE.url;
}

function getUploadedLabel() {
  if (!UPLOAD_STATE.file) return "(none)";
  const mb = (UPLOAD_STATE.size / (1024 * 1024)).toFixed(2);
  return `${UPLOAD_STATE.name} (${mb} MB)`;
}

/**
 * JPEGのみ / 5MBまで
 * okなら objectURL を更新（古いURLは revoke）
 */
function setUploadedFile(file) {
  if (!file) return { ok: false, message: "no file" };

  // type はブラウザにより空のことがあるので、拡張子でも保険をかける
  const name = String(file.name ?? "");
  const lower = name.toLowerCase();
  const extOk = lower.endsWith(".jpg") || lower.endsWith(".jpeg");
  const typeOk = file.type === "image/jpeg" || file.type === "";

  if (!(extOk && typeOk)) {
    return { ok: false, message: "JPEG (.jpg/.jpeg) only" };
  }

  if (file.size > UPLOAD_LIMIT_BYTES) {
    return { ok: false, message: "File too large (max 5MB)" };
  }

  // 古い objectURL を破棄
  try {
    if (UPLOAD_STATE.url) URL.revokeObjectURL(UPLOAD_STATE.url);
  } catch (_) {}

  const url = URL.createObjectURL(file);

  UPLOAD_STATE.file = file;
  UPLOAD_STATE.url = url;
  UPLOAD_STATE.name = name || "upload.jpg";
  UPLOAD_STATE.size = file.size;

  return { ok: true, message: "ok" };
}
