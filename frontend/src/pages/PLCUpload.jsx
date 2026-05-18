import React, { useState } from 'react';
import { Upload, FileCode, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const PLCUpload = ({ setPlcData, setActiveTab, plcData }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoadSample = async () => {
    setUploading(true);
    setError(null);
    try {
      // For demo purposes, we'll just mock the response or call a special endpoint
      // In a real app, this would fetch a pre-defined sample from the server
      const response = await axios.post('http://localhost:8000/api/upload-plc', {
        sample: true,
        filename: 'sample_logic.st'
      });
      setPlcData(response.data);
    } catch (err) {
      setError('Failed to load sample logic');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/upload-plc', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPlcData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-panel p-8 text-center border-dashed border-2 border-industrial-border hover:border-industrial-cyan transition-all group">
        <input 
          type="file" 
          id="plc-upload" 
          className="hidden" 
          onChange={handleFileChange}
          accept=".st,.l5x,.xml,.exp"
        />
        <label htmlFor="plc-upload" className="cursor-pointer block">
          <div className="w-16 h-16 bg-industrial-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Upload className="text-industrial-cyan" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Upload PLC Program</h3>
          <p className="text-industrial-muted mb-6">
            Drag and drop your PLC files here or click to browse.<br/>
            Supports .L5X, .XML, .EXP, .ST (PLCOpen compatible)
          </p>
        </label>
        
        {file && (
          <div className="flex items-center justify-center space-x-3 mb-6 bg-white/5 p-3 rounded-lg border border-industrial-border">
            <FileCode className="text-industrial-amber" />
            <span className="font-medium">{file.name}</span>
            <span className="text-xs text-industrial-muted">({(file.size / 1024).toFixed(2)} KB)</span>
          </div>
        )}

        <button 
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`px-8 py-3 rounded-lg font-bold flex items-center mx-auto transition-all ${
            !file || uploading 
              ? 'bg-industrial-border text-industrial-muted cursor-not-allowed' 
              : 'bg-industrial-cyan text-industrial-dark hover:shadow-[0_0_20px_rgba(0,242,255,0.4)]'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              ANALYZING LOGIC...
            </>
          ) : (
            'START INTELLIGENCE ANALYSIS'
          )}
        </button>

        {!file && !uploading && (
          <button 
            onClick={handleLoadSample}
            className="mt-4 text-xs font-bold text-industrial-cyan hover:underline uppercase tracking-widest"
          >
            Or load sample industrial logic
          </button>
        )}
      </div>

      {plcData && (
        <div className="glass-panel p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center space-x-3 text-industrial-green mb-4">
            <CheckCircle2 size={24} />
            <h4 className="text-lg font-bold">Analysis Complete</h4>
          </div>
          <div className="bg-black/30 rounded p-4 border border-industrial-border max-h-64 overflow-y-auto custom-scrollbar">
            <pre className="text-xs text-industrial-cyan">
              {JSON.stringify(plcData.analysis, null, 2)}
            </pre>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => setActiveTab('AI Analysis')}
              className="p-3 bg-industrial-cyan/10 border border-industrial-cyan/30 rounded-lg text-xs font-bold hover:bg-industrial-cyan/20 transition-colors"
            >
              VIEW CONTROL NARRATIVE
            </button>
            <button 
              onClick={() => setActiveTab('AI Analysis')}
              className="p-3 bg-industrial-amber/10 border border-industrial-amber/30 rounded-lg text-xs font-bold hover:bg-industrial-amber/20 transition-colors"
            >
              GENERATE SAFETY REPORT
            </button>
            <button 
              onClick={() => setActiveTab('Simulation')}
              className="p-3 bg-white/5 border border-industrial-border rounded-lg text-xs font-bold hover:bg-white/10 transition-colors"
            >
              OPEN SIMULATION
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="glass-panel p-4 border-industrial-red/50 bg-industrial-red/10 flex items-center space-x-3 text-industrial-red">
          <AlertCircle size={20} />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}
    </div>
  );
};

export default PLCUpload;
