const { App } = require("@slack/bolt");

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

let environments = {};

const restartEnviroments = () => {
  environments = {
    help3: ["empty"],
    remedios3: ["empty"],
    help4: ["empty"],
    remedios4: ["francis", "bea"],
  };
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
        type: "actions",
        elements: [
          {
            type: "button",
            action_id: "help3",
            text: {
              type: "plain_text",
              emoji: true,
              text: "HelpInApp",
            },
            style: "primary",
            value: "add-queue",
          },
          {
            type: "button",
            action_id: "remedios3",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Remedios",
            },
            style: "primary",
            value: "add-queue",
          },
        ],
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            action_id: "help3",
            text: {
              type: "plain_text",
              emoji: true,
              text: "HelpInApp",
            },
            style: "danger",
            value: "leave-queue",
          },
          {
            type: "button",
            action_id: "remedios3",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Remedios",
            },
            style: "danger",
            value: "leave-queue",
          },
        ],
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
        type: "actions",
        elements: [
          {
            type: "button",
            action_id: "help4",
            text: {
              type: "plain_text",
              emoji: true,
              text: "HelpInApp",
            },
            style: "primary",
            value: "add-queue",
          },
          {
            type: "button",
            action_id: "remedios4",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Remedios",
            },
            style: "primary",
            value: "add-queue",
          },
        ],
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            action_id: "help4",
            text: {
              type: "plain_text",
              emoji: true,
              text: "HelpInApp",
            },
            style: "danger",
            value: "leave-queue",
          },
          {
            type: "button",
            action_id: "remedios4",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Remedios",
            },
            style: "danger",
            value: "leave-queue",
          },
        ],
      },
    ],
  };
};

// Listens to incoming messages that contain "hello"
app.message("start", async ({ message, say }) => {
  restartEnviroments();
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
    changed = true;
  } else if (
    environments.hasOwnProperty(project) &&
    !environments[project].includes(name)
  ) {
    environments[project].push(name);
    changed = true;
  }
};

const removeName = (project, name) => {
  if (environments.hasOwnProperty(project)) {
    let newArray = environments[project].filter((n) => {
      return n != name;
    });

    if (newArray.length < 1) {
      environments[project].shift();
      environments[project].push("empty");
      changed = true;
    } else if (environments[project].length != newArray.length) {
      environments[project] = newArray;
      changed = true;
    }
  }
};

app.action("add-queue", async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();

  let project = body.action_id;

  changeName(project, body.user.name);

  if (changed) {
    changed = false;
    await say(section());
  }
});

app.action("leave-queue", async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();

  let project = body.action_id;

  removeName(project, body.user.name);

  if (changed) {
    changed = false;
    await say(section());
  }
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
