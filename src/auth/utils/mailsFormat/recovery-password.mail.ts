export function getRecoveryMail(username: string, recoveryToken: string) {
  return `
  <!DOCTYPE html>
    <html>
        <head>
            <title>Password Reset</title>
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
                
                /* Button styles */
                .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                font-weight: bold;
                border-radius: 4px;
                }
            </style>
        </head>
        <body>
        <div class="container">
            <h1>Password Reset</h1>
            <p>Hello ${username},</p>
            <p>We received a request to reset your password. If you did not make this request, please disregard this email.</p>
            <p>To reset your password, please click the button below:</p>
            <p>
            <a class="button" href="https://www.example.com/reset-password?recoveryToken=${recoveryToken}">Reset Password</a>
            </p>
            <p>If you're having trouble with the button, you can also copy and paste the following URL into your web browser:</p>
            <p>https://www.example.com/reset-password?recoveryToken=${recoveryToken}</p>
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
  //             <title>Password Reset</title>
  //             <style>
  //                 body {
  //                 font-family: sans-serif;
  //                 font-size: 16px;
  //                 }

  //                 h1 {
  //                 font-size: 20px;
  //                 margin-top: 0;
  //                 }

  //                 p {
  //                 margin-bottom: 10px;
  //                 }

  //                 .button {
  //                 background-color: #007bff;
  //                 color: white;
  //                 padding: 10px 20px;
  //                 border-radius: 5px;
  //                 cursor: pointer;
  //                 }

  //                 .button:hover {
  //                 background-color: #0062cc;
  //                 }
  //             </style>
  //         </head>
  //         <body>
  //             <h1>Password Reset</h1>
  //             <p>Hi ${username},</p>
  //             <p>You requested to reset your password for your account. To reset your password, please click on the following link:</p>
  //             <a href="https://www.example.com/password_reset?recoveryToken=${recoveryToken}">Reset Password</a>
  //             <p>Recovery Token: ${recoveryToken}</p>
  //             <p>This link will expire in 15 min. If you do not click on the link within 15 min, you will need to request a new password reset.</p>
  //             <p>If you did not request to reset your password, please ignore this email.</p>
  //             <p>Thank you,</p>
  //             <p>The Cat Store Team</p>
  //         </body>
  //     </html>
  //     `
}
