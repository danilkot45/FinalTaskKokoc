$(function () {
  $(".slider").slick({
    dots: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
  });
});

$(function () {
  $(".slider-gallary").slick({
    dots: false,
    autoplay: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplaySpeed: 1500,
    responsive: [
      {
        breakpoint: 1100,
        settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
        }
      },
      {
        breakpoint: 968,
        settings: {
            slidesToShow: 2,
            slidesToScroll: 1
        }
      },
      {
        breakpoint: 568,
        settings: {
            slidesToShow: 1,
            slidesToScroll: 1
        }
      }
  ]
  });
});

$(function () {
  $(".slider-testimonials").slick({
    dots: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
  });
});

