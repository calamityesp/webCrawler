const printReport(pages) {
  //check for empty pages
  if (Object.keys(pages).length == 0) {
    console.error("Error: no pages to report");
  }

  // Sort the object
  const urls = Object.entries(pages);
  urls.sort((a,b) => b[1] - a[1])
  pages = Object.fromEntries(urls);
  console.log(pages)
}
