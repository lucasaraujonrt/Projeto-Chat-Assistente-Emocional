var express = require("express");
var router = express.Router();
//recupera config de acesso aos serviços IBM Watson
const ibmWatson = require("../lib/ibmWatsonCredentials");

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

module.exports = router;
