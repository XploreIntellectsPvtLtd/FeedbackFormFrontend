import React from 'react'
import logo from "../../Asserts/Image/logo.png"
import xploretext from "../../Asserts/Image/xploretext.png"
import QuizSideBar from './QuizSideBar'
import StudentQuiz from './StudentQuiz'

const StudentQuizIndex = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex items-center justify-between gap-3 p-4 sm:p-6 md:p-8 z-10">
                <div className="flex items-center gap-3">
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-8 sm:h-10 md:h-12 w-auto"
                    />
                    <h1 className='font-bankgothic text-center'>XPLORE IT CORP <br/>
                    <span className='font-astron_boy capitalize'>design your desire</span>
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[20%_80%] lg:grid-cols-[27%_73%] md:grid-cols-[35%_75%]  ">
                <div className="">
                    <QuizSideBar/>
                </div>
                <div className="">
                    <StudentQuiz/>
                </div>
            </div>
        </div>
    )
}

export default StudentQuizIndex
