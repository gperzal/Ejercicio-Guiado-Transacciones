import pool from "../config/db.js";
import nodemailer from 'nodemailer';

const addUser = async (nombre, telefono) => {
    const sql = {
        text: "INSERT INTO usuarios (nombre, telefono) VALUES ($1, $2) RETURNING *",
        values: [nombre, telefono] // Usa los argumentos directamente aquí
    };
    try {
        const result = await pool.query(sql); // Pasa el objeto sql directamente
        console.log(result.rows); // Usa console.log para ver el resultado si es una función independiente
    } catch (error) {
        console.error(error); // Maneja posibles errores
    }
}

const getUsers = async () => {
    try {
        const sql = 'SELECT * FROM usuarios;';
        const result = await pool.query(sql);
        return result.rows;
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        throw error;
    }
};

//Función para obtener un usuario específico por ID
const getUser = async (id) => {
    const sql = {
        text: 'SELECT * FROM usuarios WHERE id = $1;',
        values: [id]
    };

    try {
        const result = await pool.query(sql);
        if (result.rows.length > 0) {
            console.log('Usuario encontrado:', result.rows[0]);
        } else {
            console.log('Usuario no encontrado.');
        }
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        throw error;
    }
};

//Función para actualizar un usuario
const updateUser = async (id, nuevoNombre, nuevoTelefono) => {
    const sql = {
        text: 'UPDATE usuarios SET nombre = $2, telefono = $3  WHERE id = $1 RETURNING *;',
        values: [id, nuevoNombre, nuevoTelefono]
    };

    try {
        const result = await pool.query(sql);
        if (result.rows.length > 0) {
            console.log('Usuario actualizado:', result.rows[0]);
        } else {
            console.log('Usuario no encontrado o no se realizó ninguna actualización.');
        }
    } catch (error) {
        console.error('Error al actualizar el usuario:', error); // Manejo de errores
        throw error;
    }
};


//Función para eliminar un usuario
const removeUser = async (id) => {
    const sql = {
        text: 'DELETE FROM usuarios WHERE id = $1 RETURNING *;',
        values: [id]
    };

    try {
        const result = await pool.query(sql);
        if (result.rows.length > 0) {
            console.log('Usuario eliminado:', result.rows[0]);
        } else {
            console.log('Usuario no encontrado o ya fue eliminado.');
        }
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        throw error;
    }
};


const main = async () => {
    const action = process.argv[2]; // Acción a realizar (addUser, getUsers, etc.)
    console.log(action);
    const args = process.argv.slice(3); // Argumentos para la acción
    console.log(args);
    switch (action) {
        case 'addUser':
            await addUser(...args);
            break;
        case 'getUsers':
            await getUsers();
            break;
        case 'getUser':
            await getUser(...args);
            break;
        case 'updateUser':
            await updateUser(...args);
            console.log(...args);
            break;
        case 'removeUser':
            await removeUser(...args);

            break;
        default:
            console.log('Acción no reconocida');
    }
};

main();