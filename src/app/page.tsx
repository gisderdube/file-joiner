"use client"

import FileDropzone from "@/components/FileDropzone"
import FileList from "@/components/FileList"
import dayjs from "dayjs"
import { useState } from "react"

export default function Home() {
  const [files, setFiles] = useState<File[]>([])
  const [joinedContent, setJoinedContent] = useState<string | null>(null)
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [outputFormat, setOutputFormat] = useState<string>("txt")

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles])
    setJoinedContent(null)
    setError(null)
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    setJoinedContent(null)
    setError(null)
  }

  const handleReorderFiles = (newOrder: File[]) => {
    setFiles(newOrder)
    setJoinedContent(null)
    setError(null)
  }

  const handleJoinFiles = async () => {
    if (files.length === 0) {
      setError("Please add at least one file to join.")
      return
    }

    setIsJoining(true)
    setError(null)

    try {
      const contents: string[] = []

      for (const file of files) {
        const content = await readFileAsText(file)
        contents.push(content)
      }

      const joined = contents.join("\n\n")
      setJoinedContent(joined)

      // Try to determine the best output format based on the first file
      if (files.length > 0) {
        const firstFileExt = getFileExtension(files[0].name)
        if (firstFileExt) {
          setOutputFormat(firstFileExt)
        }
      }
    } catch (err) {
      setError("Error reading files. Make sure all files are valid text files.")
      console.error(err)
    } finally {
      setIsJoining(false)
    }
  }

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  const getFileExtension = (filename: string): string => {
    const parts = filename.split(".")
    return parts.length > 1 ? parts.pop()?.toLowerCase() || "txt" : "txt"
  }

  const handleDownload = () => {
    if (!joinedContent) return

    const blob = new Blob([joinedContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `joined-files-${dayjs().format("YYYY-MM-DD-HH-mm-ss")}.${outputFormat}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClearAll = () => {
    setFiles([])
    setJoinedContent(null)
    setError(null)
  }

  const handleOutputFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOutputFormat(e.target.value)
  }

  return (
    <div className='min-h-screen p-4 sm:p-6 md:p-8 max-w-5xl mx-auto'>
      <header className='mb-10 text-center'>
        <h1 className='text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
          File Joiner
        </h1>
        <p className='text-slate-600 dark:text-slate-400 text-lg'>
          Upload multiple text files and join them into one
        </p>
      </header>

      <main className='space-y-10'>
        <section className='glass-panel rounded-2xl p-6 sm:p-8'>
          <FileDropzone onFilesAdded={handleFilesAdded} />
          <FileList files={files} onRemoveFile={handleRemoveFile} onReorderFiles={handleReorderFiles} />

          {error && (
            <div className='mt-4 p-4 bg-red-100/80 backdrop-blur-sm text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800/50'>
              {error}
            </div>
          )}

          <div className='mt-8 flex flex-wrap gap-3'>
            <button
              onClick={handleJoinFiles}
              disabled={files.length === 0 || isJoining}
              className='px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200'
            >
              {isJoining ? "Joining..." : "Join Files"}
            </button>

            {files.length > 0 && (
              <button
                onClick={handleClearAll}
                className='glass-button px-5 py-2.5 rounded-xl font-medium'
              >
                Clear All
              </button>
            )}
          </div>
        </section>

        {joinedContent && (
          <section className='glass-panel rounded-2xl p-6 sm:p-8'>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6'>
              <h2 className='text-xl font-semibold'>Joined Content</h2>
              <div className='flex flex-wrap items-center gap-3'>
                <div className='flex items-center'>
                  <label htmlFor='outputFormat' className='mr-2 text-sm font-medium'>
                    Format:
                  </label>
                  <select
                    id='outputFormat'
                    value={outputFormat}
                    onChange={handleOutputFormatChange}
                    className='px-3 py-1.5 rounded-lg glass-button text-sm'
                  >
                    <option value='txt'>txt</option>
                    <option value='js'>js</option>
                    <option value='jsx'>jsx</option>
                    <option value='ts'>ts</option>
                    <option value='tsx'>tsx</option>
                    <option value='json'>json</option>
                    <option value='html'>html</option>
                    <option value='css'>css</option>
                    <option value='md'>md</option>
                  </select>
                </div>
                <button
                  onClick={handleDownload}
                  className='px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all duration-200'
                >
                  Download
                </button>
              </div>
            </div>
            <div className='backdrop-blur-sm bg-slate-50/70 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-auto max-h-[400px] shadow-inner'>
              <pre className='whitespace-pre-wrap break-words text-sm font-mono'>{joinedContent}</pre>
            </div>
          </section>
        )}
      </main>

      <footer className='mt-16 text-center text-sm text-slate-500 dark:text-slate-400 pb-8'>
        <p>File Joiner - Join your text files client-side</p>
      </footer>
    </div>
  )
}
