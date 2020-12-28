const { App } = require("@slack/bolt");

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

let environments = {
  help3: ["empty"],
  remedios3: ["francis", "rebeca"],
  help4: ["empty"],
  remedios4: ["empty"],
};

let changed = false;

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
            text: "*Queue:*",
          },
          {
            type: "mrkdwn",
            text: "HelpInApp:",
          },
          {
            type: "mrkdwn",
            text: environments.help3.join(" | "),
          },
          {
            type: "mrkdwn",
            text: "Remedios:",
          },
          {
            type: "mrkdwn",
            text: environments.remedios3.join(" | "),
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
          action_id: "select-support",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Leave Queue",
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
          action_id: "leave-queue",
        },
      },
      {
        type: "divider",
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
            text: "*Queue:*",
          },
          {
            type: "mrkdwn",
            text: "HelpInApp:",
          },
          {
            type: "mrkdwn",
            text: environments.help4.join(" | "),
          },
          {
            type: "mrkdwn",
            text: "Remedios:",
          },
          {
            type: "mrkdwn",
            text: environments.remedios4.join(" | "),
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
          action_id: "select-support",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Leave Queue",
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
          action_id: "leave-queue",
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
  if (
    environments.hasOwnProperty(project) &&
    environments[project][0] == "empty"
  ) {
    environments[project].shift();
    environments[project].push(name);
    console.log(environments);
    changed = true;
  } else if (
    environments.hasOwnProperty(project) &&
    !environments[project].includes(name)
  ) {
    environments[project].push(name);
    console.log(environments);
    changed = true;
  }
};

app.action("select-support", async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();

  let project = body.actions[0].selected_option.value;

  changeName(project, body.user.name);

  if (changed) {
    changed = false;
    await say(section());
  }
});

app.action("leave-queue", async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say("Pushed leave queue");
});

(async () => {
  // Start your app
  let port = process.env.PORT;
  if (port == null || port == "") {
    port = 8000;
  }

  await app.start(port);

  console.log("Envirobot app is running!");
})();
