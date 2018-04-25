//essa constante foi criada apos adicionarmos a biblioteca crypto-js atraves do "npm install --save crypto-js"
//essa constante é utilizada para gerar os hash da nossa blockchain
const SHA256 = require('crypto-js/sha256');

class Block{
    //esta classe é responsavel em gerar os nossos blocos
    constructor(index, timestamp, data, previousHash = '')
    {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    //metodo responsavel em realizar os calculos para a criacao de nossos blocos
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        //metodo para criar o bloco 1, ou conforme a literatura diz
        //o bloco genesis
        return new Block(0, "01/01/2017", "Genesis block", "0");
    }

    getLatestBlock(){
        //metodo para recuperarmos o ultimo hash gerado
        //sendo a chave para o blockchain, conter o ultimo hash gerado
        //+
        //o seu hash atual
        return this.chain[this.chain.length - 1]        
    }

    addBlock(newBlock){
        //metodo para criar/adicionar um novo bloco
        //recuperamos o ultimo hash gerado e salvamos no previousHash
        //do novo bloco
        newBlock.previousHash = this.getLatestBlock().hash;
        //calculamos um hash para o novo bloco
        newBlock.hash = newBlock.calculateHash();
        //setamos as informacoes para a criacao do novo bloco
        this.chain.push(newBlock);
    }

    //metodo para validar a integridade da nossa moeda
    //referente a nossa blockchain
    isChainValid(){
        //nao comecamos com o bloco 0, pois o bloco 0 é referente ao genesis
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            //caso o hash do bloco atual seja diferente que o hash gerado
            //ele nao sera valido
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            //caso o previousHash do nosso bloco atual não seja igual ao anterior
            //ira retornar falso, ou seja, ele pode ser qualquer coisa
            //menos um bloco pertencente a nossa blockchain
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        //retorna true, ja que nossa moeda tem o valor perfeito
        return true;
    }
}
//Aqui nessa etapa estamos fazendo testes em nossa blockchain
//Declaramos uma nova classe
let savjeeCoin = new Blockchain();

//adicionamos novos blocos, sendo:
//sua posicao (index), a data que foi gerado e a quantidade de moedas
savjeeCoin.addBlock(new Block(1, "10/07/2017", { amount: 4 }));
savjeeCoin.addBlock(new Block(2, "12/07/2017", { amount: 10 }));

//aqui realizamos a verificacao do nosso blockchain pelo metodo isChainValid
console.log('Is blockchain valid? ' + savjeeCoin.isChainValid());

//neste primeiro caso fizemos uma alteracao referente a qtde moeda da posicao 1
savjeeCoin.chain[1].data = { amount: 100};
//ja neste nos recalculamos o hash referente a mesma moeda
savjeeCoin.chain[1].hash = savjeeCoin.chain[1].calculateHash();

//por fim a validacao para mostrar que há erro na nossa blockchain
console.log('Is blockchain valid? ' + savjeeCoin.isChainValid());

//aqui mostramos o teste que fizemos mostrando o resultado/dados da nossa moeda
//console.log(JSON.stringify(savjeeCoin, null, 4));