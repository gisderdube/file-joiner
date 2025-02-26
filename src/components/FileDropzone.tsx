import classNames from "classnames"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

type FileDropzoneProps = {
  onFilesAdded: (files: File[]) => void
  acceptedFileTypes?: string[]
  maxFiles?: number
  className?: string
}

const FileDropzone = ({
  onFilesAdded,
  acceptedFileTypes = [
    ".txt",
    ".md",
    ".markdown",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".json",
    ".html",
    ".htm",
    ".css",
    ".scss",
    ".less",
    ".xml",
    ".csv",
    ".yml",
    ".yaml",
    ".ini",
    ".cfg",
    ".conf",
    ".log",
    ".sh",
    ".bat",
    ".ps1",
  ],
  maxFiles = 100,
  className,
}: FileDropzoneProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAdded(acceptedFiles)
    },
    [onFilesAdded]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    maxFiles,
  })

  return (
    <div
      {...getRootProps()}
      className={classNames(
        "backdrop-blur-md rounded-xl p-8 text-center cursor-pointer transition-all duration-300 border shadow-lg",
        {
          "bg-blue-100/70 border-blue-200 shadow-blue-100/50": isDragActive,
          "glass-panel hover:shadow-xl hover:scale-[1.01]": !isDragActive,
        },
        className
      )}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className='text-blue-600 dark:text-blue-400 font-medium'>Drop the files here...</p>
      ) : (
        <div>
          <div className='mb-4 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-blue-100/50 dark:bg-blue-900/20'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-8 w-8 text-blue-500 dark:text-blue-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            </svg>
          </div>
          <p className='mb-2 font-medium'>Drag and drop text files here, or click to select files</p>
          <p className='text-sm text-slate-500 dark:text-slate-400'>
            Supports various text files: code, markup, config, and more
          </p>
        </div>
      )}
    </div>
  )
}

export default FileDropzone
