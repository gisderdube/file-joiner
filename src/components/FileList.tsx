import classNames from "classnames"
import { useState } from "react"

type FileListProps = {
  files: File[]
  onRemoveFile: (index: number) => void
  onReorderFiles: (newOrder: File[]) => void
  className?: string
}

const FileList = ({ files, onRemoveFile, onReorderFiles, className }: FileListProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newFiles = [...files]
    const draggedFile = newFiles[draggedIndex]

    // Remove the dragged file
    newFiles.splice(draggedIndex, 1)
    // Insert it at the new position
    newFiles.splice(index, 0, draggedFile)

    onReorderFiles(newFiles)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  if (files.length === 0) {
    return null
  }

  return (
    <div className={classNames("mt-8", className)}>
      <h3 className='text-lg font-semibold mb-2'>Files to join ({files.length})</h3>
      <p className='text-sm text-slate-500 dark:text-slate-400 mb-3'>
        Drag and drop to reorder files. They will be joined in the order shown below.
      </p>
      <ul className='space-y-3'>
        {files.map((file, index) => (
          <li
            key={`${file.name}-${index}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={classNames(
              "flex items-center justify-between p-4 rounded-xl backdrop-blur-sm border shadow-sm transition-all duration-200 cursor-move",
              {
                "bg-blue-100/70 border-blue-200 shadow-blue-100/50 scale-[1.02]": draggedIndex === index,
                "glass-panel hover:shadow-md hover:scale-[1.01]": draggedIndex !== index,
              }
            )}
          >
            <div className='flex items-center'>
              <span className='flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-medium mr-3'>
                {index + 1}
              </span>
              <span className='truncate max-w-[200px] sm:max-w-[300px] font-medium'>{file.name}</span>
              <span className='ml-2 text-xs text-slate-400 dark:text-slate-500'>
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <button
              onClick={() => onRemoveFile(index)}
              className='text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 p-1.5 rounded-full hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors'
              aria-label='Remove file'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FileList
