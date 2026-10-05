import Hero from "../../components/Hero/Hero";
import ImpactStats from "../../components/ImpactStats/ImpactStats";
import "./Home.css";

function Home() {
  return (
    <>
      <Hero />
      <ImpactStats />
      <section className="about-preview">
        <div className="container">
          <h2>Leadership By Action</h2>
          <p>
            Dedicated to transforming communities through strategic investments
            in healthcare, education,infrastructure and economic empowerment.
          </p>{" "}
        </div>
      </section>
      <section className="featured-projects">
        <div className="container">
          <h2>Featured Projects</h2>
          <div className="project-grid">
            <div className="placeholder-card">Project Card 1</div>
            <div className="placeholder-card">Project Card 2</div>
            <div className="placeholder-card">Project Card 3</div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>See The Difference Being Made</h2>
          <p>
            Explore completed and ongoing projects improving lives across the
            constituency.
          </p>
          <button>View All Projects</button>
        </div>
      </section>
    </>
  );
}
export default Home;
