const { App } = require("@slack/bolt");

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

let environments = {
  help3: "empty",
  remedios3: "empty",
  help4: "empty",
  remedios4: "empty",
};

let section = () => {
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "Environments Queue",
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*Support-3*",
          },
          {
            type: "mrkdwn",
            text: "*Owner:*",
          },
          {
            type: "mrkdwn",
            text: "HelpInApp:",
          },
          {
            type: "mrkdwn",
            text: environments.help3,
          },
          {
            type: "mrkdwn",
            text: "Remedios:",
          },
          {
            type: "mrkdwn",
            text: environments.remedios3,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Select a project to owe",
        },
        accessory: {
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Select an item",
          },
          options: [
            {
              text: {
                type: "plain_text",
                text: "HelpInApp",
              },
              value: "help3",
            },
            {
              text: {
                type: "plain_text",
                text: "Remedios",
              },
              value: "remedios3",
            },
          ],
          action_id: "select-support-3",
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*Support-4*",
          },
          {
            type: "mrkdwn",
            text: "*Owner:*",
          },
          {
            type: "mrkdwn",
            text: "HelpInApp:",
          },
          {
            type: "mrkdwn",
            text: environments.help4,
          },
          {
            type: "mrkdwn",
            text: "Remedios:",
          },
          {
            type: "mrkdwn",
            text: environments.remedios4,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Select a project to owe",
        },
        accessory: {
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Select an item",
          },
          options: [
            {
              text: {
                type: "plain_text",
                text: "HelpInApp",
              },
              value: "help4",
            },
            {
              text: {
                type: "plain_text",
                text: "Remedios4",
              },
              value: "remedios4",
            },
          ],
          action_id: "select-support-4",
        },
      },
    ],
  };
};

// Listens to incoming messages that contain "hello"
app.message("start", async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say(section());
});

const changeName = (project, name) => {
  console.log("Project: " + project);
  
  for (project in environments) {
    if (environments.hasOwnProperty(project)) {
      environments[project] = name;
    }
  }
};

app.action("select-support-3", async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();

  let project = body.actions[0].selected_option.value;

  changeName(project, body.user.name);
  await say(section());
});

(async () => {
  // Start your app
  let port = process.env.PORT;
  if (port == null || port == "") {
    port = 8000;
  }

  await app.start(port);

  console.log("⚡️ Bolt app is running!");
})();
