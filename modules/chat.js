const axios = require("axios");
const constant = require("../utils/constant");
const { encyptDataAES256Cbc } = require("../utils/crypsi");
require("dotenv").config();

const { API_URL } = process.env;

async function handleMenuOption(client, msg, from, split_message) {
  const menu = ["1", "2", "3", "4", "5", "6"];

  const phoneNumber = from.split("@")[0];

  if (msg.body == "1") {
    handleOption1(client, from, msg, phoneNumber);
  } else if (msg.body == "2") {
    handleOption2(client, from, msg, phoneNumber);
  } else if (msg.body == "3") {
    handleOption3(client, from, msg, phoneNumber);
  } else if (msg.body == "4") {
    handleOption4(client, from);
  } else if (msg.body == "5") {
    handleOption5(client, from, msg, phoneNumber);
  } else if (msg.body == "6") {
    handleOption6(client, from, msg);
  } else if (split_message.length > 1) {
    return;
  } else if (!menu.includes(msg.body)) {
    handleDefaultMenu(client, from, msg);
  }
}

async function handleOption1(client, from, msg, phoneNumber) {
  try {
    const response = await axios.get(`${API_URL}/schedules?date=today`, {
      headers: {
        phone: `${encyptDataAES256Cbc(phoneNumber)}`,
      },
    });

    const datas = response.data.data;

    const formattedData = datas.map((item, index) => {
      let no = index + 1;
      let text =
        `*${no}. ${item.nm_mk}*\n` +
        `    Tanggal: ${item.tgl_awal}\n` +
        `    Waktu: ${item.jam_awal} - ${item.jam_akhir}\n` +
        `    Ruang: ${item.ruang}\n` +
        `    Keterangan: ${item.ket_perkuliahan}\n`;

      if (item.link) {
        text += `    Link: ${item.link}\n`;
      }

      if (item.passcode) {
        text += `    Code: ${item.passcode}\n`;
      }

      return text;
    });

    const responseData = `*Jadwal Kuliah Hari Ini* 📚\n\n${formattedData.join("\n")}`;
    // console.log(responseData);
    await client.reply(from, `${responseData}`, msg.id.toString());
    return;
  } catch (error) {
    // console.info(error.response.data);
    if (axios.isAxiosError(error)) {
      await client.reply(from, `${error.response.data.message}`, msg.id.toString());
    } else {
      console.log(error.message);
    }
    return error;
  }
}

async function handleOption2(client, from, msg, phoneNumber) {
  try {
    const response = await axios.get(`${API_URL}/schedules?date=weekly`, {
      headers: {
        phone: `${encyptDataAES256Cbc(phoneNumber)}`,
      },
    });

    const datas = response.data.data;

    const formattedData = datas.map((item, index) => {
      let no = index + 1;
      let text =
        `*${no}. ${item.nm_mk}*\n` +
        `    Tanggal: ${item.tgl_awal}\n` +
        `    Waktu: ${item.jam_awal} - ${item.jam_akhir}\n` +
        `    Ruang: ${item.ruang}\n` +
        `    Keterangan: ${item.ket_perkuliahan}\n`;

      if (item.link) {
        text += `    Link: ${item.link}\n`;
      }

      if (item.passcode) {
        text += `    Code: ${item.passcode}\n`;
      }

      return text;
    });

    const responseData = `*Jadwal Kuliah Minggu Ini* 📚🗒\n\n${formattedData.join("\n")}`;
    // console.log(responseData);
    await client.reply(from, `${responseData}`, msg.id.toString());
    return;
  } catch (error) {
    // console.info(error.response.data);
    if (axios.isAxiosError(error)) {
      await client.reply(from, `${error.response.data.message}`, msg.id.toString());
    } else {
      console.log(error.message);
    }
    return error;
  }
}

async function handleOption3(client, from, msg, phoneNumber) {
  try {
    const response = await axios.get(`${API_URL}/courses/ipk`, {
      headers: {
        phone: `${encyptDataAES256Cbc(phoneNumber)}`,
      },
    });

    const datas = response.data.data;
    // console.log(response.data);

    const responseData = `*Indeks Prestasi Kumulatif* 📊\n\n───────────────\n*Total SKS :* ${datas.SKS}\n*Nilai          :* ${datas.IPK} / 4.0\n───────────────`;
    // console.log(responseData);
    await client.reply(from, `${responseData}`, msg.id.toString());
    return;
  } catch (error) {
    // console.info(error.response.data);
    if (axios.isAxiosError(error)) {
      await client.reply(from, `${error.response.data.message}`, msg.id.toString());
    } else {
      console.log(error.message);
    }
    return error;
  }
}

async function handleOption4(client, from) {
  try {
    const kampusLatitude = "-7.4393462"; // koordinat lintang
    const kampusLongitude = "109.2663856"; // koordinat bujur
    const location = {
      latitude: kampusLatitude,
      longitude: kampusLongitude,
      name: "STMIK Widya Utama",
    };
    await client.sendLocation(from, location.latitude, location.longitude, location.name);
    await client.reply(from, "Lokasi Kampus STMIK Widya Utama");
    console.log("Location sent success!");
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function handleOption5(client, from, msg, phoneNumber) {
  try {
    const response = await axios.get(`${API_URL}/courses/grades?type=all`, {
      headers: {
        phone: `${encyptDataAES256Cbc(phoneNumber)}`,
      },
    });

    const datas = response.data.data;
    // console.log(response.data);
    const formattedData = datas.map((item, index) => {
      return `*${index + 1}. ${item.nm_mk}*\n` + `Nilai: ${item.NILAI}\n`;
    });
    const responseData = formattedData.join("\n");
    await client.reply(from, `${responseData}`, msg.id.toString());
    return;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      await client.reply(from, `${error.response.data.message}`, msg.id.toString());
    } else {
      console.log(error.message);
    }
    return error;
  }
}

async function handleOption6(client, from, msg) {
  await client.reply(
    from,
    `Mohon maaf atas kendala yang terjadi, Anda dapat melaporkan kendala tersebut kepada admin kami melalui wa.me/62895360759393`,
    msg.id.toString()
  );
}

async function handleDefaultMenu(client, from, msg) {
  await client.reply(from, constant.menuDefault, msg.id.toString());
}

module.exports = {
  handleMenuOption,
};
