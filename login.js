localStorage.setItem("usuario", nome)
    function entrar(){

    let nome = document.getElementById("nome").value

    localStorage.setItem("usuario", nome)

    window.location.href = "index.html"
}
