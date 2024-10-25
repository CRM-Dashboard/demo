export const setSelectedDrawing = (drawing) => {
  return {
    type: "SELECTEDDRAWING",
    payload: drawing,
  };
};
