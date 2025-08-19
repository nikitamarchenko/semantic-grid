"use client";

export function localStorageProvider() {
  // When initializing, we restore the data from `localStorage` into a map.
  const map = new Map(JSON.parse(localStorage.getItem("app-cache") || "[]"));
  const originalSet = map.set;
  map.set = function (key, value) {
    const normalizedKey = typeof key === "string" ? key : JSON.stringify(key);
    // console.log("[CACHE SET]", normalizedKey);
    return originalSet.call(this, key, value);
  };
  // console.log("cache", map);

  // Before unloading the app, we write back all the data into `localStorage`.
  window.addEventListener("beforeunload", () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem("app-cache", appCache);
  });

  // We still use the map for write & read for performance.
  return map;
}
