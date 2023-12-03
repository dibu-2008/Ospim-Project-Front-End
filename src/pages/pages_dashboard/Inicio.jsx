import React from 'react'
import { CarouselNews } from '../../components/carousel/Carousel'

export const Inicio = () => {
    return (
        <div style={{
            width: '80%',
            margin: '50px auto',
        }}>
            <h1 style={{ color: '#1A76D2', marginBottom: '20px', textAlign: 'left' }}>Bienvenidos</h1>

            <p>Desde este portal, podrá generar boletas de pago para las entidades UOMA, OSPIM y AMTIMA</p>

            <div>
                <h2 style={{ color: '#1A76D2', marginBottom: '20px' }}>Contacto</h2>
                <p>Ante cualquier inconveniente, por favor, no dude en contactarse con nosotros a través de los siguientes medios</p>

                <div className='medios'>
                    <div>Correo Electrónico</div>
                    <div>Teléfono</div>
                    <div>WhatsApp</div>
                </div>
            </div>

            <h2 style={{ color: '#1A76D2', marginBottom: '20px' }}>Novedades</h2>
            <CarouselNews />
        </div>
    )
}
