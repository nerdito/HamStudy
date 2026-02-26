import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsProvider, useSettings } from '../context/SettingsContext';

const TestComponent = () => {
  const { settings, setFontSize, setShowAnswer, saveExamResult, examHistory, clearExamHistory } = useSettings();
  
  return (
    <div>
      <span data-testid="fontSize">{settings.fontSize}</span>
      <span data-testid="showAnswer">{settings.showAnswer.toString()}</span>
      <span data-testid="examHistoryLength">{examHistory.length}</span>
      <button onClick={() => setFontSize('large')}>Set Large</button>
      <button onClick={() => setShowAnswer(true)}>Enable Show Answer</button>
      <button onClick={() => saveExamResult({ license: 'technician', correct: 25, total: 35 })}>Save Result</button>
      <button onClick={() => clearExamHistory()}>Clear History</button>
    </div>
  );
};

describe('SettingsContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('provides default settings', () => {
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );
    
    expect(screen.getByTestId('fontSize')).toHaveTextContent('medium');
    expect(screen.getByTestId('showAnswer')).toHaveTextContent('false');
  });

  test('updates font size', () => {
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );
    
    const button = screen.getByText('Set Large');
    fireEvent.click(button);
    
    expect(screen.getByTestId('fontSize')).toHaveTextContent('large');
  });

  test('updates show answer setting', () => {
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );
    
    const button = screen.getByText('Enable Show Answer');
    fireEvent.click(button);
    
    expect(screen.getByTestId('showAnswer')).toHaveTextContent('true');
  });

  test('saves exam result to history', () => {
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );
    
    expect(screen.getByTestId('examHistoryLength')).toHaveTextContent('0');
    
    const button = screen.getByText('Save Result');
    fireEvent.click(button);
    
    expect(screen.getByTestId('examHistoryLength')).toHaveTextContent('1');
  });

  test('clears exam history', () => {
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );
    
    const saveButton = screen.getByText('Save Result');
    fireEvent.click(saveButton);
    
    expect(screen.getByTestId('examHistoryLength')).toHaveTextContent('1');
    
    const clearButton = screen.getByText('Clear History');
    fireEvent.click(clearButton);
    
    expect(screen.getByTestId('examHistoryLength')).toHaveTextContent('0');
  });

  test('persists settings to localStorage', () => {
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );
    
    const button = screen.getByText('Set Large');
    fireEvent.click(button);
    
    const saved = localStorage.getItem('hamStudySettings');
    const parsed = JSON.parse(saved);
    
    expect(parsed.fontSize).toBe('large');
  });

  test('loads settings from localStorage', () => {
    localStorage.setItem('hamStudySettings', JSON.stringify({ fontSize: 'xlarge', showAnswer: true }));
    
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );
    
    expect(screen.getByTestId('fontSize')).toHaveTextContent('xlarge');
    expect(screen.getByTestId('showAnswer')).toHaveTextContent('true');
  });
});
