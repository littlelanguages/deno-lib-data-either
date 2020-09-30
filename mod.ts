/**
 * The abstract class providing the basic structure.  Child classes are implemented for the Left and Right specialisation.
 */
export abstract class Either<L, R> {
  /**
   * If the either values is `R` then applies the function `f` to the either's boxed value creating a new instance of `Either`.  If the either
   * value is `L` then this method has no effect and returns `this`.
   * 
   * This function is the opposite of `mapLeft`.
   * 
   * ```typescript
   * left<string, number>("oops").map((x) => x + x) == left("oops")
   * right<string, number>(1).map((x) => x + x) == right(2)
   * ```
   */
  abstract map<U>(f: (r: R) => U): Either<L, U>;

  /**
   * If the either values is `L` then applies the function `f` to the either's boxed value creating a new instance of `Either`.  If the either
   * value is `R` then this method has no effect and returns `this`.
   * 
   * This function is the opposite of `map`.
   * 
   * ```typescript
   * left<string, number>("oops").mapLeft((x) => x + x) == left("oopsoops")
   * right<string, number>(1).mapLeft((x) => x + x) == right(1)
   * ```
   */
  abstract mapLeft<U>(f: (l: L) => U): Either<U, R>;

  /**
   * If the either value is `R` then applies the function `f` to the either's boxed value and returns the result of `f`.  The result is a new instance
   * of either and the right value can be a different type.
   * 
   * If the either value is `L` then this method has no effect and returns `this`.
   * 
   * ```typescript
   * left<string, number>("oops").andThen((x) => right(x + x)) == left("oops")
   * right<string, number>(1).andThen((x) => right(x + x)) == right(2)
   * ```
   */
  abstract andThen<U>(f: (r: R) => Either<L, U>): Either<L, U>;

  /**
   * The only way to extract the boxed value.  The functions `fl` and `fr` transforms the boxed value into an instance of the common type `U`.
   * 
   * ```typescript
   * left<string, number>("hello").either((l: string) => l + l, (r) => "" + r) == "hellohello"
   * right<string, number>(10).either((l: string) => l + l, (r) => "" + r + r) == "1010"
   * ```
   */
  abstract either<U>(fl: (l: L) => U, fr: (r: R) => U): U;
}

class Left<L, R> extends Either<L, R> {
  private value: L;

  constructor(l: L) {
    super();

    this.value = l;
  }

  map<U>(f: (r: R) => U): Either<L, U> {
    return this as unknown as Either<L, U>;
  }

  mapLeft<U>(f: (l: L) => U): Either<U, R> {
    return new Left(f(this.value));
  }

  andThen<U>(f: (r: R) => Either<L, U>): Either<L, U> {
    return this as unknown as Either<L, U>;
  }

  either<U>(fl: (l: L) => U, fr: (r: R) => U): U {
    return fl(this.value);
  }
}

class Right<L, R> extends Either<L, R> {
  private value: R;

  constructor(r: R) {
    super();

    this.value = r;
  }

  map<U>(f: (r: R) => U): Either<L, U> {
    return new Right(f(this.value));
  }

  mapLeft<U>(f: (l: L) => U): Either<U, R> {
    return this as unknown as Either<U, R>;
  }

  andThen<U>(f: (r: R) => Either<L, U>): Either<L, U> {
    return f(this.value);
  }

  either<U>(fl: (l: L) => U, fr: (r: R) => U): U {
    return fr(this.value);
  }
}

/**
 * Constructs a left instance of `Either`.
 */
export function left<L, R>(l: L): Either<L, R> {
  return new Left(l);
}

/**
 * Constructs a right instance of `Either`.
 */
export function right<L, R>(r: R): Either<L, R> {
  return new Right(r);
}

export const isLeft = <A, B>(e: Either<A, B>): boolean =>
  e.either((_) => true, (_) => false);

export const isRight = <A, B>(e: Either<A, B>): boolean =>
  e.either((_) => false, (_) => true);
