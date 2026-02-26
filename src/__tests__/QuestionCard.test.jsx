import { render, screen } from '@testing-library/react';
import { SettingsProvider } from '../context/SettingsContext';
import QuestionCard from '../components/QuestionCard';

const mockQuestion = {
  id: 'T1A01',
  correct: 2,
  refs: '[97.1]',
  question: 'Which of the following is part of the Basis and Purpose of the Amateur Radio Service?',
  answers: [
    'Providing personal radio communications for as many citizens as possible',
    'Providing communications for international non-profit organizations',
    'Advancing skills in the technical and communication phases of the radio art',
    'All these choices are correct'
  ]
};

describe('QuestionCard', () => {
  const defaultProps = {
    question: mockQuestion,
    selectedAnswer: null,
    onAnswer: jest.fn(),
    showResult: false,
    mustClickCorrect: false,
    showAnswer: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders question text', () => {
    render(<QuestionCard {...defaultProps} />);
    expect(screen.getByText(/Which of the following is part of/i)).toBeInTheDocument();
  });

  test('renders all answer options', () => {
    render(<QuestionCard {...defaultProps} />);
    expect(screen.getByText(/Providing personal radio communications/i)).toBeInTheDocument();
    expect(screen.getByText(/Providing communications for international/i)).toBeInTheDocument();
    expect(screen.getByText(/Advancing skills in the technical/i)).toBeInTheDocument();
    expect(screen.getByText(/All these choices are correct/i)).toBeInTheDocument();
  });

  test('calls onAnswer when answer is clicked', () => {
    render(<QuestionCard {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    buttons[0].click();
    expect(defaultProps.onAnswer).toHaveBeenCalledWith(0);
  });

  test('highlights selected answer', () => {
    render(<QuestionCard {...defaultProps} selectedAnswer={1} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[1]).toHaveClass('selected');
  });

  test('shows correct answer when showResult is true', () => {
    render(<QuestionCard {...defaultProps} showResult={true} selectedAnswer={0} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[2]).toHaveClass('correct');
  });

  test('shows incorrect answer when showResult is true and wrong answer selected', () => {
    render(<QuestionCard {...defaultProps} showResult={true} selectedAnswer={0} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveClass('incorrect');
  });

  test('enables correct answer when mustClickCorrect is true', () => {
    // When mustClickCorrect is true, only the correct answer should be clickable
    render(<QuestionCard {...defaultProps} showResult={true} mustClickCorrect={true} selectedAnswer={0} />);
    const buttons = screen.getAllByRole('button');
    // The correct answer (index 2) should NOT be disabled
    expect(buttons[2]).not.toBeDisabled();
  });

  test('shows result indicator when showResult is true', () => {
    render(<QuestionCard {...defaultProps} showResult={true} selectedAnswer={2} />);
    expect(screen.getByText(/✓ Correct!/)).toBeInTheDocument();
  });

  test('shows incorrect result indicator when wrong answer', () => {
    render(<QuestionCard {...defaultProps} showResult={true} selectedAnswer={0} />);
    expect(screen.getByText(/✗ Incorrect/)).toBeInTheDocument();
  });
});
