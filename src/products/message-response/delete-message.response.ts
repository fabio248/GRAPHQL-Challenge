export default class DeleteMessageProduct {
  private message: string;
  constructor(productId: number) {
    this.message = `product deleted with ${productId}`;
  }
}
