let recognition = null;
let onResultCallback = null;
let onEndCallback = null;

export const isTtsSupported = () => {
  return 'speechSynthesis' in window;
};

export const isRecognitionSupported = () => {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};

export const getVoices = () => {
  if (!isTtsSupported()) return [];
  return window.speechSynthesis.getVoices();
};

export const speak = (text, rate = 1.0, voiceName = null) => {
  if (!isTtsSupported()) {
    console.warn('Text-to-speech not supported');
    return;
  }

  stop();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.lang = 'en-US';

  if (voiceName) {
    const voices = getVoices();
    const voice = voices.find(v => v.name === voiceName);
    if (voice) {
      utterance.voice = voice;
    }
  }

  window.speechSynthesis.speak(utterance);
};

export const stop = () => {
  if (isTtsSupported()) {
    window.speechSynthesis.cancel();
  }
  if (isRecognitionSupported()) {
    stopListening();
  }
};

export const isSpeaking = () => {
  return isTtsSupported() && window.speechSynthesis.speaking;
};

export const speakQuestionWithLetters = (question, answers, rate = 1.0, voiceName = null) => {
  const answersWithLetters = answers
    .map((answer, index) => `${String.fromCharCode(65 + index)}. ${answer}`)
    .join('. ');
  const text = `${question}. ${answersWithLetters}`;
  speak(text, rate, voiceName);
};

export const startListening = (onResult, onEnd) => {
  if (!isRecognitionSupported()) {
    console.warn('Speech recognition not supported');
    return false;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  onResultCallback = onResult;
  onEndCallback = onEnd;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase().trim();
    const answerIndex = mapSpeechToAnswer(transcript);
    if (onResultCallback) {
      onResultCallback(answerIndex, transcript);
    }
  };

  recognition.onend = () => {
    if (onEndCallback) {
      onEndCallback();
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    if (onEndCallback) {
      onEndCallback();
    }
  };

  recognition.start();
  return true;
};

export const stopListening = () => {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
};

export const isListening = () => {
  return recognition !== null;
};

const mapSpeechToAnswer = (transcript) => {
  const normalized = transcript.replace(/[.\s]/g, '').toLowerCase();

  const patterns = [
    { regex: /^(a|optiona|first|one|1)$/, index: 0 },
    { regex: /^(b|optionb|second|two|2)$/, index: 1 },
    { regex: /^(c|optionc|third|three|3)$/, index: 2 },
    { regex: /^(d|optiond|fourth|four|4)$/, index: 3 },
  ];

  for (const pattern of patterns) {
    if (pattern.regex.test(normalized)) {
      return pattern.index;
    }
  }

  return -1;
};
