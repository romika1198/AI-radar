function sendNewsEmail() {

  // Get the latest articles from Google News RSS
  const articles = fetchRSS();

  const recipients = [
    "romika.boreddy@gmail.com"
  ];

  const today = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "dd MMMM yyyy"
  );

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>

<body style="
  margin:0;
  padding:0;
  background:#FFF7ED;
  font-family:Arial, Helvetica, sans-serif;
">

<div style="
  max-width:850px;
  margin:0 auto;
  background:#ffffff;
">

  <!-- HEADER -->
  <div style="
    background:#F97316;
    color:#ffffff;
    padding:45px 30px;
    text-align:center;
  ">

    <h1 style="
      margin:0;
      font-size:32px;
      font-weight:700;
      letter-spacing:-0.5px;
    ">
      Daily AI News Brief
    </h1>

    <p style="
      margin:12px 0 0;
      font-size:16px;
      opacity:0.95;
    ">
      Your daily dose of Artificial Intelligence updates
    </p>

    <div style="
      margin:22px auto 0;
      width:fit-content;
      background:#C2410C;
      padding:8px 16px;
      border-radius:20px;
      font-size:13px;
      font-weight:bold;
    ">
      ${today}
    </div>

  </div>


  <!-- INTRODUCTION -->

  <div style="
    padding:35px 40px 10px;
  ">

    <p style="
      margin:0;
      font-size:16px;
      color:#44403C;
      line-height:1.7;
    ">
      Here are today's top AI stories, individually summarized
      to help you stay updated without the information overload.
    </p>

  </div>
`;


  // ==========================================
  // PROCESS EACH ARTICLE
  // ==========================================

  articles.forEach((article, index) => {

    Logger.log(
      "Generating Gemini summary for article " +
      (index + 1) +
      ": " +
      article.title
    );


    // Send THIS specific article to Gemini
    const articleText =
      "Title: " + article.title +
      "\n\n" +
      "Source: " + article.source +
      "\n\n" +
      "Article description: " + article.description;


    const summary = summarizeWithGemini(articleText);


    // ==========================================
    // STORY BADGE
    // ==========================================

    const badge = index === 0
      ? `
        <span style="
          display:inline-block;
          background:#FDBA74;
          color:#7C2D12;
          padding:7px 14px;
          border-radius:20px;
          font-weight:bold;
          font-size:12px;
        ">
          ⭐ TOP STORY
        </span>
      `
      : `
        <span style="
          display:inline-block;
          background:#FFF7ED;
          color:#C2410C;
          border:1px solid #FED7AA;
          padding:7px 14px;
          border-radius:20px;
          font-weight:bold;
          font-size:12px;
        ">
          STORY ${index + 1}
        </span>
      `;


    // ==========================================
    // ARTICLE CARD
    // ==========================================

    html += `

    <div style="
      margin:25px 40px;
      padding:28px;
      border:1px solid #E7E5E4;
      border-radius:16px;
      background:#ffffff;
      box-shadow:0 3px 12px rgba(120,53,15,0.06);
    ">

      ${badge}


      <!-- ARTICLE TITLE -->

      <h2 style="
        margin:18px 0 15px;
        color:#C2410C;
        font-size:22px;
        line-height:1.4;
      ">
        ${article.title}
      </h2>


      <!-- ARTICLE METADATA -->

      <p style="
        margin:8px 0;
        color:#57534E;
        font-size:14px;
      ">
        📰 <strong>Source:</strong> ${article.source}
      </p>

      <p style="
        margin:8px 0 20px;
        color:#57534E;
        font-size:14px;
      ">
        📅 <strong>Published:</strong> ${article.date}
      </p>


      <!-- GEMINI SUMMARY -->

      <div style="
        background:#FFF7ED;
        border-left:4px solid #F97316;
        padding:18px;
        border-radius:8px;
        margin:20px 0;
      ">

        <div style="
          color:#C2410C;
          font-size:14px;
          font-weight:bold;
          margin-bottom:10px;
        ">
          ✦ AI SUMMARY
        </div>

        <p style="
          margin:0;
          color:#44403C;
          font-size:15px;
          line-height:1.7;
        ">
          ${summary}
        </p>

      </div>


      <!-- READ ARTICLE BUTTON -->

      <a href="${article.link}"
        style="
          display:inline-block;
          background:#F97316;
          color:#ffffff;
          text-decoration:none;
          padding:12px 20px;
          border-radius:8px;
          font-size:14px;
          font-weight:bold;
        ">
        Read Full Article →
      </a>

    </div>

    `;
  });


  // ==========================================
  // SIMPLE ENDING
  // ==========================================

  html += `

    <div style="
      height:30px;
    ">
    </div>

  </div>

</body>
</html>
`;


  // ==========================================
  // SEND EMAIL
  // ==========================================

  MailApp.sendEmail({
    to: recipients.join(","),
    subject:
      "Daily AI News | " +
      articles.length +
      " Stories | " +
      today,
    htmlBody: html
  });


  Logger.log(
    "AI News email sent successfully with Gemini summaries!"
  );

}