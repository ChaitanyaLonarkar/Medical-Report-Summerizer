import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../sections/Hero';
import Features from '../sections/Features';
import HowItWorks from '../sections/HowItWorks';
import FAQ from '../sections/FAQ';
import ToolsGrid from '../sections/ToolsGrid';

const Home = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <Hero />
                <Features />
                <HowItWorks />
                <FAQ />
                <ToolsGrid />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
