'use client'

interface FileUpload {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileUpload( { onChange }  : FileUpload) {
  return (
    <input
      type="file"
      onChange={onChange}
      className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
    />
  );
};
