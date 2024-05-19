export { normalizeURL, getURLSFromHTML, crawlPages, fetcher };
import { JSDOM } from "jsdom";

const normalizeURL = function (url) {
  if (null == url) {
    console.error("Error: no url to normalize");
    return false;
  }

  const urlObj = new URL(url);
  const hostname = urlObj.hostname;
  const pathname = urlObj.pathname;
  let normalizeUrl = hostname + pathname;
  normalizeUrl = normalizeUrl.replace(/\/+$/, "");
  normalizeUrl = normalizeUrl.toLowerCase();
  return normalizeUrl;
};

const getURLSFromHTML = function (htmlBody, baseURL) {
  if (null == htmlBody) {
    console.error("Error: No htmlbody present in parameter to parse");
    return false;
  } else if (null == baseURL) {
    console.error("Error: No baseUrl was given in the parameter");
    return false;
  }

  // grab the anchros from the htmlbody
  const dom = new JSDOM(htmlBody);
  const nodeList = dom.window.document.querySelectorAll("a");

  // loop through the anchor elements, grab hrefs, and store them in an array
  const anchorArray = [];
  nodeList.forEach((anchor) => {
    let href = "";
    //grab the href
    href = anchor.href;

    //make sure we remove relative urls and make it full urls
    if (href.startsWith("/")) {
      href = baseURL + href;
    }
    //normalize and add the url to the anchorArray
    anchorArray.push(href);
  });

  return anchorArray;
};

const crawlPages = async function (baseUrl, currentUrl = baseUrl, pages = {}) {
  if (null === baseUrl) {
    console.error("Error: No baseurl was given. Nothing to crawl");
    return false;
  }

  // normalize the currentUrl
  const nURL = normalizeURL(currentUrl);
  //check if we already cralled the currentUrl or if the url is out of domain
  if (nURL in pages) {
    pages[nURL] += 1;
    return pages;
  }

  // add the url to the pages
  pages[nURL] = 1;

  //get urls from the normalizedURL
  const urls = await fetcher(nURL, baseUrl);
  if (false === urls) {
    console.error(`Failed to fetch from url: ${nURL}`);
    return pages;
  } else if (null == urls) {
    return pages;
  }

  // loop through all of the urls
  for (const node of urls) {
    if (!node.includes(baseUrl)) {
      continue;
    }
    console.log("crawled: " + node);
    pages = await crawlPages(baseUrl, node, pages);
  }
  return pages;
};

const fetcher = async function (url, baseUrl) {
  try {
    // fetch html from current url
    const response = await fetch("https://" + url);
    if (response.ok) {
      const fetchtype = response.headers.get("content-type");
      if (!fetchtype.includes("text/html")) {
        console.error("Error: response did not fetch an html response");
        return false;
      }
      const htmlBody = await response.text();

      // extract the getURLSFromHTML
      const urls = getURLSFromHTML(htmlBody, baseUrl);
      return urls;
    } else {
      console.log("It was not ok");
      return false;
    }
  } catch (error) {
    console.error("Shit broke", error);
  }
};
