import React, { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router';
import FileUploader from '~/components/FileUploader';
import Navbar from '~/components/Navbar'
import { convertPdfToImage } from '~/lib/pdf2img';
import { usePuterStore } from '~/lib/puter';
import { generateUUID } from '~/lib/utils';

const upload = () => {
    
    const { auth, fs, kv, ai, isLoading } = usePuterStore();
    const navigate = useNavigate()
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file } : {companyName: string, jobTitle: string, jobDescription: string, file: File})  => {
        setIsProcessing(true);
        setStatusText("Uploading File...")
        const uploadedFile = await fs.upload([file])
        if(!uploadedFile) return setStatusText("Error: can't able to upload file");

        setStatusText("Converting to Image")
        const imageFile = await convertPdfToImage(file);
        if(!imageFile || !imageFile.file) return setStatusText("Failed to convert Pdf to Image"); 

        setStatusText("Uploading the image");
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText("Error: can't able to upload image");

        setStatusText("Preparing File...")
        const uuid = generateUUID()

        const data = {
            id: uuid,
            resumepath: uploadedFile.path,
            imagepath: uploadedImage.path,
            jobDescription, jobTitle, companyName,
            feedback: '',
        }

        await kv.set(`$resume {uuid}`, value: JSON.stringify(data))
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formdata = new FormData(form);

        const companyName = formdata.get('company-name') as string
        const jobTitle = formdata.get('job-title') as string
        const jobDescription = formdata.get('job-description') as string


        if (!file) return;
        handleAnalyze({ companyName, jobTitle, jobDescription, file})
        
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
                        <FileUploader onFileSelect={handleFileSelect} />
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