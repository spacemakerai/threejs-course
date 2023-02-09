import Grid from "./Grid";

export namespace State {
  export function save(grid: Grid): void {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("gridState", grid.encode());
    const newRelativePathQuery = window.location.pathname + "?" + searchParams.toString();
    history.pushState(null, "", newRelativePathQuery);
  }
  export function load(grid: Grid): void {
    const search = new URLSearchParams(window.location.search);
    const encoded = search.get("gridState");
    if (encoded == null) {
      return;
    }
    grid.decode(encoded);
  }
}
