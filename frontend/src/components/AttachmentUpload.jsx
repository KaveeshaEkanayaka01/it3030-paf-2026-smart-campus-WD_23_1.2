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
    <div className="glass-panel rounded-2xl border-dashed border-white/20 p-8 text-center transition-all hover:glass-panel-strong">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 ring-4 ring-indigo-500/10">
        <Upload size={24} />
      </div>

      <label className="mx-auto inline-flex cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 text-xs font-semibold tracking-wide text-white transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95">
        Browse Images
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={files.length >= 3}
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      <p className="mt-4 text-xs font-medium text-slate-400">Only image files are allowed. Maximum 3 files. ({files.length}/3 selected)</p>

      {files?.length > 0 && (
        <div className="mt-6 space-y-3 text-left">
          {files.map((file) => {
            const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
            return (
              <div key={fileKey} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="truncate text-sm font-medium text-slate-200">{file.name}</p>
                <button
                  type="button"
                  onClick={() => removeFile(file)}
                  className="text-[10px] font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 transition-colors px-2 py-1 bg-rose-500/10 rounded-lg"
                >
                  Remove
                </button>
              </div>
            );
          })}
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={clearFiles}
              className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
