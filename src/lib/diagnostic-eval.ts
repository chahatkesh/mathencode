import type { DiagnosticAnswerReview } from "~/types";

export interface EvalQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface EvalAnswer {
  questionId: string;
  selectedIndex: number | null;
}

export function isCompleteQuestion(question: {
  prompt?: string;
  options?: string[];
  correctIndex?: number;
}) {
  const correctIndex = question.correctIndex;
  return (
    Boolean(question.prompt?.trim()) &&
    Array.isArray(question.options) &&
    question.options.length === 4 &&
    question.options.every((option) => option.trim().length > 0) &&
    typeof correctIndex === "number" &&
    Number.isInteger(correctIndex) &&
    correctIndex >= 0 &&
    correctIndex <= 3
  );
}

export function isReadyTest(test: {
  published?: boolean;
  timeLimitMinutes?: number | null;
  questions?: Array<{
    prompt?: string;
    options?: string[];
    correctIndex?: number;
  }>;
}) {
  const minutes = test.timeLimitMinutes;
  return Boolean(
    test.published &&
    typeof minutes === "number" &&
    Number.isInteger(minutes) &&
    minutes >= 1 &&
    minutes <= 180 &&
    test.questions &&
    test.questions.length > 0 &&
    test.questions.every((question) => isCompleteQuestion(question)),
  );
}

export function evaluateDiagnostic(
  questions: EvalQuestion[],
  answers: EvalAnswer[],
):
  | {
      ok: true;
      results: {
        totalQuestions: number;
        correct: number;
        incorrect: number;
        unanswered: number;
        percentage: number;
      };
      questions: DiagnosticAnswerReview[];
    }
  | { ok: false; message: string } {
  const known = new Set(questions.map((question) => question.id));
  const seen = new Set<string>();

  for (const answer of answers) {
    if (seen.has(answer.questionId)) {
      return {
        ok: false,
        message: "Each question can only be answered once.",
      };
    }
    seen.add(answer.questionId);
    if (!known.has(answer.questionId)) {
      return {
        ok: false,
        message: "This test was updated. Refresh the page and start again.",
      };
    }
    if (
      answer.selectedIndex !== null &&
      (!Number.isInteger(answer.selectedIndex) ||
        answer.selectedIndex < 0 ||
        answer.selectedIndex > 3)
    ) {
      return { ok: false, message: "One of the answers is invalid." };
    }
  }

  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  const reviewed = questions.map((question) => {
    const answer = answers.find((item) => item.questionId === question.id);
    const selectedIndex = answer ? answer.selectedIndex : null;
    let isCorrect = false;

    if (selectedIndex === null) {
      unanswered += 1;
    } else if (selectedIndex === question.correctIndex) {
      correct += 1;
      isCorrect = true;
    } else {
      incorrect += 1;
    }

    return {
      questionId: question.id,
      prompt: question.prompt,
      options: [...question.options],
      correctIndex: question.correctIndex,
      selectedIndex,
      explanation: question.explanation?.trim() ?? "",
      isCorrect,
    };
  });

  const totalQuestions = questions.length;
  const percentage =
    totalQuestions === 0 ? 0 : Math.round((correct / totalQuestions) * 100);

  return {
    ok: true,
    results: {
      totalQuestions,
      correct,
      incorrect,
      unanswered,
      percentage,
    },
    questions: reviewed,
  };
}
