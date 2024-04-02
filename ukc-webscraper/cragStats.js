const axios = require("axios").default;

(async () => {
  try {
    const crags = await axios.get("http://localhost:3000/getAll");
    for (let crag of crags.data) {
      await axios.post("http://localhost:3000/addCragStats", { cragID: crag.cragID });
    }

  } catch (err) {
    console.error("Error in main block:", err);
  }
})();

