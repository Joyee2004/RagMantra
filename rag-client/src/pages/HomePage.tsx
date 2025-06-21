import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import GradientText from '@/components/ui/GradientText';
import { Vortex } from '@/components/ui/vortex';

const HomePage = () => {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white px-60">
                <Vortex>
                <motion.div
                    initial={{ opacity: 0.0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    className="relative flex flex-col gap-4 items-center justify-center px-4"
                >
                    <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
                        Welcome to <GradientText>RagMantra</GradientText>
                    </div>
                    <div className="font-extralight text-base md:text-2xl dark:text-neutral-200 py-4  text-center">
                        Upload a PDF, ask questions about its content, and get instant AI-powered answers using custom models.
                    </div>
                    <button onClick={() => navigate('/chat')} className="cursor-pointer shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-24  py-2 bg-gradient-to-r from-orange-400 from-10% via-pink-500 via-30% to-purple-500 to-90% rounded-[20px] text-white transition duration-200 ease-linear border-1 border-white font-bold">
                        Get Started
                    </button>

                </motion.div>
        </Vortex>
            </div>
    );
}

export default HomePage;