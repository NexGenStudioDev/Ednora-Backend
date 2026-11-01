
/**
 * Eduvanta — Premium Light Theme Student Notification Email
 */

const escapeNotificationHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);

const getNotificationPortalUrl = (value) => {
  const fallback = "https://ednora-web.vercel.app";

  try {
    const url = new URL(value);

    if (
      url.protocol !== "https:" ||
      url.hostname !== "ednora-web.vercel.app"
    ) {
      return fallback;
    }

    return escapeNotificationHtml(url.href);
  } catch {
    return fallback;
  }
};

export const generateNotificationEmail = ({
  studentName = "Student",
  uniqueId = "N/A",
  title = "Institutional Announcement",
  message =
    "You have received an official notification from Eduvanta Administration.",
  priority = "Normal",
  date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
  portalUrl = "https://ednora-web.vercel.app",
}) => {
  const name = escapeNotificationHtml(studentName);
  const id = escapeNotificationHtml(uniqueId);
  const safeTitle = escapeNotificationHtml(title);
  const safeMessage = escapeNotificationHtml(message);
  const safeDate = escapeNotificationHtml(date);
  const safePriority = escapeNotificationHtml(priority);
  const portal = getNotificationPortalUrl(portalUrl);
  const year = new Date().getFullYear();

  const normalizedPriority = String(priority ?? "")
    .trim()
    .toLowerCase();

  const isUrgent = ["urgent", "high"].includes(normalizedPriority);

  const priorityColor = isUrgent ? "#A43D36" : "#9A7845";
  const priorityBackground = isUrgent ? "#FFF3F1" : "#F5F0E6";
  const priorityBorder = isUrgent ? "#E8C3BE" : "#E7D9BD";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">

  <title>${safeTitle} | Eduvanta</title>

  <style>
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: #FFFFFF !important;
      font-family: Arial, Helvetica, sans-serif;
      -webkit-text-size-adjust: 100%;
    }

    table {
      border-collapse: collapse;
      border-spacing: 0;
    }

    a {
      text-decoration: none;
    }

    @media screen and (max-width: 600px) {
      .outer {
        padding: 8px 0 !important;
      }

      .email-card {
        border-left: 0 !important;
        border-right: 0 !important;
      }

      .brand {
        padding: 22px 18px !important;
      }

      .content {
        padding: 24px 18px !important;
      }

      .hero-title {
        font-size: 28px !important;
        line-height: 1.25 !important;
      }

      .metadata-cell {
        display: block !important;
        width: 100% !important;
        padding: 7px 0 !important;
        text-align: left !important;
      }

      .footer {
        padding: 20px 18px !important;
      }

      .cta {
        display: block !important;
        text-align: center !important;
      }
    }
  </style>
</head>

