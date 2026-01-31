import React from 'react';

const Section = ({
    children,
    className = '',
    id = '',
    containerClass = '',
    bgElements = null
}) => {
    return (
        <section id={id} className={`relative py-16 md:py-24 ${className}`}>
            {bgElements}
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ${containerClass}`}>
                {children}
            </div>
        </section>
    );
};

export default Section;
