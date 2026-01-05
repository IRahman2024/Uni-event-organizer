import { getCarouselSlides } from '@/lib/getCarouselSlides';
import React from 'react';
import Carousel from '../ui/carousel';

const CarouselServer = async () => {
    const slides = await getCarouselSlides();

    return (
        <div className='py-14 relative overflow-hidden w-full '>
            <Carousel slides={slides}></Carousel>        
        </div>
    );
};

export default CarouselServer;