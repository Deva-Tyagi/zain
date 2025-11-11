// sections/ContactSection.js (Final call-to-action with subtle animations)
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      formRef.current.children,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full flex items-center justify-center bg-gray-800">
      <div ref={formRef} className="text-center">
        <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
        <p className="text-lg mb-8">Contact us for your custom interior design needs.</p>
        <form className="max-w-md mx-auto">
          <input type="text" placeholder="Name" className="w-full mb-4 p-2 bg-gray-700 rounded" />
          <input type="email" placeholder="Email" className="w-full mb-4 p-2 bg-gray-700 rounded" />
          <textarea placeholder="Message" className="w-full mb-4 p-2 bg-gray-700 rounded h-32"></textarea>
          <button type="submit" className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700">Submit</button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;