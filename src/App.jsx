import React, { useRef, useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef(null);

  const handleFile = (selected) => {
    if (!selected) return;

    if (
      !selected.type.startsWith("image/") &&
      !selected.type.startsWith("video/")
    ) {
      alert("Only image or video files are allowed.");
      return;
    }

    if (selected.size > 50 * 1024 * 1024) {
      alert("Maximum file size is 50MB.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);

    if (selected.type.startsWith("image/")) {
      setFileType("image");
    } else {
      setFileType("video");
    }
  };

  const handleInputChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload an image or video first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setResult(null);

      const baseURL = import.meta.env.VITE_SNAKE_MODEL_URL;

      if (!baseURL) {
        throw new Error(
          "VITE_SNAKE_MODEL_URL is not configured."
        );
      }

      const endpoint =
        fileType === "image"
          ? `${baseURL}/predict-image`
          : `${baseURL}/predict-video`;

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      setResult(data);
    } catch (err) {
      console.error(err);
      alert(
        "Prediction failed. Please check your backend/API connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setPreview(null);
    setFileType(null);
    setResult(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const confidence = result
    ? Math.min(Math.max(result.confidence * 100, 0), 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#06130d] text-white overflow-hidden">

      {/* ================= BACKGROUND ================= */}

      <div className="fixed inset-0 pointer-events-none">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.16),transparent_35%),radial-gradient(circle_at_80%_60%,rgba(16,185,129,0.12),transparent_35%)]" />

        <div className="absolute -top-40 -left-40 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />

        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ================= NAVBAR ================= */}

      <header className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">

        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-700 flex items-center justify-center shadow-lg shadow-green-900/30">
              🐍
            </div>

            <div>
              <h1 className="font-bold text-lg tracking-tight">
                Ophidia
              </h1>

              <p className="text-[10px] text-green-400 tracking-[0.3em] uppercase">
                Field Intelligence
              </p>
            </div>

          </div>

          <div className="hidden md:flex items-center gap-8 text-sm">

            <span className="text-green-400 font-medium">
              Analyze
            </span>

            <span className="text-gray-400 hover:text-white transition cursor-pointer">
              Journal
            </span>

            <span className="text-gray-400 hover:text-white transition cursor-pointer">
              Encyclopedia
            </span>

          </div>

          <div className="flex items-center gap-2 text-xs text-green-300 bg-green-400/10 border border-green-400/20 px-3 py-2 rounded-full">

            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />

            AI SYSTEM ONLINE

          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12">

        {/* ================= HERO ================= */}

        <section className="mb-12">

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">

            <div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-400/20 bg-green-400/5 text-green-300 text-xs mb-5">

                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />

                COMPUTER VISION • SPECIES IDENTIFICATION

              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none">

                Identify the

                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-400 to-green-600">
                  Unknown.
                </span>

              </h1>

              <p className="mt-5 text-gray-400 max-w-2xl text-lg leading-relaxed">

                Upload field footage and let our computer vision engine
                analyze visual patterns to identify serpentine species
                in seconds.

              </p>

            </div>

            {/* System stats */}

            <div className="grid grid-cols-3 gap-3">

              <Stat
                value="AI"
                label="ENGINE"
              />

              <Stat
                value="50MB"
                label="MAX FILE"
              />

              <Stat
                value="24/7"
                label="READY"
              />

            </div>

          </div>

        </section>

        {/* ================= GRID ================= */}

        <div className="grid lg:grid-cols-12 gap-6">

          {/* ================= UPLOAD PANEL ================= */}

          <section className="lg:col-span-7">

            <div className="rounded-3xl border border-white/10 bg-white/[0.045] backdrop-blur-2xl overflow-hidden shadow-2xl">

              {/* Panel header */}

              <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">

                <div>

                  <p className="text-xs text-green-400 font-semibold tracking-widest uppercase">
                    Input Dataset
                  </p>

                  <h2 className="text-xl font-semibold mt-1">
                    Upload Field Evidence
                  </h2>

                </div>

                <div className="text-xs text-gray-500">
                  STEP 01 / 02
                </div>

              </div>

              {/* Upload area */}

              <div className="p-6">

                <div
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  className={`
                    relative min-h-[330px]
                    rounded-2xl
                    border-2 border-dashed
                    flex flex-col items-center justify-center
                    cursor-pointer
                    transition-all duration-300
                    overflow-hidden
                    ${
                      dragActive
                        ? "border-green-400 bg-green-400/10 scale-[1.01]"
                        : "border-white/10 bg-black/20 hover:border-green-400/40 hover:bg-green-400/[0.03]"
                    }
                  `}
                >

                  {/* scanning animation */}

                  {loading && (
                    <div className="absolute inset-0 pointer-events-none">

                      <div className="absolute left-0 right-0 h-[2px] bg-green-400 shadow-[0_0_20px_#22c55e] animate-[scan_2s_linear_infinite]" />

                      <div className="absolute inset-0 bg-green-400/[0.03]" />

                    </div>
                  )}

                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleInputChange}
                    className="hidden"
                  />

                  {preview ? (

                    <div className="w-full h-full min-h-[330px] flex flex-col items-center justify-center p-6">

                      <div className="relative max-h-[220px] max-w-full rounded-xl overflow-hidden border border-white/10 shadow-xl">

                        {fileType === "image" ? (
                          <img
                            src={preview}
                            alt="Preview"
                            className="max-h-[220px] max-w-full object-contain"
                          />
                        ) : (
                          <video
                            src={preview}
                            controls
                            className="max-h-[220px] max-w-full"
                          />
                        )}

                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur px-3 py-1 rounded-full text-xs text-green-300">
                          {fileType === "image"
                            ? "IMAGE"
                            : "VIDEO"}
                        </div>

                      </div>

                      <p className="mt-4 text-sm font-medium">
                        {file.name}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          resetAnalysis();
                        }}
                        className="mt-4 text-xs text-gray-400 hover:text-red-400 transition"
                      >
                        Remove file
                      </button>

                    </div>

                  ) : (

                    <>

                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400/20 to-emerald-700/20 border border-green-400/20 flex items-center justify-center text-4xl mb-5">
                        📡
                      </div>

                      <h3 className="text-xl font-semibold">
                        Drop your evidence here
                      </h3>

                      <p className="text-gray-500 text-sm mt-2">
                        or click anywhere to browse your device
                      </p>

                      <div className="flex flex-wrap justify-center gap-2 mt-6">

                        {["JPG", "PNG", "WEBP", "MP4", "MOV"].map(
                          (type) => (
                            <span
                              key={type}
                              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400"
                            >
                              {type}
                            </span>
                          )
                        )}

                      </div>

                    </>

                  )}

                </div>

                {/* ================= FILE INFO ================= */}

                {file && (

                  <div className="grid grid-cols-3 gap-3 mt-4">

                    <InfoBox
                      label="FORMAT"
                      value={fileType?.toUpperCase()}
                    />

                    <InfoBox
                      label="SIZE"
                      value={`${(
                        file.size /
                        (1024 * 1024)
                      ).toFixed(2)} MB`}
                    />

                    <InfoBox
                      label="STATUS"
                      value="READY"
                    />

                  </div>

                )}

                {/* ================= ACTION ================= */}

                <button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className={`
                    mt-5 w-full py-4 rounded-xl
                    font-semibold
                    transition-all duration-300
                    flex items-center justify-center gap-3
                    ${
                      !file || loading
                        ? "bg-white/5 text-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-900/30 hover:scale-[1.01]"
                    }
                  `}
                >

                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                      Analyzing Evidence...

                    </>
                  ) : (
                    <>
                      <span>⚡</span>

                      Analyze Specimen

                    </>
                  )}

                </button>

              </div>

            </div>

          </section>

          {/* ================= RESULT PANEL ================= */}

          <section className="lg:col-span-5">

            {!result && !loading && (

              <div className="h-full min-h-[500px] rounded-3xl border border-white/10 bg-white/[0.025] flex flex-col items-center justify-center text-center p-8">

                <div className="w-24 h-24 rounded-full border border-green-400/20 bg-green-400/5 flex items-center justify-center text-4xl mb-6">
                  🧬
                </div>

                <p className="text-xs text-green-400 tracking-[0.3em] uppercase">
                  Analysis Chamber
                </p>

                <h2 className="text-2xl font-bold mt-3">
                  Awaiting Specimen
                </h2>

                <p className="text-gray-500 text-sm max-w-sm mt-3 leading-relaxed">
                  Upload an image or video to activate the
                  classification engine.
                </p>

                <div className="mt-8 flex items-center gap-3 text-xs text-gray-600">

                  <span className="w-2 h-2 rounded-full bg-gray-600" />

                  SYSTEM STANDBY

                </div>

              </div>

            )}

            {/* ================= LOADING ================= */}

            {loading && (

              <div className="h-full min-h-[500px] rounded-3xl border border-green-400/20 bg-green-400/[0.03] flex flex-col items-center justify-center text-center p-8">

                <div className="relative w-32 h-32 mb-8">

                  <div className="absolute inset-0 rounded-full border border-green-400/20" />

                  <div className="absolute inset-3 rounded-full border border-green-400/30 border-t-green-400 animate-spin" />

                  <div className="absolute inset-8 rounded-full bg-green-400/10 flex items-center justify-center text-3xl">
                    🐍
                  </div>

                </div>

                <p className="text-green-400 text-xs tracking-[0.3em] uppercase">
                  Neural Analysis Active
                </p>

                <h2 className="text-2xl font-bold mt-3">
                  Examining Specimen
                </h2>

                <p className="text-gray-500 text-sm mt-3">
                  Extracting visual features and comparing
                  species patterns...
                </p>

                <div className="w-full max-w-xs h-1 bg-white/10 rounded-full mt-8 overflow-hidden">

                  <div className="h-full w-1/2 bg-gradient-to-r from-green-600 to-green-300 animate-[loading_1.5s_ease-in-out_infinite]" />

                </div>

              </div>

            )}

            {/* ================= RESULT ================= */}

            {result && !loading && (

              <div className="rounded-3xl border border-green-400/20 bg-white/[0.045] backdrop-blur-xl overflow-hidden shadow-2xl">

                {/* Result image */}

                <div className="relative h-64 overflow-hidden">

                  {fileType === "image" ? (
                    <img
                      src={preview}
                      alt="Analyzed specimen"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={preview}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute bottom-4 left-5">

                    <div className="text-[10px] text-green-300 tracking-[0.3em] uppercase">
                      Analysis Complete
                    </div>

                    <h2 className="text-2xl font-bold mt-1">
                      {result.prediction}
                    </h2>

                  </div>

                  <div className="absolute top-4 right-4">

                    <div className="px-3 py-2 rounded-xl bg-black/70 backdrop-blur border border-green-400/20">

                      <div className="text-[9px] text-gray-400 uppercase">
                        Confidence
                      </div>

                      <div className="text-xl font-bold text-green-400">
                        {confidence.toFixed(1)}%
                      </div>

                    </div>

                  </div>

                </div>

                {/* Result content */}

                <div className="p-6">

                  <div className="flex justify-between items-start">

                    <div>

                      <p className="text-[10px] tracking-[0.2em] text-gray-500 uppercase">
                        Top Prediction
                      </p>

                      <h3 className="text-3xl font-black text-green-300 mt-1">
                        {result.prediction}
                      </h3>

                    </div>

                    <div className="text-3xl">
                      🐍
                    </div>

                  </div>

                  {/* Confidence */}

                  <div className="mt-6">

                    <div className="flex justify-between text-xs mb-2">

                      <span className="text-gray-500">
                        MODEL CONFIDENCE
                      </span>

                      <span className="text-green-400 font-semibold">
                        {confidence.toFixed(1)}%
                      </span>

                    </div>

                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-700 via-green-400 to-emerald-300 transition-all duration-1000"
                        style={{
                          width: `${confidence}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* Tags */}

                  <div className="flex flex-wrap gap-2 mt-6">

                    <Tag text="AI CLASSIFIED" />

                    <Tag text="VISION MODEL" />

                    {confidence >= 80 && (
                      <Tag text="HIGH CONFIDENCE" />
                    )}

                  </div>

                  {/* Divider */}

                  <div className="border-t border-white/10 my-6" />

                  <p className="text-xs text-gray-500 leading-relaxed">
                    Classification generated from visual
                    characteristics detected in the uploaded
                    specimen.
                  </p>

                  {/* Again */}

                  <button
                    onClick={resetAnalysis}
                    className="mt-6 w-full py-3 rounded-xl border border-white/10 hover:border-green-400/30 hover:bg-green-400/5 transition text-sm font-medium"
                  >
                    Analyze Another Specimen
                  </button>

                </div>

              </div>

            )}

          </section>

        </div>

        {/* ================= FOOTER ================= */}

        <footer className="mt-12 border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between gap-3 text-[10px] text-gray-600 uppercase tracking-widest">

          <span>
            OPHIDIA FIELD LAB • COMPUTER VISION
          </span>

          <span>
            Neural-Alpha Classification Engine
          </span>

        </footer>

      </main>

      {/* ================= CUSTOM ANIMATIONS ================= */}

      <style>{`

        @keyframes scan {
          0% {
            top: 0%;
          }

          100% {
            top: 100%;
          }
        }

        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }

          100% {
            transform: translateX(200%);
          }
        }

      `}</style>

    </div>
  );
}


/* ================= COMPONENTS ================= */

function Stat({ value, label }) {
  return (
    <div className="px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] min-w-[80px]">
      <div className="text-lg font-bold text-green-300">
        {value}
      </div>

      <div className="text-[9px] text-gray-600 tracking-widest mt-1">
        {label}
      </div>
    </div>
  );
}


function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl bg-black/20 border border-white/10 p-3">

      <p className="text-[9px] text-gray-600 tracking-widest">
        {label}
      </p>

      <p className="text-xs font-semibold text-gray-300 mt-1">
        {value}
      </p>

    </div>
  );
}


function Tag({ text }) {
  return (
    <span className="px-3 py-1.5 rounded-full bg-green-400/10 border border-green-400/20 text-[9px] tracking-widest text-green-300">
      {text}
    </span>
  );
}


export default App;