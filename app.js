const { App } = require("@slack/bolt");

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

let environments = {};

let changed = false;

const restartEnviroments = () => {
  environments = {
    help3: ["empty"],
    remedios3: ["empty"],
    help4: ["empty"],
    remedios4: ["empty"],
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
        ],
      },
      {
        type: "actions",
        block_id: "add-queue-3",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "HelpInApp",
            },
            style: "primary",
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
            value: "remedios3",
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
        block_id: "add-queue-4",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "HelpInApp",
            },
            style: "primary",
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
      environments[project].shift()
      environments[project].push("empty");
      changed = true;
    } else if (environments[project].length != newArray.length) {
      environments[project] = newArray;
      changed = true;
    }
  }
};


const ws = new WorkflowStep('add_task', {
  edit: async ({ ack, step, configure }) => {
    await ack();

    const blocks = [
      {
        type: 'input',
        block_id: 'task_name_input',
        element: {
          type: 'plain_text_input',
          action_id: 'name',
          placeholder: {
            type: 'plain_text',
            text: 'Add a task name',
          },
        },
        label: {
          type: 'plain_text',
          text: 'Task name',
        },
      },
      {
        type: 'input',
        block_id: 'task_description_input',
        element: {
          type: 'plain_text_input',
          action_id: 'description',
          placeholder: {
            type: 'plain_text',
            text: 'Add a task description',
          },
        },
        label: {
          type: 'plain_text',
          text: 'Task description',
        },
      },
    ];

    await configure({ blocks });
  },
  save: async ({ ack, step, update }) => {},
  execute: async ({ step, complete, fail }) => {},
});

// Listens to incoming messages that contain "hello"
app.message("start", async ({ message, say }) => {
  restartEnviroments();
  // say() sends a message to the channel where the event was triggered
  await say(section());
});

app.action({ block_id: "add-queue-3" }, async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();

  let project = body.actions[0].value;

  changeName(project, body.user.name);

  if (changed) {
    changed = false;
    await say(section());
  }
  app.step(ws);
});

app.action({ block_id: "add-queue-4" }, async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();

  let project = body.actions[0].value;

  changeName(project, body.user.name);

  if (changed) {
    changed = false;
    await say(section());
  }
});

app.action({ block_id: "leave-queue-3" }, async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();

  let project = body.actions[0].value;

  removeName(project, body.user.name);

  if (changed) {
    changed = false;
    await say(section());
  }
});

app.action({ block_id: "leave-queue-4" }, async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();

  let project = body.actions[0].value;

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
