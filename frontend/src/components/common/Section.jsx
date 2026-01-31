import React from 'react';

const Section = ({
    children,
    className = '',
    id = '',
    containerClass = ''
}) => {
    return (
        <section id={id} className={`py-16 md:py-24 ${className}`}>
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${containerClass}`}>
                {children}
            </div>
        </section>
    );
};

export default Section;
