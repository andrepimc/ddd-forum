import { expect, test } from "vitest";
import { Slug } from "./slug";

test("it should be able to create a slug from a text (title)", () => {
  const slug = Slug.createFromText('New title example')
  expect(slug.value).toEqual('new-title-example')

})