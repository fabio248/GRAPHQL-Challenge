export function getChangedPaswordMail(username: string) {
  return `
  <!DOCTYPE html>
    <html>
        <head>
            <title>Password Changed</title>
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
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Password Changed</h1>
                <p>Hello ${username},</p>
                <p>Your password has been successfully changed. If you did not make this change, please contact our support team immediately.</p>
                <p>If you have any questions or need further assistance, feel free to reach out to us.</p>
                <p>Thank you!</p>
                <p>The Cat Store Team</p>
            </div>
        </body>
    </html>

  `;
  //   `
  //     <!DOCTYPE html>
  //     <html>
  //         <head>
  //             <title>Password Changed</title>
  //             <style>
  //                 body {
  //                 font-family: sans-serif;
  //                 font-size: 16px;
  //                 background-color: #f5f5f5;
  //                 }

  //                 h1 {
  //                 font-size: 24px;
  //                 margin-top: 0;
  //                 text-align: center;
  //                 color: #007bff;
  //                 }

  //                 p {
  //                 margin-bottom: 10px;
  //                 text-align: center;
  //                 }

  //                 .container {
  //                 width: 600px;
  //                 margin: 0 auto;
  //                 padding: 20px;
  //                 }
  //             </style>
  //         </head>
  //         <body>
  //             <div class="container">
  //                 <h1>Password Changed</h1>
  //                 <p>Hi ${username},</p>
  //                 <p>Your password has been changed. If you did not request this change, please contact us immediately.</p>
  //                 <p>Thank you,</p>
  //                 <p>The Cat Store Team</p>
  //             </div>
  //         </body>
  //     </html>
  // `
}
