import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SettingsProvider } from '../context/SettingsContext';
import ExamResults from '../components/ExamResults';

const mockQuestions = [
  {
    id: 'T1A01',
    correct: 2,
    refs: '[97.1]',
    question: 'Question 1?',
    answers: ['A', 'B', 'C', 'D']
  },
  {
    id: 'T1A02',
    correct: 1,
    refs: '[97.1]',
    question: 'Question 2?',
    answers: ['A', 'B', 'C', 'D']
  },
  {
    id: 'T1A03',
    correct: 0,
    refs: '[97.1]',
    question: 'Question 3?',
    answers: ['A', 'B', 'C', 'D']
  }
];

const renderWithProvider = (component) => {
  return render(
    <BrowserRouter>
      <SettingsProvider>
        {component}
      </SettingsProvider>
    </BrowserRouter>
  );
};

describe('ExamResults', () => {
  const defaultProps = {
    correct: 2,
    total: 3,
    questions: mockQuestions,
    answers: [2, 1, 0],
    license: 'technician',
    onRestart: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('displays exam complete message', () => {
    renderWithProvider(<ExamResults {...defaultProps} />);
    expect(screen.getByText(/Exam Complete!/)).toBeInTheDocument();
  });

  test('displays correct score percentage', () => {
    renderWithProvider(<ExamResults {...defaultProps} />);
    expect(screen.getByText(/67%/)).toBeInTheDocument();
  });

  test('displays number of correct answers', () => {
    renderWithProvider(<ExamResults {...defaultProps} />);
    expect(screen.getByText(/✓ 2 Correct/)).toBeInTheDocument();
  });

  test('displays number of wrong answers', () => {
    renderWithProvider(<ExamResults {...defaultProps} />);
    expect(screen.getByText(/✗ 1 Wrong/)).toBeInTheDocument();
  });

  test('shows pass message when score >= 74%', () => {
    renderWithProvider(<ExamResults {...defaultProps} correct={3} total={3} answers={[2,1,0]} />);
    expect(screen.getByText(/Great job! You passed!/)).toBeInTheDocument();
  });

  test('shows fail message when score < 74%', () => {
    renderWithProvider(<ExamResults {...defaultProps} correct={1} total={3} answers={[0,0,0]} />);
    expect(screen.getByText(/Keep studying! You need 74% to pass./)).toBeInTheDocument();
  });

  test('has restart button', () => {
    renderWithProvider(<ExamResults {...defaultProps} />);
    expect(screen.getByText(/Restart/)).toBeInTheDocument();
  });

  test('calls onRestart when restart is clicked', () => {
    renderWithProvider(<ExamResults {...defaultProps} />);
    const restartButton = screen.getByText(/Restart/);
    restartButton.click();
    expect(defaultProps.onRestart).toHaveBeenCalled();
  });

  test('has back home button', () => {
    renderWithProvider(<ExamResults {...defaultProps} />);
    expect(screen.getByText(/Back Home/)).toBeInTheDocument();
  });

  test('shows view incorrect button when there are wrong answers', () => {
    renderWithProvider(<ExamResults {...defaultProps} correct={1} total={3} answers={[0,0,0]} />);
    expect(screen.getByText(/View 2 Incorrect/)).toBeInTheDocument();
  });

  test('does not show view incorrect button when all correct', () => {
    renderWithProvider(<ExamResults {...defaultProps} correct={3} total={3} answers={[2,1,0]} />);
    expect(screen.queryByText(/View.*Incorrect/)).not.toBeInTheDocument();
  });
});
