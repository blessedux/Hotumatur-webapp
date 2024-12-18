// test.js
import FlowApi from './flowapi.js';
import dotenv from 'dotenv';

// Carga las variables de entorno
dotenv.config();

// Configura tus credenciales y endpoint
const config = {
    apiKey: process.env.FLOW_API_KEY,
    secretKey: process.env.FLOW_SECRET_KEY,
    apiURL: process.env.FLOW_API_URL
};

// Instancia la clase FlowApi con la configuración
const flowApi = new FlowApi(config);

// Prepara los parámetros del pago
const params = {
    commerceOrder: "ORDEN_1001", // Identificador de orden interno
    subject: "Pago de prueba",
    currency: "CLP",
    amount: 5000,
    email: "aaacevedo@gmail.com",
    paymentMethod: 1,
    urlReturn: "https://hotumatur.com/return",       // URL a la que Flow redirige al final del pago
    urlConfirmation: "https://hotumatur.com/confirm" // URL a la que Flow notifica el resultado del pago
};

// Define el servicio que vas a usar
const serviceName = "payment/create";

(async () => {
    try {
        // Llama al servicio payment/create con método POST

        console.log(params);
        console.log(serviceName);
        console.log(config);
        let response = await flowApi.send(serviceName, params, "POST");
        console.log("Respuesta de Flow:", response);

        // La respuesta deberá contener 'token' y 'url' para redirigir al usuario al pago
        const redirect = response.url + "?token=" + response.token;
        console.log("Redirige al usuario a:", redirect);
    } catch (error) {
        console.error("Error:", error.message);
    }
})();