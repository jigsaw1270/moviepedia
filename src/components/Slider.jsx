import React  from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

// import './styles.css';

import './Slider.css'

// import required modules
import { EffectCoverflow, Pagination } from 'swiper/modules';

const Slider = () => {
  return (
    <>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 15,
          stretch: 0,
          depth: 300,
          modifier: 1,
          slideShadows: true,
        }}
        loop={true}
        modules={[EffectCoverflow, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src="/posters/poster1.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/posters/poster2.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/posters/poster3.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/posters/poster4.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/posters/poster5.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/posters/poster6.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/posters/poster7.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/posters/poster8.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/posters/poster9.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/posters/poster10.jpg" />
        </SwiperSlide>
      </Swiper>
    </>
  )
}

export default Slider