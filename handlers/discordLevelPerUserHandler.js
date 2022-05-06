import store from "store";

const handleDiscordLevelPerUser = async (user) => {
  const callData = store.get("discordLevels");
  if (callData) {
    let foundUsername;
    callData.map((element) => {
      const result = element.filter(
        (callDataFilter) =>
          callDataFilter.username.toLowerCase() === user.toLowerCase()
      );
      if (result.length >= 1) {
        foundUsername = result;
      }
    });
    return foundUsername;
  }
};

export default handleDiscordLevelPerUser;
