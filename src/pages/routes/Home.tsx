import { NavLink } from "react-router";
import "./Home.css";
import "../../global.css";
import { MapContainer } from "@/features/park-map/MapContainer";

export function Home() {
  return (
    <div className="App">
      <div>
        <section className="content">
          <h2>Home</h2>
          <p>Welcome to the Statsland Home Page!</p>
        </section>
        <section className="content">
          <h2>Message for Testers</h2>
          <p>
            Hi! Thank you for testing my website and first attraction of
            Statsland
          </p>
          <NavLink to="/athlete-unknown" style={{ fontSize: "2rem" }}>
            ATHLETE UNKNOWN
          </NavLink>

          <MapContainer />

          <p>
            What is ready right now and what I'd like you to test the
            functionality of the game and the aesthetic of the game, both in
            feeling immersive in its theme and its practical ease of playing.
          </p>
          <p>
            What's NOT ready yet or needs to be cleaned up that I'm aware of:
          </p>
          <ul>
            <li>
              Desktop web view. Only mobile is correctly formatted right now.
              (Mobile is where I'm guessing most of the users will play on,
              being a free, quick, daily mobile trivia game, so I prioritized
              this first.)
            </li>
            <li>
              The rest of the website is not ready yet, including this page. A
              formal logo, color scheme, and fonts are coming soon!
            </li>
          </ul>
        </section>
      </div>

      <footer className="footer">
        <p>
          © {new Date().getFullYear()} Statsland Fantasy. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
