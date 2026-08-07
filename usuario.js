let usuarios =
JSON.parse(localStorage.getItem("usuarios")) || [];




// ABRIR LOGIN

document.getElementById("btnLogin").onclick=function(){

document.getElementById("modalLogin").style.display="flex";

}



// fechar

document.getElementById("fecharLogin").onclick=function(){

modalLogin.style.display="none";

}



// cadastro

document.getElementById("abrirCadastro").onclick=function(){

modalLogin.style.display="none";

modalCadastro.style.display="flex";

}




document.getElementById("fecharCadastro").onclick=function(){

modalCadastro.style.display="none";

}





// CADASTRAR


function cadastrar(){


let nome =
nomeCadastro.value;


let email =
emailCadastro.value;


let senha =
senhaCadastro.value;



let existe =
usuarios.find(
u=>u.email==email
);



if(existe){

alert("Este e-mail já possui cadastro.");

return;

}



let novoUsuario={


id:Date.now(),

nome:nome,

email:email,

senha:senha,


progresso:{

aulas:0,

jogos:0,

pontos:0

}


};



usuarios.push(novoUsuario);


localStorage.setItem(
"usuarios",
JSON.stringify(usuarios)
);



alert(
"Cadastro realizado com sucesso!"
);



modalCadastro.style.display="none";


entrarUsuario(novoUsuario);



}




// LOGIN


function entrar(){


let email =
emailLogin.value;


let senha =
senhaLogin.value;



let usuario =
usuarios.find(

u=>u.email==email &&
u.senha==senha

);



if(!usuario){


alert(
"Usuário não encontrado. Crie seu cadastro."
);


return;

}



entrarUsuario(usuario);


}





function entrarUsuario(usuario){



localStorage.setItem(

"usuarioLogado",

JSON.stringify(usuario)

);



modalLogin.style.display="none";


btnLogin.innerHTML =
"👤 "+usuario.nome;



}





// clicar no nome

btnLogin.onclick=function(){


let usuario =
JSON.parse(
localStorage.getItem("usuarioLogado")
);



if(usuario){

mostrarPerfil();

}

else{

modalLogin.style.display="flex";

}


}




function mostrarPerfil(){


let usuario =
JSON.parse(
localStorage.getItem("usuarioLogado")
);



nomeUsuario.innerHTML=
usuario.nome;


aulas.innerHTML=
usuario.progresso.aulas;


jogos.innerHTML=
usuario.progresso.jogos;


pontos.innerHTML=
usuario.progresso.pontos;



modalPerfil.style.display="flex";

}





fecharPerfil.onclick=function(){

modalPerfil.style.display="none";

}




function sair(){


localStorage.removeItem(
"usuarioLogado"
);


btnLogin.innerHTML=
"👤 Entrar";


modalPerfil.style.display="none";


}




function excluirConta(){


let usuario =
JSON.parse(
localStorage.getItem("usuarioLogado")
);



usuarios =
usuarios.filter(
u=>u.id!=usuario.id
);



localStorage.setItem(
"usuarios",
JSON.stringify(usuarios)
);



localStorage.removeItem(
"usuarioLogado"
);



alert(
"Conta excluída."
);



location.reload();


}




window.onload=function(){


let usuario =
JSON.parse(
localStorage.getItem("usuarioLogado")
);


if(usuario){

btnLogin.innerHTML=
"👤 "+usuario.nome;

}


}