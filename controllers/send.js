import pool from '../config/db.js';
import transporter from '../config/mail.js';

// Función para agendar citas y enviar correo de confirmación
async function agendarCita(rut, nombre, especialidad, medico, fecha, correo) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const insertAgendamiento = 'INSERT INTO agendamiento (rut_paciente, nombre_paciente, especialidad_medica, nombre_medico, fecha_hora) VALUES ($1, $2, $3, $4, $5) RETURNING id';
        const resAgendamiento = await client.query(insertAgendamiento, [rut, nombre, especialidad, medico, fecha]);
        const agendamientoId = resAgendamiento.rows[0].id;

        const insertColaCorreo = 'INSERT INTO cola_correo (id_agendamiento, correo_paciente, fecha_insercion) VALUES ($1, $2, NOW())';
        await client.query(insertColaCorreo, [agendamientoId, correo]);

        await client.query('COMMIT');

        // Envío de correo electrónico
        const mailOptions = {
            from: '"Clínica Ejemplo" <pcglyn@gmail.com>',
            to: correo,
            subject: 'Confirmación de Cita Médica',
            text: `Estimado(a) ${nombre}, su cita con ${medico} en ${especialidad} ha sido agendada para ${fecha}.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.error(error);
            }
            console.log('Correo enviado: %s', info.messageId);
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en la transacción: ', error);
    } finally {
        client.release();
    }
}


// Llama a la función al final del archivo
agendarCita('11222333-4', 'Jonathan Viera', 'Neourología', 'Dr. William Hernandez', '2024-04-10 10:00:00', 'jonathan.viera@example.com')
    .then(() => console.log('Proceso completado exitosamente.'))
    .catch((error) => console.error('Se produjo un error: ', error));


// ejecutar node controllers/send.js


// node controllers/send.js 12345678-9 "Juan Pérez" Cardiología "Dra. Ana López" "2024-04-10 10:00:00" juan.perez@example.com
