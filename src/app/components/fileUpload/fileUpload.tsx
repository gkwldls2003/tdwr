'use client';

import { useState } from 'react';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if(!data.success) {
        alert(data.message);
        return;
      }

      if (!response.ok) throw new Error(data.error);

      
      setUploadedFileUrl(data.fileUrl);
      alert('파일 업로드 성공!');
    } catch (error) {
      console.error('Upload error:', error);
      alert(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />
        </div>
        
        <button
          type="submit"
          disabled={!file || uploading}
          className="px-4 py-2 bg-blue-500 text-white rounded
            hover:bg-blue-600 disabled:bg-gray-400"
        >
          {uploading ? '업로드 중...' : '업로드'}
        </button>

        {uploadedFileUrl && (
          <div className="mt-4">
            <p>업로드된 파일:</p>
            <a 
              href={uploadedFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {uploadedFileUrl}
            </a>
          </div>
        )}
      </form>
    </div>
  );
}