import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export const use3DTilt = (config = { intensity: 15 }) => {
  const ref = useRef(null);
  const shineRef = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const { left, top, width, height } = element.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateX = ((mouseY / height) * -config.intensity).toFixed(2);
      const rotateY = ((mouseX / width) * config.intensity).toFixed(2);

      gsap.to(element, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.5,
        ease: "power2.out",
        transformPerspective: 1000,
        transformStyle: "preserve-3d"
      });

      if (shineRef.current) {
        const shineOpacity = Math.min(0.5, Math.max(0, 0.5 + mouseX / width)); // Simple shine logic
        gsap.to(shineRef.current, {
           opacity: shineOpacity,
           x: mouseX,
           y: mouseY,
           duration: 0.1
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)"
      });
      
      if (shineRef.current) {
          gsap.to(shineRef.current, { opacity: 0, duration: 0.5 });
      }
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [config.intensity]);

  return { ref, shineRef };
};
