// Lógica para formalizar una compra y crear un ticket
import Ticket from '../models/Ticket';

// Función para crear un nuevo ticket
const createTicket = async (code, purchase_datetime, amount, purchaser) => {
    try {
        // Crear una nueva instancia de Ticket
        const newTicket = new Ticket({
            code,
            purchase_datetime,
            amount,
            purchaser
        });
        // Guardar el ticket en la base de datos
        await newTicket.save();
        return newTicket;
    } catch (error) {
        throw new Error('No se pudo crear el ticket');
    }
};
