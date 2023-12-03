import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';

const img_1 = "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU"
const img_2 = "https://fastly.picsum.photos/id/4/5000/3333.jpg?hmac=ghf06FdmgiD0-G4c9DdNM8RnBIN7BO0-ZGEw47khHP4"
const img_3 = "https://fastly.picsum.photos/id/7/4728/3168.jpg?hmac=c5B5tfYFM9blHHMhuu4UKmhnbZoJqrzNOP9xjkV4w3o"

export const CarouselNews = () => {

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <Carousel activeIndex={index} onSelect={handleSelect}>
            <Carousel.Item>
                <img
                    style={{
                        width: '100%',
                        height: '500px',
                        borderRadius: '10px'
                    }}
                    src={img_1} alt="" />
                <Carousel.Caption style={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        borderRadius: '10px'
                    }}>
                    <h3>First slide label</h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    style={{
                        width: '100%',
                        height: '500px',
                        borderRadius: '10px'
                    }}
                    src={img_2} alt="" />
                <Carousel.Caption style={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        borderRadius: '10px'
                    }}>
                    <h3>Second slide label</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    style={{
                        width: '100%',
                        height: '500px',
                        borderRadius: '10px'
                    }}
                    src={img_3} alt="" />
                <Carousel.Caption style={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        borderRadius: '10px'
                    }}>
                    <h3>Third slide label</h3>
                    <p>
                        Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                    </p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}

