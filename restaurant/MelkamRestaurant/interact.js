const images = document.querySelector('.images');
const next = document.querySelector('.right');
const prev = document.querySelector('.left');

next.addEventListener('click', () => {
    images.scrollLeft += 200;
});

prev.addEventListener('click', () => {
    images.scrollLeft -= 200;
});