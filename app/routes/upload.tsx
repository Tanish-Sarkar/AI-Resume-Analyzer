import React, { useState, type FormEvent } from 'react'
import FileUploader from '~/components/FileUploader';
import Navbar from '~/components/Navbar'

const upload = () => {

    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

    }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section py-14">
        <div className="page-heading py-14">
            <h1>Smart Feedback For Your Dream job</h1>
            {isProcessing ? (
                <>
                    <h2>{statusText}</h2>
                    <img src="/images/resume-scan.gif" className='w-full' alt="gif" />
                </>
            ) : (
                <h2>Drop your Resume for an ATS score and improment tips</h2>
            )}

            {!isProcessing && (
                <form id='upload-form' onSubmit={handleSubmit} className='flex flex-col gap-4 m-5'>
                    <div className='form-div'>
                        <label htmlFor="company-name">Company Name</label>
                        <input type="text" placeholder='Company name' id='company-name' name='company-name'/>
                    </div>
                    <div className='form-div'>
                        <label htmlFor="job-title">Job Title</label>
                        <input type="text" placeholder='Job Title' id='job-title' name='job-title'/>
                    </div>
                    <div className='form-div'>
                        <label htmlFor="job-descriptoin">Job Description</label>
                        <textarea rows={5} placeholder='Job Description' id='job-descriptoin' name='job-descriptoin'/>
                    </div>
                    <div className='form-div'>
                        <label htmlFor="uploader">Upload Resume</label>
                        <FileUploader />
                    </div>
                    <button className='primary-button' type='submit'>
                        Analysis Resume
                    </button>
                </form>
            )}
        </div>
      </section>
    </main>  
  )
}

export default upload