export const verifyEmailEdm = (href: string): string => {
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Email</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
          .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
              color: #333333;
              text-align: center;
          }
          p {
              font-size: 16px;
              color: #666666;
          }
          a {
              display: block;
              width: 100%;
              text-align: center;
              background-color: #007BFF;
              color: #ffffff;
              padding: 10px 0;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
          }
          a:hover {
              background-color: #0056b3;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Verify Email</h1>
          <p>To verify your email address, please click the link below:</p>
          <a href="${process.env.FRONTEND_BASE_URL}/${href}">${href}</a>
          <p>&copy; ${year} Your Company Name. All rights reserved.</p>
      </div>
  </body>
  </html>
  `;
};

export default verifyEmailEdm;
