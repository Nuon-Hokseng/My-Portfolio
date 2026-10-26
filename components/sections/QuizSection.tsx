"use client";

import { useScrollAnimation } from "hooks/useScrollAnimation";
import { useState } from "react";

type Question = {
  q: string;
  options: string[];
  answer: number; // index of correct option
  fact: string; // fun reveal shown after answering
};

const questions: Question[] = [
  {
    q: "Which of these is NOT one of my hobbies?",
    options: ["Running 🏃", "Gaming 🎮", "Skydiving 🪂", "Sleeping 😴"],
    answer: 2,
    fact: "No skydiving here — I recharge with running, gaming, movies, and (let's be honest) a lot of sleeping.",
  },
  {
    q: "What's my go-to tech stack?",
    options: ["PHP + jQuery", "Next.js + TypeScript", "WordPress only", "Pure HTML"],
    answer: 1,
    fact: "Next.js + TypeScript is home base — I love the modern JS/TS ecosystem.",
  },
  {
    q: "Where am I studying Software Engineering?",
    options: [
      "Kirirom Institute of Technology",
      "MIT",
      "Self-taught only",
      "Hogwarts",
    ],
    answer: 0,
    fact: "Kirirom Institute of Technology — learning by building real projects.",
  },
  {
    q: "I built a real system for an optical store. What was it?",
    options: [
      "A dating app",
      "A POS & inventory system",
      "A weather bot",
      "A video game",
    ],
    answer: 1,
    fact: "A full POS & inventory platform — sales, stock, and analytics in one dashboard.",
  },
  {
    q: "In 2019–2020 I took first place in a competition. Which one?",
    options: [
      "A chess tournament",
      "A debate championship",
      "A hackathon",
      "A cooking contest",
    ],
    answer: 1,
    fact: "A debate championship at American Bridge International School, across its 20 branches. 🏆",
  },
];

function rank(score: number, total: number) {
  const pct = score / total;
  if (pct === 1) return { title: "Soulmate-level 🧠💯", msg: "You nailed every single one. Are you sure we haven't met?" };
  if (pct >= 0.6) return { title: "We'd get along great 🤝", msg: "You really get me. Let's grab a coffee and talk code." };
  if (pct >= 0.3) return { title: "Getting to know me 🙂", msg: "Not bad! Scroll around and you'll learn the rest." };
  return { title: "Total stranger 👀", msg: "Ha! Give it another shot — I'm not that mysterious." };
}

export default function QuizSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[current];
  const answered = selected !== null;

  const choose = (i: number) => {
    if (answered) return;
    setSelected(i);
    if (i === question.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  return (
    <section
      id="play"
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6 py-20"
    >
      <div className="max-w-2xl w-full space-y-12">
        <div
          className={`text-center space-y-4 transform transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-balance">
            How Well Do You <span className="text-accent">Know Me?</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A quick 5-question game — let's see how much you can guess 👇
          </p>
        </div>

        <div
          className={`rounded-2xl border border-muted bg-card/70 backdrop-blur-sm p-8 shadow-lg transform transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "150ms" }}
        >
          {!finished ? (
            <div className="space-y-6">
              {/* progress */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  Question {current + 1} / {questions.length}
                </span>
                <span className="text-sm font-semibold text-accent">
                  Score: {score}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-500"
                  style={{ width: `${((current + (answered ? 1 : 0)) / questions.length) * 100}%` }}
                />
              </div>

              <h3 className="text-xl font-bold text-foreground">{question.q}</h3>

              <div className="grid gap-3">
                {question.options.map((opt, i) => {
                  const isCorrect = i === question.answer;
                  const isPicked = i === selected;
                  let style =
                    "border-muted bg-background hover:border-accent hover:bg-accent/5";
                  if (answered && isCorrect)
                    style = "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400";
                  else if (answered && isPicked)
                    style = "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400";
                  else if (answered) style = "border-muted opacity-60";
                  return (
                    <button
                      key={opt}
                      onClick={() => choose(i)}
                      disabled={answered}
                      className={`flex items-center justify-between text-left px-5 py-3.5 rounded-xl border font-medium transition-all duration-200 ${style} ${!answered ? "cursor-pointer" : "cursor-default"}`}
                    >
                      <span>{opt}</span>
                      {answered && isCorrect && <span>✅</span>}
                      {answered && isPicked && !isCorrect && <span>❌</span>}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-sm text-muted-foreground bg-muted/40 rounded-xl p-4 leading-relaxed">
                    💡 {question.fact}
                  </p>
                  <button
                    onClick={next}
                    className="w-full px-6 py-3 rounded-xl bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
                  >
                    {current + 1 < questions.length ? "Next question →" : "See my result 🎉"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-5 animate-fade-in">
              <div className="text-6xl">{score === questions.length ? "🏆" : "🎉"}</div>
              <div className="text-5xl font-bold text-accent">
                {score} / {questions.length}
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {rank(score, questions.length).title}
              </h3>
              <p className="text-muted-foreground">{rank(score, questions.length).msg}</p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={restart}
                  className="px-6 py-3 rounded-xl bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
                >
                  Play again 🔁
                </button>
                <a
                  href="#contact"
                  className="px-6 py-3 rounded-xl border border-muted-foreground/40 text-foreground font-semibold hover:border-accent hover:text-accent transition-colors"
                >
                  Now let's connect →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
