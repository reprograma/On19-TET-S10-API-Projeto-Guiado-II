const express = require('express');
const app = express();
const port = 3333
const { v4: uuidv4 } = require('uuid')
const novaConta = Math.floor(Math.random()* 5194728);
const listaClientes = require('./model/contas-clientes.json');
app.use(express.json());

//app.get('/clientes', (req, res) =>{
//  res.send(listaClientes)
//})


// [x] - Criar os clientes do banco

app.post('/clientes/add', (req, res) => {
    const { nome_cliente,
    cpf_cliente,
    data_nascimento,
    conta: {tipo}
} = req.body;
  
    const IDUnico = uuidv4();
  
    const novoCliente = {
      id: IDUnico,
      nome_cliente,
      cpf_cliente,
      data_nascimento,
      conta: {
        numero : novaConta ,
        tipo,
        data_criacao: new Date,
      } 
    };

    listaClientes.push(novoCliente);
    return res.json(novoCliente);
  });

  //[x] Atualizar informações desses clientes ( como endereço, telefone de contato...)

  app.patch("/clientes/:id",(req, res)=>{
    const IDCliente = req.params.id
    const novosCampos = req.body

    const acharUsuario = listaClientes.find(clientes => clientes.id == IDCliente)

    if(acharUsuario) {
        const usuarioAtualizado = {
            ...acharUsuario,
            ...novosCampos
        }
        
        listaClientes.map((clientes, index)=>{
            if(clientes.id == IDCliente){
                return listaClientes[index] = usuarioAtualizado
            }
        })
        console.log(usuarioAtualizado)
        return res.status(200).json(usuarioAtualizado)
    }
    return res.status(404).json({message:"Usuario não encontrado"})
   
})

//Fazer depósitos 
  app.patch("/conta/:id/deposito", (req, res) => {
    const { deposito } = req.body;
    const IDCliente  = req.params.id;

    const acharCliente = listaClientes.find((cliente) => cliente.id == IDCliente)

    if(acharCliente) {
      const opDeposito = {
        ...acharCliente.conta,
        saldo:acharCliente.conta.saldo + deposito,
      }
      listaClientes.map((cliente, index) =>{
        if (cliente.id == IDCliente){
          return listaClientes[index] = opDeposito
    }
    })
    return res.status(200).json(acharCliente)
  }
    return res.status(404).json("O depósito não foi realizado ");
  })

  // Fazer pagamento 

  app.patch("/conta/:id/pagamento", (req, res) => {
   const  pagamentos  = req.body
   const IDCliente = req.params.id

   const acharCliente2 = listaClientes.find((cliente) => cliente.id == IDCliente)
   const valorBoleto = -250
   if(acharCliente2){
    const realizarPagamento = {
      ...acharCliente2.conta,
      saldo:acharCliente2.conta.saldo - valorBoleto
    }
    listaClientes.map((cliente, index) =>{
      if (cliente.id == IDCliente){
        return listaClientes[index].conta = realizarPagamento
      }
    })
    return res.status(200).json(acharCliente2.conta.saldo)
   }
   return res.status(404).json("Saldo Insuficiente")
  })
  
  //Encerrar contas de clientes

  app.delete("/clientes/:id",(req,res)=>{
    const IDCliente = req.params.id
  
    const localizarCliente = listaClientes.find((cliente)=> cliente.id == IDCliente)
  
    if(localizarCliente){
        listaClientes.map((cliente,index)=>{
            if(cliente.id == IDCliente){
                return listaClientes.splice(index,1)
            }
  
        })
        return res.status(200).json(`O usuário foi deletado com sucesso`)
    }
    return res.status(404).json("Cliente não foi encontarado")
  })
  
  //- Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...

  app.get("/clientes", (req, res)=>{
    //const filtroNome = req.query.nome?.toLowerCase()
    const filtroCPF =  req.query.cpf
    const filtroid = req.query.id


    

    const escolhaDoFiltro =  listaClientes.filter((cliente) => {

      //if(filtroNome) {
       // return cliente.nome_cliente.toLowerCase().includes(filtroNome);
      //}
      if (filtroCPF) {
        return cliente.cpf_cliente == filtroCPF
      }
      if(filtroid){
        return cliente.id == filtroid
      }
      return cliente 
    })
    return res.json(escolhaDoFiltro)


  });


  app.listen(port,()=>{
    console.log(`Api esta rodando na porta ${port}`);
  })


