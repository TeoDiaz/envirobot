const { App } = require("@slack/bolt");
const { WebClient } = require("@slack/web-api");

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const token = process.env.SLACK_BOT_TOKEN;

const web = new WebClient(token);

let environments = {};
let users = {};

let changed = false;

let timeouts = {};

let intervalTime = 7200000;

const restartEnviroments = () => {
  environments = {
    help3: [":tumbleweed:"],
    remedios3: [":tumbleweed:"],
    tagger3: [":tumbleweed:"],
    widget3: [":tumbleweed:"],
    help4: [":tumbleweed:"],
    remedios4: [":tumbleweed:"],
  };
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
          {
            type: "mrkdwn",
            text: "Zendesk-tagger:",
          },
          {
            type: "mrkdwn",
            text: environments.tagger3.join(" | "),
          },
          {
            type: "mrkdwn",
            text: "Zendesk-widget:",
          },
          {
            type: "mrkdwn",
            text: environments.widget3.join(" | "),
          },
        ],
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "HelpInApp",
            },
            style: "primary",
            action_id: "add-queue-help3",
            value: "help3",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Remedios",
            },
            style: "primary",
            action_id: "add-queue-remedios3",
            value: "remedios3",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Zendesk-tagger",
            },
            style: "primary",
            action_id: "add-queue-tagger3",
            value: "tagger3",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Zendesk-widget",
            },
            style: "primary",
            action_id: "add-queue-widget3",
            value: "widget3",
          },
        ],
      },
      {
        type: "actions",
        block_id: "leave-queue-3",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "HelpInApp",
            },
            style: "danger",
            value: "help3",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Remedios",
            },
            style: "danger",
            value: "remedios3",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Zendesk-tagger",
            },
            style: "danger",
            value: "tagger3",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Zendesk-widget",
            },
            style: "danger",
            value: "widget3",
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
            text: {
              type: "plain_text",
              emoji: true,
              text: "HelpInApp",
            },
            style: "primary",
            action_id: "add-queue-help4",
            value: "help4",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Remedios",
            },
            style: "primary",
            action_id: "add-queue-remedios4",
            value: "remedios4",
          },
        ],
      },
      {
        type: "actions",
        block_id: "leave-queue-4",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "HelpInApp",
            },
            style: "danger",
            value: "help4",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Remedios",
            },
            style: "danger",
            value: "remedios4",
          },
        ],
      },
    ],
  };
};

const addUser = (project, user) => {
  users[user.id] = user;

  if (
    environments.hasOwnProperty(project) &&
    environments[project][0] == ":tumbleweed:"
  ) {
    environments[project].shift();
    environments[project].push(user.name);
    changed = true;
  } else if (
    environments.hasOwnProperty(project) &&
    !environments[project].includes(user.name)
  ) {
    environments[project].push(user.name);
    changed = true;
  }
};

const removeUser = (project, name) => {
  if (environments.hasOwnProperty(project)) {
    let newArray = environments[project].filter((n) => {
      return n != name;
    });

    if (newArray.length < 1) {
      environments[project].shift();
      environments[project].push(":tumbleweed:");
      changed = true;
    } else if (environments[project].length != newArray.length) {
      environments[project] = newArray;
      changed = true;
    }
  }
};

const sendMessage = async (message) => {
  await web.chat
    .postMessage({
      text: message.text,
      channel: message.channel,
      as_user: true,
    })
    .catch((err) => console.log(err));
};

const startTimeout = (project, body) => {
  if (body.user.name == environments[project][0]) {
    user_name = environments[project][0];
    let user_id;

    Object.values(users).some((key) => {
      if (key["name"] == user_name) {
        user_id = key.id;
      }
    });

    let timeout = setTimeout(function () {
      let message = {
        text: `Hey! <@${user_id}>! Are you still using the environment?`,
        channel: body.channel.id,
      };
      sendMessage(message);
    }, intervalTime);

    timeouts[project] = { user: body.user.name, time: timeout };
  }
};

const stopTimeout = (project, name) => {
  if (name == environments[project][0]) {
    if (timeouts[project].user == name) {
      clearInterval(timeouts[project].time);
    }
  }
};

// Listens to incoming messages that contain "hello"
app.message("start envirobot", async ({ message, say }) => {
  restartEnviroments();

  // say() sends a message to the channel where the event was triggered
  await say(section());
});

app.action({ action_id: "add-queue-help3" }, async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();

  let project = body.actions[0].value;

  addUser(project, body.user);

  if (changed) {
    changed = false;
    startTimeout(project, body);

    await say(section());
  }
});

app.action({ action_id: "add-queue-remedios3" }, async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();

  let project = body.actions[0].value;

  addUser(project, body.user);

  if (changed) {
    changed = false;
    startTimeout(project, body);

    await say(section());
  }
});

app.action({ action_id: "add-queue-tagger3" }, async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();

  let project = body.actions[0].value;

  addUser(project, body.user);

  if (changed) {
    changed = false;
    startTimeout(project, body);

    await say(section());
  }
});

app.action({ action_id: "add-queue-widget3" }, async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();

  let project = body.actions[0].value;

  addUser(project, body.user);

  if (changed) {
    changed = false;
    startTimeout(project, body);

    await say(section());
  }
});

app.action({ action_id: "add-queue-help4" }, async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();

  let project = body.actions[0].value;

  addUser(project, body.user);

  if (changed) {
    changed = false;
    startTimeout(project, body);

    await say(section());
  }
});

app.action({ action_id: "add-queue-remedios4" }, async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();

  let project = body.actions[0].value;

  addUser(project, body.user);

  if (changed) {
    changed = false;
    startTimeout(project, body);

    await say(section());
  }
});

app.action({ block_id: "leave-queue-3" }, async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();

  let project = body.actions[0].value;

  removeUser(project, body.user.name);

  stopTimeout(project, body.user.name);

  if (changed) {
    changed = false;
    await say(section());
  }
});

app.action({ block_id: "leave-queue-4" }, async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();

  let project = body.actions[0].value;

  removeUser(project, body.user.name);

  stopTimeout(project, body.user.name);

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
