/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.

  let res = await axios.get("http://api.tvmaze.com/search/shows", {
    params: {
      q: query
    }
  })


  let show = res.data[0].show;
  let missingImg = "https://tinyurl.com/tv-missing";

  return [{
    id: show.id,
    name: show.name,
    summary: show.summary,
    image: show.image ? show.image.medium : missingImg
  }]
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  // $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}>
           <div class="card-body">
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


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);
  populateShows(shows);

  

});



$("#shows-list").on("click", async function(e) {
  let showID = e.target.parentElement.dataset.showId;
  const target = e.target.parentElement;
  const list = $(e.target.parentElement.children[6]);
  console.log(e.target.parentElement.children[6]);
  
  list.empty();
  list.toggleClass('display-none');
  let episodes = await getEpisodes(showID);
  populateEpisodes(episodes, target);
  
})



/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  let episodes = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  let data = episodes.data;

  return data;

}



function populateEpisodes(episodes, target) {
  // const episodeList = $("#episode-list");
  // let $list = $("<ul>");
  const targetUL = target.children[6];
  

  for (const episode of episodes) {
    let li = document.createElement("li");
    li.innerText = `Season: ${episode.season} (Episode #${episode.number} ${episode.name})`;
    targetUL.append(li);
    // $showsList.append($list);
  }
}