import { left, right } from "./mod.ts";
import {
  assertEquals,
} from "https://deno.land/std@0.63.0/testing/asserts.ts";

Deno.test("either map", () => {
  assertEquals(left<string, number>("oops").map((x) => x + x), left("oops"));
  assertEquals(right<string, number>(1).map((x) => x + x), right(2));
});

Deno.test("either mapLeft", () => {
  assertEquals(
    left<string, number>("oops").mapLeft((x) => x + x),
    left("oopsoops"),
  );
  assertEquals(right<string, number>(1).mapLeft((x) => x + x), right(1));
});

Deno.test("either andThen", () => {
  assertEquals(
    left<string, number>("oops").andThen((x) => right(x + x)),
    left("oops"),
  );
  assertEquals(right<string, number>(1).andThen((x) => right(x + x)), right(2));
});

Deno.test("either either", () => {
  assertEquals(
    left<string, number>("hello").either((l: string) => l + l, (r) => "" + r),
    "hellohello",
  );

  assertEquals(
    right<string, number>(10).either((l: string) => l + l, (r) => "" + r + r),
    "1010",
  );
});
