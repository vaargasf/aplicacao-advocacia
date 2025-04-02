const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

function sendAppointmentEmail(clientEmail, appointment) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: clientEmail,
        subject: 'Confirmação de Consulta',
        text: `Sua consulta com o Dr. ${appointment.lawyerName} foi confirmada para o horário ${appointment.time}. Caso precise reagendar ou cancelar, entre em contato conosco.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Erro ao enviar o e-mail:', error);
        } else {
            console.log('E-mail enviado: ' + info.response);
        }
    });
}

module.exports = { sendAppointmentEmail };
