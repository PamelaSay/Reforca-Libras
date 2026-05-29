const canvas =
document.getElementById("canvas");

const ctx =
canvas.getContext("2d");

let pontos = 0;

let fase = 1;

/* PONTO CORRETO */

let alvoX = 2;
let alvoY = 3;

/* TAMANHO DOS QUADRADOS */

const tamanho = 40;

/* DESENHAR PLANO */

function desenharPlano(){

    ctx.clearRect(0,0,500,500);

    /* LINHAS */

    for(let i = 0; i <= 500; i += tamanho){

        ctx.beginPath();

        ctx.moveTo(i,0);
        ctx.lineTo(i,500);

        ctx.strokeStyle = "#cccccc";

        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(0,i);
        ctx.lineTo(500,i);

        ctx.stroke();
    }

    /* EIXOS */

    ctx.beginPath();

    ctx.moveTo(250,0);
    ctx.lineTo(250,500);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(0,250);
    ctx.lineTo(500,250);

    ctx.stroke();
}

/* DESENHAR NÚMEROS */

function desenharNumeros(){

    ctx.font = "16px Arial";

    for(let i = -5; i <= 5; i++){

        /* eixo x */

        ctx.fillText(
            i,
            250 + i*tamanho,
            245
        );

        /* eixo y */

        ctx.fillText(
            -i,
            255,
            250 + i*tamanho
        );
    }
}

/* CLIQUE */

canvas.addEventListener("click", function(event){

    const rect =
    canvas.getBoundingClientRect();

    const mouseX =
    event.clientX - rect.left;

    const mouseY =
    event.clientY - rect.top;

    /* CONVERTER */

    let x =
    Math.round((mouseX - 250)/tamanho);

    let y =
    Math.round((250 - mouseY)/tamanho);

    verificar(x,y);
});

/* VERIFICAR */

function verificar(x,y){

    if(x == alvoX && y == alvoY){

        document.getElementById("mensagem")
        .innerHTML = "✅ ACERTOU!";

        pontos += 10;

        document.getElementById("pontos")
        .innerHTML = pontos;

        proximaFase();

    }else{

        document.getElementById("mensagem")
        .innerHTML =
        `❌ Você clicou em (${x},${y})`;
    }
}

/* PRÓXIMA FASE */

function proximaFase(){

    fase++;

    document.getElementById("fase")
    .innerHTML = fase;

    alvoX =
    Math.floor(Math.random() * 9) - 4;

    alvoY =
    Math.floor(Math.random() * 9) - 4;

    document.getElementById("pergunta")
    .innerHTML =
    `Clique no ponto (${alvoX},${alvoY})`;
}

/* INICIAR */

desenharPlano();

desenharNumeros();
