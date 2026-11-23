import express, { Request, Response } from "express";
import { text } from "node:stream/consumers";

const dns = require('dns'); //resposta do stack overflow para um erro de conexão que tinha no postman

// Set default result order for DNS resolution
dns.setDefaultResultOrder('ipv4first');

const app = express();
const PORT = process.env.PORT ?? 3000;
app.use(express.json());



// Funcao para criptografar
function criptografar(req: Request, res: Response): void {

    let mensagem: any = req.body.textoClaro;
    let deslocamento: any = req.body.deslocamento;
    let resultado: any = [];
    let textoCifrado: any = [];

    let i: number;

    if (!deslocamento) {
        res.status(400).json({Message: "Erro: Sem deslocamento!"});
    }

    for (i = 0; i < mensagem.length; i++) {
        resultado[i] = mensagem.codePointAt(i) + (deslocamento % 26) //aplicação do deslocamento no unicode
        if(mensagem.codePointAt(i)<91){ //se a mensagem original for da familia de uppercase 
            if(resultado[i] > 90){
                resultado[i] -= 26;//voltar 1 alfabeto, é possivel pois o deslocamento nunca é maior que 26.
            }
                if (resultado[i] < 65){ //se for fora do escopo de letras
                    resultado [i] -= (deslocamento % 26)  //reverter o deslocamento
            }
    }
        else if(mensagem.codePointAt(i)>96){ //se a mensagem original for da familia de lowercase
            if(resultado[i] > 122){
                resultado[i] -= 26; //voltar 1 alfabeto
            }
                if (resultado[i] < 97 || resultado [i] > 122){ //se for fora do escopo
                    resultado[i] -= (deslocamento % 26) //reverter o deslocamento
            }
    }
        console.log(resultado[i])
        textoCifrado = textoCifrado + (String.fromCharCode(resultado[i])); //concatena o resultado da iteração atual ao resultado final
        console.log(textoCifrado)
    }
    
    res.status(200).json({textoCifrado:textoCifrado})
}


// Funcao para descriptografar
function descriptografar(req: Request, res: Response): void {

    let mensagem: any = req.body.textoCifrado;
    let deslocamento: any = req.body.deslocamento;
    let resultado: any = [];
    let textoDeCifrado: any = [];

    deslocamento -= (deslocamento)*2 //inverte o deslocamento

    let i: number;

    if (!deslocamento) {
        res.status(400).json({Message: "Erro: Sem deslocamento!"});
    }

    for (i = 0; i < mensagem.length; i++) {
        resultado[i] = mensagem.codePointAt(i) + (deslocamento % 26) //aplicação do deslocamento no unicode
        if(mensagem.codePointAt(i)<91){ //se a mensagem original for da familia de uppercase 
            if(resultado[i] < 65 && resultado[i] > 38){ //adicionando condicional para o espaco vazio
                resultado[i] += 26;//voltar 1 alfabeto, é possivel pois o deslocamento nunca é maior que 26.
            }
                if (resultado[i] < 90){ //se for fora do escopo de letras
                    resultado [i] -= (deslocamento % 26)  //reverter o deslocamento
            }
    }
        else if(mensagem.codePointAt(i)>96){ //se a mensagem original for da familia de lowercase
            if(resultado[i] < 97 && resultado[i] > 70){ //adicionando condicional para o espaco vazio
                resultado[i] += 26; //voltar 1 alfabeto
            }
                if (resultado[i] < 97 || resultado [i] > 122){ //se for fora do escopo
                    resultado[i] -= (deslocamento % 26) //reverter o deslocamento
            }
    }
        console.log(resultado[i])
        textoDeCifrado = textoDeCifrado + (String.fromCharCode(resultado[i])); //concatena o resultado da iteração atual ao resultado final
        console.log(textoDeCifrado)
    }
    
    res.status(200).json({textoDeCifrado:textoDeCifrado})
}

function descriptografarForcaBruta(req: Request, res: Response): void {

    let mensagem: any = req.body.textoCifrado;
    let deslocamento: any = 0
    let resultado: any = [];
    let textoDeCifrado: any = [];
    let d: number
    let palavra: any  = [];
    var fs = require("fs");
    var text = fs.readFileSync("./Palavras.txt", "utf-8");
    var textByLine = text.split("\n")
    console.log(textByLine)
    for (d = 0; d < 27; d++){
    textoDeCifrado = [];
    deslocamento = d
    deslocamento -= (deslocamento)*2 //inverte o deslocamento
    console.log(deslocamento + "deslocamento")

    let i: number;

    for (i = 0; i < mensagem.length; i++) {
        resultado[i] = mensagem.codePointAt(i) + (deslocamento % 26) //aplicação do deslocamento no unicode
        if(mensagem.codePointAt(i)<91){ //se a mensagem original for da familia de uppercase 
            if(resultado[i] < 65 && resultado[i] > 38){ //adicionando condicional para o espaco vazio
                resultado[i] += 26;//voltar 1 alfabeto, é possivel pois o deslocamento nunca é maior que 26.
            }
                if (resultado[i] < 90){ //se for fora do escopo de letras
                    resultado [i] -= (deslocamento % 26)  //reverter o deslocamento
                    palavra = textoDeCifrado
            }
    }
        else if(mensagem.codePointAt(i)>96){ //se a mensagem original for da familia de lowercase
            if(resultado[i] < 97 && resultado[i] > 70){ //adicionando condicional para o espaco vazio
                resultado[i] += 26; //voltar 1 alfabeto
            }
                if (resultado[i] < 97 || resultado [i] > 122){ //se for fora do escopo
                    resultado[i] -= (deslocamento % 26) //reverter o deslocamento
            }
    }
        console.log(resultado[i])
        textoDeCifrado = textoDeCifrado + (String.fromCharCode(resultado[i])); //concatena o resultado da iteração atual ao resultado final
    }
        console.log(textoDeCifrado + " ")



  if (findWord(palavra, textByLine)){
    res.status(200).json({textoDeCifrado:textoDeCifrado})
    return;
  }
    
    }
    res.status(400).json({Message: "Erro: Nenhuma palavra encontrada!"})
}

function findWord(word: any, str: string) { //função puxada do stack overflow
    console.log(word) //console log pra ver a palavra
  return RegExp('\\b'+ word +'\\b').test(str)//utiliza regular expression e compara com uma string
}

app.post('/cifrar', criptografar);
app.post('/decifrar', descriptografar);
app.post('/decifrarForcaBruta', descriptografarForcaBruta)


app.listen(PORT, () => console.log(`API rodando na URL : http://localhost:${PORT}`));