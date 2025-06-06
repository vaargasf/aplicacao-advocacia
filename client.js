const readline = require('readline-sync');
readline.setDefaultOptions({ encoding: 'utf8' });
const figlet = require('figlet');
const { clients, lawyers, scheduling } = require('./database');
const { sendAppointmentEmail } = require('./emailService');

function showAsciiMessage(message) {
    console.log(figlet.textSync(message, { horizontalLayout: 'default' }));
}

function clientMenu(client, returnToMain) {
    console.clear();
    showAsciiMessage(`Olá, ${client.name}!`);
    console.log('-------------------------------------');
    console.log('Que bom te ver por aqui!');
    console.log('Vamos agendar sua consulta com um advogado especializado?');

    while (true) {
        console.log('1️ Agendar consulta');
        console.log('2️ Ver status das consultas');
        console.log('3️ Sair da conta');

        const choice = readline.questionInt('O que deseja fazer? ');

        if (choice === 1) {
            scheduleAppointment(client, returnToMain);
        }
        else if (choice === 2) {
            viewAppointments(client);
        }
        else if (choice === 3) {
            console.clear();
            showAsciiMessage('Logout');
            console.log('Você saiu da sua conta.');
            returnToMain();
            break;
        }
        else {
            showAsciiMessage('Invalido');
            console.log('Opção inválida.');
        }
    }
}

function scheduleAppointment(client, returnToMain) {
    console.clear();
    showAsciiMessage('Agendar Consulta');
    console.log(`Olá, ${client.name}! Vamos agendar sua consulta?`);
    console.log('Aqui estão os advogados disponíveis:');
    console.log('-----------------------------------');

    if (lawyers.length === 0) {
        showAsciiMessage('Vazio');
        console.log('No momento, não há advogados disponíveis.');
        return;
    }

    lawyers.forEach((lawyer, index) => {
        console.log(`${index + 1}️ Dr. ${lawyer.name} - Especialidade: ${lawyer.specialty}`);
    });

    const choice = readline.questionInt('Escolha o advogado (0 para voltar): ');

    if (choice === 0) return clientMenu(client, returnToMain);

    const lawyer = lawyers[choice - 1];

    if (!lawyer) {
        showAsciiMessage('Erro');
        console.log('Escolha inválida! Tente novamente.');
        return scheduleAppointment(client, returnToMain);
    }

    const description = readline.question('Descreva brevemente seu caso: ');

    let appointmentTime;
    while (true) {
        appointmentTime = readline.question('Escolha o horário (ex: 08:30, 14:00): ');

        if (isValidTime(appointmentTime)) break;
        else {
            showAsciiMessage('Horario!');
            console.log('Horário inválido! O horário precisa estar entre 08:00 e 18:00, com intervalo entre 12:00 e 13:30.');
        }
    }

    const appointment = {
        clientName: client.name,
        clientEmail: client.email,
        lawyerId: lawyer.id,
        lawyerName: lawyer.name,
        description,
        status: 'Pendente',
        time: appointmentTime
    };

    scheduling.push(appointment);

    showAsciiMessage('Enviado');
    console.log(`Solicitação enviada para Dr. ${lawyer.name}!`);
    console.log('Aguarde a confirmação do advogado.');
}

function viewAppointments(client) {
    console.clear();
    showAsciiMessage('Consultas Agendadas');

    const clientAppointments = scheduling.filter(a => a.clientEmail === client.email);

    if (clientAppointments.length === 0) {
        console.log('Você ainda não tem consultas agendadas.');
        return;
    }

    clientAppointments.forEach((a, index) => {
        console.log(`${index + 1} - Dr. ${a.lawyerName} - ${a.status} - Horário: ${a.time}`);
    });
}

function isValidTime(time) {
    const regex = /^([0-9]{2}):([0-9]{2})$/;
    const match = time.match(regex);
    if (!match) return false;

    let [hour, minute] = match.slice(1).map(Number);

    if (minute < 0 || minute > 59) return false;

    if (hour < 8 || hour > 18 || (hour === 18 && minute > 0) ||
        (hour === 12 && minute > 0) || (hour === 13 && minute < 30)) return false;

    return true;
}

function clientRegister(returnToMain) {
    console.clear();
    showAsciiMessage('Cadastro');
    console.log('Criando sua conta...');
    console.log('Suas informações para continuar.');

    const name = readline.question('Seu Nome: ');
    const email = readline.question('Seu Email: ');
    const password = readline.question('Crie uma Senha: ');

    if (clients.find(c => c.email === email)) {
        showAsciiMessage('Erro');
        console.log('Já existe uma conta com esse email. Tente outro ou faça login.');
        return;
    }

    const newClient = { name, email, password };
    clients.push(newClient);

    showAsciiMessage('Sucesso');
    console.log(`Conta criada com sucesso! Bem-vindo, ${name}!`);
    console.log('Agora você pode agendar sua primeira consulta.');
    clientMenu(newClient, returnToMain);
}

function clientLogin(returnToMain) {
    console.clear();
    showAsciiMessage('Login');
    console.log('Logando...');
    console.log('Digite seu email e sua senha para continuar.');

    const email = readline.question('Email: ');
    const password = readline.question('Senha: ');

    const client = clients.find(c => c.email === email && c.password === password);

    if (!client) {
        showAsciiMessage('Erro Login');
        console.log('Email ou senha errada');
        return;
    }

    showAsciiMessage('Bem vindo!');
    console.log(`Bem-vindo de volta, ${client.name}!`);
    clientMenu(client, returnToMain);
}

module.exports = { clientLogin, clientRegister };
