import "./Gallery.css";
import w1 from "../../assets/images/w1.png";
import w2 from "../../assets/images/w2.png";
import w3 from "../../assets/images/w3.png";
import w4 from "../../assets/images/w4.png";
import w5 from "../../assets/images/w5.png";

function Gallery() {
  const images = [w1, w2, w3, w4, w5];

  return (
    <div className="gallery-page">
      <section className="gallery-hero">
        <div className="container">
          <h1>Media Gallery</h1>
          <p>Explore our work and the impact we've made in the community.</p>
        </div>
      </section>

      <section className="gallery-section">
        <div className="container">
          <div className="gallery-grid">
            {images.map((image, index) => (
              <div key={index} className="gallery-item">
                <img src={image} alt={`Gallery ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Gallery;
