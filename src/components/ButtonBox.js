import Button from "./Button";
import { Navigation, Pagination, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";

const ButtonBox = ({ buttons }) => {
  return buttons ? (
    <div id="buttoncontainer">
      <Swiper
        id="swiper"
        modules={[Navigation, Pagination, Scrollbar]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
      >
        {buttons.map((button) => (
          <SwiperSlide>
            <Button key={button.id} button={button} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default ButtonBox;
