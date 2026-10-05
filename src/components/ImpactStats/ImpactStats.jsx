import "./ImpactStats.css";

function ImpactStats() {
  const stats = [
    {
      value: "100+",
      label: "Projects Completed",
    },
    {
      value: "100K+",
      label: "People Impacted",
    },
    {
      value: "50+",
      label: "Partners Collaborated",
    },
  ];

  return (
    <div className="impact-container">
      <h2 className="impact-heading">Our Impact</h2>
      <div className="impact-stats">
        {stats.map((stat, index) => (
          <div key={index} className="impact-stat">
            <span className="impact-value">{stat.value}</span>
            <span className="impact-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImpactStats;
