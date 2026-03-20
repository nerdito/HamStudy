import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Play, Pause, RotateCcw, Volume2, ChevronLeft, ChevronRight } from 'lucide-react'
import { 
  textToMorse, 
  getMorseForChar, 
  playMorse, 
  playCharacter,
  getAllCharacters,
  stopAudio,
  SPEED_PRESETS,
  COMMON_WORDS
} from '../utils/morseCode'
import './MorseCode.css'

const PRACTICE_MODES = {
  LETTERS: 'letters',
  NUMBERS: 'numbers',
  WORDS: 'words'
}

function MorseCode() {
  const [mode, setMode] = useState(PRACTICE_MODES.LETTERS)
  const [inputText, setInputText] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [currentChar, setCurrentChar] = useState(null)
  const [morseDisplay, setMorseDisplay] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [_exerciseIndex, setExerciseIndex] = useState(0)
  
  const { letters, numbers } = getAllCharacters()
  
  const getRandomExercise = useCallback(() => {
    if (mode === PRACTICE_MODES.LETTERS) {
      return letters[Math.floor(Math.random() * letters.length)]
    } else if (mode === PRACTICE_MODES.NUMBERS) {
      return numbers[Math.floor(Math.random() * numbers.length)]
    } else {
      return COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]
    }
  }, [mode, letters, numbers])
  
  const startPractice = useCallback(() => {
    const exercise = getRandomExercise()
    setCurrentChar(exercise)
    setMorseDisplay('')
    setShowAnswer(false)
    setFeedback(null)
    setIsPlaying(true)
    
    playCharacter(exercise, speed).then(() => {
      setIsPlaying(false)
    })
  }, [getRandomExercise, speed])
  
  const handleShowAnswer = () => {
    setShowAnswer(true)
    const morse = mode === PRACTICE_MODES.WORDS ? 
      textToMorse(currentChar).map(e => e.morse).join(' ') :
      getMorseForChar(currentChar)
    setMorseDisplay(morse)
  }
  
  const handlePlayAgain = () => {
    setIsPlaying(true)
    if (mode === PRACTICE_MODES.WORDS) {
      playMorse(currentChar, speed).then(() => {
        setIsPlaying(false)
      })
    } else {
      playCharacter(currentChar, speed).then(() => {
        setIsPlaying(false)
      })
    }
  }
  
  const handleInputPlay = async () => {
    if (!inputText.trim()) return
    
    setIsPlaying(true)
    await playMorse(inputText, speed)
    setIsPlaying(false)
  }
  
  const handleModeChange = (newMode) => {
    setMode(newMode)
    setCurrentChar(null)
    setMorseDisplay('')
    setShowAnswer(false)
    setFeedback(null)
    stopAudio()
  }
  
  const handleSkip = () => {
    stopAudio()
    setIsPlaying(false)
    const next = getRandomExercise()
    setCurrentChar(next)
    setMorseDisplay('')
    setShowAnswer(false)
    setFeedback(null)
    setExerciseIndex(prev => prev + 1)
  }
  
  const handleGuess = (guessed) => {
    const correct = guessed.toUpperCase() === currentChar.toUpperCase()
    setFeedback(correct ? 'correct' : 'incorrect')
    
    if (correct) {
      setTimeout(() => {
        handleNext()
      }, 1000)
    }
  }
  
  const handleNext = () => {
    const next = getRandomExercise()
    setCurrentChar(next)
    setMorseDisplay('')
    setShowAnswer(false)
    setFeedback(null)
    setExerciseIndex(prev => prev + 1)
  }
  
  const getCharacterButtons = () => {
    const chars = mode === PRACTICE_MODES.LETTERS ? letters : numbers
    return chars
  }
  
  return (
    <div className="morse-code-container">
      <div className="morse-header">
        <h1>Morse Code Practice</h1>
        <p className="morse-subtitle">Learn and practice Morse code at your own pace</p>
      </div>
      
      <div className="morse-mode-tabs">
        <button 
          className={`mode-tab ${mode === PRACTICE_MODES.LETTERS ? 'active' : ''}`}
          onClick={() => handleModeChange(PRACTICE_MODES.LETTERS)}
        >
          Letters
        </button>
        <button 
          className={`mode-tab ${mode === PRACTICE_MODES.NUMBERS ? 'active' : ''}`}
          onClick={() => handleModeChange(PRACTICE_MODES.NUMBERS)}
        >
          Numbers
        </button>
        <button 
          className={`mode-tab ${mode === PRACTICE_MODES.WORDS ? 'active' : ''}`}
          onClick={() => handleModeChange(PRACTICE_MODES.WORDS)}
        >
          Words
        </button>
      </div>
      
      <div className="morse-section">
        <h2>Practice Mode</h2>
        <p className="morse-instructions">
          Listen to the audio and try to identify the character. Click play to hear it again.
        </p>
        
        {!currentChar ? (
          <button className="btn btn-primary morse-start-btn" onClick={startPractice}>
            <Play size={20} />
            Start Practice
          </button>
        ) : (
          <div className="practice-area">
            <div className={`morse-play-area ${feedback ? feedback : ''}`}>
              {!isPlaying && !showAnswer && (
                <div className="morse-actions">
                  <button className="btn btn-primary" onClick={handlePlayAgain}>
                    <Play size={20} />
                    Play Again
                  </button>
                  <button className="btn btn-secondary" onClick={handleShowAnswer}>
                    Show Answer
                  </button>
                </div>
              )}
              
              {isPlaying && (
                <div className="playing-indicator">
                  <Volume2 size={32} className="pulse" />
                  <span>Playing...</span>
                </div>
              )}
              
              {showAnswer && (
                <div className="answer-reveal">
                  <span className="answer-char">{currentChar}</span>
                  <span className="answer-morse">{morseDisplay}</span>
                  <div className="morse-dots">
                    {morseDisplay.split('').map((dot, i) => (
                      <span key={i} className={`morse-dot ${dot === '.' ? 'dot' : 'dash'}`}>
                        {dot}
                      </span>
                    ))}
                  </div>
                  <div className="feedback-actions">
                    <button className="btn btn-secondary" onClick={handleNext}>
                      Next
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="practice-controls">
              <button className="btn btn-secondary" onClick={handleSkip}>
                <RotateCcw size={20} />
                Skip
              </button>
            </div>
            
            <div className="char-input-section">
              <p>Or type your guess:</p>
              <div className="char-buttons">
                {getCharacterButtons().map(char => (
                  <button
                    key={char}
                    className={`char-btn ${feedback === 'correct' && char === currentChar ? 'correct' : ''} ${feedback === 'incorrect' && char !== currentChar ? 'faded' : ''}`}
                    onClick={() => handleGuess(char)}
                    disabled={!!feedback}
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="morse-section">
        <h2>Encoder Mode</h2>
        <p className="morse-instructions">
          Type a message to hear it in Morse code.
        </p>
        
        <div className="encoder-area">
          <textarea
            className="morse-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message here..."
            rows={3}
          />
          
          <div className="encoder-controls">
            <select 
              className="speed-select"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
            >
              {SPEED_PRESETS.map(preset => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>
            
            <button 
              className="btn btn-primary"
              onClick={handleInputPlay}
              disabled={!inputText.trim() || isPlaying}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              {isPlaying ? 'Playing...' : 'Play'}
            </button>
            
            <button 
              className="btn btn-secondary"
              onClick={() => {
                stopAudio()
                setIsPlaying(false)
              }}
            >
              Stop
            </button>
          </div>
          
          {inputText && (
            <div className="morse-preview">
              <h4>Morse Code Preview:</h4>
              <div className="morse-visual">
                {textToMorse(inputText).map((element, i) => (
                  element.type === 'character' ? (
                    <span key={i} className="morse-char">
                      {element.morse.split('').map((s, j) => (
                        <span key={j} className={s === '.' ? 'dot' : 'dash'}>{s}</span>
                      ))}
                    </span>
                  ) : element.type === 'word-gap' ? (
                    <span key={i} className="word-space"> </span>
                  ) : (
                    <span key={i} className="char-space"> </span>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="morse-section">
        <h2>Morse Code Reference</h2>
        <div className="reference-grid">
          <div className="reference-section">
            <h3>Letters</h3>
            <div className="reference-items">
              {Object.entries({...morseData.letters, ...morseData.numbers}).map(([char, code]) => (
                <div key={char} className="reference-item">
                  <span className="ref-char">{char}</span>
                  <span className="ref-code">{code}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const morseData = {
  letters: {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
    'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
    'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..'
  },
  numbers: {
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
  }
}

export default MorseCode
