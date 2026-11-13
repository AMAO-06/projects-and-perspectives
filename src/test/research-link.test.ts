import { describe, expect, it } from "vitest";

import { externalUrl } from "@/lib/site-content";

describe("Research publication links", () => {
  it("opens a pasted link over https", () => {
    expect(externalUrl("ieeexplore.ieee.org/document/10430459")).toBe(
      "https://ieeexplore.ieee.org/document/10430459",
    );
  });

  it("keeps a full https link unchanged", () => {
    expect(externalUrl("https://arxiv.org/abs/2401.01234")).toBe("https://arxiv.org/abs/2401.01234");
  });

  it("hides the button when no link is given", () => {
    expect(externalUrl("")).toBeNull();
    expect(externalUrl("   ")).toBeNull();
    expect(externalUrl(undefined)).toBeNull();
  });

  it("drops links that aren't web pages", () => {
    expect(externalUrl("javascript:alert(1)")).toBeNull();
    expect(externalUrl("data:text/html,<b>hi</b>")).toBeNull();
  });
});
