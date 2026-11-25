"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
const Quiz = dynamic(() => import("./QuizSection"), {
  loading: () => (
    <p className="extra-body" role="status">
      Loading quiz…
    </p>
  ),
});
const Game = dynamic(() => import("./GameSection"), {
  loading: () => (
    <p className="extra-body" role="status">
      Loading game…
    </p>
  ),
  ssr: false,
});
export default function ExtrasSection() {
  const [quiz, setQuiz] = useState(false);
  const [game, setGame] = useState(false);
  return (
    <section className="extras wrap" id="extras" aria-labelledby="extras-title">
      <div>
        <p className="eyebrow">07 / Beyond work</p>
        <h2 id="extras-title">A little more personality.</h2>
        <p>Optional extras, if you have a moment.</p>
      </div>
      <div className="extra-options">
        <details onToggle={(event) => setQuiz(event.currentTarget.open)}>
          <summary>
            <span>01</span>A quick introduction quiz
            <span aria-hidden="true">+</span>
          </summary>
          {quiz && <Quiz />}
        </details>
        <details onToggle={(event) => setGame(event.currentTarget.open)}>
          <summary>
            <span>02</span>A small browser game<span aria-hidden="true">+</span>
          </summary>
          {game && <Game />}
        </details>
      </div>
    </section>
  );
}
