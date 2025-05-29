const readline = require('readline-sync');
require('dotenv').config();
readline.setDefaultOptions({ encoding: 'utf8' });

const figlet = require('figlet'); // ⬅️ Adicionado

const { lawyers, scheduling } = require('./database');
const { sendAppointmentEmail } = require('./emailService');

function showAsciiMessage(message) {
    console.log(figlet.textSync(message, { horizontalLayout: 'default' }));
}

function lawyerMenu(lawyer, returnToMain) {
    console.clear();
    showAsciiMessage(`Olá Dr. ${lawyer.name}!`);
    console.log('Aqui você pode gerenciar suas consultas e atender clientes.');

    while (true) {
        console.log('1 Ver solicitações de consulta');
        console.log('2 Sair da conta');

        const choice = readline.questionInt('O que deseja fazer? ');

        if (choice === 1) {
            manageAppointments(lawyer);
        }
        else if (choice === 2) {
            showAsciiMessage('Logout');
            console.log('Você encerrou a sessão.');
            returnToMain();
            break;
        }
        else {
            showAsciiMessage('Invalido');
            console.log('Opção inválida');
        }
    }
}

function manageAppointments(lawyer) {
    console.clear();
    showAsciiMessage("Pendentes");
    console.log("Consultas Pendentes");

    const lawyerAppointments = scheduling.filter(a => a.lawyerId === lawyer.id && a.status === 'Pendente');

    if (lawyerAppointments.length === 0) {
        showAsciiMessage("Nada aqui");
        console.log('Nenhuma solicitação de consulta pendente.');
        return;
    }

    lawyerAppointments.forEach((a, index) =>
        console.log(`${index + 1} Cliente: ${a.clientName} - Horário: ${a.time} - Caso: ${a.description}`)
    );

    const choice = readline.questionInt('Escolha uma consulta para aceitar (0 para voltar): ');

    if (choice === 0) return;

    if (!lawyerAppointments[choice - 1]) {
        showAsciiMessage("Erro");
        console.log('Opção inválida. Tente novamente.');
        return;
    }

    const appointment = lawyerAppointments[choice - 1];

    appointment.status = 'Confirmado';

    sendAppointmentEmail(appointment.clientEmail, appointment);

    showAsciiMessage('Confirmado!');
    console.log(`Consulta com ${appointment.clientName} confirmada para o horário ${appointment.time}.`);
}

function lawyerLogin(callback) {
    console.clear();
    const email = readline.questionEMail('Digite seu e-mail: ');
    const senha = readline.question('Digite sua senha: ', { hideEchoBack: true });

    const lawyer = lawyers.find(l => l.email === email && l.password === senha);

    console.clear();

    if (lawyer) {
        showAsciiMessage('Bem vindo!');
        console.log(`✅ Login bem-sucedido! Bem-vindo, Dr. ${lawyer.name}`);
        readline.question('Pressione ENTER para continuar...');
        lawyerMenu(lawyer, callback);
    } else {
        showAsciiMessage('Erro Login');
        console.log('❌ Email ou senha incorretos!');
        readline.question('Pressione ENTER para voltar...');
        callback();
    }
}

module.exports = { lawyerLogin };
