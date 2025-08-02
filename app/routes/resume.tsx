import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { usePuterStore } from "~/lib/puter"

export const meta = () => ([
  { title: "Resumind | Resume" },
  { name: 'description', content: 'Detailed Overview pf your resume' }
])

const resume = () => {

    const { id } = useParams()
    const { auth, isLoading, ai, kv, fs } = usePuterStore();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`)
            if(!resume) return;
            const data = JSON.parse(resume)
            
            // reading the data from the pdf using blob
            const resumeBlob = await fs.read(data.resume)
            if(!resumeBlob) return;

            const pdfBlob = new Blob([ resumeBlob ], { type: 'application/pdf' })
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl)
            
            const imageBlob = await fs.read(data.resume)
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setResumeUrl(imageUrl)
            
            setFeedback(data.feedback)
        } 
// 1:49:00
        loadResume()
    }, [id])

  return (
    <main className="!pt-0">
        <nav className="resume-nav">
            <Link to='/' className="back-button">
                <img src="/icons/back.svg" className="w-2.5 h-2.5" alt="back link" />
                <span className="text-gray-800 text-sm font-semibold">Back to HomePage</span>
            </Link>
        </nav>
        <div className="flex flex-row w-full max-lg:flex-col-reverse">
            <section className="feedback-section">
                { imageUrl && resumeUrl && (
                    <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit"></div>
                )}
            </section>
        </div>
    </main>
  )
}

export default resume