//variavel para controlar o contexto
var contextDialog = "{}";

function sendMessageToAssistant(textMessage) {
  //se nao recebeu mensagem por parâmetro
  //recupera mensagem digitada pelo usuario
  if (textMessage === undefined || textMessage === "")
    var textMessage = document.chatForm.textMessage.value;

  chat = document.getElementById("chat");

  if (textMessage === undefined || textMessage === "") textMessage = "";
  // exibe mensagem na tela
  else chat.innerHTML +=
    "<div class='voceChatLinha'>" +
    "<div class='voceChatBalao'>" +
    "<p>" + textMessage + "</p>" +
    "</div>" +
    "<img src='/images/voce.png'/>" +
    "</div>";

  //limpa o campo input
  document.chatForm.textMessage.value = "";

  var objDiv = document.getElementById("chat");
  objDiv.scrollTop = objDiv.scrollHeight;

  //post para o serviço watsonAssistant
  $.post("/ibmWatson/assistant",
    { text: textMessage, contextDialog },
    //tratamento de sucesso de processamento do post
    function (returnedData, statusRequest) {
      //se ocorreu algum erro no processamento da API
      if (returnedData.status === "ERRO")
        alert(returnedData.data);
      //caso os dados tenham retornado com sucesso
      else {
        //retorno da API e recupera o contexto para o proximo dialogo
        chat.innerHTML +=
          "<div class='chatLinha'>" +
          "<img src='/images/Anna.png'>" +
          "<div class='chatBalao'>" +
          "<p>" + returnedData.data.result.output.text + "</p>" +
          "</div>" +
          "</div>";
        contextDialog = JSON.stringify(returnedData.data.result.context);

        objDiv.scrollTop = objDiv.scrollHeight;

        //se o browser nao for chrome ou se tiver habilitado o som da pagina
        //chama o servico text to speech, passando o retorno do assistant
        if (
          navigator.userAgent.indexOf("Chrome") === -1 ||
          $("#muteButton").attr("class").match("off")
        )
          sendTextToSpeech(
            JSON.stringify(returnedData.data.result.output.text)
          );
      }
    }
  )
    //tratamento de erro do post
    .fail(function (returnedData) {
      alert("Erro: " + returnedData.status + " " + returnedData.statusText);
    });
}

function sendTextToSpeech(textMessage) {
  //cria elemento de audio do html para tocar o audio da API
  var audioElement = document.createElement("audio");
  // especifica o atributo type do audio
  audioElement.setAttribute("type", "audio/ogg;codecs=opus");
  // define como source do audio o retorno do textToSpeech
  audioElement.setAttribute(
    "src",
    "ibmWatson/textToSpeech?text=" + textMessage
  );
  //toca o audio
  audioElement.play();
}

function sendAudioToSpeechToText(blob) {
  //criar um formulario para enviar o arquivo de audio
  var form = new FormData();
  form.append("audioFile", blob);
  //post para o servico speechToText
  $.ajax({
    url: "ibmWatson/speechToText",
    type: "post",
    data: form,
    processData: false,
    contentType: false,
    //tratamento de erro do post
    error: function (returnedData) {
      alert("Erro: " + returnedData.status + " " + returnedData.statusText);
    },
    //tratamento de sucesso de processamento do post
    success: function (returnedData) {
      //se ocorrer erro no processamento da API
      if (returnedData.status === "ERRO") alert("Erro: " + returnedData);
      //caso os dados tenham retornado com sucesso
      else {
        //recupera a conversao do audio em texto
        if (returnedData.data.result.results[0] != undefined) {
          var retorno = JSON.stringify(
            returnedData.data.result.results[0].alternatives[0].transcript
          ).replace(/"/g, "");
          //envia o texto do audio para obter o retorno do chat
          sendMessageToAssistant(retorno);
        }
      }
    },
  });
}

//envia mensagem quando o usuário pressionar enter
$(document).keypress(function (event) {
  if (event.which == "13") {
    event.preventDefault();
    sendMessageToAssistant();
  }
});

//post para exibir a mensagem de boas vindas do chat
$(document).ready(function () {
  //pedir para habilitar o som, caso for o chrome
  if (navigator.userAgent.indexOf("Chrome") != -1) {
    document
      .getElementById("muteButton")
  }

  sendMessageToAssistant();
});

// permite a execução do som no chrome
function allowAutoPlay() {
  if ($("#muteButton").attr("class") == "fas fa-volume-off") {
    $("#muteButton").attr("class", "fas fa-volume-mute");
  }
  else {
    $("#muteButton").attr("class", "fas fa-volume-off");
  }
}
