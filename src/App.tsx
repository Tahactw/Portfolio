import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'

function App() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="text-center my-8">
        <h1 className="text-4xl font-bold mb-2">Taha Mohammed</h1>
        <p className="text-lg text-gray-600">Software Developer & Portfolio</p>
      </header>
      <main>
        <About />
        <Projects />
        <Contact />
      </main>
      <footer className="text-center text-gray-500 py-8">
        &copy; {new Date().getFullYear()} Taha Mohammed
      </footer>
    </div>
  )
}

export default App