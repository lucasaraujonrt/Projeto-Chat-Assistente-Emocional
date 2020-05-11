var express = require("express");
var router = express.Router();
//recupera config de acesso aos serviços IBM Watson
const ibmWatson = require("../lib/ibmWatsonCredentials");

var multer = require("multer");
var upload = multer();

router.post("/assistant", function (req, res, next) {
  //recupera mensagem de texto e contexto da conversa
  var { text, contextDialog } = req.body;
  context = JSON.parse(contextDialog);
  //constroi json para envio dos dados
  const params = {
    input: { text },
    workspaceId: "3b607fce-12c1-4383-8e91-2eeba7584625",
    context,
  };
  //envia os dados para o serviço e retorna a mensagem
  ibmWatson.assistant.message(params, function (err, response) {
    if (err) res.json({ status: "ERRO", data: err.toString() });
    else res.json({ status: "OK", data: response });
  });
});

router.get("/textToSpeech", async (req, res, next) => {
  try {
    var params = {
      text: req.query.text,
      accept: "audio/mp3",
      voice: "pt-BR_IsabelaVoice",
    };
    const { result } = await ibmWatson.textToSpeech.synthesize(params);
    result.on("response", (response) => {
      response.headers["content-disposition"] = `attachment;
      filename=transcript.audio%2Fmp3`;
    });
    result.on("error", next);
    result.pipe(res);
  } catch (error) {
    res.send(error);
  }
});

router.post("/speechToText", upload.single("audioFile"), function (
  req,
  res,
  next
) {
  var audioStream = req.file;
  var params = {
    audio: audioStream.buffer,
    contextType: "audio/l16; rate=44100",
    interim_results: true,
    model: "pt_BR_BroadbandModel",
  };
  console.log(params);

  ibmWatson.speechToText.recognize(params, function (error, response) {
    if (error)
      res.json({ status: "ERRO", data: error.code + " - " + error.toString() });
    else {
      console.log(JSON.stringify(response.result, null, 2));
      res.json({ status: "OK", data: response });
    }
  });
});

module.exports = router;
