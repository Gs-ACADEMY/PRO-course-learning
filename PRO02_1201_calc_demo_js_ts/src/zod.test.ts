import { expect, test } from "vitest";
import * as z from "zod";

// よそから届いた JSON。price が文字（"1000"）になっている
const text = '{"price":"1000"}';

test("型だけ（すり抜ける）", () => {
  type Item = { name: string; price: number };
  const item = JSON.parse(text) as Item;
  // text が {"price":"1000"} でも赤線は出ない
  expect(item.price + 100).toBe("1000100"); // 足し算ではなく、文字がつながる
});

test("動くときに確かめる（例：Zod）", () => {
  const Item = z.object({
    name: z.string(),
    price: z.number(),
  });
  expect(() => {
    const item = Item.parse(JSON.parse(text));
    // "1000"（文字）なら、ここで止まる
    return item.price + 100;
  }).toThrow();
});
