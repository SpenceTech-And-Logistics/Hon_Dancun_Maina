import "./Impact.css";

function Impact() {
  const stats = [
    {
      title: "Projects Completed",
      value: "120+",
    },
    {
      title: "Schools Renovated",
      value: "50",
    },
    {
      title: "Healthcare Facilities",
      value: "35",
    },
    {
      title: "Roads Constructed",
      value: "200 KM",
    },
    {
      title: "Citizens Reached",
      value: "500K+",
    },
    {
      title: "Water Projects",
      value: "75",
    },
  ];

  return (
    <div className="impact-page">
      <section className="impact-hero">
        <div className="container">
          <h1>Community Impact</h1>
          <p>
            measuring progress through tangible results and positive change in
            the communities we serve.
          </p>
        </div>
      </section>

      <section className="impact-grid-section">
        <div className="container">
          <div className="impact-grid">
            {stats.map((stat, index) => (
              <div key={index} className="impact-card">
                <h2>{stat.value}</h2>
                <p>{stat.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="impact-story">
        <div className="container">
          <h2>Making a Difference</h2>

          <p>
            Our organization has been dedicated to improving the lives of
            individuals and communities through various initiatives. From
            renovating schools to constructing healthcare facilities, we have
            made a significant impact on the well-being of countless people. Our
            efforts have reached over 500,000 citizens, providing them with
            better access to education, healthcare, and essential services. We
            are committed to continuing our work and creating a lasting positive
            change in the communities we serve.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Impact;
