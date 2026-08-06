// BOTÃO LOGIN

const btnLogin = document.getElementById("btnLogin");

const modalLogin = document.getElementById("modalLogin");

const fecharLogin = document.getElementById("fecharLogin");


btnLogin.onclick=function(){

    modalLogin.style.display="flex";

}



// fechar login

fecharLogin.onclick=function(){

    modalLogin.style.display="none";

}



// abrir cadastro

const abrirCadastro =
document.getElementById("abrirCadastro");


const modalCadastro =
document.getElementById("modalCadastro");



abrirCadastro.onclick=function(){

    modalLogin.style.display="none";

    modalCadastro.style.display="flex";

}




// fechar cadastro


document.getElementById("fecharCadastro")
.onclick=function(){

modalCadastro.style.display="none";

}



// CADASTRAR


function cadastrar(){


let nome =
document.getElementById("nomeCadastro").value;


let email =
document.getElementById("emailCadastro").value;


let senha =
document.getElementById("senhaCadastro").value;



if(nome=="" || email=="" || senha==""){

alert("Preencha todos os campos");

return;

}



let usuario={

nome:nome,
email:email,
senha:senha,
pontos:0

};



localStorage.setItem(
"usuarioCadastrado",
JSON.stringify(usuario)
);



alert("Cadastro realizado com sucesso!");



modalCadastro.style.display="none";

}





// LOGIN


function login(){


let email =
document.getElementById("emailLogin").value;


let senha =
document.getElementById("senhaLogin").value;



let usuario =
JSON.parse(
localStorage.getItem("usuarioCadastrado")
);



if(!usuario){

alert("Você ainda não possui cadastro.");

return;

}



if(email==usuario.email &&
senha==usuario.senha){



localStorage.setItem(
"usuarioLogado",
JSON.stringify(usuario)
);

document.addEventListener("DOMContentLoaded", () => {
    const modalCadastro = document.querySelector("#modalCadastro .perfil-box");
    if (modalCadastro) {
        const btnGoogle = document.createElement("button");
        btnGoogle.className = "btn-google";
        btnGoogle.innerHTML = `<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google"> Entrar com Google`;
        btnGoogle.onclick = () => {
            // Lógica de autenticação do Google (Firebase/OAuth)
            console.log("Iniciar login com Google");
        };
        modalCadastro.appendChild(btnGoogle);
    }
});


alert("Login realizado!");



modalLogin.style.display="none";



mostrarUsuario();



}

else{


alert("E-mail ou senha incorretos");


}


}




// mostrar nome no menu


function mostrarUsuario(){


let usuario =
JSON.parse(
localStorage.getItem("usuarioLogado")
);



if(usuario){


btnLogin.innerHTML =
"👤 " + usuario.nome;



}


}



window.onload=function(){

mostrarUsuario();

}