import { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const img_1 = "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU"

export const CarouselNews = () => {

    const [index, setIndex] = useState(0);
    const [publicaciones, setPublicaciones] = useState([]);

    const getPublicaciones = async () => {
        try {
            const resp = await axios.get(`${backendUrl}/publicacionesVigentes`);
            const data = await resp.data;
            setPublicaciones(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getPublicaciones();
        console.log(publicaciones);
    }, [])

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <Carousel activeIndex={index} onSelect={handleSelect}>


            {publicaciones.map((publicacion, index) => (
                <Carousel.Item key={index}>

                    <img
                        style={{
                            width: '100%',
                            height: '500px',
                            borderRadius: '10px'
                        }}
                        src={img_1} alt=""
                    />

                    <Carousel.Caption style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        borderRadius: '10px'
                    }}>
                        <h3>{publicacion.titulo}</h3>
                        <p>{publicacion.cuerpo}</p>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );

}

