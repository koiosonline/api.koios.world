import axios from "axios";
import store from "store";

const fetchDiscordLevels = async () => {
  const guildId = process.env.GUILD_ID;
  const pages = 7;
  const totalData = [];

  for (let i = 0; i <= pages; i++) {
    const url = `https://mee6.xyz/api/plugins/levels/leaderboard/${guildId}?page=${i}`;
    await axios.get(url).then((res) => {
      const data = res.data.players;
      totalData.push(data);
      if (i === 7) {
        store.set("discordLevels", totalData);
      }
      return;
    });
  }
};

export default fetchDiscordLevels;
