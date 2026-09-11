//TODO: set highlight color
// set cursor style

async function readJSON(filePath) {
    try {
        const response = await fetch(filePath)

        if (!response.ok) {
            throw new Error(`Failed to load file: ${response.status}`)
        }

        const jsonData = await response.json()
        return jsonData
    } catch (error) {
        console.error('Error reading JSON file:', error)
        throw error
    }
};

const passwordPopup = document.getElementById('password-popup-container');
const passwordForm = document.getElementById('password-form');
const passwordInput = document.getElementById('password');
const msgContainer = document.getElementById('msg-container');
const hint = document.getElementById('hint');
const archiveContainer = document.getElementById('archive-container');
const emailPopupContainer = document.getElementById('email-popup-container');
const homeBtn = document.getElementById('home-btn');
const navBar = document.getElementById('nav-bar');
const backBtn = document.getElementById('back-btn');
const forwardBtn = document.getElementById('forward-btn');

let currentEmailNum = 0;

if (localStorage.getItem("LoggedIn") === "true") {
    passwordPopup.style.display = 'none';
}

function openEmail(emailObj, Arr) {

    emailPopupContainer.replaceChildren();
    currentEmailNum = +emailObj.number;

    const emailIframe = document.createElement('iframe');
    emailIframe.src = emailObj.link;

    emailPopupContainer.appendChild(emailIframe);
    emailPopupContainer.style.display = 'flex';
    navBar.style.zIndex = 5;

    if (emailObj.number == 1) {
        backBtn.style.pointerEvents = 'none';
        backBtn.style.opacity = '0.3';
        forwardBtn.style.pointerEvents = 'auto';
        forwardBtn.style.opacity = '1';
    } else if (emailObj.number == (Arr.length + 1)) { // +1 bc there is no #4
        backBtn.style.pointerEvents = 'auto';
        backBtn.style.opacity = '1';
        forwardBtn.style.pointerEvents = 'none';
        forwardBtn.style.opacity = '0.3';
    } else {
        backBtn.style.pointerEvents = 'auto';
        backBtn.style.opacity = '1';
        forwardBtn.style.pointerEvents = 'auto';
        forwardBtn.style.opacity = '1';
    }

    backBtn.style.visibility = 'visible';
    forwardBtn.style.visibility = 'visible';

};

readJSON('assets/emails.json')
    .then(data => {

        const emails = data.toReversed();
        for (const email of emails) {

            const emailLinkContainer = document.createElement('div');
            emailLinkContainer.classList.add('email-link');
            /* if (email['img-link'] !== "") {
                emailLinkContainer.style.backgroundImage = `linear-gradient(rgba(0, 115, 166, 0.8), rgba(0, 115, 166, 0.8)), url(${email['img-link']})`;
            } else {
                emailLinkContainer.style.backgroundImage = 'linear-gradient(rgba(0, 115, 166, 1), rgba(0, 115, 166, 1))';
            }; */

            const num = document.createElement('div');
            num.classList.add("link-number");
            num.innerHTML = "No. " + email.number;

            const subject = document.createElement('div');
            subject.classList.add("link-subject");
            subject.innerHTML = email.subject;

            const author = document.createElement('div');
            author.classList.add("link-author");
            author.innerHTML = email.author;

            emailLinkContainer.append(num, author, subject);
            archiveContainer.appendChild(emailLinkContainer);

            emailLinkContainer.addEventListener('click', () => {
                openEmail(email, emails);
            });
        }

        homeBtn.addEventListener('click', () => {
            if (emailPopupContainer.style.display !== 'none') {
                navBar.style.zIndex = 2;
                emailPopupContainer.style.display = 'none';
                backBtn.style.visibility = 'hidden';
                forwardBtn.style.visibility = 'hidden';
                emailPopupContainer.replaceChildren();
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });

        backBtn.addEventListener('click', () => {
            if (currentEmailNum == 5) { // bc there is no #4 lol
                currentEmailNum = 4;
            };
            const prevEmail = emails.find(e => e.number == (currentEmailNum - 1))
            if (prevEmail) {
                openEmail(prevEmail, emails);
            };
        });
        forwardBtn.addEventListener('click', () => {
            if (currentEmailNum == 3) { // bc there is no #4 lol
                currentEmailNum = 4;
            };
            const nextEmail = emails.find(e => e.number == (currentEmailNum + 1))
            if (nextEmail) {
                openEmail(nextEmail, emails);
            };
        });
    });

const key = "welcome back"
let attempts = 0;

passwordForm.addEventListener('submit', (e) => {
    if (passwordInput.value == key) {
        passwordPopup.style.display = 'none';
        localStorage.setItem("LoggedIn", "true");
    } else {
        attempts++
        if (attempts > 2) {
            hint.style.visibility = 'visible';
        }
        msgContainer.innerHTML = 'Incorrect password.'
    }
})

