const lessDesign = document.querySelector('#lessDesign');
const designBtnContainer =  document.querySelector('.design__btn-container');
const designBtn = document.querySelector('.design__btn');
const moreDesignCard = document.querySelector('#moreDesign .card');

const lessIllustration = document.querySelector('#lessIllustration');
const illustrationBtnContainer =  document.querySelector('.illustration__btn-container');
const moreIllustrationCard = document.querySelector('#moreIllustration .card');
const illustrationBtn = document.querySelector('.illustration__btn');

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