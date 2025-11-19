'use client'
import React, { useEffect, useState } from 'react';
import Carousel from '../ui/carousel';
import axios from 'axios';

const CarouselComponent = () => {

    const [slides, setSlides] = useState([]);

    useEffect(() => {
        axios.get('/api/events')
            .then((res) => setSlides(res.data.data))
    }, [])

    // console.log(slides);

    const newSlides = slides.map((slide) => ({
        src: slide.eventImage,
        title: slide.eventTitle,
        button: { label: 'Learn More', link: `/events/${slide.id}` }
    }))

    // console.log(newSlides);


    return (
        <div className='p-10'>
            <Carousel slides={newSlides}></Carousel>
        </div>
    );
};

export default CarouselComponent;