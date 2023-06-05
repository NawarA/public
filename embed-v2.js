/*
The function addPaperToPosterPage adds an iframe containing a paper to a poster page on the MLSys, NeurIPS, or CVPR websites. It is specifically designed to work with the following URLs:
    1 - https://neurips.cc/virtual/{year}/poster/{posterId} => neurips
    2 - https://mlsys.org/virtual/{year}/poster/{posterId} => mlsys
    3 - https://cvpr.thecvf.com/virtual/{year}/poster/{posterId} => cvpr

The script first checks whether the page is running on localhost and exits if it is.
It then checks whether the publisher and posterId have been passed in.
If not, it attempts to extract these from the URL.
It sets a configuration for the paper view, then creates an iframe and sets its source to the paper's URL on the bytez.com site.
Finally, it creates a container div, appends the iframe to it, and appends the div to the document body.
*/

function addPaperToPosterPage(options = {}) {
  let { publisher, posterId, config } = options;
  const iframeId = "bytez-accessible-paper";
  // only load the iframe once per page
  if (document.getElementById(iframeId)) {
    return console.log("already loaded");
  }

  if (publisher === undefined) {
    // If no publisher has been provided, it attempts to extract the publisher from the URL.
    // It's designed to work with the following formats:
    // 1 - https://neurips.cc => neurips
    // 2 - https://mlsys.org => mlsys
    // 3 - https://cvpr.thecvf.com => cvpr

    // Checks whether the current host is localhost.
    const isLocalHost = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/.test(
      location.hostname
    );
    // Exits if running on localhost, as the URL cannot be used to determine the publisher in this case.
    if (isLocalHost) {
      // Logs a message explaining that the 'publisher' value can't be automatically determined from the URL when running on localhost.
      // Asks the developer to provide the 'publisher' value manually in this case.
      return console.log(
        "Running on localhost, the publisher can't be determined automatically from the URL. For example, 'cvpr' from '{cvpr}.thecvf.com'. Please pass the 'publisher' variable when calling this function in the development environment."
      );
    }

    // Extracts the publisher from the hostname.
    [publisher] = location.hostname.split(".");
  }

  if (posterId === undefined) {
    // If no posterId has been provided, it attempts to extract the posterId from the URL.
    posterId = location.pathname.slice(location.pathname.lastIndexOf("/") + 1);
  }

  // Sets a configuration object for the paper view.
  if (config === undefined) {
    config = {
      v: 1,
      disable: ["notes"],
      related: ["references", "conference"]
    };
  }

  // Encodes the configuration object as a base64 string to pass it to the iframe.
  const configParam = encodeURIComponent(btoa(JSON.stringify(config)));

  // Creates an iframe and sets its source to the paper's URL.
  const iframe = document.createElement("iframe");
  iframe.id = iframeId;
  iframe.style.border = 0;
  iframe.style.width = "100%";
  iframe.style.height = "calc( 100vh - 70px )";
  iframe.style.paddingRight = "16px";
  iframe.src = `https://bytez.com/read/${publisher}/${posterId}?_c=${configParam}`;

  // Sets up an event listener to wait for a message from the iframe indicating that the paper has loaded successfully.
  const listenForSuccess = ({ data, origin }) => {
    if (origin.includes("bytez") && (data === "1" || data === "0")) {
      // if data === "1", then paper loaded successfully
      if (data === "1") {
        // If the paper has loaded successfully, the container div is made visible.
        div.style.removeProperty("display");
      } else {
        console.log("failed to load paper");
        // otherwise failed to load, so remove div
        div.parentNode.removeChild(div);
      }
      // The event listener is removed as it's no longer needed.
      window.removeEventListener("message", listenForSuccess);
    }
  };

  // Registers the event listener.
  window.addEventListener("message", listenForSuccess);

  // Creates a div to contain the iframe.
  const div = document.createElement("div");
  div.style.display = "none";
  div.className = "container";

  // Creates a heading for the paper.
  const h3 = document.createElement("h3");
  h3.textContent = "Paper";

  // Adds the heading and the iframe to the container div.
  div.appendChild(h3);
  div.appendChild(iframe);

  // Adds the container div to the document body.
  document.body.appendChild(div);
}

// The function is called when the document has finished loading.
if (document.readyState === "complete") {
  addPaperToPosterPage();
} else {
  let waitForPageToLoad = event => {
    if (event.target.readyState === "complete") {
      // when page is loaded, clean up
      document.removeEventListener("readystatechange", waitForPageToLoad);
      waitForPageToLoad = undefined;
      // run addPaperToPosterPage
      addPaperToPosterPage();
    }
  };
  // If the document has not yet finished loading, an event listener is added to call the function when it does.
  document.addEventListener("readystatechange", waitForPageToLoad);
}
