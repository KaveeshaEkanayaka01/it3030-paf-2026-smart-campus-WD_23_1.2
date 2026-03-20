import { Upload } from 'lucide-react';

export const AttachmentUpload = ({ files, setFiles }) => {
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const imageFiles = selectedFiles.filter((file) => file.type.startsWith('image/'));

    const merged = [...files, ...imageFiles];
    const deduped = merged.filter(
      (file, index, list) =>
        index === list.findIndex((f) => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified),
    );

    setFiles(deduped.slice(0, 3));
    event.target.value = '';
  };

  const removeFile = (targetFile) => {
    setFiles(files.filter((file) => file !== targetFile));
  };

  const clearFiles = () => {
    setFiles([]);
  };

  return (
    <div className="border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center border border-zinc-300 bg-white">
        <Upload size={18} className="text-zinc-500" />
      </div>

      <label className="mx-auto inline-block cursor-pointer border border-black bg-black px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-zinc-800">
        Add Images
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={files.length >= 3}
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      <p className="mt-3 text-xs text-zinc-500">Only image files are allowed. Maximum 3 files. ({files.length}/3 selected)</p>

      {files?.length > 0 && (
        <div className="mt-4 space-y-2 text-left">
          {files.map((file) => {
            const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
            return (
              <div key={fileKey} className="flex items-center justify-between gap-2 border border-zinc-200 bg-white px-2 py-1">
                <p className="truncate text-xs font-semibold text-zinc-700">{file.name}</p>
                <button
                  type="button"
                  onClick={() => removeFile(file)}
                  className="text-[10px] font-bold uppercase tracking-wider text-red-600"
                >
                  Remove
                </button>
              </div>
            );
          })}
          <button
            type="button"
            onClick={clearFiles}
            className="mt-2 text-[10px] font-bold uppercase tracking-wider text-zinc-600"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};
