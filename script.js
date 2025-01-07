document.addEventListener("DOMContentLoaded", () => {
    let size = 1.5;
    const body = document.querySelector("body");
    const quote = document.querySelector(".quote");
    const shuffle = document.querySelector(".shuffle");
    const nextButton = document.querySelector(".next"); // Reference to the Next button
    const quote_text = document.querySelector("blockquote p");
    const cite = document.querySelector("blockquote cite");
    const fonts_buttons = document.querySelectorAll(".settings .fonts button");
    const modes_buttons = document.querySelectorAll(".settings .modes button");
    const size_buttons = document.querySelectorAll(".settings .size button");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    async function updateQuote() {
        try {
            const response = await fetch("https://quoteslate.vercel.app/api/quotes/random");
            const data = await response.json();

            if (response.ok) {
                quote_text.textContent = data.quote;
                cite.textContent = data.author;
            } else {
                quote_text.textContent = "An error occurred";
                console.log(data);
            }
        } catch (error) {
            quote_text.textContent = "Oops! There is a problem with the quotes server.";
            console.log(error);
        }
    }

    async function updateQuoteCustom(f) {
        const response = await fetch(f);
        const data = await response.json();
        if (response.ok && data.length > 0) {
            random_quote = data[Math.floor(Math.random() * data.length - 1) + 1];
            quote_text.textContent = random_quote.content;
            cite.textContent = random_quote.author;
        } else {
            quote_text.textContent = "An error occurred";
            console.log(data);
        }
    }

    function updateStyle() {
        const font = localStorage.getItem('font') || 'sans';
        changeFont(font);

        const mode = localStorage.getItem('mode');
        if (mode) changeMode(mode);

        size = parseFloat(localStorage.getItem('size'), 2) || 1.5;
        setSize(size);
    }

    function changeFont(value) {
        quote.className = value;
        localStorage.setItem('font', value);
    }

    function changeMode(value) {
        body.className = value;
        localStorage.setItem('mode', value);
    }

    function changeSize(value) {
        size = value == "plus" ? size + 0.1 : size - 0.1;
        size = parseFloat(size.toFixed(2))
        setSize(size);
    }

    function setSize(value) {
        quote.style.fontSize = value + 'rem';
        localStorage.setItem('size', value);
    }

    function loadQuote() {
        var url = new URL(window.location);
        var fileUrl = url.searchParams.get("f");
        if (fileUrl == null) {
            updateQuote();
        } else {
            updateQuoteCustom(fileUrl);
        }
    }

    function handleColorSchemeChange(mediaQueryList) {
        if (!localStorage.getItem('mode')) {
            body.className = mediaQueryList.matches ? 'dark' : 'light';
        }
    }

    // Next button functionality
    nextButton.addEventListener("click", () => {
        loadQuote(); // Load a new quote when clicked
    });

    size_buttons.forEach(function(elem) {
        elem.addEventListener("click", () => changeSize(elem.classList.value));
    });

    fonts_buttons.forEach(function(elem) {
        elem.addEventListener("click", () => changeFont(elem.classList.value));
    });

    modes_buttons.forEach(function(elem) {
        elem.addEventListener("click", () => changeMode(elem.classList.value));
    });

    shuffle.addEventListener("click", () => loadQuote());
    prefersDark.addEventListener('change', handleColorSchemeChange);

    updateStyle();
    loadQuote();
    handleColorSchemeChange(prefersDark);

    // Auto-refresh quotes every 5 seconds
    setInterval(loadQuote, 5000);
});
