const { handleMenuOption } = require("./chat");

const Message = async (client, msg) => {
  const from = msg.from;

  try {
    await handleMenuOption(client, msg, from);
  } catch (error) {
    console.error(error);
    return error;
  }
};

exports.Message = Message;