<body bgcolor="#FFFFFF" style="background-color:#FFFFFF;">

  <!-- Pure white outer background -->
  <table role="presentation" width="100%" bgcolor="#FFFFFF"
    style="width:100%;background-color:#FFFFFF;">
    <tr>
      <td align="center" class="outer"
        style="padding:26px 12px;background-color:#FFFFFF;">

        <!-- Email container -->
        <table role="presentation" width="100%" bgcolor="#FFFFFF"
          class="email-card"
          style="width:100%;max-width:620px;background-color:#FFFFFF;
          border:1px solid #E0E6ED;">

          <!-- Brand header -->
          <tr>
            <td class="brand"
              style="padding:26px 36px;
              border-bottom:3px solid #C9A66B;
              background-color:#FFFFFF;">

              <table role="presentation" width="100%">
                <tr>
                  <td valign="middle">
                    <div style="font-family:Georgia,'Times New Roman',serif;
                      font-size:31px;line-height:36px;font-weight:bold;
                      letter-spacing:-1px;color:#12335D;">
                      Eduvanta
                    </div>

                    <div style="margin-top:5px;font-size:10px;
                      letter-spacing:2.5px;color:#6D83A2;">
                      LEARN. GROW. ACHIEVE.
                    </div>
                  </td>

                  <td align="right" valign="middle">
                    <div style="font-size:10px;letter-spacing:1.7px;
                      font-weight:bold;color:#B17B2E;">
                      INSTITUTIONAL ERP
                    </div>

                    <div style="margin-top:7px;
                      font-family:Georgia,'Times New Roman',serif;
                      font-size:12px;font-style:italic;color:#637B9C;">
                      Official Communication
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Notification hero -->
          <tr>
            <td class="content" bgcolor="#FAF8F3"
              style="padding:32px 36px;background-color:#FAF8F3;">

              <span style="display:inline-block;padding:8px 12px;
                background-color:${priorityBackground};
                border:1px solid ${priorityBorder};
                color:${priorityColor};
                font-size:10px;font-weight:bold;
                letter-spacing:1.5px;text-transform:uppercase;">
                ${isUrgent ? "PRIORITY NOTICE" : "INSTITUTIONAL NOTICE"}
              </span>

              <h1 class="hero-title"
                style="margin:20px 0 14px;
                font-family:Georgia,'Times New Roman',serif;
                font-size:34px;line-height:1.2;font-weight:normal;
                letter-spacing:-0.5px;color:#12335D;
                overflow-wrap:anywhere;">
                ${safeTitle}
              </h1>

              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td valign="middle"
                    style="padding-right:9px;font-size:11px;
                    font-weight:bold;letter-spacing:1px;
                    color:${priorityColor};">
                    PRIORITY
                  </td>

                  <td valign="middle"
                    style="padding:6px 10px;
                    background-color:#FFFFFF;
                    border:1px solid ${priorityBorder};
                    font-size:11px;font-weight:bold;
                    color:${priorityColor};">
                    ${safePriority}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main content -->
          <tr>
            <td class="content"
              style="padding:30px 36px 22px;background-color:#FFFFFF;">

              <p style="margin:0 0 18px;font-size:16px;
                line-height:26px;color:#12335D;">
                Dear <strong>${name}</strong>,
              </p>

              <p style="margin:0 0 24px;
                font-family:Georgia,'Times New Roman',serif;
                font-size:15px;line-height:26px;color:#526D91;">
                This is an official communication from Eduvanta
                Administration. Please review the notification below
                and take any necessary action.
              </p>

              <!-- Notification message card -->
              <table role="presentation" width="100%"
                style="width:100%;border:1px solid #E1E7EF;
                border-left:4px solid ${priorityColor};">
                <tr>
                  <td bgcolor="#F8FAFC"
                    style="padding:20px 22px;background-color:#F8FAFC;">

                    <div style="margin-bottom:12px;
                      font-size:10px;font-weight:bold;
                      letter-spacing:1.6px;color:#6D83A2;">
                      MESSAGE FROM EDUVANTA
                    </div>

                    <div style="font-family:Arial,Helvetica,sans-serif;
                      font-size:14px;line-height:25px;color:#334863;
                      white-space:pre-wrap;overflow-wrap:anywhere;">${safeMessage}</div>
                  </td>
                </tr>
              </table>

              <!-- Notification metadata -->
              <h2 style="margin:28px 0 12px;
                font-family:Georgia,'Times New Roman',serif;
                font-size:22px;line-height:29px;font-weight:normal;
                color:#12335D;">
                Notification Details
              </h2>

              <table role="presentation" width="100%"
                style="width:100%;border-top:1px solid #DCE5EF;
                border-bottom:1px solid #DCE5EF;">

                <tr>
                  <td width="38%" valign="top"
                    style="padding:13px 12px;font-size:13px;
                    line-height:20px;color:#718096;
                    border-bottom:1px solid #E8EDF3;">
                    Student ID
                  </td>

                  <td valign="top"
                    style="padding:13px 12px;font-family:monospace;
                    font-size:13px;line-height:20px;
                    color:#12335D;font-weight:bold;
                    overflow-wrap:anywhere;
                    border-bottom:1px solid #E8EDF3;">
                    ${id}
                  </td>
                </tr>

                <tr>
                  <td width="38%" valign="top"
                    style="padding:13px 12px;font-size:13px;
                    line-height:20px;color:#718096;
                    border-bottom:1px solid #E8EDF3;">
                    Date of Dispatch
                  </td>

                  <td valign="top"
                    style="padding:13px 12px;font-size:13px;
                    line-height:20px;color:#12335D;font-weight:600;
                    border-bottom:1px solid #E8EDF3;">
                    ${safeDate}
                  </td>
                </tr>

                <tr>
                  <td width="38%" valign="top"
                    style="padding:13px 12px;font-size:13px;
                    line-height:20px;color:#718096;">
                    Issuing Authority
                  </td>

                  <td valign="top"
                    style="padding:13px 12px;font-size:13px;
                    line-height:20px;color:#12335D;font-weight:600;">
                    Academic Affairs / Registrar
                  </td>
                </tr>
              </table>

              <!-- Call to action -->
              <table role="presentation" width="100%"
                style="width:100%;margin-top:30px;">
                <tr>
                  <td align="center">

                    <table role="presentation" cellspacing="0"
                      cellpadding="0">
                      <tr>
                        <td align="center" bgcolor="#12335D"
                          style="background-color:#12335D;">
                          <a href="${portal}" target="_blank"
                            class="cta"
                            style="display:inline-block;padding:15px 27px;
                            font-size:13px;line-height:20px;
                            font-weight:bold;color:#FFFFFF;">
                            Open Student Portal &nbsp; &#8594;
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:16px 0 0;
                      font-family:Georgia,'Times New Roman',serif;
                      font-size:12px;line-height:21px;
                      color:#6D83A2;text-align:center;">
                      For assistance regarding this notice, please
                      contact your department's academic coordinator.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer" bgcolor="#FFFFFF"
              style="padding:24px 36px;border-top:1px solid #E1E7EF;
              background-color:#FFFFFF;">

              <table role="presentation" width="100%">
                <tr>
                  <td valign="middle">
                    <div style="font-family:Georgia,'Times New Roman',serif;
                      font-size:24px;line-height:30px;font-weight:bold;
                      color:#12335D;">
                      Eduvanta
                    </div>

                    <div style="margin-top:5px;
                      font-family:Georgia,'Times New Roman',serif;
                      font-size:12px;font-style:italic;color:#6D83A2;">
                      Where Knowledge Finds Its Future
                    </div>
                  </td>

                  <td align="right" valign="middle"
                    style="font-size:10px;line-height:18px;color:#7B8798;">
                    &copy; ${year} Eduvanta<br>
                    Institutional ERP<br>
                    Official Communication
                  </td>
                </tr>
              </table>

              <p style="margin:18px 0 0;padding-top:14px;
                border-top:1px solid #E8EDF3;font-size:10px;
                line-height:17px;color:#8993A2;text-align:center;">
                This email contains information intended for
                the designated recipient.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
