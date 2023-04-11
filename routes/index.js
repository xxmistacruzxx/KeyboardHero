import mainRoutes from "./main.js";

const constructorMethod = (app) => {
  app.use("/", mainRoutes);

  app.use("*", (req, res) => {
    res.redirect("/");
  });
};

export default constructorMethod;
