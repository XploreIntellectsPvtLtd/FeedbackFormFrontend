import React from 'react';
import { FaFacebookF, FaYoutube, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const StudentFooter = () => {
    return (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4">
            <div className="container mx-auto flex justify-between items-center">
                <p className="text-sm">© 2024 XploreIT Corp. All rights reserved.</p>
                <div className="flex space-x-4 justify-center">
                    <a 
                        href="https://www.facebook.com/xploreitcorp/" 
                        className="text-white hover:text-gray-300"
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <FaFacebookF />
                    </a>
                    <a 
                        href="https://www.youtube.com/channel/UCNJ3ksuUFYspWgFewet_6wQ" 
                        className="text-white hover:text-gray-300"
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <FaYoutube />
                    </a>
                    <a 
                        href="https://twitter.com/xiccbe" 
                        className="text-white hover:text-gray-300"
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <FaTwitter />
                    </a>
                    <a 
                        href="https://in.linkedin.com/company/xic-ltd" 
                        className="text-white hover:text-gray-300"
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <FaLinkedinIn />
                    </a>
                    <a 
                        href="https://www.instagram.com/xploreitcorp/" 
                        className="text-white hover:text-gray-300"
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <FaInstagram />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default StudentFooter;
