import React from 'react'
import { CarouselNews } from '../../components/carousel/Carousel'

export const Inicio = () => {
    return (
        <div style={{
            width: '80%',
            margin: '60px auto',
        }}>
            <h1 style={{ color: '#1A76D2', marginBottom: '10px', textAlign: 'left' }}>Bienvenidos</h1>

            <p>Desde este portal, podrá generar boletas de pago para las entidades UOMA, OSPIM y AMTIMA</p>

            <div style={{margin: '20px 0px'}}>
                <h2 style={{ color: '#1A76D2', marginBottom: '10px' }}>Contacto</h2>
                <p>Ante cualquier inconveniente, por favor, no dude en contactarse con nosotros a través de los siguientes medios</p>

                <div className='medios'>
                    <div>Correo Electrónico</div>
                    <div>Teléfono</div>
                    <div>WhatsApp</div>
                </div>
            </div>

            <h2 style={{ color: '#1A76D2', margin: '20px 0px' }}>Novedades</h2>
            <CarouselNews />
        </div>
    )
}
