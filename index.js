process.stdin.setEncoding('utf8');
const readline = require('readline-sync');
readline.setDefaultOptions({ encoding: 'utf8' });

const figlet = require('figlet'); // ⬅️ Novo

const { clientLogin, clientRegister } = require('./client');
const { lawyerLogin } = require('./lawyer');

// Função para exibir mensagem em ASCII
function showAsciiMessage(message) {
    console.log(figlet.textSync(message, { horizontalLayout: 'default' }));
}

function animationLyrics(callback) {
    const linhas = [
        "FFFFFFFFFFFFFFFF GGGGGGGGGGGGGG       JJJJJJJJJ      NNNN           NNNN",
        "FFFFFFFFFFFFFFFF GGGGGGGGGGGGGG       JJJJJJJJJ      NNNNN          NNNN",
        "FFF              GGG                    JJJJ         NNNNNN         NNNN",
        "FFF              GGG                    JJJJ         NNNNNNN        NNNN",
        "FFFFFFFFFFFF     GGG     GGGGGG         JJJJ         NNNN NNNN      NNNN",
        "FFFFFFFFFFFF     GGG     GGGGGG         JJJJ         NNNN  NNNN     NNNN",
        "FFF              GGG       GGGG         JJJJ         NNNN   NNNN    NNNN",
        "FFF              GGGGGGGGGGGGGG   JJJ   JJJJ         NNNN    NNNN   NNNN",
        "FFF              GGGGGGGGGGGGGG   JJJJJJJJJJ         NNNN     NNNNNNNNNN",
    ];

    const larguraJanela = 72;
    let pos = 0;
    const interval = setInterval(() => {
        console.clear();
        const borda = "#".repeat(larguraJanela + 4);
        console.log(borda);
        linhas.forEach(linha => {
            const repetida = linha + "    ";
            const visivel = (repetida + repetida).substring(pos, pos + larguraJanela);
            console.log(`# ${visivel.padEnd(larguraJanela)} #`);
        });
        console.log(borda);
        pos++;

        if (pos > linhas[0].length + 4) {
            clearInterval(interval);
            setTimeout(callback, 500);
        }
    }, 65);
}

function mainMenu() {
    while (true) {
        console.log();
        showAsciiMessage('FGJN'); // ASCII logo
        console.log('Bem vindos à FGJN Advocacia!');
        console.log('----------------------------');
        console.log('1️ Sou Cliente');
        console.log('2️ Sou Advogado');
        console.log('3️ Sair');

        const choice = readline.questionInt(' Como podemos te ajudar hoje? ');

        if (choice === 1) {
            console.clear();
            showAsciiMessage('Olá Cliente');
            console.log('Área do Cliente:');
            console.log('1️ Já tenho conta');
            console.log('2️ Criar uma conta');
            console.log('3️ Voltar ao menu');

            const clientChoice = readline.questionInt(' Escolha a opção: ');

            if (clientChoice === 1) clientLogin(mainMenu);
            else if (clientChoice === 2) clientRegister(mainMenu);
            else if (clientChoice === 3) {
                console.clear();
                continue;
            }

        } else if (choice === 2) {
            console.clear();
            showAsciiMessage('Advogado');
            lawyerLogin(mainMenu);
        } else if (choice === 3) {
            console.clear();
            showAsciiMessage('Obrigado!');
            console.log('A FGJN agradece sua visita!');
            console.log('Se precisar de nós, estaremos por aqui. Tamo junto!');
            process.exit();
        } else {
            showAsciiMessage('Invalido');
            console.log('Opção inválida.');
        }
    }
}

animationLyrics(mainMenu);
