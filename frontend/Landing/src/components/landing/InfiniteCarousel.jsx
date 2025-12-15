import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// Company logo configuration with fallback styling
// Using direct SVG URLs from Wikimedia Commons for reliable logo access
const companyLogos = {
    TCS: { 
        src: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Tata_Consultancy_Services_old_logo.svg', 
        alt: 'TCS Logo', 
        height: 'h-8',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
    },
    Infosys: { 
        src: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg', 
        alt: 'Infosys Logo', 
        height: 'h-7',
        color: 'text-red-600',
        bgColor: 'bg-red-50'
    },
    Wipro: { 
        src: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg', 
        alt: 'Wipro Logo', 
        height: 'h-10',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
    },
    Accenture: { 
        src: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg', 
        alt: 'Accenture Logo', 
        height: 'h-6',
        color: 'text-pink-600',
        bgColor: 'bg-pink-50'
    },
    Cognizant: { 
        src: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg', 
        alt: 'Cognizant Logo', 
        height: 'h-6',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50'
    },
    HCL: { 
        src: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Hindustan_Computers_logo.svg', 
        alt: 'HCL Technologies Logo', 
        height: 'h-6',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
    },
    Capgemini: { 
        src: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Capgemini_201x_logo.svg', 
        alt: 'Capgemini Logo', 
        height: 'h-7',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
    },
    IBM: { 
        src: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg', 
        alt: 'IBM Logo', 
        height: 'h-8',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50'
    },
};

const CompanyLogo = ({ name }) => {
    const logo = companyLogos[name];
    const [imgError, setImgError] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    
    if (!logo) {
        return (
            <div className="flex items-center justify-center min-w-[140px] px-4 py-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">{name}</span>
            </div>
        );
    }
    
    // If image fails to load, show styled company name as fallback
    if (imgError) {
        return (
            <div className={`flex items-center justify-center min-w-[140px] px-4 py-2 rounded-lg ${logo.bgColor} border border-slate-200 shadow-sm`}>
                <span className={`text-sm font-bold ${logo.color} uppercase tracking-wide`}>{name}</span>
            </div>
        );
    }
    
    return (
        <div className="flex items-center justify-center min-w-[140px] relative">
            {!imgLoaded && !imgError && (
                <div className={`absolute inset-0 flex items-center justify-center rounded-lg ${logo.bgColor} px-3 py-2 z-10`}>
                    <span className={`text-xs font-semibold ${logo.color} uppercase tracking-wide`}>{name}</span>
                </div>
            )}
            <img 
                src={logo.src}
                alt={logo.alt}
                className={`${logo.height} w-auto object-contain transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                onError={(e) => {
                    console.error(`❌ Failed to load logo: ${logo.src}`);
                    console.error('Error target:', e.target);
                    console.error('Attempted URL:', e.target.src);
                    // Test if URL is accessible
                    fetch(logo.src)
                        .then(res => {
                            console.error('Fetch response:', res.status, res.statusText);
                            if (res.ok) {
                                return res.text();
                            }
                            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                        })
                        .then(text => {
                            console.error('Response preview (first 200 chars):', text.substring(0, 200));
                            console.error('Response is SVG:', text.trim().startsWith('<svg') || text.trim().startsWith('<?xml'));
                        })
                        .catch(err => {
                            console.error('Fetch error:', err.message);
                            console.error('This might be a CORS issue or invalid URL');
                        });
                    setImgError(true);
                }}
                onLoad={(e) => {
                    console.log(`✅ Logo loaded successfully: ${logo.src}`);
                    console.log('Image dimensions:', e.target.naturalWidth, 'x', e.target.naturalHeight);
                    setImgLoaded(true);
                }}
                loading="eager"
                style={{ display: imgError ? 'none' : 'block' }}
            />
        </div>
    );
};

export default function InfiniteCarousel() {
    const trackRef = useRef(null);
    const containerRef = useRef(null);
    
    useEffect(() => {
        const track = trackRef.current;
        if (!track || !track.children.length) return;
        
        const items = Array.from(track.children);
        const halfLength = items.length / 2;
        
        // Calculate the exact width of the first half (one complete set)
        let firstHalfWidth = 0;
        for (let i = 0; i < halfLength; i++) {
            firstHalfWidth += items[i].offsetWidth || 0;
        }
        // Add gaps between items (gap-12 = 3rem = 48px)
        const gapWidth = 48;
        firstHalfWidth += gapWidth * (halfLength - 1);
        // Add padding (px-12 = 3rem = 48px on each side)
        firstHalfWidth += 48 * 2;
        
        // Ensure we have a valid width
        if (firstHalfWidth <= 0) {
            console.warn('Carousel: Invalid width, using fallback');
            firstHalfWidth = track.offsetWidth / 2;
        }
        
        // Set initial position to 0
        gsap.set(track, { x: 0 });
        
        // Create seamless infinite loop using timeline
        const tl = gsap.timeline({ repeat: -1 });
        tl.to(track, {
            x: -firstHalfWidth,
            duration: 30,
            ease: "none"
        })
        .set(track, {
            x: 0,
            immediateRender: false
        });

        // Initial animation for items
        gsap.fromTo(items, 
            {
                opacity: 0,
                scale: 0.8,
                y: 20
            },
            {
                opacity: 0.6,
                scale: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out"
            }
        );

        // Hover effects for items
        items.forEach((item) => {
            item.addEventListener("mouseenter", () => {
                gsap.to(item, {
                    scale: 1.08,
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            item.addEventListener("mouseleave", () => {
                gsap.to(item, {
                    scale: 1,
                    opacity: 0.6,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });

        // Container hover to slow down animation
        const container = containerRef.current;
        if (container) {
            container.addEventListener("mouseenter", () => {
                gsap.to(tl, {
                    timeScale: 0.3,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });

            container.addEventListener("mouseleave", () => {
                gsap.to(tl, {
                    timeScale: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
        }

        return () => {
            tl.kill();
        };
    }, []);

    const companies = [
        "TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "HCL", "Capgemini", "IBM",
        "TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "HCL", "Capgemini", "IBM"
    ];

    return (
        <section className="py-12 border-y border-blue-100 bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
            <div className="container mx-auto px-6 lg:px-8 max-w-7xl mb-8 text-center">
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider animate-fade-in">
                    Preparing students for top companies
                </p>
            </div>
            
            <div ref={containerRef} className="relative w-full overflow-hidden py-4">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

                <div ref={trackRef} className="flex gap-12 w-max px-12 items-center">
                    {companies.map((name, i) => (
                        <div 
                            key={i} 
                            className="carousel-item flex items-center justify-center transition-all duration-300 cursor-default px-5 py-3 rounded-xl hover:bg-white/80 hover:shadow-lg"
                        >
                            <CompanyLogo name={name} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
