//variavel para controlar o contexto
var contextDialog = "{}";

function sendMessageToAssistant() {
  //recupera mensagem digitada pelo usuario
  if (textMessage === undefined || textMessage === "")
    var textMessage = document.chatForm.textMessage.value;
  chat = document.getElementById("chat");

  if (textMessage === undefined || textMessage === "") textMessage = "";
  // exibe mensagem na tela
  else chat.innerHTML += "Você --> " + textMessage + "<br>";

  //limpa o campo input
  document.chatForm.textMessage.value = "";

  //post para o serviço watsonAssistant
  $.post(
    "/ibmWatson/assistant",
    { text: textMessage, contextDialog },
    //tratamento de sucesso de processamento do post
    function (returnedData, statusRequest) {
      //se ocorreu algum erro no processamento da API
      if (returnedData.status === "ERRO") alert(returnedData.data);
      //caso os dados tenham retornado com sucesso
      else {
        //retorno da API e recupera o contexto para o proximo dialogo
        chat.innerHTML +=
          "Chatbot --> " + returnedData.data.result.output.text + "<br>";
        contextDialog = JSON.stringify(returnedData.data.result.context);

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

//envia mensagem quando o usuário pressionar enter
$(document).keypress(function (event) {
  if (event.which == "13") {
    event.preventDefault();
    sendMessageToAssistant();
  }
});

//post para exibir a mensagem de boas vindas do chat
$(document).ready(function () {
  if (navigator.userAgent.indexOf("Chrome") != -1) {
    document
      .getElementById("muteButton")
      .setAttribute("style", "font-size: 40px;");
    alert("Ative o som se quiser iniciar o dialogo por voz!!");
  }
  sendMessageToAssistant();
});
function allowAutoPlay() {
  $("#muteButton").attr("class", "fas fa-volume-off");
}

function sendTextToSpeech(textMessage) {
  var audioElement = document.createElement("audio");
  audioElement.setAttribute("type", "audio/ogg:codecs=opus");
  audioElement.setAttribute(
    "src",
    "/ibmWatson/textToSpeech?text=" + textMessage
  );
  audioElement.play();
}

function sendAudioToSpeechToText(blob) {
  var form = new FormData();
  form.append("audioFile", blob);
  $.ajax({
    url: "ibmWatson/speechToText",
    type: "post",
    data: form,
    processData: false,
    contextType: false,
    error: function (returnedData) {
      alert("Erro: " + returnedData.status + " " + returnedData.statusText);
    },
    success: function (returnedData) {
      if (returnedData.status === "ERRO") alert("Erro: " + returnedData.data);
      else {
        if (returnedData.data.result.results[0] != undefined) {
          var retorno = JSON.stringify(
            returnedData.data.result.results[0].alternatives[0].transcript
          ).replace(/"/g, "");
          sendMessageToAssistant(retorno);
        }
      }
    },
  });
}
