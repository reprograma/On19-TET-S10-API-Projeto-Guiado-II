const express = require('express');
const app = express();
const port = 3030 ;
const uuid = require ('uuid')
const moment = require('moment')
const listaClientesBanco = require('./model/contas-clientes.json')

app.use(express.json());

//- Criar os clientes do banco - http://localhost:3030/clientes/add
app.post('/clientes/add', (req, res) => {
    const { nome_cliente, cpf_cliente, data_nascimento, conta:{numero, tipo,saldo,data_criacao}} = req.body;
    const IDUnico = uuid.v4();
    const numeroConta = Math.random();;
    const dataCriacao = moment().format('DD/MM/YYYY');
  
    const existeCPF = listaClientesBanco.find(
      (conta) => conta.cpf_cliente == cpf_cliente
    );
      if(!existeCPF){
        const novaContaComID = {
          id: IDUnico,
          nome_cliente,
          cpf_cliente,
          data_nascimento,
            conta:{numero:numeroConta,
              tipo,
              saldo,
              data_criacao:dataCriacao
          }
      }
      listaClientesBanco.push(novaContaComID);
      return res.status(201).json(novaContaComID);
    }
    return res.status(404).json({ messagem: 'Cliente já existe' });
    });

//- Encerrar contas de clientes -  http://localhost:3030/clientes/e0077787-42c1-4c0d-945b-b16787951446
app.delete("/clientes/:id",(req,res)=>{
    const idCliente = req.params.id
  
    const clienteExiste = listaClientesBanco.find((user)=> user.id == idCliente)
  
    if(clienteExiste){
        listaClientesBanco.map((cliente,index)=>{
            if(cliente.id == idCliente){
                return listaClientesBanco.splice(index,1)
            }
  
        })
        return res.status(200).json({
           message:`O usuário ${clienteExiste.nome_cliente} foi deletado com sucesso`})
    }
    return res.status(404).json({
        message:"Cliente não foi encontarado"
    })
  })

//- Fazer depósitos / pagamentos usando o saldo de sua conta - 
//http://localhost:3030/clientes/4f474f4b-dcfd-41cf-8c74-a60e0e624f65/deposito 
//http://localhost:3030/clientes/32b2fd22-f8dd-488a-a65c-d7cca8b5f975/pagamento
app.patch('/clientes/:id/deposito', (req,res)=>{
    const idCliente = req.params.id;
    const { deposito } = req.body;
  
    const clienteExiste = listaClientesBanco.find(
      (cliente) => cliente.id == idCliente
    );
  
    if (clienteExiste) {
      const transacaoDeposito = {
        ...clienteExiste.conta,
        saldo: clienteExiste.conta.saldo + deposito,
      };
  
      listaClientesBanco.map((cliente, index) => {
        if (cliente.id == idCliente) {
          listaClientesBanco[index].conta = transacaoDeposito;
        }
      });
      return res.status(200).json({
        message: `O depósito foi realizado com sucesso.Saldo R$ ${transacaoDeposito.saldo}`,
    })
  }  
    return res.status(404).json({ messagem: 'Usuário não existe' });  
  })
  
  app.patch('/clientes/:id/pagamento', (req,res)=>{ 
    const idCliente = req.params.id;
    const { pagamento } = req.body;
  
    const clienteExiste = listaClientesBanco.find(
      (cliente) => cliente.id == idCliente
    );
  
    if (clienteExiste.conta.saldo >= pagamento) {
      const transacaoPagamento = {
        ...clienteExiste.conta,
        saldo: clienteExiste.conta.saldo - pagamento
      };
  
      listaClientesBanco.map((cliente, index) => {
        if (cliente.id == idCliente) {
          listaClientesBanco[index].conta =  transacaoPagamento
        }
      });
      return res.status(200).json({
        message: `O pagammento foi realizado com sucesso.Saldo R$ ${transacaoPagamento.saldo.toFixed(2)}`,
    })
    }
  return res.status(404).json({ messagem: 'Saldo insuficiente' });  
  })

//- Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...
//http://localhost:3030/clientes?nome=Franklin
//http://localhost:3030/clientes?saldo=47291.98
//http://localhost:3030/clientes?cpf=514.196.671-22
app.get('/clientes',(req,res)=>{
    const filtraPorNome = req.query.nome?.toLowerCase()
    const FiltraPorSaldo = req.query.saldo
    const FiltraPorCPF = req.query.cpf
  
      const filtroEscolhido = listaClientesBanco.filter((conta) => {
  
        if(filtraPorNome){
          return conta.nome_cliente.toLowerCase().includes(filtraPorNome);
        }
        if (FiltraPorSaldo) {
          return conta.conta.saldo == FiltraPorSaldo;
        }
        if (FiltraPorCPF) {
          return conta.cpf_cliente == FiltraPorCPF;
        }
        return conta
  
      })
    return res.status(200).json(filtroEscolhido);
  })

//- Atualizar informações desses clientes ( como endereço, telefone de contato...) - http://localhost:3030/clientes/32b2fd22-f8dd-488a-a65c-d7cca8b5f975/atualizar
app.patch("./clientes/atualiza",(req, res)=>{
    const cpfUsuario = req.query.cpf_cliente;
    const novosDados = req.body;

    const existeCliente = contasClientes.find(user => user.cpf_cliente === cpfUsuario)

    if(existeCliente) {
        const usuarioAtualizado = {
            ...existeCliente,
            ...novosDados,
        }
        contasClientes.map((user, index)=>{
            if(user.cpf_cliente == cpfUsuario){
                return contasClientes[index] = usuarioAtualizado
            }
        })
      return res.status(200).json(usuarioAtualizado)
    }
    return res.status(404).json({message:"CPF não foi encontrado"})
  })


    app.listen(port,()=>{
        console.log(`Api esta rodando na porta ${port}`);
      })