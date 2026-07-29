function entrar(){
    let nome = document.getElementById("nome").value
    let senha = document.getElementById("senha").value
    if(nome == "" || senha == ""){
        alert("Preencha todos os campos!")
        return
    }
    localStorage.setItem("usuario", nome)
    alert("Login realizado!")
    window.location.href = "index.html"
}

function voltarPagina(){
    history.back()
}
