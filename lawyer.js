const readline = require('readline-sync');
const { lawyers, scheduling } = require('./database');
const { sendAppointmentEmail } = require('./emailService');

function lawyerMenu(lawyer, returnToMain) {
    console.clear();
    console.log(`Olá, Dr. ${lawyer.name}!`);
    console.log('Aqui você pode gerenciar suas consultas e atender clientes.');

    while (true) {
        console.log('1 Ver solicitações de consulta');
        console.log('2 Sair da conta');

        const choice = readline.questionInt('O que deseja fazer? ');

        if (choice === 1) {
            manageAppointments(lawyer);
        } 
        else if (choice === 2) {
            console.log('Você encerrou a sessão.');
            returnToMain();
            break;
        } 
        else {
            console.log('Opção inválida');
        }
    }
}

function manageAppointments(lawyer) {
    console.clear();
    console.log("Consultas Pendentes");

    const lawyerAppointments = scheduling.filter(a => a.lawyerId === lawyer.id && a.status === 'Pendente');

    if (lawyerAppointments.length === 0) {
        console.log('Nenhuma solicitação de consulta pendente.');
        return;
    }

    lawyerAppointments.forEach((a, index) => 
        console.log(`${index + 1} Cliente: ${a.clientName} - Horário: ${a.time} - Caso: ${a.description}`)
    );

    const choice = readline.questionInt('Escolha uma consulta para aceitar (0 para voltar): ');

    if (choice === 0) return;

    if (!lawyerAppointments[choice - 1]) {
        console.log('Opção inválida. Tente novamente.');
        return;
    }

    const appointment = lawyerAppointments[choice - 1];
    
    appointment.status = 'Confirmado';

    sendAppointmentEmail(appointment.clientEmail, appointment);

    console.log(`Consulta com ${appointment.clientName} confirmada para o horário ${appointment.time}.`);
}

function lawyerLogin(returnToMain) {
    console.clear();
    console.log('Logando...');
    console.log('Digite seu email e senha para continuar.');

    const email = readline.question('Email: ');
    const password = readline.question('Senha: ');

    const lawyer = lawyers.find(l => l.email === email && l.password === password);

    if (!lawyer) {
        console.log('Email ou senha errada.');
        return;
    }

    console.log(`Bem-vindo, Dr. ${lawyer.name}!`);
    lawyerMenu(lawyer, returnToMain);
}

module.exports = { lawyerLogin };
