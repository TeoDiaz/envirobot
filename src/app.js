const { App } = require("@slack/bolt");
const { WebClient } = require("@slack/web-api");

var express = require("express");
var router = express();

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
    help5: [":tumbleweed:"],
    remedios5: [":tumbleweed:"],
    tagger5: [":tumbleweed:"],
    widget5: [":tumbleweed:"],
    help6: [":tumbleweed:"],
    remedios6: [":tumbleweed:"],
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
            text: "*Support-5*",
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
            text: environments.help5.join(" | "),
          },
          {
            type: "mrkdwn",
            text: "Remedios:",
          },
          {
            type: "mrkdwn",
            text: environments.remedios5.join(" | "),
          },
          {
            type: "mrkdwn",
            text: "Zendesk-tagger:",
          },
          {
            type: "mrkdwn",
            text: environments.tagger5.join(" | "),
          },
          {
            type: "mrkdwn",
            text: "Zendesk-widget:",
          },
          {
            type: "mrkdwn",
            text: environments.widget5.join(" | "),
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
            action_id: "add-queue-help5",
            value: "help5",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Remedios",
            },
            style: "primary",
            action_id: "add-queue-remedios5",
            value: "remedios5",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Zendesk-tagger",
            },
            style: "primary",
            action_id: "add-queue-tagger5",
            value: "tagger5",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Zendesk-widget",
            },
            style: "primary",
            action_id: "add-queue-widget5",
            value: "widget5",
          },
        ],
      },
      {
        type: "actions",
        block_id: "leave-queue-5",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "HelpInApp",
            },
            style: "danger",
            value: "help5",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Remedios",
            },
            style: "danger",
            value: "remedios5",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Zendesk-tagger",
            },
            style: "danger",
            value: "tagger5",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Zendesk-widget",
            },
            style: "danger",
            value: "widget5",
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
            text: "*Support-6*",
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
            text: environments.help6.join(" | "),
          },
          {
            type: "mrkdwn",
            text: "Remedios:",
          },
          {
            type: "mrkdwn",
            text: environments.remedios6.join(" | "),
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
            action_id: "add-queue-help6",
            value: "help6",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Remedios",
            },
            style: "primary",
            action_id: "add-queue-remedios6",
            value: "remedios6",
          },
        ],
      },
      {
        type: "actions",
        block_id: "leave-queue-6",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "HelpInApp",
            },
            style: "danger",
            value: "help6",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Remedios",
            },
            style: "danger",
            value: "remedios6",
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

    console.log(`setTimeout for ${body.user.name} in ${project}`);

    timeouts[project] = { user: body.user.name, time: timeout };
  }
};

const stopTimeout = (project, name) => {
  if (name == environments[project][0]) {
    if (timeouts[project].user == name) {
      console.log(`ClearTimeout for ${name} in ${project}`);

      clearTimeout(timeouts[project].time);
    }
  }
};

// Listens to incoming messages that contain "hello"
app.message("hello", async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say(`Hey there <@${message.user}>!`);
});

app.message("start envirobot", async ({ say }) => {
  console.log("Received message: start envirobot");

  restartEnviroments();

  await say(section());
});

app.action(
  { action_id: "add-queue-help5" },
  async ({ body, ack, respond, say }) => {
    console.log(`${body.user.name} Adding to queue for HelpInApp in Support-5`);

    await ack();

    let project = body.actions[0].value;

    addUser(project, body.user);

    if (changed) {
      changed = false;
      startTimeout(project, body);

      await respond({ delete_original: true });
      await say(section());
    }
  }
);

app.action(
  { action_id: "add-queue-remedios5" },
  async ({ body, ack, respond, say }) => {
    console.log(`${body.user.name} Adding to queue for Remedios in Support-5`);

    await ack();

    let project = body.actions[0].value;

    addUser(project, body.user);

    if (changed) {
      changed = false;
      startTimeout(project, body);

      await respond({ delete_original: true });
      await say(section());
    }
  }
);

app.action(
  { action_id: "add-queue-tagger5" },
  async ({ body, ack, respond, say }) => {
    console.log(
      `${body.user.name} Adding to queue for Zendesk-tagger in Support-5`
    );

    await ack();

    let project = body.actions[0].value;

    addUser(project, body.user);

    if (changed) {
      changed = false;
      startTimeout(project, body);

      await respond({ delete_original: true });
      await say(section());
    }
  }
);

app.action(
  { action_id: "add-queue-widget5" },
  async ({ body, ack, respond, say }) => {
    console.log(`${body.user.name} Adding to queue for Widget in Support-5`);

    await ack();

    let project = body.actions[0].value;

    addUser(project, body.user);

    if (changed) {
      changed = false;
      startTimeout(project, body);

      await respond({ delete_original: true });
      await say(section());
    }
  }
);

app.action(
  { action_id: "add-queue-help6" },
  async ({ body, ack, respond, say }) => {
    console.log(`${body.user.name} Adding to queue for HelpInApp in Support-6`);

    await ack();

    let project = body.actions[0].value;

    addUser(project, body.user);

    if (changed) {
      changed = false;
      startTimeout(project, body);

      await respond({ delete_original: true });
      await say(section());
    }
  }
);

app.action(
  { action_id: "add-queue-remedios6" },
  async ({ body, ack, respond, say }) => {
    console.log(`${body.user.name} Adding to queue for Remedios in Support-6`);

    await ack();

    let project = body.actions[0].value;

    addUser(project, body.user);

    if (changed) {
      changed = false;
      startTimeout(project, body);

      await respond({ delete_original: true });
      await say(section());
    }
  }
);

app.action(
  { block_id: "leave-queue-5" },
  async ({ body, ack, respond, say }) => {
    console.log(`${body.user.name} leaving queue Support-5`);

    await ack();

    let project = body.actions[0].value;

    stopTimeout(project, body.user.name);

    removeUser(project, body.user.name);

    if (changed) {
      changed = false;

      await respond({ delete_original: true });
      await say(section());
    }
  }
);

app.action(
  { block_id: "leave-queue-6" },
  async ({ body, ack, respond, say }) => {
    console.log(`${body.user.name} leaving queue Support-6`);

    await ack();

    let project = body.actions[0].value;

    stopTimeout(project, body.user.name);

    removeUser(project, body.user.name);

    if (changed) {
      changed = false;

      await respond({ delete_original: true });
      await say(section());
    }
  }
);

app.error(async (error) => {
  // Check the details of the error to handle cases where you should retry sending a message or stop the app
  console.error(error);
});

router.post("/", function (req, res, next) {
  console.log("Request challenge");

  res.status(200).send(req.body.challenge);
});

(async () => {
  // Start your app
  let port = process.env.PORT;
  if (port == null || port == "") {
    port = 8080;
  }

  await app.start(port);

  console.log(`Envirobot app is running on port: ${port}!`);
})();
