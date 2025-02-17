document.getElementById("search-btn").addEventListener("click", searchMovie);

function searchMovie() {
    const name = document.getElementById("search-input").value;
    const apiKey = "6824cf00"; 
    const url = `https://www.omdbapi.com/?s=${name}&apikey=${apiKey}`;
    console.log("API URL:", url);

    document.getElementById("movie-container").innerHTML = "";
    document.getElementById("loading").style.display = "block";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById("loading").style.display = "none";

            if (data.Response === "True") {
                data.Search.forEach(movie => {
                    const movieCard = document.createElement("div");
                    movieCard.classList.add("movie-card");
                    movieCard.innerHTML = `
                        <img src="${movie.Poster !== "N/A" ? movie.Poster : "no-image.png"}" alt="${movie.Title}">
                        <h3>${movie.Title}</h3>
                        <p>${movie.Year}</p>
                    `;
                    document.getElementById("movie-container").appendChild(movieCard);
                });
            } else {
                document.getElementById("movie-container").innerHTML = `<p>${data.Error}</p>`;
            }
        })
        .catch(error => {
            document.getElementById("loading").style.display = "none";
            console.error("Fetch Error:", error);
        });
}
