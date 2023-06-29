import Handlebars from 'handlebars';

export function getNotifyLowStockMail(
  username: string,
  products: { url: string[]; name: string }[],
) {
  const template = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Low Stock Alert</title>
        <style>
          /* Reset CSS */
          body, p, h1 {
            margin: 0;
            padding: 0;
          }
          
          /* Container styles */
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            font-family: Arial, sans-serif;
            color: #444444;
          }
          
          /* Heading styles */
          h1 {
            font-size: 24px;
            margin-bottom: 20px;
            text-align: center;
          }
          
          /* Text styles */
          p {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 20px;
          }
          
          /* Product styles */
          .product {
            margin-bottom: 20px;
          }
          
          .product__image {
            display: block;
            max-width: 100%;
            height: auto;
            margin-bottom: 10px;
          }
          
          .product__title {
            font-weight: bold;
          }
          
          .product__stock {
            font-style: italic;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Low Stock Alert</h1>
          <p>Hello, {{username}}</p>
          <p>We wanted to inform you that some of your favorite products are running low on stock. Please see the details below:</p>
          
          <!-- Loop over product data -->
          {{#each products}}
          <div class="product">
            {{#each this.url}}
              <img class="product__image" src="{{this}}" alt="Product Image">
            {{/each}}
            <p class="product__title">{{this.name}}</p>
            <p class="product__stock">Hurry! Only a few items left in stock.</p>
          </div>
          {{/each}}
          
          <p>We recommend placing an order soon to secure your desired products.</p>
          
          <p>If you have any questions or need further assistance, feel free to reach out to us.</p>
          <p>Thank you!</p>
          <p>The Cat Store Team</p>
        </div>
      </body>
    </html>
  `;

  const compiledTemplate = Handlebars.compile(template);
  const renderedEmail = compiledTemplate({ username, products });

  return renderedEmail;
}
