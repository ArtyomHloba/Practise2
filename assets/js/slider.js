const slides = [
    {
        src: './assets/img/zp-img-1.jpg',
        alt: 'landscape1',
    },
    {
        src: './assets/img/zp-img-2.jpg',
        alt: 'landscape2',
    },
    {
        src: './assets/img/zp-img-3.jpg',
        alt: 'landscape3',
    },
    {
        src: './assets/img/zp-img-4.jpg',
        alt: 'landscape4',
    },
    ];
    
    let currentSlideIndex = 0;
    
    
    const sliderImg = document.querySelector(".sliderImg")
    updatesSlider(currentSlideIndex);
    
    const [prevBnt, nextbtn] = document.querySelectorAll('button')
    
    prevBnt.onclick = () => {
        currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    
        updatesSlider(currentSlideIndex);
    };
    
    nextbtn.onclick = () => {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    
        updatesSlider(currentSlideIndex);
    };
    
    function updatesSlider(){
        sliderImg.src = slides[currentSlideIndex].src;
        sliderImg.alt = slides[currentSlideIndex].alt;   
    }
    