//import { normalizeURL, getURLSFromHTML } from "./crawl";

import { argv } from "node:process";
import { crawlPages } from "./crawl.js";

async function main() {
  let baseurl;

  // check for single parameter, return if there is more
  if (argv.length > 3 || argv.length < 3) {
    console.log(
      "You Either have too many, or not enough arguements when running this program",
    );
    return;
  }

  // extract the url from the paramter and log it
  baseurl = argv[2];
  console.log(`Success! BaseURl received with the value: ${argv[2]}`);

  // attempt to fetch the uri given in the parameter
  try {
    let pages = {};
    const currentUrl = baseurl;
    pages = crawlPages(baseurl, currentUrl, pages);
    console.log(pages);
  } catch (error) {
    console.log(`Error retreving from given paramter : ${error}`);
  }
}

main();
