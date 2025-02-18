document.getElementById("search-btn").addEventListener("click", searchMovie);
document.getElementById("dark-mode-toggle").addEventListener("change", toggleDarkMode);

let page = 1;
let currentSearch = "";
let isLoading = false;

//dark mode toggle functions
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark");
    document.getElementById("dark-mode-toggle").checked = true;
}
function toggleDarkMode() {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", document.body.classList.contains("dark") ? "enabled" : "disabled");
}


function searchMovie() {
    currentSearch = document.getElementById("search-input").value.trim();
    page = 1;
    document.getElementById("movie-container").innerHTML = "";
    loadMovies();
}

function loadMovies() {
    if (isLoading) return; 
    isLoading = true;
    document.getElementById("loading").style.display = "block"; //displays loading signal

    let apiKey = "6824cf00";

    fetch(`https://www.omdbapi.com/?s=${currentSearch}&page=${page}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("loading").style.display = "none";
            isLoading = false; //once response is fetched, loading signal disappears

            if (data.Response === "True") {
                data.Search.forEach(movie => {
                    const movieCard = document.createElement("div");
                    movieCard.classList.add("movie-card");
                    movieCard.dataset.imdbID = movie.imdbID; // Add movie ID to dataset

                    movieCard.innerHTML = `
                        <img src="${movie.Poster !== "N/A" ? movie.Poster : "no-image.png"}" alt="${movie.Title}">
                        <h3 class="movie-title">${movie.Title}</h3>
                        <p class="movie-year">${movie.Year}</p>
                        <button class="fav-btn" onclick="addToFavorites('${movie.imdbID}', '${movie.Title}', '${movie.Poster}', '${movie.Year}')">❤️ Add to Favorites</button>
                    `;

                    movieCard.addEventListener("click", () => {
                        window.location.href = `movie.html?id=${movie.imdbID}`;
                    });

                    document.getElementById("movie-container").appendChild(movieCard);
                });

                page++;
            }
        })
        .catch(error => {
            console.error("Fetch Error:", error);
            isLoading = false;
            document.getElementById("loading").style.display = "none";
        });
}


function addToFavorites(imdbID, title, poster, year) 
{
    const movieToAdd = {
        imdbID,
        Title: title || "Unknown Title",
        Poster: poster !== "N/A" ? poster : "no-image.png",
        Year: year || "Unknown Year"
    };

    let favorites = JSON.parse(localStorage.getItem("favoriteMovies")) || []; //initial movies saved

    if (!favorites.some(movie => movie.imdbID === imdbID)) {
        favorites.push(movieToAdd);
        localStorage.setItem("favoriteMovies", JSON.stringify(favorites));
        alert(`${title} added to favorites!`);
    } 
    else {
        alert(`${title} is already in favorites.`);
    }
}

//infinite scrolling
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) //if user has scrolled to the bottom to page, loads more movies
    {
        loadMovies();
    }
});
