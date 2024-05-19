import { test, expect } from "@jest/globals";
import { normalizeURL, getURLSFromHTML, crawlPages, fetcher } from "./crawl.js";

// ------------------------------------------------//
// NormalizeURL function tests
// ------------------------------------------------//
test("Should remove the protocol", () => {
  const result = normalizeURL("https://www.example.com");
  expect(result).toBe("www.example.com");
});

test("Should Normalize urls to have basedomain and pathname", () => {
  const result = normalizeURL("https://www.example.com/test/path");
  expect(result).toBe("www.example.com/test/path");
});

// ------------------------------------------------//
// getURLSFromHTML function tests
// ------------------------------------------------//

test("Extract urls from html body", () => {
  const body = `
    <html>
      <body>
        <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
      </body>
    </html>
  `;
  const result = getURLSFromHTML(body, "https://boot.dev");
  console.log(result[0]);
  expect(result).toBeInstanceOf(Array);
});

test("Prepend baseURL to reletive urls ", () => {
  const body = `
    <html>
      <body>
        <a href="/erin/IsLateWithHomework"><span>Why is Erin Late </span></a>
      </body>
    </html>
  `;

  const baseURL = "https://blog.boot.dev";
  const result = getURLSFromHTML(body, baseURL)[0];
  expect(result).toBe("https://blog.boot.dev/erin/IsLateWithHomework");
});

// ------------------------------------------------//
// CrawlPages fuynction tests
// ------------------------------------------------//
test("Basic functionality for crawlPages Function", () => {
  const baseURL = "https://blog.boot.dev";
  crawlPages(baseURL);
});

test("Check for non html response types", async () => {
  const url = "https://httpbin.org/get";

  const result = await fetcher(url);
  expect(result).toBe(false);
});
