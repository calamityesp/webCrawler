import { test, expect } from "@jest/globals";
import { normalizeURL, getURLSFromHTML } from "./crawl.js";

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
  const result = getURLSFromHTML(body, null);
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
