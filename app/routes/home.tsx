import Navbar from "../components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "../components/ResumeCard";
import { resumes } from "../../constants/index";
import { usePuterStore } from "../lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [ 
    { title: "Resumind" },
    { name: "description", content: "Get yourself a stepping bonus!" },
  ];
}

export default function Home() {
  const { auth } = usePuterStore();
  const navigate = useNavigate()

  useEffect(() => {
    if(!auth.isAuthenticated){
      navigate('./auth?next=/')
    }
  }, [auth.isAuthenticated])

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section py-16">
        <div className="page-heading">
          <h1>Track your Application & Resume Rating</h1>
          <h2>Review your submissions and ckeck AI-powered feedbacks</h2>
        </div>

        {resumes.length > 0 && (
            <div className="resumes-section">
              {resumes.map((resume)=>(
                <ResumeCard key={resume.id} resume={resume} /> 
              ))}
            </div>
          )
        }
        
      </section>
  </main>
}
