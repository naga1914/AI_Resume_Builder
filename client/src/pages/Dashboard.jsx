import React, { useEffect, useState } from 'react'
import { PlusIcon, UploadIcon, FilePenIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import pdfToText from 'react-pdftotext'
import api from '../configs/api'
import toast from 'react-hot-toast'
import Modal from '../components/Model'
import UploadModal from '../components/UploadModal'

const Dashboard = () => {

  const colors = [
    '#FDE2E4',
    '#E0F7FA',
    '#FFF9C4',
    '#E8F5E9',
    '#F3E5F5',
  ]

  const { user, token } = useSelector(state => state.auth)

  const [allResumes, setAllResumes] = useState([])
  const [showUpload, setShowUpload] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    loadAllResumes()
  }, [])

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get('/api/resumes', {
        headers: { Authorization: token }
      })
      setAllResumes(data.resumes)
    } catch (error) {
      toast.error("Failed to load resumes")
    }
  }

  const createResume = async (event) => {
    event.preventDefault()
    try {
      const { data } = await api.post(
        '/api/resumes/create',
        { title },
        { headers: { Authorization: token } }
      )

      setAllResumes([...allResumes, data.resume])
      setTitle('')
      setShowCreate(false)

      navigate(`/app/builder/${data.resume._id}`)

    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const uploadResume = async (event) => {
    event.preventDefault()

    if (!resume) {
      toast.error("Please select a PDF")
      return
    }

    try {
      setIsLoading(true)

      const resumeText = await pdfToText(resume)

      const { data } = await api.post(
  `/api/ai/upload-resume`,
  { title, resumeText },
  { headers: { Authorization: token } }
)
      loadAllResumes()
      setShowUpload(false)
      setTitle('')
      setResume(null)

        navigate(`/app/builder/${data.resumeId}`)

    } catch (error) {
      toast.error("Upload failed")
    } finally {
      setIsLoading(false)
    }
  }

  const editTitle = async (event) => {
    event.preventDefault()

    try {
      await api.put(
        `/api/resumes/${editResumeId}`,
        { title },
        { headers: { Authorization: token } }
      )

      setAllResumes(prev =>
        prev.map(r =>
          r._id === editResumeId
            ? { ...r, title }
            : r
        )
      )

      setEditResumeId(null)
      setTitle("")
      toast.success("Title updated")

    } catch (error) {
      toast.error("Update failed")
    }
  }

  const deleteResume = async (resumeId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this resume?'
    )

    if (!confirmDelete) return

    try {
      await api.delete(`/api/resumes/${resumeId}`, {
        headers: { Authorization: token }
      })

      setAllResumes(prev =>
        prev.filter(resume => resume._id !== resumeId)
      )
    } catch (error) {
      toast.error("Delete failed")
    }
  }

  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-8'>

        <p className='text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden'>
          Welcome, {user?.username}
        </p>

        {/* Create + Upload Buttons */}
        <div className='flex gap-4'>
          <button
            onClick={() => setShowCreate(true)}
            className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 hover:border-indigo-500 hover:shadow-lg transition-all'
          >
            <PlusIcon className='size-11 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full' />
            <p>Create Resume</p>
          </button>

          <button
            onClick={() => setShowUpload(true)}
            className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 hover:border-indigo-500 hover:shadow-lg transition-all'
          >
            <UploadIcon className='size-11 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full' />
            <p>Upload Existing</p>
          </button>
        </div>

        <hr className='border-slate-300 my-6 sm:w-[305px]' />

        {/* Resume Cards */}
        <div className='grid grid-cols-2 sm:flex flex-wrap gap-4'>
          {allResumes.map((resume, index) => {

            const baseColor = colors[index % colors.length]

            return (
              <button
                key={resume._id}
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                className='group relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border hover:shadow-lg transition-all'
                style={{
                  background: `linear-gradient(135deg, ${baseColor} 10%, ${baseColor} 40%)`,
                  borderColor: baseColor + '40',
                }}
              >

                <FilePenIcon className='size-7 text-slate-700' />

                <p className='text-sm px-2 text-center text-slate-700 font-medium'>
                  {resume.title}
                </p>

                <p className='absolute bottom-1 text-[11px] px-2 text-center text-slate-600'>
                  updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>

                <div
                  onClick={(e) => e.stopPropagation()}
                  className='absolute top-1 right-1 flex items-center gap-1'>

                  <TrashIcon
                    onClick={() => deleteResume(resume._id)}
                    className='size-7 p-1.5 text-slate-700 hover:bg-white/70 rounded'
                  />

                  <PencilIcon
                    onClick={() => {
                      setEditResumeId(resume._id)
                      setTitle(resume.title)
                    }}
                    className='size-7 p-1.5 text-slate-700 hover:bg-white/70 rounded'
                  />
                </div>

              </button>
            )
          })}
        </div>

        {/* Modals */}
        {showCreate && (
          <Modal
            title="Create Resume"
            onClose={() => setShowCreate(false)}
            onSubmit={createResume}
            value={title}
            setValue={setTitle}
          />
        )}

        {showUpload && (
          <UploadModal
            titleValue={title}
            setTitle={setTitle}
            setResume={setResume}
            onClose={() => setShowUpload(false)}
            onSubmit={uploadResume}
            isLoading={isLoading}
          />
        )}

        {editResumeId && (
          <Modal
            title="Edit Resume Title"
            onClose={() => setEditResumeId(null)}
            onSubmit={editTitle}
            value={title}
            setValue={setTitle}
          />
        )}

      </div>
    </div>
  )
}

export default Dashboard