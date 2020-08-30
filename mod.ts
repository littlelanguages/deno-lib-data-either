export abstract class Either<L, R> {
  abstract map<U>(f: (r: R) => U): Either<L, U>;

  abstract mapLeft<U>(f: (l: L) => U): Either<U, R>;

  abstract andThen<U>(f: (r: R) => Either<L, U>): Either<L, U>;

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

export function left<L, R>(l: L): Either<L, R> {
  return new Left(l);
}

export function right<L, R>(r: R): Either<L, R> {
  return new Right(r);
}
