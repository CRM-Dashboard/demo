const setAllProjects = (allProjects) => {
  return {
    type: "ALL_PROJECTS",
    payload: allProjects,
  };
};

const exportDefault = {
  setAllProjects,
};

export default exportDefault;
