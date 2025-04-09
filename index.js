const readline = require('readline-sync');
const { clientLogin, clientRegister } = require('./client');
const { lawyerLogin } = require('./lawyer');

function mainMenu() {
    console.clear();
    console.log('   Bem-vindo à FGJN Advogados! ');
    console.log('══════════════════════════════════════');

    while (true) {
        console.log('1️ Sou Cliente');
        console.log('2️ Sou Advogado');
        console.log('3️ Sair');

        const choice = readline.questionInt(' Como podemos te ajudar hoje? ');

        if (choice === 1) {
            console.clear();
            console.log('Área do Cliente:');
            console.log('1️ Já tenho conta');
            console.log('2️ Criar uma conta');
            console.log('3️ Voltar ao menu');

            const clientChoice = readline.questionInt(' Escolha a opção: ');
            
            if (clientChoice === 1) clientLogin(mainMenu);
            else if (clientChoice === 2) clientRegister(mainMenu);
            else if (clientChoice === 3) console.clear();
        } 
        else if (choice === 2) {
            console.clear();
            lawyerLogin(mainMenu);
        }
        else if (choice === 3) {
            console.log('A FGJN agradece sua visita!');
            console.log('Se precisar de nós, estaremos por aqui. Tamo junto!');
            process.exit();
        } 
        else {
            console.log('Opção inválida.');
        }
    }
}

mainMenu();
