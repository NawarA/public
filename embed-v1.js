/*
  The code below adds a paper to the MLSys poster page.
  This code is meant to be run on:
    https://mlsys.org/virtual/2022/poster/{posterId}

  Running this code adds 3 elements to a poster page:
    <div class="container">
      <h3>Paper</h3>
      <iframe
        style="border: 0px; width: 100%; height: 100vh;"
        src="//bytez.com/read/{publisher}/{posterId}?_c={config}"
      />
    </div>
*/

function addPaperToPosterPage(publisher, posterId) {
  // Step 1) Choose a paper

  if (publisher === undefined) {
    publisher = location.hostname.split('.')[0]; 
  }
  
  if (posterId === undefined) {
    // if the developer did not pass a posterId, then:
    // read this page's posterId => https://mlsys.org/virtual/2022/poster/{posterId}
    posterId = location.pathname.slice(location.pathname.lastIndexOf("/") + 1);
  }

  // Step 2) Choose your config
  // As an example, let's just the default config
  const configObj = { v: 1 };
  // save the config as a base64 encoded JSON string. We'll pass config to the iframe
  const config = btoa(JSON.stringify(configObj));

  // Step 3) Load the paper
  const iframe = document.createElement("iframe");
  // style the iframe
  iframe.style.border = 0;
  iframe.style.width = "100%";
  iframe.style.height = "100vh";
  // set the iframe src to the paper
  iframe.src = `https://bytez.com/read/${publisher}/${posterId}?_c=${config}`;

  // the iframe is only visible when a paper loads
  const listenForSuccess = ({ data, origin }) => {
    if (origin.includes("bytez")) {
      if (data === "1") {
        // on success, make the iframe visible
        div.style.removeProperty("display");
      }
      // remove listener
      window.removeEventListener("message", listenForSuccess);
    }
  };
  // listen for iframe success
  window.addEventListener("message", listenForSuccess);

  // Step 4) Add the iframe to the poster page

  // for better styling on the mlsys page, wrap the iframe with a styled div
  // like this => <div class="container"><iframe></div>
  const div = document.createElement("div");
  // the div starts invisible
  div.style.display = "none";
  div.className = "container";

  const h3 = document.createElement("h3");
  h3.textContent = "Paper";

  div.appendChild(h3);
  div.appendChild(iframe);

  // add the container div (with its child iframe) to the page
  document.body.appendChild(div);
}
/*
As a demo, lets load posterId=2026 (torch.fx: Practical Program Capture and Transformation for Deep Learning in Python)
   1) Navigate to the url => https://mlsys.org/virtual/2022/poster/2026
   2) then run addPaperToPosterPage()
*/


if (document.readyState === 'complete') {  
    // if page fully loaded, add paper
  addPaperToPosterPage();
} else {  
  // Loading hasn't finished yet
  document.addEventListener('readystatechange', event => {
    if (event.target.readyState === 'complete') {
      addPaperToPosterPage();
    }
  });
}
