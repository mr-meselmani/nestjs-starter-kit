export const resetPasswordEdm = (otp: number): string => {
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your OTP Code</title>
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
              text-align: center;
          }
          .otp-code {
              font-size: 24px;
              font-weight: bold;
              color: #007BFF;
              text-align: center;
              margin: 20px 0;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Your OTP Code</h1>
          <p>Use the following 4-digit OTP code to proceed with your verification:</p>
          <div class="otp-code">${otp}</div>
          <p>&copy; ${year} Your Company Name. All rights reserved.</p>
      </div>
  </body>
  </html>
  `;
};

export default resetPasswordEdm;
