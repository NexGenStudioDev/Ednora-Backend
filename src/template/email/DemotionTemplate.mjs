
const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);

const getPortalUrl = (value) => {
  const fallback = "https://ednora-web.vercel.app";

  try {
    const url = new URL(value);

    if (
      url.protocol !== "https:" ||
      url.hostname !== "ednora-web.vercel.app"
    ) {
      return fallback;
    }

    return escapeHtml(url.href);
  } catch {
    return fallback;
  }
};

export const generateDemotionEmail = ({
  studentName = "Student",
  uniqueId = "N/A",
  courseName = "Enrolled Program",
  previousSemester = 2,
  currentSemester = 1,
  reason = "Curriculum & Academic Standing Review",
  date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
  portalUrl = "https://ednora-web.vercel.app",
}) => {
  const name = escapeHtml(studentName);
  const id = escapeHtml(uniqueId);
  const course = escapeHtml(courseName);
  const previous = escapeHtml(previousSemester);
  const current = escapeHtml(currentSemester);
  const category = escapeHtml(reason);
  const effectiveDate = escapeHtml(date);
  const portal = getPortalUrl(portalUrl);
  const year = new Date().getFullYear();

  const detailRow = (label, value, last = false) => `
    <tr>
      <td width="38%" valign="top"
        style="padding:13px 12px;font-size:13px;line-height:20px;
        color:#718096;${last ? "" : "border-bottom:1px solid #E8EDF3;"}">
        ${label}
      </td>
      <td valign="top" align="left"
        style="padding:13px 12px;font-size:13px;line-height:20px;
        color:#26364D;font-weight:600;overflow-wrap:anywhere;
        ${last ? "" : "border-bottom:1px solid #E8EDF3;"}">
        ${value}
      </td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Academic Record Update | Eduvanta</title>

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

      .content {
        padding: 24px 18px !important;
      }

      .brand {
        padding: 22px 18px !important;
      }

      .hero-title {
        font-size: 29px !important;
        line-height: 1.2 !important;
      }

      .term-cell {
        padding: 12px 8px !important;
      }

      .term-title {
        font-size: 15px !important;
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

        <table role="presentation" width="100%" bgcolor="#FFFFFF"
          class="email-card"
          style="width:100%;max-width:620px;background-color:#FFFFFF;
          border:1px solid #E0E6ED;">

          <!-- Brand header -->
          <tr>
            <td class="brand"
              style="padding:26px 36px;border-bottom:3px solid #C9A66B;
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

                    <div style="margin-top:7px;font-family:Georgia,serif;
                      font-size:12px;font-style:italic;color:#637B9C;">
                      Academic Services
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero banner -->
          <tr>
            <td class="content" bgcolor="#FAF8F3"
              style="padding:32px 36px;background-color:#FAF8F3;">

              <span style="display:inline-block;padding:8px 12px;
                background-color:#F2EBDD;color:#7F6338;
                font-size:10px;font-weight:bold;letter-spacing:1.8px;">
                ACADEMIC RECORD UPDATE
              </span>

              <h1 class="hero-title"
                style="margin:20px 0 12px;
                font-family:Georgia,'Times New Roman',serif;
                font-size:36px;line-height:1.2;font-weight:normal;
                letter-spacing:-0.5px;color:#12335D;">
                Academic Standing &amp;<br>
                <span style="color:#A77A3B;">Term Adjustment</span>
              </h1>

              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;
                font-size:15px;line-height:25px;color:#526D91;">
                An important update regarding your academic enrollment
                in <strong style="color:#12335D;">${course}</strong>.
              </p>
            </td>
          </tr>

          <!-- Main message -->
          <tr>
            <td class="content"
              style="padding:30px 36px 22px;background-color:#FFFFFF;">

              <p style="margin:0 0 16px;font-size:17px;line-height:26px;
                color:#12335D;">
                Dear <strong>${name}</strong>,
              </p>

              <p style="margin:0 0 14px;font-family:Georgia,serif;
                font-size:15px;line-height:26px;color:#526D91;">
                Following an academic record review, your enrollment term
                for <strong style="color:#12335D;">${course}</strong>
                has been adjusted from
                <strong style="color:#12335D;">Semester ${previous}</strong>
                to <strong style="color:#12335D;">Semester ${current}</strong>.
              </p>

              <p style="margin:0 0 25px;font-family:Georgia,serif;
                font-size:15px;line-height:26px;color:#526D91;">
                Please review the details below and contact your academic
                office if you need clarification about this decision or
                the next steps in your study plan.
              </p>

              <!-- Semester comparison -->
              <table role="presentation" width="100%" bgcolor="#F3F8FC"
                style="width:100%;background-color:#F3F8FC;
                border:1px solid #E5EDF5;">
                <tr>
                  <td colspan="3" style="padding:20px 18px 16px;">
                    <table role="presentation">
                      <tr>
                        <td valign="middle"
                          style="padding-right:10px;font-size:20px;
                          color:#587BA5;">
                          &#9635;
                        </td>
                        <td valign="middle"
                          style="font-size:11px;font-weight:bold;
                          letter-spacing:1.6px;color:#12335D;">
                          REVISED ACADEMIC TERM
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td class="term-cell" width="43%" valign="middle"
                    bgcolor="#FFFFFF"
                    style="padding:15px 13px 17px 18px;
                    border:1px solid #B7C9DF;">
                    <div style="font-size:10px;letter-spacing:1.2px;
                      color:#6D83A2;">
                      PREVIOUS TERM
                    </div>
                    <div class="term-title"
                      style="margin-top:8px;font-family:Georgia,serif;
                      font-size:19px;line-height:25px;font-weight:bold;
                      color:#12335D;">
                      Semester ${previous}
                    </div>
                  </td>

                  <td width="14%" align="center" valign="middle"
                    style="font-size:24px;color:#C3944B;">
                    &#8594;
                  </td>

                  <td class="term-cell" width="43%" valign="middle"
                    bgcolor="#FFFAF1"
                    style="padding:15px 13px 17px;
                    border:1px solid #D9B978;">
                    <div style="font-size:10px;letter-spacing:1.2px;
                      color:#A77931;">
                      CURRENT TERM
                    </div>
                    <div class="term-title"
                      style="margin-top:8px;font-family:Georgia,serif;
                      font-size:19px;line-height:25px;font-weight:bold;
                      color:#12335D;">
                      Semester ${current}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td colspan="3" style="height:18px;font-size:1px;">
                    &nbsp;
                  </td>
                </tr>
              </table>

              <!-- Academic record details -->
              <h2 style="margin:28px 0 12px;
                font-family:Georgia,'Times New Roman',serif;
                font-size:23px;line-height:30px;font-weight:normal;
                color:#12335D;">
                Academic Record Details
              </h2>

              <table role="presentation" width="100%"
                style="width:100%;border-top:1px solid #DCE5EF;
                border-bottom:1px solid #DCE5EF;">
                ${detailRow("Student ID", id)}
                ${detailRow("Program", course)}
                ${detailRow("Review Category", category)}
                ${detailRow("Effective Date", effectiveDate, true)}
              </table>

              <!-- Next steps -->
              <table role="presentation" width="100%" bgcolor="#FBF8F1"
                style="width:100%;margin-top:24px;
                background-color:#FBF8F1;
                border:1px solid #EFE3CE;
                border-left:4px solid #C3944B;">
                <tr>
                  <td style="padding:20px 18px;">
                    <h2 style="margin:0 0 9px;
                      font-family:Georgia,'Times New Roman',serif;
                      font-size:21px;line-height:27px;font-weight:normal;
                      color:#12335D;">
                      Your Next Steps
                    </h2>

                    <p style="margin:0;font-family:Georgia,serif;
                      font-size:14px;line-height:24px;color:#526D91;">
                      Review your updated academic record through the
                      Eduvanta portal. For questions about semester
                      placement, prerequisite requirements, or your
                      study plan, contact your institution's academic office.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Portal button -->
              <table role="presentation" width="100%"
                style="width:100%;margin-top:28px;">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" bgcolor="#12335D"
                          style="background-color:#12335D;">
                          <a href="${portal}" target="_blank"
                            class="cta"
                            style="display:inline-block;padding:15px 27px;
                            font-size:13px;line-height:20px;font-weight:bold;
                            color:#FFFFFF;">
                            View Academic Record &nbsp; &#8594;
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:14px 0 0;font-family:Georgia,serif;
                      font-size:12px;line-height:20px;color:#6D83A2;">
                      For assistance, please contact your academic office.
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

                    <div style="margin-top:5px;font-family:Georgia,serif;
                      font-size:12px;font-style:italic;color:#6D83A2;">
                      Building Brighter Futures
                    </div>
                  </td>

                  <td align="right" valign="middle"
                    style="font-size:10px;line-height:18px;color:#7B8798;">
                    &copy; ${year} Eduvanta<br>
                    Institutional ERP<br>
                    Official Academic Communication
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <p style="margin:16px 0 0;font-size:10px;line-height:17px;
          text-align:center;color:#8993A2;background-color:#FFFFFF;">
          This email contains academic information intended
          for the designated recipient.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
