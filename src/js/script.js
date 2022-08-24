//select elements relating to moving toggle buttons
const lessDesign = document.querySelector('#lessDesign');
const designBtnContainer =  document.querySelector('.design__btn-container');
const designBtn = document.querySelector('.design__btn');
const moreDesignCard = document.querySelector('#moreDesign .card');

const lessIllustration = document.querySelector('#lessIllustration');
const illustrationBtnContainer =  document.querySelector('.illustration__btn-container');
const moreIllustrationCard = document.querySelector('#moreIllustration .card');
const illustrationBtn = document.querySelector('.illustration__btn');

//select navbar dropdown elements
const navLinks = document.querySelectorAll('.nav__link');
const navDropDown = document.querySelector('.nav__drop-down');
const navBtn = document.querySelector('.nav__btn');

//select thumbnail images and modal image
const thumbImgs = document.querySelectorAll('.img-thumbnail');
const modalImg = document.querySelector('.modal__img');
const modalSource = document.querySelector('.modal__source');
const modalDialog = document.querySelector('.modal-dialog');
const modalClose = document.querySelector('.modal__close');
const modalTitle = document.querySelector('.modal-title');
const modalText = document.querySelector('.modal__text');

//hide navbar dropdown after selecting a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navBtn.classList.add('collapsed');
        navDropDown.classList.remove('show');
    })
})


//move toggle buttons in design and illustration sections
function moveToggleBtn(btn, btnContainer, lessWrapper, moreWrapper) {
    if (btn.classList.contains('collapsed')) {
        lessWrapper.appendChild(btnContainer);
        if (btn.classList.contains('design__btn')) {
            btn.textContent = 'View more designs';
        } else if (btn.classList.contains('illustration__btn')) {
            btn.textContent = 'View more illustrations';
        }
    } else {
        moreWrapper.appendChild(btnContainer);
        if (btn.classList.contains('design__btn')) {
            btn.textContent = 'View less designs';
        } else if (btn.classList.contains('illustration__btn')) {
            btn.textContent = 'View less illustrations';
        }
    }
}

designBtn.addEventListener('click', () => {
    moveToggleBtn(designBtn, designBtnContainer, lessDesign, moreDesignCard);
});

illustrationBtn.addEventListener('click', () => {
    moveToggleBtn(illustrationBtn, illustrationBtnContainer, lessIllustration, moreIllustrationCard);
});

//set modal image

thumbImgs.forEach(img => {
    img.addEventListener('click', ()=> {
        setModalImg(img);
    })    
})

modalClose.addEventListener('click', ()=> unsetModalImg());

function setModalImg(img) {
        modalTitle.textContent = img.dataset.title;
        modalText.textContent = img.dataset.text;
    if (img.dataset.src) {
        modalDialog.classList.add('modal__landscape');
        modalImg.parentElement.classList.add('modal__max-width');
        modalSource.srcset = img.dataset.webp;
        modalImg.srcset = img.dataset.srcset;
        modalImg.src = img.dataset.src;        
    } else {
        modalSource.srcset = img.dataset.srcset;
        modalImg.srcset = img.srcset;
        modalImg.src = img.src;
    }
    modalImg.alt = img.alt;
};

function unsetModalImg () {
    modalDialog.classList.remove('modal__landscape');
    modalImg.parentElement.classList.remove('modal__max-width');
    modalSource.srcset = '';
    modalImg.srcset = '';
    modalImg.src = ''; 
    modalImg.alt = ''; 
    modalTitle.textContent = '';
    modalText.textContent = '';
}