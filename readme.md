# API reference

This readme.md shares how to [install](#install) a paper onto a poster page and how to customize the paper experience, including how to [disable](#insdisableins) modules and select [related content](#insrelatedins).

## TOC

1. [Install](#install)
2. [Customize](#customizing)
   - [Config schema](#config-options)
     - [version](#insversionins)
     - [logo](#inslogoins)
     - [disable modules](#insdisableins)
     - [select related content](#insrelatedins)
   - [Code Snippets / Recipes](#snippets)
3. [Example code](#example)

## Install

Adding a paper to a virtual poster takes 3 steps:

1. Create an iframe
2. Select a paper
   - Set the iframe's src to `//bytez-staging.web.app/read/{publisher}/{posterId}`
3. (Optional) Customize the paper using a `_c` parameter
   - `//bytez-staging.web.app/read/{publisher}/{posterId}?_c={config}`

### By default (without customization) papers look like:

![image.png](<https://raw.githubusercontent.com/NawarA/public/main/localhost_3000_read_arxiv_2005.14165%20(3).png>)

### Papers can be customized. For example, below, we added a logo, disabled notes, and have decided to show code, similar papers, and references.

![image.png](https://github.com/NawarA/public/blob/main/Screenshot%202022-09-27%20105234.png?raw=true)

Let's discuss how to customize papers.

## Customizing

To customize/configure a paper, use the `_c` parameter. The `_c` param expects base64 encoded JSON with the following optional properties:

```js
{
  v: 1,
  logo: 'Url',
  disable: ['related','paper','notes'],
  related: [
    'references',
    'conference',
    'code',
    'similar',
    'citations',
    'datasets',
    'videos',
    'blogs',
    'tweets'
  ]
}
```

Once you choose your config, then JSON.stringify the object and base64 encode it.

```js
const json = JSON.stringify({
  v: 1,
  logo: "Url",
  disable: ["related", "paper", "notes"],
  related: [
    "references",
    "conference",
    "code",
    "similar",
    "citations",
    "datasets",
    "videos",
    "blogs",
    "tweets"
  ]
});
const config = btoa(json);
// ready to pass to the _c param
```

Set `_c` param in the iframe src, equal to the base64 encoded JSON string.

```js
iframe.src = `https://bytez-staging.web.app/read/${publisher}/${posterId}?_c=${config}`;
```

## Here's what each config parameter does:

### <ins>Version</ins>

```js
{
  v: 1;
}
```

The version param can be ignored. It's here in case we want to update the config we're using in the future. Set the value to 1 for now.

### <ins>Logo</ins>

```js
{
  logo: "Url";
}
```

Set the logo in the upper left corner. This optional parameter expects a URL to an image or SVG. For example, `https://neurips.cc/static/core/img/NeurIPS-logo.svg` or `https://mlsys.org/static/core/img/MLSys-logo.svg`

### <ins>Disable</ins>

```js
{
  disable: ["related", "paper", "notes"];
}
```

Papers are have 3 modules that are enabled by default: related content (`"related"`), the paper itself (`"paper"`), and the ability to highlight and take notes (`"notes"`). This parameter can optionally be used to disable modules. The parameter expects an array containing any of the following strings `"related"`,`"notes"`, `"paper"`.

Below are examples:

Disable related content

```js
{
  disable: ["related"];
}
```

Disable notes

```js
{
  disable: ["notes"];
}
```

Show only the paper

```js
{
  disable: ["related", "notes"];
}
```

### <ins>Related</ins>

```js
{
  related: [
    "references",
    "conference",
    "code",
    "similar",
    "citations",
    "datasets",
    "videos",
    "blogs",
    "tweets"
  ];
}
```

By default, all related content on the paper is available and displayed next to a paper. The `related` param can optionally be used to filter down which content is displayed. The are several options, which will be described here.

#### `"references"`

Users have 1-click access to references.

###### src: paper

#### `"conference"`

Users have 1-click access to similar papers at the conference.

###### src: conference proceedings

#### `"code"`

Users have 1-click access to official and community code that replicates the research.

###### src: paper, github

#### `"similar"`

Just like `conference`, users have 1-click access to similar papers, though this includes papers outside of the conference.

###### src: citation graph

#### `"citations"`

Users have 1-click access to papers that cite this research paper.

###### src: citation graph

#### `"datasets"`

The datasets used in the paper are displayed to users. Users have 1-click access to datasets.

###### src: paperswithcode; huggingface may be added

#### `"videos"`

Users have access to author and community created videos that summarize/discuss the paper.

###### src: slideslive, youtube

#### `"blogs"`

Users have 1-click access to public discussions/blog posts written about the research paper.

###### src: openreview, towardsdatascience, tensorflow forums, pytorch forums, fast.ai forums, redit forums, stack exchange/stack overflow forums, medium, distil.pub, github

#### `"tweets"`

Users can see Twitter conversational threads discussing the paper

###### src: twitter

#

## Table summarizing params:

| Parameter | Description                                     | Default value        | Possible values                                                                                  |
| --------- | ----------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------ |
| v         | Config version being used                       | 1                    | 1                                                                                                |
| logo      | Display a conference logo                       |                      | URL to an image or SVG                                                                           |
| disable   | Disable the `related`, `paper`, `notes` modules | []                   | ["related","paper", "notes"]                                                                     |
| related   | Choose content displayed in the related section | everything displayed | ['references','conference', 'code', 'similar', 'citations','datasets','videos','blogs','tweets'] |

# Snippets

## Paper only

```js
const json = JSON.stringify({
  v: 1,
  disable: ["notes", "related"]
});
const config = btoa(json);
```

## Paper, without notes, with filtered content

```js
const json = JSON.stringify({
  v: 1,
  disable: ["notes"],
  related: ["references", "conference"]
  // show this paper's references, and show similar papers at the conference
});
const config = btoa(json);
```

## Paper with notes and content

```js
const json = JSON.stringify({
  v: 1,
  related: ["references", "conference", "code", "datasets", "videos"]
  // show this paper's references, similar conference papers, code, 1-click access to datasets, and videos from the author and community summarizing the paper
});
const config = btoa(json);
```

## Default settings

```js
// load everything
const json = JSON.stringify({ v: 1 });
const config = btoa(json);
```

# Example

```js
/*
  The code below adds a paper to the MLSys poster page.
  This code is meant to be run on:
    https://mlsys.org/virtual/2022/poster/{posterId}

  Running this code adds 2 elements to a poster page:
    <div class="container">
      <iframe
        style="border: 0px; width: 100%; height: 100vh;"
        src="//bytez-staging.web.app/read/{publisher}/{posterId}?_c={config}"
      />
    </div>
*/

function addPaperToPosterPage(publisher = "mlsys", posterId) {
  // Step 1) Choose a paper

  if (posterId === undefined) {
    // if the developer did not pass a posterId, then:
    // read this page's posterId => https://mlsys.org/virtual/2022/poster/{posterId}
    posterId = location.pathname.slice(location.pathname.lastIndexOf("/") + 1);
  }

  // Step 2) Choose your config
  const configObj = {
    v: 1,
    // disable notes
    disable: ["notes"],
    // show author presentations, references, and similar papers at this conference
    related: ["videos", "references", "conference"],
    // set the logo
    logo: "https://mlsys.org/static/core/img/MLSys-logo.svg"
  };
  // save the config as a base64 encoded JSON string. We'll pass config to the iframe
  const config = btoa(JSON.stringify(configObj));

  // Step 3) Load the paper
  const iframe = document.createElement("iframe");
  // style the iframe
  iframe.style.border = 0;
  iframe.style.width = "100%";
  iframe.style.height = "100vh";
  // set the iframe src to the paper
  iframe.src = `https://bytez-staging.web.app/read/${publisher}/${posterId}?_c=${config}`;

  // Step 4) Add the iframe to the poster page

  // for better styling on the mlsys page, wrap the iframe with a styled div
  // like this => <div class="container"><iframe></div>
  const div = document.createElement("div");
  div.className = "container";
  const h3 = document.createElement("h3");
  h3.textContent = 'Paper';
  div.appendChild(h3)
  div.appendChild(iframe);

  // add the container div (with its child iframe) to the page
  document.body.appendChild(div);
}
/*
As a demo, lets load posterId=2026 (torch.fx: Practical Program Capture and Transformation for Deep Learning in Python)
   1) Navigate to the url => https://mlsys.org/virtual/2022/poster/2026
   2) then run addPaperToPosterPage()
*/
```
