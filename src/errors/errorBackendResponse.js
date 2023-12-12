export const errorBackendResponse = (error, ERROR_BUSINESS, ERROR_MESSAGE, ERROR_BODY, showSwalError) => {

    try {

        if (error.response && error.response.data) {

            const { codigo, descripcion, ticket, tipo } = error.response.data;

            if (tipo === ERROR_BUSINESS) {

                showSwalError(descripcion);

            } else {

                showSwalError(`${ERROR_MESSAGE} ${ticket}`);
                console.error(error.response.data);
            }
        } else {
            showSwalError(`${ERROR_MESSAGE}`);
            console.error(`${ERROR_BODY} : ${error}`);
        }

    } catch (error) {
        showSwalError(`${ERROR_MESSAGE}`);
        console.error(`${ERROR_BODY} : ${error}`);
    }
}
