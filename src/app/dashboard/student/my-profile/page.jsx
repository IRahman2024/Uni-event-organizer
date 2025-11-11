'use client'
import Loading from '@/app/loading';
import BlurText from '@/components/Blur-text/BlurText';
import ProfileCard from '@/components/Profile/ProfileCard';
import UpdateProfile from '@/components/Profile/UpdateProfile';
import LetterGlitch from '@/shadcn-components/LetterGlitch';
import { useUser } from '@stackframe/stack';
import axios from 'axios';
import { SnackbarProvider } from 'notistack';
import React, { useEffect, useState } from 'react';

const page = () => {
    const [student, setStudent] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(false);

    const user = useUser();

    console.log(student);

    useEffect(() => {
        setIsLoading(true);
        // axios.get(`/api/students/${user.primaryEmail}`)
        axios.get(`/api/students/${user.primaryEmail}`)
            .then((res) => {
                setStudent(res.data.data)
                if (!res.data.data) {
                    setStatus(true);
                }
            })
            .finally(() => setIsLoading(false));
    }, [])


    if (isLoading) {
        return <div className='flex items-center justify-center max-h-screen'>
            <Loading text={'Loading student data...'}></Loading>
        </div>
    }

    return (
        <div className="relative min-h-screen w-full">
            {/* animated background */}
            <div className="fixed inset-0 z-0 h-screen w-screen">
                <LetterGlitch glitchSpeed={20}
                    outerVignette={false}
                    centerVignette={false} />

                <div className="absolute inset-0 bg-white/50 dark:bg-black/50 pointer-events-none" />
            </div>

            {/* page content */}
            <div className="relative z-0 flex flex-col items-center pt-12">
                {
                    student ? <BlurText
                        text={`Welcome back ${student.name}`}
                        delay={160}
                        animateBy="words"
                        direction="top"
                        className="text-4xl mb-8 text-white"
                    /> : <BlurText
                        text={`Welcome`}
                        delay={160}
                        animateBy="letters"
                        direction="top"
                        className="text-4xl mb-8 text-white"
                    />
                }
            </div>

            <div className='flex flex-col items-center lg:flex-row gap-8 p-4'>
                {
                    student && <section className="w-full lg:w-1/2">
                        <ProfileCard student={student} />
                    </section>
                }
                <section className="w-full bg-background z-10 p-5 rounded-2xl lg:w-1/2">
                    <UpdateProfile status={status}></UpdateProfile>
                </section>
                {
                    !student && <section className='relative z-10 bg-black rounded-2xl p-5'>
                        <p className="-z-10 text-3xl font-bold text-red-500">You need to update profile <br /> to access events</p>
                    </section>
                }
            </div>
        </div>
    );
};

export default page;