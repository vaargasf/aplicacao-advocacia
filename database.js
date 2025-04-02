require('dotenv').config(); 

const clients = [];
const lawyers = [
    { id: 1, name: 'Felipe Vargas', email: process.env.LAWYER_1_EMAIL, password: process.env.LAWYER_1_PASSWORD, specialty: 'Direito Empresarial' },
    { id: 2, name: 'Nicolas Tresoldi', email: process.env.LAWYER_2_EMAIL, password: process.env.LAWYER_2_PASSWORD, specialty: 'Direito Penal' },
    { id: 3, name: 'Gabriel Klein', email: process.env.LAWYER_3_EMAIL, password: process.env.LAWYER_3_PASSWORD, specialty: 'Direito Digital' },
    { id: 4, name: 'João Belém', email: process.env.LAWYER_4_EMAIL, password: process.env.LAWYER_4_PASSWORD, specialty: 'Direito Cívil' }
];

const scheduling = [];
const processHistory = [];

module.exports = { clients, lawyers, scheduling, processHistory };
