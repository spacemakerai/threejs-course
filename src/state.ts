import Grid from "./Grid";

export namespace State {
  export function save(grid: Grid): void {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("gridState", grid.encode());
    const newRelativePathQuery = window.location.pathname + "?" + searchParams.toString();
    history.pushState(null, "", newRelativePathQuery);
  }
  export function load(): Grid | undefined {
    const search = new URLSearchParams(window.location.search);
    const encoded = search.get("gridState");
    if (encoded == null) {
      return;
    }
    const grid = new Grid();
    grid.decode(encoded);
    return grid;
  }
}
