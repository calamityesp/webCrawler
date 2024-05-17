export { normalizeURL, getURLSFromHTML, crawlPages };
import { JSDOM } from "jsdom";

const normalizeURL = function (url) {
  try {
    const oldUrl = new URL(url);
    let normalized = oldUrl.hostname + oldUrl.pathname;
    normalized = normalized.replace(/\/+$/, "");
    normalized = normalized.toLowerCase();
    console.error("Kdds: " + normalized);
    return normalized;
  } catch (error) {
    console.error(`ERROR: couldn't normalize - ${error}`);
  }
};

const getURLSFromHTML = function (htmlBody, baseURL) {
  try {
    const html = new JSDOM(htmlBody);
    const anchors = html.window.document.querySelectorAll("a");
    let normalUrl;
    const urls = [];
    anchors.forEach((anchor) => {
      if (anchor.href.startsWith("/")) {
        normalUrl = normalizeURL(baseURL + anchor.href);
        urls.push(normalUrl);
      } else {
        normalUrl = normalizeURL(anchor.href);
        urls.push(normalUrl);
      }
    });
    return urls;
  } catch (error) {
    console.error("ERROR: failure retrieving : ", error);
  }
};

const crawlPages = async function (baseUrl, currentUrl = baseUrl, pages = {}) {
  try {
    // check that the currentUrl is in the same domain as the baseUrl
    console.log(currentUrl);
    const cURL = new URL(currentUrl);
    const bURL = new URL(baseUrl);
    if (cURL.hostname != bURL.hostname) {
      console.error("Error: current url is outside of the base domain");
      return;
    }

    // normalize the URL
    const nURL = "https://" + normalizeURL(currentUrl);
    console.log(`Normalized Url: ${nURL}`);
    //check if normalized URL is already in pages
    if (nURL in pages) {
      pages[nURL] += 1;
      return pages;
    } else {
      pages[nURL] = 1;
    }

    //fetch and check the content-type, discard non text/html types
    const response = await fetch(nURL);
    const content_type = response.headers.get("content-type");
    const body = await response.text();
    if (response.status != 200) {
      console.error(`ERROR: failed to fetch url: ${nURL}`);
      return;
    }

    if (!content_type.includes("text/html")) {
      console.error(`Error: invalid content type ${content_type}`);
      return;
    }

    // grab all urls from html body
    const urls = getURLSFromHTML(body, baseUrl);
    console.log(urls);

    // loop through urls and get urls from the respective bodies
    for (const link of urls) {
      await crawlPages(baseUrl, link, pages);
    }
    return pages;
  } catch (error) {
    console.error(`Error: Failed to fetch`, error);
  }
};
