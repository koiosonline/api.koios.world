import store from "store";

const handleDiscordLevel = async () => {
  const callData = store.get("discordLevels");
  if (callData) {
    return await callData;
  }
};

export default handleDiscordLevel;
