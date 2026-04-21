const exclude = (user, keys) => {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key)),
  );
};
export default exclude;
