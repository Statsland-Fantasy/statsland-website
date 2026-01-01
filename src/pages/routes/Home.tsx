import { CharacterSheet } from "./CharacterSheet";
import "./Home.css";

export function Home() {
  return (
    <div className="App">
      <div>
        <section className="content">
          <h2>Home</h2>
          <p> Welcome to the Bizarro Fantasy Sports Home Page!</p>
        </section>
        <section className="content">
          <h2>News</h2>
          <CharacterSheet />
        </section>
      </div>

      <footer className="footer">
        <p>
          © {new Date().getFullYear()} Bizarro Fantasy Sports. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
