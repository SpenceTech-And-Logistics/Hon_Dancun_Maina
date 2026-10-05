import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "./ProjectCarousel.css";

function ProjectCarousel({ images }) {
  return (
    <Swiper spaceBetween={50} slidesPerView={1}>
      {images.map((image, index) => (
        <SwiperSlide key={index}>{image}</SwiperSlide>
      ))}
    </Swiper>
  );
}

export default ProjectCarousel;
