import ContentMode from "./components/ContentMode"
import "./globals.css"

export default function Home() {
  return (
    <main>
      <div className="lorelab">
        <h1>LORELAB</h1>
        <p>Find the story. Cook the story.</p>
        <ContentMode />
      </div>
    </main>
  )
}
