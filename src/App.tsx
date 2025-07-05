import React from "react";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <header className="mb-8">
        <img
          src="https://avatars.githubusercontent.com/u/118790878"
          alt="Taha Mohammed"
          className="w-32 h-32 rounded-full shadow-lg mx-auto"
        />
        <h1 className="text-4xl font-bold mt-4 text-center">Taha Mohammed</h1>
        <p className="text-lg text-gray-700 text-center">Web Developer | AI Enthusiast</p>
      </header>
      <main className="w-full max-w-xl bg-white shadow-xl rounded-xl p-8">
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2 text-blue-700">About Me</h2>
          <p>
            I am a passionate software engineer who loves building beautiful, performant web apps with React, TypeScript, and modern tools.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2 text-blue-700">Projects</h2>
          <ul className="space-y-4">
            <li>
              <a
                href="https://github.com/Tahactw/project-one"
                className="text-blue-500 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Project One
              </a>
              <span className="ml-2 text-gray-700">A modern, full-stack web application.</span>
            </li>
            <li>
              <a
                href="https://github.com/Tahactw/project-two"
                className="text-blue-500 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Project Two
              </a>
              <span className="ml-2 text-gray-700">A beautiful animated landing page.</span>
            </li>
          </ul>
        </section>
        <section className="mt-8 text-center">
          <a
            href="mailto:taha@example.com"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-800 transition"
          >
            Contact Me
          </a>
        </section>
      </main>
      <footer className="mt-8 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Taha Mohammed. All rights reserved.
      </footer>
    </div>
  );
}