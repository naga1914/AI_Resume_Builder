import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ResumePreview from '../components/ResumePreview'
import { ArrowLeftIcon } from 'lucide-react'
import { dummyResumeData } from '../assets/assets'
import Loader from '../components/Loader'

const Preview = () => {
  const { resumeId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [resumeData, setResumeData] = useState(null)

  const loadResume = () => {
    setResumeData(
      dummyResumeData.find(
        resume => String(resume._id) === String(resumeId)
      ) || null
    )
    setIsLoading(false)
  }

  useEffect(() => {
    loadResume()
  }, [])

  return resumeData ? (
    <div className='bg-slate-100 min-h-screen'>
      <div className='max-w-3xl mx-auto py-10'>
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accent_color}
          classes='py-4 bg-white'
        />
      </div>
    </div>
  ) : (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className='flex flex-col items-center justify-center h-screen'>
          <p className='text-center text-xl text-slate-400 font-medium'>
            Resume not found
          </p>

          <a
            href="/"
            className='mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 flex items-center transition-colors'
          >
            <ArrowLeftIcon className='mr-2 size-4' />
            Go to home page
          </a>
        </div>
      )}
    </div>
  )
}

export default Preview
