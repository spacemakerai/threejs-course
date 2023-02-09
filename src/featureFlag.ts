const search = new URLSearchParams(window.location.search);
if (search.has("optimize")) {
  const button = document.getElementById("search") as HTMLButtonElement;
  button.hidden = false;
}

if (search.has("analyze")) {
  const div = document.getElementById("analysisScores") as HTMLDivElement;
  div.hidden = false;
}

export {};
