'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle, AlertCircle, Image, Film, Music } from 'lucide-react';
import { mediaAPI } from '@/lib/api';

interface UploadResult {
  url: string;
  mediaType: string;
  id: string;
}

interface MediaUploaderProps {
  projectId?: string;
  accept?: 'image' | 'video' | 'audio' | 'all';
  onUpload?: (result: UploadResult) => void;
  maxFiles?: number;
  label?: string;
}

interface FileState {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  url?: string;
  error?: string;
  preview?: string;
}

const acceptMap = {
  image: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
  video: { 'video/*': ['.mp4', '.mov', '.webm'] },
  audio: { 'audio/*': ['.mp3', '.wav', '.ogg', '.aac'] },
  all: {
    'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
    'video/*': ['.mp4', '.mov', '.webm'],
    'audio/*': ['.mp3', '.wav', '.ogg'],
  },
};

const MediaIcon = ({ type }: { type: string }) => {
  if (type.startsWith('image')) return <Image size={20} />;
  if (type.startsWith('video')) return <Film size={20} />;
  return <Music size={20} />;
};

export default function MediaUploader({
  projectId,
  accept = 'all',
  onUpload,
  maxFiles = 10,
  label = 'Drop files here or click to upload',
}: MediaUploaderProps) {
  const [files, setFiles] = useState<FileState[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: FileState[] = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending',
      preview: file.type.startsWith('image') ? URL.createObjectURL(file) : undefined,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Upload each file
    for (let i = 0; i < newFiles.length; i++) {
      const fileState = newFiles[i];
      const globalIndex = files.length + i;

      setFiles(prev => prev.map((f, idx) =>
        idx === globalIndex ? { ...f, status: 'uploading' } : f
      ));

      try {
        const { data } = await mediaAPI.upload(
          fileState.file,
          projectId,
          (progress) => {
            setFiles(prev => prev.map((f, idx) =>
              idx === globalIndex ? { ...f, progress } : f
            ));
          }
        );

        setFiles(prev => prev.map((f, idx) =>
          idx === globalIndex ? { ...f, status: 'done', url: data.url, progress: 100 } : f
        ));

        onUpload?.({
          url: data.url,
          mediaType: data.media.mediaType,
          id: data.media.id,
        });
      } catch (error: any) {
        setFiles(prev => prev.map((f, idx) =>
          idx === globalIndex ? {
            ...f, status: 'error',
            error: error.response?.data?.error || 'Upload failed',
          } : f
        ));
      }
    }
  }, [files.length, projectId, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptMap[accept],
    maxFiles,
    maxSize: 100 * 1024 * 1024,
  });

  const removeFile = (index: number) => {
    setFiles(prev => {
      const updated = [...prev];
      if (updated[index].preview) URL.revokeObjectURL(updated[index].preview!);
      updated.splice(index, 1);
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-rose-blush/60 bg-rose-blush/5'
            : 'border-white/10 hover:border-white/20 hover:bg-white/3'
        }`}
      >
        <input {...getInputProps()} />

        <motion.div
          animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
            isDragActive ? 'bg-rose-blush/20' : 'bg-white/5'
          }`}>
            <Upload size={24} className={isDragActive ? 'text-rose-blush' : 'text-rose-cream/40'} />
          </div>
          <div>
            <p className="text-rose-cream font-sans">{label}</p>
            <p className="text-rose-cream/30 text-sm font-sans mt-1">
              Max 100MB per file · Images, videos, audio
            </p>
          </div>
        </motion.div>
      </div>

      {/* File list */}
      <AnimatePresence>
        {files.map((fileState, i) => (
          <motion.div
            key={`${fileState.file.name}-${i}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-4 flex items-center gap-4"
          >
            {/* Preview */}
            {fileState.preview ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img src={fileState.preview} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-rose-cream/40">
                <MediaIcon type={fileState.file.type} />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-rose-cream text-sm font-sans truncate">{fileState.file.name}</p>
              <p className="text-rose-cream/30 text-xs font-sans">
                {(fileState.file.size / 1024 / 1024).toFixed(1)} MB
              </p>

              {/* Progress bar */}
              {fileState.status === 'uploading' && (
                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${fileState.progress}%` }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #e8c4b8, #c4a882)' }}
                  />
                </div>
              )}

              {fileState.status === 'error' && (
                <p className="text-red-400 text-xs font-sans mt-1">{fileState.error}</p>
              )}
            </div>

            {/* Status icon */}
            <div className="flex-shrink-0">
              {fileState.status === 'done' && (
                <CheckCircle size={18} className="text-green-400" />
              )}
              {fileState.status === 'error' && (
                <AlertCircle size={18} className="text-red-400" />
              )}
              {fileState.status === 'uploading' && (
                <div className="w-4 h-4 border-2 border-rose-blush/50 border-t-rose-blush rounded-full animate-spin" />
              )}
            </div>

            {/* Remove */}
            <button
              onClick={() => removeFile(i)}
              className="text-rose-cream/20 hover:text-rose-cream/60 transition-colors flex-shrink-0"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
