export default class DeleteMessageProduct {
  public message: string;

  constructor(productId: number) {
    this.message = `product deleted with ${productId}`;
  }
}
