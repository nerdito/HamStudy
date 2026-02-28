export const isSupported = () => {
  return 'speechSynthesis' in window;
};

export const speak = (text, rate = 1.0) => {
  if (!isSupported()) {
    console.warn('Text-to-speech not supported');
    return;
  }

  stop();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.lang = 'en-US';
  
  window.speechSynthesis.speak(utterance);
};

export const stop = () => {
  if (isSupported()) {
    window.speechSynthesis.cancel();
  }
};

export const isSpeaking = () => {
  return isSupported() && window.speechSynthesis.speaking;
};

export const speakQuestion = (question, answers, rate = 1.0) => {
  const text = `${question}. ${answers.join('. ')}`;
  speak(text, rate);
};
