const { App } = require("@slack/bolt");

// Initializes your app with your bot token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});


let help3 = "teo.diaz"
let remedios3 = "francis.perez"

// Listens to incoming messages that contain "hello"
app.message("start", async({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say({
        blocks: [{
                type: "header",
                text: {
                    type: "plain_text",
                    text: "Environments Queue",
                    emoji: true,
                },
            },
            {
                type: "section",
                fields: [{
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
                        text: help3,
                    },
                    {
                        type: "mrkdwn",
                        text: "Remedios:",
                    },
                    {
                        type: "mrkdwn",
                        text: remedios3,
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
                        emoji: true,
                    },
                    options: [{
                            text: {
                                type: "plain_text",
                                text: "*this is plain_text text*",
                                emoji: true,
                            },
                            value: "value-0",
                        },
                        {
                            text: {
                                type: "plain_text",
                                text: "*this is plain_text text*",
                                emoji: true,
                            },
                            value: "value-1",
                        },
                        {
                            text: {
                                type: "plain_text",
                                text: "*this is plain_text text*",
                                emoji: true,
                            },
                            value: "value-2",
                        },
                    ],
                    action_id: "static_select-action",
                },
            },
            {
                type: "section",
                fields: [{
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
                        text: "teo.diaz",
                    },
                    {
                        type: "mrkdwn",
                        text: "Remedios:",
                    },
                    {
                        type: "mrkdwn",
                        text: "francis.perez",
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
                        emoji: true,
                    },
                    options: [{
                            text: {
                                type: "plain_text",
                                text: "*this is plain_text text*",
                                emoji: true,
                            },
                            value: "value-0",
                        },
                        {
                            text: {
                                type: "plain_text",
                                text: "*this is plain_text text*",
                                emoji: true,
                            },
                            value: "value-1",
                        },
                        {
                            text: {
                                type: "plain_text",
                                text: "*this is plain_text text*",
                                emoji: true,
                            },
                            value: "value-2",
                        },
                    ],
                    action_id: "static_select-action",
                },
            },
        ],
    });
});

app.action("button_click", async({ body, ack, say }) => {
    // Acknowledge the action
    await ack();
    await say(`<@${body.user.id}> clicked the button`);
});

(async() => {
    // Start your app
    let port = process.env.PORT;
    if (port == null || port == "") {
        port = 8000;
    }

    await app.start(port);

    console.log("⚡️ Bolt app is running!");
})();