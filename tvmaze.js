async function searchShows(query) {
  const res = await axios.get("http://api.tvmaze.com/search/shows", {
    params: {
      q: query
    }
  })

  const show = res.data[0].show;
  const missingImg = "https://tinyurl.com/tv-missing";

  return [{
    id: show.id,
    name: show.name,
    summary: show.summary,
    image: show.image ? show.image.medium : missingImg
  }]
}




function populateShows(shows) {
  const $showsList = $("#shows-list");

  for (let show of shows) {
    const $item = $(
      `<div class="col-md-6 col-lg-4 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body ${show.id}">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-outline-success">GET EPISODES</button>
             <ul id="episode-list"></ul>
           </div>
         </div>
       </div> 
      `);

    $showsList.append($item);
  }
}



$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  const query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  const shows = await searchShows(query);
  populateShows(shows);

});



$("#shows-list").on("click", async function (e) {

  const showID = e.target.parentElement.classList[1];
  const target = e.target.parentElement;
  const list = $(e.target.parentElement.children[5]);


  list.empty();
  list.toggleClass('display-none');

  const episodes = await getEpisodes(showID);
  populateEpisodes(episodes, target);
})



async function getEpisodes(id) {
  const episodes = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  const data = episodes.data;

  return data;
}



function populateEpisodes(episodes, target) {
  const targetUL = target.children[5];

  for (const episode of episodes) {
    const li = document.createElement("li");
    li.innerText = `Season: ${episode.season} (Episode #${episode.number} ${episode.name})`;
    targetUL.append(li);
  }
}