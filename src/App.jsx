import React, { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));

    if (selected.type.startsWith("image")) {
      setFileType("image");
    } else if (selected.type.startsWith("video")) {
      setFileType("video");
    } else {
      alert("Only image or video allowed");
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Upload file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const endpoint =
        fileType === "image"
          ? "https://snakedetectionapi-production.up.railway.app//predict-image"
          : "https://snakedetectionapi-production.up.railway.app//predict-video";

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef2ef] relative">

      {/* 🌿 Background */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 🔝 Navbar */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-xl shadow-sm z-50">
        <div className="flex justify-between items-center px-8 h-16">
          <h1 className="text-xl font-bold text-green-900">
            🐍 Ophidia Field Lab
          </h1>

          <nav className="hidden md:flex gap-8 text-gray-600 font-medium">
            <span className="text-green-900 border-b-2 border-green-900">
              Analyze
            </span>
            <span className="hover:text-green-700 cursor-pointer">
              Journal
            </span>
            <span className="hover:text-green-700 cursor-pointer">
              Encyclopedia
            </span>
          </nav>
        </div>
      </header>

      {/* 📦 Main */}
      <main className="pt-24 px-6 max-w-7xl mx-auto">

        {/* 🧠 Hero */}
        <div className="mb-10">
          <h1 className="text-6xl font-bold text-green-900 mb-4">
            Snake Classifier
          </h1>
          <p className="text-gray-600 max-w-xl text-lg">
            Utilize high-precision computer vision to identify serpentine species
            from field footage. Upload your visual data for immediate scientific classification.
          </p>
        </div>

        {/* 🧱 Grid */}
        <div className="grid lg:grid-cols-12 gap-8">

          {/* LEFT - Upload */}
          <div className="lg:col-span-7 bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow">

            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer hover:border-green-600 transition">
              
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFile}
                className="hidden"
              />

              <div className="bg-green-100 p-4 rounded-xl mb-4">
                📷
              </div>

              <h3 className="text-xl font-semibold text-green-900">
                Upload Image / Video
              </h3>

              <p className="text-gray-500 mt-2">
                Drag & Drop Snake Image or Video or click to browse
              </p>

              <div className="flex gap-2 mt-4 text-xs">
                <span className="bg-gray-200 px-3 py-1 rounded-full">JPG</span>
                <span className="bg-gray-200 px-3 py-1 rounded-full">PNG</span>
                <span className="bg-gray-200 px-3 py-1 rounded-full">MP4</span>
                <span className="bg-gray-200 px-3 py-1 rounded-full">MAX 50MB</span>
              </div>
            </label>

            {/* Preview */}
            {preview && fileType === "image" && (
              <img
                src={preview}
                className="mt-6 rounded-xl w-full"
              />
            )}

            {preview && fileType === "video" && (
              <video
                src={preview}
                controls
                className="mt-6 rounded-xl w-full"
              />
            )}

            {/* Footer */}
            <div className="flex justify-between items-center mt-6">
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase">
                  Processing Engine
                </p>
                <p className="text-xs text-gray-500">
                  Neural-Alpha v4.2 Deployment
                </p>
              </div>

              <button
                onClick={handleUpload}
                className="bg-green-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-900 transition"
              >
                {loading ? "Processing..." : "Predict"}
              </button>
            </div>
          </div>

          {/* RIGHT - Result */}
          <div className="lg:col-span-5 space-y-6">

            {result ? (
              <div className="bg-white rounded-3xl shadow overflow-hidden">

                <div className="relative h-56">
                  {preview && fileType === "image" && (
              <img
                src={preview}
                className="w-full h-full object-cover"
              />
            )}

            {preview && fileType === "video" && (
              <video
                src={preview}
                controls
                className="w-full h-full object-cover"
              />
            )}
                  

                  <div className="absolute top-3 right-3 bg-green-800 text-white text-xs px-3 py-1 rounded-full">
                    {(result.confidence * 100).toFixed(1)}% Confidence
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-xs uppercase text-gray-500 mb-1">
                    Top Prediction
                  </p>

                  <h2 className="text-3xl font-bold text-green-900">
                    {result.prediction}
                  </h2>

                  <p className="text-gray-500 italic">
                    Scientific Name
                  </p>

                  <p className="text-gray-600 mt-3 text-sm">
                    AI-generated classification based on visual patterns.
                  </p>

                  <div className="flex gap-2 mt-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                      Venomous
                    </span>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
                      Vulnerable
                    </span>
                    <span className="bg-gray-200 px-3 py-1 rounded-full text-xs">
                      Diurnal
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/60 border border-dashed rounded-3xl p-8 text-center">
                <p className="text-gray-500">
                  Waiting for upload...
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  REAL-TIME CLASSIFICATION READY
                </p>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;