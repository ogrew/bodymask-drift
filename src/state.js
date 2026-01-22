// ============================================================
// グローバル
// ============================================================

let img; // 現在表示しているベース画像
let srcG; // セグメンテーション入力用（CanvasImageSource）
let trailG; // 軌跡レイヤー

let bodySeg = null; // ml5 model
let modelReady = false; // モデル準備完了フラグ

let paneRun = null;
let paneParams = null;
let btnPlay = null;
let btnStop = null;

// --- 追加：画像ソースUIの相互排他制御用ハンドル
let bImgSource = null;     // IMG_SOURCE の binding
let bSampleImage = null;   // SAMPLE_IMAGE の binding
let bUploadImage = null;   // UPLOAD_IMAGE の binding
let btnChooseJpeg = null;  // CHOOSE_JPEG... ボタン

// 実行状態（PLAYごとに作り直す）
let run = null;
let runToken = 0;