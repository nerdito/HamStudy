import morseData from '../data/morse.json'

const DOT_DURATION = 150
const DASH_DURATION = DOT_DURATION * 3
const INTRA_CHAR_GAP = DOT_DURATION
const INTER_CHAR_GAP = DOT_DURATION * 3
const WORD_GAP = DOT_DURATION * 7
const FREQUENCY = 700

let audioContext = null

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

export function getAllCharacters() {
  const letters = Object.keys(morseData.letters)
  const numbers = Object.keys(morseData.numbers)
  return { letters, numbers }
}

export function textToMorse(text) {
  const result = []
  const upperText = text.toUpperCase()
  
  for (let i = 0; i < upperText.length; i++) {
    const char = upperText[i]
    
    if (char === ' ') {
      result.push({ type: 'word-gap' })
      continue
    }
    
    if (result.length > 0 && result[result.length - 1].type !== 'word-gap') {
      result.push({ type: 'inter-char-gap' })
    }
    
    let morse = null
    
    if (morseData.letters[char]) {
      morse = morseData.letters[char]
    } else if (morseData.numbers[char]) {
      morse = morseData.numbers[char]
    } else if (morseData.prosigns[char]) {
      morse = morseData.prosigns[char]
    } else if (morseData.punctuation[char]) {
      morse = morseData.punctuation[char]
    }
    
    if (morse) {
      result.push({ type: 'character', morse, char })
    }
  }
  
  return result
}

export function getMorseForChar(char) {
  const upperChar = char.toUpperCase()
  return morseData.letters[upperChar] || 
         morseData.numbers[upperChar] || 
         morseData.prosigns[upperChar] ||
         morseData.punctuation[upperChar] || null
}

export function playTone(ctx, startTime, duration) {
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(FREQUENCY, startTime)
  
  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(0.5, startTime + 0.01)
  gainNode.gain.setValueAtTime(0.5, startTime + duration - 0.01)
  gainNode.gain.linearRampToValueAtTime(0, startTime + duration)
  
  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)
  
  oscillator.start(startTime)
  oscillator.stop(startTime + duration)
}

export async function playMorse(text, speed = 1.0, onProgress = null) {
  const ctx = getAudioContext()
  
  if (ctx.state === 'suspended') {
    await ctx.resume()
  }
  
  const morseElements = textToMorse(text)
  let currentTime = ctx.currentTime + 0.1
  let charIndex = 0
  
  for (const element of morseElements) {
    switch (element.type) {
      case 'word-gap':
        currentTime += (WORD_GAP - INTER_CHAR_GAP) / 1000 / speed
        charIndex++
        break
      case 'inter-char-gap':
        currentTime += (INTER_CHAR_GAP - INTRA_CHAR_GAP) / 1000 / speed
        break
      case 'character':
        for (let i = 0; i < element.morse.length; i++) {
          const signal = element.morse[i]
          const isDot = signal === '.'
          const duration = (isDot ? DOT_DURATION : DASH_DURATION) / 1000 / speed
          
          playTone(ctx, currentTime, duration)
          currentTime += duration
          
          if (i < element.morse.length - 1) {
            currentTime += INTRA_CHAR_GAP / 1000 / speed
          }
          
          if (onProgress) {
            onProgress(charIndex, i + 1, element.morse.length)
          }
        }
        charIndex++
        break
    }
  }
  
  return (currentTime - ctx.currentTime) * 1000
}

export async function playCharacter(char, speed = 1.0) {
  const morse = getMorseForChar(char)
  if (!morse) return 0
  
  const ctx = getAudioContext()
  
  if (ctx.state === 'suspended') {
    await ctx.resume()
  }
  
  let currentTime = ctx.currentTime + 0.1
  
  for (let i = 0; i < morse.length; i++) {
    const signal = morse[i]
    const isDot = signal === '.'
    const duration = (isDot ? DOT_DURATION : DASH_DURATION) / 1000 / speed
    
    playTone(ctx, currentTime, duration)
    currentTime += duration
    
    if (i < morse.length - 1) {
      currentTime += INTRA_CHAR_GAP / 1000 / speed
    }
  }
  
  return (currentTime - ctx.currentTime) * 1000
}

export function stopAudio() {
  if (audioContext) {
    audioContext.close()
    audioContext = null
  }
}

export const SPEED_PRESETS = [
  { label: 'Slow (5 WPM)', value: 0.5 },
  { label: 'Medium (10 WPM)', value: 1.0 },
  { label: 'Fast (15 WPM)', value: 1.5 },
  { label: 'Very Fast (20 WPM)', value: 2.0 }
]

export const COMMON_WORDS = [
  'CQ', 'DE', 'K', 'QRZ', '73', 'OM', 'YL', 'DX', 'UR', 'HI',
  'HAM', 'RADIO', 'CALL', 'SIGNAL', 'ANTENNA', 'FREQUENCY'
]
