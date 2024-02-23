export const getHttpHeader = () => {

    if (localStorage.getItem("stateLogin") != null && localStorage.getItem("stateLogin").hasOwnProperty("usuarioLogueado")) {

        const TOKEN = JSON.parse(localStorage.getItem("stateLogin")).usuarioLogueado
            .usuario.token;
        return {
            headers: {
                Authorization: TOKEN,
            },
        };

    }

}