"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dns = require('dns'); //resposta do stack overflow para um erro de conexão que tinha no postman
// Set default result order for DNS resolution
dns.setDefaultResultOrder('ipv4first');
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 3000;
app.use(express_1.default.json());
// Funcao para criptografar
function criptografar(req, res) {
    let mensagem = req.body.textoClaro;
    let deslocamento = req.body.deslocamento;
    let resultado = [];
    let textoCifrado = [];
    let i;
    if (!deslocamento) {
        res.status(400).json({ Message: "Erro: Sem deslocamento!" });
    }
    for (i = 0; i < mensagem.length; i++) {
        resultado[i] = mensagem.codePointAt(i) + (deslocamento % 26); //aplicação do deslocamento no unicode
        if (mensagem.codePointAt(i) < 91) { //se a mensagem original for da familia de uppercase 
            if (resultado[i] > 90) {
                resultado[i] -= 26; //voltar 1 alfabeto, é possivel pois o deslocamento nunca é maior que 26.
            }
            if (resultado[i] < 65) { //se for fora do escopo de letras
                resultado[i] -= (deslocamento % 26); //reverter o deslocamento
            }
        }
        else if (mensagem.codePointAt(i) > 96) { //se a mensagem original for da familia de lowercase
            if (resultado[i] > 122) {
                resultado[i] -= 26; //voltar 1 alfabeto
            }
            if (resultado[i] < 97 || resultado[i] > 122) { //se for fora do escopo
                resultado[i] -= (deslocamento % 26); //reverter o deslocamento
            }
        }
        console.log(resultado[i]);
        textoCifrado = textoCifrado + (String.fromCharCode(resultado[i])); //concatena o resultado da iteração atual ao resultado final
        console.log(textoCifrado);
    }
    res.status(200).json({ textoCifrado: textoCifrado });
}
// Funcao para descriptografar
function descriptografar(req, res) {
    let mensagem = req.body.textoCifrado;
    let deslocamento = req.body.deslocamento;
    let resultado = [];
    let textoClaro = [];
    deslocamento -= (deslocamento) * 2; //inverte o deslocamento
    let i;
    if (!deslocamento) {
        res.status(400).json({ Message: "Erro: Sem deslocamento!" });
    }
    for (i = 0; i < mensagem.length; i++) {
        resultado[i] = mensagem.codePointAt(i) + (deslocamento % 26); //aplicação do deslocamento no unicode
        if (mensagem.codePointAt(i) < 91) { //se a mensagem original for da familia de uppercase 
            if (resultado[i] < 65 && resultado[i] > 38) { //adicionando condicional para o espaco vazio
                resultado[i] += 26; //voltar 1 alfabeto, é possivel pois o deslocamento nunca é maior que 26.
            }
            if (resultado[i] < 90) { //se for fora do escopo de letras
                resultado[i] -= (deslocamento % 26); //reverter o deslocamento
            }
        }
        else if (mensagem.codePointAt(i) > 96) { //se a mensagem original for da familia de lowercase
            if (resultado[i] < 97 && resultado[i] > 70) { //adicionando condicional para o espaco vazio
                resultado[i] += 26; //voltar 1 alfabeto
            }
            if (resultado[i] < 97 || resultado[i] > 122) { //se for fora do escopo
                resultado[i] -= (deslocamento % 26); //reverter o deslocamento
            }
        }
        console.log(resultado[i]);
        textoClaro = textoClaro + (String.fromCharCode(resultado[i])); //concatena o resultado da iteração atual ao resultado final
        console.log(textoClaro);
    }
    res.status(200).json({ textoClaro: textoClaro });
}
function descriptografarForcaBruta(req, res) {
    let mensagem = req.body.textoCifrado;
    let deslocamento = 0;
    let resultado = [];
    let textoClaro = [];
    let d;
    let flag = false;
    var fs = require("fs");
    var text = fs.readFileSync("./Palavras.txt", "utf-8"); //utilizando read file sync pala ler arquivo de palavras em utf-8
    var textByLine = text.split("\n");
    console.log(textByLine);
    for (d = 0; d < 27; d++) { //para o alfabeto inteiro é repetido o loop
        textoClaro = [];
        deslocamento = d;
        deslocamento -= (deslocamento) * 2; //inverte o deslocamento
        console.log(deslocamento + "deslocamento");
        let i;
        for (i = 0; i < mensagem.length; i++) {
            resultado[i] = mensagem.codePointAt(i) + (deslocamento % 26); //aplicação do deslocamento no unicode
            if (mensagem.codePointAt(i) < 91) { //se a mensagem original for da familia de uppercase 
                if (resultado[i] < 65 && resultado[i] > 38) { //adicionando condicional para o espaco vazio
                    resultado[i] += 26; //voltar 1 alfabeto, é possivel pois o deslocamento nunca é maior que 26.
                }
                if (resultado[i] < 90) { //se for fora do escopo de letras (Espaço vazio entra aqui)
                    resultado[i] -= (deslocamento % 26); //reverter o deslocamento
                    if (findWord(textoClaro, textByLine)) { //verifica se a primeira palavra é verdadeira a partir da função
                        flag = true; //se a primeira palavra for verdadeira, a flag é verdadeira.
                    }
                }
            }
            else if (mensagem.codePointAt(i) > 96) { //se a mensagem original for da familia de lowercase
                if (resultado[i] < 97 && resultado[i] > 70) { //adicionando condicional para o espaco vazio
                    resultado[i] += 26; //voltar 1 alfabeto
                }
                if (resultado[i] < 97 || resultado[i] > 122) { //se for fora do escopo
                    resultado[i] -= (deslocamento % 26); //reverter o deslocamento
                }
            }
            console.log(resultado[i]);
            textoClaro = textoClaro + (String.fromCharCode(resultado[i])); //concatena o resultado da iteração atual ao resultado final
        }
        console.log(textoClaro + " ");
        if (flag) { //se a função ver que as duas palavras são verdade
            res.status(200).json({ textoClaro: textoClaro });
            return;
        }
    }
    res.status(400).json({ Message: "Erro: Nenhuma palavra encontrada!" });
}
function findWord(word, str) {
    console.log(word); //console log pra ver a palavra
    return RegExp('\\b' + word + '\\b').test(str); //utiliza regular expression e compara a palavra com todas as palavras do palavras.txt
}
app.post('/cifrar', criptografar);
app.post('/decifrar', descriptografar);
app.post('/decifrarForcaBruta', descriptografarForcaBruta);
app.listen(PORT, () => console.log(`API rodando na URL : http://localhost:${PORT}`));
