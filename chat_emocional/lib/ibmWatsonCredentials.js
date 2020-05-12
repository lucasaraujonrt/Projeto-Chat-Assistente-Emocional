const AssistantV1 = require("ibm-watson/assistant/v1");
const TextToSpeechV1 = require("ibm-watson/text-to-speech/v1");
const SpeechToTextV1 = require("ibm-watson/speech-to-text/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

// config ibm watson assistant
const assistant = new AssistantV1({
  url: "https://gateway.watsonplatform.net/assistant/api",
  version: "2020-01-04",
  authenticator: new IamAuthenticator({
    apikey: "P3LteZq2sXyK2UGI_-LchmFA_GI2NFuLjx90fVBOV0jb",
  }),
});

// config ibm watson Text to Speech
const textToSpeech = new TextToSpeechV1({
  authenticator: new IamAuthenticator({
    apikey: "A-RstRgCpCoS8m5guQ97sFEswTKoPFkUJLQTbfYQRccx",
  }),
  url: "https://stream.watsonplatform.net/text-to-speech/api/",
});

// config ibm watson Speech to Text
const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: "SRNUhgmRKwRZt4c1xZRlgOZSTQtWmGcbFnyaTd_fs1kK",
  }),
  url: "https://stream.watsonplatform.net/speech-to-text/api/",
});

module.exports = { assistant, textToSpeech, speechToText };
