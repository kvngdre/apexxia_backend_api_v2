export class Stack<T> {
  constructor(...elements: T[]) {
    this._elements = elements;
  }

  private readonly _elements: T[] = [];

  public push(value: T): void {
    this._elements.push(value);
  }

  public pop(): T {
    if (this._elements.length < 1) {
      throw new Error("Stack is empty");
    }

    return this._elements[this._elements.length - 1]!;
  }
}
