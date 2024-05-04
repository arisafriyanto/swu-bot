const { handleMenuOption } = require("./chat");

const Message = async (client, msg) => {
  const from = msg.from;
  const message = msg.body;
  const split_message = message.split(" ");

  try {
    await handleMenuOption(client, msg, from, split_message);
  } catch (error) {
    console.error(error);
    return error;
  }
};

exports.Message = Message;
