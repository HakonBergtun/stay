//1. page loads, the menu is hidden by default (because the CSS will hide it with the 'active'.
//2. user clicks hambuger icon -> active class gets added to navLinks -> css shows menu 
//3. user clicks hamburger menu again -> active class gets removed from navLinks -> css hides menu again>

export function initNavbar() {

                      //goes into html and finds element with id="hamburger" and id="nav-links"
    const hamburger = document.getElementById('hamburger') as HTMLElement | null; 
    const navLinks = document.getElementById('nav-links') as HTMLElement | null;

    //
    if (hamburger && navLinks) { //continue IF only BOTH elements exists in the html, otherwise log an error
        hamburger.addEventListener('click', () => { //this is saying "watch this element and when someone clicks it do this function"
            navLinks.classList.toggle('active'); //this basically means "if the navLinks element has the class 'active', remove it, otherwise add it", like showing and hiding the menu when the hamburger is clicked.
        });
    } else {
        console.error('Hamburger menu or navigation links not found.');
    }
}

