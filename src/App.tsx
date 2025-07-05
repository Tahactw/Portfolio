import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

const projects = [
  {
    title: "Project One",
    description: "A modern, full-stack web application using React, Node.js, and MongoDB.",
    link: "https://github.com/Tahactw/project-one",
    tags: ["React", "Node.js", "MongoDB"]
  },
  {
    title: "Project Two",
    description: "A beautiful landing page built with Tailwind CSS and animation.",
    link: "https://github.com/Tahactw/project-two",
    tags: ["TailwindCSS", "Framer Motion"]
  },
  {
    title: "AI Assistant",
    description: "An AI-powered assistant for productivity and automation.",
    link: "https://github.com/Tahactw/ai-assistant",
    tags: ["AI", "TypeScript"]
  }
];

export default function App() {
  return (
    <main className="font-sans min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
      {/* Header */}
      <header className="py-8 flex flex-col items-center">
        <motion.img
          src="https://avatars.githubusercontent.com/u/118790878"
          alt="Taha Mohammed"
          className="w-32 h-32 rounded-full shadow-lg mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
        />
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-2 text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Taha Mohammed
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Software Engineer | Web Developer | AI Enthusiast
        </motion.p>
        <nav className="flex gap-4 mt-4">
          <a href="https://github.com/Tahactw" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-2xl text-gray-700 hover:text-black transition" />
          </a>
          <a href="https://www.linkedin.com/in/tahactw/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-2xl text-blue-700 hover:text-blue-900 transition" />
          </a>
          <a href="mailto:taha@example.com">
            <FaEnvelope className="text-2xl text-gray-700 hover:text-red-500 transition" />
          </a>
        </nav>
      </header>

      {/* About Section */}
      <section className="max-w-2xl mx-auto my-12 px-4">
        <motion.h2
          className="text-3xl font-bold mb-4 text-blue-800"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          About Me
        </motion.h2>
        <motion.p
          className="text-gray-700 text-lg leading-7"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          I am a passionate software engineer with a love for building modern web applications and experimenting with AI. I enjoy crafting user-friendly interfaces and scalable backend systems. Always eager to learn and collaborate on exciting projects!
        </motion.p>
      </section>

      {/* Projects Section */}
      <section className="max-w-5xl mx-auto my-12 px-4">
        <motion.h2
          className="text-3xl font-bold mb-8 text-blue-800"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          Projects
        </motion.h2>
        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project, i) => (
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              key={project.title}
              className="block rounded-xl shadow-lg bg-white hover:shadow-2xl transition p-6 border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{project.title}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-2xl mx-auto my-16 px-4">
        <motion.h2
          className="text-3xl font-bold mb-4 text-blue-800"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          Contact
        </motion.h2>
        <motion.p
          className="text-lg text-gray-700 mb-6"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          Feel free to reach out if you want to collaborate, have questions, or just want to say hi!
        </motion.p>
        <a
          href="mailto:taha@example.com"
          className="inline-block bg-blue-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-900 transition"
        >
          Say Hello
        </a>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        © {new Date().getFullYear()} Taha Mohammed. All rights reserved.
      </footer>
    </main>
  );
}