var botao = document.querySelector("#procurar");
botao.addEventListener("click", fazerRequest);

var order = ["title", "start_date", "end_date", "score", "type", "members", "id", "rating"];

//usei a api jikan: https://jikan.moe/ para pegar dados sobre animes de acordo com os inputs do user
function fazerRequest(){
    //criar um request (como no exemplo da documentação da api)
    let request = new XMLHttpRequest();
    
    let argumentos = "";
    //concatenar os valores na string de arumentos que vai ser passada para o request
    let genre = document.querySelector("#genre").value;
    let type = document.querySelector("#type").value;
    let status = document.querySelector("input[name='status']:checked").value;
    let rated = document.querySelector("#rated").value;
    let order_by = order[Math.floor(Math.random() * order.length)]
    
    if (genre == ""){
        alert("Um gênero deve ser escolhido para que um anime possa ser encontrado!");
        return;
    }
    argumentos = argumentos.concat(`genre=${genre}`);
    if (type != ""){
        argumentos = argumentos.concat(`&type=${type}`);
    }
    if (status != ""){
        argumentos = argumentos.concat(`&status=${status}`);
    }
    if (rated != ""){
        argumentos = argumentos.concat(`&rated=${rated}`);
    }
    argumentos = argumentos.concat(`&order_by=${order_by}`);
    //tem algum jeito mais eficiente de fazer isso, sem fazer tanto hardcode? tem muitos ifs
    
    //fazer o request (como no exemplo da documentação da api)
    request.open('GET', `https://api.jikan.moe/v3/search/anime?${argumentos}&page=1`);
    console.log(`https://api.jikan.moe/v3/search/anime?${argumentos}&page=1`);

    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            //console.log('Status:', this.status);
            //console.log('Headers:', this.getAllResponseHeaders());
            //console.log('Body:', this.responseText);

            //captar erros
            switch (this.status){
                case 400: alert("Pedido inválido 400."); return;
                case 404: alert("Nada foi encontrado 404."); return;
                case 405: alert("Erro 405."); return;
                case 429: alert("Espere um pouco, você está fazendo muitos pedidos 429."); return;
                case 500: alert("API com problemas, tente novamente mais tarde 500."); return;
                case 503: alert("MyAnimeList com problemas, tente novamente mais tarde 503."); return;
            }
            
            //salva a resposta, parse e seleciona um anime aleatorio entre os 10
            let resposta = this.responseText;
            let dados = JSON.parse(resposta);
            let qt = dados.results.length;
            let anime = dados.results[Math.floor(Math.random() * qt)];
            console.log(anime);

            //mostra o anime
            document.querySelector("#resultado_h1").hidden = false;
            document.querySelector("#resultado").hidden = false;
            document.querySelector("#resultado_imagem").src = anime["image_url"];
            document.querySelector("#resultado_url").href = anime["url"];
            document.querySelector("#resultado_titulo").innerHTML = anime["title"];
            document.querySelector("#resultado_sinopse").innerHTML = anime["synopsis"];
            document.querySelector("#resultado_type").innerHTML = "Tipo: "+anime["type"];
            document.querySelector("#resultado_rated").innerHTML = "Classificação etária: "+anime["rated"];
            document.querySelector("#resultado_score").innerHTML = "Nota no MyAnimeList: "+anime["score"]+"/10";

        }
    };

    request.send();
    
}