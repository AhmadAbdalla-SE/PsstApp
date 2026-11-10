import { EmailSubjectEnum, TwoFactorAuthorizationEnum } from "../../enum/index.js";


export const templates ={
    [EmailSubjectEnum.CONFIRM_EMAIL]:(data)=>{
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light only" />
  <title>${data.title}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f2fb; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <!-- Preheader: the grey preview text shown next to the subject in the inbox -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    Your verification code is ${data.code}. It expires in 2 minutes.
  </div>

  <!-- Outer wrapper: full-width background -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f2fb;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Card: fixed max width so it looks the same in every client -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
               style="max-width:520px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(46,16,101,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#1e1b4b; background-image:linear-gradient(135deg,#1e1b4b 0%,#4c1d95 100%); padding:36px 24px;">
              <div style="width:56px; height:56px; line-height:56px; border-radius:50%; background-color:rgba(255,255,255,0.12); font-size:26px; text-align:center; margin:0 auto 14px;">
                &#128373;
              </div>
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700; letter-spacing:0.5px;">
                ${data.title}
              </h1>
              <p style="margin:6px 0 0; color:#c4b5fd; font-size:13px; letter-spacing:1px; text-transform:uppercase;">
                Speak freely. Stay anonymous.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 12px; color:#374151;">
              <p style="margin:0 0 12px; font-size:16px; font-weight:600; color:#1e1b4b;">Hey there 👋</p>
              <p style="margin:0; font-size:15px; line-height:1.6; color:#4b5563;">
                Use the code below to verify your email address. Your identity stays hidden &mdash;
                this is just to keep your account safe.
              </p>
            </td>
          </tr>

          <!-- OTP code box -->
          <tr>
            <td align="center" style="padding:24px 32px;">
              <div style="display:inline-block; background-color:#f5f3ff; border:2px dashed #8b5cf6; border-radius:12px; padding:18px 28px;">
                <span style="font-family:'Courier New', Courier, monospace; font-size:34px; font-weight:700; letter-spacing:10px; color:#5b21b6;">
                  ${data.code}
                </span>
              </div>
              <p style="margin:14px 0 0; font-size:13px; color:#6b7280;">
                This code expires in <strong style="color:#5b21b6;">2 minutes</strong>.
              </p>
            </td>
          </tr>

          <!-- Security note -->
          <tr>
            <td style="padding:8px 32px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                     style="background-color:#fafafa; border-left:4px solid #8b5cf6; border-radius:8px;">
                <tr>
                  <td style="padding:14px 16px; font-size:13px; line-height:1.5; color:#6b7280;">
                    &#128274; Never share this code with anyone. We will never ask for it.
                    If you didn't request this, you can safely ignore this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#f9f8fd; border-top:1px solid #ede9fe; padding:20px 24px;">
              <p style="margin:0; font-size:12px; color:#9ca3af;">
                &copy; ${new Date().getFullYear()} ${data.title}. All rights reserved.
              </p>
              <p style="margin:4px 0 0; font-size:12px; color:#9ca3af;">
                This is an automated message, please do not reply.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
    },
    [EmailSubjectEnum.FORGOT_PASSWORD]:(data)=>{
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light only" />
  <title>${data.title}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f2fb; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <!-- Preheader: the grey preview text shown next to the subject in the inbox -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    Your verification code is ${data.code}. It expires in 2 minutes.
  </div>

  <!-- Outer wrapper: full-width background -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f2fb;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Card: fixed max width so it looks the same in every client -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
               style="max-width:520px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(46,16,101,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#1e1b4b; background-image:linear-gradient(135deg,#1e1b4b 0%,#4c1d95 100%); padding:36px 24px;">
              <div style="width:56px; height:56px; line-height:56px; border-radius:50%; background-color:rgba(255,255,255,0.12); font-size:26px; text-align:center; margin:0 auto 14px;">
                &#128373;
              </div>
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700; letter-spacing:0.5px;">
                ${data.title}
              </h1>
              <p style="margin:6px 0 0; color:#c4b5fd; font-size:13px; letter-spacing:1px; text-transform:uppercase;">
                Speak freely. Stay anonymous.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 12px; color:#374151;">
              <p style="margin:0 0 12px; font-size:16px; font-weight:600; color:#1e1b4b;">Hey there 👋</p>
              <p style="margin:0; font-size:15px; line-height:1.6; color:#4b5563;">
                Use the code below to verify your email address. Your identity stays hidden &mdash;
                this is just to keep your account safe.
              </p>
            </td>
          </tr>

          <!-- OTP code box -->
          <tr>
            <td align="center" style="padding:24px 32px;">
              <div style="display:inline-block; background-color:#f5f3ff; border:2px dashed #8b5cf6; border-radius:12px; padding:18px 28px;">
                <span style="font-family:'Courier New', Courier, monospace; font-size:34px; font-weight:700; letter-spacing:10px; color:#5b21b6;">
                  ${data.code}
                </span>
              </div>
              <p style="margin:14px 0 0; font-size:13px; color:#6b7280;">
                This code expires in <strong style="color:#5b21b6;">2 minutes</strong>.
              </p>
            </td>
          </tr>

          <!-- Security note -->
          <tr>
            <td style="padding:8px 32px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                     style="background-color:#fafafa; border-left:4px solid #8b5cf6; border-radius:8px;">
                <tr>
                  <td style="padding:14px 16px; font-size:13px; line-height:1.5; color:#6b7280;">
                    &#128274; Never share this code with anyone. We will never ask for it.
                    If you didn't request this, you can safely ignore this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#f9f8fd; border-top:1px solid #ede9fe; padding:20px 24px;">
              <p style="margin:0; font-size:12px; color:#9ca3af;">
                &copy; ${new Date().getFullYear()} ${data.title}. All rights reserved.
              </p>
              <p style="margin:4px 0 0; font-size:12px; color:#9ca3af;">
                This is an automated message, please do not reply.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
    },
    
    [TwoFactorAuthorizationEnum.ENABLE]:(data)=>{
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light only" />
  <title>${data.title}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f2fb; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <!-- Preheader: the grey preview text shown next to the subject in the inbox -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    Your verification code is ${data.code}. It expires in 2 minutes.
  </div>

  <!-- Outer wrapper: full-width background -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f2fb;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Card: fixed max width so it looks the same in every client -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
               style="max-width:520px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(46,16,101,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#1e1b4b; background-image:linear-gradient(135deg,#1e1b4b 0%,#4c1d95 100%); padding:36px 24px;">
              <div style="width:56px; height:56px; line-height:56px; border-radius:50%; background-color:rgba(255,255,255,0.12); font-size:26px; text-align:center; margin:0 auto 14px;">
                &#128373;
              </div>
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700; letter-spacing:0.5px;">
                ${data.title}
              </h1>
              <p style="margin:6px 0 0; color:#c4b5fd; font-size:13px; letter-spacing:1px; text-transform:uppercase;">
                Speak freely. Stay anonymous.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 12px; color:#374151;">
              <p style="margin:0 0 12px; font-size:16px; font-weight:600; color:#1e1b4b;">Hey there 👋</p>
              <p style="margin:0; font-size:15px; line-height:1.6; color:#4b5563;">
                Use the code below to verify your email address. Your identity stays hidden &mdash;
                this is just to keep your account safe.
              </p>
            </td>
          </tr>

          <!-- OTP code box -->
          <tr>
            <td align="center" style="padding:24px 32px;">
              <div style="display:inline-block; background-color:#f5f3ff; border:2px dashed #8b5cf6; border-radius:12px; padding:18px 28px;">
                <span style="font-family:'Courier New', Courier, monospace; font-size:34px; font-weight:700; letter-spacing:10px; color:#5b21b6;">
                  ${data.code}
                </span>
              </div>
              <p style="margin:14px 0 0; font-size:13px; color:#6b7280;">
                This code expires in <strong style="color:#5b21b6;">2 minutes</strong>.
              </p>
            </td>
          </tr>

          <!-- Security note -->
          <tr>
            <td style="padding:8px 32px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                     style="background-color:#fafafa; border-left:4px solid #8b5cf6; border-radius:8px;">
                <tr>
                  <td style="padding:14px 16px; font-size:13px; line-height:1.5; color:#6b7280;">
                    &#128274; Never share this code with anyone. We will never ask for it.
                    If you didn't request this, you can safely ignore this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#f9f8fd; border-top:1px solid #ede9fe; padding:20px 24px;">
              <p style="margin:0; font-size:12px; color:#9ca3af;">
                &copy; ${new Date().getFullYear()} ${data.title}. All rights reserved.
              </p>
              <p style="margin:4px 0 0; font-size:12px; color:#9ca3af;">
                This is an automated message, please do not reply.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
    },
    [TwoFactorAuthorizationEnum.DISABLE]:(data)=>{
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light only" />
  <title>${data.title}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f2fb; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <!-- Preheader: the grey preview text shown next to the subject in the inbox -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    Your verification code is ${data.code}. It expires in 2 minutes.
  </div>

  <!-- Outer wrapper: full-width background -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f2fb;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Card: fixed max width so it looks the same in every client -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
               style="max-width:520px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(46,16,101,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#1e1b4b; background-image:linear-gradient(135deg,#1e1b4b 0%,#4c1d95 100%); padding:36px 24px;">
              <div style="width:56px; height:56px; line-height:56px; border-radius:50%; background-color:rgba(255,255,255,0.12); font-size:26px; text-align:center; margin:0 auto 14px;">
                &#128373;
              </div>
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700; letter-spacing:0.5px;">
                ${data.title}
              </h1>
              <p style="margin:6px 0 0; color:#c4b5fd; font-size:13px; letter-spacing:1px; text-transform:uppercase;">
                Speak freely. Stay anonymous.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 12px; color:#374151;">
              <p style="margin:0 0 12px; font-size:16px; font-weight:600; color:#1e1b4b;">Hey there 👋</p>
              <p style="margin:0; font-size:15px; line-height:1.6; color:#4b5563;">
                Use the code below to verify your email address. Your identity stays hidden &mdash;
                this is just to keep your account safe.
              </p>
            </td>
          </tr>

          <!-- OTP code box -->
          <tr>
            <td align="center" style="padding:24px 32px;">
              <div style="display:inline-block; background-color:#f5f3ff; border:2px dashed #8b5cf6; border-radius:12px; padding:18px 28px;">
                <span style="font-family:'Courier New', Courier, monospace; font-size:34px; font-weight:700; letter-spacing:10px; color:#5b21b6;">
                  ${data.code}
                </span>
              </div>
              <p style="margin:14px 0 0; font-size:13px; color:#6b7280;">
                This code expires in <strong style="color:#5b21b6;">2 minutes</strong>.
              </p>
            </td>
          </tr>

          <!-- Security note -->
          <tr>
            <td style="padding:8px 32px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                     style="background-color:#fafafa; border-left:4px solid #8b5cf6; border-radius:8px;">
                <tr>
                  <td style="padding:14px 16px; font-size:13px; line-height:1.5; color:#6b7280;">
                    &#128274; Never share this code with anyone. We will never ask for it.
                    If you didn't request this, you can safely ignore this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#f9f8fd; border-top:1px solid #ede9fe; padding:20px 24px;">
              <p style="margin:0; font-size:12px; color:#9ca3af;">
                &copy; ${new Date().getFullYear()} ${data.title}. All rights reserved.
              </p>
              <p style="margin:4px 0 0; font-size:12px; color:#9ca3af;">
                This is an automated message, please do not reply.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
    },
    [TwoFactorAuthorizationEnum.LOGIN]:(data)=>{
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light only" />
  <title>${data.title}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f2fb; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <!-- Preheader: the grey preview text shown next to the subject in the inbox -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    Your verification code is ${data.code}. It expires in 2 minutes.
  </div>

  <!-- Outer wrapper: full-width background -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f2fb;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Card: fixed max width so it looks the same in every client -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
               style="max-width:520px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(46,16,101,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#1e1b4b; background-image:linear-gradient(135deg,#1e1b4b 0%,#4c1d95 100%); padding:36px 24px;">
              <div style="width:56px; height:56px; line-height:56px; border-radius:50%; background-color:rgba(255,255,255,0.12); font-size:26px; text-align:center; margin:0 auto 14px;">
                &#128373;
              </div>
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700; letter-spacing:0.5px;">
                ${data.title}
              </h1>
              <p style="margin:6px 0 0; color:#c4b5fd; font-size:13px; letter-spacing:1px; text-transform:uppercase;">
                Speak freely. Stay anonymous.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 12px; color:#374151;">
              <p style="margin:0 0 12px; font-size:16px; font-weight:600; color:#1e1b4b;">Hey there 👋</p>
              <p style="margin:0; font-size:15px; line-height:1.6; color:#4b5563;">
                Use the code below to verify your email address. Your identity stays hidden &mdash;
                this is just to keep your account safe.
              </p>
            </td>
          </tr>

          <!-- OTP code box -->
          <tr>
            <td align="center" style="padding:24px 32px;">
              <div style="display:inline-block; background-color:#f5f3ff; border:2px dashed #8b5cf6; border-radius:12px; padding:18px 28px;">
                <span style="font-family:'Courier New', Courier, monospace; font-size:34px; font-weight:700; letter-spacing:10px; color:#5b21b6;">
                  ${data.code}
                </span>
              </div>
              <p style="margin:14px 0 0; font-size:13px; color:#6b7280;">
                This code expires in <strong style="color:#5b21b6;">2 minutes</strong>.
              </p>
            </td>
          </tr>

          <!-- Security note -->
          <tr>
            <td style="padding:8px 32px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                     style="background-color:#fafafa; border-left:4px solid #8b5cf6; border-radius:8px;">
                <tr>
                  <td style="padding:14px 16px; font-size:13px; line-height:1.5; color:#6b7280;">
                    &#128274; Never share this code with anyone. We will never ask for it.
                    If you didn't request this, you can safely ignore this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#f9f8fd; border-top:1px solid #ede9fe; padding:20px 24px;">
              <p style="margin:0; font-size:12px; color:#9ca3af;">
                &copy; ${new Date().getFullYear()} ${data.title}. All rights reserved.
              </p>
              <p style="margin:4px 0 0; font-size:12px; color:#9ca3af;">
                This is an automated message, please do not reply.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
    },

}


export const verifyEmailTemplate = (data) => {
  return templates[data.subject](data)
};